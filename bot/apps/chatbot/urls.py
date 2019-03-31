from django.urls import path

from apps.chatbot.views import chatbot, cadastro, edicao, listagem, exclusao


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

    #cadastro texto
    path('cadastro/',
        cadastro.cadastro_texto,
        name="chatbot.cadastro.texto"
    ),
    path('edicao/',
        edicao.edicao_texto,
        name='chatbot.edicao.texto'
    ),
    path('edicao/<slug:id>/',
        edicao.edicao_texto,
        name='chatbot.edicao.texto'
    ),

    path('listagem/',
        listagem.listagem_texto,
        name='chatbot.listagem.texto'
    ),
    path('listagem/json/',
        listagem.listagem_texto_json,
        name='chatbot.listagem.texto.json'
    ),

    path('exclusao/',
        exclusao.exclusao_texto,
        name='chatbot.exclusao.texto'
    ),

    #cadastro conversa
    path('cadastro/conversa/',
        cadastro.cadastro_conversa,
        name="chatbot.cadastro.conversa"
    ),

    path('edicao/conversa/',
        edicao.edicao_conversa,
        name='chatbot.edicao.conversa'
    ),
    path('edicao/conversa/<slug:id>/',
        edicao.edicao_conversa,
        name='chatbot.edicao.conversa'
    ),

    path('listagem/conversa/',
        listagem.listagem_conversa,
        name='chatbot.listagem.conversa'
    ),
    path('listagem/conversa/json/',
        listagem.listagem_conversa_json,
        name='chatbot.listagem.conversa.json'
    ),

    path('exclusao/conversa/',
        exclusao.exclusao_conversa,
        name='chatbot.exclusao.conversa'
    ),
]
