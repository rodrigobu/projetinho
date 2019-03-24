# -*- coding:utf-8 -*-
from django.utils.translation import ugettext as _

textos_r = {
    'ramal': _(u'Ramal'),
    'ramal1': _(u'Ramal 1'),
    'ramal2': _(u'Ramal 2'),
    'ramo_atividade': _(u'Ramo de Atividade'),
    'ramos_atividade': _(u'Ramos de Atividade'),
    'ramo_atividade_duplicado': _(u"Já existe um Ramo de Atividade com essa descrição."),
    'ramoatividade_nao_encontrado': _(u'O Ramo de Atividade não foi encontrado.'),
    'ramo_atividade_sucesso': _(u"O Ramo de Atividade foi salvo com sucesso."),
    'razao_cliente': _(u'Razão do Cliente'),
    'razao_social': _(u'Razão Social'),

    'reabertas': _(u'Reabertas'),
    'realizacoes': _(u'Realizações'),
    'realizar_assinatura_premium': _(u'Para se candidatar à Vaga realize sua'),
    'realizar_manutencao': _(u'Realizar Manutenção'),
    'reativar': _(u'Reativar'),
    'reativar_vaga': _(u'Reativou a Vaga'),
    'reativacao_candidatos': _(u'Reativação de Candidatos'),
    'reativacao_candidatos_descricao': _(u'Selecione um candidato específico ou um intervalo de datas para reativar todos os candidatos inativos dentro dele.'),
    'reativar_por_candidato': _(u'Reativar por Candidato'),
    'reativar_por_intervalo': _(u'Reativar por Intervalo'),
    'reativacao_candidatos_data_inativa_invalida': _(u'É necessário preencher a nova data de inatividade.'),
    'reativacao_candidatos_erro_intervalo': _(u'Não há candidatos inativos neste período.'),
    'reativacao_candidatos_erro_candidato': _(u'É necessário informar um candidato para esta opção.'),
    'reativacao_candidatos_log_alteracao': _(u'Alteração da data de inatividade do candidato ({}) {} de {} para {}.'),
    'reativacao_candidatos_log_um': _(u'Reativado o candidato cód.: {}'),
    'reativacao_candidatos_log_varios': _(u"""Reativado os candidatos que estavam desativados no periodo de {} até {},
    com os seguintes candidatos (códigos): {}"""),
    'reativacao_candidatos_opcao_invalida': _(u'É necessário escolher uma opção.'),
    'reativacao_candidatos_sucesso_alteracao': _(u'Candidato alterado com sucesso.'),
    'reativacao_candidatos_sucesso_um': _(u'Candidato reativado com sucesso.'),
    'reativacao_candidatos_sucesso_varios': _(u'Candidatos reativados com sucesso.'),
    'reativacao_vaga': _(u'Reativação da Vaga'),
    'reativacao_vaga_erro': _(u'Não foi possível reativar a vaga.'),
    'reativacao_vaga_sucesso': _(u'Vaga reativada com sucesso.'),
    'recado_com': _(u'Recado com'),
    'recepcao': _(u'Recepção'),
    'recorte_foto': _(u'Recorte de Foto'),
    'recorte_foto_help': _(u'Arraste o quadrado azul para alterar a posição e o tamanho.'),
    'recorte_foto_preview_help': _(u'Como a foto será exibida.'),
    'recorte_foto_erro': _(u'Não foi possível salvar a foto. Detalhes {}'),
    'recorte_imagem': _(u'Recorte de Imagem'),
    'recorte_imagem_help': _(u'Arraste o quadrado azul para alterar a posição e o tamanho.'),
    'recorte_imagem_preview_help': _(u'Como a imagem será exibida.'),
    'recorte_imagem_erro': _(u'Não foi possível salvar a imagem. Detalhes {}'),
    'recorte_logo': _(u'Recorte de Logo'),
    'recorte_logo_help': _(u'Arraste o quadrado azul para alterar a posição e o tamanho.'),
    'recorte_logo_preview_help': _(u'Como o logo será exibido.'),
    'recorte_logo_erro': _(u'Não foi possível salvar o logo. Detalhes {}'),
    'recrutador': _(u'Recrutador'),
    'recrutador_sucesso': _(u'O Recrutador foi salvo com sucesso.'),
    'recrutador_duplicado': _(u"Já existe um Recrutador com esse Nome."),
    'recrutador_nao_encontrado': _(u'O Recrutador não foi encontrado.'),
    'recuperacao_senha_assunto': _(u'SPA - Alteração de Senha'),
    'recuperacao_senha_sucesso': _(u'Você receberá em instantes um e-mail com a sua senha nova.'),
    'recuperacao_senha_desabilitada': _(u'Não foi possível enviar sua senha por e-mail, pois o servidor de e-mail está em manutenção.'),
    'recuperacao_senha_sem_email': _(u'''Candidato não possui e-mail cadastrado. Entre em contato com a agência pelo site: {} ou telefone {}.'''),
    'recusar_candidatura_online': _(u'Recusar Candidatura Online'),
    'redes_sociais': _(u'Redes Sociais'),
    'rejeitar': _(u'Rejeitar'),
    'rejeitada': _(u'Rejeitada'),
    'relacao': _(u'Relação'),
    'relacao_duplicado_desc':  _(u"Já existe uma Relação com essa descrição."),
    'relacao_sucesso':  _(u"A Relação foi salva com sucesso."),
    'relacoes': _(u'Relações'),
    'relacao_de': _(u'Relação De'),
    'relacao_para': _(u'Relação Para'),
    'relacao_duplicado': _(u"Já existe uma Relação com essa descrição."),
    'relacao_nao_encontrado': _(u"A Relação não foi encontrada."),
    'relatorio': _(u'Relatório'),
    'relatorios': _(u'Relatórios'),
    'relatorios_log': _(u'O usuário gerou o relatório com os seguintes filtros: {}.'),
    'relatorio_0001': _(u'Relatório de Vaga x Status'),
    'relatorio_0002': _(u'Relatório de Vaga x Cliente'),
    'relatorio_0003': _(u'Relatório de Parecer do Candidato'),
    'relatorio_0004': _(u'Relatório de Candidatos Aprovados'),
    'relatorio_0004_form_invalido': _(u'É preciso selecionar pelo menos uma opção de Imprimir.'),
    'relatorio_0005': _(u'Relatório de Perfil da Vaga'),
    'relatorio_0006': _(u'Relatório de Perfil do Cliente'),
    'relatorio_0007': _(u'Relatório de Ocorrências do Cliente'),
    'relatorio_0008': _(u'Relatório de Análise de Vagas'),
    'relatorio_0010': _(u'Relatório de Contatos no Cliente'),
    'relatorio_0011': _(u'Relatório de Solicitação de Comparecimento'),
    'relatorio_0012': _(u'Relatório de Candidatos Encaminhados'),
    'relatorio_0013': _(u'Relatório de Propostas e Serviços'),
    'relatorio_0014': _(u'Relatório de Fila de Candidatura'),
    'relatorio_0015': _(u'Relatório de Participantes do Processo Seletivo'),
    'relatorio_0016': _(u'Relatório de Candidatos Importados do BNE'),
    'relatorio_0017': _(u'Relatório de Mapa de Contato com Cliente'),
    'relatorio_0018': _(u'Relatório de Envio de SMS'),
    'relatorio_0019': _(u'Relatório de Vagas sem Encaminhamentos'),
    'relatorio_0020': _(u'Relatório de Cliente x Promotor'),
    'relatorio_0021': _(u'Listagem de Log'),
    'relatorio_0022': _(u'Relatório de Candidatos Inativos'),
    'rel_txt_titulo_em_andamento': _(u'Gerando Relatório...'),
    'rel_txt_titulo_de_finalizacao': _(u'O relatório foi gerado com sucesso.'),
    'rel_txt_msg_de_finalizacao': _(u'Relatório gerado com sucesso!'),
    'rel_txt_text_cronometro': _(u'Criando Páginas... Por favor, aguarde.'),
    'rel_txt_relatorio_em_branco': _(u'Relatório Gerado em Branco. Não existem registros no intervalo selecionado.'),
    'rel_txt_msg_relatorio_erro': _(u'Não foi possível gerar o relatório.  Por favor, tente novamente mais tarde.'),
    'rel_txt_notifica_alerta': _(u'''O processo de geração do relatório ainda está em andamento. Você será notificado assim que estiver disponível para download em suas Notificações.'''),
    'rel_txt_titulo_cancelado': _(u'Processo Cancelado'),
    'rel_txt_titulo_confirma_cancelado': _(u'Deseja cancelar?'),
    'rel_txt_msg_confirma_cancelado': _(u'Tem certeza de que deseja cancelar este processo?'),
    'rel_txt_download_msg': _(u'Clique aqui para baixá-lo.'),
    'remetente': _(u'Remetente'),
    'remover': _(u'Remover'),
    'remover_anexo': _(u'Remover Anexo'),
    'remover_anexo_confirmar': _(u'Deseja realmente remover o anexo?'),
    'remover_curriculo_anexo': _(u'Remover Currículo Anexo'),
    'remover_curriculo_anexo_confirmar': _(u'Deseja realmente remover o currículo anexo?'),
    'remover_imagem_curriculo_anexo': _(u'Remover Imagem do Currículo Anexa'),
    'remover_imagem_curriculo_anexo_confirmar': _(u'Deseja realmente remover a imagem do currículo anexa?'),
    'requisitante': _(u'Requisitante'),
    'reservista': _(u'Reservista'),
    'responder_mensagem': _(u'Responder Mensagem'),
    'resumo_curriculo': _(u'Resumo do Currículo'),
    'restricao': _(u'Restrição'),
    'restricao_erro': _(u'Não foi possível aplicar a restrição.'),
    'restricao_sucesso': _(u'Restrição foi aplicada com sucesso.'),
    'restricao_confirma' : _(u'Deseja realmente aplicar a restrição ao colaborador?'),
    'restricao_remover_confirma': _(u'Deseja realmente remover a restrição do colaborador?'),
    'restricao_remover_sucesso': _(u'A restrição foi removida com sucesso.'),
    'restricao_instrucao_consulta': _(u'Os detalhes das restrições devem permanecer em sigilo.'),
    'resposta': _(u'Resposta'),
    'religiao': _(u'Religião'),
    'religioes': _(u'Religiões'),
    'religiao_duplicada': _(u"Já existe uma Religião com essa descrição."),
    'religiao_nao_encontrada': _(u'A Religião não foi encontrada.'),
    'religiao_sucesso': _(u"A Religião foi salva com sucesso."),
    'responsavel': _(u'Responsável'),
    'responsavel_selecao': _(u'Responsável pela Seleção'),
    'resposta': _(u'Resposta'),
    'resposta_correta': _(u'Resposta Correta'),
    'resposta_obrigatoria': _(u'É obrigatório responder.'),
    'retornar': _(u'Retornar'),
    'retornar_login': _(u'Retornar ao Login'),
    'requisitar_vaga': _(u'Requisitar Vaga'),
    'requisicao_vaga': _(u'Requisição Online de Vaga'),
    'requisicao_vaga_sucesso': _(u'A Requisição de Vaga foi realizada com sucesso.'),
    'requisicoes_vaga':_(u'Requisições de Vagas'),
    'requisitar_vaga_instrucao': _(u'Preencha os dados abaixo para requisitar uma vaga'),
    'requisicao_vaga_habilitar': _(u'Habilitar Requisição Online de Vagas'),
    'requisitar_vaga_integrado_pagseguro': _(u'Requisição de Vaga Integrada PagSeguro'),
    'requisitar_vaga_pagamento':_(u'para efetuar o pagamento da Requisição da Vaga.'),

    'rg': _(u'RG'),
    'rgb_btn_cadastro_cand_portal': _(u'Código da cor do botão do "Cadastre seu Currículo" (999999)'),
    'rgb_btn_cadastro_cand_portal_help': _(u'Caso queira deixar na cor do Tema, deixe o campo em branco.'),
    'rgb_btn_cadastro_cand_portal_invalido':  _(u'Código da cor do "Cadastre seu Currículo" inválida.'),

    'rotulo_campos': _(u'Rótulo de Campos'),
    'rotulo_campo_deficiencia': _(u'Rótulo de Deficiência para Candidatos'),
    'rotacionar_esquerda': _(u'Rotacionar Esquerda'),
    'rotacionar_direita': _(u'Rotacionar Direita'),
}
