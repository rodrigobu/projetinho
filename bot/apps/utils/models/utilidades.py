from datetime import datetime

from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

from apps.utils.types.strings import clean_text


def make_choices(model, fields):
    return [
        (campo, model._meta.get_field(campo).verbose_name) for campo in sorted(fields)
    ]


def trata_lista(campos):
    return filter(bool, campos.split(',') if campos else '')


def get_field_label(field, model):
     try:
         return u'%s' % { 'a' : model._meta.get_field(field).verbose_name }['a']
     except Exception as msg:
         return ''


def get_changed_data(changed_data, model):
    datas = []
    for campo in sorted(changed_data):
        data = get_field_label(campo, model)
        if data: datas.append(data)
    return u", ".join(datas)


def get_db_table(Model):
    return Model._meta.db_table


def str_field(campo):
    return campo if campo else  ''


def str_data_field(data):
    if not data:
        return ''
    try:
        if isinstance(data, str):
            lista = data.split("-")
            lista.reverse()
            return "/".join(lista)
    except Exception as msg:
        pass
    return datetime.strftime(data,"%d/%m/%Y") if data else ""


def str_datatime_field(data):
    if isinstance(data, str):
        return data
    return datetime.strftime(data,"%d/%m/%Y - %H:%M") if data else ""


def str_only_time_field(data):
    return datetime.strftime(data,"%H:%M") if data else ""


def str_data_summerTime_field(data):
    '''
        Verifica se a Data atual não está no horario de verão, se estiver
        retira 2 horas , pois o UTC do Brasil fica com 2 horas a mais
    '''
    if data:
        if data.now().hour - data.utcnow().hour == -3:
            hora = data.hour -3
        else:
            hora = data.hour-2 if data else ""
    return datetime.strftime(data.replace(hour=hora),"%d/%m/%Y - %H:%M") if data else ""


def str_time_field(time):
    return time.strftime("%H:%M:%S") if time else ""


def str_bool_field(boole):
    return u"Sim" if boole else u"Não"


def str_money(campo, prefixo='R$'):
    return ('%s %s' % (prefixo,campo) ).replace('.', ',') if campo else ''


def str_decimal(campo):
    return ('%s' % (campo) ).replace('.', ',') if campo else ''


def getManagerBanco(database_alias='default'):
    """
        Cria um Manager para que as models que o usarem realizarem suas queries no
        banco de dados especificado pelo parâmetro 'database_alias'.
        Os aliases possíveis são as chaves do dicionário 'DATABASES', que fica nas settings.
    """
    assert database_alias in settings.DATABASES

    class ManagerBancoNaoDefault(models.Manager):
        def get_query_set(self):
            return super(ManagerBancoNaoDefault, self).get_query_set().using(database_alias)

    return ManagerBancoNaoDefault()


def get_model_attr(model, atributo):
    retorno = model
    for attr in atributo.split('__'):
        if retorno == None:
            return None
        else:
            retorno = getattr(retorno, attr)
    return retorno


def get_initial_value(Model, campo, valor):
    if valor:
        lookup_field = '%s__istartswith' % campo
        if Model.objects.filter(**{lookup_field: valor}).exists():
            return Model.objects.filter(**{lookup_field: valor})[0]
    return None


def get_initial_choice_value(CHOICES, valor):
    if valor:
        valor = clean_text(valor).lower()
        for val, display in CHOICES:
            if clean_text(display).lower().startswith(valor):
                return val
    return None
