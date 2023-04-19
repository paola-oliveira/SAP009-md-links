

import lerArquivo from './index.js'; 
import fs from 'fs'; 
import chalk from 'chalk';
import listaValidada from './http-validacao.js';

const caminho = process.argv;

//tem o objetivo de imprimir a lista de links com identificador opcional.
function imprimeLista(valida, resultado, identificador = '') {

    if (valida ) {
        console.log(
            chalk.magenta('Lista Validada: '),
            chalk.black.bgMagenta(identificador),
            listaValidada(resultado));
    } else {
        console.log(
            chalk.magenta('Lista de links: '),
            chalk.black.bgMagenta(identificador),
           resultado);
    }
  }
  
  //tem o objetivo de processar um caminho de arquivo ou diretório e chamar a função lerArquivo para cada arquivo encontrado.
  function processaTexto(argumentos) {
    const caminho = argumentos[2];
    const valida = argumentos[3] === '--valida';

    try {
        fs.lstatSync(caminho); 
    } catch (erro) {
        if (erro.code === 'ENOENT') {
            console.log(chalk.bold.red('✘ Arquivo ou diretório não existe ✘'));
            return;
        }
    }
    if (fs.lstatSync(caminho).isFile()) {
      lerArquivo(argumentos[2])
        .then(resultado => {
          imprimeLista(valida, resultado);
        })
        .catch(err => {
          console.error(chalk.red('Erro ao processar arquivo:'), err);
        });
    } else if (fs.lstatSync(caminho).isDirectory()) {
      fs.promises.readdir(caminho)
        .then(arquivos => {
          arquivos.forEach(nomeDeArquivo => {
            lerArquivo(`${caminho}/${nomeDeArquivo}`)
              .then(lista => {
                console.log(`${caminho}/${nomeDeArquivo}`);
                imprimeLista(valida, lista, nomeDeArquivo);
              })
              .catch(err => {
                console.error(chalk.red(`Erro ao processar arquivo ${nomeDeArquivo}:`), err);
              });
          });
        })
        .catch(err => {
          console.error(chalk.red('Erro ao processar diretório:'), err);
        });
    }
  }
  processaTexto(caminho);