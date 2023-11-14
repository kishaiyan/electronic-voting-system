import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from './config/firebase';
import './css/homepage.css';

const Homepage = () => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  let logoutTimeout;

  const resetTimer = () => {
    clearTimeout(logoutTimeout);
    logoutTimeout = setTimeout(() => {
      handleSignOut();
    }, 300000); // 5 minutes in milliseconds
  };

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setUser(null);
        console.log("User logged off");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleCastVote = () => {
    navigate(`/cast-vote?constituency=${user.constituency}`);
  };

  useEffect(() => {
    const auth = getAuth();

    const fetchData = async (authUser) => {
      setIsLoading(true);
      setError(null);

      if (authUser) {
        try {
          const userDocRef = doc(firestore, 'Voters', authUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              firstname: userData.firstname,
              email: userData.email,
              govid: userData.govid,
              isVerified: userData.isVerified,
              canVote: userData.canVote,
              hasVoted: userData.hasVoted,
              constituency: userData.constituency,
            });
          }
          setIsLoading(false);
        } catch (error) {
          setError(error);
        }
      }
    };

    const userActivityHandler = () => {
      resetTimer(); // Reset the timer on user activity
    };

    const unsubscribe = onAuthStateChanged(auth, fetchData);

    // Attach event listeners to track user activity
    window.addEventListener('mousemove', userActivityHandler);
    window.addEventListener('keydown', userActivityHandler);

    // Initial setup
    resetTimer();

    return () => {
      // Clean up event listeners and timers when the component is unmounted
      window.removeEventListener('mousemove', userActivityHandler);
      window.removeEventListener('keydown', userActivityHandler);
      clearTimeout(logoutTimeout);
    };
  }, []);

  return (
    <div className="homepage-container">
      {user ? (
        <div>
          <h2>Welcome, {user.firstname} {user.lastname}</h2>
          <p>Your GovId: {user.govid}</p>
          {user.isVerified ? (
            user.canVote && !user.hasVoted ? (
              <div>
                <p>You are now eligible to cast your vote.</p>
                <button onClick={handleCastVote}>Cast Vote</button>
              </div>
            ) : (
              <p> You are not eligible to Vote</p>
            )
          ) : <p>Your profile is under verification</p>}
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
        </div>
      )}
    </div>
  );
};

export default Homepage;
