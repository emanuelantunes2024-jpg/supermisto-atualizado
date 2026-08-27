import ToolsBar from '../components/ToolsBar.jsx';
import CentralRendimiento from '../components/CentralRendimiento.jsx';

export default function IncomeCenter() {
  return (
    <div className="space-y-5">
      <ToolsBar />
      <CentralRendimiento layout="ancho" />
    </div>
  );
}
