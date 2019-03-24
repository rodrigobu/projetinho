import os
import time
import reportlab

from reportlab import platypus
from reportlab.graphics.shapes import Circle, Drawing, Group, Line, Rect, String
from reportlab.lib import utils, colors, enums, fonts
from reportlab.lib.pagesizes import  A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

from apps.parametros.models import Parametros


PASTA_FONTES = os.path.join(os.path.dirname(__file__), 'fonts')


FONTES = {
    # (file_name bold italic)
    'Arial': ('arial.ttf', 0,  0),
    'ArialBlack': ('ariblk.ttf', 0,  0),
    'Arial-Italic': ('ariali.ttf', 0,  1),
    'Arial-Bold': ('arialbd.ttf', 1,  0),
    'Arial-BoldItalic': ('arialbi.ttf',   1,  1),
    'Georgia': ('georgia.ttf', 0,  0),
    'Georgia-Italic': ('georgiai.ttf',  0,  1),
    'Georgia-Bold': ('georgiab.ttf',  1,  0),
    'Georgia-BoldItalic': ('georgiaz.ttf',  1,  1),
    'Palatino': ('pala.ttf', 0,  0),
    'Palatino-Italic': ('palai.ttf', 0,  1),
    'Palatino-Bold': ('palab.ttf', 1,  0),
    'Palatino-BoldItalic': ('palabi.ttf', 1,  1),
    'TrebuchetMs': ('trebuc.ttf', 0,  0),
    'TrebuchetMs-Italic': ('trebucit.ttf',  0,  1),
    'TrebuchetMs-Bold': ('trebucbd.ttf',  1,  0),
    'TrebuchetMs-BoldItalic':('trebucbi.ttf',  1,  1),
    'Verdana': ('verdana.ttf', 0,  0),
    'Verdana-Italic': ('verdanai.ttf',  0,  1),
    'Verdana-Bold': ('verdanab.ttf',  1,  0),
    'Verdana-BoldItalic': ('verdanaz.ttf',  1,  1),
    'Helvetica': ('helvetica.ttf', 0,  0),
    'Helvetica-Italic': ('helveticai.ttf',  0,  1),
    'Helvetica-Bold': ('helveticab.ttf',  1,  0),
    'Helvetica-BoldItalic': ('helveticaz.ttf',  1,  1),
}


def carrega_fonte(fonte):
    try:
        file_name, bold, italic = FONTES[fonte]
        font_path = os.path.join(PASTA_FONTES, file_name)
        pdfmetrics.registerFont(TTFont(fonte, font_path))
        nome_base = fonte.split('-')[0].lower()
        fonts.addMapping(nome_base, bold , italic , fonte)
        return fonte
    except KeyError:
        return "Fonte %s inexistente" % fonte


def cabecalhoRetrato(canvas, doc):
    topo = A4[1] - 1*cm
    rodape = 1*cm
    esquerda = 1*cm
    direita = A4[0] - 1*cm
    #salva configuracoes antes de fazer o canvas
    canvas.saveState()
    nome = doc.title
    canvas.setFont('Verdana-Bold', 5)
    data = time.strftime("%d/%m/%Y %H:%M", time.localtime())
    canvas.line(esquerda, rodape, direita, rodape)
    canvas.line(esquerda, topo - 0.7*cm, direita, topo - 0.7*cm)
    canvas.drawString(esquerda, topo, Parametros.get_instance().nome_fantasia)
    page = str(canvas.getPageNumber())
    canvas.setFont('Georgia-BoldItalic', 6)
    canvas.drawRightString(direita, topo - 0.5*cm, 'Página ' + page)
    canvas.setFont('Verdana-Bold', 5)
    canvas.drawString(esquerda, topo - 0.5*cm, data)
    canvas.setFont('Georgia-BoldItalic', 14)
    canvas.drawCentredString(direita/2 ,topo - 0.5*cm, nome)
    # restarta configuracoes
    canvas.restoreState()


def cabecalhoPaisagem(canvas, doc):
    direita = A4[1] - 1*cm
    esquerda = 1*cm
    rodape = 1*cm
    topo = A4[0] - 1*cm
    #salva configuracoes antes de fazer o canvas
    canvas.saveState()
    nome = doc.title
    canvas.setFont('Palatino-BoldItalic', 12)
    data = time.strftime("%d/%m/%Y %H:%M", time.localtime())
    canvas.line(esquerda, rodape, direita, rodape)
    canvas.line(esquerda, topo - 0.7*cm, direita, topo - 0.7*cm)
    canvas.drawString(esquerda, topo, Parametros.get_instance().nome_fantasia)
    page = str(canvas.getPageNumber())
    canvas.setFont('Georgia-BoldItalic',6)
    canvas.drawRightString(direita, topo - 0.5*cm, 'Página ' + page)
    canvas.setFont('Verdana-Bold', 5)
    canvas.drawString(esquerda, topo - 0.5*cm, data)
    canvas.setFont('Georgia-BoldItalic', 14)
    canvas.drawCentredString(direita/2 ,topo - 0.5*cm, nome)
    # restarta configuracoes
    canvas.restoreState()


