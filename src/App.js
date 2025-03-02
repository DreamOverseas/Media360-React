import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
// import { useMediaQuery } from "react-responsive";
import { Route, Routes, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./App.css";
import BrandDetail from "./components/BrandDetail";
import Breadcrumbs from "./components/Breadcrumbs";
import EventDetail from "./components/EventDetail";
import FloatingHomeButton from "./components/FloatingHomeButton";
import Footer from "./components/Footer";
import Header from "./components/Header";
import KolDetail from "./components/KolDetail";
import NewsDetail from "./components/NewsDetail";
import ProductDetail from "./components/ProductDetail";
import ScrollToTop from "./components/ScrollToTop";
import AmbassadorPage from "./pages/AmbassadorPage";
import BrandPage from "./pages/BrandPage";
import BrandRelatedNewsPage from "./pages/BrandRelatedNewsPage";
import BrandRelatedPersonsPage from "./pages/BrandRelatedPersonsPage";
import BrandRelatedProductsPage from "./pages/BrandRelatedProductsPage";
import Events from "./pages/Events";
import FounderPage from "./pages/FounderPage";
import Greeness from "./pages/Greeness";
import Home from "./pages/Home";
import InfluenceHub from "./pages/InfluenceHub";
import KolPage from "./pages/KolPage";
import MediaCenter from "./pages/MediaCenter";
import MIVoting from "./pages/MI_VotingPage";
import NewsPage from "./pages/NewsPage";
import PersonRelatedBrands from "./pages/PersonRelatedBrands";
import PersonRelatedNews from "./pages/PersonRelatedNews";
import PersonRelatedProducts from "./pages/PersonRelatedProducts";
import ProductPage from "./pages/ProductPage";
import ProductRelatedNews from "./pages/ProductRelatedNews";
import ProductRelatedPerson from "./pages/ProductRelatedPerson";
import ProductRelatedProduct from "./pages/ProductRelatedProduct";
import Profile from "./pages/Profile";
import Recruitment from "./pages/Recruitment";
import RegisterMiss from "./pages/RegisterMiss";
import ShoppingCart from "./pages/ShoppingCart";

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
        <Container className='custom-breadcrumb'>
          <Breadcrumbs />
        </Container>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route exact path='/products' element={<ProductPage />} />
          {/* <Route exact path='/productFinance' element={<ProductPage />} />
          <Route exact path='/productTravel' element={<ProductPage />} />
          <Route exact path='/productLife' element={<ProductPage />} /> */}
          <Route path='/products/:name' element={<ProductDetail />} />
          <Route
            path='/products/:name/related-product'
            element={<ProductRelatedProduct />}
          />
          <Route
            path='/products/:name/related-founder'
            element={<ProductRelatedPerson />}
          />
          <Route
            path='/products/:name/related-kol'
            element={<ProductRelatedPerson />}
          />
          <Route
            path='/products/:name/related-ambassador'
            element={<ProductRelatedPerson />}
          />
          \
          <Route
            path='/products/:name/related-news'
            element={<ProductRelatedNews />}
          />
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
          <Route path='/person/:id' element={<KolDetail />} />
          <Route path='/cart' element={<ShoppingCart />} />
          <Route path='/miss-register' element={<RegisterMiss />} />
          <Route path='/brands' element={<BrandPage />} />
          <Route path='/missinternational/vote' element={<MIVoting />} />
          <Route path='/sponsor/greeness' element={<Greeness />} />
          <Route path='/brands/:id' element={<BrandDetail />} />
          <Route path='/brand/:id' element={<BrandDetail />} />
          <Route path='/news/:id' element={<NewsDetail />} />
          <Route
            path='/person/:id/related-brands'
            element={<PersonRelatedBrands />}
          />
          <Route
            path='/person/:id/related-products'
            element={<PersonRelatedProducts />}
          />
          <Route
            path='/person/:id/related-news'
            element={<PersonRelatedNews />}
          />
          <Route
            path='/brands/:id/related-news'
            element={<BrandRelatedNewsPage />}
          />
          <Route
            path='/brands/:id/related-persons'
            element={<BrandRelatedPersonsPage />}
          />
          <Route
            path='/brands/:id/related-products'
            element={<BrandRelatedProductsPage />}
          />
        </Routes>
        {/* 全局悬浮按钮 */}
        <FloatingHomeButton />
      </div>

      {footer}
    </div>
  );
}

export default App;
