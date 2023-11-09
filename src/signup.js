import React, { useState } from "react";
import { auth, firestore } from "./config/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import DatePicker from "react-datepicker";
import { collection, doc, setDoc } from "firebase/firestore";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom"; // Import the CSS

const SignUp = () => {
  const navigate = useNavigate();
  const [firstname, setFname] = useState("");
  const [lastname, setLname] = useState("");
  const [dob, setDate] = useState(new Date());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [govid, setGovid] = useState("");
  const [phno, setPhno]=useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const canVote=true;
      const hasVoted=false;
      await sendEmailVerification(auth.currentUser);
      // Get the newly created user's UID
      const uid = userCredential.user.uid;
  
      // Store user information in Firestore
      const userRef = doc(firestore, "Voters", uid);
      await setDoc(userRef,{
        firstname,
        lastname,
        dob,
        govid,
        canVote,
        hasVoted,
        email, // Replace with the actual Government ID
      });
  
      // Redirect to a different page or show a success message
      console.log("User signed up successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error.message);
      if(error.response){
        console.log("Response data:", error.response.data);
      }
    }
    
  };
  

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFname(e.target.value)}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLname(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <DatePicker
          selected={dob}
          onChange={date => setDate(date)}
        />
        <input
          type="text"
          name="Govid"
          placeholder="Government ID"
          onChange={(e)=> setGovid(e.target.value)}// Update with the real Government ID
        />
       
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;