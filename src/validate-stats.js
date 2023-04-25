// import fetch from 'node-fetch';


function extrairHrefs(arrLinks) {
  return arrLinks.map((objetoLink) => objetoLink.href);
}

export function checaStatus(listaURLs) {
  const arrPromises = listaURLs.map((url) => {
    return fetch(url)
      .then(response => {
        if (response.ok) {
          return `OK ${response.status}`;
        } else {
          return `FAIL ${response.status}`;
        }
      })
      .catch(erro => manejaErros(erro));
  });
  return Promise.all(arrPromises);
}

export function manejaErros(erro) {
  if (erro?.cause?.code === 'ENOTFOUND') {
    return 'Ops, link não encontrado!';
  }
  return 'Ocorreu algum erro';
}




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










//   [Teste não é possivel acessar o site](http://paoladev.com.br/). 
