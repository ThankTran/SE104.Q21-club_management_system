import { useState } from 'react'
import NavbarLanding from '../components/layout/Navbar/NavbarLanding'
import Footer from '../components/layout/Footer/Footer'

import Hero from '../components/sections/Hero/Hero'
import About from '../components/sections/About/About'
import Event from '../components/sections/Event/Event'
import Gallery from '../components/sections/Gallery/Gallery'

import MemberF from '../components/sections/Member/MemberForm'
import MemberT from '../components/sections/Member/MemberTable'

import LoginModal from '../components/common/Modals/LoginModal/LoginModal'
import RegisterModal from '../components/common/Modals/RegisterModal/RegisterModal'
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
        <MemberF />
        <MemberT />
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