import re
import random
import string
from html.parser import HTMLParser

from apps.utils.types import RegExps


def generate_key_string(segmentos_char=6, segmentos=1):
    '''
       gerar strings randomicas
       segmentos_char: numero de caracteres por segmento
       segmentos: numero de segmentos
    '''
    tokens = string.ascii_uppercase + string.digits  # quais caracteres aceitos
    key_string = ''  # chave a ser gerada

    for x in range(segmentos):
        key_string += ''.join(random.choice(tokens)
                              for y in range(segmentos_char))
        if x < segmentos - 1:
            key_string += '-'

    return key_string


def clean_text(s):
    """
        Recebe uma string e a retorna com os acentos removidos
    """

    dict_conversao = {
        'a': [u'á', u'à', u'â', u'ä', u'ã', u'å'],
        'ae': [u'æ'],
        'c': [u'ç'],
        'd': [u'Þ'],
        'e': [u'é', u'è', u'ê', u'ë'],
        'i': [u'í', u'ì', u'î', u'ï'],
        'n': [u'n'],
        'o': [u'ó', u'ò', u'ô', u'ö', u'õ', u'ø'],
        'ss': [u'ß'],
        'u': [u'ú', u'ù', u'û'],
        'A': [u'Á', u'À', u'Â', u'Ä', u'Ã', u'Å'],
        'C': [u'Ç'],
        'E': [u'É', u'È', u'Ê', u'Ë'],
        'I': [u'Í', u'Ì', u'Î', u'Ï'],
        'N': [u'Ñ'],
        'O': [u'Ó', u'Ò', u'Ô', u'Ö', u'ÕØ'],
        'U': [u'Ú', u'Ù', u'Û'],
    }

    conversao = {}
    for key, value in dict_conversao.items():
        for l in value:
            conversao[l] = key
    for original, novo in conversao.items():
        if not s == None:
            try:
                s = s.replace(original, novo)
            except:
                pass
    return s


def filtrar_string(valor, permitidos='abcdefghijklmnopqrstuvwxyz ,.-0123456789'):
    valor = valor.replace(u'ç', 'c').replace(u'Ç', 'c')
    valor = valor.replace(u'uee', u'ue').replace(u'üee', u'üe') # tranforma 'uê' em 'uee' e 'üê' em 'üee'
    filtrado = ''
    for char in clean_text(valor).lower():
        try:
            if not char in permitidos:
                filtrado += ' '
            else:
                filtrado += char
        except:
            filtrado += ' '
    return filtrado


def randomString(string_length=54):
    chars = string.ascii_letters + string.digits
    return ''.join([random.choice(chars) for i in range(string_length)])


def safe_encode(text):
    encodings = ('utf-8', 'iso-8859-1', 'iso-8859-5',
                 'iso-8859-7', 'windows-1253', 'ibm855', 'macgreek')

    for enc in encodings:
        try:
            return text.decode(enc)
        except Exception:
            pass

    return text


def tratar_inject_ckeditor(texto):
    ''' Função de tratamento de textos do CK Editor.
    Remove potenciais scripts injections
    '''
    if not texto:
        return ""
    # Remoções de código
    REMOVE_LIST = [
        r'(?i)<[^<]+?[BODY|SCRIPT|STYLE|HEAD]>',
        r'(?i)onError',
    ]
    for value in REMOVE_LIST:
        texto = re.sub(value, '', texto)

    # Substituições específicas
    REPLACE_DICTS = {
        "<strong>": '<span style="font-weight: bold">',
        "</strong>": '</span>',
    }
    for key, value in REPLACE_DICTS.items():
        texto = texto.replace(key, value)

    return texto


def tratar_inject_text(texto):
    '''
    Remove todos os espaços a mais no começo, meio e fim da string e qualquer
    tag HTML.
    '''
    if not texto:
        return ""
    # Remoções de código
    REMOVE_LIST = [
        '<[^<]+?>',
    ]
    for value in REMOVE_LIST:
        texto = re.sub(value, '', texto)

    # Substituições específicas
    REPLACE_DICTS = {
        u'\xa0': '',
        '[\s]{2,n}': '\s',
    }
    for key, value in REPLACE_DICTS.items():
        texto = texto.replace(key, value)

    texto = texto.strip()
    return texto


def tratar_apenas_digitos(valor, default=None):
    """
        Recebe uma string ('valor') e retorna uma cópia dela contendo
        apenas dígitos (removendo outros caracteres).
        Se o resultado for uma string vazia, o valor retornado
        será o que for passado para o parâmetro 'default'.
    """
    return "".join(re.findall('\d+', valor)) or default


def exibicaoIntervalo(item_inicial, item_final, campo_para_exibicao=None):
    if item_inicial and item_final:

        obj_inicio = item_inicial.__getattribute__(campo_para_exibicao) if campo_para_exibicao else item_inicial
        obj_final = item_final.__getattribute__(campo_para_exibicao) if campo_para_exibicao else item_final

        if item_inicial != item_final:
            return u'de {} até {}'.format(
                obj_inicio, obj_final
            )
        else:
            return obj_inicio

    elif item_inicial:
        obj_inicio = item_inicial.__getattribute__(campo_para_exibicao) if campo_para_exibicao else item_inicial
        return u'a partir de {}'.format(obj_inicio)

    elif item_final:
        obj_final = item_final.__getattribute__(campo_para_exibicao) if campo_para_exibicao else item_final
        return u'até %s' % obj_final

    return ''
