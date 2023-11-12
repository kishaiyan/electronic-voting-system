import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import './css/admin.css';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [newParty, setNewParty] = useState('');
  const [newCandidate, setNewCandidate] = useState('');
  const [votingDate, setVotingDate] = useState(new Date());
  const [notification, setNotification] = useState('');
  const [showAddPartyPopup, setShowAddPartyPopup] = useState(false);
  const [showAddCandidatePopup, setShowAddCandidatePopup] = useState(false);

  const parties =[
    { id: 1, name: 'Party A', abbreviation: 'PA', leader: 'Leader A' },
    { id: 2, name: 'Party B', abbreviation: 'PB', leader: 'Leader B' },
    // Add more dummy parties as needed
  ];

  const candidates = [
    { id: 1, name: 'Candidate X', party: 'Party A', constituency: 'Constituency 1', dob: '1990-01-01', email: 'candidateX@example.com', biography: 'Lorem ipsum...', promises: 'Lorem ipsum...', image: 'path/to/image.jpg' },
    { id: 2, name: 'Candidate Y', party: 'Party B', constituency: 'Constituency 2', dob: '1985-05-15', email: 'candidateY@example.com', biography: 'Lorem ipsum...', promises: 'Lorem ipsum...', image: 'path/to/image.jpg' },
    // Add more dummy candidates as needed
  ];

  const voters = [
    { id: 1, govID: 'G12345', voterId: 'V12345' },
    { id: 2, govID: 'G67890', voterId: 'V67890'},
    // Add more dummy voters as needed
  ];

  const handleSignOut = () => {
    console.log("User logged off");
  };

  // Form submission handlers

  const toggleAddPartyPopup = () => {
    setShowAddPartyPopup(!showAddPartyPopup);
  };

  const handleAddParty = (e) => {
    e.preventDefault();
    console.log('Party added:', newParty);
    setNewParty('');
    // Placeholder for success message
  };

  const handleDeleteParty = (partyId) => {
    // Placeholder for handling party deletion
    console.log(`Delete party with ID ${partyId}`);
    // Implement the logic to delete the party with the given ID
  };

  const handleEditParty = (partyId) => {
    // Placeholder for handling party modification
    console.log(`Modify party with ID ${partyId}`);
    // Implement the logic to modify the party with the given ID
  };

  const toggleAddCandidatePopup = () => {
    setShowAddCandidatePopup(!showAddCandidatePopup);
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    console.log('Candidate added:', newCandidate);
    setNewCandidate('');
    // Placeholder for success message
  };

  const handleDeleteCandidate = (candidateId) => {
    // Placeholder for handling candidate deletion
    console.log(`Delete candidate with ID ${candidateId}`);
    // Implement the logic to delete the candidate with the given ID
  };

  const handleEditCandidate = (candidateId) => {
    // Placeholder for handling candidate modification
    console.log(`Modify candidate with ID ${candidateId}`);
    // Implement the logic to modify the candidate with the given ID
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

  const handleDeleteVoter = (voterId) => {
    // Placeholder for handling voter deletion
    console.log(`Delete voter with ID ${voterId}`);
    // Implement the logic to delete the voter with the given ID
  };

  const handleApproveVoter = (voterId) => {
    // Placeholder for handling voter modification
    console.log(`Modify voter with ID ${voterId}`);
    // Implement the logic to modify the voter with the given ID
  };


  // Dummy data for the admin dashboard
  const totalVotersRegistered = '10,000';
  const totalVotesCasted = '5,000';
  const totalPartiesRegistered = '10';
  const totalCandidateRegistered = '25';

  return (
    <div className="admin-container">
      <nav className="sidebar">
        <ul className="nav-links">
          <a href="#dashboard" onClick={() => setActiveSection('dashboard')}>Dashboard</a>
          <a href="#voters" onClick={() => setActiveSection('voters')}>Voters</a>
          <a href="#candidates" onClick={() => setActiveSection('candidates')}>Candidates</a>
          <a href="#parties" onClick={() => setActiveSection('parties')}>Parties</a>
          <Link to="/homepage">Cast a Vote</Link>
        </ul>
      </nav>
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <button onClick={handleSignOut} className="logout-btn">Signout</button>
          </div>
        </header>

        <div className="dashboard-content">

          {activeSection === 'dashboard' && (
            <div>
              <div className="stats-section">
                <h2>Current Statistics</h2>
                <div className="box-container">
                  <div className="box">
                    <h3>Total Voters Registered</h3>
                    <p>{totalVotersRegistered}</p>
                  </div>
                  <div className="box">
                    <h3>Total Votes Casted</h3>
                    <p>{totalVotesCasted}</p>
                  </div>
                </div>
                <div className="box-container">
                  <div className="box">
                    <h3>Total Parties Registered</h3>
                    <p>{totalPartiesRegistered}</p>
                  </div>
                  <div className="box">
                    <h3>Total Candidates Registered</h3>
                    <p>{totalCandidateRegistered}</p>
                  </div>
                </div>
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
              <div className="form-section send-notification">
                <h2>Send Notification to Voters</h2>
                <form onSubmit={handleSendNotification}>
                  <textarea
                    placeholder="Notification Message"
                    value={notification}
                    onChange={(e) => setNotification(e.target.value)}
                  />
                  <button className='notification-button' type="submit">Send Notification</button>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'parties' && (
            <div className="form-section">
              <h2>Parties</h2>
              {parties.map((party) => (
                <div key={party.id} className="party-card">
                  <div>
                    {party.name} ({party.abbreviation}) - Leader: {party.leader}
                  </div>
                  <div className="party-buttons">
                    <button className="edit-button" onClick={() => handleEditParty(party.id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteParty(party.id)}>Delete</button>
                  </div>
                </div>
              ))}
              <button className="add-button" onClick={toggleAddPartyPopup}>Add more</button>
              {showAddPartyPopup && (
                <div className="party-popup">
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
              )}
            </div>
          )}

          {activeSection === 'candidates' && (
            <div className="form-section">
              <h2>Candidates</h2>
              {candidates.map((candidate) => (
                <div key={candidate.id} className="candidate-card">
                  <div>
                    {candidate.name} - Party: {candidate.party}, Constituency: {candidate.constituency}
                  </div>
                  <div className="candidate-buttons">
                    <button className="edit-button" onClick={() => handleEditCandidate(candidate.id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteCandidate(candidate.id)}>Delete</button>
                  </div>
                </div>
              ))}
              <button className="add-button" onClick={toggleAddCandidatePopup}>Add more</button>
              {showAddCandidatePopup && (
                <div className="candidate-popup">
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
              )}
            </div>
          )}

          {activeSection === 'voters' && (
            <div className="form-section">
              <h2>Voters</h2>
              {voters.map((voter) => (
                <div key={voter.id} className="voter-card">
                  <div>
                  Gov ID: {voter.govID} - Voter ID: {voter.voterId}
                  </div>
                  <div className="voter-buttons">
                    <button className="edit-button" onClick={() => handleApproveVoter(voter.id)}>Approve</button>
                    <button className="delete-button" onClick={() => handleDeleteVoter(voter.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Admin;
