import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import Select from 'react-select';
import '../css/admin.css';

const Voters = ({ voters, setVoters }) => {
  const [constituency, setConstituency] = useState([]);
  const [selectedConstituencies, setSelectedConstituencies] = useState({});
  const [curr, setCurr] = useState({});

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const votersCollectionRef = collection(firestore, 'Voters');
        const constituencyColRef = collection(firestore, 'constituency');

        const constituencySnap = await getDocs(constituencyColRef);
        const votersSnapshot = await getDocs(votersCollectionRef);

        const votersData = [];
        votersSnapshot.forEach((doc) => {
          votersData.push({ id: doc.id, ...doc.data() });
        });

        setVoters(votersData);

        const constituenciesData = constituencySnap.docs.map((doc) => doc.data().name);
        const constituencyOptions = constituenciesData.map((constituency) => ({
          label: constituency,
          value: constituency,
        }));
        setConstituency(constituencyOptions);
      } catch (error) {
        console.error('Error fetching voters:', error);
      }
    };

    fetchVoters();
  }, [setVoters]);

  const handleConstituencyChange = (selectedConstituency, voterId) => {
    setCurr(selectedConstituency);
    setSelectedConstituencies((prevChanges) => ({
      ...prevChanges,
      [voterId]: selectedConstituency,
    }));
  };

  const handleApproveVoter = async (voterId) => {
    const constituencyValue = curr;

    if (constituencyValue) {
      try {
        const voterDocRef = doc(firestore, 'Voters', voterId);
        await updateDoc(voterDocRef, {
          isVerified: true,
          canVote: true,
          constituency: curr.value,
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
    <div className="box-container-voter">
      <h2>Voters list to be Approved</h2>
      {voters.map((voter) => (
        // Check if voter is not verified before displaying
        !voter.isVerified && (
          <div key={voter.id} className="box-voter">
            <div className="voter-info">
              <div>
                <p>Gov ID: {voter.govid}</p>
                <p>Voter Name: {voter.firstname} {voter.lastname}</p>
              </div>
              <div>
                <label htmlFor={`constituencyInput-${voter.id}`}>
                  Constituency<span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  placeholder={curr.value || 'Select Constituency'} // Display the selected constituency or a default message
                  id={`constituencyInput-${voter.id}`}
                  name={`constituency-${voter.id}`}
                  options={constituency}
                  value={selectedConstituencies[voter.id]}
                  onChange={(selectedOption) => handleConstituencyChange(selectedOption, voter.id)}
                />
              </div>
            </div>
            <div className='approve-button'>
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
