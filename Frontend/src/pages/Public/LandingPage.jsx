import NavbarLanding from '../../components/layout/Navbar/NavbarLanding'
import Footer from '../../components/layout/Footer/Footer'

import Hero from '../../components/sections/Landing/Hero/Hero'
import About from '../../components/sections/Landing/About/About'
import Event from '../../components/sections/Landing/Event/Event'
import Gallery from '../../components/sections/Landing/Gallery/Gallery'

import Member from '../../components/sections/Landing/Member/Member'
import MemberF from '../../components/sections/Member/MemberForm'
import MemberT from '../../components/sections/Member/MemberTable'

import useScrollReveal from '../../hooks/useScrollReveal'
 
export default function LandingPage() {
  useScrollReveal()

  return (
    <>
      <div className="landing-wrapper">
        <NavbarLanding />
        <Hero />
        <About />
        <Event />
        <Gallery />
        <Member />
        <MemberF />
        <MemberT />
        <Footer />
      </div>
    </>
  );
}
