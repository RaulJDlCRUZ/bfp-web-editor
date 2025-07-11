// Diccionario que define el orden de los nodos en el cliente
export const nodeOrder: { [nodetype: string]: number } = {
  dedication: 10,
  authorship: 20,
  resumen: 30,
  abstract: 40,
  acknowledgements: 50,
  acronyms: 60,
  chapters: 100,
  appendices: 200,
  bibliography: 1000,
  resources: 2000,
};