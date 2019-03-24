from PIL import Image
import mimetypes
import smtplib
from io import StringIO
from email import encoders, charset as Charset
from email.generator        import Generator
from email.header           import Header
from email.mime.base        import MIMEBase
from email.mime.multipart   import MIMEMultipart
from email.mime.text        import MIMEText
from email.Utils            import COMMASPACE, formatdate

from django.conf            import settings

from utils.types.strings    import clean_text
from utils.banco.sql        import sql_to_dict, sql_escape

from apps.parametros.models  import ParamSQL, Param, EmailAEnviar


MSG_ERRO_CONFIG_EMAIL = {
    '[Errno -2] Name or service not known'         : u"Host inválido",
    "(535, 'Incorrect authentication data')"       : u"Login ou senha inválidos",
    "(535, '5.7.8 Error: authentication failed:')" : u"Login ou senha inválidos",
    "[Errno 111] Connection refused"               : u"Porta inválida"
}

def get_type(nome):
    "Retorna uma tupla no formato tipo/subtipo"
    tipo, encoding = mimetypes.guess_type(nome)
    if tipo is None or encoding is not None:
        tipo = 'application/octet-stream'
    main_tipo, sub_tipo = tipo.split('/', 1)
    return (main_tipo, sub_tipo)

class Email(object):

    def __init__(self, email_origem, lista_destinatarios, assunto, texto_mensagem, lista_anexos_abertos=[], imagem_aberta_corpo=None,
                 email_host = "", email_host_user = "", email_host_password = "", email_port = "", *args, **kwargs):

        super(Email, self).__init__(*args, **kwargs)
        self.email_origem        = email_origem
        self.lista_destinatarios = lista_destinatarios if isinstance(lista_destinatarios, list) else [lista_destinatarios]
        self.assunto             = assunto
        self.texto_mensagem      = texto_mensagem

        if isinstance(lista_anexos_abertos, list):
            self.lista_anexos_abertos = lista_anexos_abertos
        elif lista_anexos_abertos != None:
            self.lista_anexos_abertos = [lista_anexos_abertos]
        else:
            self.lista_anexos_abertos = []

        self.imagem_aberta_corpo = imagem_aberta_corpo
        param = Param.get_instance("email_host")
        self.email_host          = email_host          or param.email_host
        self.email_host_user     = email_host_user     or param.email_host_user
        self.email_host_password = email_host_password or param.email_host_password
        self.email_port          = email_port          or param.email_port


