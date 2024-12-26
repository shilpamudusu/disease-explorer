import axios from 'axios';

const BASE_URL = 'https://www.ebi.ac.uk/ols/api';

export const searchDiseases = async (query: string, ontology: string) => {
  const response = await axios.get(`${BASE_URL}/search`, {
    params: {
      q: query,
      ontology: ontology,
      type: 'class'
    }
  });
  return response.data.response.docs;
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

