import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import KolPage from "./components/KolPage";
import ProductDetail from "./components/ProductDetail";
import Products from "./components/Products";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ShoppingCart from "./pages/ShoppingCart";
import Events from "./pages/Events";

function App() {
  // if n only if homepage, the topmargin is 0
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/') {
      document.body.style.marginTop = '0';
    } else {
      document.body.style.marginTop = '67px'; // Reserved margin for fix-top Navbar
    }
  }, [location]);

  return (
      <div className='App'>
        <Header />
        <Routes>
          <Route exact path='/' element={<Home />} />
            <Route exact path='/products' element={<Products />} />
            <Route path='/eventpage' element={<Events />} />
            <Route exact path='/product/:id' element={<ProductDetail />} />
            <Route exact path='/login' element={<Login />} />
            <Route path='/kolpage' element={<KolPage />} />
            <Route path='/cart' element={<ShoppingCart />} />
          </Routes>
        <Footer />
      </div>
  );
}

export default App;
