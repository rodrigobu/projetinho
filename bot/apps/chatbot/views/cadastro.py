from django.views.generic.base import TemplateView
from django.http import HttpResponseRedirect
from django.urls import reverse

from apps.chatbot.mixins import ChatCadastro
from apps.utils import views as utils_views


class CadastroTextoBot(TemplateView, utils_views.MessagesView, ChatCadastro):
    template_name = 'chatbot/cadastro/cadastro.html'
    url_success = 'chatbot.cadastro.texto'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lista_produto'] = self.lista_produto()
        context['lista_permissao'] = self.lista_permissao()
        return context

    def post(self, *args, **kwargs):
        dados = self.request.POST.copy()

        self.success('Texto do Bot salvo')
        self.salvar(dados)
        return HttpResponseRedirect(reverse(self.url_success))

cadastro_texto = CadastroTextoBot.as_view()
