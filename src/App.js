import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import KolDetail from "./components/KolDetail";
import KolPage from "./components/KolPage";
import ProductDetail from "./components/ProductDetail";
import ProductPage from "./components/ProductPage";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ShoppingCart from "./pages/ShoppingCart";
import Events from "./pages/Events";
import Profile from "./pages/Profile";

function App() {
  // if n only if homepage, the topmargin is 0
  const location = useLocation();
  const [footer, setFooter] = useState();
  useEffect(() => {
    if (location.pathname === '/') {
      document.body.style.marginTop = '0';
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setFooter(<></>);
    } else {
      document.body.style.marginTop = '67px'; // Reserved margin for fix-top Navbar
      setFooter(<Footer />);
    }
  }, [location]);

  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route exact path='/productStudy' element={<ProductPage />} />
        <Route exact path='/productFinance' element={<ProductPage />} />
        <Route exact path='/productTravel' element={<ProductPage />} />
        <Route exact path='/productLife' element={<ProductPage />} />
        <Route path='/product/:id' element={<ProductDetail />} />
        <Route path='/eventpage' element={<Events />} />
        <Route exact path='/product/:id' element={<ProductDetail />} />
        <Route exact path='/login' element={<Login />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/kolpage' element={<KolPage />} />
        <Route path='/kol/:id' element={<KolDetail />} />
        <Route path='/cart' element={<ShoppingCart />} />
      </Routes>
      {footer}
    </div>
  );
}

export default App;
