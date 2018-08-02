import json
import logging
import requests

from django.views.generic.base import TemplateView
from django.views.generic import View
from django.http import JsonResponse
from pesquisa.models import Entrevista, ChatPerguntaVaga, ChatPerguntaResp

from chatterbot import ChatBot
from chatterbot.utils import input_function, get_response_time
from chatterbot.logic import LogicAdapter
from chatterbot.ext.django_chatterbot import settings
from chatterbot.ext.django_chatterbot.models import Conversation, Response


class ChatterBotAppView(TemplateView):
    template_name = 'chat.html'
    entrevista = False

    def texto_inicial(self):
        return 'Bom dia sou, CHATBOT. Como vai você?'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['nome_chatbot'] = 'BOT LEME'
        context['texto_inicial'] = self.texto_inicial()
        context['entrevista'] = self.entrevista

        return context


class BotAppEntrevista(ChatterBotAppView):
    entrevista = True

    def texto_inicial(self):
        cand_resp = ChatPerguntaResp()
        chat_perguntas = ChatPerguntaVaga.objects.filter(perfil_vaga=1)
        pergunta = []
        for perg in chat_perguntas:
            chat_resp = ChatPerguntaResp.objects.filter(cand_id=333, pergunta=perg.id)
            print (chat_resp)
            if not chat_resp.exists():
                pergunta.append(perg)
            else:
                pergunta = []
        if not pergunta:
            return 'Todas as perguntas foram respondidas'
        return pergunta[0].pergunta


class AdaptadorLogico(LogicAdapter):

    def __init__(self, **kwargs):
        super(AdaptadorLogico, self).__init__(**kwargs)


    def process(self, statement):
        from chatterbot.conversation import Statement
        id_perfil_vaga = 1
        id_cand = 333
        chat_perguntas = ChatPerguntaVaga.objects.filter(perfil_vaga=1)
        pergunta = []
        confidence = 1
        cand_resp = ChatPerguntaResp()

        for perg in chat_perguntas:
            chat_resp = ChatPerguntaResp.objects.filter(cand_id=id_cand, pergunta=perg.id)
            if not chat_resp.exists():
                pergunta.append(perg)

        if pergunta:
            chat_resp = ChatPerguntaResp.objects.filter(cand_id=id_cand, pergunta=pergunta[0])
            if not chat_resp.exists():
                cand_resp.vaga_id = id_perfil_vaga
                cand_resp.cand_id = id_cand
                cand_resp.resposta = statement.text
                cand_resp.pergunta = pergunta[0]
                cand_resp.save()

                try:
                    response_statement = Statement(pergunta[1].pergunta)
                    response_statement.extra_data = pergunta[1].tipo_pergunta
                except IndexError:
                    response_statement = Statement("Todas as perguntas foram respondida")
        else:
            response_statement = Statement("Todas as perguntas foram respondida")

        print ('Resposta', statement)
        print ('Pergunta', response_statement)

        return confidence, response_statement


class ChatterBotApiView(View):
    """
    Provide an API endpoint to interact with ChatterBot.
    """
    logging.basicConfig(level=logging.INFO)
    def adaptadores(self):
        logic_adapters = [
            {
                'import_path': 'chatterbot.logic.SpecificResponseAdapter',
                'input_text': 'Help me!',
                'output_text': 'Ok, here is a link: http://chatterbot.rtfd.org'
            },

            # Adaptador logico, para trazer a melhor resposta
            {
                'import_path': "chatterbot.logic.BestMatch",
                "statement_comparison_function": "chatterbot.comparisons.levenshtein_distance",
                "response_selection_method": "chatterbot.response_selection.get_first_response"
            },

            # Setar respostas de baixa confiança, verfica se a resposta tem um confiabilidade aceitavel,
            # Senão retonar uma resposta default.
            {
                'import_path': 'chatterbot.logic.LowConfidenceAdapter',
                'threshold': 0.7,
                'default_response': 'Não entendi'
            },
        ]
        return logic_adapters

    def chatbot(self):
        bot = ChatBot(
            **settings.CHATTERBOT,
            logic_adapters = self.adaptadores()
        )
        return bot

    def get_conversation(self, request):
        """
        Return the conversation for the session if one exists.
        Create a new conversation if one does not exist.
        """
        class Obj(object):
            def __init__(self):
                self.id = None
                self.statements = []

        conversation = Obj()
        conversation.id = request.session.get('conversation_id', 0)
        existing_conversation = False
        try:
            Conversation.objects.get(id=conversation.id)
            existing_conversation = True

        except Conversation.DoesNotExist:
            conversation_id = self.chatbot().storage.create_conversation()
            request.session['conversation_id'] = conversation_id
            conversation.id = conversation_id

        if existing_conversation:
            responses = Response.objects.filter(
                conversations__id=conversation.id
            )

            for response in responses:
                conversation.statements.append(response.statement.serialize())
                conversation.statements.append(response.response.serialize())
        return conversation


    def get(self, request, *args, **kwargs):
        """
        Return data corresponding to the current conversation.
        """

        conversation = self.get_conversation(request)

        return JsonResponse({
            'BOT': self.chatbot().name,
            'conversation': conversation.statements
        })

    def post(self, request, *args, **kwargs):
        """
        Return a response to the statement in the posted data.

        * The JSON data should contain a 'text' attribute.
        """

        input_data = json.loads(request.read().decode('utf-8'))
        if 'text' not in input_data:
            return JsonResponse({
                'text': [
                    'The attribute "text" is required.'
                ]
            }, status=400)

        conversation = self.get_conversation(request)
        response = self.chatbot().get_response(input_data, conversation.id)
        print ("RESP", response)
        response_data = response.serialize()

        return JsonResponse(response_data, status=200)


class BotEntrevista(ChatterBotApiView):
    def adaptadores(self):
        logic_adapters = [{
        # Adaptador logico, para respostas especificas.
            'import_path': 'pesquisa.views.AdaptadorLogico',
        }]
        return logic_adapters


    def get_conversation(self, request):
        """
        Return the conversation for the session if one exists.
        Create a new conversation if one does not exist.
        """
        from chatterbot.ext.django_chatterbot.models import Conversation, Response
        class Obj(object):
            def __init__(self):
                self.id = None
                self.statements = []

        conversation = Obj()

        existing_conversation = True
        if existing_conversation:
            responses = Response.objects.filter(
                conversations__id=conversation.id
            )
            for response in responses:
                conversation.statements.append(response.statement.serialize())
                conversation.statements.append(response.response.serialize())
        return conversation
