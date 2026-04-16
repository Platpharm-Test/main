import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import DashboardV2 from './pages/DashboardV2';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductSearchPage from './pages/ProductSearchPage';
import { CartProvider } from './lib/cart';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/1" element={<DashboardV2 />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/search" element={<ProductSearchPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
