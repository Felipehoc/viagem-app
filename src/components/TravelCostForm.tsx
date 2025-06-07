import { useState, useEffect } from "react";
import { calcularCustoViagem, calcular } from "../utils/travelCostCalculator";
import "./TravelCostForm.css";

interface TravelCostFormProps {
  onSave: (entry: any) => void;
  editingEntry?: any; // deixa opcional, se quiser
}


function TravelCostForm({ onSave, editingEntry }: TravelCostFormProps) {
  const [custoCombustivel, setCustoCombustivel] = useState<number>(0);
  const [consumoKm, setConsumoKm] = useState<number>(0);
  const [distancia, setDistancia] = useState<number>(0);
  const [pedagio, setPedagio] = useState<number>(0);
  const [numPessoas, setNumPessoas] = useState<number>(1);
  const [custoDezMilKm, setCustoDezMilKm] = useState<number>(0);
  const [nomeViagem, setNomeViagem] = useState<string>("");

  const [result, setResult] = useState<any | null>(null);

  // Atualiza os estados quando editingEntry mudar
  useEffect(() => {
    if (editingEntry) {
      setCustoCombustivel(editingEntry.custoCombustivel || 0);
      setConsumoKm(editingEntry.consumoKm || 0);
      setDistancia(editingEntry.distancia || 0);
      setPedagio(editingEntry.pedagio || 0);
      setNumPessoas(editingEntry.numPessoas || 1);
      setCustoDezMilKm(editingEntry.custoDezMilKm || 0);
      setNomeViagem(editingEntry.nomeViagem || "");
      setResult(editingEntry); // opcional: já mostra o resultado se quiser
    } else {
      // Limpa o formulário caso não esteja editando
      setCustoCombustivel(0);
      setConsumoKm(0);
      setDistancia(0);
      setPedagio(0);
      setNumPessoas(1);
      setCustoDezMilKm(0);
      setNomeViagem("");
      setResult(null);
    }
  }, [editingEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [
      custoTotal,
      custoTotalPorPessoa,
      custoTotalCombustivel,
      custoManutencao,
    ] = calcularCustoViagem(
      custoCombustivel,
      consumoKm,
      pedagio,
      numPessoas,
      distancia,
      custoDezMilKm
    );
    const quantidadeDeLitrosUsado = calcular(
      custoTotalCombustivel,
      custoCombustivel
    );
    const dataAtual = new Date();

    // Pega dia, mês e ano
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // meses começam em 0
    const ano = dataAtual.getFullYear();

    // Pega hora e minuto
    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');

    const dataFormatada = `${dia}/${mes}/${ano} às ${horas}:${minutos}`;



    const entry = {
      nomeViagem,
      data: dataFormatada,
      distancia,
      custoCombustivel,
      consumoKm,
      pedagio,
      numPessoas,
      custoDezMilKm,
      custoTotal,
      custoTotalPorPessoa,
      custoTotalCombustivel,
      quantidadeDeLitrosUsado,
      custoManutencao,
    };

    setResult(entry);
  };

  const handleSave = () => {
    if (result) {
      onSave(result);
      alert("Cálculo salvo no histórico!");
    }
  };

  return (
    <form className="travel-form" onSubmit={handleSubmit}>
      <label>Nome da viagem:</label>
      <input
        type="text"
        value={nomeViagem}
        onChange={(e) => setNomeViagem(e.target.value)}
      />

      <label>Preço do combustível (R$ por litro):</label>
      <input
        type="number"
        value={custoCombustivel}
        onChange={(e) => setCustoCombustivel(Number(e.target.value))}
      />

      <label>Consumo (km/l):</label>
      <input
        type="number"
        value={consumoKm}
        onChange={(e) => setConsumoKm(Number(e.target.value))}
      />

      <label>Distância (km):</label>
      <input
        type="number"
        value={distancia}
        onChange={(e) => setDistancia(Number(e.target.value))}
      />

      <label>Pedágio (R$):</label>
      <input
        type="number"
        value={pedagio}
        onChange={(e) => setPedagio(Number(e.target.value))}
      />

      <label>Custo manutenção a cada 10 mil km (R$):</label>
      <input
        type="number"
        value={custoDezMilKm}
        onChange={(e) => setCustoDezMilKm(Number(e.target.value))}
      />
      
      <label>Número de pessoas:</label>
      <input
        type="number"
        value={numPessoas}
        onChange={(e) => setNumPessoas(Number(e.target.value))}
      />



      <button type="submit">Calcular</button>

{result && (
  <div className="result-box">
    <h3>Resultado:</h3>
    <p>Custo total da viagem: R$ {result.custoTotal.toFixed(2)}</p>
    <p>Custo por pessoa: R$ {result.custoTotalPorPessoa.toFixed(2)}</p>
    <p>Custo de combustível: R$ {result.custoTotalCombustivel.toFixed(2)}</p>
    <p>Quantidade de litros usados: {result.quantidadeDeLitrosUsado.toFixed(2)} L</p>
    <p>Custo de manutenção: R$ {result.custoManutencao.toFixed(2)}</p>
    <button type="button" onClick={handleSave}>
      Salvar no histórico
    </button>
  </div>
)}
    </form>
  );
}

export default TravelCostForm;
