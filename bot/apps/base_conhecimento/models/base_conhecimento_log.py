from django.db import models

class BaseConhecimentoLog(models.Model):
    ''' Log da Base Conhecimento
    '''

    data = models.DateTimeField(
        verbose_name = 'Data',
        auto_now_add = True
    )

    usuario = models.IntegerField(
        verbose_name = "Usuario"
    )

    acao = models.TextField(
        verbose_name = 'Ação'
    )

    url = models.CharField(
        verbose_name = "Url",
        max_length = 200,
        null = True,
        blank = True
    )

    id_registro = models.IntegerField(
        null = True,
        blank = True
    )

    class Meta:
        db_table = "base_conhecimento_log"
        app_label = 'base_conhecimento'
        verbose_name = "Base Conhecimento Log"
        ordering = ['-data','usuario','acao']
        get_latest_by = 'id'



    def criar_log(self, usuario, acao, url, id_reg):
        self.usuario = usuario
        self.acao = acao
        self.url = url
        self.id_registro = id_reg
        self.save()
