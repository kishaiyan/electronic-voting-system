import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithPhoneNumber,  RecaptchaVerifier,  } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import {  doc, getDoc } from 'firebase/firestore';
import { firestore } from './config/firebase';
import { auth } from './config/firebase';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


const OTPverification=()=>{
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [phone,setPhone] =useState("");
  const [isVerified, setVerify]=useState(false);
  const [otp, setOtp] = useState("");
  const [seotp, setSeotp]= useState(false);
  const [confirmationResult,setConfirmationResult]=useState("");
  const [userID,setUserID]=useState("");
  useEffect(() => {
    const auth = getAuth();

    const fetchData = async (authUser) => {
      if (authUser) {
        setUserID(authUser.uid);
        setUser(userID);
        console.log('User UID:', authUser.uid); 
        try {
          // Retrieve additional user data from Firestore
          const userDocRef = doc(firestore, 'Voters', authUser.uid);
          
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // Assuming you have a 'firstname' field in your Firestore document
            const userData = userDoc.data();
          
            setUser((prevUser) => ({ ...prevUser,phno:userData.phoneNumber}));
          }
        } catch (error) {
          console.error("Error retrieving user data:", error);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, fetchData);

    return () => unsubscribe();
  }, []);
  const sendOtp = async () =>{
   
    try {
    
    const captcha= new RecaptchaVerifier(auth,"recaptcha",{})
    const confirmation = await signInWithPhoneNumber(auth,phone,captcha)
    setSeotp(true);
    setConfirmationResult(confirmation);
    
   
    } catch (error) {
      console.log(error);
    }
    
  }
  function verifyPhone() {
    const number = parseInt(phone);
    setVerify(true);
  
  /*  if (user.phno === number) { // Convert number to string for comparison
     
      setVerify(true);
    }
    else{
      console.log(isVerified);
    }*/
  }
  const verifyOTP = () => {
    if (confirmationResult) {
      const code = otp;
      confirmationResult.confirm(code)
        .then((userCredential) => {
          //setUser(userID);
          console.log('Phone number verified:', user.phoneNumber);
          navigate("/homepage");
        })
        .catch((error) => {
          console.error('Error confirming OTP:', error);
        });
    } else {
      console.error('ConfirmationResult is not available. Make sure to send OTP first.');
    }
  };
  
  const handleKeyPress = (e) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);

    // Allow only numeric values (0-9) and the Backspace key (keyCode 8)
    if (!/^\d$/.test(keyValue) && keyCode !== 8) {
      e.preventDefault();
    }
  };
  return (
    <div>
     
    <div>
    <PhoneInput
        country={"au"}
        value={phone}
        onChange={(value) => setPhone("+"+value)}
        inputProps={{ readOnly: isVerified }} // Set the input as readOnly when isVerified is true
        placeholder={isVerified ? phone : 'Enter your phone number'} // Use the phone number as a placeholder after verification // Use the `value` parameter to update `phone` state
    />
    {isVerified ? (
      <div><button onClick={sendOtp}>Send OTP</button>
      <div id="recaptcha"></div>
      <div>
      <input
       type="text"
       placeholder="Enter your OTP"
       
       onChange={(e)=>setOtp(e.target.value)}
      />
      {
        seotp ? (
          <button onClick={verifyOTP}>Verify OTP</button>
        ):
        null
      }
      </div>
      </div>
    ) : (
      <button onClick={verifyPhone}>Verify</button>
    )}
  </div>
    </div>
   
  
  );
}
export default OTPverification;