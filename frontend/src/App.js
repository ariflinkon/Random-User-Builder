import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import UserTable from './components/UserTable';
import { exportToCSV } from './components/exportToCSV';
import './App.css'; // Ensure you have the CSS file imported

const App = () => {
  const [region, setRegion] = useState('USA');
  const [errors, setErrors] = useState(0);
  const [seed, setSeed] = useState(1);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchUsers = useCallback(async (append = false) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/users`, {
        params: { region, errors, seed, page }
      });

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setUsers((prevUsers) => (append ? [...prevUsers, ...response.data] : response.data));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  }, [region, errors, seed, page, API_URL]);

  useEffect(() => {
    fetchUsers(page > 1);
  }, [region, errors, seed, page, fetchUsers]);

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setPage(1);
    setUsers([]);
    setHasMore(true);
  };

  const handleErrorsChange = (e) => {
    setErrors(Math.min(e.target.value, 1000));
    setPage(1);
    setUsers([]);
    setHasMore(true);
  };

  const handleSeedChange = (e) => {
    setSeed(e.target.value);
    setPage(1);
    setUsers([]);
    setHasMore(true);
  };

  const generateRandomSeed = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/generate-seed`);
      setSeed(response.data.seed);
      setPage(1);
      setUsers([]);
      setHasMore(true);
    } catch (error) {
      console.error('Error generating seed:', error);
    }
  };

  const handleScroll = (e) => {
    if (
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
      !loading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleExport = () => {
    exportToCSV(users, 'users.csv');
  };

  return (
    <div className="app" onScroll={handleScroll}>
      <h1>Random User Data Generator</h1>
      <div className="controls">
        <div>
          <label>Region: </label>
          <select value={region} onChange={handleRegionChange}>
            <option value="USA">USA</option>
            <option value="Poland">Poland</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>
        <div>
          <label>Errors: </label>
          <input
            type="number"
            value={errors}
            onChange={handleErrorsChange}
            min="0"
            max="1000"
          />
          <input
            type="range"
            value={errors}
            onChange={handleErrorsChange}
            min="0"
            max="1000"
          />
        </div>
        <div>
          <label>Seed: </label>
          <input type="number" value={seed} onChange={handleSeedChange} />
          <button onClick={generateRandomSeed}>Random</button>
        </div>
        <button onClick={handleExport}>Export to CSV</button>
      </div>
      <UserTable users={users} />
      {loading && <div>Loading...</div>}
      {!hasMore && <div>No more records to load.</div>}
    </div>
  );
};

export default App;