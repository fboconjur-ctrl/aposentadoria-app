# Simulador Previdenciario

MVP local para comparar regras gerais de aposentadoria do RGPS urbano com parametros de 2026.

## Como abrir

Abra `index.html` no navegador. O app e estatico e nao precisa de servidor.

## O que ele faz

- Usa o NIS/PIS/PASEP como identificador do atendimento.
- Recebe idade, sexo cadastral, filiacao antes/depois da Reforma, tempo de contribuicao, carencia, tempo existente em 13/11/2019 e media salarial.
- Compara aposentadoria por idade, pontos, idade minima progressiva, pedagio de 50%, pedagio de 100%, professor, aposentadoria especial, pessoa com deficiencia, incapacidade permanente, idade rural e beneficio assistencial do portuario avulso.
- Gera relatorio preliminar a partir de texto colado do CNIS ou PDF do extrato quando o navegador consegue extrair texto.
- Mapeia beneficios previdenciarios e correlatos: auxilio por incapacidade temporaria, auxilio-acidente, salario-maternidade, pensao por morte, isencao de IR por doenca grave e acrescimo de 25%.
- Ordena a regra mais favoravel pela data mais proxima de elegibilidade e, em empate, pela estimativa de renda.

## Limites importantes

- Nao consulta CNIS, Dataprev ou Meu INSS.
- Nao substitui analise juridica/previdenciaria.
- Nao calcula todos os detalhes de RMI, descartes, atividades concomitantes, servidor publico, hibrida, MEI, baixa renda, facultativo ou validacao documental.
- Regras de deficiencia dependem de avaliacao biopsicossocial.
- Regras de incapacidade dependem de Pericia Medica Federal.
- Regras especiais dependem de PPP/LTCAT e enquadramento tecnico da exposicao.
- Trabalhador rural e portuario avulso dependem de comprovacao documental e analise administrativa.
- A leitura de PDF depende de texto pesquisavel no arquivo. PDFs escaneados podem exigir OCR antes.
- A aba de beneficios e uma triagem, nao uma decisao administrativa.
- As regras devem ser revisadas sempre que houver alteracao legal ou normativa.

## Fontes usadas para parametrizacao inicial

- Portal Gov.br/INSS: regras de aposentadorias.
- Portal Gov.br/INSS: regras de transicao mudam requisitos para aposentadoria em 2026.
- Portal Gov.br/INSS: aposentadoria da pessoa com deficiencia por idade e por tempo.
- Portal Gov.br/INSS: aposentadoria por incapacidade permanente.
- Portal Gov.br/INSS: aposentadoria especial.
- Portal Gov.br/INSS: aposentadoria por idade rural.
- Portal Gov.br/INSS: beneficio assistencial para trabalhador portuario avulso.
- Portal Gov.br/INSS: auxilio por incapacidade temporaria, auxilio-acidente, salario-maternidade e pensao por morte.
- Receita Federal/Gov.br: isencao de IRPF para portadores de molestia grave.
- Emenda Constitucional 103/2019.
