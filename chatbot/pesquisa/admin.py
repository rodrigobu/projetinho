from django.contrib import admin

# Register your models here.
from django.contrib import admin

from pesquisa.models import Question, Entrevista, ChatPerguntaResp, ChatPerguntaVaga

admin.site.register(Question)
admin.site.register(Entrevista)
admin.site.register(ChatPerguntaResp)
admin.site.register(ChatPerguntaVaga)
