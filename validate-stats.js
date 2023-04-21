import fetch from 'node-fetch';

function extraçãoiLinks(arrLinks) {
  return arrLinks.map((objetoLink) => objetoLink.href);
}

function checaStatus(listaURLs) {
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

function manejaErros(erro) {
  if (erro.code === 'ENOTFOUND') {
    return 'Ops, link não encontrado!';
  }
  return 'Ocorreu algum erro';
}



export default function listaValidada(listaDeLinks) {
  const links = extraçãoiLinks(listaDeLinks);
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
  const broken = links.filter((link) => (link.ok === false)).length;

  const stats = {
    total,
    unique,
    broken
  };

  return stats;
}











//   [Teste não é possivel acessar o site](http://paoladev.com.br/). 
