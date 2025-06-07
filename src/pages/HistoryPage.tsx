import History from "../components/History";

interface HistoryPageProps {
  history: any[];
  onDelete: (index: number) => void;
  onClear: () => void;
  onEdit: (entry: any) => void;
}

function HistoryPage({ history, onDelete, onClear, onEdit }: HistoryPageProps) {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Histórico de Viagens</h1>
      <History history={history} onDelete={onDelete} onClear={onClear} onEdit={onEdit} />
    </div>
  );
}

export default HistoryPage;
