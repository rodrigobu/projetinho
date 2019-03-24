from django.conf import settings

from apps.utils.icones import icones
from apps.utils.textos import textos
from apps.utils.types import RegExps

from apps.vaga_requerida.models import VagaRequerida
from apps.parametros.models import Parametros


def setup_icones(request):
    '''
    Função pega os icones padronizados do sistema e injeta nos templates
    '''
    return {
        'ICONES' : icones
    }


def setup_textos(request):
    '''
    Função pega os textos padronizados do sistema e injeta nos templates
    '''
    return {
        'TEXTOS' : textos
    }


def setup_regex(request):
    '''
    Função pega os textos padronizados do sistema e injeta nos templates
    '''
    return {
        'REGEX' : RegExps
    }


def setup_modulos(request):
    '''
    Função pega as padronizações do sistema que o cliente consome
    '''
    Parametros.renovar_cache()
    parametros = Parametros.get_instance()
    return {
        'RAZAO_CLIENTE': parametros.nome_fantasia,
        'RAZAO_CLIENTE_TITULO': "SPA - %s " % parametros.nome_fantasia,
        'VERSAO': parametros.versao,
    }



def setup_browser(request):
    if not 'HTTP_USER_AGENT' in request.META:
        user_agent = ''
    else:
        user_agent = request.META['HTTP_USER_AGENT']

    return {
        'USER_AGENT': user_agent,
        'BROWSER_IS_IE': 'MSIE' in user_agent,
        'BROWSER_IS_CHROME': ('Chrome' in user_agent) or ('Chromium' in user_agent),
        'BROWSER_IS_FIREFOX': 'Firefox' in user_agent,
        'BROWSER_IS_WEBKIT': 'WebKit'  in user_agent,
    }


def setup_request(http_request):
    return {
        'request': http_request
    }
