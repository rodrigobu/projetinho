import base64
import uuid
import os

from django.db import models
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils.translation import ugettext as _

from apps.utils.types.sqls import sql_to_dict, consulta_valor_escalar_no_banco
from apps.utils.textos import textos

class FotoMixin(object):
    """ Classe para salvamento de fotos de usuarios """


    TIPOS_PERMITIDOS_FOTO = [
    'image/gif',  'image/jpeg', 'image/jpg',   'image/png',
    'image/tiff', 'image/bmp',  'image/x-png', 'image/pjpeg'
    ]

    def validar_formato(self, mime_type):
        return mime_type in self.TIPOS_PERMITIDOS_FOTO

    def validar_imagem(self, arq):
        '''
            Efetua verificações no arquivo de foto e armazena o mesmo na pasta temporaria.
            Retorna True e o nome do arquivo na pasta, caso passe nas validações.
                    False e mensagem de erro, caso contrário.
        '''
        mime_type = arq.content_type
        if not self.validar_formato(mime_type):
            return False, textos.get('arquivo_invalido')

        path = default_storage.save(
            u"tmp/"+str(arq.name),
            ContentFile(arq.read())
        )
        tmp_file = os.path.join(str(settings.MEDIA_ROOT), path)
        return True, tmp_file

    @classmethod
    def tem_foto(cls, id_colab):
        sql = """
        SELECT coalesce(length(bytes)>0, false)
            FROM {}
            WHERE user_id = {}
        """.format(
            cls._meta.db_table,
            int(id_colab)
        )
        return consulta_valor_escalar_no_banco(sql)

    @classmethod
    def salvarFoto(cls, registros, url_foto):
        """ Salva a foto recortada do registros.
        """
        try:
            if registros:
                nome_arq = url_foto.split('/')[-1]
                caminho_arq = os.path.join(settings.MEDIA_ROOT, 'tmp', nome_arq)
                friendly_name = nome_arq.split('___',1)[1] if nome_arq.count('___') else nome_arq

                arq = open(caminho_arq, 'rb')
                arq_read = arq.read()
                arq.close()
                foto_bytes = base64.encodestring(arq_read).decode("utf-8")

                user_foto = cls.objects.get_or_create(pk=registros.id)[0]
                user_foto.bytes = foto_bytes
                user_foto.nome_arquivo = friendly_name
                user_foto.save()
                # Remover arquivo de recorte
                os.remove(caminho_arq)
                return True

        except Exception as msg:
            raise Exception(msg)

        return False
