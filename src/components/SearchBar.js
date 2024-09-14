// src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchBar.css'; // for styling

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`https://restcountries.com/v3.1/all`);
        const countries = response.data;
        const filtered = countries.filter(country =>
          country.name.common.toLowerCase().includes(query.toLowerCase()) ||
          (country.capital && country.capital[0].toLowerCase().includes(query.toLowerCase()))
        );
        setSuggestions(filtered);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSuggestionClick = (country) => {
    setSelectedCountry(country);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search by country name or capital"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((country, index) => (
            <li key={index} onClick={() => handleSuggestionClick(country)}>
              {country.name.common} ({country.capital ? country.capital[0] : 'No capital'})
            </li>
          ))}
        </ul>
      )}
      {selectedCountry && (
        <div className="selected-country">
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital ? selectedCountry.capital[0] : 'No capital'}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

