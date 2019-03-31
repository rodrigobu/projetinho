from django.views.generic.base import TemplateView
from django.http import HttpResponseRedirect
from django.urls import reverse

from apps.utils import views as utils_views
from apps.utils.types.sqls import sql_to_dict

from chatterbot.ext.django_chatterbot.models import Statement

class ListaConversaChat(TemplateView, utils_views.MessagesView):
    template_name = 'chatbot/conversa/listagem.html'
    url_success = 'chatbot.cadastro.conversa'

    def get_title(self):

        return "Listagem de Conversa do ChatBot"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = self.get_title()
        return context

listagem_conversa = ListaConversaChat.as_view()


class ListaTextoChat(TemplateView, utils_views.MessagesView):
    template_name = 'chatbot/cadastro/listagem.html'

    def get_title(self):

        return "Listagem de Texto do ChatBot"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = self.get_title()
        return context

listagem_texto = ListaTextoChat.as_view()


class ListagemConversaJSON(utils_views.JSONView):
    '''
    Retorna todas as filiais do sistema em formato JSON para popular o
    Datatables.
    '''

    def get_conversas(self):
        '''
        Retorna todas as filiais cadastrados no sistema em formato dict.
        '''
        SQL = '''
            SELECT bot_resposta.id AS id,
                bot_perg.text AS pergunta,
                bot_resp.text AS resposta,
                bot_resp.extra_data as extra_data
            FROM django_chatterbot_response AS bot_resposta
            INNER JOIN django_chatterbot_statement AS bot_perg ON bot_perg.id = bot_resposta.statement_id
            INNER JOIN django_chatterbot_statement AS bot_resp ON bot_resp.id = bot_resposta.response_id
        '''
        return sql_to_dict(SQL)

    def get_context_data(self, *args, **kwargs):
        registros = self.get_conversas()
        return {
            'aaData': registros
        }

listagem_conversa_json = ListagemConversaJSON.as_view()


class ListagemConversaJSON(utils_views.JSONView):
    '''
    Retorna todas as filiais do sistema em formato JSON para popular o
    Datatables.
    '''

    def get_textos(self):
        '''
        Retorna todas as filiais cadastrados no sistema em formato dict.
        '''
        SQL = '''
            SELECT
                id,
                text,
                extra_data
            FROM django_chatterbot_statement
        '''
        return sql_to_dict(SQL)

    def get_context_data(self, *args, **kwargs):
        registros = self.get_textos()
        return {
            'aaData': registros
        }

listagem_texto_json = ListagemConversaJSON.as_view()
