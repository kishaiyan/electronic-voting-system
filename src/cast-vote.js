import React, {useEffect, useState} from 'react';
import {createSearchParams, useNavigate} from 'react-router-dom';
import {useLocation} from "react-router-dom";
import {collection,getDocs,query,where,addDoc} from "firebase/firestore";
import {firestore} from "./config/firebase";
import {getAuth} from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import './css/cast-vote.css';
const CastVote = () =>{
    const currentUser = getAuth().currentUser;
    const [selectedSection, setSelectedSection] = useState('');
    const [voteOrderAbove, setVoteOrderAbove] = useState([]);
    const [voteOrderBelow, setVoteOrderBelow] = useState([]);
    const navigate = useNavigate();
    const [candidates,setCandidates]= useState([])
    const [party,setParties]=useState([])
    const location=useLocation()
    const searchParams =new URLSearchParams(location.search);
    const constituency = searchParams.get("constituency");

useEffect(() => {

    const fetchData = async () => {

        if (currentUser) {
            try {
                const candidatesCollectionRef = collection(firestore, "candidates");
                const q = query(candidatesCollectionRef, where("constituency", "==", constituency));
                const candidatesSnapshot = await getDocs(q);

                const candidatesData = [];
                candidatesSnapshot.forEach((doc) => {
                    candidatesData.push({ id: doc.id, ...doc.data() });
                });

                setCandidates(candidatesData);

                const partyCollectionRef=collection(firestore,"party");
                const w = await getDocs(partyCollectionRef);
                const partyData = [];
                w.forEach((doc)=>{
                    partyData.push({id: doc.id, ...doc.data()});
                });
                setParties(partyData);

            } catch (error) {
                console.error("Error fetching candidates:", error);
            }
        }
    };

    fetchData();
}, [currentUser]);

    const handleVoteSelection = (section) => {
        setSelectedSection(section);
        setVoteOrderAbove([]);
        setVoteOrderBelow([]);
    };

    const handleCheckboxChange = (e, candidateOrPartyId, candidateOrPartyName) => {
        // Determine if the section is 'above' or 'below'
        const isAbove = selectedSection === 'above';

        // Get the correct vote order array based on the section
        let currentOrder = isAbove ? voteOrderAbove : voteOrderBelow;

        // Update the vote order
        let updatedOrder;
        if (e.target.checked) {
            updatedOrder = [...currentOrder, { id: candidateOrPartyId, name: candidateOrPartyName }];
        } else {
            updatedOrder = currentOrder.filter(item => item.id !== candidateOrPartyId);
        }

        // Set the correct state based on the section
        isAbove ? setVoteOrderAbove(updatedOrder) : setVoteOrderBelow(updatedOrder);
    };



    const handleSubmitVote = async (e) => {
        e.preventDefault();
        if (selectedSection === 'above' && voteOrderAbove.length < 6) {
            alert('Please select at least 6 parties above the line.');
        } else if (selectedSection === 'below' && voteOrderBelow.length < 12) {
            alert('Please select at least 12 candidates below the line.');
        } else {
            const votes = selectedSection === 'above'
                ? voteOrderAbove.map((vote, index) => ({ name: vote.name, priority: index + 1 }))
                : voteOrderBelow.map((vote, index) => ({ name: vote.name, priority: index + 1 }));

            try {
                // Add a new document with a generated id to the "VotesParty" or "VotesCandidate" collection
                const votesCollection = selectedSection === 'above' ? "VotesParty" : "VotesCandidate";
                const docRef = await addDoc(collection(firestore, votesCollection), {
                    userId: currentUser.uid,
                    votes: votes,
                    votedAt: new Date(),
                    section: selectedSection,
                });

                console.log("Votes document written with ID: ", docRef.id);

                // Now update the `hasVoted` field for the current user
                const userDocRef = doc(firestore, "Voters", currentUser.uid); // Replace "Users" with your user collection
                await updateDoc(userDocRef, {
                    hasVoted: true
                });

                console.log("User document updated to set hasVoted true");
                alert('Thank you for your vote. Your selections have been recorded.');
                navigate('/homepage'); // Redirect to homepage or confirmation page after vote
            } catch (error) {
                console.error("Error updating document: ", error);
                alert('There was an issue recording your vote. Please try again.');
            }
        }
    };


    return (
        <div className="voting-container">
            <div className="voting-buttons">
                <button onClick={() => handleVoteSelection('above')}>Vote Above the Line</button>
                <button onClick={() => handleVoteSelection('below')}>Vote Below the Line</button>
            </div>

            {selectedSection && (
                <form onSubmit={handleSubmitVote} className="voting-form">
                    {selectedSection === 'above' ? (
                        <div className="above-the-line voting-section">
                            <h3>Above the Line</h3>
                            <div className="party-list">
                                {party.map((partyItem) => (
                                    <label key={partyItem.id} className="party-item">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => handleCheckboxChange(e, partyItem.id, partyItem.name)}
                                            checked={voteOrderAbove.some(vote => vote.id === partyItem.id)}
                                        />
                                        {partyItem.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="below-the-line voting-section">
                            <h3>Below the Line</h3>
                            <div className="candidates-grid">
                                {candidates.map((candidate) => (
                                    <div key={candidate.id} className="candidate-item">
                                        <h4>{candidate.party}</h4>
                                        <label htmlFor={`candidate-${candidate.id}`}>
                                            <input
                                                type="checkbox"
                                                id={`candidate-${candidate.id}`}
                                                onChange={(e) => handleCheckboxChange(e, candidate.id, `${candidate.firstname} ${candidate.lastname}`)}
                                                checked={voteOrderBelow.some(vote => vote.id === candidate.id)}
                                            />
                                            {candidate.firstname} {candidate.lastname}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="submit-button-container">
                        <button type="submit" className="submit-vote">Submit Vote</button>
                    </div>
                </form>
            )}
        </div>

    );
};

export default CastVote;
