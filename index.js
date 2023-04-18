import fs from 'fs';
import chalk from 'chalk';

function extraiLinks(texto, caminhoDoArquivo) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const capturas = [...texto.matchAll(regex)];
  const resultados = capturas.map(captura => ({text: captura[1], href: captura[2], file: caminhoDoArquivo}))
  return resultados;
}

function tratarErro(erro) {
  throw new Error(chalk.red(erro.code, 'não há arquivo no diretório'));
  }
  
  function lerArquivo(caminhoDoArquivo) {
    const codificacao = 'utf-8';
    fs.promises.readFile(caminhoDoArquivo, codificacao)
      .then((texto) => console.log(extraiLinks(texto, caminhoDoArquivo)))
      .catch(tratarErro);
  }
  
  // lerArquivo('./src/texto');
  lerArquivo('./src/texto.md');

//este arquivo deve exportar a função mdLinks.




// const resultados = capturas.map((captura) => ({
//   text: captura[1],
//   href: captura[2],
// }))



// export default mdLinks;