import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import DashboardV2 from './pages/DashboardV2';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductSearchPage from './pages/ProductSearchPage';
import PartnersPage from './pages/PartnersPage';
import PartnerRequestsPage from './pages/PartnerRequestsPage';
import PartnerRequestDetailPage from './pages/PartnerRequestDetailPage';
import ApprovedSuppliersPage from './pages/ApprovedSuppliersPage';
import ApprovedSupplierDetailPage from './pages/ApprovedSupplierDetailPage';
import SupplierDetailPage from './pages/SupplierDetailPage';
import SupplierApplicationPage from './pages/SupplierApplicationPage';
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
import LedgerProductDetailPage from './pages/LedgerProductDetailPage';
import ReturnsPage from './pages/ReturnsPage';
import ReturnRequestPage from './pages/ReturnRequestPage';
import ReturnDetailPage from './pages/ReturnDetailPage';
import { CartProvider } from './lib/cart';
import { OrdersProvider } from './lib/orders';
import { PartnersProvider } from './lib/partnersContext';
import { PostcodeProvider } from './lib/postcodeContext';
import { AddressProvider } from './lib/addressContext';
import { ReturnsProvider } from './lib/returnsContext';
import { ScrollToTop } from './components/ScrollToTop';
import PostcodeSearchPage from './pages/PostcodeSearchPage';
import AddressEditPage from './pages/AddressEditPage';
import AddressFormPage from './pages/AddressFormPage';

export default function App() {
  return (
    <CartProvider>
      <OrdersProvider>
        <PartnersProvider>
        <AddressProvider>
        <PostcodeProvider>
        <ReturnsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<DashboardV2 />} />
            <Route path="/1" element={<Navigate to="/" replace />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/search" element={<ProductSearchPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/partners/requests" element={<PartnerRequestsPage />} />
            <Route path="/partners/requests/:id" element={<PartnerRequestDetailPage />} />
            <Route path="/partners/approved" element={<ApprovedSuppliersPage />} />
            <Route path="/partners/approved/:id" element={<ApprovedSupplierDetailPage />} />
            <Route path="/partners/:id/apply" element={<SupplierApplicationPage />} />
            <Route path="/partners/:id" element={<SupplierDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/address/edit" element={<AddressEditPage />} />
            <Route path="/address/form/:id" element={<AddressFormPage />} />
            <Route path="/postcode" element={<PostcodeSearchPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/payments/history" element={<PaymentHistoryPage />} />
            <Route path="/payments/unpaid" element={<UnpaidPage />} />
            <Route path="/payments/methods" element={<PaymentMethodsPage />} />
            <Route path="/ledger" element={<LedgerPage />} />
            <Route path="/ledger/purchases" element={<LedgerPurchasesPage />} />
            <Route path="/ledger/purchases/:productId" element={<LedgerProductDetailPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/returns/new" element={<ReturnRequestPage />} />
            <Route path="/returns/:id" element={<ReturnDetailPage />} />
          </Routes>
        </BrowserRouter>
        </ReturnsProvider>
        </PostcodeProvider>
        </AddressProvider>
        </PartnersProvider>
      </OrdersProvider>
    </CartProvider>
  );
}
