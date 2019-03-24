from django.views.generic import TemplateView
from django.urls import reverse

from apps.utils.views import RequestUtilsMixin
from apps.utils.textos import textos


class RelatorioView(TemplateView, RequestUtilsMixin):
    ''' View de Relatórios.
    Adiciona as funcionalidades para geração dos relatórios.
    nota: matar o MenuView quando terminar de passar o RH pro GCAx
    '''
    app = 'relatorios'
    codigo = '0000'
    descricao = ""
    filename = "arquivo"
    sem_relatorio_msg = textos.get('sem_registros_relatorio')
    tipo_impressao_on = True
    ordenar_por_on = True
    quebra_por_on = True
    template_base_relatorios = 'admin/relatorios/base.html'

    @property
    def titulo(self):
        return textos.get('relatorio_{}'.format(self.codigo))

    @property
    def n_serie(self):
        return 'rpt{}'.format(self.codigo)

    @property
    def permissao(self):
        return 'rpt{}'.format(self.codigo)

    @property
    def template_name(self):
        return 'admin/{}/relatorios/rpt{}.html'.format(
            self.app, self.codigo
        )

    TIPO_PDF = 'pdf'
    TIPO_PDF_LBL = textos.get('pdf')
    TIPO_XLS = 'xls'
    TIPO_XLS_LBL = textos.get('excel')
    TIPO_RTF = 'rtf'
    TIPO_RTF_LBL = textos.get('word')
    TIPO_IMPRESSAO = [
        (TIPO_PDF, TIPO_PDF_LBL),
        (TIPO_XLS, TIPO_XLS_LBL),
    ]

    TIPO_IMPRESSAO_PDFWORD = [
        (TIPO_PDF, TIPO_PDF_LBL),
        (TIPO_RTF, TIPO_RTF_LBL),
    ]

    TIPO_IMPRESSAO_COMPLETO = [
        (TIPO_PDF, TIPO_PDF_LBL),
        (TIPO_XLS, TIPO_XLS_LBL),
        (TIPO_RTF, TIPO_RTF_LBL),
    ]

    def gerar_parametros_relatorio(self):
        ''' Sobreescrever para adicionar os parâmetros no contexto e enviar
        para a geração de relatório
        '''
        return {}

    def gerar_context_especifico(self, context):
        ''' Sobreescrever para adicionar os parâmetros no contexto da Tela
        de Geração do Relatório
        '''
        return context

    def make_dados_data(self,  dados, key):
        """
            Converte uma string com uma data do formato brasileiro (24/04/1991) para
            uma string com essas mesma data no formato do banco (1991-04-24).
        """
        data = dados.get(key)
        if not data:
            return data
        return '-'.join(data.split('/')[::-1])

    def make_dados_select(self, dados, key, apply_unaccent=False):
        ''' Pega a lista de dados e tranforma em uma lista para ser utilizada
        em IN de SQL
        '''
        lista = dados.getlist(key)
        lista = list(filter(bool, lista))

        if not lista:
            lista = dados.get(key)
            if lista:
                lista = list(filter(bool, lista))
            else:
                lista = []

        if not apply_unaccent:
            lista = list(map(str, lista))
        else:
            lista = list(map(lambda dado: "unaccent('%s')" % dado.replace("'","''"), lista))

        if '' in lista:
            lista.remove('') ## isso significa que foi selecionado tudo, ou seja, nada
            return ''

        if list(set(lista)):
            return '(%s)' % ','.join(list(set(lista)) )
        return ''

    def get_context_data(self, **kwargs):
        context = super(RelatorioView, self).get_context_data(**kwargs)

        context['titulo'] = self.titulo
        context['descricao'] = self.descricao
        context['sem_relatorio_msg'] = self.sem_relatorio_msg
        context['template_base_relatorios'] = self.template_base_relatorios

        context['url_clientes'] = reverse("cliente.autocompletes.clientes")
        context['url_vagas'] = reverse("vaga.autocompletes.vagas")
        context['url_candidatos'] = reverse("candidato.autocompletes.candidatos")

        try:
            context = self.gerar_context(context)
        except Exception as msg:
            print("msg: ", msg)
            pass

        if hasattr(self, 'quebra_por') and self.quebra_por_on:
            context['quebra_por'] = self.quebra_por

        if hasattr(self, 'ordenar_por') and self.ordenar_por_on:
            context['ordenar_por'] = self.ordenar_por

        if hasattr(self, 'TIPO_IMPRESSAO') and self.tipo_impressao_on:
            context['tipo_impressao'] = self.TIPO_IMPRESSAO

        return context

    def get_select_request(self, chave, funcao_default=None):
        ''' Retorna os dados de um select prontos em formato de colcoar em IN
        de SQL
        '''
        dados = self.get_list_by_request(
            chave,
            default= funcao_default() if funcao_default else ''
        )
        if dados:
            dados = filter(None, dados)
            dados = self.make_dados_select(dados)
        return dados

    def post(self, *args, **kwargs):
        contexto = self.gerar_parametros_relatorio()
        #print("contexto: ", contexto)
        contexto['ID_USUARIO'] = self.request.user.id
        contexto['USUARIO'] = self.request.user.id
        contexto['TIPO_IMPRESSAO'] = self.get_by_request(
            'tipo_impressao',
            default=self.TIPO_PDF
        )

        from apps.utils.relatorios.gerador import GerarRelatorio
        relatorio = GerarRelatorio(
            self.codigo,
            contexto,
            self.titulo,
            self.request
        )

        filtros = ""
        for titulo, valor in self.request.POST.items():
            if titulo != u'csrfmiddlewaretoken':
                filtros += ", " if filtros else ""
                filtros += ('%s:%s' % (titulo, valor))

        from apps.log.models import Log
        Log.log_processo(
            self.request,
            self.titulo,
            obs = textos.get('relatorios_log').format(filtros)
        )
        return relatorio.json_response()
