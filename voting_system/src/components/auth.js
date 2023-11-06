import { useState } from "react";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";


export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  const signUp = () => {
    // Redirect to the sign-up page when the "Sign Up" button is clicked
    //history.push("/signup"); // Make sure you have a "/signup" route in your React Router configuration.
  };

  return (
    <div>
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>Sign In</button>
      <button onClick={logout}>Log out</button>
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
};
