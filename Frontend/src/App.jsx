import React from 'react'
import AppContent from './routes/AppContent'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <BrowserRouter>
    <Toaster/>
      <AppContent />
    </BrowserRouter>

  )
}

export default App
