from django import template

register = template.Library()


@register.inclusion_tag('templatetags/xenon_core/page_title.html')
def page_title(**kwargs):
    '''  Cria o html para os titulos das páginas.
    Parâmetros:
       - title : o titulo da página
       - description : uma descrição para a página, age como um subtitulo
       - icon : class para o ícone a ser utilizado na frente do título
    '''
    return {
        'title': kwargs.get('title', ""),
        'icon' : kwargs.get('icon', ""),
        'description': kwargs.get('description', ""),
        'class' : kwargs.get('class', "div-primary"),
    }

@register.inclusion_tag('templatetags/xenon_core/counter.html')
def counter(**kwargs):
    '''  Cria o html para a div counter usadas no menu e submenus do sistema.
    Parâmetros:
       - title : o titulo da widget
       - icon: o icone da widget
       - color: a cor do icone da widget
       - amount: quantidade, total ou valor que aparecerá na widget
       - link: a url do processo que o widget abrirá
    '''
    return {
        'title': kwargs.get('title', ""),
        'icon' : kwargs.get('icon', ""),
        'color': kwargs.get('color', ""),
        'amount' : kwargs.get('amount', ""),
        'link' : kwargs.get('link', ""),
        'class' : kwargs.get('class', ""),
        'tooltip' : kwargs.get('tooltip', ""),
    }

@register.inclusion_tag('templatetags/xenon_core/counter_block.html')
def counter_block(**kwargs):
    '''  Cria o html para a div counter-block usadas no menu e submenus do
    sistema.
    Parâmetros:
       - title : o titulo da widget
       - icon: o icone da widget
       - link: a url do processo que o widget abrirá
    '''
    return {
        'title': kwargs.get('title', ""),
        'icon' : kwargs.get('icon', ""),
        'link' : kwargs.get('link', ""),
    }

@register.inclusion_tag('templatetags/xenon_core/counter_block_main.html')
def counter_block_main(**kwargs):
    '''  Cria o html para a div counter-block com quantidades e subtitulo
    usadas no menu e submenus do sistema.
    Parâmetros:
       - title : o titulo da widget
       - datatitle: o titulo que aparecerá no quantificador
       - icon: o icone da widget
       - amount: quantidade, total ou valor que aparecerá na widget
       - link: a url do processo que o widget abrirá
       - params: parametros get para o link
       - args: argumento para link
    '''
    return {
        'title': kwargs.get('title', ""),
        'datatitle': kwargs.get('datatitle', ""),
        'icon' : kwargs.get('icon', ""),
        'no_amount' : kwargs.get('no_amount', False),
        'amount' : kwargs.get('amount', "") if kwargs.get('amount', "") else 0,
        'link' : kwargs.get('link', ""),
        'params' : kwargs.get('params', ""),
        'class' : kwargs.get('class', ""),
        'args' : kwargs.get('args', ""),
        'tootip_datatitle' : kwargs.get('tootip_datatitle', ""),
        'link_puro' : kwargs.get('link_puro', ""),
        'nova_aba' : kwargs.get('nova_aba', False),
    }

@register.inclusion_tag('templatetags/xenon_core/panel_heading.html')
def panel_heading(**kwargs):
    '''  Cria o html do cabeçalho de paineis e os icones de controle
    Parâmetros:
       - title : o titulo da widget
       - com_options: se terá icones de opções (padrão: false)
       - reload_url: url que recarrega os dados do painel (brigatório se passar
       reload em options)
       - Opções que teraõ no cabeçalho, vem por padrão com toggle apenas, elas
       são:
          - toggle: abrir/ fechar o painel
          - reload: recarregar o painel (deve passar o parâmetro reload_url)
          - remove: mata o painel, só volta com reload de tela
       ** Qualquer outra composição, deve ser feito o header na mão
    '''
    return {
        'title': kwargs.get('title', ""),
        'com_options': kwargs.get('title', False),
        'reload_url': kwargs.get('reload_url', "#"),
        'reload': kwargs.get('reload', False),
        'toggle': kwargs.get('toggle', True),
        'remove': kwargs.get('remove', False),
        'classe_heading': kwargs.get('classe_heading', ""),
        'classe_title': kwargs.get('classe_title', ""),
        'data_toggle': kwargs.get('data_toggle', "panel"),
        'data_parent': kwargs.get('data_parent', ""),
        'data_href': kwargs.get('data_href', ""),
    }
