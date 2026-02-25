import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HeroGallery from './components/HeroGallery'
import PromptEnhancer from './components/PromptEnhancer'
import ShotToPrompt from './components/ShotToPrompt'
import CameraMovesPreview from './components/CameraMovesPreview'
import CameraMoves from './components/CameraMoves'
import Features from './components/Features'
import PromptVault from './components/PromptVault'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import Success from './components/Success'

function App() {
  return (
    <Router>
      <div className="min-h-screen transition-colors" style={{ background: 'var(--bg-primary)' }}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <HeroGallery />
                <PromptEnhancer />
                <ShotToPrompt preview={true} />
                <CameraMovesPreview />
                <Features />
                <PromptVault preview={true} />
                <Pricing />
              </>
            } />
            <Route path="/prompts" element={<PromptVault />} />
            <Route path="/shot-to-prompt" element={<ShotToPrompt />} />
            <Route path="/camera-moves" element={<CameraMoves />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App