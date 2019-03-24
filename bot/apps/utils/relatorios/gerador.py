import chardet
import urllib
import ujson as json

from django.conf import settings
from django.http import HttpResponse
from django.db.models import Model


class GerarRelatorio(object):
    ''' Gerador de Relatórios
    - Utilização:
        relatorio = GerarRelatorio(codigo, dados, titulo, request)
        return relatorio.json_response()
    - Retorna um HttpResponse com o formato de json
    '''
    server_url = 'Rpt_spa'

    def _get_servlet(self):
        return self._servlet

    def _set_servlet(self, num):
        self._servlet = 'SPA{}'.format(num)

    servlet = property(_get_servlet, _set_servlet)

    @property
    def user(self):
        return self.request.user

    def get_endereco_servidor(self):
        ''' Monta o prefixo do link dos relatórios
        '''
        host = self.request.get_host().split(':')[0]

        if settings.DEBUG:
            host += ':8080'

        if not host.startswith('http'):
            prefix = 'https://' if self.request.is_secure() else 'http://'
            host = prefix + host
        return host

    def get_url(self):
        ''' Monta o link completo dos relatórios
        '''
        return '{}/{}/{}'.format(
            self.get_endereco_servidor(),
            self.server_url,
            self.servlet
        )

    def get_url_arquivo(self, arquivo):
        return '{}{}/{}/tmp/{}'.format(
            self.get_endereco_servidor(),
            '' if not settings.DEBUG else ':8080',
            self.server_url,
            arquivo
        )

    def convert_sql(self, simbolo):
        ''' Converte caracteres especiais para o select no banco '''
        simbolo = self.convert_esp(simbolo)
        simbolo = self.convert_esp_back(simbolo)
        if isinstance(simbolo, str):
            simbolo = simbolo.replace("'", "\\'")
        return simbolo

    def convert_esp_back(self, simbolo):
        ''' Converte de volta os caracteres especiais que estavam no html de
        volta, acontecia um problema comparar com as informações do banco '''
        if isinstance(simbolo, str):
            lista_tratamento = [
                ("&amp;", "&"),
                ("&quot;", "\"")
            ]
            for chave, valor in lista_tratamento:
                simbolo = simbolo.replace(chave, valor)
        return simbolo

    def convert_esp(self, simbolo):
        ''' Converte caracteres especiais para simbolos reconhecidos no xml
        '''
        if isinstance(simbolo, str):
            lista_tratamento = [
                ("&", "&amp;"),
                ("\"", "&quot;")
            ]
            for chave, valor in lista_tratamento:
                simbolo = simbolo.replace(chave, valor)
        return simbolo

    def __init__(self, num, params, descricao='', request={}):
        self.servlet = num
        self.request = request
        self.descricao = descricao
        self.parametros = {
            'URL_CLIENTE':  self.get_endereco_servidor()
        }
        self.parametros.update(params)
        self.parametros = self.tratar_parametros()
        self.resposta = self.gerar()

    def tratar_parametros(self):
        ''' Realiza um tratamento dos valores dos parâmetros a serem passados
        para o relatórios
        '''
        params_tratados = {}

        for key, val in self.parametros.items():

            if isinstance(val, bool):
                valor = '{}'.format(val)

            elif isinstance(val, Model):
                valor = str(val.pk)

            elif not val:
                valor = ''

            else:
                try:
                    val = str(val)
                    codec = chardet.detect(val)['encoding']
                    valor = val.decode(codec).encode('utf-8')
                except:
                    valor = "{}".format(val)
                valor = self.convert_sql(valor)
            params_tratados[key] = valor

        if not 'TIPO_GERACAO' in params_tratados:
            params_tratados['TIPO_GERACAO'] = '2'

        return params_tratados

    def gerar(self):
        url = self.get_url()
        dados =  self.parametros

        if settings.DEBUG:
            encoded_params = urllib.parse.urlencode(dados)
            try:
                req_relatorio = urllib.request.urlopen(
                    url = url,
                    data = bytes(encoded_params, 'utf-8'),
                )
                resposta = eval(req_relatorio.read())
                resposta['link'] = self.get_url_arquivo( resposta['arquivo'] )
                req_relatorio.close()
                resposta = resposta
            except Exception as msg:
                resposta = {
                    'status': 'erro',
                    'trace': msg
                }
        else:
            ## Processo em meio de Produção
            # Gerar a notificação
            if self.descricao and self.descricao!='':
                from apps.notificacao.models import ModelNotificacao
                notif = ModelNotificacao.create_notif_relatorios(
                    self.descricao,
                    self.user
                )
                self.parametros["NOTIF_ID"] = notif.id
            else:
                self.parametros["NOTIF_ID"] = -1
            # Gera apenas os dados necessário, quem irá fazer a requisição é o ajax
            resposta = {
                'status': 'to_request',
                'url_to_request': url,
                'data': dados
            }

        self.__response = resposta
        self.__dict__.update(self.__response)
        print("resposta: ", resposta)
        return resposta

    def json_response(self):
        response = HttpResponse(
            json.dumps(self.__response)#, mimetype='application/json'
        )
        return response
