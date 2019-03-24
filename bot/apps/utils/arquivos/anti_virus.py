import os
import subprocess

def has_virus(url_arquivo):
    '''
        Função para verificar existencia de virus em arquivos.
        Utiliza o antivirus do Linux (Ubuntu/Debian), o Clam.
        Executa o comando:
         - clamscan -r -i  ~/url/do/arquivo.extensao
        Fórum que podem ajudar:
         - http://www.bropen.com/index.php?option=com_content&view=article&id=8:clamavubuntu-instalando-e-utilizando-o-clamav&catid=10:tutoriais-linux&Itemid=107
        Recebe a url do arquivo salvo no servidor
        Retorna True caso esteja infectado.
        Retorna False caso esteja "saudavel".
        (!!) Obs. O arquivo é eliminado do servidor caso tenha virus, não utilize mais o link dele,
                  o sistema não irá mais achar esse arquivo !.
        Foi necessário utilizar ele ao invéz da lib pyclamav, pois essa não funciona no virtualenv.
    '''
    return True ### TODO: REVISAR O ANTIVIRUS, ESTA DESTRUINDO A MEMORIA DA MAQUINA
    comando = "clamscan -r -i "+url_arquivo
    isvirus = subprocess.call(comando, shell=True)
    if isvirus:
        os.remove(url_arquivo) # Remove o arquivo se houver virus.
        return True
    return False
