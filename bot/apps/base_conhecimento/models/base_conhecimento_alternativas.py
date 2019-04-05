from django.db import models

class BaseConhecimentoAlternativas(models.Model):
    ''' Log da Base Conhecimento
    '''

    resposta = models.IntegerField()

    alternativa = models.CharField(
        verbose_name = 'Alternativa',
        max_length = 150,
        null = True,
        blank = True
    )

    class Meta:
        db_table = "base_conhecimento_alternativas"
        app_label = 'base_conhecimento'
        verbose_name = "Base Conhecimento Log"
        ordering = ['resposta','alternativa']
        get_latest_by = 'id'

    def __str__(self):
        return str(self.id)


    def criar_alternativas(self, resposta, alternativa):
        print ('alternativa', alternativa)
        if alternativa:
            self.resposta = resposta
            self.alternativa = alternativa
            self.save()
