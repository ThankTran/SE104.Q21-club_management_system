import { useState } from 'react'
import NavbarLanding from '../components/NavbarLanding'
import Hero from '../components/Hero'
import About from '../components/About'
import Event from '../components/Event'
import Gallery from '../components/Gallery'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal.jsx'
 
export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setshowRegister] = useState(false)

  return (
    <>
      <div className={`landing-wrapper ${showLogin || showRegister ? "landing-blur" : ""}`}>
        <NavbarLanding
          onLoginClick={() => setShowLogin(true)} 
          onRegisterClick={() => setshowRegister(true)}
        />
        <Hero />
        <About />
        <Event />
        <Gallery />
        <Footer />
      </div>

      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setshowRegister(true) }}
        />
      )}

      {showRegister && (
        <RegisterModal 
          onClose={() => setshowRegister(false)} 
          onSwitchToLogin={() => { setshowRegister(false); setShowLogin(true) }}
        />
      )}
    </>
  );
}