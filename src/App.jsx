import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
// import { useMediaQuery } from "react-responsive";
import { Route, Routes, useLocation } from "react-router-dom";

import "./App.css";
import BrandDetail from "./components/BrandDetail.jsx";
import Breadcrumbs from "./components/Breadcrumbs.jsx";
import EventDetail from "./components/EventDetail.jsx";

import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import KolDetail from "./components/KolDetail.jsx";
import NewsDetail from "./components/NewsDetail.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import RecentProductsBar from "./components/RecentProductsBar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AmbassadorPage from "./pages/AmbassadorPage.jsx";
import BrandPage from "./pages/BrandPage.jsx";
import BrandRelatedNewsPage from "./pages/BrandRelatedNewsPage.jsx";
import BrandRelatedPersonsPage from "./pages/BrandRelatedPersonsPage.jsx";
import BrandRelatedProductsPage from "./pages/BrandRelatedProductsPage.jsx";
import Events from "./pages/Events";
import FounderPage from "./pages/FounderPage.jsx";
import Greeness from "./pages/Greeness.jsx";
import KolPage from "./pages/KolPage.jsx";
import MediaCenter from "./pages/MediaCenter.jsx";
import MerchantPromotion from "./pages/MerchantPromotion.jsx";
import MIVoting from "./pages/MI_VotingPage.jsx";
import Networks from "./pages/Networks.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import PersonRelatedBrands from "./pages/PersonRelatedBrands.jsx";
import PersonRelatedNews from "./pages/PersonRelatedNews.jsx";
import PersonRelatedProducts from "./pages/PersonRelatedProducts.jsx";
// import ProductPage from "./pages/ProductPage.jsx";
import ProductRelatedBrand from "./pages/ProductRelatedBrand.jsx";
import ProductRelatedEvent from "./pages/ProductRelatedEvent.jsx";
import ProductRelatedNews from "./pages/ProductRelatedNews.jsx";
import ProductRelatedPerson from "./pages/ProductRelatedPerson.jsx";
// import ProductRelatedProduct from "./pages/ProductRelatedProduct.jsx";
import Profile from "./pages/Profile.jsx";
import Activity from "./components/Activity.jsx";
import FloatingHomeButton from "./components/FloatingHomeButton.jsx";
import ProductRouteGuard from "./components/ProductRouteGuard.jsx";
import AboutUs from "./pages/AboutUsPage.jsx";
import ToolLinkPage from "./pages/Admin/ToolLinks.jsx";
import CustomerApplicationForm from "./pages/CustomerForm/CustomerApplicationForm.jsx";
import RecruitmentAgencyForm from "./pages/CustomerForm/RecruitmentAgencyForm";
import Home from "./pages/Home.jsx";
import MigrationAdvisor from "./pages/MigrationAdvisor";
import PartnerDetail from "./pages/PartnerDetail/PartnerDetail.jsx";
import PartnerApplicationForm from "./pages/PartnerForm/PartnerApplicationForm.jsx";
import InfluencerRanking from "./pages/Race/InfluencerRanking.jsx";
import Recruitment from "./pages/Recruitment.jsx";
import RegisterMiss from "./pages/RegisterMiss.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import TermsAndConditions from "./pages/TermsAndConditions";
import WeChatBlocker from "./utils/WeChatBlocker.jsx";
import Whds from "./specialPage/Whds.jsx";
import Group from "./pages/Group.jsx";

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
    }
  }, [location]);

  // Check if is on desktop
  // const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  return (
    <div className='App'>
      <WeChatBlocker />
      <ScrollToTop />
      {header}
      <div className='custom-breadcrumb'>
        <Breadcrumbs />
      </div>
      <div className='main-content'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products/:main' element={<ProductRouteGuard />}>
            <Route index element={<ProductDetail />} />
            <Route path=':variant' element={<ProductDetail />} />
          </Route>
          {/* <Route exact path='/' element={<ProductPage />} /> */}
          {/* <Route path='/profile' element={<Profile />} />
          <Route exact path='/products' element={<ProductPage />} /> */}
          {/* <Route exact path='/productFinance' element={<ProductPage />} />
          <Route exact path='/productTravel' element={<ProductPage />} />
          <Route exact path='/productLife' element={<ProductPage />} /> */}
          {/* <Route path='/products/:name' element={<ProductDetail />} /> */}
          <Route path='/about-us' element={<AboutUs />} />
          {/* <Route
            path='/products/:name/related-product'
            element={<ProductRelatedProduct />}
          /> */}
          <Route
            path='/products/:main/related-founder'
            element={<ProductRelatedPerson />}
          />

          <Route
            path='/products/:main/:variant/related-founder'
            element={<ProductRelatedPerson />}
          />
