import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth,signOut } from "firebase/auth";
import Dashboard from './components/dashboard'
import Voters from "./components/voters";
import Candidates from "./components/candidates";
import Parties from "./components/parties";
import Results from "./components/results";
import './css/admin.css';


const Admin = () => {

  const navigate=useNavigate();
  const [user,setUser]=useState("");
  const [activeSection, setActiveSection] = useState('dashboard');
  const [voters, setVoters] = useState([]);
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser(null);
        console.log("User logged off");
        navigate("/");
      })
      .catch((error) => {
        
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="admin-container">
      <nav className="sidebar">
        <ul className="nav-links">
          <a href="#dashboard" onClick={() => setActiveSection('dashboard')}>Dashboard</a>
          <a href="#voters" onClick={() => setActiveSection('voters')}>Voters</a>
          <a href="#candidates" onClick={() => setActiveSection('candidates')}>Candidates</a>
          <a href="#parties" onClick={() => setActiveSection('parties')}>Parties</a>
          <a href="#Results" onClick={()=> setActiveSection('results')}>Results</a>
        </ul>
      </nav>
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <button onClick={handleSignOut} className="logout-btn">Signout</button>
          </div>
        </header>
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'voters' && <Voters voters={voters} setVoters={setVoters} />}
        {activeSection === 'candidates' && <Candidates/>}
        {activeSection === 'parties' && <Parties/>}
        {activeSection === 'results' && <Results/>}
      </div>
    </div>
  );
};

export default Admin;
