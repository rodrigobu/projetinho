import json
import logging
import requests

from django.views.generic import View
from django.http import JsonResponse
from pesquisa.models import Entrevista, ChatPerguntaVaga, ChatPerguntaResp

from chatterbot import ChatBot
from chatterbot.utils import input_function, get_response_time
from chatterbot.logic import LogicAdapter
from chatterbot.ext.django_chatterbot import settings
from chatterbot.ext.django_chatterbot.models import Conversation, Response


class ChatterBotApiView(View):
    """
    Provide an API endpoint to interact with ChatterBot.
    """
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
        response_data = response.serialize()

        return JsonResponse(response_data, status=200)


class ChatVaga(LogicAdapter):
    ''' Adaptador logico para especificos para vaga
    '''
    def __init__(self, **kwargs):
        super(ChatVaga, self).__init__(**kwargs)

    def tem_resposta(self, cand_id, pergunta):
        ''' Verifica se o candidato já respondeu todas perguntas
        '''

        try:
            chat_resp = ChatPerguntaResp.objects.filter(
                cand_id=cand_id,
                pergunta=pergunta).exists()
        except IndexError:
            chat_resp = True

        return chat_resp

    def verificacao_perguntas_vaga(self, statement, cand, vaga_id, pergunta):
        ''' Verifica se existe pergunta para avaga e se o candidato,
        já respondeu todas elas.
        Caso não tenha respondido ira retornar a proxima pergunta.
        '''
        from chatterbot.conversation import Statement

        chat_perguntas = ChatPerguntaVaga.objects.filter(perfil_vaga=vaga_id)

        if chat_perguntas and not self.tem_resposta(cand, pergunta[0]) :

            self.salvar_respostas(vaga_id, cand, statement.text, pergunta[0])
            try:
                response_statement = Statement(pergunta[1].pergunta)
                response_statement.extra_data = pergunta[1].tipo_pergunta
            except IndexError:
                response_statement = Statement("Todas as perguntas foram respondida")
        else:
            response_statement = Statement("Todas as perguntas foram respondida")
        return response_statement

    def salvar_respostas(self, vaga, cand, resposta, pergunta):
        ''' Processo de salvamento das respostas
        '''
        chat_resp = ChatPerguntaResp()
        print ('pergunta', pergunta)
        chat_resp.vaga_id = vaga
        chat_resp.cand_id = cand
        chat_resp.resposta = resposta
        chat_resp.pergunta = pergunta
        chat_resp.save()

    def validacao_pergunta(self, statement, vaga_id=1, cand_id=2):
        ''' Valida se tem pergunta para vaga selecionada
        '''
        pergunta = []
        chat_perguntas = ChatPerguntaVaga.objects.filter(perfil_vaga=vaga_id)
        chat_resp = ChatPerguntaResp()
        confidence = 1

        for perg in chat_perguntas:
            if not self.tem_resposta(cand_id, perg):
                pergunta.append(perg)

        response_statement = self.verificacao_perguntas_vaga(
            statement,
            cand_id,
            vaga_id,
            pergunta
        )
        return confidence, response_statement

    def process(self, statement):
        ''' Executa o processo do chatbot.
        '''
        confidence, response_statement = self.validacao_pergunta(statement)

        print ('Resposta', statement)
        print ('Pergunta', response_statement)

        return confidence, response_statement
