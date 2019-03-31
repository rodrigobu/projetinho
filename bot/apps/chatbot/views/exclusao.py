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

        self.get_object().delete()

        return self.return_ok()
        # return True, ""


class ExclusaoConversa(ExclusaoView):
    model = Response
    acao = 'conversa'

exclusao_conversa = ExclusaoConversa.as_view()
