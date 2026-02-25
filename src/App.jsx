import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HeroGallery from './components/HeroGallery'
import WorkPreview from './components/WorkPreview'
import Features from './components/Features'
import PromptVault from './components/PromptVault'
import ShotToPrompt from './components/ShotToPrompt'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import Success from './components/Success'
import WorkLog from './components/WorkLog'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <HeroGallery />
                <WorkPreview />
                <ShotToPrompt preview={true} />
                <Features />
                <PromptVault preview={true} />
                <Pricing />
              </>
            } />
            <Route path="/prompts" element={<PromptVault />} />
            <Route path="/shot-to-prompt" element={<ShotToPrompt />} />
            <Route path="/work-log" element={<WorkLog />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App