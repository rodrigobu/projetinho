#-*- coding: utf-8 -*-
import os
from time import time
from decimal import *
from datetime import datetime
from mimetypes import guess_type
from codecs import encode, decode
from subprocess import call, check_output
from xml.etree import ElementTree

from django.conf import settings
from django.http import HttpResponse
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.db import models

from apps.utils.types.sqls import sql_to_dict, executar_sql, consulta_valor_escalar_no_banco
from apps.utils.types.data_e_hora import convert_data_to_ptbr, convert_strpt_to_date
from model_utils.managers import InheritanceManager
from apps.utils.textos import textos


class CreateMixin(models.Model):

    """ Fields e métodos de cadastro """

    dt_cadastro = models.DateTimeField(
        verbose_name = textos.get('data_cadastro'),
        default = datetime.now
    )
    dt_atualizacao = models.DateTimeField(
        verbose_name = textos.get('data_atualizacao'),
        auto_now = True
    )
    usuario_atualizacao = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank = True,
        null = True,
        verbose_name = textos.get('usuario_atualizacao'),
        related_name = '%(app_label)s_%(class)s_usuario_atualizacao_id',
        on_delete = models.DO_NOTHING
    )

    class Meta:
        abstract = True

    def save_as_created(self, usuario_atualizacao, commit=True,
                        dt_cadastro=None):
        if isinstance(usuario_atualizacao, int):
            self.usuario_atualizacao_id = usuario_atualizacao
        elif isinstance(usuario_atualizacao, (str, unicode)) and usuario_atualizacao.isdigit():
            self.usuario_atualizacao_id = int(usuario_atualizacao)
        else:
            self.usuario_atualizacao = usuario_atualizacao
        if dt_cadastro is None:
            self.dt_cadastro = timezone.now()
        else:
            self.dt_cadastro = dt_cadastro
        if commit is True:
            self.save()
        return self

class ModelMasterMixin(CreateMixin):

    """ Model Base do SPA com opções criação, remoção """

    @classmethod
    def get_or_none(cls, id):
        if id == "undefined":
            id = ""
        if id:
            try:
                return cls.objects.get(pk=id)
            except:
                try:
                    return cls.objects.get(slug=id)
                except:
                    return None
        return None

    class Meta:
        abstract = True
