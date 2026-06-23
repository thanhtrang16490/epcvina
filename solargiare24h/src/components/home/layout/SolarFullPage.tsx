import HeaderBar from './HeaderBar';
import CatalogHomepage from '../ecommerce/CatalogHomepage';
import CartSidebar from '../../ecommerce/CartSidebar';
import { CartProvider } from '../../../context/CartContext';

export default function SolarFullPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white scroll-smooth">
        <HeaderBar />
        <CatalogHomepage />
        <CartSidebar />
      </div>
    </CartProvider>
  );
}
