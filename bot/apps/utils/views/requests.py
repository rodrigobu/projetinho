from django.contrib import messages

from apps.utils.types.data_e_hora import convert_data_to_banco

# from apps.usuario.models import Usuario


class RequestUtilsMixin(object):

    # @property
    # def usuario(self):
    #     return Usuario.get_user_logado(self.request)

    def set_session(self, key, value):
        self.request.session[key] = value

    def get_session(self, key):
        try:
            return self.request.session[key]
        except:
            return None

    def new_or_create_blanc(self, model, id):
        if id:
            return model.objects.get(pk=id)
        return model()

    def get_check_by_request(self, key):
        dado = key in self.request.POST
        if not dado:
            dado = key in self.request.GET
        return dado

    def get_by_request(self, key, boolean=False, default=None, inteiro=False,
                       data=False):
        dado = self.request.POST.get(key, None)

        if dado == "None":
            dado = None

        if not dado:
            dado = self.request.GET.get(key, None)

        if dado == "None":
            dado = None

        if not dado:
            dado = default

        if boolean:
            dado = dado in ('True', "true")
            if not dado:
                dado = key in self.request.POST or key in self.request.GET

        elif inteiro:
            dado = int(dado)

        elif data:
            dado = convert_data_to_banco(dado)

        return dado

    def get_list_by_request(self, key, default=[], inteiros=False, separador="|"):
        lista = self.request.POST.getlist(key, self.request.POST.getlist(key+"[]", default))
        if not lista:
            lista = self.request.GET.getlist(key, self.request.GET.getlist(key+"[]", default))
        if inteiros:
            lista = map(int, lista)
        return lista

    def get_bool_by_request(self, key, default=None):
        return self.get_by_request(key, boolean=True, default=default)

    def get_int_by_request(self, key, default=None):
        return self.get_by_request(key, inteiro=True, default=default)

    def get_date_by_request(self, key, default=None):
        return self.get_by_request(key, data=True, default=default)

    def make_dados_select(self, dados):
        ''' Método para captura e geração dos dados vindos de selects simples
        '''
        try:
            dados = map(str,dados)
        except:
            pass
        lista = list(set(dados))
        if not lista:
            return ''
        return '(%s)' % ','.join(lista)

    def make_multi_select(self, key, dados):
        ''' Método para captura e geração dos dados vindos de multiselect
        '''
        if 'multiselect-all' in dados.getlist(key):
            dados.getlist(key).remove('multiselect-all')

        lista = list(set(dados.getlist(key)))
        if not lista:
            return ''
        lista = filter(lambda z: len(z)>0, lista) #remove indices em branco
        return '(%s)' % ','.join(lista)


class ObjectMixinView(RequestUtilsMixin):
    ''' Sobreescreve a função get_object para pegar o objecto vindo das
    requisições.
    '''
    model_object = None
    key_object = 'id'

    def get_object(self):

        obj_id = self.get_by_request(self.key_object)
        if not obj_id:
            obj_id = self.kwargs.get(self.key_object, None)
        try:
            return self.model_object.objects.get(pk=obj_id)
        except Exception as msg:
            try:
                return self.model_object.objects.get(slug=obj_id)
            except Exception as msg:
                return None


class MessagesView(object):
    ''' View Proxy para mensagens do Django
    '''

    def success(self, msg):
        messages.success(self.request, msg)

    def error(self, msg):
        messages.error(self.request, msg)

    def warning(self, msg):
        messages.warning(self.request, msg)