def paragrafo(valores, estilo):
    p = []
    if isinstance(valores, list):
        for i in valores:
            p.append(platypus.Paragraph(convert_esp(i), estilo))
        return p
    else:
        return platypus.Paragraph(convert_esp(valores), estilo)


def cria_rpt(nome, diretorio, **kwargs):
    titulo_table = kwargs.get('titulo_table', [])
    conteudo = kwargs.get('conteudo', [])
    repeat = kwargs.get('repeat', 0)
    colunas = kwargs.get('colunas', [])
    sub_table = kwargs.get('sub_table', [])
    subtitulo = kwargs.get('subtitulo', None)
    orientacao = kwargs.get('orientacao', "r")
    footer = kwargs.get('footer', [])
    footer_cols = kwargs.get('footer_cols', [])

    if orientacao == "r":
        #margens
        topo     = A4[1] - 1*cm
        rodape   = 1*cm
        esquerda = 1*cm
        direita  = A4[0] - 1*cm
    else:
        direita  = A4[1] - 1*cm
        esquerda = 1*cm
        rodape   = 1*cm
        topo     = A4[0] - 1*cm

    story   = []
    Title   = nome
    arquivo = diretorio

    doc = platypus.SimpleDocTemplate(arquivo,
        pagesize   = A4,
        topMargin  = rodape + 1*cm,
        leftMargin = esquerda,
        title      = Title,
    )

    carrega_fonte("Georgia-BoldItalic")
    carrega_fonte("Georgia-Bold")
    carrega_fonte("Verdana")
    carrega_fonte("Verdana-Bold")
    carrega_fonte("Palatino-BoldItalic")

    style = ParagraphStyle(
        name      = "style",
        fontName  = "Georgia-BoldItalic",
        fontSize  = 10,
        leading   = 10,
        alignment = enums.TA_CENTER
    )

    if subtitulo:
        p = platypus.Paragraph(str(subtitulo), style)
        story.append(p)
        story.append(platypus.Spacer(0, 0.5*cm))

    style = ParagraphStyle(
        name      = "style",
        fontName  = "Verdana-Bold",
        fontSize  = 6,
        leading   = 6,
        alignment = enums.TA_CENTER
    )

    dados_table = []
    dados_aux   = []
    for i in titulo_table:
        dados_aux.append(platypus.Paragraph(i, style))
    dados_table.append(tuple(dados_aux))

    style2 = ParagraphStyle(
        name      = "style",
        fontName  = "Verdana",
        fontSize  = 6,
        leading   = 6,
        alignment = enums.TA_LEFT
    )

    for i in conteudo:
        if isinstance(i, tuple) or isinstance(i, list):
            dados_aux = []
            for j in i:
                dados_aux.append(platypus.Paragraph(j, style2))
            dados_table.append(tuple(dados_aux))
        else:
            c = platypus.Paragraph(str(i), style2)
            dados_table.append(c)

    if colunas:
        dados_aux=colunas
        colunas = []
        for i in dados_aux:
            colunas.append(i*cm)
        tabela = platypus.Table(
            dados_table,
            colunas,
            style=estilo(),
            repeatRows=repeat
        )
    else:
        tabela = platypus.Table(
            dados_table,
            style=estilo(),
            repeatRows=repeat
        )

    tabela.hAlign = "LEFT"
    story.append(tabela)

    if footer:
        dados_table2 = []
        dados_aux    = []
        for i in footer:
            dados_aux.append(platypus.Paragraph(i, style2))
        dados_table2.append(tuple(dados_aux))

        if footer_cols:
            dados_aux=footer_cols
            footer_cols = []
            for i in dados_aux:
                footer_cols.append(i*cm)
            tabela2 = platypus.Table(
                dados_table2,
                footer_cols,
                style=estilo(),
                repeatRows=repeat
            )
        else:
            tabela2 = platypus.Table(
                dados_table2,
                style=estilo(),
                repeatRows=repeat
            )

    tabela2.hAlign = "RIGHT"
    story.append(platypus.Spacer(0, 0.5*cm))
    story.append(tabela2)

    if orientacao=="r":
        doc.build(story,
           onFirstPage = cabecalhoRetrato,
           onLaterPages=cabecalhoRetrato
        )
    else:
        doc.build(story,
            onFirstPage = cabecalhoPaisagem,
            nLaterPages=cabecalhoPaisagem
        )

def estilo():
    return platypus.TableStyle(
        [('ALIGN',(0,0),(-1,-1),'LEFT'),
        ('LEFTPADDING',(0,0),(-1,-1), 2),
        ('RIGHTPADDING',(0,0),(0,0), 0),
        ('BOTTOMPADDING', (1,0),(0,0), 0),
        ('TOPPADDING', (1,0), (0,0), 0),
        ('INNERGRID', (0,0), (-1,-1), 0.5,  colors.black),
        ('BOX',(0,0),(-1,-1), 0.5 ,colors.black),
        ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
    ])
