function noBreakSpace(body: string, ignoreAttributes: string[]): string {
  try {
    const jsonObject = JSON.parse(body);

    function processObject(obj: any, path: (string | number)[] = []): any {
      if (typeof obj === 'string') {
        obj = obj.replaceAll('@', ' ');
      } else if (Array.isArray(obj)) {
        obj.forEach((element, index) => {
          if (typeof element === 'object') {
            processObject(element, [...path, index]);
          } else {
            obj[index] = element.replaceAll('@', ' ');
          }
        });
      } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          const currentPath = [...path, key];
          const currentPathString = currentPath.join('.');
          if (ignoreAttributes.includes(currentPathString.replace(/\.\d/g, ''))) {
            continue;
          }
          obj[key] = processObject(obj[key], currentPath);
        }
      }
      return obj;
    }

    const processedObject = processObject(jsonObject);
    return JSON.stringify(processedObject, null, 2);
  } catch (error) {
    console.error('Erro ao processar o JSON:', error);
    return body;
  }
}

const body: string = `{
  "nome": "@",
  "idade": 30,
  "endereco": {
    "rua": "@@",
    "cidade": "@@",
    "estado": "@@"
  },
  "emails": [
    "@@@",
    "@@@"
  ],
  "telefones": {
    "casa": "@@@",
    "trabalho": "@@@",
    "celular": "@@@",
    "others": {
      "email": "@@@@"
    }
  },
  "amigos": [
    {
      "nome": "@@@@",
      "bbb": "@@@@",
      "idade": 28
    },
    {
      "nome": "@@@@",
      "bbb": "@@@@",
      "idade": 32
    }
  ]
}`;

const ignoreAttributes: string[] = ['nome', 'emails', 'endereco.rua', 'amigos.nome'];
// const ignoreAttributes: string[] = [];

const resultado: string = noBreakSpace(body, ignoreAttributes);

console.log(resultado);

const body = `{
  "nome": "@",
  "idade": 30,
  "endereco": {
    "rua": "@@",
    "cidade": "@@",
    "estado": "@@"
  },
  "emails": [
    "@@@",
    "@@@"
  ],
  "telefones": {
    "casa": "@@@",
    "trabalho": "@@@",
    "celular": "@@@",
    "others": {
      "email": "@@@@"
    }
  },
  "amigos": [
    {
      "nome": "@@@@",
      "bbb": "@@@@",
      "idade": 28
    },
    {
      "nome": "@@@@",
      "bbb": "@@@@",
      "idade": 32
    }
  ]
}`;

// const ignoreAttributes = ['nome', 'emails', 'endereco.rua', 'amigos.nome'];


console.log(noBreakSpace(body, []));
console.log(noBreakSpace(body, ['nome', 'emails', 'endereco.rua', 'amigos.nome']));
