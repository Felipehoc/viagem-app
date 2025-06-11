import "./History.css";
import { toPng } from 'html-to-image';
import { useRef } from 'react';

interface HistoryProps {
  history: any[];
  onDelete: (index: number) => void;
  onClear: () => void;
  onEdit: (entry: any) => void;
}

function formatarData(data: string): string {
  if (data.includes('T') && data.includes('Z')) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  } else {
    return data;
  }
}

// Funções auxiliares
const salvarComoImagem = async (element: HTMLElement, nomeArquivo: string) => {
  const dataUrl = await toPng(element);
  const link = document.createElement('a');
  link.download = `${nomeArquivo}.png`;
  link.href = dataUrl;
  link.click();
};

const compartilharImagem = async (element: HTMLElement, nomeArquivo: string) => {
  const dataUrl = await toPng(element);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], `${nomeArquivo}.png`, { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: nomeArquivo,
      text: `Confira o custo da viagem: ${nomeArquivo}`,
    });
  } else {
    alert('Este navegador não suporta compartilhamento direto de imagens.');
  }
};

function History({ history, onDelete, onClear, onEdit }: HistoryProps) {
  return (
    <div className="history-container">
      {history.length === 0 ? (
        <p>Nenhum cálculo salvo ainda.</p>
      ) : (
        <>
          <button onClick={onClear} className="clear-button">Limpar Histórico</button>
          {history.map((entry, index) => {
            const ref = useRef<HTMLDivElement>(null);
            return (
              <div key={index} ref={ref} className="history-entry nota-fiscal">
                <h2 className="nf-title">🚗 RECIBO DA VIAGEM</h2>
                  <p><strong>Nome da Viagem:</strong> {entry.nomeViagem}</p>
                  <p><strong>Data:</strong> {formatarData(entry.data)}</p>
                  <hr />
                  <p><strong>Distância:</strong> {entry.distancia} km</p>
                  <p><strong>Combustível (R$/L):</strong> R$ {entry.custoCombustivel.toFixed(2)}</p>
                  <p><strong>Consumo:</strong> {entry.consumoKm} km/l</p>
                  <p><strong>Pedágio:</strong> R$ {entry.pedagio.toFixed(2)}</p>
                  <p><strong>Manutenção (10 mil km):</strong> R$ {entry.custoDezMilKm}</p>
                  <p><strong>Pessoas:</strong> {entry.numPessoas}</p>
                  <hr />
                  <p><strong>Litros Usados:</strong> {entry.quantidadeDeLitrosUsado.toFixed(2)} L</p>
                  <p><strong>Manutenção proporcional:</strong> R$ {entry.custoManutencao.toFixed(2)}</p>
                  
                  <hr />
                  <p><strong>Total:</strong> <b>R$ {entry.custoTotal.toFixed(2)}</b></p>
                  <p><strong>Por Pessoa:</strong> <b>R$ {entry.custoTotalPorPessoa.toFixed(2)}</b></p>

                  <div className="buttons">
                    <button onClick={() => onEdit(entry)}>Editar</button>
                    <button onClick={() => onDelete(index)}>Excluir</button>
                    <button onClick={() => ref.current && compartilharImagem(ref.current, entry.nomeViagem)}>Compartilhar</button>
                    <button onClick={() => ref.current && salvarComoImagem(ref.current, entry.nomeViagem)}>Salvar imagem</button>
                  </div>
                </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default History;
