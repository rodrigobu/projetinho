import json
import logging
import requests

from django.views.generic.base import TemplateView
from django.views.generic import View
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from pesquisa.models import ChatPerguntaVaga, ChatPerguntaResp
from pesquisa.views.mixins import ChatterBotApiView


class ChatterBotAppView(TemplateView):
    template_name = 'chat.html'
    entrevista = False

    def texto_inicial(self):
        return 'Bom dia sou, CHATBOT. Como vai você?', False

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        texto_inicial, tem_resposta = self.texto_inicial()
        context['nome_chatbot'] = 'BOT LEME'
        context['texto_inicial'] = texto_inicial
        context['tem_resposta'] = tem_resposta
        context['entrevista'] = self.entrevista

        return context


class BotAppEntrevista(ChatterBotAppView):
    entrevista = True
    def texto_inicial(self):
        cand_resp = ChatPerguntaResp()
        chat_perguntas = ChatPerguntaVaga.objects.filter(perfil_vaga=1)
        pergunta = []
        if chat_perguntas:
            for perg in chat_perguntas:
                chat_resp = ChatPerguntaResp.objects.filter(cand_id=333, pergunta=perg.id)
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

class BotEntrevista(ChatterBotApiView):
    def adaptadores(self):
        logic_adapters = [{
        # Adaptador logico, para respostas especificas.
            'import_path': 'pesquisa.views.mixins.ChatVaga',
        }]
        return logic_adapters

class SaveAudioBlob(View):

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        path = default_storage.save('tmp/oba.mp3', ContentFile(file.read()))
        return JsonResponse({'status': 'ok'})
    
