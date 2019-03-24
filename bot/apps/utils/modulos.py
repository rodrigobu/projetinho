#-*- coding: utf-8 -*-
from django.db import connection

from django.conf import settings

def is_modulo_plus():
    """ Retorna True se o cliente estiver usando o módulo plus, e False caso contrário.
    TODO: PRECISA MIGRAR PRA NOVA VERSÃO """
    return settings.MODULO_PLUS

def is_modulo_pme():
    """ Retorna True se o cliente estiver usando o módulo PME, e False caso contrário.
    TODO: PRECISA MIGRAR PRA NOVA VERSÃO """
    return settings.MODULO_PME


def is_portal_cliente():
    """ Retorna True se o cliente utilizar o portal do cliente
    Retorna False caso contrário.
    """
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT usa_portal_cliente FROM parametros_modulos LIMIT 1;')
        row = cursor.fetchone()
        if row:
            row = row[0]
    finally:
        cursor.close()
    return row

def is_impressao_documentos():
    """ Retorna True se o cliente utiliza impressao de documentos
    Retorna False caso contrário.
    """
    from django.db import connection

    cursor = connection.cursor()
    try:
        cursor.execute('SELECT usa_impressao_documento FROM parametros_modulos LIMIT 1;')
        row = cursor.fetchone()
        if row:
            row = row[0]
    finally:
        cursor.close()
    return row

def is_integra_catho():
    """ Retorna True se o cliente utiliza vagas em aberto recepção
    Retorna False caso contrário.
    """
    cursor = connection.cursor()
    try:
        cursor.execute('SELECT usa_integra_catho FROM parametros_modulos LIMIT 1;')
        row = cursor.fetchone()
        if row:
            row = row[0]
    finally:
        cursor.close()
    return row
