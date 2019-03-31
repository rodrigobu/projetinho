from django.views.generic.base import TemplateView
from django.http import HttpResponseRedirect
from django.urls import reverse

from chatterbot.ext.django_chatterbot.models import Statement, Response

from apps.chatbot.mixins import ChatCadastro, ChatConversa
from apps.utils import views as utils_views


class EdicaoTextoBot(TemplateView, utils_views.MessagesView, ChatCadastro):
    template_name = 'chatbot/cadastro/cadastro.html'
    url_success = 'chatbot.edicao.texto'

    def get_object(self):
        return Statement.objects.get(id=self.kwargs.get("id"))

    def get_url_sucesso(self):
        return reverse(
            self.url_success,
            kwargs = {
                'id': self.get_object().id,
            })

    def get_title(self):
        return "Edição do texto do ChatBot"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        statement = self.get_object()
        extra = statement.extra_data.split(',')
        context['lista_produto'] = self.lista_produto()
        context['lista_permissao'] = self.lista_permissao()
        context['produto_id'] = extra[0]
        context['permissao_id'] = extra[1]
        context['texto_value'] = statement.text
        context['title'] = self.get_title()
        return context

    def post(self, *args, **kwargs):
        dados = self.request.POST.copy()
        self.success('Texto do Bot salvo')
        self.salvar(dados, self.get_object())
        return HttpResponseRedirect(self.get_url_sucesso())

edicao_texto = EdicaoTextoBot.as_view()

class EdicaoConversaBot(TemplateView, utils_views.MessagesView, ChatConversa):
    template_name = 'chatbot/conversa/cadastro.html'
    url_success = 'chatbot.edicao.conversa'

    def get_object(self):
        return Response.objects.get(id=self.kwargs.get("id"))

    def get_url_sucesso(self):
        return reverse(
            self.url_success,
            kwargs = {
                'id': self.get_object().id,
            })

    def get_title(self):
        return "Edição do texto do ChatBot"


    def get_queryset_from(self):
        queryset = Statement.objects.only('id', 'text')\
                   .order_by('text').all()
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        statement = Statement.objects.get(id=self.get_object().response_id)
        extra = statement.extra_data.split(',')

        context['produto_id'] = extra[0]
        context['permissao_id'] = extra[1]
        context['lista'] = self.get_queryset_from()
        context['resposta'] = self.get_object()
        context['title'] = self.get_title()
        context['lista_produto'] = self.lista_produto()
        context['lista_permissao'] = self.lista_permissao()

        return context

    def post(self, *args, **kwargs):
        dados = self.request.POST.copy()
        self.salvar(dados, self.get_object())
        self.success('Texto do Bot salvo')
        return HttpResponseRedirect(self.get_url_sucesso())

edicao_conversa = EdicaoConversaBot.as_view()
