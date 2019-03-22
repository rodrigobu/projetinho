import json
import logging

from django.views.generic import View
from django.http import JsonResponse

from chatterbot import ChatBot
from chatterbot.logic import LogicAdapter
from chatterbot.ext.django_chatterbot import settings
from chatterbot.conversation import Statement


class ChatterBotApiView(View):
    """View principal do Bot.
    """
    logging.basicConfig(level=logging.DEBUG)

    @property
    def msg_default(self):
        return textos.get('desculpe_n_entendi')

    nivel_resposta = 0

    def adaptadores(self):
        """ Função que traz as respostas do bot global
        """
        logic_adapters = [
        #     {
        #         'import_path': 'chatterbot.logic.SpecificResponseAdapter',
        #         'input_text': 'Help me!',
        #         'output_text': 'Ok, here is a link: http://chatterbot.rtfd.org'
        #     },
        #
        #     # Adaptador logico, para trazer a melhor resposta
            {
                'import_path': "chatterbot.logic.BestMatch",
                "statement_comparison_function": "chatterbot.comparisons.levenshtein_distance",
                "response_selection_method": "chatterbot.response_selection.get_first_response"
            },

        #     # Setar respostas de baixa confiança, verfica se a resposta tem um confiabilidade aceitavel,
        #     # Senão retonar uma resposta default.
            {
                'import_path': "chatterbot.logic.BestMatch",
                # 'threshold': self.nivel_resposta,

                # 'default_response': self.msg_default
                'default_response': 'I am sorry, but I do not understand.',
                'maximum_similarity_threshold': 0.90

            },
        ]
        return logic_adapters

    def chatbot(self):
        '''Traz todas as configurações do BOT.
        '''
        bot = ChatBot(
            **settings.CHATTERBOT,
            logic_adapters=[
                {
                    'import_path': 'chatterbot.logic.SpecificResponseAdapter',
                    'input_text': 'Help me!',
                    'output_text': 'Ok, here is a link: http://chatterbot.rtfd.org'
                },

                ]
            )
        print (bot)
        return bot
    #
    # def get_conversation(self, request):
    #     """
    #     Retornar a conversa para a sessão, se houver. Crie uma nova conversa,
    #     se não existir uma.
    #     """
    #     class Obj(object):
    #         def __init__(self):
    #             self.id = None
    #             self.statements = []
    #
    #     conversation = Obj()
    #     conversation.id = request.session.get('conversation_id', 0)
    #     existing_conversation = False
    #     # try:
    #     #     Conversation.objects.get(id=conversation.id)
    #     #     existing_conversation = True
    #     #
    #     # except Conversation.DoesNotExist:
    #     conversation_id = self.chatbot().storage.create_conversation()
    #     request.session['conversation_id'] = conversation_id
    #     conversation.id = conversation_id
    #
    #     if existing_conversation:
    #         responses = Response.objects.filter(
    #             conversations__id=conversation.id
    #         )
    #
    #         for response in responses:
    #             conversation.statements.append(response.statement.serialize())
    #             conversation.statements.append(response.response.serialize())
    #     return conversation


    def get(self, request, *args, **kwargs):
        """
        Retorna os dados correspondente a conversa.
        """
        return JsonResponse({
            'BOT': self.chatbot().name,
        })

    def post(self, request, *args, **kwargs):
        """
        Return a response to the statement in the posted data.

        * The JSON data should contain a 'text' attribute.
        """
        dados = request.POST.copy()
        input_data = json.loads(request.read().decode('utf-8'))
        print ('input_data', input_data)
        if 'text' not in input_data:
            return JsonResponse({
                'text': [ textos.get('resposta_obrigatoria') ]
            }, status=400)

        # conversation = self.get_conversation(request)
        print ('input_data', input_data)
        response = self.chatbot().get_response('Help me!')
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
            chat_resp = VagaEntrevistaRespostas.objects.filter(
                candidato = cand_id,
                vaga_entrevista = pergunta.id
            ).exists()
        except IndexError:
            chat_resp = True
        return chat_resp

    def verificacao_perguntas_vaga(self, statement, cand, vaga_id, pergunta):
        ''' Verifica se existe pergunta para avaga e se o candidato,
        já respondeu todas elas.
        Caso não tenha respondido ira retornar a proxima pergunta.
        '''
        msg_final = "Obrigado por responder nosso questionario, boa sorte!"
        chat_perguntas = VagaEntrevista.objects.filter(vaga_id=vaga_id)
        if chat_perguntas and not self.tem_resposta(cand, pergunta[0]) :
            if not statement == "1_":
                self.salvar_respostas(cand, statement.text, pergunta[0])
                try:
                    response_statement = Statement(pergunta[1].get_descricao())
                    response_statement.extra_data = {
                        'is_alternativa': pergunta[1].is_alternativa(),
                        'alternativas': pergunta[1].get_alternativas_for_chat()
                    }
                except IndexError:
                    response_statement = Statement(msg_final)
                    response_statement.extra_data = {
                        'is_alternativa': False,
                        'respondida': True,
                        'alternativas': []
                    }
            else:
                response_statement = Statement(textos.get('desculpe_n_entendi'))
        else:
            response_statement = Statement(msg_final)
        response_statement.confidence = 1
        return response_statement

    def salvar_respostas(self, cand_id, resposta, pergunta):
        ''' Processo de salvamento das respostas
        '''
        obj = VagaEntrevistaRespostas.objects.create(
            vaga_entrevista_id = pergunta.id,
            candidato_id = cand_id,
            resposta = resposta.replace("1_","").replace("1 ","")
        )
        obj.candidato.atualizar_data_atualizacao()

    def validacao_pergunta(self, statement, vaga_id, cand_id):
        ''' Valida se tem pergunta para vaga selecionada
        '''
        pergunta = []
        chat_perguntas = VagaEntrevista.objects.filter(vaga_id=vaga_id)
        chat_resp = VagaEntrevistaRespostas()

        for perg in chat_perguntas:
            if not self.tem_resposta(cand_id, perg):
                pergunta.append(perg)

        response_statement = self.verificacao_perguntas_vaga(
            statement,
            cand_id,
            vaga_id,
            pergunta
        )

        return response_statement

    def process(self, statement, **kwargs):
        ''' Executa o processo do chatbot.
        '''
        cand, vaga = statement.extra_data
        response_statement = self.validacao_pergunta(statement, vaga, cand)
        self.response_statement = response_statement
        return response_statement
