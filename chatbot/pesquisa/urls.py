from django.urls import path

from pesquisa.views import views

urlpatterns = [
    path('', views.index, name='index'),
]
