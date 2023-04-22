import {
  mdLinks
} from './index.js';
import chalk from 'chalk';
import listaValidada from './validate-stats.js';

//tem o objetivo de imprimir a lista de links com identificador opcional.
function imprimeLista(valida, resultado, identificador = '') {
  if (valida) {
    listaValidada(resultado)
      .then((categoria) => {
        console.log(
          chalk.magenta('Lista Validada: '),
          chalk.black.bgBlue(identificador)
        );
        categoria.map(({
          text,
          href,
          file,
          status
        }) => console.log(
            chalk.blue(' ☁ ') + chalk.magenta(file) + ` | ${href} ` + chalk.green('|', status) + chalk.blackBright.bold(' |', text)

        ));
      })
    } else {
        console.log(
          chalk.magenta('Lista de links: '),
          chalk.black.bgBlue(identificador)
        );
        resultado.map(({ text, href, file }) => console.log(chalk.blue(' ☁ ') + chalk.magenta(file) + chalk.green(' |', href) + chalk.blackBright.bold(' |',text)));
      }
  }

const path = process.argv[2];
const validate = process.argv.includes('--validate');
const stats = process.argv.includes('--stats');


mdLinks(path, {
  validate,
  stats
})

export {
  imprimeLista
}
