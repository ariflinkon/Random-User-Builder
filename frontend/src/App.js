import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './components/UserTable';
import { exportToCSV } from './components/exportToCSV';

const App = () => {
  const [region, setRegion] = useState('USA');
  const [errors, setErrors] = useState(0);
  const [seed, setSeed] = useState(1);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch users data with Axios
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/users`, {
        params: { region, errors, seed, page }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  }, [region, errors, seed, page, API_URL]);

  // Re-fetch users when any dependency changes
  useEffect(() => {
    fetchUsers();
  }, [region, errors, seed, page, fetchUsers]);

  // Handle region change
  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setPage(1);
    setUsers([]);
  };

  // Handle errors change
  const handleErrorsChange = (e) => {
    setErrors(Math.min(e.target.value, 1000)); // Limit errors between 0 and 1000
    setPage(1);
    setUsers([]);
  };

  // Handle seed change
  const handleSeedChange = (e) => {
    setSeed(e.target.value);
    setPage(1);
    setUsers([]);
  };

  // Generate random seed
  const generateRandomSeed = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/generate-seed`);
      setSeed(response.data.seed);
      setPage(1);
      setUsers([]);
    } catch (error) {
      console.error('Error generating seed:', error);
    }
  };

  // Infinite scrolling handler
  const handleScroll = (e) => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Export users data as CSV
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
    </div>
  );
};

export default App;