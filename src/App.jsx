import AnimatedBackground from './components/AnimatedBackground'
import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <Hero />
      <Features />
      <Footer />
    </div>
  )
}

export default App
