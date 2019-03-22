from django.urls import path

from apps.chatbot import views, mixins


urlpatterns = [

    path('json/',
        views.bot_global,
        name='chatbot.bot_global'
    ),

    path('json/entrevista/',
        views.bot_entrevista,
        name='chatbot.bot_entrevista'
    ),

    path('json/entrevista/<vaga>/<candidato>',
        views.bot_entrevista,
        name='chatbot.bot_entrevista'
    ),

    path('json/adpt/<vaga>/<candidato>',
        views.chat_entrevista,
        name='chatbot.chat_entrevista'
    ),

    path('audio/',
        views.chat_audio_video,
        name='chatbot.audio_video'
    ),

]
