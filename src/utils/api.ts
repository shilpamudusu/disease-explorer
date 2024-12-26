import axios from 'axios';

const BASE_URL = 'https://www.ebi.ac.uk/ols/api';

// https://www.ebi.ac.uk/ols4/api/search?q=asthma&ontology=mondo&type=class

export const searchDiseases = async (query: string, ontology: string) => {
  // const response = await fetch(`${BASE_URL}/search`, {
  //   params: {
  //     q: query,
  //     ontology: ontology,
  //     type: 'class'
  //   }
  // });
  const response = await fetch(`https://www.ebi.ac.uk/ols4/api/search?q=${query}&ontology=${ontology}&type=class`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json(); // Parse the response body as JSON
  console.log(data.docs); // Log the parsed data
  return data.response.docs; // Return the parsed data
  
};

export const getDiseaseDetails = async (iri: string, ontology: string) => {
  const encodedIri = encodeURIComponent(iri);
  const response = await axios.get(`${BASE_URL}/ontologies/${ontology}/terms/${encodedIri}`);
  return response.data;
};

export const getDiseaseParents = async (iri: string, ontology: string) => {
  const encodedIri = encodeURIComponent(iri);
  const response = await axios.get(`${BASE_URL}/ontologies/${ontology}/terms/${encodedIri}/parents`);
  return response.data._embedded.terms;
};

export const getDiseaseChildren = async (iri: string, ontology: string) => {
  const encodedIri = encodeURIComponent(iri);
  const response = await axios.get(`${BASE_URL}/ontologies/${ontology}/terms/${encodedIri}/children`);
  return response.data._embedded.terms;
};

