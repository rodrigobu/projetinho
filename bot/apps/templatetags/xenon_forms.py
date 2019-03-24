from django import template

register = template.Library()


def _gerar_input_geral(**kwargs):
    ''' Função geral para os tipos de inputs de texto.
    Como podem haver tipos para email, senhas e afins, essa função seleciona o
    basico em comum entre eles.
    Parâmetros:
       - label : Titulo do campo
       - name : atributo name do campo
       - value: valor inicial para o campo
       - id: id do campo, senão for passado faz; id_<<name>>
       - class: classe customizada para o campo, coloca diretamente no input
       - cols: tamanho do campo no sistema do bootstrap, default: col-md-12
       - required: True ou False, se o campo é obrigatório
       - custom_attr: recebe uma string com atributos customizados e coloca no input
       - placeholder: placeholder do campo
       - disabled:  True ou False, se o campo esta desabilitado
       - help_block: texto de ajuda
       - readonly: True ou False, se o campo esta disponivel para edição ou não
       - autofocus: True ou False, se o campo será o primeiro a receber foco
    '''
    value = kwargs.get('value', '')
    value = value if value is not None else ''

    has_alert = ''
    if kwargs.get('has_error', False):
        has_alert = 'has-error'

    if kwargs.get('has_warning', False):
        has_alert = 'has-warning'

    if kwargs.get('has_success', False):
        has_alert = 'has-success'

    if kwargs.get('has_info', False):
        has_alert = 'has-info'

    return {
        'ICONES': '',
        'TEXTOS': '',
        'label_text': kwargs.get('label', ''),
        'field_name': kwargs.get('name', ''),
        'field_value': value,
        'field_id': kwargs.get('id') if kwargs.get('id') else 'id_' + kwargs.get('name', ''),
        'field_classes': kwargs.get('class', ''),
        'cols': kwargs.get('cols', 'col-md-12'),
        'visible': kwargs.get('visible', True),
        'required': kwargs.get('required', False),
        'max_len': kwargs.get('max_len', ''),
        'custom_attr': kwargs.get('custom_attr', ''),
        'placeholder': kwargs.get('placeholder', ''),
        'onBlur': kwargs.get('onBlur', ''),
        'pattern': kwargs.get('pattern', ''),
        'disabled': kwargs.get('disabled', False),
        'readonly': kwargs.get('readonly', False),
        'autofocus': kwargs.get('autofocus', False),
        'help_block': kwargs.get('help_block', ''),
        'has_alert': has_alert,
        'inline': kwargs.get('inline', False),
        'info_block': kwargs.get('info_block', ''),
        'info_block_color': kwargs.get('info_block_color', 'blue'),
        'info_block_icon': kwargs.get('info_block_icon', 'fa-question'),
    }


