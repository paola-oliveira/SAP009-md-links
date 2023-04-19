import fs from 'fs';
import chalk from 'chalk';

// extrair os links contidos em um texto e retorná-los em um array de objetos.
function extraiLinks(texto, caminhoDoArquivo) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const capturas = [...texto.matchAll(regex)];
  const resultados = capturas.map(captura => ({text: captura[1], href: captura[2], file: caminhoDoArquivo}))
  return resultados.length !== 0 ? resultados : chalk.bold.red('✘ Não há links no arquivo ✘')
}

//é chamada quando ocorre um erro na leitura do arquivo e lança uma exceção com uma mensagem personalizada.
function tratarErro(erro) {
  throw new Error(chalk.red(erro.code, 'não há arquivo no diretório'));
  }
//lê um arquivo e retorna uma promise que, quando resolvida, chama a função extraiLinks com o conteúdo do arquivo lido, e, quando rejeitada, chama a função tratarErro com o erro ocorrido.
  function lerArquivo(caminhoDoArquivo) {
    const codificacao = 'utf-8';
    return fs.promises.readFile(caminhoDoArquivo, codificacao)
      .then((texto) => extraiLinks(texto, caminhoDoArquivo))
      .catch(tratarErro);
  } 
  
  // lerArquivo('./src/texto.md');

export default lerArquivo;