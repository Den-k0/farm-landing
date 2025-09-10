import Layout from './components/layout/Layout'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Crops from './components/sections/Crops'
import Livestock from './components/sections/Livestock'
import Social from './components/sections/Social'
import Gallery from './components/sections/Gallery'
import Contact from './components/sections/Contact'

function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <Crops />
      <Livestock />
      <Social />
      <Gallery />
      <Contact />
    </Layout>
  )
}

export default App
