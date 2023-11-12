import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './css/admin.css'; // Ensure this path matches your file structure

const Admin = () => {
  const [newParty, setNewParty] = useState('');
  const [newCandidate, setNewCandidate] = useState('');
  const [votingDate, setVotingDate] = useState(new Date());
  const [notification, setNotification] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    console.log('User logged out');
  };

  const handleProfile = () => {
    console.log('Profile opened');
  };

  // Form submission handlers
  const handleAddParty = (e) => {
    e.preventDefault();
    console.log('Party added:', newParty);
    setNewParty('');
    // Placeholder for success message
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    console.log('Candidate added:', newCandidate);
    setNewCandidate('');
    // Placeholder for success message
  };

  const handleSetVotingDate = (date) => {
    setVotingDate(date);
    console.log('Voting date set to:', date);
    // Placeholder for success message
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    console.log('Notification sent:', notification);
    setNotification('');
    // Placeholder for success message
  };

  // Dummy data for the admin dashboard
  const totalVoters = '10,000';
  const totalVotesCast = '5,000';

  return (
    <div className="admin-container">
      <nav className="sidebar">
        <ul className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#voters">Voters</a>
          <a href="#candidates">Candidates</a>
          <a href="#parties">Parties</a>
          <a href="#elections">Elections</a>
          {/* ... other links */}
        </ul>
      </nav>
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>&nbsp;&nbsp;&nbsp;
            <button onClick={handleProfile} className="profile-btn">Profile</button> &nbsp;&nbsp;&nbsp;
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </header>
        
        <div className="dashboard-content">

<div className="form-section">
  <h2>Add a New Party</h2>
  <form onSubmit={handleAddParty}>
    <input type="text" placeholder="Party Name" value={newParty} onChange={(e) => setNewParty(e.target.value)} />
    <input type="text" placeholder="Party Abbreviation" /* ... */ />
    <input type="text" placeholder="Party Leader" /* ... */ />
    <input type="text" placeholder="Headquarters Address" /* ... */ />
    <input type="email" placeholder="Contact Email" /* ... */ />
    <textarea placeholder="Party Ideology" /* ... */ ></textarea>
    <input type="date" placeholder="Established Date" /* ... */ />
    <input type="file" /* ... */ />
    <button type="submit">Add Party</button>
  </form>
</div>

<div className="form-section">
  <h2>Add a New Candidate</h2>
  <form onSubmit={handleAddCandidate}>
    <input type="text" placeholder="Candidate Name" value={newCandidate} onChange={(e) => setNewCandidate(e.target.value)} />
    <select /* ... */ >
      {/* Dropdown options for Party Affiliation */}
    </select>
    <input type="text" placeholder="Constituency" /* ... */ />
    <input type="date" placeholder="Date of Birth" /* ... */ />
    <input type="email" placeholder="Contact Email" /* ... */ />
    <textarea placeholder="Biography" /* ... */ ></textarea>
    <textarea placeholder="Campaign Promises" /* ... */ ></textarea>
    <input type="file" /* ... */ />
    <button type="submit">Add Candidate</button>
  </form>
</div>


          <div className="form-section">
            <h2>Set Voting Date and Time</h2>
            <DatePicker
              selected={votingDate}
              onChange={handleSetVotingDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>

          <div className="form-section">
            <h2>Send Notification to Voters</h2>
            <form onSubmit={handleSendNotification}>
              <textarea
                placeholder="Notification Message"
                value={notification}
                onChange={(e) => setNotification(e.target.value)}
              />
              <button type="submit">Send Notification</button>
            </form>
          </div>

          <div className="stats-section">
            <h2>Current Statistics</h2>
            <p>Total Voters: {totalVoters}</p>
            <p>Total Votes Cast: {totalVotesCast}</p>
            {/* Add more statistics as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
