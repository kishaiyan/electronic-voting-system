import React, { useState, useEffect } from 'react';
import { doc, updateDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import '../css/admin.css';
import Select from 'react-select';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedCandidate, setEditedCandidate] = useState({});
  const [constituencies,setConstituencies]=useState({});
  const [parties,setParties]=useState({});
  const [newCandidate, setNewCandidate] = useState({
    firstname: '',
    lastname: '',
    party: '',
    constituency: '',
    // Add other fields you want to include for a new candidate
  });
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);

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
        const constituenciesCollection = collection(firestore, 'constituency');
        const constituenciesSnapshot = await getDocs(constituenciesCollection);
        const constituenciesData = constituenciesSnapshot.docs.map((doc) => doc.data().name);
        const constituencyOptions = constituenciesData.map((constituency) => ({
          label: constituency,
          value: constituency,
        }));
        setConstituencies(constituencyOptions);
 
        const partiesCollection= collection(firestore,'party');
        const partiesSnapshot=await getDocs(partiesCollection);
        const  partiesData=partiesSnapshot.docs.map((doc)=>doc.data().name);
        const partiesOptions=partiesData.map((party)=>({
          label:party,
          value:party,
        }));
       
        setParties(partiesOptions)
       

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

  const handleAddCandidate = async (e) => {
    e.preventDefault();

    try {
      const newCandidateRef = await addDoc(collection(firestore, 'candidates'), newCandidate);
      const newCandidateData = { id: newCandidateRef.id, ...newCandidate };

      setCandidates((prevCandidates) => [...prevCandidates, newCandidateData]);
      setNewCandidate({
        firstname: '',
        lastname: '',
        party: '',
        constituency: '',
        imageURL:'',
        // Add other fields you want to include for a new candidate
      });
      setIsAddingCandidate(false);
    } catch (error) {
      console.error('Error adding new candidate:', error);
    }
  };

  return (
    <div className="form-section">
  <h2>Candidates</h2>
  {candidates.map((candidate) => (
    <div key={candidate.id} className="candidate-card">
    <img
            src={candidate.imageURL}
            alt={`Image of ${candidate.firstname} ${candidate.lastname}`}
            style={{ width: '100px', height: '100px', paddingLeft: '20px' }}
          />
      {isEditing === candidate.id ? (
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
        <div className="candidate-info">
          <div className="image-column">
           
          </div>
          <div className="details-column">
            <p>Name: {candidate.firstname} {candidate.lastname}</p>
            <p>Party: {candidate.party}</p>
            <p>Constituency: {candidate.constituency}</p>
          </div>
          <button className="edit-button" onClick={() => startEditingCandidate(candidate.id)}>
            Edit
          </button>
        </div>
      )}
    </div>
  ))}
  {isAddingCandidate ? (
    <div className="candidate-card">
      <form onSubmit={handleAddCandidate}>
      <label htmlFor="newFirstname">First Name:</label>
      <input
        type="text"
        id="newFirstname"
        value={newCandidate.firstname}
        onChange={(e) => setNewCandidate({ ...newCandidate, firstname: e.target.value })}
      />

      <label htmlFor="newLastname">Last Name:</label>
      <input
        type="text"
        id="newLastname"
        value={newCandidate.lastname}
        onChange={(e) => setNewCandidate({ ...newCandidate, lastname: e.target.value })}
      />

      <label htmlFor="newImageURL">Image Url:</label>
      <input
        type="text"
        id="newParty"
        value={newCandidate.imageURL}
        onChange={(e) => setNewCandidate({ ...newCandidate, imageURL: e.target.value })}
      />

      <label htmlFor="newConstituency">Constituency:</label>
      <Select
        value={newCandidate.constituency}
        onChange={(e)=>setNewCandidate({...newCandidate, constituency: e.target.value})}
        options={constituencies}
        isSearchable
        placeholder="Select Constituency"
      />
      <label htmlFor="newParty">Party:</label>
      
      <Select
        value={newCandidate.party}
        onChange={(e)=>setNewCandidate({...newCandidate, party: e.target.value})}
        options={parties}
        isSearchable
        placeholder="Select party"
      />
        <button type="submit">Add Candidate</button>
        <button onClick={() => setIsAddingCandidate(false)}>Cancel</button>
      </form>
    </div>
  ) : (
    <button onClick={() => setIsAddingCandidate(true)}>Add Candidate</button>
  )}
</div>

  );
  
};

export default Candidates;
