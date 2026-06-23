import HeaderBar from './HeaderBar';
import GigaDigitalHomepage from '../ecommerce/GigaDigitalHomepage';
import CartSidebar from '../../ecommerce/CartSidebar';
import { CartProvider } from '../../../context/CartContext';

export default function SolarFullPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white scroll-smooth">
        <HeaderBar />
        <GigaDigitalHomepage />
        <CartSidebar />
      </div>
    </CartProvider>
  );
}
