import { useState, useEffect } from "react";
import CalculatorPage from "./pages/CalculatorPage";
import HistoryPage from "./pages/HistoryPage";
import "./App.css";

function App() {
  const [history, setHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<"calculator" | "history">("calculator");
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem("travelHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Salvar no localStorage sempre que mudar o history
  useEffect(() => {
    localStorage.setItem("travelHistory", JSON.stringify(history));
  }, [history]);

const handleSave = (entry: any) => {
  if (editingEntry) {
    // Se estiver editando, atualiza a entrada correspondente
    setHistory((prevHistory) =>
      prevHistory.map((item) =>
        item.data === editingEntry.data ? { ...entry, data: editingEntry.data } : item
      )
    );
    setEditingEntry(null);
  } else {
    // Nova entrada com data gerada
    const newEntry = {
      ...entry,
      data: new Date().toISOString(), // Adiciona um campo "data" único
    };
    setHistory((prevHistory) => [...prevHistory, newEntry]);
  }
  setCurrentPage("history"); // vai para histórico ao salvar
};

  const handleDelete = (index: number) => {
    setHistory((prevHistory) => prevHistory.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
      setHistory([]);
    }
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setCurrentPage("calculator");
  };

  return (
    <div>
      <nav style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setCurrentPage("calculator")}>Calculadora</button>
        <button onClick={() => setCurrentPage("history")}>Histórico</button>
      </nav>

      {currentPage === "calculator" ? (
        <CalculatorPage onSave={handleSave} editingEntry={editingEntry} />
      ) : (
        <HistoryPage
          history={history}
          onDelete={handleDelete}
          onClear={handleClear}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default App;
