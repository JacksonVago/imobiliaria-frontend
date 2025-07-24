export function transformNullToUndefined(obj: { [key: string]: any | null | undefined }): {
  [key: string]: any | undefined
} {
  // Verifica se o input é um objeto.  Evita erros com tipos incorretos.
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj // Retorna o valor original se não for um objeto.
  }

  const novoObj: { [key: string]: any | undefined } = {}

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const valor = obj[key]
      if (valor === null) {
        novoObj[key] = undefined
      } else {
        novoObj[key] = valor
      }
    }
  }
  return novoObj
}
