from django.shortcuts import render

from django.views.generic.base import TemplateView


class Home(TemplateView):
    ''' Class extendida do chatbot
    '''
    template_name = 'home/home.html'

    def get_context_data(self, **kwargs):
        context = super(Home, self).get_context_data(**kwargs)
        context['nome_chatbot'] = 'Washington'
        context['texto_inicial'] = 'OBA'
        return context

home = Home.as_view()
