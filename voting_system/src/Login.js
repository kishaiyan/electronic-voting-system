import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, MultiFactorAssertion} from "firebase/auth";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Initialize Firebase Auth
      const auth = getAuth();

      // Sign in the user with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // User is now logged in, you can redirect to a different page or show a success message
      console.log("User logged in successfully!");
      navigate("/homepage");
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log In</button>
        <Link to={"/signup"}>SignUp</Link>
      </form>
    </div>
  );
};

export default Login;
