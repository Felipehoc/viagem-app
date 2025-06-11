import { useState, useEffect, useRef } from "react";
import { calcularCustoViagem, calcular } from "../utils/travelCostCalculator";
import "./TravelCostForm.css";
import * as htmlToImage from 'html-to-image';
import html2canvas from "html2canvas";


interface TravelCostFormProps {
  onSave: (entry: any) => void;
  editingEntry?: any;
}

function TravelCostForm({ onSave, editingEntry }: TravelCostFormProps) {
  const [custoCombustivel, setCustoCombustivel] = useState<string>('');
  const [consumoKm, setConsumoKm] = useState<string>('');
  const [distancia, setDistancia] = useState<string>('');
  const [pedagio, setPedagio] = useState<string>('');
  const [numPessoas, setNumPessoas] = useState<string>('1');
  const [custoDezMilKm, setCustoDezMilKm] = useState<string>('');
  const [nomeViagem, setNomeViagem] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    if (editingEntry) {
      setCustoCombustivel(String(editingEntry.custoCombustivel || ''));
      setConsumoKm(String(editingEntry.consumoKm || ''));
      setDistancia(String(editingEntry.distancia || ''));
      setPedagio(String(editingEntry.pedagio || ''));
      setNumPessoas(String(editingEntry.numPessoas || '1'));
      setCustoDezMilKm(String(editingEntry.custoDezMilKm || ''));
      setNomeViagem(editingEntry.nomeViagem || '');
      setResult(editingEntry);
    } else {
      setCustoCombustivel('');
      setConsumoKm('');
      setDistancia('');
      setPedagio('');
      setNumPessoas('1');
      setCustoDezMilKm('');
      setNomeViagem('');
      setResult(null);
    }
  }, [editingEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const custoCombustivelNum = parseFloat(custoCombustivel) || 0;
    const consumoKmNum = parseFloat(consumoKm) || 0;
    const distanciaNum = parseFloat(distancia) || 0;
    const pedagioNum = parseFloat(pedagio) || 0;
    const numPessoasNum = parseInt(numPessoas) || 1;
    const custoDezMilKmNum = parseFloat(custoDezMilKm) || 0;

    const [
      custoTotal,
      custoTotalPorPessoa,
      custoTotalCombustivel,
      custoManutencao,
    ] = calcularCustoViagem(
      custoCombustivelNum,
      consumoKmNum,
      pedagioNum,
      numPessoasNum,
      distanciaNum,
      custoDezMilKmNum
    );

    const quantidadeDeLitrosUsado = calcular(
      custoTotalCombustivel,
      custoCombustivelNum
    );

    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    const dataFormatada = `${dia}/${mes}/${ano} às ${horas}:${minutos}`;

    const entry = {
      nomeViagem,
      data: dataFormatada,
      distancia: distanciaNum,
      custoCombustivel: custoCombustivelNum,
      consumoKm: consumoKmNum,
      pedagio: pedagioNum,
      numPessoas: numPessoasNum,
      custoDezMilKm: custoDezMilKmNum,
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

const handleShare = async () => {
  if (!resultRef.current) return;

  try {
    const canvas = await html2canvas(resultRef.current);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve)
    );

    if (!blob) return;

    const filesArray = [
      new File([blob], 'resultado-viagem.png', {
        type: 'image/png',
      }),
    ];

    if (navigator.canShare && navigator.canShare({ files: filesArray })) {
      await navigator.share({
        files: filesArray,
        title: 'Resultado da viagem',
        text: 'Confira o custo da minha viagem!',
      });
    } else {
      alert('Compartilhamento não suportado neste navegador.');
    }
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
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
        onChange={(e) => setCustoCombustivel(e.target.value)}
      />

      <label>Consumo (km/l):</label>
      <input
        type="number"
        value={consumoKm}
        onChange={(e) => setConsumoKm(e.target.value)}
      />

      <label>Distância (km):</label>
      <input
        type="number"
        value={distancia}
        onChange={(e) => setDistancia(e.target.value)}
      />

      <label>Pedágio (R$):</label>
      <input
        type="number"
        value={pedagio}
        onChange={(e) => setPedagio(e.target.value)}
      />

      <label>Custo manutenção a cada 10 mil km (R$):</label>
      <input
        type="number"
        value={custoDezMilKm}
        onChange={(e) => setCustoDezMilKm(e.target.value)}
      />

      <label>Número de pessoas:</label>
      <input
        type="number"
        value={numPessoas}
        onChange={(e) => setNumPessoas(e.target.value)}
      />

      <button type="submit">Calcular</button>

      {result && (
        <div className="result-box" ref={resultRef}>
        <h3>Resultado:</h3>
        <p><strong>Viagem:</strong> {result.nomeViagem}</p>
        <p>Custo total da viagem: R$ {result.custoTotal.toFixed(2)}</p>
        <p>Custo por pessoa: R$ {result.custoTotalPorPessoa.toFixed(2)}</p>
        <p>Custo de combustível: R$ {result.custoTotalCombustivel.toFixed(2)}</p>
        <p>Quantidade de litros usados: {result.quantidadeDeLitrosUsado.toFixed(2)} L</p>
        <p>Custo de manutenção: R$ {result.custoManutencao.toFixed(2)}</p>

        <button type="button" onClick={handleSave}>
          Salvar no histórico
        </button>

        <button type="button" onClick={handleShare}>
          Compartilhar resultado
        </button>
      </div>
    )}
    </form>
  );
}

export default TravelCostForm;
