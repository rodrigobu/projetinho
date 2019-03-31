import json
import logging

from django.views.generic import View
from django.http import JsonResponse
from django.utils.translation import ugettext as _

from chatterbot import ChatBot
from chatterbot.utils import input_function, get_response_time
from chatterbot.logic import LogicAdapter
from chatterbot.ext.django_chatterbot import settings

from chatterbot.ext.django_chatterbot.models import Conversation, Response
from chatterbot.conversation import Statement
from apps.base_conhecimento.models import BaseConhecimentoLog
# from apps.vaga.models import VagaEntrevista, VagaEntrevistaRespostas


class ChatterBotApiView(View):
    """View principal do Bot.
    """
    # logging.basicConfig(level=logging.INFO)

    PERMISSAO_PRODUTO = {
        "GCA": '1',
        "SPA": '2',
        "GCA/SPA": '3',
        "PCO": '4',
        "GCA/PCO": '5',
        "PCO/SPA": '6',
        "TODOS": '8'
    }

    PRODUTO = {
        "1": "GCA",
        "2": "SPA",
        "4": "PCO",
        "8": "TODOS"
    }

    PERMISSAO = {
        "1": "TI",
        "2": "CONSULTORIA",
        "3": "PUBLICO"
    }
    nivel_resposta = 0.6

    def get_produto(self, prod_bot, prod_user):
        ''' Função para trazer qual produto que está sendo requisitado
        '''
        return self.PRODUTO[prod_bot], self.PRODUTO[prod_user]

    def tem_permissao_gca(self, permissao_produto):
        ''' Verifica se existe permissao para entrar no chat do GCA
        '''
        if permissao_produto == self.PERMISSAO_PRODUTO['GCA']:
            return True

        elif permissao_produto == self.PERMISSAO_PRODUTO['GCA/SPA']:
            return True

        elif permissao_produto == self.PERMISSAO_PRODUTO['GCA/PCO']:
            return True

        elif permissao_produto == self.PERMISSAO_PRODUTO['TODOS']:
            return True
        else:
            return False

    def tem_permissao_spa(self, permissao_produto):
        ''' Verifica se existe permissao para entrar no chat do SPA
        '''

        if permissao_produto == self.PERMISSAO_PRODUTO['SPA']:
            return True

        elif permissao_produto == self.PERMISSAO_PRODUTO['GCA/SPA']:
            return True

        elif permissao_produto == self.PERMISSAO_PRODUTO['PCO/SPA']:
            return True

        elif permissao_produto == self.PERMISSAO_PRODUTO['TODOS']:
            return True
        else:
            return False

    def tem_permissao_pco(self, permissao_produto):
        ''' Verifica se existe permissao para entrar no chat do PCO
        '''

        if permissao_produto == self.PERMISSAO_PRODUTO['PCO']:
            return True

        elif permissao_produto == self.PERMISSAO_PRODUTO['PCO/SPA']:
            return True

        elif permissao_produto == self.PERMISSAO_PRODUTO['GCA/PCO']:
            return True

        elif permissao_produto == self.PERMISSAO_PRODUTO['TODOS']:
            return True
        else:
            return False

    def get_tipo_usuario(self, bot, usuario):
        ''' Verifica se a permissao para o usuario
        '''

        return self.PERMISSAO[bot], self.PERMISSAO[usuario]

    def prepara_extra_data(self, extra_data):
        ''' Função formata os dados de cada pergunta no formato json
        '''
        return json.dumps({
            'produto' : extra_data[0],
            'permissao_produto': extra_data[1],
            'permissao' : extra_data[2],
        })

    def get_dados_usuario(self, kwargs):
        ''' Função para pegar todos os dados usuario
        '''
        produto = kwargs.get('produto')
        permissao_produto = kwargs.get('permissao_produto')
        tipo_user = kwargs.get('tipo_user')
        return produto, permissao_produto, tipo_user

    def verificar_conversa(self, produto, permissao_produto, perm_prod_bot, tipo_user, tipo_user_bot):
        ''' Verifica para qual conversa o usuario e retorna a respota indicada
        para o perfil do usuario
        '''
        if produto == 'GCA':
            print ('PRODUTO GCA')
            if self.tem_permissao_gca(perm_prod_bot) and self.tem_permissao_gca(permissao_produto):
                print ("TEM PERMISSAO DO GCA")
                if tipo_user == 'TI' and tipo_user_bot == "TI":
                    print ("TIPO TI")
                elif tipo_user == 'CONSULTORIA' and tipo_user_bot == 'CONSULTORIA':
                    print ("TIPO CONSULTORIA")
                elif tipo_user == 'PUBLICO' and tipo_user_bot == "PUBLICO":
                    print ("TIPO PUBLICO")

        if produto == 'SPA':
            print ('PRODUTO SPA')
            if self.tem_permissao_spa(perm_prod_bot) and self.tem_permissao_spa(permissao_produto):
                print ("TEM PERMISSAO DO SPA")
                if tipo_user == 'TI':
                    print ("TIPO TI")
                elif tipo_user == 'CONSULTORIA':
                    print ("TIPO CONSULTORIA")
                elif tipo_user == 'PUBLICO':
                    print ("TIPO PUBLICO")

        if produto == 'PCO':
            print ('PRODUTO PCO')
            if self.tem_permissao_pco(perm_prod_bot) and tem_permissao_pco(permissao_produto):
                print ("TEM PERMISSAO DO PCO")
                if tipo_user == 'TI':
                    print ("TIPO TI")
                elif tipo_user == 'CONSULTORIA':
                    print ("TIPO CONSULTORIA")
                elif tipo_user == 'PUBLICO':
                    print ("TIPO PUBLICO")

    def adaptadores(self):
        """ Função que traz as respostas do bot global
        """
        logic_adapters = [
            {
                'import_path': 'chatterbot.logic.SpecificResponseAdapter',
                'input_text': 'Help me!',
                'output_text': 'Ok, here is a link: http://chatterbot.rtfd.org'
            },
            {
                'import_path': 'chatterbot.logic.SpecificResponseAdapter',
                'input_text': 'changelog',
                'output_text': '<a href="https://lemeconsultoria.webgca.com.br/changelog/" target="_blank">Tudo o que foi atualizado</a>'
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
                'threshold': 0.6,
                'default_response': self.msg_default
            },
        ]
        return logic_adapters

    def chatbot(self):
        '''Traz todas as configurações do BOT.
        '''
        self.bot = ChatBot(
            **settings.CHATTERBOT,
            logic_adapters = self.adaptadores(),

        )
        return self.bot

    def get_conversation(self, request):
        """
        Retornar a conversa para a sessão, se houver. Crie uma nova conversa,
        se não existir uma.
        """
        class Obj(object):
            def __init__(self):
                self.id = None
                self.statements = []

        conversation = Obj()
        conversation.id = request.session.get('conversation_id', 0)
        print
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
                print ('response', response)
                conversation.statements.append(response.statement.serialize())
                conversation.statements.append(response.response.serialize())
        return conversation

    @property
    def msg_default(self):
        return 'Não entendi'

    def get(self, request, *args, **kwargs):
        """
        Retorna os dados correspondente a conversa.
        """
        conversation = self.get_conversation()
        print ('conversation', conversation)
        return JsonResponse({
            'BOT': self.chatbot().name,
            'conversation': conversation.statements
        })

    def post(self, request, *args, **kwargs):
        """ Retorna a resposta mais adequada para a pergunta
        """
        dados = request.POST.copy()

        produto, permissao_user, tipo_user = self.get_dados_usuario(kwargs)

        input_data = json.loads(request.read().decode('utf-8'))
        if 'text' not in input_data:
            return JsonResponse({
                'text': [ textos.get('resposta_obrigatoria') ]
            }, status=400)

        conversation = self.get_conversation(request)
        response = self.chatbot().get_response(input_data, conversation.id)
        print ("input_data", input_data)
        if response.extra_data:
            extra_data = response.extra_data.split(',')
            response.extra_data = self.prepara_extra_data(extra_data)

            tipo_user_bot, tipo_user = self.get_tipo_usuario(extra_data[2], tipo_user)
            produto_bot, produto_user = self.get_produto(extra_data[0], produto)
            permissao_bot = extra_data[1]

            produto_gca = produto_bot == 'GCA' and  produto_user == 'GCA'
            produto_spa = produto_bot == "SPA" and  produto_user == 'SPA'
            produto_pco = produto_bot == "PCO" and produto_user == 'PCO'

            if produto_gca:
                self.verificar_conversa(
                    'GCA',
                    permissao_user,
                    permissao_bot,
                    tipo_user,
                    tipo_user_bot
                )
            elif produto_spa:
                self.verificar_conversa(
                    'SPA',
                    permissao_user,
                    permissao_bot,
                    tipo_user,
                    tipo_user_bot
                )
            elif produto_pco:
                self.verificar_conversa(
                    'PCO',
                    permissao_user,
                    permissao_bot,
                    tipo_user,
                    tipo_user_bot
                )
            else:
                response.text = 'Por favor tente outra forma'
        print ("RESPONSE", response.extra_data)
        response_data = response.serialize()

        return JsonResponse(response_data, status=200)


