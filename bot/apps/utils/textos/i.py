from django.utils.translation import ugettext as _

textos_i = {
    'id_empresa': _(u"Codigo da Empresa"),
    'idade': _(u"Idade"),
    'idade_inicial': _(u"Idade Inicial"),
    'idade_ini_menor_idade_fin':  _(u'A Idade Inicial deve ser menor que a Idade Final.'),
    'idade_final': _(u"Idade Final"),
    'idioma': _(u'Idioma'),
    'idioma_de': _(u'Idioma De'),
    'idioma_para': _(u'Idioma Para'),
    'idiomas': _(u'Idiomas'),
    'idioma_duplicado': _(u"Já existe um Idioma com essa descrição."),
    'idioma_nao_encontrado': _(u"O Idioma não foi encontrado."),
    'idioma_sucesso': _(u"O Idioma foi salvo com sucesso."),
    'idiomas_duplicados': _(u'Este idioma já foi selecionado anteriormente.'),
    'idiomas_n_preenchidos': _(u'Existem idiomas não preenchidos. Para adicionar outros, preencha primeiro os adicionados.'),
    'idioma_cand_duplicados': _(u'Este idioma já esta adicionado ao seu cadastro.'),
    'idioma_vaga_duplicados': _(u'Já existe um Idioma com essa descrição para a vaga.'),

    'ie_cobr': _(u'I.E. Cobr.'),
    'ie_rg': _(u'I.E./RG'),

    'im': _(u'I.M'),
    'im_cobr': _(u'I.M. Cobr.'),
    'imagem': _(u'Imagem'),
    'imagem_excluir_confirm': _(u'Deseja realmete excluir a imagem?'),
    'imagem_curriculo_candidato': _(u'Imagem do Currículo do Candidato'),
    'imagem_curriculo_candidato_sem': _(u'O Candidato não tem Imagem do Currículo.'),
    'imagem_curriculo_inexistente': _(u'Imagem do Currículo inexistente.'),
    'imagem_curriculo_erro_formato': _(u'Imagem do Currículo em formato não permitido. Os arquivos aceitos são: %s.'),
    'imagem_curriculo_erro_formato_simples': _(u'Imagem do Currículo em formato não permitido.'),
    'imagem_curriculo_removido': _(u'Imagem do Currículo removida com sucesso.'),
    'imagem_jpg_erro': _(u'O arquivo deve ser da extensão .jpg.'),
    'imagem_invalida_dimensao_error': _(u'O arquivo deve ter no máximo {}x{} de dimensões.'),
    'imagem_invalida_tamanho_error': _(u'O arquivo deve ter no máximo {}.'),
    'imagem_invalida_extensao_error': _(u"O arquivo deve ser da extensão {} ."),
    'imagem_invalida_error': _(u"Esse não é um arquivo de imagem válido."),
    'importacao_candidato_ja_importado': _(u'Não é possível realizar a Importação. Este Candidato já está na base de dados do SPA.'),
    'importacao_candidato_ja_importado_simples':  _(u'Este Candidato já está na base de dados do SPA.'),
    'importacao_candidato_achaempregos': _(u'Importação de Candidato - Achaempregos'),
    'importacao_candidato_achaempregos_instrucao': _(u'Relacione abaixo as informações do Candidato do sistema Achaempregos com o SPA e clique no botão "Importar Candidato" para que o processo de importação seja concluído com sucesso.'),
    'importacao_candidato_achaempregos_log': _(u'O usuário importou um candidato do Achaempregos'),
    'importacao_candidato_bne': _(u'Importação de Candidato - BNE'),
    'importacao_candidato_bne_instrucao': _(u'Relacione abaixo as informações do Candidato do sistema BNE com o SPA e clique no botão "Importar Candidato" para que o processo de importação seja concluído com sucesso.'),
    'importacao_candidato_bne_log': _(u'O usuário importou um candidato do BNE'),
    'importar_candidato': _('Importar Candidato'),
    'imprimir_logo': _(u'Imprimir Logo na Especificação da Vaga no Portal do Candidato'),
    'imprimir_logotipo': _(u'Imprimir Logotipo?'),
    'imprimir': _('Imprimir'),
    'imprimir_rpt0023': _('Imprimir apenas Candidatos'),
    'imprimir_dados_atuais': _('Listar dados atuais'),
    'impressao_carta_encaminhamento': _(u'Impressão de Carta de Encaminhamento'),
    'imprimir_ult_occor_cliente': _(u'Imprimir última ocorrência do cliente'),
    'impressao_documentos' : _(u'Impressão de Documentos'),
    'impressao_documento_processo_seletivo': _(u'Impressão de Doc. para Proc. Seletivo'),
    'impressao_documento_aprovacao': _(u'Impressão de Doc. para Aprovação'),

    'incluir_exportados': _(u'Incluir Exportados'),
    'inativo': _('Inativo'),
    'inativo_ate': _(u'Inativo Até'),
    'inicio_data_hora': _(u'Início (Data / Hora)'),
    'inicia_em': _(u'Inicia em'),
    'informado': _(u'Informado'),
    'informado_nao': _(u'Não Informado'),
    'informacoes_agencia': _(u'Informações da Agência'),
    'informacoes_complementares': _(u'Informações Complementares'),
    'informe_campos': _(u'Informe os campos.'),
    'informe_nova_palavra_chave': _(u'Informe uma nova Palavra-chave para a Vaga'),
    'info_profissionais': _(u'Informações Profissionais'),
    'invalid_login': _(u'''
       Login ou senha incorretos.
       Sistema diferencia letras maiúsculas de minúsculas.
    '''),
    'inspecao': _(u'Inspeção'),
    'integrante_sucesso': _(u'Integrante salvo com sucesso.'),
    'indefinido': _(u'Indefinido'),
    'indiferente': _(u'Indiferente'),
    'insalubridade': _(u'Insalubridade'),
    'inserir': _(u'Inserir'),
    'inserir_editar': _(u'Inserir/Editar'),
    'inserir_fila_selecao': _(u'Inserir na Fila de Seleção'),
    'inserir_pr_sel': _(u'Inserir Proc. Seletivo'),
    'inserir_proc_sel': _(u'Inserir no Processo Seletivo'),
    'inserir_comparecimento': _(u'Convocar Candidato'),
    'insercao_candidato_comparecimento': _(u'Convocação de Candidato'),
    'insercao_candidato_proc_sel': _(u'Inserção de Candidato no Processo Seletivo'),
    'inst_ensino': _(u'Instituto de Ensino'),
    'inst_ensinos': _(u'Institutos de Ensino'),
    'instrucao_login': _(u'Entre com seus dados'),
    'instrucao_recuperacao_senha': _(u'Esqueci Minha Senha'),
    'instrucao_recuperacao_acesso': _(u'Entre com a nova senha de acesso:'),
    'integracoes': _(u'Integrações'),
    'intelectual': _(u'Intelectual'),
    'intervalo_datas_invalido': _(u'Intervalo de datas inválido.'),
    'intervalo_tempo': _(u'Intervalo de Tempo'),
    'intervalo_tempo_fila_selecao': _(u'''Configure o intervalo de tempo em que
    o sistema irá checar se existe algum candidato na fila de seleção para ser atendido.'''),
    'instituto_ensino': _(u"Instituto de Ensino"),
    'institutoensino_duplicado': _(u"Já existe um Instituto de Ensino com essa descrição."),
    'institutoensino_nao_encontrado': _(u'O Instituto de Ensino não foi encontrado.'),
    'institutoensino_sucesso': _(u"O Instituto de Ensino foi salvo com sucesso."),
    'instrucao_conclusao': _(u'Instruções de conclusão do teste'),
    'instrucao_inicio': _(u'Instruções de início do teste'),
    'integracoes': _(u'Integrações'),
    'integracao_catho': _(u'Integração Catho'),
    'integracao_gi': _(u'Integração Folha de Pagamento'),
    'infojobs_publicada': _(u"Vaga Publicada na InfoJobs"),
    'infojobs_publicacao_instrucao': _(u"Cliquei em 'Publicar' para publicar a vaga na InfoJobs"),
    'infojobs_publicada_descricao': _(u'Vaga Publicada em {}  pelo usuário {}. <br/>Código da Vaga na Catho: {}<br/>Status: <b>{}</b>'),
    'integracao_infojobs': _(u'Integração InfoJobs'),
    'integracao_infojobs_vaga_nao_encontrada': _(u'Não foi possível encontrar a vaga na InfoJobs'),
    'integracao_infojobs_desativada_sucesso': _(u"Vaga desativada com sucesso."),
    'integracao_infojobs_publicada': _(u"Vaga publicada com sucesso."),
    'integracao_area_funcao': _(u"Integração na Area da Função"),
    'integracao_funcao': _(u"Integração na Função"),
    'integracao_facebook': _(u'Integração Facebook'),
    'integracao_pagseguro': _(u'Integração PagSeguro'),
    'integracao_senior': _(u'Integração Senior'),
    'internal_server_error': _(u'Internal Server Error.'),
    'invalido': _(u'Inválido'),
    'invalida': _(u'Inválida'),

    'ip': _('IP'),
    'ip_duplicado': _(u"Já existe esse IP cadastrado."),
    'ip_label': _('IP (com pontos)'),
    'ip_sucesso': _(u"O IP foi salvo com sucesso."),

    'ir_listagem': _('Ir para Listagem'),
}
