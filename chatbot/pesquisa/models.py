import datetime

from django.db import models
from django.utils import timezone

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('data publicada')

    class Meta:
        db_table = 'question'

    def __str__(self):
        return self.question_text

    def publicacao_recente(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    class Meta:
        db_table = 'choice'
        
    def __str__(self):
        return self.choice_text

class Entrevista(models.Model):
    entrevista = models.BooleanField(default=False)



    class Meta:
        db_table = 'entrevista'

    def __str__(self):
        return 'Entrevista is {}'.format(self.entrevista)


class ChatPerguntaVaga(models.Model):
    perfil_vaga = models.IntegerField()
    pergunta = models.CharField(max_length=100)
    tipo_pergunta = models.CharField(max_length=30)
    respondida = models.BooleanField(default=False)

    class Meta:
        db_table = 'chat_pergunta_vaga'

    def __str__(self):
        return self.pergunta


class ChatPerguntaResp(models.Model):
    vaga_id = models.IntegerField()
    pergunta = models.ForeignKey(ChatPerguntaVaga, on_delete=models.CASCADE)
    cand_id = models.IntegerField()
    resposta = models.CharField(max_length=200)

    class Meta:
        db_table = 'chat_pergunta_resp'
