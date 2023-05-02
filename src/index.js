
import fs from 'fs';
import chalk from 'chalk';
import {
  imprimeLista
} from './cli.js'
import listaValidada, {
  calculaStats,
} from './validate-stats.js';

//é chamada quando ocorre um erro na leitura do arquivo e lança uma exceção com uma mensagem personalizada.
function tratarErro(erro) {
  throw new Error(chalk.red(erro.code, 'não há arquivo no diretório'));
}

//lê um arquivo e extrai os links.
function extrairLinksDoArquivo(caminhoDoArquivo) {
  const codificacao = 'utf-8';
  return fs.promises.readFile(caminhoDoArquivo, codificacao)
    .then((texto) => {
      const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
      const capturas = [...texto.matchAll(regex)];
      const resultados = capturas.map(captura => ({
        text: captura[1],
        href: captura[2],
        file: caminhoDoArquivo
      }));
      return resultados;
    })
    .catch(erro => {
      tratarErro(erro);
    });
}


function mdLinks(path, options) {

  // Verifica se o path é indefinido ou nulo, e se for, lança um erro personalizado.
  if (!path) {
    throw new Error('Path indefinido ou nulo');
  }
  
  try {
    const estado = fs.lstatSync(path);
  
    // Verifica se o path é um diretório e não tem a extensão .md, e se for, lê todos os arquivos no diretório e imprime a lista de links para cada arquivo.
    if (estado.isDirectory()) {
      fs.promises.readdir(path)
        .then(arquivos => {
          arquivos.forEach(nomeDeArquivo => {
            extrairLinksDoArquivo(`${path}/${nomeDeArquivo}`)
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
      throw new Error('Extensão inválida');
      
    // Se o path for válido e se referir a um arquivo .md, lê os links no arquivo e imprime a lista de links com validação (opcional) ou as estatísticas de links (opcional).
    } else {
      return extrairLinksDoArquivo(path).then(links => {
        if (options.stats && options.validate) {
          listaValidada(links).then(result => {
            const stats = calculaStats(result);
            console.log(chalk.blue(`Total: ${stats.total}`) + '\n' + chalk.blue(`Unique: ${stats.unique}`) + '\n' + chalk.magenta(`Broken: ${stats.broken}`));
          })
        } else if (options.stats) {
          listaValidada(links).then(result => {
            const stats = calculaStats(result);
            console.log(chalk.blue(`Total: ${stats.total}`) + '\n' + chalk.blue(`Unique: ${stats.unique}`));
          })
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
      throw new Error(`O caminho "${path}" é inválido`);
    }
  
    // Se ocorrer qualquer outro erro, imprime a mensagem de erro.
    console.error(chalk.red(`Erro: ${err instanceof Error ? err.message : err}`));
  }
}

export {
  mdLinks,
  extrairLinksDoArquivo,
  tratarErro,
};
