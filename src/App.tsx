
import './App.css'
import DiseaseExplorer from './components/DiseaseExplorer'

function App() {
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
