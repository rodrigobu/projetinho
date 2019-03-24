import os
import base64
from time import time
from mimetypes import guess_type
from codecs import encode, decode
from subprocess import call

from apps.utils.types.strings import filtrar_string, tratar_inject_text
from apps.utils.textos import textos

class ExtracaoCV(object):

    TIPOS_PERMITIDOS_CURRICULO_DOC = {
        'DOC' : ['application/msword'],
        'DOCX': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        'ODT' : ['application/vnd.oasis.opendocument.text', 'application/x-vnd.oasis.opendocument.text'],
        'PDF' : ['application/pdf', 'application/save-as'],
        'TXT' : ['text/plain'],
        'RTF' : ['application/rtf', 'application/x-rtf', 'text/richtext']
    }

    def preparar_curriculo(self):
        ''' Prepara o texto do curriculo
        '''
        ## Extração do texto do curriculo
        sem_prefixo = '{}:'.format(textos.get('arquivo_pronto'))
        self.nome_arquivo = self.nome_arquivo.replace(sem_prefixo,'')

        try:
            import textract
            self.texto_do_cv = decode(textract.process(self.arquivo, encoding='utf-8'))
            self.texto_do_cv = ' '.join(self.texto_do_cv.split()) # Remover espaços repetidos para economizar espaço (sem trocadilhos)
            self.texto_do_cv = tratar_inject_text(self.texto_do_cv.lower()) # Remover HTML e InjectSQL
            self.texto_do_cv = filtrar_string(self.texto_do_cv.lower()) # Trocar Acentos e afins
        except Exception as msg:
            self.texto_do_cv = ''

        self.mime_type = guess_type(self.arquivo)[0]
        with open(self.arquivo, "rb") as f:
            encodedZip = base64.b64encode(f.read())
            self.bytes_encoded = encodedZip.decode()

        #os.system('rm -f "%s"' % self.arquivo)

        return True
