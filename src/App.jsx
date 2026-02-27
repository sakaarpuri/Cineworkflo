import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import HeroGallery from './components/HeroGallery'
import PromptEnhancer from './components/PromptEnhancer'
import ShotToPrompt from './components/ShotToPrompt'
import CameraMoveCards from './components/CameraMoveCards'
import CameraMoves from './components/CameraMoves'
import CameraMovesNew from './components/CameraMovesNew'
import ModernAINativeMoves from './components/ModernAINativeMoves'
import CameraMovesPreviewPage from './pages/CameraMovesPreview'
import Features from './components/Features'
import PromptVault from './components/PromptVault'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import Success from './components/Success'
import AuthModal from './components/AuthModal'

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false)

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen transition-colors" style={{ background: 'var(--bg-primary)' }}>
          <Header onAuthClick={() => setAuthModalOpen(true)} />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <HeroGallery />
                  <PromptEnhancer />
                  <ShotToPrompt preview={true} />
                  <CameraMoveCards />
                  <Features />
                  <PromptVault preview={true} />
                  <Pricing />
                </>
              } />
              <Route path="/prompts" element={<PromptVault />} />
              <Route path="/shot-to-prompt" element={<ShotToPrompt />} />
              <Route path="/camera-moves" element={<CameraMoves />} />
              <Route path="/modern-moves" element={<ModernAINativeMoves />} />
              <Route path="/success" element={<Success />} />
            </Routes>
          </main>
          <Footer />
          <AuthModal 
            isOpen={authModalOpen} 
            onClose={() => setAuthModalOpen(false)} 
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