class ChatCadastro(object):
    ''' Class para salvar para fazer tratamento para salvar os dados no banco
    '''
    def lista_produto(self):
        return (
            (1, _('GCA')),
            (2, _('SPA')),
            (4, _('PCO')),
            (8, _('TODOS')),
        )

    def lista_permissao(self):
        return (
            (2, _('CONSULTORIA')),
            (3, _('PUBLICO')),
            (1, _('SUPORTE')),
        )

    def tratar_extra(self, permissao, produto):
        extra = '{produto},{produto},{permissao}'.format(
            permissao=permissao,
            produto=produto
        )
        return extra

    def criar_log_cadastro(self, obj, acao, url):
        log = BaseConhecimentoLog()
        log.usuario = 1
        log.acao = acao
        log.url = url
        log.id_registro = obj.id
        log.save()

    def salvar(self, request, statement=None):
        from chatterbot.ext.django_chatterbot.models import Statement

        dados = request.POST.copy()
        url = request.META.get("PATH_INFO","")
        acao = 'Edição do Texto'
        if not statement:
            acao = 'Cadastro dos Textos'
            statement = Statement()
        statement.text = dados.get('msg')
        statement.save()
        self.criar_log_cadastro(statement, acao, url)

class ChatConversa(object):

    def lista_produto(self):
        return (
            (1, _('GCA')),
            (2, _('SPA')),
            (4, _('PCO')),
            (8, _('TODOS')),
        )

    def lista_permissao(self):
        return (
            (2, _('CONSULTORIA')),
            (3, _('PUBLICO')),
            (1, _('SUPORTE')),
        )

    def tratar_extra(self, permissao, produto):
        extra = '{produto},{produto},{permissao}'.format(
            permissao=permissao,
            produto=produto
        )
        return extra

    def salvar(self, request, resposta=None):
        from chatterbot.ext.django_chatterbot.models import Response, Statement
        log = BaseConhecimentoLog()

        dados = request.POST.copy()
        url = request.META.get("PATH_INFO","")

        acao = 'Edição da Conversa'
        if not resposta:
            acao = 'Cadastro da Conversa'
            resposta = Response()

        pergunta_usuario = dados.get('pergunta_usuario')
        pergunta = Statement.objects.get(id=pergunta_usuario)

        resposta_bot = dados.get('resposta_bot')
        resposta_bot = Statement.objects.get(id=resposta_bot)

        permissao = dados.get('permissao')
        produto = dados.get('produto')
        

        campo_extra = self.tratar_extra(permissao, produto)
        resposta_bot.extra_data = campo_extra

        if pergunta:
            resposta.statement_id = pergunta.id
        if resposta_bot:
            resposta.response_id = resposta_bot.id

        resposta_bot.save()
        resposta.save()

        log.usuario = 1
        log.acao = acao
        log.url = url
        log.id_registro = resposta.id
        log.save()
