import { Route, Routes } from "react-router-dom";
import { ComparisonProvider } from "./context/ComparisonContext";
import { ProductDiscovery } from "./components/ProductDiscovery";

export default function App() {
  return (
    <ComparisonProvider>
      <Routes>
        <Route path="/" element={<ProductDiscovery />} />
      </Routes>
    </ComparisonProvider>
  );
}
