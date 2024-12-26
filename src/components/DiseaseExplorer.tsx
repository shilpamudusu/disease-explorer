import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import { searchDiseases, getDiseaseDetails, getDiseaseParents, getDiseaseChildren } from '../utils/api';

interface Disease {
  iri: string;
  label: string;
  ontology_name: string;
  obo_id: string;
  description?: string[];
}

const DiseaseExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ontology, setOntology] = useState('efo');
  const [searchResults, setSearchResults] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [hierarchy, setHierarchy] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await searchDiseases(searchTerm, ontology);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching diseases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiseaseSelect = async (disease: Disease) => {
    setIsLoading(true);
    setSelectedDisease(disease);
    try {
      const details = await getDiseaseDetails(disease.iri, ontology);
      const parents = await getDiseaseParents(disease.iri, ontology);
      const children = await getDiseaseChildren(disease.iri, ontology);

      setHierarchy({
        ...details,
        parents,
        children
      });
    } catch (error) {
      console.error('Error fetching disease details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHierarchy = (nodes: any) => (
    <ul className="pl-4">
      {Array.isArray(nodes) && nodes.map((node: any) => (
        <li key={node.iri} className="mb-2">
          <span className="font-medium">{node.label}</span>
          {node.children && renderHierarchy(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <Card className="bg-background text-foreground">
      <CardHeader>
        <CardTitle className="text-primary">Disease Explorer</CardTitle>
        <CardDescription>Search and explore diseases, their hierarchies, and codes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Search diseases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={ontology} onValueChange={setOntology}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select ontology" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efo">EFO</SelectItem>
              <SelectItem value="mondo">MONDO</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Search'}
          </Button>
        </div>
        <div className="flex space-x-4">
          <div className="w-1/2 bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-primary">Search Results</h3>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ul className="space-y-2">
                {searchResults.map((disease) => (
                  <li
                    key={disease.iri}
                    className={`cursor-pointer p-2 rounded transition-colors ${
                      selectedDisease?.iri === disease.iri
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => handleDiseaseSelect(disease)}
                  >
                    {disease.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="w-1/2 bg-secondary p-4 rounded-lg">
            {selectedDisease && (
              <div>
                <h3 className="text-lg font-semibold text-primary">{selectedDisease.label}</h3>
                <p className="text-secondary-foreground">Ontology: {selectedDisease.ontology_name.toUpperCase()}</p>
                <p className="text-secondary-foreground">ID: {selectedDisease.obo_id}</p>
                {selectedDisease.description && (
                  <p className="mt-2 text-secondary-foreground">{selectedDisease.description[0]}</p>
                )}
                {hierarchy && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-primary">Hierarchy</h4>
                    {isLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      renderHierarchy([
                        { label: 'Parents', children: hierarchy.parents },
                        { label: selectedDisease.label, children: hierarchy.children }
                      ])
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiseaseExplorer;

