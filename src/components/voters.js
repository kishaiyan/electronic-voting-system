import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from '../config/firebase';

const Voters = ({ voters, setVoters }) => {
  const [constituency, setConstituency] = useState({});

  

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const votersCollectionRef = collection(firestore, 'Voters');
        const votersSnapshot = await getDocs(votersCollectionRef);

        const votersData = [];
        votersSnapshot.forEach((doc) => {
          votersData.push({ id: doc.id, ...doc.data() });
        });

        setVoters(votersData);
      } catch (error) {
        console.error('Error fetching voters:', error);
      }
    };

    fetchVoters();
  }, []); 

  const handleConstituencyChange = (e, voterId) => {
    const { name, value } = e.target;
    setConstituency((prevChanges) => ({
      ...prevChanges,
      [voterId]: value,
    }));
  };

  const handleApproveVoter = async (voterId) => {
    const constituencyValue = constituency[voterId] || voters.find((voter) => voter.id === voterId)?.constituency;

    if (constituencyValue) {
      try {
        const voterDocRef = doc(firestore, 'Voters', voterId);
        await updateDoc(voterDocRef, {
          isVerified: true,
          canVote: true,
          constituency: constituency[voterId],
          // Add other fields you want to update
        });

        setVoters((prevVoters) =>
          prevVoters.map((voter) =>
            voter.id === voterId ? { ...voter, isVerified: true, canVote: true } : voter
          )
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Enter Constituency to approve the user');
    }
  };

  return (
    <div className="form-section">
      <h2>Voters</h2>
      {voters.map((voter) => (
        // Check if voter is not verified before displaying
        !voter.isVerified && (
          <div key={voter.id} className="voter-card">
            <div>
              Gov ID: {voter.govid} - Voter Name: {voter.firstname} {voter.lastname}
              <label htmlFor={`constituencyInput-${voter.id}`}>
                Constituency<span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                id={`constituencyInput-${voter.id}`}
                name={`constituency-${voter.id}`}
                value={constituency[voter.id] || voter.constituency || ''}
                onChange={(e) => handleConstituencyChange(e, voter.id)}
              />
            </div>
            <div className="voter-buttons">
              <button className="edit-button" onClick={() => handleApproveVoter(voter.id)}>
                Approve
              </button>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Voters;
