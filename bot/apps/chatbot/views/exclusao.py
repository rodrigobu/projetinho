from django.utils.translation import ugettext as _

from apps.utils.views.json import JSONView
from apps.utils.views.requests import RequestUtilsMixin
from chatterbot.ext.django_chatterbot.models import Statement, Response
from apps.base_conhecimento.models import BaseConhecimentoLog

class ExclusaoView(JSONView):
    ''' View Proxy de exclusão
    '''
    model=None
    acao = ''

    def get_object(self):
        try:
            id = self.request.POST.get("id", self.request.GET.get("id"))
            print ('id', id)
            return self.model.objects.get(id=id)
        except:
            pass

    def criar_log_exclusao(self, registro, acao, url):
        log = BaseConhecimentoLog()
        log.usuario = 1
        log.acao = 'Exclusão {}'.format(acao)
        log.url = url
        log.id_registro = registro
        log.save()

    def get_context_data(self, *args, **kwargs):
        url = self.request.META.get("PATH_INFO","")
        obj = self.get_object()

        if self.acao == 'conversa':
            self.criar_log_exclusao(obj.id, obj, url)
        else:
            self.criar_log_exclusao(obj.id, self.acao, url)

        if self.acao == 'textos':
            resp = Response.objects.filter(response_id=obj.id).exists()
            perg = Response.objects.filter(statement_id=obj.id).exists()
            if not perg and not resp:
                obj.delete()
                return self.return_ok()
            return self.return_status_nok('''Existe conversas do ChatBot que
                contém este texto, desvincule esse texto para poder ser excluído
                ''')
        else:
            obj.delete()
            return self.return_ok()


class ExclusaoConversa(ExclusaoView):
    model = Response
    acao = 'conversa'

exclusao_conversa = ExclusaoConversa.as_view()


class ExclusaoTexto(ExclusaoView):
    model = Statement
    acao = 'textos'

exclusao_texto = ExclusaoTexto.as_view()
