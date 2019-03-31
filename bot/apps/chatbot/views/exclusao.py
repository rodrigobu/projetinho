from django.utils.translation import ugettext as _

from apps.utils.views.json import JSONView
from apps.utils.views.requests import RequestUtilsMixin
from chatterbot.ext.django_chatterbot.models import Statement, Response


class ExclusaoView(JSONView):
    ''' View Proxy de exclusão
    '''
    model=None

    def get_object(self):
        try:
            id = self.request.POST.get("id", self.request.GET.get("id"))
            print ('id', id)
            return self.model.objects.get(id=id)
        except:
            pass
    def get_context_data(self, *args, **kwargs):
        print ("OBJETO", self.get_object())
        self.get_object().delete()

        # if self.gera_log:
        #     #Registra o log de exclusao
        #     from apps.log.models import Log
        #     log = Log()
        #     log.log_remover(self.request,
        #         #obs="Exclusão de registro",
        #         model=self.model,
        #         id_obj=pk,
        #         sql=True
        #     )

        return self.return_ok()
        # return True, ""


class ExclusaoConversa(ExclusaoView):
    model = Response


exclusao_conversa = ExclusaoConversa.as_view()
