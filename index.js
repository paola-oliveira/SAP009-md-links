import fs from 'fs';
import chalk from 'chalk';
import {
  imprimeLista
} from './cli.js'
import {
  calculaStats
} from './validate-stats.js';

// extrair os links contidos em um texto e retorná-los em um array de objetos.
function extraiLinks(texto, caminhoDoArquivo) {
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const capturas = [...texto.matchAll(regex)];
  const resultados = capturas.map(captura => ({
    text: captura[1],
    href: captura[2],
    file: caminhoDoArquivo
  }))
  return resultados;
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


function mdLinks(path, options) {

  // Verifica se o path é indefinido ou nulo, e se for, lança um erro personalizado.
  try {
    if (!path) throw new Error('Path indefinido ou nulo');
    const estado = fs.lstatSync(path);

    // Verifica se o path é um diretório e não tem a extensão .md, e se for, lê todos os arquivos no diretório e imprime a lista de links para cada arquivo.
    if (estado.isDirectory() && !path.endsWith('.md')) {
      fs.promises.readdir(path)
        .then(arquivos => {
          arquivos.forEach(nomeDeArquivo => {
            lerArquivo(`${path}/${nomeDeArquivo}`)
              .then(resultado => {
                console.log(`${path}/${nomeDeArquivo}`);

                // Verifica se o arquivo não contém links e imprime uma mensagem personalizada, ou se contém links, e imprime a lista de links com validação (opcional).
                if (resultado.length === 0) {
                  console.log(chalk.red(`✘ Arquivo não contém links ✘`));
                } else {
                  imprimeLista(options.validate, resultado, nomeDeArquivo);
                }
              })
          })
        })

    // Verifica se o path é um arquivo que não tem a extensão .md, e se for, lança um erro personalizado.
    } else if (estado.isFile() && !path.endsWith('.md')) {
      throw new Error('✘ Extensão inválida ✘');
    
    // Se o path for válido e se referir a um arquivo .md, lê os links no arquivo e imprime a lista de links com validação (opcional) ou as estatísticas de links (opcional).
    } else {
      return lerArquivo(path).then(links => {
        if (options.stats && options.validate) {
          const stats = calculaStats(links);
          console.log(`Total: ${stats.total}\nUnique: ${stats.unique}\nBroken: ${stats.broken}`);
        } else if (options.stats) {
          const stats = calculaStats(links);
          console.log(`Total: ${stats.total}\nUnique: ${stats.unique}`);
        } else if (links.length === 0) {
          console.log(chalk.red(`✘ Arquivo não contém links ✘`));
        } else {
          imprimeLista(options.validate, links);
        }
      });
    }

  // Se o path for inválido, lança um erro personalizado.
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(chalk.red(`✘ O caminho "${path}" é inválido ✘`));
    }

    // Se ocorrer qualquer outro erro, imprime a mensagem de erro.
    console.error(chalk.red(`Erro: ${err.message}`));
  }
}



export {
  mdLinks
};
