import chalk from 'chalk';
import {
  mdLinks,
  extrairLinksDoArquivo,
  tratarErro,
} from '../src/index.js';
import {
  imprimeLista
} from '../src/cli.js';
import listaValidada, {
  checaStatus,
  manejaErros,
  calculaStats
} from '../src/validate-stats.js';


describe('extrairLinksDoArquivo', () => {
  it('extrairLinksDoArquivo deve ser uma função', () => {
  expect(typeof extrairLinksDoArquivo).toBe('function');
  });
  
  it('deve extrair corretamente os links de um arquivo', async () => {
  const caminhoDoArquivo = 'test/arquivo1.md';
  const resultadoEsperado = [{
  text: 'link',
  href: 'https://exemplo.com',
  file: caminhoDoArquivo
  }, {
  text: 'link',
  href: 'https://outroexemplo.com',
  file: caminhoDoArquivo
  }];
  const resultado = await extrairLinksDoArquivo(caminhoDoArquivo);
  expect(resultado).toEqual(resultadoEsperado);
  });
  
  it('deve retornar um array vazio se não houver links no arquivo', async () => {
  const caminhoDoArquivo = 'test/arquivo2.md';
  const resultadoEsperado = [];
  const resultado = await extrairLinksDoArquivo(caminhoDoArquivo);
  expect(resultado).toEqual(resultadoEsperado);
  });
  });

  describe('tratarErro', () => {
    it('tratarErro deve ser uma função', () => {
    expect(typeof tratarErro).toBe('function');
    });

  it('deve lançar um erro com mensagem personalizada', () => {
    const erro = { code: 'ENOENT' };
    expect(() => tratarErro(erro)).toThrow('ENOENT não há arquivo no diretório');
  })
});

describe('mdLinks', () => {
  it('mdLinks deve ser uma função', () => {
    expect(typeof mdLinks).toBe('function');
  });

  test('mdLinks deve lançar um erro se o path for indefinido', () => {
    expect(() => mdLinks(undefined)).toThrowError(/Path indefinido ou nulo/);
  });


  test('mdLinks deve lançar um erro se o path for nulo', () => {
    expect(() => mdLinks(null)).toThrow(/Path indefinido ou nulo/);
  });

  test('mdLinks deve lançar um erro se o caminho for inválido', () => {
    expect(() => mdLinks('caminho/inválido')).toThrow(/O caminho ".+" é inválido/);
  });

  // test('mdLinks deve lançar um erro se o arquivo tiver uma extensão inválida', () => {
  //   expect(() => mdLinks('arquivos/paola.txt')).toThrow(/Extensão inválida/);
  // });

  // test('mdLinks deve retornar uma lista de links de um arquivo .md', () => {
  //   const path = 'arquivo.md';
  //   const options = {};
  //   const resultadoEsperado = [    { href: 'https://www.google.com', text: 'Google' },    { href: 'https://www.github.com', text: 'GitHub' },  ];

  //   return expect(mdLinks(path, options)).resolves.toEqual(resultadoEsperado);
  // });

  // test('mdLinks deve imprimir a lista de links de um arquivo .md', () => {
  //   const path = 'arquivo.md';
  //   const options = {};
  //   const consoleSpy = jest.spyOn(console, 'log');

  //   return mdLinks(path, options).then(() => {
  //     expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('https://www.google.com'));
  //     expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('https://www.github.com'));
  //   });
  // });

});


//CLI.JS 

