import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {getAuth,
getMultiFactorResolver,
PhoneAuthProvider,
PhoneMultiFactorGenerator,
RecaptchaVerifier,
signInWithEmailAndPassword} from "firebase/auth";
import './css/Login.css';
import { getFirestore,getDoc,doc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp,setOtp]= useState("");
  const [otpsent,setOtpsent]=useState(false);
  const [verificationId,setVerificationId]=useState("");
  const [resolver,setResolver]=useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      
      // Initialize Firebase Auth
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        navigate("/adminview");
      } catch (err) {
        if (err.code === 'auth/multi-factor-auth-required') {
          const resolver = getMultiFactorResolver(auth, err);
          
          if (resolver.hints[0].factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
            const phoneInfoOptions = {
              multiFactorHint: resolver.hints[0],
              session: resolver.session
            };
            const phoneAuthProvider = new PhoneAuthProvider(auth);
  
            // Verify OTP after user enters it
            const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptcha);
            setOtpsent(true);
            setVerificationId(verificationId);
            setResolver(resolver);
          }
        }
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };
  
  const verifyOTP = async () => {
    try {
      // Verify the OTP using the confirmation object

      const cred = PhoneAuthProvider.credential(
        verificationId, otp);
    const multiFactorAssertion =
        PhoneMultiFactorGenerator.assertion(cred);
    // Complete sign-in.
     resolver.resolveSignIn(multiFactorAssertion)
     const userDocRef=doc(getFirestore(),"User",auth.currentUser.uid);
     const userdoc=await getDoc(userDocRef);
     if (userdoc.exists()) {
      const userRole = userdoc.data().role;

      // Check the user's role and navigate accordingly
      if (userRole === "admin") {
        console.log("User is an admin. Navigating to admin view.");
        navigate("/adminview");
      } else {
        console.log("User is a regular user. Navigating to homepage.");
        navigate("/homepage");
      }
    } else {
      console.error("User document not found.");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
  }
};
return (
  <div className="page-container">
  <div className="login-container">
    <div className="login-card">
      <h2>Electronic Voting System</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button className="login-button green" type="submit">Log In</button>
        <p className="forgot-password-link">
          <Link to={"/forgot-password"}>Forgot Password?</Link>
        </p>
        <div id="recaptcha" className="recaptcha"></div>
        {otpsent && (
          <div>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="login-input"
            />
            <button onClick={verifyOTP} className="otp-button">Verify OTP</button>
          </div>
        )}
        {!otpsent && (
          <p className="signup-link">
            Don't have an account? <Link to={"/signup"}>Sign Up</Link>
          </p>
        )}
      </form>
    </div>
  </div>
</div>

);
};

export default Login;

