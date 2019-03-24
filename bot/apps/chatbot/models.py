from django.db import models


class ChatTexto(models.Model):
    ''' Model das respostas dos candidatos à entrevista da vaga
    '''

    text = models.CharField(
        verbose_name='Texto',
        null = False,
        blank = False,
        max_length=400
    )

    extra_data = models.CharField(
        verbose_name="Extra Data",
        max_length = 500,
    )

    class Meta:
        app_label = 'chatbot'
        db_table = 'django_chatterbot_statement'
        ordering = ['text']
        get_latest_by = 'id'
