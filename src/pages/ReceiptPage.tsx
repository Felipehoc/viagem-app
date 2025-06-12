import "./ReceiptPage.css"; // (opcional) crie esse CSS para customizar melhor
import { useRef } from "react";
import { toPng } from "html-to-image";

interface ReceiptPageProps {
  receiptData: any;
  onBack: () => void;
}

function formatarData(data: string): string {
  if (data.includes("T") && data.includes("Z")) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, "0");
    const minutos = String(dataObj.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  } else {
    return data;
  }
}

export default function ReceiptPage({ receiptData, onBack }: ReceiptPageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const salvarComoImagem = async () => {
  if (ref.current) {
    const dataUrl = await toPng(ref.current, {
      canvasWidth: ref.current.scrollWidth,
      canvasHeight: ref.current.scrollHeight,
      style: {
        paddingTop: '20px',
        paddingBottom: '20px',
        backgroundColor: 'white', // fundo branco evita cortes invisíveis
      },
      cacheBust: true,
    });
    const link = document.createElement("a");
    link.download = `${receiptData.nomeViagem}.png`;
    link.href = dataUrl;
    link.click();
  }
};

  const compartilharImagem = async () => {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current);
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `${receiptData.nomeViagem}.png`, { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: receiptData.nomeViagem,
        text: `Confira o custo da viagem: ${receiptData.nomeViagem}`,
      });
    } else {
      alert("Este navegador não suporta compartilhamento de imagem.");
    }
  };

  return (
    <>
      {/* Botão fora do container, fixado no topo esquerdo */}
      <button className="btn-voltar" onClick={onBack}>← Voltar</button>

      <div className="receipt-container">
       

        <div ref={ref} className="nota-fiscal">
          <h2>🚗 RECIBO DA VIAGEM</h2>
          <p><strong>Nome:</strong> {receiptData.nomeViagem}</p>
          <p><strong>Data:</strong> {formatarData(receiptData.data)}</p>
          <hr />
          <p><strong>Distância:</strong> {receiptData.distancia} km</p>
          <p><strong>Combustível (R$/L):</strong> R$ {receiptData.custoCombustivel.toFixed(2)}</p>
          <p><strong>Consumo:</strong> {receiptData.consumoKm} km/l</p>
          <p><strong>Pedágio:</strong> R$ {receiptData.pedagio.toFixed(2)}</p>
          <p><strong>Manutenção (10 mil km):</strong> R$ {receiptData.custoDezMilKm}</p>
          <p><strong>Pessoas:</strong> {receiptData.numPessoas}</p>
          <hr />
          <p><strong>Litros Usados:</strong> {receiptData.quantidadeDeLitrosUsado.toFixed(2)} L</p>
          <p><strong>Custo de combustível:</strong> R$ {receiptData.custoTotalCombustivel.toFixed(2)}</p>
          <p><strong>Manutenção proporcional:</strong> R$ {receiptData.custoManutencao.toFixed(2)}</p>
          <hr />
          <p><strong>Total:</strong> <b>R$ {receiptData.custoTotal.toFixed(2)}</b></p>
          <p><strong>Por Pessoa:</strong> <b>R$ {receiptData.custoTotalPorPessoa.toFixed(2)}</b></p>
        </div>

        <div className="buttons">
          <button onClick={salvarComoImagem}>Salvar imagem</button>
          <button onClick={compartilharImagem}>Compartilhar</button>
        </div>
      </div>
    </>
  );
}
