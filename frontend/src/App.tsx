import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [sources, setSources] = useState<string[]>([]);
  const [newSource, setNewSource] = useState('');

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await axios.get('http://localhost:4000/sources');
      setSources(response.data);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const addSource = async () => {
    try {
      await axios.post('http://localhost:4000/sources', { url: newSource });
      setNewSource('');
      fetchSources();
    } catch (error) {
      console.error('Error adding source:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>RSS Notifier</h1>
        <input
          type="text"
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
          placeholder="Enter RSS feed URL"
        />
        <button onClick={addSource}>Add Source</button>
        <ul>
          {sources.map((source, index) => (
            <li key={index}>{source}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;