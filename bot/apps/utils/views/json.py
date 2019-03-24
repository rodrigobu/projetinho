import ujson as json

from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.views.generic import TemplateView
from django.utils.translation import ugettext as _

from apps.utils.views.requests import RequestUtilsMixin


class JSONResponseMixin(object):
    """
    A mixin that can be used to render a JSON response.
    """
    auth_required = True
    only_post = False

    def render_to_json_response(self, context, **response_kwargs):
        """
        Returns a JSON response, transforming 'context' to make the payload.
        """
        if not self.request.is_ajax():
            return HttpResponseBadRequest(_("Acesso Negado!"))

        if self.only_post:
            if not self.request.POST:
                return HttpResponseBadRequest(_("Acesso Negado! Deve-se usar o metodo POST."))

        if 'erro' in context:
            response_class = HttpResponseBadRequest
        else:
            response_class = HttpResponse
        return response_class(
            self.convert_context_to_json(context),
            content_type='application/json',
            **response_kwargs
        )

    def convert_context_to_json(self, context):
        "Convert the context dictionary into a JSON object"
        # Note: This is *EXTREMELY* naive; in reality, you'll need
        # to do much more complex handling to ensure that arbitrary
        # objects -- such as Django model instances or querysets
        # -- can be serialized as JSON.
        return json.dumps(context, ensure_ascii=False)#, use_decimal=True)


class ReturnsStatusMixin(object):

    def get_status_return(self, status):
        return 'ok' if status else 'nok'

    def return_status_ok(self, msg, codigo=None, extra_content={}):
        ''' Proxy para return_status usado quando o status é True fixo'''
        return self.return_status(True, msg,
            codigo = codigo,
            extra_content = extra_content
        )

    def return_status_nok(self, msg, codigo=None, extra_content={}):
        ''' Proxy para return_status usado quando o status é False fixo'''
        return self.return_status(False, msg,
            codigo = codigo,
            extra_content = extra_content
        )

    def return_status(self, status, msg, codigo=None, extra_content={}):
        to_return = {
            'status': self.get_status_return(status),
            'msg': msg
        }

        if codigo and status:
            to_return['codigo'] = codigo
        else:
            to_return['codigo'] = ''

        to_return.update(extra_content)
        return to_return

    def return_nok(self):
        return { 'status': self.get_status_return(False) }

    def return_ok(self):
        return { 'status': self.get_status_return(True) }


class JSONView(JSONResponseMixin, TemplateView, RequestUtilsMixin, ReturnsStatusMixin):

    def post(self, *args, **kwargs):
        return self.get(*args, **kwargs)

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)


    def return_html(self, dados={}):
        to_return = {
            "html" : render(
                self.request,
                self.template_name,
                dados
            ).content
        }
        return to_return