@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def input_text(**kwargs):
    '''  Cria o campo de input de texto
    Parâmetros: vide _gerar_input_geral
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['field_type'] = 'text'
    return contexto

@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def readonly_text(**kwargs):
    '''  Cria o campo de input de texto readonly
    Parâmetros: vide _gerar_input_geral
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['field_type'] = 'text'
    contexto['readonly'] = True
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def input_integer(**kwargs):
    '''  Cria o campo de input de inteiros
    Parâmetros: vide _gerar_input_geral
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['field_type'] = 'text'
    contexto['inteiro'] = True
    max_len = kwargs.get('max_len', 9)
    if not max_len or max_len > 9:
        max_len = 9
    contexto['max_len'] = max_len
    contexto['pattern'] = '[0-9]+'
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def input_telefone(**kwargs):
    '''  Cria o campo de input de telefone
    Parâmetros: vide _gerar_input_geral
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['field_type'] = 'text'
    contexto['inteiro'] = True
    contexto['max_len'] = 9
    contexto['placeholder'] = '99999999'
    contexto['pattern'] = RegExps.TELEFONE
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def input_cep(**kwargs):
    '''  Cria o campo de input de CEP
    Parâmetros: vide _gerar_input_geral
    '''
    from apps.parametros.models import Parametros
    contexto = _gerar_input_geral(**kwargs)
    contexto['field_type'] = 'text'
    contexto['placeholder'] = '999999999'
    contexto['pattern'] = RegExps.TELEFONE
    url = Parametros.get_instance().get_url_busca_cep()
    contexto['url_pesquisa_cep'] = url
    contexto['inteiro'] = True
    contexto['max_len'] =  kwargs.get('max_len', 9)
    contexto['pattern'] = '[0-9]+'
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def input_cpf(**kwargs):
    '''  Cria o campo de input de CPF
    Parâmetros: vide _gerar_input_geral
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['field_type'] = 'text'
    contexto['inteiro'] = True
    contexto['placeholder'] = '99999999999'
    contexto['pattern'] = RegExps.CPF
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def input_ddd(**kwargs):
    '''  Cria o campo de input de DDD
    Parâmetros: vide _gerar_input_geral
    '''
    from apps.parametros.models import Parametros
    contexto = _gerar_input_geral(**kwargs)
    contexto['field_type'] = 'text'
    contexto['placeholder'] = '99'
    contexto['pattern'] = RegExps.DDD
    contexto['inteiro'] = True
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def input_decimal(**kwargs):
    '''  Cria o campo de input de decimal
    Parâmetros: vide _gerar_input_geral
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['field_type'] = 'text'
    contexto['pattern'] = kwargs.get('pattern', RegExps.DECIMAL5)
    contexto['placeholder'] = kwargs.get('placeholder', 'Ex: 999,99')
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def input_hora(**kwargs):
    '''  Cria o campo de input de HORA
    Parâmetros: vide _gerar_input_geral
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['field_type'] = 'text'
    contexto['pattern'] = '[0-9]{1,2}:[0-9]{2}'
    contexto['placeholder'] = '99:99'
    contexto['max_len'] = 5
    contexto['onBlur'] = 'validaHora(this.value,this.id)'
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/input_file.html')
def input_file(**kwargs):
    '''  Cria o campo de input de arquivo
    Parâmetros: vide _gerar_input_geral
    '''
    contexto = _gerar_input_geral(**kwargs)
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/input_hidden.html')
def input_hidden(**kwargs):
    '''  Cria o campo de input de texto
    Parâmetros: vide _gerar_input_geral
    '''
    contexto = _gerar_input_geral(**kwargs)
    return contexto

@register.inclusion_tag('templatetags/xenon_forms/output_text.html')
def output_text(**kwargs):
    '''  Cria o campo de output de texto
    '''
    value = kwargs.get('value', '')
    value = value if value is not None else ''
    return {
        'field_classes': kwargs.get('class', ''),
        'label_text': kwargs.get('label', ''),
        'field_value': value,
        'not_bold': kwargs.get('not_bold', False),
        'use_form': kwargs.get('use_form', False),
        'custom_attr': kwargs.get('custom_attr', ''),
        'cols': kwargs.get('cols', 'col-md-12'),
    }


@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def input_password(**kwargs):
    '''  Cria o campo de input de senha
    Parâmetros: vide _gerar_input_geral
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['field_type'] = 'password'
    return contexto



