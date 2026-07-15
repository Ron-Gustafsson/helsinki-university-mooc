// Kaikki konsoliin tulostelu tähän omaan moduuliinsa
const info = (...params) => {
  // Testimoodissa ei tulosteta lokiviestejä -> näytetään ja poistin if ehdon
  //if (process.env.NODE_ENV !== 'test') {
  console.log(...params)
}

const error = (...params) => {
  // Eikä myöskään virhelokeja konsoliin
  //if (process.env.NODE_ENV !== 'test') {
  console.error(...params)
}

module.exports = { info, error }
