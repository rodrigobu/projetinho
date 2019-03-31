from django.views.generic.base import TemplateView
from django.http import HttpResponseRedirect
from django.urls import reverse

from apps.chatbot.mixins import ChatCadastro, ChatConversa
from apps.utils import views as utils_views

from chatterbot.ext.django_chatterbot.models import Statement

class CadastroTextoBot(TemplateView, utils_views.MessagesView, ChatCadastro):
    template_name = 'chatbot/cadastro/cadastro.html'
    url_success = 'chatbot.cadastro.texto'

    def get_title(self):
        return "Cadastro do texto do ChatBot"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lista_produto'] = self.lista_produto()
        context['lista_permissao'] = self.lista_permissao()
        context['title'] = self.get_title()

        return context

    def post(self, *args, **kwargs):

        self.salvar(self.request)
        self.success('Texto do Bot salvo')
        return HttpResponseRedirect(reverse(self.url_success))

cadastro_texto = CadastroTextoBot.as_view()


class CadastroConversaBot(TemplateView, utils_views.MessagesView, ChatConversa):
    template_name = 'chatbot/conversa/cadastro.html'
    url_success = 'chatbot.cadastro.conversa'

    def get_queryset_from(self):
        queryset = Statement.objects.only('id', 'text')\
                   .order_by('text').all()
        return queryset

    def get_title(self):
        return "Cadastro de Conversa do ChatBot"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lista'] = self.get_queryset_from()
        context['title'] = self.get_title()
        context['lista_produto'] = self.lista_produto()
        context['lista_permissao'] = self.lista_permissao()

        return context

    def post(self, *args, **kwargs):

        self.salvar(self.request)
        self.success('Conversa do chatbot foi salvo com sucesso')
        return HttpResponseRedirect(reverse(self.url_success))

cadastro_conversa = CadastroConversaBot.as_view()
