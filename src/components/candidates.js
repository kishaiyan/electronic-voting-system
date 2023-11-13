import React, { useState, useEffect } from 'react';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebase';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedCandidate, setEditedCandidate] = useState({});

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidatesCollectionRef = collection(firestore, 'candidates');
        const candidatesSnapshot = await getDocs(candidatesCollectionRef);

        const candidatesData = [];
        candidatesSnapshot.forEach((doc) => {
          candidatesData.push({ id: doc.id, ...doc.data() });
        });

        setCandidates(candidatesData);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  const startEditingCandidate = (candidateId) => {
    setIsEditing(candidateId);
    setEditedCandidate({ ...candidates.find((c) => c.id === candidateId) });
  };

  const handleSaveEdit = async (e, candidateId) => {
    e.preventDefault();

    try {
      const candidateDocRef = doc(firestore, 'candidates', candidateId);
      await updateDoc(candidateDocRef, {
        firstname: editedCandidate.firstname,
        lastname: editedCandidate.lastname,
        party: editedCandidate.party,
        constituency: editedCandidate.constituency,
        // Add other fields you want to update
      });

      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.id === candidateId ? { ...candidate, ...editedCandidate } : candidate
        )
      );

      setIsEditing(null);
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  return (
    <div className="form-section">
      <h2>Candidates</h2>
      {candidates.map((candidate) => (
        <div key={candidate.id} className="candidate-card">
          {isEditing === candidate.id ? (
            <div>
            <img
                src={candidate.imageURL}
                alt={`Image of ${candidate.firstname} ${candidate.lastname}`}
                style={{ width: '100px', height: '100px', paddingLeft: '20px' }}
              />
              <form onSubmit={(e) => handleSaveEdit(e, candidate.id)}>
                <label htmlFor={`editFirstname-${candidate.id}`}>First Name:</label>
                <input
                  type="text"
                  id={`editFirstname-${candidate.id}`}
                  value={editedCandidate.firstname}
                  onChange={(e) => setEditedCandidate({ ...editedCandidate, firstname: e.target.value })}
                />

                <label htmlFor={`editLastname-${candidate.id}`}>Last Name:</label>
                <input
                  type="text"
                  id={`editLastname-${candidate.id}`}
                  value={editedCandidate.lastname}
                  onChange={(e) => setEditedCandidate({ ...editedCandidate, lastname: e.target.value })}
                />

                <label htmlFor={`editParty-${candidate.id}`}>Party:</label>
                <input
                  type="text"
                  id={`editParty-${candidate.id}`}
                  value={editedCandidate.party}
                  onChange={(e) => setEditedCandidate({ ...editedCandidate, party: e.target.value })}
                />

                <label htmlFor={`editConstituency-${candidate.id}`}>Constituency:</label>
                <input
                  type="text"
                  id={`editConstituency-${candidate.id}`}
                  value={editedCandidate.constituency}
                  onChange={(e) =>
                    setEditedCandidate({ ...editedCandidate, constituency: e.target.value })
                  }
                />

                <button type="submit">Save</button>
                <button onClick={() => setIsEditing(null)}>Cancel</button>
              </form>
            </div>
          ) : (
            <div>
            <img
                src={candidate.imageURL}
                alt={`Image of ${candidate.firstname} ${candidate.lastname}`}
                style={{ width: '100px', height: '100px', paddingLeft: '20px' }}
              />
              {candidate.firstname} {candidate.lastname} - Party: {candidate.party}, Constituency: {candidate.constituency}
              <button className="edit-button" onClick={() => startEditingCandidate(candidate.id)}>
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Candidates;
