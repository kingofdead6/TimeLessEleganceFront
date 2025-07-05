import { useEffect } from 'react';
import HeroPage from '../../components/Home/HeroPage';
import Offers from '../../components/Home/Offers';
import ProductsPage from '../../components/Home/ProductsPage';


const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);
  return (
    <div className="w-full min-h-screen overflow-x-hidden "  style={{  }}>
      <HeroPage />
      <Offers />
      <ProductsPage />
      
    </div>
  );
};

export default Home;