<Route path='/profile' element={<Profile />} />
          <Route
            path='/products/:main/related-kol'
            element={<ProductRelatedPerson />}
          />

          <Route
            path='/products/:main/:variant/related-kol'
            element={<ProductRelatedPerson />}
          />

          <Route
            path='/products/:main/related-ambassador'
            element={<ProductRelatedPerson />}
          />

          <Route
            path='/products/:main/:variant/related-ambassador'
            element={<ProductRelatedPerson />}
          />

          <Route
            path='/products/:main/related-news'
            element={<ProductRelatedNews />}
          />

          <Route
            path='/products/:main/:variant/related-news'
            element={<ProductRelatedNews />}
          />

          <Route
            path='/products/:main/related-event'
            element={<ProductRelatedEvent />}
          />
          <Route
            path='/products/:main/:variant/related-event'
            element={<ProductRelatedEvent />}
          />
          <Route
            path='/products/:main/related-brand'
            element={<ProductRelatedBrand />}
          />
          <Route
            path='/products/:main/:variant/related-brand'
            element={<ProductRelatedBrand />}
          />
          <Route
            exact
            path='/merchant/360-media-promotion-service'
            element={<MerchantPromotion />}
          />
          <Route exact path='/events/:name' element={<EventDetail />} />
          <Route exact path='/events/2025-2026-Global-Influencer-Competition/:name' element={<Whds />} />
          <Route exact path='/events/2025-2026-Global-Influencer-Competition' element={<Whds />} />

          <Route
            path='/products/:productName/:partnerType/CustomerApplicationForm'
            element={<CustomerApplicationForm />}
          />
          <Route
            path='/products/:productName/:partnerType/PartnerDetail/PartnerApplicationForm'
            element={<PartnerApplicationForm />}
          />
          <Route
            path='/products/:productName/:partnerType/PartnerDetail/PartnerApplicationForm/terms-and-conditions'
            element={<TermsAndConditions />}
          />
          <Route
            path='/products/:productName/:partnerType/PartnerDetail'
            element={<PartnerDetail />}
          />
          <Route
            path='/products/:productName/:partnerType/MigrationAdvisor'
            element={<MigrationAdvisor />}
          />
          <Route
            path='/products/:productName/:partnerType/RecruitmentAgencyForm'
            element={<RecruitmentAgencyForm />}
          />

          <Route path='/join-us' element={<Recruitment />} />
          {/* <Route path='/networks' element={<Networks />} /> */}
          <Route path='/influencer' element={<Networks />} />
          <Route path='/group' element={<Group />} />
          <Route path='/media-center' element={<MediaCenter />} />
          <Route path='/news' element={<NewsPage />} />
          <Route
            path='/events'
            element={
              <>
                <Activity />
                <Events />
              </>
            }
          />
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

          <Route path='/dog' element={<ToolLinkPage />} />
          {/* ...test... */}
          <Route path='/ranking' element={<InfluencerRanking />} />
        </Routes>
      </div>
      {footer}
      <FloatingHomeButton />
      <RecentProductsBar />
    </div>
  );
}

export default App;
