import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import KolPage from "./components/KolPage";
import ProductDetail from "./components/ProductDetail";
import Products from "./components/Products";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ShoppingCart from "./pages/ShoppingCart";

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <Routes>
          <Route exact path='/' element={<Home />} />
            <Route exact path='/products' element={<Products />} />
            <Route exact path='/product/:id' element={<ProductDetail />} />
            <Route exact path='/login' element={<Login />} />
            <Route path='/kolpage' element={<KolPage />} />
            <Route path='/cart' element={<ShoppingCart />} />
          </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
