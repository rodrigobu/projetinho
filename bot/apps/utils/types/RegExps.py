"""
    Colocar neste módulo as expressões regulares reutilizadas no sistema.
"""
import re


def re_inicia(regex):
    " Retorna a regex recebida com um circunflexo (^) no início. "
    return '^%s' % regex

def re_termina(regex):
    " Retorna a regex recebida com um cifrão ($) no final. "
    return '%s$' % regex

def re_exata(regex):
    " Retorna a regex recebida com um circunflexo (^) no início e um cifrão ($) no final. "
    return re_termina(re_inicia(regex))

def re_inteiro(max_length):
    " Retorna a regex de inteiro."
    return r'^[0-9]{{0,{max}}}$'.format(max=max_length)

def re_decimal(max_length):
    " Retorna a regex de decimal."
    return r'^[0-9]{{1,{max}}}[,|.][0-9]{{2}}$'.format(max=max_length-2)


CPF = r'\d{3}\.?\d{3}\.?\d{3}-?\d{2}'

DATA = r'(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/\d{4}'

EMAIL = '[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?'

ENDERECO_IP = r'^(([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\.){3}([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5]){1}$'

MULTIPLOS_ESPACOS = r'\s{2,}'

DDD = r'^[0-9]{2,3}$' #11 ou 011

TELEFONE = r'^[0-9]{8,9}$'

DDDTELEFONE = r'^[0-9]{8,11}$'

# Número completo de celular, com código do país e código de área (DDD)
# 55DDNNNNNNNN: 55 -> Cod. país; DD -> Cod. área (DDD); NNNNNNNN -> Número
# do celular (8 ou 9 dígitos)
CELULAR_COMPLETO = r'^\d{2}\d{2}\d{8,9}$'

CEP = re.compile(r'^(\d{8})$')  # 09271480 (CEP sem traço))

TEMPO_MS = re.compile(r'^\d{1,2}:[012345]\d$')  # 00:00 até 99:59

MES_ANIVERSARIO = r'(0[1-9]|[12][0-9]|3[01])[/|-](0[1-9]|1[012])'

DECIMAL = r"^[0-9]{1,2}[,|.][0-9]{2}$"

DECIMAL2 = r"^[0-9]{1,3}[,|.][0-9]{2}$"

DECIMAL3 = r"^[0-9]{1,4}[,|.][0-9]{2}$"

DECIMAL4 = r"^[0-9]{1,5}[,|.][0-9]{2}$"

DECIMAL5 = r"^[0-9]{1,6}[,|.][0-9]{2}$"

INTEIRO1 = r'^[0-9]{1}$'

INTEIRO2 = r'^[0-9]{1,2}$'

INTEIRO3 = r'^[0-9]{1,3}$'

URL = r'^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'
