import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDocs, collection, addDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';

const Constituency = () => {
  const [constituencyData, setConstituencyData] = useState([]);
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'constituency'));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setConstituencyData(data);
      } catch (error) {
        console.error('Error fetching constituencies:', error);
      }
    };

    fetchConstituencies();
  }, [firestore]);

  const handleEditClick = (id) => {
    setEditMode(id);
  };

  const handleSaveClick = async (id, newName) => {
    try {
      // Update the name in Firestore
      const docRef = doc(firestore, 'constituency', id);
      await updateDoc(docRef, { name: newName });
      setEditMode(null);
    } catch (error) {
      console.error('Error updating constituency:', error);
    }
  };

  const handleAddConstituency = async () => {
    try {
      // Add a new constituency to Firestore
      const newConstituency = { name: 'New Constituency' }; // You can set a default name
      const docRef = await addDoc(collection(firestore, 'constituency'), newConstituency);
      
      // Fetch updated data after adding
      const querySnapshot = await getDocs(collection(firestore, 'constituency'));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setConstituencyData(data);
    } catch (error) {
      console.error('Error adding constituency:', error);
    }
  };

  return (
    <div>
      <h1>Constituency</h1>
      {constituencyData.map((constituency) => (
        <div key={constituency.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          {editMode === constituency.id ? (
            <div>
              <input
                type="text"
                value={constituency.name}
                onChange={(e) => setConstituencyData(e.target.value)}
              />
              <button onClick={() => handleSaveClick(constituency.id, constituency.name)}>Save</button>
            </div>
          ) : (
            <div>
              <h3>{constituency.name}</h3>
              <button onClick={() => handleEditClick(constituency.id)}>Edit</button>
            </div>
          )}
        </div>
      ))}
      
      <button onClick={handleAddConstituency}>Add Constituency</button>
    </div>
  );
};

export default Constituency;
