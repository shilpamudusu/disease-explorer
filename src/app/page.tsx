import DiseaseExplorer from '../components/DiseaseExplorer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Disease Explorer for Target Identification</h1>
      <DiseaseExplorer />
    </main>
  );
}

