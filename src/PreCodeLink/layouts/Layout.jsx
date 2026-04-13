import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />

      <main className="pt-16">
        {children}
      </main>

      <Footer />
    </>
  )
}

export default Layout