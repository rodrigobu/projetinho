from django.shortcuts import render

from django.views.generic.base import TemplateView


class Home(TemplateView):
    ''' Class extendida do chatbot
    '''
    template_name = 'home/home.html'

home = Home.as_view()
