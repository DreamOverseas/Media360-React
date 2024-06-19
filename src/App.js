import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductDetail from "./components/ProductDetail";
import Products from "./components/Products";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <div className='App'>
        <Header />
        <main>
          <Routes>
            <Route
              path='/'
              element={
                <>
                  <section className='hero'>
                    <div className='hero-text'>
                      <h1>Lorem ipsum</h1>
                      <p>
                        Lorem ipsum dolor sit amet consectetur. Faucibus at
                        parturient est tincidunt et platea volutpat at. Etiam id
                        iaculis tincidunt sem scelerisque tincidunt elementum
                        tellus. Risus vel fermentum faucibus tincidunt.
                      </p>
                    </div>
                    <img
                      src='path/to/your/image'
                      alt='StudyFin'
                      className='hero-image'
                    />
                  </section>

                  <section className='profiles'>
                    <div className='profile'>
                      <img src='path/to/profile/image' alt='Profile' />
                      <h2>Lorem ipsum</h2>
                      <p>Lorem ipsum dolor sit amet consectetur.</p>
                    </div>
                    <div className='profile'>
                      <img src='path/to/profile/image' alt='Profile' />
                      <h2>Lorem ipsum</h2>
                      <p>Lorem ipsum dolor sit amet consectetur.</p>
                    </div>
                    {/* Add more profiles as needed */}
                  </section>

                  <section className='feature'>
                    <img
                      src='path/to/feature/image'
                      alt='Feature'
                      className='feature-image'
                    />
                    <div className='feature-text'>
                      <h1>Lorem ipsum</h1>
                      <p>
                        Lorem ipsum dolor sit amet consectetur. Faucibus at
                        parturient est tincidunt et platea volutpat at. Etiam id
                        iaculis tincidunt sem scelerisque tincidunt elementum
                        tellus. Risus vel fermentum faucibus tincidunt.
                      </p>
                    </div>
                  </section>

                  <section className='logos'>
                    <div className='logo'>LOGO</div>
                    <div className='logo'>LOGO</div>
                    <div className='logo'>LOGO</div>
                    <div className='logo'>LOGO</div>
                    {/* Add more logos as needed */}
                  </section>
                </>
              }
            />
            <Route path='/products' element={<Products />} />
            <Route path='/product/:id' element={<ProductDetail />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
