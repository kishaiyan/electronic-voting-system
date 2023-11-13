import React from 'react';

const Dashboard = () => {
  // Dummy data for the dashboard
  const totalVotersRegistered = '10,000';
  const totalVotesCasted = '5,000';
  const totalPartiesRegistered = '10';
  const totalCandidatesRegistered = '25';

  return (
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
            <p>{totalCandidatesRegistered}</p>
          </div>
        </div>
      </div>
      <div className="form-section">
        {/* Add your chart or any other features here */}
        <h2>Chart Section</h2>
        {/* Placeholder for a chart */}
        <div className="chart-container">
          {/* Add your chart component or code here */}
          <p>Chart Goes Here</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
