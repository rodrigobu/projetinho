import json
import requests

from django.views.generic.base import TemplateView
from django.views.generic import View
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from apps.chatbot.mixins import ChatterBotApiView, ChatVaga


class BotGlobal(ChatterBotApiView):
    ''' Class extendida do chatbot
    '''
    pass

bot_global = BotGlobal.as_view()


class ChatEntrevista(ChatVaga, View):
    ''' Class extendida do Adaptador Logico.
    '''
    pass

chat_entrevista = ChatEntrevista.as_view()

class BotEntrevista(ChatterBotApiView):
    # def adaptadores(self):
    #     logic_adapters = [{
    #         # Adaptador logico, para respostas especificas.
    #         'import_path': 'apps.chatbot.views.ChatEntrevista',
    #     }]
    #     return logic_adapters
    pass
bot_entrevista = BotEntrevista.as_view()


@method_decorator(csrf_exempt, name='dispatch') # Esta view não  necessita do csrf
class SaveAudioVideoBlob(View):
    '''Para gravar os binários em arquivo'''
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if file.name.endswith('mp3'):
            cur_fname = 'oba.mp3'
        elif file.name.endswith('mp4'):
            cur_fname = 'oba.mp4'

        path = default_storage.save(
            'tmp/' + cur_fname,
            ContentFile(file.read())
        )

        return JsonResponse({'status': 'ok'})

chat_audio_video = SaveAudioVideoBlob.as_view()
