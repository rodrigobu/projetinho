import os
from time import time
from mimetypes import guess_type
from codecs import encode, decode
from subprocess import call
from PIL import Image

from django.conf import settings
from django.http import HttpResponse
from django.utils import timezone
from django.utils.translation import ugettext as _
from django.db import models

from apps.utils.textos import textos


class ValidMixin(object):
    """ Fields e métodos de anexos simples - sem os campos
    contem as validações globais de arquivos
    """
    diretorio_tmp = "{}/tmp/".format(settings.MEDIA_ROOT)
    msg_file_generic_valid_error_key = 'anexo_invalido_formato'

    valida_virus = False
    valida_imagem = False
    valida_extensao = False
    valida_tamanho = True

    img_altura = 170
    img_largura = 330
    tamanho = 100000
    tamanho_lbl = '00kB'
    img_format = 'JPEG'
    img_format_lbl = '.jpg'

    SIZES = {
        '2.5' : 2621440,
        '5'   : 5242880,
        '500' : 429916160
    }

    SIZES_LABELS = {
        '2.5' : '2.5 MB',
        '5'   : '5 MB',
        '500' : '500 MB'
    }

    def get_lista_formatos(self):
        formatos = list(self.TIPOS_PERMITIDOS_CV.keys())
        formatos += list(self.TIPOS_PERMITIDOS_IMG.keys())
        return formatos

    @property
    def help_file_valid(self):
        msg_erro = textos.get('formatos_permitidos')
        return msg_erro.format(', '.join(self.get_lista_formatos()))

    @property
    def msg_file_generic_valid_error(self):
        msg_erro = textos.get(self.msg_file_generic_valid_error_key)

        if not msg_erro:
            msg_erro = textos.get('anexo_invalido_formato')

        return msg_erro % ', '.join(self.get_lista_formatos())

    @property
    def msg_mime_type_error(self):
        return textos.get('anexo_invalido_type_error')

    @property
    def msg_size_error(self):
        return textos.get('anexo_invalido_type_error')

    @property
    def msg_virus_error(self):
        return textos.get('anexo_invalido_virus_error')

    @property
    def msg_img_dimensao_erro(self):
        return textos.get('imagem_invalida_dimensao_error')

    @property
    def msg_img_tamanho_erro(self):
        return textos.get('imagem_invalida_tamanho_error')

    @property
    def msg_img_extensao_erro(self):
        return textos.get('imagem_invalida_extensao_error')

    @property
    def msg_img_erro(self):
        return textos.get('imagem_invalida_error')

    TIPOS_PERMITIDOS_CV = {
        'DOC' : ['application/msword', 'application/wps-office.doc'],
        'DOCX': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/wps-office.docx'],
        'PDF' : ['application/pdf', 'application/save-as'],
        'TXT' : ['text/plain'],
    }

    TIPOS_PERMITIDOS_IMG = {
        'JPG' : ['image/jpg', 'image/jpeg', 'image/pjpeg'],
        'PNG' : ['image/png']
    }

    def get_msg_size_error(self, tamanho_lbl=""):
        return "%s %s" % (
            self.msg_size_error,
            tamanho_lbl
        )

    def get_mimetype(self, arquivo):
        """Função pega o tipo do arquivo

        Argumentos chaves:
        arquivo -- recebe o arquivo do fomulario
        """
        mime_type = guess_type(arquivo.name)[0]
        if not mime_type:
            return ""
        return mime_type

    def get_file_doc_format(self):
        return self.TIPOS_PERMITIDOS_CV.values()

    def get_file_img_format(self):
        return self.TIPOS_PERMITIDOS_IMG.values()

    def file_doc_format(self, mime_type):
        documento = any( [mime_type in lista_tipos for lista_tipos in self.get_file_doc_format()] )
        imagem = any( [mime_type in lista_tipos for lista_tipos in self.get_file_img_format()] )
        return documento or imagem

    def file_generic_valid(self, arquivo):
        # Valida se pertence a doc
        mime_type = arquivo.content_type
        valido = any( [ self.file_doc_format(mime_type) ] )
        return valido

    def validar_extensao(self, arquivo):
        ''' Validação de extensão '''
        if self.valida_extensao:
            mime_type = guess_type(arquivo.name)[0]
            if not mime_type:
                return False, self.msg_mime_type_error
            if not self.file_generic_valid(arquivo):
                return False, self.msg_file_generic_valid_error
        return True, ""

    def validar_tamanho(self, arquivo, tamanho, tamanho_lbl=""):
        ''' Validação de extensão '''
        if tamanho:
            if arquivo.size >= tamanho :
                return False, self.get_msg_size_error(tamanho_lbl)
        return True, ""

    def validar_virus(self, arquivo):
        ''' Validação de extensão
        ### OBS: o antivirus esta desabilitado por tempo indeterminado.
        '''
        return True, "" ## remover isso caso o processo volte

        if self.valida_virus:
            if self.has_virus(arquivo):
                return False, self.msg_virus_error
        return True, ""

    def validar_imagem(self, arquivo):
        ''' Validação de imagem '''
        try:
            try:
                imagem = Image.open(self.tmp_file, 'r')
            except:
                imagem = Image.open(arquivo, 'r')
            ## - Validação de Tamanho e Tipo
            if self.valida_tamanho:
                largura, altura = imagem.size

                if self.img_largura and self.img_altura:
                    if largura>self.img_largura or altura>self.img_altura:
                        return False, self.msg_img_dimensao_erro.format(
                           self.img_largura, self.img_altura
                        )

                if self.tamanho:
                    if arquivo.size >= self.tamanho:
                        return False, self.msg_img_tamanho_erro.format(
                           self.tamanho_lbl
                        )

            if self.img_format:
                if isinstance(self.img_format, list):
                    condicao = not imagem.format in self.img_format
                else:
                    condicao = imagem.format != self.img_format

                if condicao:
                    return False, self.msg_img_extensao_erro.format(
                       self.img_format_lbl
                    )

            ## - Validação de virus
            #if self.has_virus(tmp_file):
            #    return False, _(u"O arquivo pode estar infectado com vírus. Insira outro arquivo.")

        except Exception as msg:
            if "cannot identify image fil" in str(msg):
                return False, self.msg_img_erro
            return False, str(msg)
        return True, ""

    def has_virus(self, url_arquivo):
        """Função para verificar existencia de virus em arquivos.
        Utiliza o antivirus do Linux (Ubuntu/Debian), o Clam.
        Executa o comando:
         - clamscan -r -i  ~/url/do/arquivo.extensao
        Fórum que podem ajudar:
         - http://www.bropen.com/index.php?option=com_content&view=article&id=8:clamavubuntu-instalando-e-utilizando-o-clamav&catid=10:tutoriais-linux&Itemid=107
        Recebe a url do arquivo salvo no servidor
        Retorna True caso esteja infectado.
        Retorna False caso esteja "saudavel".
        (!!) Obs. O arquivo é eliminado do servidor caso tenha virus, não utilize mais o link dele,
                  o sistema não irá mais achar esse arquivo !.
        Foi necessário utilizar ele ao invéz da lib pyclamav, pois essa não funciona no virtualenv.
        """
        isvirus = call("clamscan -r -i "+url_arquivo, shell=True)
        if isvirus:
            os.remove(url_arquivo) # Remove o arquivo se houver virus.
            return True
        return False
