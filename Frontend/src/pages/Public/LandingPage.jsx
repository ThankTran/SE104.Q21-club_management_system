import { useState } from 'react'
import NavbarLanding from '../../components/layout/Navbar/NavbarLanding'
import Footer from '../../components/layout/Footer/Footer'

import Hero from '../../components/sections/Landing/Hero/Hero'
import About from '../../components/sections/Landing/About/About'
import Event from '../../components/sections/Landing/Event/Event'
import Gallery from '../../components/sections/Landing/Gallery/Gallery'

import Member from '../../components/sections/Landing/Member/Member'
import MemberF from '../../components/sections/Member/MemberForm'
import MemberT from '../../components/sections/Member/MemberTable'

import LoginModal from '../../components/common/Modals/LoginModal/LoginModal'
import useScrollReveal from '../../hooks/useScrollReveal'
 
export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  useScrollReveal()

  return (
    <>
      <div className={`landing-wrapper ${showLogin ? "landing-blur" : ""}`}>
        <NavbarLanding
          onLoginClick={() => setShowLogin(true)} 
        />
        <Hero />
        <About />
        <Event />
        <Gallery />
        <Member />
        <MemberF />
        <MemberT />
        <Footer />
      </div>

      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
}
