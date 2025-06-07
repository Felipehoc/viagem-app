

export function calcularCustoViagem(
  custoCombustivel: number,
  consumoKm: number,
  pedagio: number,
  numPessoas: number,
  distancia: number,
  custoDezMilKm: number
): [number, number, number, number] {
  const custoTotalCombustivel = (distancia / consumoKm) * custoCombustivel;
  const custoKmManutencao = (custoDezMilKm / 10000) * distancia;
  const custoTotal = custoTotalCombustivel + pedagio + custoKmManutencao;
  const custoTotalPorPessoa = custoTotal / numPessoas;

  return [
    custoTotal,
    custoTotalPorPessoa,
    custoTotalCombustivel,
    custoKmManutencao,
  ];
}

export function calcular(
  quantidadeCombustivel: number,
  custoCombustivel: number
): number {
  const quantidadeDeLitrosUsado = quantidadeCombustivel / custoCombustivel;
  return quantidadeDeLitrosUsado;
}
