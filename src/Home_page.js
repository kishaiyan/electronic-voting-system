import React, { useState, useEffect } from "react";
import { getAuth, multiFactor, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import {  doc, getDoc } from 'firebase/firestore';
import { firestore } from './config/firebase';

const Homepage = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const [isEnrolled,setIsEnrolled]= useState(false);
  const [isVerified,setIsVerified]= useState(false);

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
      console.log(authUser);
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
            });
          }
          if(authUser.emailVerified===true){
            console.log("is verified");
            setIsVerified(true);
          }
        const userMultiFactor = multiFactor(authUser);
        const enrolledFactors = userMultiFactor.enrolledFactors;
        
        if(enrolledFactors.length>0){
          console.log("isEnrolled");
          setIsEnrolled(true)}
        console.log("Is user enrolled?", enrolledFactors.length>0);
        } catch (error) {
          console.error("Error retrieving user data:", error);
        }
      }
      // Check MFA status after setting user data
      
    };

    const unsubscribe = onAuthStateChanged(auth, fetchData);

    return () => unsubscribe();
  }, []);
  const handleEnrollMFA = async () => {
    navigate("/mfa");
  };
  
  
  
  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.firstname}</h2>
          <p>Email: {user.email}</p>
          <p>Your GovId: {user.govid}</p>
          {
           isVerified ===true && isEnrolled === true ? (
            null
          ) : (
            <button onClick={handleEnrollMFA}>Enroll in MFA</button>
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