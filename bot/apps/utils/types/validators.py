import re
from datetime import datetime
from apps.utils.types import RegExps
from apps.utils.types import strings
from apps.utils.types import data_e_hora
from apps.utils.textos import textos

### Padrão para captação de texto de validação

def texto_invalido(key):
    return '{} {}.'.format(textos[key], textos['invalido'])

def texto_invalida(key):
    return '{} {}.'.format(textos[key], textos['invalida'])

def texto_obrigatorio(key):
    return '{} {}.'.format(textos[key], textos['obrigatorio'])

def texto_obrigatoria(key):
    return '{} {}.'.format(textos[key], textos['obrigatoria'])


def valida_texto(texto, max_length=0, required=False):
    '''  Função de validar campo descrição.
    Valida o max_length e se é obrigatório
    '''
    valor = strings.tratar_inject_text(texto)
    if not valor and required:
        return False, texto
    if not valor and not required:
        return True, valor
    if valor:
        s = re.search(r"<[^<]+?>", valor)
        if not s:
            if max_length and len(valor) > max_length:
                return False, valor
            return True, valor
        return False, valor
    return False, valor

def valida_choices(selected, choice=[], queryset=None, required=False):
    '''
    Valida se o selected faz parte da choice ou do queryset.
    Retorna ele caso pertença e None caso não pertença.
    '''
    if not selected and required:
        return False, None

    if not selected and not required:
        return True, selected

    if choice:
        for key, lbl in choice:
            if str(selected) == str(key):
                return True, selected
        return False, None

    if queryset:
        if isinstance(selected, list):
            if queryset.filter(pk__in=selected):
                return True, selected
        else:
            try:
                if queryset.filter(pk=selected):
                    return True, int(selected)
            except ValueError:
                pass
        return False, None

    return True, selected

def valida_ckeditor(texto, max_length=0, required=False):
    '''  Função de validar campo descrição.
    Valida o max_length e se é obrigatório
    '''
    valor = strings.tratar_inject_ckeditor(texto)
    if not valor and required:
        return False, texto
    if not valor and not required:
        return True, valor
    if valor:
        #s = re.search(r"<[^<]+?>", valor) ## Não pode ter validação de HTML aqui pois o CKEDITOR trabalha com html
        #if not s:
        if max_length and len(valor) > max_length:
            return False, valor
        return True, valor
        #return False, valor
    return False, valor

def valida_numero(valor, max_length=10, required=False):
    '''  Função de validar números. Utilizar para processos. '''
    if not valor and required:
        return False, valor

    if not valor and not required:
        return True, None

    if not bool(re.match(RegExps.re_inteiro(max_length), valor or '')):
        return False, valor

    if len(valor) > max_length:
        return False, valor
    return bool(int(valor)>=0), valor

def valida_decimal(valor, max_length=10, required=False):
    '''  Função de validar decimal. Utilizar para processos.
    Valida no formato 999999,99 '''
    if not valor and required:
        return False, valor

    if not valor and not required:
        return True, None

    valor = valor.replace(',','.')
    if not '.' in valor:
        valor = valor + '.00'

    if not bool(re.match(RegExps.re_decimal(max_length), valor or '')):
        return False, valor

    if len(valor.replace(',','').replace('.','')) > max_length:
        return False, valor

    return True, valor.replace(',', '.')

def valida_moeda(valorrequired=False):
    '''  Função de validar decimal. Utilizar para processos. Valida no formato 5,2 '''
    if not valor and required:
        return False, valor

    if not valor and not required:
        return True, valor
    return bool(re.match(r"^[0-9]{1,8}([,|.][0-9]{1,2}|)$", valor or '')), valor

def valida_email(email, max_length=0, required=False):
    '''  Função de validar email. Utilizar para processos. '''
    if not email and required:
        return False, email

    if not email and not required:
        return True, None

    if email.count('@')>1 or ' ' in email:
        return False, email

    if len(email) > max_length:
        return False, email
    return bool(re.match(RegExps.EMAIL, email or '')), email

def valida_ddd(valor, max_length=0, required=False):
    '''  Função de validar ddd. Utilizar para processos.
    Valida no formato 99 ou 999'''
    if not valor and required:
        return False, valor

    if not valor and not required:
        return True, valor

    if len(valor) > max_length:
        return False, valor
    return bool(re.match(RegExps.DDD, valor or '')), valor

def valida_telefone(valor, max_length=0, required=False):
    '''  Função de validar telefone. Utilizar para processos.
    Valida no formato 99999999 ou 999999999'''
    if not valor and required:
        return False, valor

    if not valor and not required:
        return True, valor

    if len(valor) > max_length:
        return False, valor
    return bool(re.match(RegExps.TELEFONE, valor or '')), valor

def valida_dddtelefone(valor, max_length=0, required=False):
    '''  Função de validar telefone. Utilizar para processos.
    Valida no formato 99999999 ou 999999999'''
    if not valor and required:
        return False, valor

    if not valor and not required:
        return True, valor

    if len(valor) > max_length:
        return False, valor
    return bool(re.match(RegExps.DDDTELEFONE, valor or '')), valor

def valida_data(data, required=False):
    '''  Função de validar data. Utilizar para processos. '''
    if not data and required:
        return False, None

    if not data and not required:
        return True, None
    return bool(re.match(r'\d{4}[/|-](0[1-9]|1[012])[/|-](0[1-9]|[12][0-9]|3[01])', str(data) or '')), data

