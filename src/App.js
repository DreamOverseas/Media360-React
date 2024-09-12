import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, {useEffect} from "react";
// import { useMediaQuery } from "react-responsive";
import { Route, Routes, useLocation  } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import KolDetail from "./components/KolDetail";
import ProductDetail from "./components/ProductDetail";
import EventDetail from "./components/EventDetail";
import ProductPage from "./pages/ProductPage";
import Contact from "./pages/Contact";
import KolPage from "./pages/KolPage";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ShoppingCart from "./pages/ShoppingCart";

function App() {

  // Reserved for different needs of costomisation across pages
  const location = useLocation();
  //const [footer, setFooter] = useState();

  useEffect(() => {
    if (location.pathname === "/") {
      document.body.style.marginTop = "-24px";
      // eslint-disable-next-line react-hooks/exhaustive-deps
      //setFooter(<></>);
    } else {
      document.body.style.marginTop = "54px";
      //setFooter(<Footer />);
    }
  }, [location]);

  // Check if is on desktop
  // const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  return (
    <div className='App'>
      <Header />
      <div className="main-content">
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
          <Route exact path='/event/:id' element={<EventDetail />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/kolpage' element={<KolPage />} />
          <Route path='/kol/:id' element={<KolDetail />} />
          <Route path='/cart' element={<ShoppingCart />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
