// AddCandidateModal.js
import React from 'react';

const AddCandidateModal = ({ onClose, onSave }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Add Candidate</h2>
        <form onSubmit={onSave}>
          {/* Your input fields go here */}
          <label>
            First Name:
            <input type="text" name="firstname" />
          </label>
          <label>
            Last Name:
            <input type="text" name="lastname" />
          </label>
          <label>
            Party:
            <input type="text" name="party" />
          </label>
          <label>
            constituency: 
            <input type="text" name="constituency" />
          </label>
          <label>
            image: 
            <input type="text" name="imageURL" />
          </label>
          
          {/* Repeat for other input fields */}
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;