@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def input_file(**kwargs):
    '''  Cria o campo de input de arquivo
    Parâmetros: vide _gerar_input_geral
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['field_type'] = 'file'
    contexto['placeholder'] = ''
    contexto['max_len'] = ''
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/textarea.html')
def textarea(**kwargs):
    '''  Cria o campo de input de texto em area
    Parâmetros: vide _gerar_input_geral
    Parâmetros extras:
        - colunas: propriedade cols do textarea
        - linhas: propriedade rows do textarea
        - autogrow: true ou false, se o textarea irá crescer automaticamente, default é false
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['colunas'] = kwargs.get('colunas', '')
    contexto['linhas'] = kwargs.get('linhas', '')
    contexto['autogrow'] = kwargs.get('autogrow', False)
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/spinner.html')
def spinner(**kwargs):
    '''  Cria o campo de input de texto em area
    Parâmetros: vide _gerar_input_geral
    Parâmetros extras:
        - colunas: propriedade cols do textarea
        - linhas: propriedade rows do textarea
        - autogrow: true ou false, se o textarea irá crescer automaticamente, default é false
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['data_step'] = kwargs.get('data_step', '')
    contexto['data_min'] = kwargs.get('data_min', 1)
    contexto['data_max'] = kwargs.get('data_max', 999)
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/checkbox.html')
def checkbox(**kwargs):
    '''  Cria o campo de checkbox
    Parâmetros: vide _gerar_input_geral
    Parâmetros extras:
        - checked: se esta marcado
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['checked'] = kwargs.get('checked', False)

    if 'checked_in' in kwargs:
        contexto['checked_in'] = kwargs.get('checked_in', '')
        contexto['checked'] = contexto['field_value'] == contexto['checked_in']

    if 'checked_list' in kwargs:
        contexto['checked_list'] = kwargs.get('checked_list', '')
        if contexto['checked_list']:
            contexto['checked'] = str(contexto['field_value']) in contexto['checked_list']

    contexto['tipo'] = 'checkbox'
    contexto['apply_vertical'] = kwargs.get('apply_vertical', False)
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/checkbox.html')
def radio(**kwargs):
    '''  Cria o campo de select simples
    Parâmetros: vide _gerar_input_geral
    Parâmetros extras:
        - checked: se esta marcado
        - checked_in: qual o valor será marcado
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['class_label_text'] = kwargs.get('class_label_text', '')
    contexto['checked'] = kwargs.get('checked', '')
    contexto['checked_in'] = kwargs.get('checked_in', '')
    contexto['checked_list'] = kwargs.get('checked_list', '')
    if contexto['checked_list']:
        contexto['checked'] = str(contexto['field_value']) in contexto['checked_list']
    contexto['tipo'] = 'radio'
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/checkbox.html')
def switch(**kwargs):
    '''  Cria o campo de select simples
    Parâmetros: vide _gerar_input_geral
    Parâmetros extras:
        - checked: se esta marcado
        - switch_color: cor do switch
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['checked'] = kwargs.get('checked', '')
    contexto['tipo'] = 'checkbox'
    contexto['no_checkbox_class'] = True

    switch_size = kwargs.get('switch_size', '')
    if switch_size:
        switch_size = 'iswitch-'+switch_size

    switch_color = kwargs.get('switch_color', 'secondary')
    if switch_color:
        switch_color = 'iswitch-'+switch_color

    contexto['field_classes'] += ' iswitch {} {} '.format(
        switch_color, switch_size
    )
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/select_simple.html')
def select_simple(**kwargs):
    '''  Cria o campo de select simples
    Parâmetros: vide _gerar_input_geral
    Parâmetros extras:
        - hide_blanc_opt: esconde opção em branco
        - selected_id: id do elemento já pre-selecionado
        - list: lista das opções. Precisa ser um objeto, com
        os seguintes campos: id, data_value, um unicode do item
        - options: lista das opções. Choices com as opções no modelo: (id,unicode)
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['hide_blanc_opt'] = kwargs.get('hide_blanc_opt', '')
    contexto['selected_item_id'] = kwargs.get('selected_id', '')
    contexto['selected_list_id'] = kwargs.get('selected_list', '')
    contexto['list'] = kwargs.get('list')
    contexto['options'] = kwargs.get('options')
    contexto['blanc_opt_txt'] = kwargs.get('blanc_opt_txt', '-----')
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/select_simple.html')
def select_filter(**kwargs):
    '''  Cria o campo de select com filtro filtro
    é o mesmo que o select simples, mas uma classe no select é ocultada.
    nota: deve ser usado com a select_filter_js para montar o campo
    '''
    contexto = select_simple(**kwargs)
    contexto['filter_select'] = True
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/select_filter_js.html')
def select_filter_js(**kwargs):
    ''' Cria o js que monta o campo de select com filtro
    Altera o parâmetro placeholder para tem um valor default.
    Caso não queira a opção de limpar o campo, utilize o parametro: hide_blanc_opt=True
    '''
    placeholder = kwargs.get('placeholder', '')
    if not placeholder:
        placeholder = "Selecione uma opção"
    return {
        'field_id': kwargs.get('id') if kwargs.get('id') else 'id_' + kwargs.get('name', ''),
        'placeholder': placeholder,
        'selected_item_id': kwargs.get('selected_id', ''),
        'disabled': kwargs.get('disabled', False),
    }


@register.inclusion_tag('templatetags/xenon_forms/select_simple.html')
def multiselect(**kwargs):
    '''  Cria o campo de multiselect
    é o mesmo que o select simples, mas é adicionado o atributo 'multiple'
    nota: deve ser usado com a multiselect_js para montar o campo
    '''
    contexto = select_simple(**kwargs)
    contexto['multiple'] = True
    contexto['selected_list_id'] = kwargs.get('selected_list_id', '')
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/multiselect_js.html')
def multiselect_js(**kwargs):
    ''' Cria o js que monta o campo de multiselect
    Parâmetros:
       - selecionados_txt: texto para quando forem selecionados, default: Selecionados
       - opcao_todos_txt: texto para a opção de selecionar todos, default: Selecionar Tudo/ Nenhum
       - placeholder: texto para quando nenhuma opção foi selecionada, default: Selecionar um ou mais
       - filtro_placeholder: placeholder do filtro, default: Filtrar por Descrição
       - todos_selecionados_txt: texto para quando todas as opções forem selecionadas, default: Tudo Selecionado
    '''
    contexto = select_simple(**kwargs)
    contexto['hide_blanc_opt'] = True
    contexto['nSelectedText'] = kwargs.get('selecionados_txt', 'Selecionados')
    contexto['selectAllText'] = kwargs.get('opcao_todos_txt', 'Selecionar Tudo/ Nenhum')
    contexto['nonSelectedText'] = kwargs.get('placeholder', 'Selecionar um ou mais registros')
    contexto['filterPlaceholder'] = kwargs.get('filtro_placeholder', 'Filtrar por Descrição')
    contexto['allSelectedText'] = kwargs.get('todos_selecionados_txt', 'Tudo Selecionado')
    contexto['enableClickableOptGroups'] = kwargs.get('enableClickableOptGroups', False)
    contexto['enableHTML'] = kwargs.get('enableHTML', False)
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/input_text.html')
def select_ajax(**kwargs):
    '''  Cria o campo de select com ajax
    Parâmetros: vide _gerar_input_geral
    precisa utilizar com select_ajax_js
    '''
    contexto = _gerar_input_geral(**kwargs)
    contexto['pre_selected_id'] = kwargs.get('selected_id')
    contexto['pre_selected_label'] = kwargs.get('selected_label')
    contexto['field_type'] = 'text'
    contexto['select_ajax'] = True
    contexto['max_len'] = ''
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/select_ajax_js.html')
def select_ajax_js(**kwargs):
    ''' Cria o js que monta o campo de select com ajax
    Altera o parâmetro placeholder para tem um valor default.
    É obrigatório o parãmetro url
    '''
    placeholder = kwargs.get('placeholder', 'Entre com parte da descrição')
    url = kwargs.get('url')
    if not url:
        raise Exception("A tag select_ajax precisa do parâmetro url para funcionar")

    return {
        'field_id': kwargs.get('id') if kwargs.get('id') else 'id_' + kwargs.get('name', ''),
        'placeholder': placeholder,
        'url': url,
        'pre_selected_id': kwargs.get('selected_id'),
        'pre_selected_label': kwargs.get('selected_label'),
        'qtde_min_digitos': kwargs.get('qtde_min_digitos', 1),
        'disabled': kwargs.get('disabled', False),
    }


@register.inclusion_tag('templatetags/xenon_forms/chosen.html')
def choosen(**kwargs):
    '''  Cria o campo de chosen multiselect
    é o mesmo que o select simples, mas é adicionado o atributo 'multiple'
    nota: deve ser usado com a choosen_js para montar o campo
    '''
    contexto = select_simple(**kwargs)
    contexto['multiple'] = True
    contexto['field_classes'] = contexto['field_classes'] + " chzn-select "
    contexto['hide_blanc_opt'] = True
    contexto['choosen_select'] = True

    return contexto


@register.inclusion_tag('templatetags/xenon_forms/chosen_js.html')
def choosen_js(**kwargs):
    ''' Cria o js que monta o campo de choosen
    '''
    contexto = select_simple(**kwargs)
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/date_picker.html')
def date_picker(**kwargs):
    contexto = _gerar_input_geral(**kwargs)
    contexto['tipo_data'] = 'date'
    contexto['format'] = "dd/mm/yyyy"
    contexto['inputmask'] = "dd/mm/yyyy"
    contexto['startDate'] = kwargs.get('startDate')
    contexto['endDate'] = kwargs.get('endDate')
    contexto['disabledDays'] = kwargs.get('disabledDays')
    contexto['startView'] =  kwargs.get('startView')
    contexto['info_block'] =  kwargs.get('info_block', '')
    contexto['info_block_color'] =  kwargs.get('info_block_color', 'blue')
    contexto['info_block_icon'] =  kwargs.get('info_block_icon', 'fa-question')
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/date_picker.html')
def day_picker(**kwargs):
    contexto = _gerar_input_geral(**kwargs)
    contexto['tipo_data'] = 'date'
    contexto['format'] = "dd/mm"
    #contexto['viewMode'] = "months"
    #contexto['minViewMode'] = "months"
    contexto['inputmask'] = "d/m"
    contexto['startDate'] = kwargs.get('startDate')
    contexto['endDate'] = kwargs.get('endDate')
    contexto['startView'] =  kwargs.get('startView')
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/date_picker.html')
def month_picker(**kwargs):
    contexto = _gerar_input_geral(**kwargs)
    contexto['tipo_data'] = 'monthyear'
    contexto['format'] = "mm/yyyy"
    contexto['viewMode'] = "months"
    contexto['minViewMode'] = "months"
    contexto['inputmask'] = "m/y"
    contexto['startDate'] = kwargs.get('startDate')
    contexto['endDate'] = kwargs.get('endDate')
    contexto['disabledDays'] = kwargs.get('disabledDays')
    contexto['startView'] =  kwargs.get('startView')
    return contexto


@register.inclusion_tag('templatetags/xenon_forms/date_picker.html')
def year_picker(**kwargs):
    contexto = _gerar_input_geral(**kwargs)
    contexto['tipo_data'] = 'year'
    contexto['format'] = "yyyy"
    contexto['viewMode'] = "years"
    contexto['minViewMode'] = "years"
    contexto['inputmask'] = "9999"
    contexto['startDate'] = kwargs.get('startDate')
    contexto['endDate'] = kwargs.get('endDate')
    contexto['disabledDays'] = kwargs.get('disabledDays')
    contexto['startView'] =  kwargs.get('startView')
    return contexto
