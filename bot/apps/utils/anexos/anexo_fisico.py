import os
import subprocess
from time import time

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils.translation import ugettext as _
from django.db import models

from apps.utils.textos import textos

from .valid_mixin import ValidMixin

class ArquivoMixin(ValidMixin):
    """ Mixin para Salvamento de Arquivos Físicos no Sistema """
    nome_arquivo = ""
    extensao = None
    pasta = ''
    subpasta = ''
    textos_key = ''

    def montar_arquivo_temp(self):
        self.nome_arq = "tmp/{}.{}".format(
            self.nome_arquivo,
            self.extensao or self.arq.name.split("/")[-1].split(".")[-1]
        )
        self.path = default_storage.save(self.nome_arq, ContentFile(self.arq.read()))
        self.tmp_file = os.path.join(settings.MEDIA_ROOT, self.path)

    def gerar_arquivo(self, request):
        ''' Executa a validação e geração do arquivo e daods para salvamento
        '''
        if request.FILES and self.chave_anexo in request.FILES:
            self.arq = request.FILES.get(self.chave_anexo)
            if not self.arq:
                return True, ()

            self.montar_arquivo_temp()

            valido, msg = self.file_format_valid(self.arq)
            if not valido:
                return False, msg

            valido, msg = self.gravar_arquivo()
            if not valido:
                return False, msg

            self.salvar_log(request)

        return True, ""

    def gravar_arquivo(self):
        ''' Grava o aquivo da pasta media '''
        try:
            caminho_arquivo = os.path.join(
                settings.MEDIA_ROOT,
                self.subpasta,
                self.pasta,
                "{}.{}".format(
                    self.nome_arquivo,
                    self.extensao
                )
            )
            comando = "cp {} {} ".format(self.tmp_file, caminho_arquivo)
            retorno = subprocess.call(comando, shell=True)
            return True, self.tmp_file
        except Exception as ex:
            return False, _(u"Não foi possivel realizar o upload: {}".format(ex))

    def salvar_log(self, request):
        ''' Log do salvamento  '''
        if not self.textos_key:
            return

        from apps.log.models import Log
        Log.log_processo(
            request,
            acao = textos.get(self.textos_key)
        )


class UploadImagem(ArquivoMixin):
    """ Classe para salvamento de imagens físicas no sistema """
    subpasta = 'images/'
    extensao = 'png'

    def file_format_valid(self, arquivo):
        ''' Executa a validação e geração do arquivo e daods para salvamento
        '''
        status, msg = self.validar_imagem(arquivo)
        if not status:
            return False, msg
        return True, ""
