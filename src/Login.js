import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {getAuth,
getMultiFactorResolver,
PhoneAuthProvider,
PhoneMultiFactorGenerator,
RecaptchaVerifier,
signInWithEmailAndPassword} from "firebase/auth";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp,setOtp]= useState("");
  const [otpsent,setOtpsent]=useState(false);
  const [verificationId,setVerificationId]=useState("");
  const [resolver,setResolver]=useState("");
  const [confirmation,setConfirmation]=useState("");
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const auth = getAuth();
      // Initialize Firebase Auth
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
       
        navigate("/homepage");
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
      // Redirect to the homepage or any other desired page
      console.log("User Logged in successfully");
      navigate("/homepage");
    } catch (error) {
      console.error("Error verifying OTP:", error);
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
        <div id="recaptcha"></div>
        {otpsent?<div><input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e)=> setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verifyotp</button></div>
          :
          
          <Link to={"/signup"}>SignUp</Link>}
        
      </form>
    </div>
  );
};

export default Login;