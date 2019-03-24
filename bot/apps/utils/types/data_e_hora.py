import pytz
from datetime import date, datetime

def get_hoje():
    return datetime.now().strftime('%d/%m/%Y')

def calc_dt_nasc(idade, string=False):
    '''
       Recebe uma idade e calcula a data de nascimento (ano)  01/01/ano
    '''
    data = datetime(day=1, month=1, year=(datetime.today().year - idade))
    if string:
        return datetime.strftime(data, '%d/%m/%Y')
    return data


def calc_idade(datanasc, invert=False):
    """
        Recebe uma string com uma data de nascimento (no formato do banco),
        ou um objeto date, ou ainda um objeto datetime, e retorna a idade
        calculada desta data recebida até o momento atual.
        (Retorna um inteiro com a quantidade de anos)
    """
    if datanasc and datanasc != 'None':
        #assert isinstance(datanasc, (date, datetime))

        hoje = date.today()
        ano_atual = int(hoje.year)
        mes_atual = int(hoje.month)
        dia_atual = int(hoje.day)

        if isinstance(datanasc, str):
            if invert:
                dia_nasc, mes_nasc, ano_nasc = map(int, datanasc.split('-'))
            else:
                ano_nasc, mes_nasc, dia_nasc = map(int, datanasc.split('-'))
        elif isinstance(datanasc, (date, datetime)):
            ano_nasc, mes_nasc, dia_nasc = map(
                int, datanasc.strftime('%Y-%m-%d').split('-'))

        anos = ano_atual - ano_nasc

        if(mes_atual < mes_nasc):
            anos -= 1
        elif (mes_atual == mes_nasc):
            if(dia_atual < dia_nasc):
                anos -= 1

        return abs(anos)
    else:
        return 0


def convert_data_to_ptbr(data):
    """
        Converte uma string com uma data do formato do banco (1991-04-24) para
        uma string com essa mesma data no formato brasileiro (24/04/1991).
        Se receber uma string inválida, retorna a string recebida.
    """
    #try:
    if data:
        ano, mes, dia = data[0:4], data[5:7], data[8:10]
        dt = date(int(ano), int(mes), int(dia))
        dt = datetime.strftime(dt, '%d/%m/%Y')
    else:
        dt = ""
    #except Exception as  ex:
    #    dt = data
    return dt


def convert_data_to_banco(data):
    """
        Converte uma string com uma data do formato brasileiro (24/04/1991) para
        uma string com essas mesma data no formato do banco (1991-04-24).
    """
    if not data:
        return data
    return '-'.join(data.split('/')[::-1])


def convert_str_to_date(strdata):
    if not strdata:
        return None
    ano, mes, dia = strdata[0:4], strdata[5:7], strdata[8:10]
    return date(int(ano), int(mes), int(dia))


def convert_strpt_to_date(strdata):
    if not strdata:
        return None
    dia, mes, ano = strdata[0:2], strdata[3:5], strdata[6:10]
    return date(int(ano), int(mes), int(dia))


def timedelta_to_tupla(tdelta):
    '''
        Converte um objeto timedelta em uma tupla de inteiros no seguinte formato:
            (semanas, dias, horas, minutos, segundos)
    '''
    dias = tdelta.days
    semanas = dias / 7
    dias = dias - semanas * 7
    minutos = tdelta.seconds / 60
    horas = minutos / 60
    minutos = minutos - horas * 60
    segundos = tdelta.seconds - (horas * 60 * 60) - (minutos * 60)
    return (semanas, dias, horas, minutos, segundos)


def timedelta_to_string(tdelta):
    '''
        Converte um objeto timedelta em uma string no seguinte formato:
            '2 semanas, 3 dias, 15 horas e 4 minutos'
    '''
    s, d, h, m, seg = timedelta_to_tupla(tdelta)
    partes = []
    if s:
        if s > 1:
            s = round(s)
            partes.append('%s semana%s' % (s, 's' if s > 1 else ''))
    if d:
        if d > 1:
            d = round(d)
            partes.append('%s dia%s' % (d, 's' if d > 1 else ''))
    if h:
        if h > 1:
            h = round(h)
            partes.append('%s hora%s' % (h, 's' if h > 1 else ''))
    if m:
        if m > 1:
            m = round(m)
            partes.append('%s minuto%s' % (m, 's' if m > 1 else ''))

    if not partes:
        if seg > 1:
            seg = round(seg)
            return '%s segundo%s' % (seg, 's' if seg > 1 else '')

    if not partes:
        return " Agora "

    retorno = ', '.join(partes)
    if retorno.count(',') > 0:
        # substituir a última vírgula por " e "
        idx_ult_virgula = retorno.rfind(',')
        retorno = retorno[:idx_ult_virgula] + \
            ' e ' + retorno[idx_ult_virgula + 2:]
    return retorno


