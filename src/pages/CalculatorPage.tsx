
import TravelCostForm from "../components/TravelCostForm";
import "./CalculatorPage.css";  // importe o css

interface CalculatorPageProps {
  onSave: (entry: any) => void;
  editingEntry?: any;
}

export default function CalculatorPage({ onSave, editingEntry }: CalculatorPageProps) {
  return (
    <div className="calculator-container">
      <h1>Calculadora de Viagem</h1>
      <TravelCostForm onSave={onSave} editingEntry={editingEntry} />
    </div>
  );
}