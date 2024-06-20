import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductDetail from "./components/ProductDetail";
import Products from "./components/Products";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <Routes>
          <Route exact path='/' element={<Home />} />
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/products' element={<Products />} />
            <Route exact path='/product/:id' element={<ProductDetail />} />
            <Route exact path='/login' element={<Login />} />
          </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
