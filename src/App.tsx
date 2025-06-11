import { useState, useEffect } from "react";
import CalculatorPage from "./pages/CalculatorPage";
import HistoryPage   from "./pages/HistoryPage";
import ReceiptPage   from "./pages/ReceiptPage";
import "./App.css";

type Page = "calculator" | "history"; // (o recibo é controlado por `selectedReceipt`)

export default function App() {
  const [history, setHistory]             = useState<any[]>([]);
  const [currentPage, setCurrentPage]     = useState<Page>("calculator");
  const [editingEntry, setEditingEntry]   = useState<any | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  /* ▸ Carrega histórico salvo */
  useEffect(() => {
    const saved = localStorage.getItem("travelHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  /* ▸ Salva sempre que o histórico muda */
  useEffect(() => {
    localStorage.setItem("travelHistory", JSON.stringify(history));
  }, [history]);

  /* ▸ Salvar (novo ou edição) */
  const handleSave = (entry: any) => {
    if (editingEntry) {
      setHistory(prev =>
        prev.map(item =>
          item.data === editingEntry.data ? { ...entry, data: editingEntry.data } : item
        )
      );
      setEditingEntry(null);
    } else {
      const newEntry = { ...entry, data: new Date().toISOString() };
      setHistory(prev => [...prev, newEntry]);
    }
    setCurrentPage("history");
  };

  /* ▸ Funções auxiliares */
  const handleDelete = (idx: number) =>
    setHistory(prev => prev.filter((_, i) => i !== idx));


  const handleEdit   = (entry: any) => {
    setEditingEntry(entry);
    setCurrentPage("calculator");
  };

  /* ▸ Renderização */
  return (
    <div>
      {/* Barra de navegação só aparece quando NÃO estamos na tela de recibo */}
      {!selectedReceipt && (
        <nav style={{ textAlign: "center", marginBottom: 20 }}>
          <button onClick={() => setCurrentPage("calculator")}>Calculadora</button>
          <button onClick={() => setCurrentPage("history")}>Histórico</button>
        </nav>
      )}

      {/* Tela de recibo (tem prioridade) */}
      {selectedReceipt ? (
        <ReceiptPage
          receiptData={selectedReceipt}
          onBack={() => setSelectedReceipt(null)}
        />
      ) : currentPage === "calculator" ? (
        <CalculatorPage onSave={handleSave} editingEntry={editingEntry} />
      ) : (
        <HistoryPage
          history={history}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={setSelectedReceipt}       
        />
      )}
    </div>
  );
}
