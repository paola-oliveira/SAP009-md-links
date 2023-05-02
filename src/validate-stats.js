// import fetch from 'node-fetch';

import chalk from "chalk";

//retorna um novo array contendo apenas os valores da propriedade href
function extrairHrefs(arrLinks) {
  return arrLinks.map((objetoLink) => objetoLink.href);
}

//verificação do status de cada link
export function checaStatus(listaURLs) {
  const arrPromises = listaURLs.map((url) => {
    return fetch(url)
      .then(response => {
        if (response.ok) {
          return chalk.green(`OK | ${response.status}`);
        } else {
          return chalk.red(`FAIL | ${response.status}`);
        }
      })
      .catch(erro => manejaErros(erro));
  });
  return Promise.all(arrPromises);
}

//lida com o erro no checaStatus
export function manejaErros(erro) {
  if (erro?.cause?.code === 'ENOTFOUND') {
    return chalk.red('Ops, link não encontrado!');
  }
  return 'Ocorreu algum erro';
}

//extrai os hrefs dos links de uma lista de objetos de links, 
//verifica o status de cada URL usando a função checaStatus, e retorna uma nova lista de objetos de links com um campo adicional de status
export default function listaValidada(listaDeLinks) {
  const links = extrairHrefs(listaDeLinks);
  return checaStatus(links)
    .then((status) => {
      return listaDeLinks.map((objeto, indice) => ({
        ...objeto,
        status: status[indice],
      }));
    });
}

//é feito as estatisticas 
export function calculaStats(links) {
  const total = links.length;
  const unique = new Set(links.map((link) => link.href)).size;
  const broken = links.filter((link) => (!link.status.includes('OK'))).length;

  const stats = {
    total,
    unique,
    broken
  };

  return stats;
}