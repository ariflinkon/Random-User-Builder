import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './components/UserTable';

const App = () => {
  const [region, setRegion] = useState('USA');
  const [errors, setErrors] = useState(0);
  const [seed, setSeed] = useState(1);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [region, errors, seed, page]);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await axios.get(`http://localhost:5000/api/users`, {
      params: { region, errors, seed, page }
    });
    setUsers(prevUsers => [...prevUsers, ...response.data]);
    setLoading(false);
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setPage(1);
    setUsers([]);
  };

  const handleErrorsChange = (e) => {
    setErrors(Math.min(e.target.value, 1000));
    setPage(1);
    setUsers([]);
  };

  const handleSeedChange = (e) => {
    setSeed(e.target.value);
    setPage(1);
    setUsers([]);
  };

  const generateRandomSeed = async () => {
    const response = await axios.get(`http://localhost:5000/api/generate-seed`);
    setSeed(response.data.seed);
    setPage(1);
    setUsers([]);
  };

  const handleScroll = (e) => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight && !loading) {
      setPage(prevPage => prevPage + 1);
    }
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
      </div>
      <UserTable users={users} />
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default App;