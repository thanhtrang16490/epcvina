import HeaderBar from './HeaderBar';
import EcommerceHomepage from '../ecommerce/EcommerceHomepage';

export default function SolarFullPage() {
  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <HeaderBar />
      <EcommerceHomepage />
    </div>
  );
}
