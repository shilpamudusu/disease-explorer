import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

  const handleSearch = async () => {
    const results = await searchDiseases(searchTerm, ontology);
    setSearchResults(results);
  };

  const handleDiseaseSelect = async (disease: Disease) => {
    setSelectedDisease(disease);
    const details = await getDiseaseDetails(disease.iri, ontology);
    const parents = await getDiseaseParents(disease.iri, ontology);
    const children = await getDiseaseChildren(disease.iri, ontology);

    setHierarchy({
      ...details,
      parents,
      children
    });
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
    <Card>
      <CardHeader>
        <CardTitle>Disease Explorer</CardTitle>
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
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">Search Results</h3>
            <ul className="space-y-2">
              {searchResults.map((disease) => (
                <li
                  key={disease.iri}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 rounded transition-colors"
                  onClick={() => handleDiseaseSelect(disease)}
                >
                  {disease.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/2">
            {selectedDisease && (
              <div>
                <h3 className="text-lg font-semibold">{selectedDisease.label}</h3>
                <p>Ontology: {selectedDisease.ontology_name.toUpperCase()}</p>
                <p>ID: {selectedDisease.obo_id}</p>
                {selectedDisease.description && (
                  <p className="mt-2">{selectedDisease.description[0]}</p>
                )}
                {hierarchy && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold">Hierarchy</h4>
                    {renderHierarchy([
                      { label: 'Parents', children: hierarchy.parents },
                      { label: selectedDisease.label, children: hierarchy.children }
                    ])}
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