describe('imprimeLista', () => {
  it('imprimeLista deve ser uma função', () => {
    expect(typeof imprimeLista).toBe('function');
  });


  it('deve imprimir lista de links válidos', async () => {
    const valida = true;
    const resultado = [{
      text: 'Link 1',
      href: 'http://www.link1.com',
      file: 'file1',
      status: 200
    }, {
      text: 'Link 2',
      href: 'http://www.link2.com',
      file: 'file2',
      status: 404
    }];
    const identificador = 'Identificador';

    console.log = jest.fn();

    await imprimeLista(valida, resultado, identificador);

    if (console.log.mock.calls.length > 0) {
      expect(console.log.mock.calls[0][0]).toContain(`Lista de links válidos:`);
      expect(console.log.mock.calls[0][0]).toContain(identificador);
      expect(console.log.mock.calls[1][0]).toContain(`file1 | http://www.link1.com | 200 | Link 1`);
      expect(console.log.mock.calls[2][0]).toContain(`file2 | http://www.link2.com | 404 | Link 2`);
    }
  });

  // test('deve imprimir lista de links inválidos', async () => {
  //   const valida = false;
  //   const resultado = [    { text: 'Link 1', href: 'http://www.link1.com', file: 'file1.md' },    { text: 'Link 2', href: 'http://www.link2.com', file: 'file2.md' },  ];
  //   const identificador = 'Identificador';

  //   console.log = jest.fn();

  //   await imprimeLista(valida, resultado, identificador);

  //   if (console.log.mock.calls.length > 0) {
  //     expect(console.log.mock.calls[0][0]).toContain('Lista de links inválidos:');
  //     expect(console.log.mock.calls[0][0]).toContain(identificador);
  //     expect(console.log.mock.calls[1][0]).toContain('file1.md | http://www.link1.com | Link 1');
  //     expect(console.log.mock.calls[2][0]).toContain('file2.md | http://www.link2.com | Link 2');
  //   }
  // });


  // test('deve imprimir lista de links inválidos', async () => {
  //   const valida = false;
  //   const resultado = [{ text: 'Link 1', href: 'http://www.link1.com', file: 'file1.md' }, { text: 'Link 2', href: 'http://www.link2.com', file: 'file2.md' },];
  //   const identificador = 'Identificador';

  //   await imprimeLista(valida, resultado, identificador);

  //   expect(console.log.mock.calls.length).toBe(resultado.length + 1);
  //   expect(console.log.mock.calls[0][0]).toContain(`Lista de links:`);
  //   expect(console.log.mock.calls[0][0]).toContain(identificador);
  //   expect(console.log.mock.calls[1][0]).toContain(`file1 | http://www.link1.com | Link 1`);
  //   expect(console.log.mock.calls[2][0]).toContain(`file2 | http://www.link2.com | Link 2`);
  // });

});


//VALIDATE-STATS 

describe('checaStatus', () => {
  it('checaStatus deve ser uma função', () => {
    expect(typeof checaStatus).toBe('function');
  });

  const urls = [    'https://jsonplaceholder.typicode.com/posts/1',    'https://jsonplaceholder.typicode.com/invalid',  ];

  it('deve retornar uma matriz de strings contendo "OK" para status de resposta 200 e "FAIL" para outros status', async () => {
    const resultados = await checaStatus(urls);
    expect(resultados).toEqual([
      '\u001b[32mOK | 200\u001b[39m',
      '\u001b[31mFAIL | 404\u001b[39m'
    ]);
  });
});

  describe('manejaErros', () => {
  it('manejaErros deve ser uma função', () => {
    expect(typeof manejaErros).toBe('function');
  });

  it('deve retornar "Ops, link não encontrado!" para um erro de conexão ENOTFOUND', () => {
    const erro = {
      cause: {
        code: 'ENOTFOUND'
      }
    };
    const resultado = manejaErros(erro);
    expect(resultado).toBe(chalk.red('Ops, link não encontrado!'));
  });

  it('deve retornar "Ocorreu algum erro" para outros tipos de erro', () => {
    const erro = new Error('Algum erro ocorreu');
    const resultado = manejaErros(erro);
    expect(resultado).toBe('Ocorreu algum erro');
  });
});


  describe('listaValidada', () => {
    it('listaValidada deve ser uma função', () => {
      expect(typeof listaValidada).toBe('function');
    });


  it('deve adicionar o status de cada link ao objeto correspondente na lista de links', async () => {
    const listaDeLinks = [{
        href: 'https://www.google.com'
      },
      {
        href: 'https://www.github.com'
      },
    ];

    const resultadoEsperado = [{
        href: 'https://www.google.com',
        status: '\x1B[32mOK | 200\x1B[39m'
      },
      {
        href: 'https://www.github.com',
        status: '\x1B[32mOK | 200\x1B[39m'
      },
    ];

    const resultado = await listaValidada(listaDeLinks);
    console.log(resultado);
    expect(resultado).toEqual(resultadoEsperado);
  });
});

describe('calculaStats', () => {
  it('calculaStats deve ser uma função', () => {
    expect(typeof calculaStats).toBe('function');
  });

  const links = [{
      href: 'https://www.google.com',
      status: 'OK 200'
    },
    {
      href: 'https://www.facebook.com',
      status: 'FAIL 404'
    },
    {
      href: 'https://www.twitter.com',
      status: 'OK 200'
    },
    {
      href: 'https://www.linkedin.com',
      status: 'FAIL 500'
    },
    {
      href: 'https://www.github.com',
      status: 'OK 200'
    },
    {
      href: 'https://www.instagram.com',
      status: 'FAIL 404'
    }
  ];

  it('deve retornar o objeto com as estatísticas corretas', () => {
    const stats = calculaStats(links);
    expect(stats.total).toBe(6);
    expect(stats.unique).toBe(6);
    expect(stats.broken).toBe(3);
  });
});
