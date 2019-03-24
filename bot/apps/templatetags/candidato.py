from django import template
from django.utils.safestring import mark_safe

from apps.utils.icones import icones
from apps.utils.textos import textos

register = template.Library()

@register.simple_tag
def get_google_rota(candidato, vaga):
    return mark_safe(candidato.get_cep_mapa_completo(vaga=vaga))
