import { useState } from 'react';
import { calcularCustoViagem } from '../utils/travelCostCalculator';
import "./TravelCostForm.css";


function TravelCostForm() {
  const [custoCombustivel, setCustoCombustivel] = useState(0);
  const [consumoKm, setConsumoKm] = useState(0);
  const [distancia, setDistancia] = useState(0);
  const [pedagio, setPedagio] = useState(0);
  const [numPessoas, setNumPessoas] = useState(1);
  const [custoDezMilKm, setCustoDezMilKm] = useState(0);

  const [resultado, setResultado] = useState<null | ReturnType<typeof calcularCustoViagem>>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = calcularCustoViagem(custoCombustivel, consumoKm, pedagio, numPessoas, distancia, custoDezMilKm);
    setResultado(res);
  }

  function handleReset() {
    setCustoCombustivel(0);
    setConsumoKm(0);
    setDistancia(0);
    setPedagio(0);
    setNumPessoas(1);
    setCustoDezMilKm(0);
    setResultado(null);
  }

  return (
    <div className="form-container">
      <h1>Calculadora de Custo de Viagem</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Preço por litro do combustível (R$):
          <input type="number" value={custoCombustivel} onChange={e => setCustoCombustivel(parseFloat(e.target.value))} required />
        </label>

        <label>
          Consumo de combustível (km/l):
          <input type="number" value={consumoKm} onChange={e => setConsumoKm(parseFloat(e.target.value))} required />
        </label>

        <label>
          Distância da viagem (km):
          <input type="number" value={distancia} onChange={e => setDistancia(parseFloat(e.target.value))} required />
        </label>

        <label>
          Valor do pedágio (R$):
          <input type="number" value={pedagio} onChange={e => setPedagio(parseFloat(e.target.value))} required />
        </label>

        <label>
          Número de pessoas na viagem:
          <input type="number" value={numPessoas} onChange={e => setNumPessoas(parseInt(e.target.value))} min={1} required />
        </label>

        <label>
          Custo de manutenção a cada 10 mil km (R$):
          <input type="number" value={custoDezMilKm} onChange={e => setCustoDezMilKm(parseFloat(e.target.value))} required />
        </label>

        <div className="button-group">
          <button type="submit">Calcular</button>
          <button type="button" onClick={handleReset}>Resetar</button>
        </div>
      </form>

      {resultado && (
        <div className="result">
          <h2>Resultado</h2>
          <p>Consumo: {consumoKm.toFixed(2)} km/l</p>
          <p>Preço do combustível: R$ {custoCombustivel.toFixed(2)}</p>
          <p>Distância: {distancia.toFixed(2)} km</p>
          <p>Valor do pedágio: R$ {pedagio.toFixed(2)}</p>
          <p>Custo de manutenção (10 mil km): R$ {custoDezMilKm.toFixed(2)}</p>

          <hr />
          <p>Custo de combustível: R$ {resultado.custoCombustivelTotal.toFixed(2)} (usando {resultado.litrosUsados.toFixed(2)} L)</p>
          <p>Custo de manutenção: R$ {resultado.custoManutencao.toFixed(2)}</p>
          <p>Pedágio: R$ {pedagio.toFixed(2)}</p>
          <h3>Custo total da viagem: R$ {resultado.custoTotal.toFixed(2)}</h3>
          <h3>Custo por pessoa: R$ {resultado.custoPorPessoa.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}

export default TravelCostForm;
