import React, { useState, useEffect } from "react";
import { RecaptchaVerifier, getAuth, onAuthStateChanged, PhoneAuthProvider, multiFactor, PhoneMultiFactorGenerator } from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from 'react-router-dom';

const MFA = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [phone,setPhone]=useState("");
  const [confirmation,setConfirmation]=useState(null);
  const [otp,setOtp]=useState("");
  const [emailverified,setEmailVerified]=useState(false);
  const navigate = useNavigate();
  // Initialize Firebase Auth
  const auth = getAuth();
  const PhoneAuth = new PhoneAuthProvider(auth);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // A user is signed in.
        setCurrentUser(user);
        setEmailVerified(user.emailVerified);
      } else {
        // No user is signed in.
        setCurrentUser(null);
      }
    });

    // Remember to unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [auth]);
  const sendOtp = async () => {
    try {
       const captcha = new RecaptchaVerifier(auth, "recaptcha", {});

   
       const session = await multiFactor(currentUser).getSession();
       const phoneInfo = {
         phoneNumber: phone,
         session: session,
       };
       const confirmationResult = await PhoneAuth.verifyPhoneNumber(phoneInfo,captcha)
       setConfirmation(confirmationResult);
       }
     catch (error) {
       console.error(error);
    }
   };
   const verifyOTP = async () => {
    try {
      // Use PhoneAuthProvider.credential to create the credentials
      const phoneAuthCredentials = PhoneAuthProvider.credential(confirmation, otp);
      
      // Use the credentials to enroll in multi-factor authentication
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredentials);
      await multiFactor(currentUser).enroll(multiFactorAssertion);
      
      console.log("Enrolled successfully");
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    emailverified ? (
      <div>
        <h2>Enroll in Multi-Factor Authentication</h2>
        {currentUser ? (
          <div>
            <div><p>User Email: {currentUser.email}</p></div>
            <div>
              <PhoneInput
                country={"au"}
                value={phone}
                onChange={(e) => setPhone("+" + e)}
              />
            </div>
            <div>
              <button onClick={sendOtp}>Verify</button>
              <div id="recaptcha"></div>
            </div>
            {confirmation != null ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={verifyOTP}>Verify OTP</button>
              </div>
            ) : null}
          </div>
        ) : (
          <p>No user is signed in.</p>
        )}
        {/* Add your MFA form or content here */}
      </div>
    ) : (<div> Verify Your Email To Proceed</div>)
  );
  
};

export default MFA;
