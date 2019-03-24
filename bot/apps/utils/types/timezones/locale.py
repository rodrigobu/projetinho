#-*- coding: utf-8 -*-

from datetime import date
from django.conf import settings
from time import strptime


def get_format(attr, default=None, language='pt_BR'):
    """
       Exemplo de uso:
           get_format('DATE_FORMAT')
           get_format('DATE_INPUT_FORMATS')
    """
    try:
        formats = __import__('%s.%s.formats' %
                             (settings.FORMAT_MODULE_PATH, language))
        lang_module = getattr(formats, language)
        return getattr(getattr(lang_module, 'formats'), attr, default)
    except ImportError as ex:
        raise ex


def get_date(date_string, default_value=None):
    """
        Tenta converter a date_string recebida em um objeto
        date. Itera pelos formatos aceitos pelo locale padrão
        e tenta fazer as conversões até conseguir uma.
        Se não conseguir converter a string, ou se ela estiver
        vazia, retorna o valor de default_value.
    """
    date_formats = get_format('DATE_INPUT_FORMATS', ['%d/%m/%Y'])
    for fmt in date_formats:
        try:
            t = strptime(date_string, fmt)
            return date(t.tm_year, t.tm_mon, t.tm_mday)
        except ValueError:
            return default_value
    return default_value
