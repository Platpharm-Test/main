import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import DashboardV2 from './pages/DashboardV2';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductSearchPage from './pages/ProductSearchPage';
import PartnersPage from './pages/PartnersPage';
import PartnerRequestsPage from './pages/PartnerRequestsPage';
import ApprovedSuppliersPage from './pages/ApprovedSuppliersPage';
import SupplierDetailPage from './pages/SupplierDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentsPage from './pages/PaymentsPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import UnpaidPage from './pages/UnpaidPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import LedgerPage from './pages/LedgerPage';
import LedgerPurchasesPage from './pages/LedgerPurchasesPage';
import ReturnsPage from './pages/ReturnsPage';
import { CartProvider } from './lib/cart';
import { OrdersProvider } from './lib/orders';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  return (
    <CartProvider>
      <OrdersProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/1" element={<DashboardV2 />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/search" element={<ProductSearchPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/partners/requests" element={<PartnerRequestsPage />} />
            <Route path="/partners/approved" element={<ApprovedSuppliersPage />} />
            <Route path="/partners/approved/:id" element={<SupplierDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/payments/history" element={<PaymentHistoryPage />} />
            <Route path="/payments/unpaid" element={<UnpaidPage />} />
            <Route path="/payments/methods" element={<PaymentMethodsPage />} />
            <Route path="/ledger" element={<LedgerPage />} />
            <Route path="/ledger/purchases" element={<LedgerPurchasesPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
          </Routes>
        </BrowserRouter>
      </OrdersProvider>
    </CartProvider>
  );
}