def calc_meses(date1, date2):
    '''
        Calcula os meses entre duas datas.
        As datas devem estar no formato brasileiro (24/04/1991)
    '''

    date1 = datetime.strptime(date1, "%d/%m/%Y")  # if date1 else hoje
    date2 = datetime.strptime(date2, "%d/%m/%Y")  # if date2 else hoje

    if date1 > date2:
        date1, date2 = date2, date1
    m1 = date1.year * 12 + date1.month
    m2 = date2.year * 12 + date2.month
    months = m2 - m1
    return months


def calc_intervalo_datas(data_ini, data_fin, periodo, label_ini='Data Inicial', label_fin='Data Final'):
    '''
        Calcula se o intervalo das datas estão no periodo informado.
        data_ini --> campo data, será transformado no formato portugues
        data_fin --> campo data, será transformado no formato portugues
        periodo --> campo inteiro
        Os relatorios que contem os campos inicial e final utilizam essa função
    '''

    if data_ini and data_fin:
        # Valida se as datas inicial e final estão no periodo desejado
        if datetime.strptime(data_ini, "%d/%m/%Y") > datetime.strptime(data_fin, "%d/%m/%Y"):
            return "%s inválida. %s tem que ser menor que a %s." % (label_ini, label_ini, label_fin)
        elif calc_meses(data_ini, data_fin) > periodo:
            return "O período escolhido deve ter até %s meses para a geração do relatório." % str(periodo)
    else:
        if (not data_ini) and data_fin:
            # Valida senão tem data inicial sobe a validação do periodo
            return "O período escolhido deve ter até %s meses para a geração do relatório." % str(periodo)
        if data_ini and (not data_fin):
            # Valida senão tem data final é colocado a data de hoje como data
            # final.
            if calc_meses(data_ini, datetime.today().strftime("%d/%m/%Y")) > periodo:
                return "O período escolhido deve ter até %s meses para a geração do relatório." % str(periodo)


def split_data_e_hora(data, hora):
    data_ = list(map(int, data.split("/")))
    hora_ = list(map(int, hora.replace(" ", "").split(":")))
    return datetime(data_[2], data_[1], data_[0], hora_[0], hora_[1])


MONTHS = { 'Jan':1 ,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6, 'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}


def day_to_data(date, sum_days=0, sum_year=0, sum_month=0, sum_hour=0, sum_minuto=0):
    ''' Converte datas vindas do Fullcalendar para o formtao de datetime do python '''
    date = date.split(" ")
    try:
        mes, dia, ano = MONTHS[date[1]], int(date[2]), int(date[-1]) #date:Thu Feb 06 00:00:00 UTC 2014
        hora , minuto, segundo = date[3].split(":")
    except:
        mes, dia, ano = MONTHS[date[1]], int(date[2]), int(date[3]) #date:Thu Feb 06 2014 00:00:00 GMT-0200 (BRST)
        hora , minuto, segundo = date[4].split(":")

    return datetime(
        month = int(mes),
        year = int(ano),
        day = int(dia)+sum_days,
        hour = int(hora)+sum_hour,
        minute = int(minuto)+sum_minuto
    )

def verificar_horario(data, hora, minuto, time_zone='America/Sao_Paulo'):
    try:
        data = convert_str_to_date(data)
        data_agora = datetime.now(pytz.timezone(time_zone))
        if data == date.today():
            if int(hora) < data_agora.hour:
                return False
            elif int(hora) == data_agora.hour:
                if int(minuto) <= data_agora.minute:
                    return False
        return True
    except:
        return False
