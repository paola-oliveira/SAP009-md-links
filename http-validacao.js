function extraiLinks(arrLinks) {
    return arrLinks.map((objetoLink) => objetoLink.href);
  }
  
  export default function listaValidada(listaDeLinks) {
    return extraiLinks(listaDeLinks);
  }