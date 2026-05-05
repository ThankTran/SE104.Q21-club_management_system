import { useState } from 'react'
import NavbarLanding from '../components/NavbarLanding'
import Hero from '../components/Hero'
import About from '../components/About'
import Event from '../components/Event'
import Gallery from '../components/Gallery'
import Member from '../components/Member.jsx'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal.jsx'
import useScrollReveal from '../hooks/useScrollReveal'
 
export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setshowRegister] = useState(false)
  useScrollReveal()

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
        <Member />
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