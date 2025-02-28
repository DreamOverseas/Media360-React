import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
// import { useMediaQuery } from "react-responsive";
import { Route, Routes, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./App.css";
import BrandDetail from "./components/BrandDetail";
import EventDetail from "./components/EventDetail";
import Footer from "./components/Footer";
import Header from "./components/Header";
import KolDetail from "./components/KolDetail";
import NewsDetail from "./components/NewsDetail";
import ProductDetail from "./components/ProductDetail";
import BrandPage from "./pages/BrandPage";
import Events from "./pages/Events";
import Greeness from "./pages/Greeness";
import Home from "./pages/Home";
import KolPage from "./pages/KolPage";
import MIVoting from "./pages/MI_VotingPage";
import ProductPage from "./pages/ProductPage";
import Profile from "./pages/Profile";
import Recruitment from "./pages/Recruitment";
import RegisterMiss from "./pages/RegisterMiss";
import ShoppingCart from "./pages/ShoppingCart";
import InfluenceHub from "./pages/InfluenceHub";
import MediaCenter from "./pages/MediaCenter";
import NewsPage from "./pages/NewsPage";
import FounderPage from "./pages/FounderPage";
import AmbassadorPage from "./pages/AmbassadorPage";
import ScrollToTop from "./components/ScrollToTop";
import RelatedProductPage from "./pages/RelatedProductPage";
import Breadcrumbs from "./components/Breadcrumbs";

function App() {
  // Reserved for different needs of costomisation across pages
  const location = useLocation();
  const [header, setHeader] = useState(<Header />);
  const [footer, setFooter] = useState(<Footer />);

  useEffect(() => {
    if (location.pathname === "/") {
      document.body.style.marginTop = "0px";
      setHeader(<Header />);
      setFooter(<Footer />);
    }
    if (
      location.pathname === "/miss-register" || // Independent Pages without Header/Footer
      location.pathname === "/sponsor/greeness" ||
      location.pathname === "/missinternational/vote"
    ) {
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
      <ScrollToTop />
      {header}
      <div className='main-content'>
        <Breadcrumbs />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route exact path='/products' element={<ProductPage />} />
          {/* <Route exact path='/productFinance' element={<ProductPage />} />
          <Route exact path='/productTravel' element={<ProductPage />} />
          <Route exact path='/productLife' element={<ProductPage />} /> */}
          <Route path='/products/:name' element={<ProductDetail />} />
          <Route path='/products/:name/related-product' element={<RelatedProductPage />} />
          <Route exact path='/products/:name' element={<ProductDetail />} />
          <Route exact path='/events/:name' element={<EventDetail />} />
          <Route path='/join-us' element={<Recruitment />} />
          <Route path='/influence-hub' element={<InfluenceHub />} />
          <Route path='/media-center' element={<MediaCenter />} />
          <Route path='/news' element={<NewsPage />} />
          <Route path='/events' element={<Events />} />
          <Route path='/founders' element={<FounderPage />} />
          <Route path='/kols' element={<KolPage />} />
          <Route path='/ambassadors' element={<AmbassadorPage />} />
          <Route path="/person/:id" element={<KolDetail />} />
          <Route path='/cart' element={<ShoppingCart />} />
          <Route path='/miss-register' element={<RegisterMiss />} />
          <Route path='/brands' element={<BrandPage />} />
          <Route path='/missinternational/vote' element={<MIVoting />} />
          <Route path='/sponsor/greeness' element={<Greeness />} />
          <Route path='/brands/:id' element={<BrandDetail />} />
          <Route path='/news/:id' element={<NewsDetail />} />
        </Routes>
      </div>
      {footer}
    </div>
  );
}

export default App;
