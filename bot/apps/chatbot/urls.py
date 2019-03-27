from django.urls import path

from apps.chatbot.views import chatbot, cadastro, edicao


urlpatterns = [

    path('json/',
        chatbot.bot_global,
        name='chatbot.bot_global'
    ),

    path('json/<produto>/<permissao_produto>/<tipo_user>',
        chatbot.bot_global,
        name='chatbot.bot_global'
    ),

    path('json/entrevista/',
        chatbot.bot_entrevista,
        name='chatbot.bot_entrevista'
    ),

    # path('json/entrevista/<vaga>/<candidato>',
    #     chatbot.bot_entrevista,
    #     name='chatbot.bot_entrevista'
    # ),
    #
    # path('json/adpt/<vaga>/<candidato>',
    #     chatbot.chat_entrevista,
    #     name='chatbot.chat_entrevista'
    # ),

    path('audio/',
        chatbot.chat_audio_video,
        name='chatbot.audio_video'
    ),

    #cadastro
    path('cadastro/',
        cadastro.cadastro_texto,
        name="chatbot.cadastro.texto"
    ),
    path('edicao/<slug:id>/',
        edicao.edicao_texto,
        name='chatbot.edicao.texto'
    ),

]
