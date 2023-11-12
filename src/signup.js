import React, { useState } from "react";
import { auth, firestore } from "./config/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import DatePicker from "react-datepicker";
import { doc, setDoc } from "firebase/firestore";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import './css/SignUp.css'; // Ensure this path matches the location of your CSS file

const SignUp = () => {
  const navigate = useNavigate();
  const [firstname, setFname] = useState("");
  const [lastname, setLname] = useState("");
  const [dob, setDate] = useState(new Date());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [govid, setGovid] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser);
      // Get the newly created user's UID
      const uid = userCredential.user.uid;
  
      // Store user information in Firestore
      const userRef = doc(firestore, "Voters", uid);
      await setDoc(userRef, {
        uid,
        firstname,
        lastname,
        dob,
        govid,
        canVote: true,
        hasVoted: false,
        email,
      });

      const roleRef = doc(firestore, "User", uid);
      await setDoc(roleRef, {
        email,
        role: "user",
      });

      console.log("User signed up successfully!");
      navigate("/mfa");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFname(e.target.value)}
            className="sign-up-input"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLname(e.target.value)}
            className="sign-up-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="sign-up-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="sign-up-input"
          />
          <DatePicker
            selected={dob}
            onChange={(date) => setDate(date)}
            className="date-picker"
          />
          <input
            type="text"
            name="Govid"
            placeholder="Government ID"
            value={govid}
            onChange={(e) => setGovid(e.target.value)}
            className="sign-up-input"
          />
          <button type="submit" className="sign-up-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
