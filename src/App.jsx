import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
// import { useMediaQuery } from "react-responsive";
import { Route, Routes, useLocation } from "react-router-dom";
import CuteChatbot from "@dreamoverseas/cute-chatbot";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./App.css";
import BrandDetail from "./components/BrandDetail.jsx";
// import Breadcrumbs from "./components/Breadcrumbs.jsx";
import EventDetail from "./components/EventDetail.jsx";
import FloatingHomeButton from "./components/FloatingHomeButton.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import KolDetail from "./components/KolDetail.jsx";
import NewsDetail from "./components/NewsDetail.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AmbassadorPage from "./pages/AmbassadorPage.jsx";
import BrandPage from "./pages/BrandPage.jsx";
import BrandRelatedNewsPage from "./pages/BrandRelatedNewsPage.jsx";
import BrandRelatedPersonsPage from "./pages/BrandRelatedPersonsPage.jsx";
import BrandRelatedProductsPage from "./pages/BrandRelatedProductsPage.jsx";
// import Events from "./pages/Events";
import RecentProductsBar from "./components/RecentProductsBar.jsx";
import FounderPage from "./pages/FounderPage.jsx";
import Greeness from "./pages/Greeness.jsx";
import InfluenceHub from "./pages/InfluenceHub.jsx";
import KolPage from "./pages/KolPage.jsx";
import MediaCenter from "./pages/MediaCenter.jsx";
import MerchantPromotion from "./pages/MerchantPromotion.jsx";
import MIVoting from "./pages/MI_VotingPage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import PersonRelatedBrands from "./pages/PersonRelatedBrands.jsx";
import PersonRelatedNews from "./pages/PersonRelatedNews.jsx";
import PersonRelatedProducts from "./pages/PersonRelatedProducts.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProductRelatedBrand from "./pages/ProductRelatedBrand.jsx";
import ProductRelatedEvent from "./pages/ProductRelatedEvent.jsx";
import ProductRelatedNews from "./pages/ProductRelatedNews.jsx";
import ProductRelatedPerson from "./pages/ProductRelatedPerson.jsx";
import ProductRelatedProduct from "./pages/ProductRelatedProduct.jsx";
import Profile from "./pages/Profile.jsx";
import Recruitment from "./pages/Recruitment.jsx";
import RegisterMiss from "./pages/RegisterMiss.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";

const API_URL = import.meta.env.VITE_OPENAI_API_URL
const ASST_ID = import.meta.env.VITE_OPENAI_ASST_ID
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const GOOGLE_API = import.meta.env.VITE_GOOGLE_API

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
      {/* <div className='custom-breadcrumb'>
        <Breadcrumbs />
      </div> */}
      <div className='main-content'>
        <Routes>
          {/* <Route exact path='/' element={<Home />} /> */}
          <Route exact path='/' element={<ProductPage />} />
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
          <Route
            path='/products/:name/related-event'
            element={<ProductRelatedEvent />}
          />
          <Route
            path='/products/:name/related-brand'
            element={<ProductRelatedBrand />}
          />
          <Route exact path='/products/:name' element={<ProductDetail />} />
          <Route
            exact
            path='/merchant/360-media-promotion-service'
            element={<MerchantPromotion />}
          />
          <Route exact path='/events/:name' element={<EventDetail />} />
          <Route path='/join-us' element={<Recruitment />} />
          <Route path='/influence-hub' element={<InfluenceHub />} />
          <Route path='/media-center' element={<MediaCenter />} />
          <Route path='/news' element={<NewsPage />} />
          {/* <Route path='/events' element={<Events />} /> */}
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
            path='/person/:id/related-brand'
            element={<PersonRelatedBrands />}
          />
          <Route
            path='/person/:id/related-product'
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
            path='/brands/:id/related-person'
            element={<BrandRelatedPersonsPage />}
          />
          <Route
            path='/brands/:id/related-product'
            element={<BrandRelatedProductsPage />}
          />
        </Routes>
        {/* 全局悬浮按钮 */}
        <RecentProductsBar /> {/* ✅ 在整个应用的底部加载 */}
        <FloatingHomeButton />
        <CuteChatbot
          style={{ zIndex: 101 }}
          nickname='DoBot'
          openai_api_url={`${API_URL}`}
          openai_asst_id={`${ASST_ID}`}
          openai_api_key={`${API_KEY}`}
          google_api_key={`${GOOGLE_API}`}
        />
      </div>

      {footer}
    </div>
  );
}

export default App;
