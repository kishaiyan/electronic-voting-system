import React, { useState, useEffect } from 'react';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebase';

const Parties = () => {
  const [parties, setParties] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedParty, setEditedParty] = useState({});

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const partiesCollectionRef = collection(firestore, 'party');
        const partiesSnapshot = await getDocs(partiesCollectionRef);

        const partiesData = [];
        partiesSnapshot.forEach((doc) => {
          partiesData.push({ id: doc.id, ...doc.data() });
        });

        setParties(partiesData);
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };

    fetchParties();
  }, []);

  const startEditingParty = (partyId) => {
    setIsEditing(partyId);
    setEditedParty({ ...parties.find((p) => p.id === partyId) });
  };

  const handleSaveEditParty = async (e, partyId) => {
    e.preventDefault();

    try {
      const partyDocRef = doc(firestore, 'party', partyId);
      await updateDoc(partyDocRef, {
        name: editedParty.name,
        // Add other fields you want to update
      });

      setParties((prevParties) =>
        prevParties.map((party) => (party.id === partyId ? { ...party, ...editedParty } : party))
      );

      setIsEditing(null);
    } catch (error) {
      console.error('Error updating party:', error);
    }
  };

  return (
    <div className="form-section">
      <h2>Parties</h2>
      {parties.map((party) => (
        <div key={party.id} className="party-card">
          {isEditing === party.id ? (
            <div>
              <form onSubmit={(e) => handleSaveEditParty(e, party.id)}>
                <label htmlFor={`editParty-${party.id}`}>Party:</label>
                <input
                  type="text"
                  id={`editParty-${party.id}`}
                  value={editedParty.name}
                  onChange={(e) => setEditedParty({ ...editedParty, name: e.target.value })}
                />

                <button type="submit">Save</button>
                <button onClick={() => setIsEditing(null)}>Cancel</button>
              </form>
            </div>
          ) : (
            <div>
              Party Name: {party.name}
              <button onClick={() => startEditingParty(party.id)}>Edit</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Parties;
