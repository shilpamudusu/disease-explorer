import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import DiseaseExplorer from './components/DiseaseExplorer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <div className="min-h-screen bg-background">
            <header className="bg-primary text-primary-foreground py-6">
              <h1 className="text-4xl font-bold text-center">Disease Explorer for Target Identification</h1>
            </header>
            <main className="container mx-auto px-4 py-8">
              <DiseaseExplorer />
            </main>
          </div>
    </>
  )
}

export default App
