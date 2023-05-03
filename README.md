# MdLinks 🔗💻

<div align="center">
<h3 class="titulo">Ferramentas utilizadas 🔧</h4>
</div>
<div align="center">
 <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" style="height: 30px;"/>
 <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg" alt="Node.js" style="height: 30px;"/>
 <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" alt="Jest" style="height: 30px;"/> 
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" style="height: 30px;"/> 
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/sap009-md-links">Biblioteca Publicada 🔎🔗</a>
</div>

## Índice

  - [1. Objetivo do Projeto](#1-objetivo-do-projeto)
  - [2. Instruções de instalação](#2-instruções-de-instalação)

***

## 1. Objetivo do Projeto

Este é o quarto projeto desenvolvido pelo bootcamp @Laboratoria, e é focado em BACK-END. Trata-se da biblioteca [Markdown Links](https://pt.wikipedia.org/wiki/Markdown), cujo objetivo é identificar links em arquivos markdown, bem como verificar o status https de cada um deles. A biblioteca foi criada utilizando [NodeJS](https://nodejs.org/) e pode ser executada através de linha de comando (CLI).


## 2. Instruções de instalação

- No terminal, executar o comando:

`npm install paola-oliveira/SAP009-md-links`

- Após a instalação, é possível executar os seguintes comandos: 

 `md-links ./nomeDoDiretório`

 Esse comando procura arquivos Markdown na rota especificada e imprime os links encontrados, juntamente com a rota do arquivo em que cada link foi encontrado. 

`md-links ./nomeDoDiretório/caminhoDoArquivo`

Esse comando lê o arquivo Markdown especificado e imprime o caminho do arquivo, os links encontrados e o texto correspondente de cada link.

`md-links ./nomeDoDiretório/caminhoDoArquivo --validate`

Se você adicionar a opção --validate, o módulo fará uma requisição HTTP para verificar se cada link funciona ou não. Se o link redirecionar para uma URL que responde ok, será considerado como um link válido. Caso contrário, será marcado como inválido e o código de resposta será exibido.

`md-links ./nomeDoDiretório/caminhoDoArquivo --stats`

Se você adicionar a opção --stats, será exibido um resumo estatístico dos links encontrados no arquivo especificado. Será mostrado o número total de links e o número de links únicos.

`md-links ./nomeDoDiretório/caminhoDoArquivo --stats --validate`

Se você adicionar as opções --stats e --validate, além das informações de total de links e links únicos, também será exibido o número de links inválidos encontrados.

