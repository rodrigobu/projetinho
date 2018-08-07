import json
import requests

from django.views.generic.base import TemplateView
from django.views.generic import View
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from pesquisa.models import ChatPerguntaVaga, ChatPerguntaResp
from pesquisa.views.mixins import ChatterBotApiView, ChatVaga


class ChatterBotAppView(TemplateView):
    template_name = 'chat.html'
    entrevista = False

    def texto_inicial(self):
        return '''Olá, eu sou o CHATBOT, o chatbot da Leme Consultoria. \n
        Estou aqui para auxiliar sua experiencia.''', False

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        texto_inicial, tem_resposta = self.texto_inicial()
        context['nome_chatbot'] = 'CHATBOT'
        context['texto_inicial'] = texto_inicial
        context['tem_resposta'] = tem_resposta
        context['entrevista'] = self.entrevista

        return context


class BotAppEntrevista(ChatterBotAppView):
    entrevista = True
    vaga = 1
    cand = 333
    def texto_inicial(self):
        cand_resp = ChatPerguntaResp()
        chat_perguntas = ChatPerguntaVaga.objects.filter(perfil_vaga=self.vaga)
        pergunta = []
        if chat_perguntas:
            for perg in chat_perguntas:
                chat_resp = ChatPerguntaResp.objects.filter(cand_id=self.cand, pergunta=perg.id)
                print (chat_resp)
                if not chat_resp.exists():
                    pergunta.append(perg)
                # else:
                #     pergunta = []
            if not pergunta:
                return 'Todas as perguntas foram respondidas', chat_resp.exists()
            return pergunta[0].pergunta, chat_resp.exists()
        return 'Todas as perguntas foram respondidas', False


class BotGlobal(ChatterBotApiView):
    ''' Class extendida do chatbot
    '''
    pass

class ChatEntrenvista(ChatVaga):
    ''' Class extendida do Adaptador Logico, só precisa sobrescrever vaga_id e
        cand_id.
    '''
    vaga_id = 3
    cand_id = 333

class BotEntrevista(ChatterBotApiView):
    def adaptadores(self):
        logic_adapters = [{
        # Adaptador logico, para respostas especificas.
            'import_path': 'pesquisa.views.views.ChatEntrenvista',
        }]
        return logic_adapters

@method_decorator(csrf_exempt, name='dispatch') # Esta view não  necessita do csrf
class SaveAudioBlob(View):
    '''Para gravar os binários em arquivo'''
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        path = default_storage.save('tmp/oba.mp3', ContentFile(file.read()))
        return JsonResponse({'status': 'ok'})