def envia_emails(lista_emails, enviar_agora=True, enviar_mala_direta=False, sql_mala_direta="", tipo_mala_direta=""):
    '''
        - lista_emails: lista de objetos da classe Email (acima), ou apenas um objeto dessa classe
        - enviar_agora: se for True, fará feita a conexão com o server de email e os emails serão
            enviados imediatamente. Se for False, os emails serão salvos na tabela 'email_a_enviar',
            e serão enviados mais tarde por um processo automatizado no servidor de banco de dados.
    '''
    if isinstance(lista_emails, Email):
        lista_emails = [lista_emails,]

    qtd_erros = 0
    erros     = []

    if enviar_agora:
        if (lista_emails[0].email_host):
            email_host          = str(lista_emails[0].email_host)
            email_port          = str(lista_emails[0].email_port)
            email_host_user     = str(lista_emails[0].email_host_user)
            email_host_password = str(lista_emails[0].email_host_password)
        else:
            # Captura de parâmetros salvos nos parâmetros dos sistema
            parametros          = Param.get_instance()
            email_host          = parametros.email_host
            email_port          = parametros.email_port
            email_host_user     = parametros.email_host_user
            email_host_password = parametros.email_host_password

        try:
            # captura de parâmetros que vieram de email de teste
            smtpserver = smtplib.SMTP(email_host, email_port)

            if email_host in ['smtp.mvconsultoria.com.br']:
                # Servidores que não suportam CRAM-MD5
                smtpserver.starttls()
                smtpserver.ehlo()
                # http://stackoverflow.com/questions/6123072/smtp-auth-extension-trouble-with-python
                smtpserver.esmtp_features['auth'] = 'AUTH PLAIN' #'PLAIN LOGIN'
            elif email_host in ['smtp.grupometa.com']:
                # Servidores que não suportam CRAM-MD5 e STARTTLS
                smtpserver.ehlo()
                smtpserver.esmtp_features['auth'] = 'AUTH PLAIN' #'PLAIN LOGIN'
            else:
                if email_host in ['smtp.office365.com', 'smtp.gmail.com','smtp.live.com']:
                    smtpserver.ehlo()

                if smtpserver.has_extn('STARTTLS'):
                    if email_host not in ['smtp.office365.com', 'smtp.gmail.com','smtp.live.com']:
                        smtpserver.ehlo()
                    smtpserver.starttls()
                    smtpserver.ehlo()

            smtpserver.login(email_host_user,email_host_password)
        except Exception as ex:
            if MSG_ERRO_CONFIG_EMAIL.has_key(str(ex)):
                msg = MSG_ERRO_CONFIG_EMAIL[str(ex)]
            else:
                msg = str(ex)
            return 1, msg

    Charset.add_charset('utf-8', Charset.QP, Charset.QP, 'utf-8')
    for email in lista_emails:
        try:

            ''' MIME layout usado:

                multipart/mixed                                     #   1.    P_WRAPPER_TUDO
                    multipart/related                               #   1.1.      P_WRAPPER_HTML
                        text/html                                   #   1.1.1.        P_MSG_HTML
                        attachment (disposition: inline, _imgcorpo_)#   1.1.2.        P_IMG_CORPO
                    attachment (disposition: attachment, nm_anexo)  #   1.2.      P_ANEXO (para cada anexo recebido)
            '''
            # 1.
            P_WRAPPER_TUDO  = MIMEMultipart('mixed')
            if email.email_host in ['smtp.mvconsultoria.com.br']:
                P_WRAPPER_TUDO.set_charset('utf-8')
            P_WRAPPER_TUDO['Subject'] = Header(email.assunto.encode('utf-8'), 'UTF-8').encode()
            P_WRAPPER_TUDO['From']    = email.email_origem
            P_WRAPPER_TUDO['To']      = COMMASPACE.join(email.lista_destinatarios)
            P_WRAPPER_TUDO['Date']    = formatdate(localtime=True)


            # 1.1
            P_WRAPPER_HTML  = MIMEMultipart('related')

            # 1.1.2
            P_IMG_CORPO = None
            if email.imagem_aberta_corpo:
                try:
                    # CHECAR SE É IMAGEM VÁLIDA COM A PYTHON IMAGE LIBRARY
                    email.imagem_aberta_corpo.seek(0)
                    Image.open(email.imagem_aberta_corpo) # SE ABRIU E NÃO DEU ERRO, É VÁLIDA

                    # a imagem no corpo do email vai no final da mensagem:
                    if "[[imagem]]" in email.texto_mensagem:
                        email.texto_mensagem = email.texto_mensagem.replace("[[imagem]]",'<img src="cid:___imgcorpo___">')
                    else:
                        email.texto_mensagem = email.texto_mensagem + u'\n<img src="cid:___imgcorpo___">'

                    email.imagem_aberta_corpo.seek(0)
                    main_tipo, sub_tipo = get_type(email.imagem_aberta_corpo.name)
                    P_IMG_CORPO = MIMEBase(main_tipo, sub_tipo)
                    P_IMG_CORPO.set_payload(email.imagem_aberta_corpo.read())
                    encoders.encode_base64(P_IMG_CORPO)
                    P_IMG_CORPO.add_header('Content-Disposition', 'inline')
                    P_IMG_CORPO.add_header('Content-ID', '<___imgcorpo___>')
                except:
                    P_IMG_CORPO = None # IMAGEM INVÁLIDA

            # 1.1.1
            email.texto_mensagem = u"""
            <html> <head> <meta http-equiv="content-type" content="text/html; charset=utf-8"> </head> <body> %s </body>  </html>
            """ % email.texto_mensagem.replace('\n', '<br/>')
            #P_MSG_HTML = MIMEText(_text=email.texto_mensagem, _subtype='html', _charset='utf-8')
            P_MSG_HTML  = MIMEText(email.texto_mensagem.encode('utf-8'), 'html', 'UTF-8')

            P_WRAPPER_HTML.attach(P_MSG_HTML)
            if P_IMG_CORPO != None:
                P_WRAPPER_HTML.attach(P_IMG_CORPO)

            P_WRAPPER_TUDO.attach(P_WRAPPER_HTML)

            # 1.2
            for anexo in email.lista_anexos_abertos:
                anexo.seek(0)
                main_tipo, sub_tipo = get_type(anexo.name)
                P_ANEXO = MIMEBase(main_tipo, sub_tipo)
                P_ANEXO.set_payload(anexo.read())
                encoders.encode_base64(P_ANEXO)
                P_ANEXO.add_header('Content-Disposition', 'attachment; filename="%s"' % clean_text(anexo.name.split('/')[-1]))
                P_WRAPPER_TUDO.attach(P_ANEXO)

            try:
                io = StringIO()
                g = Generator(io, False)
                g.flatten(P_WRAPPER_TUDO)
                if enviar_mala_direta:
                    param_sql = ParamSQL(tela  = 'mala_direta',
                                         sql   = sql_mala_direta.replace("\r","").replace("\n","").replace("__assunto__", email.assunto),
                                         texto = io.getvalue().replace("'","''"),
                                         email = email.email_origem
                                         )
                    param_sql.save()
                elif enviar_agora:
                    smtpserver.sendmail(email.email_origem, COMMASPACE.join(email.lista_destinatarios), io.getvalue())
                else:
                    for destinatario in email.lista_destinatarios:
                        email_a_env = EmailAEnviar()
                        email_a_env.email_origem  = email.email_origem
                        email_a_env.email_destino = destinatario
                        email_a_env.assunto       = email.assunto
                        email_a_env.mensagem      = io.getvalue()
                        email_a_env.save()
            except Exception as ex:
                erros.append( "%s" % ex )
                qtd_erros += 1
        except Exception as ex:
            erros.append( "%s" % ex )
            qtd_erros += 1

    if enviar_agora:
        smtpserver.close()

    return qtd_erros, erros
