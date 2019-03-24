from django import template

from apps.utils.icones import icones
from apps.utils.textos import textos

register = template.Library()

@register.inclusion_tag('global/templatetags/xenon_buttons/btn_novo.html')
def btn_novo(**kwargs):
    '''  Cria o botão "Novo"
    Parâmetros:
        - fixo: True ou False para se o botão é fixo na página. Caso contrário,
        ele só será exbido se o objeto passado tiver um id.
        - objeto: instância do objeto que está sendo usado na página
        - url: name da url para a qual o botão vai redirecionar a pág.
        - url_param: caso a url tenha algum parametro.
    '''
    context = {}
    context['ICONES'] = ''
    context['TEXTOS'] = ''
    context['btn_position'] = kwargs.get('position', 'pull-left')
    context['btn_class'] = kwargs.get('class', 'btn-black')
    context['btn_label'] = kwargs.get('label', textos.get('cadastrar_novo'))
    context['url_name'] = kwargs.get('url')
    context['url_param'] = kwargs.get('url_param', '')
    context['objeto'] = kwargs.get('objeto')
    context['fixo'] = kwargs.get('fixo', False)
    return context

@register.inclusion_tag('global/templatetags/xenon_buttons/btn_cadastrar.html')
def btn_cadastrar(**kwargs):
    '''  Cria o botão "Cadastrar"
    Parâmetros:
        - url: name da url para a qual o botão vai redirecionar a pág.
        - url_param: caso a url tenha algum parametro.
        - label: caso precise passar uma label diferente do padrao
    '''
    context = {}
    context['ICONES'] = ''
    context['TEXTOS'] = textos
    context['btn_position'] = kwargs.get('position', 'pull-left')
    context['btn_label'] = kwargs.get('label', textos.get('cadastrar_novo'))
    context['btn_class'] = kwargs.get('class', 'btn-primary')
    context['url_name'] = kwargs.get('url')
    context['url_param'] = kwargs.get('url_param', '')
    return context

@register.inclusion_tag('global/templatetags/xenon_buttons/btn_salvar.html')
def btn_salvar(**kwargs):
    '''  Cria o botão "Salvar"
    Parâmetros:
        - label: caso precise passar uma label diferente do padrao
    '''
    context = {}
    context['ICONES'] = ''
    context['TEXTOS'] = textos
    context['btn_position'] = kwargs.get('position', 'pull-right')
    context['btn_class'] = kwargs.get('class', 'btn-primary')
    context['btn_label'] = kwargs.get('label', textos.get('salvar'))
    context['btn_name'] = kwargs.get('name', 'btn_salvar')
    context['btn_type'] = kwargs.get('type', 'submit')
    return context

@register.inclusion_tag('global/templatetags/xenon_buttons/btn_filtrar.html')
def btn_filtrar(**kwargs):
    '''  Cria o botão "Filtrar"
    Parâmetros:
        - label: caso precise passar uma label diferente do padrao
    '''
    context = {}
    context['ICONES'] = ''
    context['TEXTOS'] = textos
    context['btn_label'] = kwargs.get('label', textos.get('filtrar'))
    return context

@register.inclusion_tag('global/templatetags/xenon_buttons/btn_voltar.html')
def btn_voltar(**kwargs):
    '''  Cria o botão "Voltar"
    Parâmetros:
        - url: name da url para a qual o botão vai redirecionar a pág.
        - url_param: caso a url tenha algum parametro.
        - label: caso precise passar uma label diferente do padrao
    '''
    context = {}
    context['ICONES'] = ''
    context['TEXTOS'] = textos
    context['url_name'] = kwargs.get('url')
    context['url_param'] = kwargs.get('url_param', '')
    context['btn_position'] = kwargs.get('position', 'pull-left')
    context['btn_class'] = kwargs.get('class', 'btn-black')
    context['btn_label'] = kwargs.get('label', textos.get('voltar'))
    return context

@register.inclusion_tag('global/templatetags/xenon_buttons/btn_config_col.html')
def btn_config_colunas(**kwargs):
    '''  Cria o botão "Configurar Colunas"
    '''
    context = {}
    context['ICONES'] = ''
    context['TEXTOS'] = textos
    context['btn_position'] = kwargs.get('position', 'pull-left')
    context['btn_class'] = kwargs.get('class', 'btn-gray')
    return context

@register.inclusion_tag('global/templatetags/xenon_buttons/btn_modal.html')
def btn_modal(**kwargs):
    '''  Cria os botões na Modal
    Parâmetros:
        - url: name da url para a qual o botão vai redirecionar a pág.
        - url_param: caso a url tenha algum parametro.
        - label: caso precise passar uma label diferente do padrao
    '''
    context = {}
    context['btn_name'] = kwargs.get('name', '')
    context['btn_label'] = kwargs.get('label', '')
    context['btn_class'] = kwargs.get('class', 'btn-primary')
    context['btn_position'] = kwargs.get('position', 'pull-right')
    context['btn_icone'] = kwargs.get('icone', '')
    context['data_dismiss'] =  kwargs.get('data_dismiss', False)
    context['onclick'] = kwargs.get('onclick', ''),
    return context

@register.inclusion_tag('global/templatetags/xenon_buttons/btn_limpar.html')
def btn_limpar(**kwargs):
    '''  Cria o botão "Limpar"
    Parâmetros:
        - fixo: True ou False para se o botão é fixo na página. Caso contrário,
        ele só será exbido se o objeto passado tiver um id.
        - objeto: instância do objeto que está sendo usado na página
        - url: name da url para a qual o botão vai redirecionar a pág.
        - url_param: caso a url tenha algum parametro.
    '''
    context = {}
    context['ICONES'] = ''
    context['TEXTOS'] = textos
    context['btn_position'] = kwargs.get('position', 'pull-right')
    context['btn_class'] = kwargs.get('class', 'btn-primary')
    context['btn_label'] = kwargs.get('label', textos.get('limpar'))
    context['url_name'] = kwargs.get('url')
    context['url_param'] = kwargs.get('url_param', '')
    context['objeto'] = kwargs.get('objeto')
    context['fixo'] = kwargs.get('fixo', False)
    return context


@register.inclusion_tag('global/templatetags/xenon_buttons/btn_sms.html')
def btn_sms(**kwargs):
    '''  Cria o botão de Enviar SMS
    Parâmetros:
        - controle: a instancia de ControleSMS,
        - candidato: a instancia de Candidato
    '''
    context = {}
    context['ICONES'] = ''
    context['TEXTOS'] = textos

    candidato = kwargs.get('candidato', None)
    controle = kwargs.get('controle', None)
    if controle.usa_envio_sms:
        context.update(controle.validar_envio(candidato))
        context['controle'] = controle
        context['candidato'] = candidato

    return context