def valida_data_br(data, required=False):
    '''  Função de validar data. Utilizar para processos. '''
    if not data and required:
        return False, None

    if not data and not required:
        return True, None
    return bool(re.match(r'(0[1-9]|[12][0-9]|3[01])[/|-](0[1-9]|1[012])[/|-]\d{4}', data or '')), data_e_hora.convert_data_to_banco(data)

def valida_data_retroativa(data):
    '''  Função de validar se a data é retroativa. Utilizar para processos'''
    try:
        return data < datetime.today().date()
    except:
        data = datetime.strptime(data, '%Y-%m-%d').date()
        return data < datetime.today().date()

def valida_mes_aniversario(data, required=False):
    '''  Função de validar mês de aniversário. Utilizar para processos. '''
    if not data and required:
        return False, data

    if not data and not required:
        return True, data
    return bool(re.match(RegExps.MES_ANIVERSARIO, data or '')), data

def valida_tempo(valor, max_length=5, required=False):
    '''  Função de validar tempo. Utilizar para processos.'''
    if not valor and required:
        return False, valor

    if not valor and not required:
        return True, valor

    if len(valor) > max_length:
        return False, valor
    return RegExps.TEMPO_MS.match(valor), valor

def valida_cep(cep, max_length=0, required=False):
    '''  Função de validar cep. Utilizar para processos. '''
    if not cep and required:
        return False, cep

    if not cep and not required:
        return True, cep

    if len(cep) > max_length:
        return False, cep
    return bool(re.match(r'^(\d{8})$', cep or '')), cep

def valida_pis(pis):
    '''  Função de validar pis. Utilizar para processos. Formato: 9.999.999.999-9  '''
    pis = pis or ''

    if not pis.isdigit():
        if not bool(re.match(r'\d{1}\.?\d{3}\.?\d{3}-?\d{1}', pis)): return False
        pis = [x for x in pis if x in digits]

    if len(pis) != 11: return False

    pis = map(int, pis)
    d1  = 11 - (sum([j * [3, 2, 9, 8, 7, 6, 5, 4, 3, 2][i] for i, j in enumerate(pis[:10])]) % 11)
    d1  = 0 if d1 >= 10 else d1

    return pis[10]==d1

def valida_cpf(cpf):
    '''  Função de validar cpf. Utilizar para processos. '''
    cpf = cpf or ''

    if not cpf.isdigit():
        if not bool(re.match(r'\d{3}\.?\d{3}\.?\d{3}-?\d{2}', cpf)): return False
        cpf = [x for x in cpf if x in digits]

    if len(cpf) != 11: return False

    cpf = list(map(int, cpf))
    d1  = 11 - (sum([j * range(10, 1, -1)[i] for i, j in enumerate(cpf[:9])]) % 11)
    d1  = 0 if d1 >= 10 else d1
    d2  = 11 - (sum([j * range(11, 1, -1)[i] for i, j in enumerate(cpf[:9] + [d1])]) % 11)
    d2  = 0 if d2 >= 10 else d2

    return cpf[9]==d1 and cpf[10]==d2

def DV_maker(v):
    if v >= 2:
        return 11 - v
    return 0

def valida_cnpj(cnpj):
    '''
       Função de validar cnpj. Utilizar para processos. (99.999.999/9999-99)
       fonte: https://djangosnippets.org/snippets/2318/
    '''

    cnpj = cnpj or ''

    if cnpj:
        if not cnpj.isdigit():
            if not bool(re.match(r'\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2}', cnpj)): return False
            cnpj = [x for x in cnpj if x in digits]
            #value = re.sub("[-/\.]", "", value)

        if len(cnpj) != 14: return False

        value=cnpj

        orig_dv = value[-2:]

        new_1dv = sum([i * int(value[idx]) for idx, i in enumerate(range(5, 1, -1) + range(9, 1, -1))])
        new_1dv = DV_maker(new_1dv % 11)
        value = value[:-2] + str(new_1dv) + value[-1]
        new_2dv = sum([i * int(value[idx]) for idx, i in enumerate(range(6, 1, -1) + range(9, 1, -1))])
        new_2dv = DV_maker(new_2dv % 11)
        value = value[:-1] + str(new_2dv)

        if value[-2:] != orig_dv:
            return False
    return True

def valida_url(valor, max_length=0, required=False):
    '''  Função de validar url. Utilizar para processos. '''
    if not valor and required:
        return False, valor

    if not valor and not required:
        return True, valor

    if len(valor) > max_length:
        return False, valor
    return bool(re.match(RegExps.URL, valor or '')), valor
    # Validação de link externo

    #reg = r'(https?:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?(\.[a-zA-Z]{2,})'
    #return bool(re.match(reg, string))

def valida_ipv4_address(address):
    try:
        socket.inet_pton(socket.AF_INET, address)
    except AttributeError:  # no inet_pton here, sorry
        try:
            socket.inet_aton(address)
        except socket.error:
            return False
        return address.count('.') == 3
    except socket.error:  # not a valid address
        return False

    return True

def valida_ipv6_address(address):
    try:
        socket.inet_pton(socket.AF_INET6, address)
    except socket.error:  # not a valid address
        return False
    return True

def valida_rgb(rgb):
    _rgbstring = re.compile(r'#[a-fA-F0-9]{6}$')
    return bool(_rgbstring.match(rgb))
