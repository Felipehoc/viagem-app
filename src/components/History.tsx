import "./History.css";

interface HistoryProps {
  history: any[];
  onDelete: (index: number) => void;
  onClear: () => void;
  onEdit: (entry: any) => void;
}

function formatarData(data: string): string {
  // Tenta detectar se é ISO (ex: 2025-06-07T20:41:45.149Z)
  if (data.includes('T') && data.includes('Z')) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const horas = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  } else {
    // Se já está formatada, retorna como está
    return data;
  }
}


function History({ history, onDelete, onClear, onEdit }: HistoryProps) {
  return (
    <div className="history-container">
      {history.length === 0 ? (
        <p>Nenhum cálculo salvo ainda.</p>
      ) : (
        <>
          <button onClick={onClear} className="clear-button">Limpar Histórico</button>
          {history.map((entry, index) => (
            <div key={index} className="history-entry">
              <h3>{entry.nomeViagem} ({formatarData(entry.data)})</h3>
              <p>Distância: {entry.distancia} km</p>
              <p>Combustível: R$ {entry.custoCombustivel.toFixed(2)} (R$ por litro)</p>
              <p>Consumo: {entry.consumoKm} km/l</p>
              <p>Pedágio: R$ {entry.pedagio.toFixed(2)}</p>
              <p>Pessoas: {entry.numPessoas}</p>
              <p>Manutenção (10 mil km): R$ {entry.custoDezMilKm}</p>
              <p>Custo Total: R$ {entry.custoTotal.toFixed(2)}</p>
              <p>Por Pessoa: R$ {entry.custoTotalPorPessoa.toFixed(2)}</p>
              <p>Litros Usados: {entry.quantidadeDeLitrosUsado.toFixed(2)} L</p>
              <p>Manutenção: R$ {entry.custoManutencao.toFixed(2)}</p>
              <button onClick={() => onEdit(entry)}>Editar</button>
              <button onClick={() => onDelete(index)}>Excluir</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default History;
