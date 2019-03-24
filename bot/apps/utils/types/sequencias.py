from math import floor


def quebrar_lista(lista, quebrar_a_cada, preencher_final=False, preencher_final_com=None):
    '''
        quebrar_lista( ['a','b','c','d','e'], 2 )
        retornará
            [ ['a','b'], ['c','d'], ['e'] ]
        ------------------------------------------------------------------------
            quebrar_lista( (1,2,3,4,5,6,7), 3, True, '_' )
        retornará
            [ (1,2,3), (4,5,6), (7,'_','_') ]
    '''

    lista_entrada = list(lista)
    lista_saida = []
    quebras_completas = int(floor(len(lista_entrada) / quebrar_a_cada))
    ini_intervalo = 0

    for i in range(quebras_completas):
        lista_saida.append(
            lista_entrada[ini_intervalo: (ini_intervalo + quebrar_a_cada)])
        ini_intervalo += quebrar_a_cada

    if len(lista_entrada) % quebrar_a_cada != 0:
        if preencher_final:
            falta = len(lista_entrada) - quebras_completas * quebrar_a_cada
            sobra = quebrar_a_cada - falta
            lista_saida.append(
                lista_entrada[ini_intervalo:] + [preencher_final_com, ] * (sobra))
        else:
            lista_saida.append(lista_entrada[ini_intervalo:])

    return lista_saida


def lista_sem_dupl(seq, funcao_get_identif=lambda x: x):
    """
        Recebe uma sequência e retorna uma lista com seus itens, porém
        sem elementos duplicados e preservando a ordem da sequência original.
    """
    achados = {}
    result = []

    for item in seq:
        identif = funcao_get_identif(item)
        if identif in achados:
            continue
        achados[identif] = 1
        result.append(item)

    return result


def list_join(sequence, str_juncao):
    '''
        Semelhante a str_juncao.join(sequence), porém não considera valores nulos ou vazios da sequence.
        E converte os valores da sequence para str antes de adicioná-los no retorno, evitando exceções.
    '''
    if not sequence:
        return ''
    retorno = ''
    for valor in sequence:
        if not (valor in (None, '') or str(valor).isspace()):
            if retorno != '':
                retorno += str_juncao
            retorno += str(valor)
    return retorno


def _sem_strings_vazias(lista):
    """
        Recebe uma lista e remove dela todos os valores que forem strings vazias, strings só com espaços e valores nulos
    """
    return [e for e in lista if (e not in ('', None) and not (isinstance(e, str) and e.isspace()))]


def _remover_valores_vazios(iteravel):
    """
        Aceita lista ou dicionário.
        Se receber lista:
          - remove da lista todos itens cujo segundo elemento (que seria exibido para o usuário) é nulo ou vazio
        Se receber dicionário:
          - remove os itens cujo valor é nulo ou vazio
    """
    if isinstance(iteravel, list):
        i = 0
        while i < len(iteravel):
            valor = iteravel[i][1]
            if valor in ('', None) or (isinstance(valor, string) and valor.isspace()):
                iteravel.pop(i)
            else:
                i += 1

    elif isinstance(iteravel, dict):
        chaves = iteravel.keys()
        for k in chaves:
            if iteravel[k] in ('', None, []) or (isinstance(iteravel[k], string) and iteravel[k].isspace()):
                del iteravel[k]


def get_value_from_key(campo, dict_campo):
    '''
        Verifica se a chave existe,
        Caso exista, retorna o valor.
        Senão, retorna o nome do campo
    '''
    if campo:
        if campo.strip() in dict_campo:
            try:
                return dict_campo[campo.strip()]
            except:
                return None
    return campo


def apenas_digitos(lista):
    return filter(lambda i: i.isdigit(), lista)
