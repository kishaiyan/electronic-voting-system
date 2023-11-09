import React, { useState, useEffect } from "react";
import { getAuth, multiFactor, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from './config/firebase';
import { Verify } from "crypto-browserify";


const Homepage = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const [currentUser, setCurrentuser]=useState("");

  // Function to handle signing out
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

  useEffect(() => {
    const auth = getAuth();
    
    const fetchData = async (authUser) => {
      if (authUser) {
        setCurrentuser(authUser);
        console.log(authUser);
        try {
          // Retrieve additional user data from Firestore
          const userDocRef = doc(firestore, 'Voters', authUser.uid);
          
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // Assuming you have a 'firstname' field in your Firestore document
            const userData = userDoc.data();
            console.log(userData);
            setUser((prevUser) => ({ ...prevUser, firstname: userData.firstname ,email:userData.email,govid:userData.govid}));
          }
        } catch (error) {
          console.error("Error retrieving user data:", error);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, fetchData);

    return () => unsubscribe();
  }, []);
  const handleEnrollMFA = async () => {
    navigate("/mfa");
  };
  const verifyifuserisenrolled=()=>{
    const enrolled=multiFactor(user).enrolledFactors;
    return enrolled > 0;
  }
  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.firstname}</h2>
          <p>Email: {user.email}</p>
          <p>Your GovId: {user.govid}</p>
          {user.emailVerified && !verifyifuserisenrolled() ? (
            <button onClick={handleEnrollMFA}>Enroll in MFA</button>
          ) : (
            null
          )}
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