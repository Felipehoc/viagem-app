interface HistoryProps {
  history: any[];
  onDelete: (index: number) => void;
  onEdit: (entry: any) => void;
  onView: (entry: any) => void;
}

export default function History({ history, onDelete, onEdit, onView }: HistoryProps) {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Histórico de Viagens</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {history.map((entry, index) => (
          <li
            key={entry.data || index}
            style={{
              marginBottom: "15px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Nome da viagem sem clique */}
            <span style={{ fontWeight: "bold" }}>{entry.nomeViagem}</span>

            <div>
              <button
                onClick={() => onEdit(entry)}
                title="Editar"
                style={{
                  marginRight: "8px",
                  backgroundColor: "#4caf50",
                  border: "none",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ✏️
              </button>

              <button
                onClick={() => onDelete(index)}
                title="Excluir"
                style={{
                  marginRight: "8px",
                  backgroundColor: "#f44336",
                  border: "none",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                🗑️
              </button>

              <button
                onClick={() => onView(entry)}
                title="Ver Recibo"
                style={{
                  backgroundColor: "#2196f3",
                  border: "none",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                📄
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
