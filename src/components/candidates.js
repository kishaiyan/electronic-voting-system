import React, { useState, useEffect } from 'react';
import { doc, updateDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import '../css/admin.css';
import Select from 'react-select';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedCandidate, setEditedCandidate] = useState({});
  const [constituencies, setConstituencies] = useState([]);
  const [parties, setParties] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    firstname: '',
    lastname: '',
    party: '',
    constituency: '',
    imageURL: '', // Add other fields as necessary
  });
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidatesCollectionRef = collection(firestore, 'candidates');
        const candidatesSnapshot = await getDocs(candidatesCollectionRef);
        const candidatesData = candidatesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setCandidates(candidatesData);

        const constituenciesCollection = collection(firestore, 'constituency');
        const constituenciesSnapshot = await getDocs(constituenciesCollection);
        const constituenciesData = constituenciesSnapshot.docs.map((doc) => ({ label: doc.data().name, value: doc.data().name }));
        setConstituencies(constituenciesData);

        const partiesCollection = collection(firestore, 'party');
        const partiesSnapshot = await getDocs(partiesCollection);
        const partiesData = partiesSnapshot.docs.map((doc) => ({ label: doc.data().name, value: doc.data().name }));
        setParties(partiesData);

      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  const startEditingCandidate = (candidateId) => {
    const candidateToEdit = candidates.find((c) => c.id === candidateId);
    setIsEditing(candidateId);
    setEditedCandidate({ 
      ...candidateToEdit,
      constituency: constituencies.find(option => option.value === candidateToEdit.constituency),
      party: parties.find(option => option.value === candidateToEdit.party)
    });
  };

  const handleSaveEdit = async (e, candidateId) => {
    e.preventDefault();
    const updatedInfo = {
      firstname: editedCandidate.firstname,
      lastname: editedCandidate.lastname,
      party: editedCandidate.party.value,
      constituency: editedCandidate.constituency.value,
      imageURL: editedCandidate.imageURL, // Include other fields as necessary
    };

    try {
      const candidateDocRef = doc(firestore, 'candidates', candidateId);
      await updateDoc(candidateDocRef, updatedInfo);

      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.id === candidateId ? { ...candidate, ...updatedInfo } : candidate
        )
      );

      setIsEditing(null);
      setEditedCandidate({});
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      // Ensure that the 'value' property is used for Select components
      const candidateToAdd = {
        ...newCandidate,
        party: newCandidate.party.value,
        constituency: newCandidate.constituency.value,
      };
  
      // Add the new candidate to Firestore
      const newCandidateRef = await addDoc(collection(firestore, 'candidates'), candidateToAdd);
      const newCandidateData = { id: newCandidateRef.id, ...candidateToAdd };
  
      // Update the state with the new candidate
      setCandidates((prevCandidates) => [...prevCandidates, newCandidateData]);
      
      // Reset the form
      setNewCandidate({
        firstname: '',
        lastname: '',
        party: '',
        constituency: '',
        imageURL: '', // reset other fields as necessary
      });
      setIsAddingCandidate(false);
    } catch (error) {
      console.error('Error adding new candidate:', error);
    }
  };
  
  const handleConstituencyChange = (selectedOption) => {
    setNewCandidate(prevState => ({
      ...prevState,
      constituency: selectedOption
    }));
  };

  const handlePartyChange = (selectedOption) => {
    setNewCandidate(prevState => ({
      ...prevState,
      party: selectedOption
    }));
  };

  const handleEditConstituencyChange = (selectedOption) => {
    setEditedCandidate(prevState => ({
      ...prevState,
      constituency: selectedOption
    }));
  };

  const handleEditPartyChange = (selectedOption) => {
    setEditedCandidate(prevState => ({
      ...prevState,
      party: selectedOption
    }));
  };

  // JSX for rendering the candidates and the forms
  return (
    <div className="form-section">
      <h2>Candidates</h2>
      <div className="header-section">
        {!isAddingCandidate && (
          <button onClick={() => setIsAddingCandidate(true)}>Add Candidate</button>
        )}
      </div>
      <div className="candidates-container">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="candidate-card">
            <div className="candidate-content">
              <img
                src={candidate.imageURL}
                alt={`Image of ${candidate.firstname} ${candidate.lastname}`}
                className="candidate-image"
              />
              <div className="candidate-info">
                <p>Name: {candidate.firstname} {candidate.lastname}</p>
                <p>Party: {candidate.party}</p>
                <p>Constituency: {candidate.constituency}</p>
              </div>
              <button className="edit-button" onClick={() => startEditingCandidate(candidate.id)}>
                Edit
              </button>
            </div>
            {isEditing === candidate.id && (
              <div className="edit-candidate-container">
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
                  <Select
                    id={`editParty-${candidate.id}`}
                    value={editedCandidate.party}
                    onChange={handleEditPartyChange}
                    options={parties}
                    isSearchable
                    placeholder="Select Party"
                  />

                  <label htmlFor={`editConstituency-${candidate.id}`}>Constituency:</label>
                  <Select
                    id={`editConstituency-${candidate.id}`}
                    value={editedCandidate.constituency}
                    onChange={handleEditConstituencyChange}
                    options={constituencies}
                    isSearchable
                    placeholder="Select Constituency"
                  />

                  <button type="submit">Save</button>
                  <button onClick={() => setIsEditing(null)}>Cancel</button>
                </form>
              </div>
            )}
          </div>
        ))}
        {isAddingCandidate && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <h3>Add New Candidate</h3>
                <button onClick={() => setIsAddingCandidate(false)} className="close-button">&times;</button>
              </div>
              <form onSubmit={handleAddCandidate} className="modal-body">
                <div className="form-group">
                  <label htmlFor="newFirstname">First Name:</label>
                  <input
                    type="text"
                    id="newFirstname"
                    value={newCandidate.firstname}
                    onChange={(e) => setNewCandidate({ ...newCandidate, firstname: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newLastname">Last Name:</label>
                  <input
                    type="text"
                    id="newLastname"
                    value={newCandidate.lastname}
                    onChange={(e) => setNewCandidate({ ...newCandidate, lastname: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newImageURL">Image URL:</label>
                  <input
                    type="text"
                    id="newImageURL"
                    value={newCandidate.imageURL}
                    onChange={(e) => setNewCandidate({ ...newCandidate, imageURL: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newConstituency">Constituency:</label>
                  <Select
                    id="newConstituency"
                    value={newCandidate.constituency}
                    onChange={handleConstituencyChange}
                    options={constituencies}
                    isSearchable
                    placeholder="Select Constituency"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newParty">Party:</label>
                  <Select
                    id="newParty"
                    value={newCandidate.party}
                    onChange={handlePartyChange}
                    options={parties}
                    isSearchable
                    placeholder="Select Party"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-button">Add Candidate</button>
                  <button onClick={() => setIsAddingCandidate(false)} className="cancel-button">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
