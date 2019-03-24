from django.views.generic.base import TemplateView
from django.http import HttpResponseRedirect
from django.urls import reverse

from chatterbot.ext.django_chatterbot.models import Statement

from apps.chatbot.mixins import ChatCadastro
from apps.utils import views as utils_views


class EdicaoTextoBot(TemplateView, utils_views.MessagesView, ChatCadastro):
    template_name = 'chatbot/cadastro/cadastro.html'
    url_success = 'chatbot.cadastro.texto'

    def get_object(self):
        return Statement.objects.get(id=self.kwargs.get("id"))

    def post(self, *args, **kwargs):
        dados = self.request.POST.copy()
        self.success('Texto do Bot salvo')
        self.salvar(dados, self.get_object())
        return HttpResponseRedirect(reverse(self.url_success))

edicao_texto = EdicaoTextoBot.as_view()
