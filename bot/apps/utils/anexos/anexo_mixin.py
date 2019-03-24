import os
import base64
from datetime import datetime
from time import time
from mimetypes import guess_type
from codecs import encode, decode

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.db import models
from django.http import HttpResponse
from django.utils.translation import ugettext as _

from apps.utils.types.sqls import consulta_valor_escalar_no_banco
from apps.utils.textos import textos

from .valid_mixin import ValidMixin


class AnexoMixin(models.Model, ValidMixin):
    """ Mixin para Salvamento de Arquivos via Banco
    Utilizar com models
    """
    nome_completo = True ## Usar o nome completo no nome do temporário
    prefixo_nome = '' ## Prefixo para o nome do temporário
    chave_anexo = 'anexo' ## Nome do arquivo vindo do request
    tamanho = '5' ## Tamanho máximo em MB do arquivo (ver ValidMixin.SIZES)
    extensao = None
    campo_db = 'documento'

    nome_arquivo = models.CharField(
        verbose_name = _(u'Nome do Arquivo'),
        max_length = 255,
        blank=True, null=True
    )

    mime_type = models.CharField(
        verbose_name = _(u'Tipo do Arquivo'),
        max_length = 100,
        blank=True, null=True
    )

    documento = models.TextField(
        verbose_name=_(u'Arquivo:'),
        blank=True
    ) # BYTEA

    dt_cadastro  = models.DateTimeField(
        verbose_name = _(u'Data de Inserção'),
        auto_now_add=True
    )

    dt_atualizacao = models.DateTimeField(
        verbose_name = _(u'Data de Alteração'),
        auto_now_add=True
    )

    class Meta:
        abstract = True

    def delete_dir(self, caminho, nome_arquivo):
        """Função deleta os arquivos temporários criados.

        Argumentos chaves:
        caminho -- string com o diretorio da media/tmp/
        nome_arquivo -- string com o nome do arquivo
        """
        os.system('rm -rf "{}"'.format(nome_arquivo))
        os.system('rm -f "{}"'.format(caminho))

    def get_arquivo(self):
        return self.documento

    def tem_documento(self):
        sql = "SELECT coalesce(length(%s)>0, false) FROM %s WHERE id=%s" % (
            self.campo_db,
            self._meta.db_table,
            self.id
        )
        tem_documento = consulta_valor_escalar_no_banco(sql)
        return tem_documento

    @classmethod
    def doc_tem_documento(cls, id):
        sql = "SELECT coalesce(length(%s)>0, false) FROM %s WHERE id=%s" % (
            cls.campo_db,
            cls._meta.db_table,
            id
        )
        tem_documento = consulta_valor_escalar_no_banco(sql)
        return tem_documento

    def download(self):
        ''' Decodifica o arquivo e gera um response
        '''
        nome_arquivo = self.nome_arquivo
        mime_type = self.mime_type or guess_type(nome_arquivo)[0]
        #arquivo = decode(self.get_arquivo(), 'base64')
        arquivo = base64.b64decode(self.get_arquivo())

        response = HttpResponse(arquivo, content_type=mime_type)
        response['Cache-Control'] = 'public'
        response['Content-Description'] = 'File Transfer'
        filename = nome_arquivo.replace("\n","") if nome_arquivo else 'arquivo'
        try:
            response['Content-Disposition'] = 'attachment; filename="%s"' % filename
        except:
            response['Content-Disposition'] = 'attachment; filename="arquivo"'
        response['Content-Transfer-Encoding'] = 'binary'
        return response

    #### Upload e Validação do Arquivo Físico Temporário

    def file_format_valid(self, arquivo, tamanho=None, tamanho_lbl=""):
        ''' Validações do arquivo
        '''
        # Validação de extensão
        status, msg = self.validar_extensao(arquivo)
        if not status:
            return False, msg

        # Verificação do arquivo
        status, msg = self.validar_tamanho(
            arquivo,
            self.SIZES.get(self.tamanho, None),
            self.SIZES_LABELS.get(self.tamanho, "")
        )
        if not status:
            return False, msg

        # - Validação de virus
        #status, msg = self.validar_virus(arquivo)
        #if not status:
        #    return False, msg

        return True, ""

    def _confecao_nome(self, arquivo):
        ''' Confeciona o nome temporário do arquivo para evitar duplicidades
        e sobreescrita de arquivos na pasta temproaria
        '''
        tempo = str(time()).replace('.', '_')

        if self.nome_completo:
            nome = '_' + arquivo.name ## Usar o nome completo no nome do temporário
        else:
            nome = '.' + arquivo.name.split('.')[-1] ## Apenas agregar extensao

        self.nome_arquivo = '{}{}{}'.format(
            self.prefixo_nome, tempo, nome
        )
        return self.nome_arquivo

    def gravar_temporario(self, caminho, arquivo):
        ''' Grava o arquivo fisico
        '''
        return default_storage.save(
            caminho,
            ContentFile(arquivo.read())
        )

    def get_arquivo_temporario_path(self, path):
        ''' Anexa o nome do arquivo com a pasta media
        '''
        tmp_file = os.path.join(settings.MEDIA_ROOT, 'tmp', path)
        return tmp_file

    def montar_arquivo_temporario(self):
        ''' Confeciona o nome, caminho e grava o arquivo fisico.
        '''
        self.nome_arquivo = self._confecao_nome(self.arquivo)
        self.caminho_arquivo = self.get_arquivo_temporario_path(self.nome_arquivo)
        self.caminho_arquivo = self.gravar_temporario(
            self.caminho_arquivo,
            self.arquivo
        )

    def gerar_arquivo(self, request):
        ''' Executa a validação e geração do arquivo e daods para salvamento
        '''
        ## Confecção do arquivo temporário
        if request.FILES and self.chave_anexo in request.FILES:
            self.arquivo = request.FILES.get(self.chave_anexo)
            if not self.arquivo:
                return True, ()
        self.montar_arquivo_temporario()

        ## Extração de dados dele e validação
        self.mime_type = guess_type(self.caminho_arquivo)[0]
        valido, msg = self.file_format_valid(self.arquivo, self.tamanho)
        if not valido:
            return False, msg

        ## Confecção do retorno
        msg = '{}: {}'.format(
            textos.get('arquivo_pronto'),
            self.arquivo.name
        )
        retorno = [
            self.caminho_arquivo,
            msg
        ]
        return True, retorno

    def preparar_salvamento(self):
        '''Esse metodo configura mime_type e campo documento/anexo
        '''
        sem_prefixo = '{}:'.format(textos.get('arquivo_pronto'))
        self.nome_arquivo = self.nome_arquivo.replace(sem_prefixo,'')

        self.mime_type = guess_type(self.arquivo)[0]

        try:
            with open(self.arquivo, "rb") as f:
                encodedZip = base64.b64encode(f.read())
                self.documento = encodedZip.decode()
        except:
            return False, textos.get('arquivo_invalido')

        self.dt_alteracao = datetime.now()
        return True

    def deletar_arquivo_temporario(self):
        os.system('rm -f "%s"' % self.arquivo)

    def deletar_documento(self):
        '''Esse metodo salva como uma string vazia quando o usuario clica para
        remover documento no cadatro/edicao'''
        self.nome_arquivo = ''
        self.documento = ''
        self.mime_type = ''
        self.save()

class AnexoDocMixin(AnexoMixin):
    ''' Especial para documentos de pdf, texto ou word
    '''

    class Meta:
        abstract = True

    def file_doc_format(self, mime_type):
        return any( [mime_type in lista_tipos for lista_tipos in self.get_file_doc_format()] )

    def get_lista_formatos(self):
        formatos = list(self.TIPOS_PERMITIDOS_CV.keys())
        return formatos


class AnexoImgMixin(AnexoMixin):
    ''' Especial para documentos de imagem sem recorte
    '''

    class Meta:
        abstract = True

    def file_doc_format(self, mime_type):
        return any( [mime_type in lista_tipos for lista_tipos in self.get_file_img_format()] )

    def get_lista_formatos(self):
        formatos = list(self.TIPOS_PERMITIDOS_IMG.keys())
        return formatos
