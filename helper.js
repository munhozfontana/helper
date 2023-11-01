function noBreakSpace(body, ignoreAttributes) {
  try {
    const jsonObject = JSON.parse(body);
    function processObject(obj, olderKey) {

      for (const key in obj) {
        if (ignoreAttributes.includes(currentPath(olderKey, key).join('.').replace(/\.\d/g, ''))) {
          continue;
        }
        if (typeof obj[key] === 'string') {
          replcaeRule(obj, key);
        } else if (Array.isArray(obj[key])) {
          whenIsArray(obj, key, processObject, olderKey);
        } else {
          processObject(obj[key], [...(olderKey ?? []), key]);
        }
      }

    }

    processObject(jsonObject);

    return JSON.stringify(jsonObject);
  } catch (error) {
    console.error('Erro ao processar o JSON:', error);
    return body;
  }
}



function currentPath(olderKey, key) {
  return [...(olderKey ?? []), key];
}

function replcaeRule(obj, key) {
  obj[key] = obj[key].replaceAll('@', ' ');
}

function whenIsArray(obj, key, processObject, olderKey) {
  obj[key].forEach((element, index) => {
    if (typeof element == 'object') {
      processObject(obj[key], [...(olderKey ?? []), key]);
    } else {
      obj[key][index] = element.replaceAll('@', ' ');
    }
  });
}




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


const ignoreAttributes = ['nome', 'emails', 'endereco.rua', 'amigos.nome',];
// const ignoreAttributes = [];

const resultado = noBreakSpace(body, ignoreAttributes);

console.log(resultado);

