import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
// import { useMediaQuery } from "react-responsive";
import { Route, Routes, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import KolDetail from "./components/KolDetail";
import ProductDetail from "./components/ProductDetail";
import EventDetail from "./components/EventDetail";
import ProductPage from "./pages/ProductPage";
import Recruitment from "./pages/Recruitment";
import KolPage from "./pages/KolPage";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ShoppingCart from "./pages/ShoppingCart";
import RegisterMiss from "./pages/RegisterMiss";
import BrandPage from "./pages/BrandPage";
import Greeness from "./pages/Greeness";
import MIVoting from "./pages/MI_VotingPage";

function App() {

  // Reserved for different needs of costomisation across pages
  const location = useLocation();
  const [header, setHeader] = useState(<Header />);
  const [footer, setFooter] = useState(<Footer />);

  useEffect(() => {
    if (location.pathname === '/') {
      document.body.style.marginTop = "0px";
      setHeader(<Header />);
      setFooter(<Footer />);
    }
    if (location.pathname === "/miss-register"        // Independent Pages without Header/Footer
      || location.pathname === "/sponsor/greeness" 
      || location.pathname === "/missinternational/vote") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      document.body.style.marginTop = "0px";
      setFooter(<></>);
      setHeader(<></>);
    } else {
      document.body.style.marginTop = "54px";
      setHeader(<Header />);
      setFooter(<Footer />);
    }
  }, [location]);
  

  // Check if is on desktop
  // const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  return (
    <div className='App'>
      {header}
      <div className="main-content">
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route exact path='/productpage' element={<ProductPage />} />
          {/* <Route exact path='/productFinance' element={<ProductPage />} />
          <Route exact path='/productTravel' element={<ProductPage />} />
          <Route exact path='/productLife' element={<ProductPage />} /> */}
          <Route path='/product/:name' element={<ProductDetail />} />
          <Route path='/eventpage' element={<Events />} />
          <Route exact path='/product/:name' element={<ProductDetail />} />
          <Route exact path='/event/:name' element={<EventDetail />} />
          <Route path='/join-us' element={<Recruitment />} />
          <Route path='/kolpage' element={<KolPage />} />
          <Route path='/kol/:id' element={<KolDetail />} />
          <Route path='/cart' element={<ShoppingCart />} />
          <Route path='/cart' element={<ShoppingCart />} />
          <Route path='/miss-register' element={<RegisterMiss />} />
          <Route path='/brands' element={<BrandPage />} />
          <Route path='/missinternational/vote' element={<MIVoting />} />
          <Route path='/sponsor/greeness' element={<Greeness />} />
        </Routes>
      </div>
      {footer}
    </div>
  );
}

export default App;
