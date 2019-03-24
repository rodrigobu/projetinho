# -*- encoding:utf-8 -*-
from django import template

register = template.Library()

def _gerar_input_geral(**kwargs):
    ''' Função geral para os alerts
    Parâmetros:
       - block_icon : se tem icone
       - info: texto
    '''
    return {
        'block_icon': kwargs.get('block_icon', None),
        'info_title': kwargs.get('title', ''),
        'info': kwargs.get('txt', ''),
        'classe': kwargs.get('classe', ''),
    }

@register.inclusion_tag('global/templatetags/xenon_alerts/info.html')
def alert_info(**kwargs):
    '''  Cria o campo de alert de alerta
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['tipo'] = 'info'
    contexto['block_icon'] = 'fa-info'
    return contexto


@register.inclusion_tag('global/templatetags/xenon_alerts/info.html')
def alert_danger(**kwargs):
    '''  Cria o campo de alert de alerta
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['tipo'] = 'danger'
    contexto['block_icon'] = 'fa-exclamation-triangle'
    return contexto


@register.inclusion_tag('global/templatetags/xenon_alerts/info.html')
def alert_warning(**kwargs):
    '''  Cria o campo de alert de alerta
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['tipo'] = 'warning'
    contexto['block_icon'] = 'fa-exclamation'
    return contexto


@register.inclusion_tag('global/templatetags/xenon_alerts/info.html')
def alert_success(**kwargs):
    '''  Cria o campo de alert de alerta
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['tipo'] = 'success'
    contexto['block_icon'] = 'fa-check'
    return contexto

@register.inclusion_tag('global/templatetags/xenon_alerts/info.html')
def alert_default(**kwargs):
    '''  Cria o campo de alert de alerta
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['tipo'] = 'default'
    return contexto
