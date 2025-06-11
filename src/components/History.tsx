import "./History.css";
import { toPng } from "html-to-image";
import { useRef } from "react";

interface HistoryProps {
  history: any[];
  onDelete: (index: number) => void;
  onClear: () => void;
  onEdit: (entry: any) => void;
  onView: (entry: any) => void; // ✅ nova prop
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

const salvarComoImagem = async (element: HTMLElement, nomeArquivo: string) => {
  const dataUrl = await toPng(element);
  const link = document.createElement("a");
  link.download = `${nomeArquivo}.png`;
  link.href = dataUrl;
  link.click();
};

const compartilharImagem = async (element: HTMLElement, nomeArquivo: string) => {
  const dataUrl = await toPng(element);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], `${nomeArquivo}.png`, { type: "image/png" });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: nomeArquivo,
      text: `Confira o custo da viagem: ${nomeArquivo}`,
    });
  } else {
    alert("Este navegador não suporta compartilhamento direto de imagens.");
  }
};

function History({ history, onDelete, onClear, onEdit, onView }: HistoryProps) {
  return (
    <div className="history-container">
      {history.length === 0 ? (
        <p>Nenhum cálculo salvo ainda.</p>
      ) : (
        <>
          <button onClick={onClear} className="clear-button">
            Limpar Histórico
          </button>
          {history.map((entry, index) => {
            const ref = useRef<HTMLDivElement>(null);
            return (
              <div key={index} ref={ref} className="history-entry resumo">
                {/* ✅ Transformamos o nome em botão */}
                <h3
                  className="nome-viagem-link"
                  onClick={() => onView(entry)}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                    marginBottom: "0.5rem",
                  }}
                >
                  {entry.nomeViagem}
                </h3>

                <p><strong>Data:</strong> {formatarData(entry.data)}</p>
                <p><strong>Valor Total:</strong> R$ {entry.custoTotal.toFixed(2)}</p>
                <p><strong>Por Pessoa:</strong> R$ {entry.custoTotalPorPessoa.toFixed(2)}</p>

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
