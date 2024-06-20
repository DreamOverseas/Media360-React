import React from "react";
import "../App.css";

const Home = () => {
    return (
        <div>
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
        </div>
    );

}

export default Home;