export function calcularCustoViagem(
    custoCombustivel: number,
    consumoKm: number,
    pedagio: number,
    numPessoas: number,
    distancia: number,
    custoDezMilKm: number
  ) {
    const custoTotalCombustivel = (distancia / consumoKm) * custoCombustivel;
    const custoKmManutencao = (custoDezMilKm / 10000) * distancia;
    const custoTotal = custoTotalCombustivel + pedagio + custoKmManutencao;
    const custoTotalPorPessoa = custoTotal / numPessoas;
    const quantidadeLitrosUsado = custoTotalCombustivel / custoCombustivel;
  
    return {
      custoTotal,
      custoPorPessoa: custoTotalPorPessoa,
      custoCombustivelTotal: custoTotalCombustivel,
      custoManutencao: custoKmManutencao,
      litrosUsados: quantidadeLitrosUsado,
    };
  }
  