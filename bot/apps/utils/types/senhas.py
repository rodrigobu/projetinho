from hashlib import md5
from random import choice, randint, shuffle


def gerar_senha(qtd_caracteres=5):
    """
        Gera uma senha aleatória
    """
    numeros = '23456789'
    letras = 'abcdefghjkmnpqrstuvwxyz'
    num_numeros = randint(2, qtd_caracteres - 1)  # No mínimo 2 números
    num_letras = qtd_caracteres - num_numeros     # O restante são letras

    senha = ''.join([choice(numeros) for i in range(num_numeros)])
    senha += ''.join([choice(letras) for i in range(num_letras)])

    senha = list(senha)
    shuffle(senha)
    senha = ''.join(senha)
    return senha

cria_hash = lambda s: md5(s.encode('utf-8')).hexdigest()
