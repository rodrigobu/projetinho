#-*- coding: utf-8 -*-

from datetime import datetime
from pytz import timezone, utc
from django.conf import settings
from .locale import get_date, get_format

timezone_dicts = [
    {'cod':  1,     'display': u'Acre',
        'tzname': 'America/Rio_Branco'},
    {'cod':  2,     'display': u'Alagoas',
        'tzname': 'America/Maceio'},
    {'cod':  3,     'display': u'Amapá',
        'tzname': 'America/Belem'},
    {'cod':  4,     'display':
        u'Amazonas (leste - America/Manaus)',    'tzname': 'America/Manaus'},
    {'cod':  5,     'display':
        u'Amazonas (oeste - America/Eirunepe)',  'tzname': 'America/Eirunepe'},
    {'cod':  6,     'display': u'Bahia',
        'tzname': 'America/Bahia'},
    {'cod':  7,     'display': u'Ceará',
        'tzname': 'America/Fortaleza'},
    {'cod':  8,     'display': u'Distrito Federal',
        'tzname': 'America/Sao_Paulo'},
    {'cod':  9,     'display': u'Espírito Santo',
        'tzname': 'America/Sao_Paulo'},
    {'cod': 10,     'display': u'Fernando de Noronha',
        'tzname': 'America/Noronha'},
    {'cod': 11,     'display': u'Goiás',
        'tzname': 'America/Sao_Paulo'},
    {'cod': 12,     'display': u'Maranhão',
        'tzname': 'America/Fortaleza'},
    {'cod': 13,     'display': u'Mato Grosso',
        'tzname': 'America/Cuiaba'},
    {'cod': 14,     'display': u'Mato Grosso do Sul',
        'tzname': 'America/Campo_Grande'},
    {'cod': 15,     'display': u'Minas Gerais',
        'tzname': 'America/Sao_Paulo'},
    {'cod': 16,     'display': u'Paraná',
        'tzname': 'America/Sao_Paulo'},
    {'cod': 17,     'display': u'Paraíba',
        'tzname': 'America/Fortaleza'},
    {'cod': 18,     'display':
        u'Pará (leste - America/Belem)',     'tzname': 'America/Belem'},
    {'cod': 19,     'display':
        u'Pará (oeste - America/Santarem)',  'tzname': 'America/Santarem'},
    {'cod': 20,     'display': u'Pernambuco',
        'tzname': 'America/Recife'},
    {'cod': 21,     'display': u'Piauí',
        'tzname': 'America/Fortaleza'},
    {'cod': 22,     'display': u'Rio Grande do Norte',
        'tzname': 'America/Fortaleza'},
    {'cod': 23,     'display': u'Rio Grande do Sul',
        'tzname': 'America/Sao_Paulo'},
    {'cod': 24,     'display': u'Rio de Janeiro',
        'tzname': 'America/Sao_Paulo'},
    {'cod': 25,     'display': u'Rondônia',
        'tzname': 'America/Porto_Velho'},
    {'cod': 26,     'display': u'Roraima',
        'tzname': 'America/Boa_Vista'},
    {'cod': 27,     'display': u'Santa Catarina',
        'tzname': 'America/Sao_Paulo'},
    {'cod': 28,     'display': u'Sergipe',
        'tzname': 'America/Maceio'},
    {'cod': 29,     'display': u'São Paulo',
        'tzname': 'America/Sao_Paulo'},
    {'cod': 30,     'display': u'Tocantins',
        'tzname': 'America/Araguaina'}
]

TIMEZONES_WORKAROUND = getattr(settings, 'TIMEZONES_WORKAROUND', {})
for cod, nova_tz in TIMEZONES_WORKAROUND.items():
    filter(lambda x: x['cod'] == cod, timezone_dicts)[0]['tzname'] = nova_tz

CHOICES_TIMEZONE = [(t['cod'], t['display']) for t in timezone_dicts]


def get_tzname(cod):
    """
        Recebe o código de uma timezone (número inteiro) e retorna
        o name dessa timezone. Códigos inválidos retornarão
        a timezone definida nas settings do projeto.
    """
    tz_dicts = filter(lambda tz: tz['cod'] == cod, timezone_dicts)
    if tz_dicts:
        return tz_dicts[0]['tzname']
    else:
        return settings.TIME_ZONE


def dt_to_utc(dt, tzname_origem=settings.TIME_ZONE):
    """
        Converte um horário de uma timezone qualquer para a timezone do UTC.
    """
    if not dt:
        return None
    if dt.tzinfo:
        dt = datetime(
            dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second, dt.microsecond)
    tz_origem = timezone(tzname_origem)
    dt_origem = tz_origem.localize(dt)
    dt_utc = utc.normalize(dt_origem.astimezone(tz_origem))
    return dt_utc


def dt_from_utc(dt, tzname_destino=settings.TIME_ZONE):
    """
        Converte um horário da timezone do UTC para uma timezone qualquer.
    """
    if not dt:
        return None
    if not dt.tzinfo:
        dt = utc.localize(dt)
    tz_destino = timezone(tzname_destino)
    dt_destino = tz_destino.normalize(dt.astimezone(utc))
    return dt_destino


def dt_to_naive_dt(dt):
    """
        Recebe um datetime (com timezone ou não) e retorna um novo datetime
        com os mesmos valores, porém sem nenhuma timezone associada.
    """
    return datetime(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second)
