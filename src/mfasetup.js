import React, { useState, useEffect } from "react";
import {
  getAuth,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from "firebase/auth";
import OtpInput from 'react-otp-input';

const MfaSetup = ({ navigate }) => {
  const [confirmation, setConfirmation] = useState(null);
  const [otp, setOtp] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [resolver, setResolver] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const auth = getAuth();
  const phoneAuthProvider = new PhoneAuthProvider(auth);
  const [captcha, setRecaptcha] = useState(null);
  const error='auth/multi-factor-auth-required';

  useEffect(() => {
    const captcha = new RecaptchaVerifier(auth, "recaptcha", {});
    setRecaptcha(captcha);
    const fetchUserData = async () => {
      const user = auth.currentUser;
      const userPhone = user.phoneNumber;
      setUserPhone(userPhone);
      console.log(user);
      console.log(userPhone);
    };

    fetchUserData();
  }, [auth]);

  const verifyUserMFA = async () => {
    try {
      console.log("here")
      const resolver = getMultiFactorResolver(auth,error);

      if (resolver && resolver.hints && resolver.hints[selectedIndex]?.factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
        const phoneInfoOptions = {
          multiFactorHint: resolver.hints[selectedIndex],
          session: resolver.session
        };
  
        const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, captcha);
        setVerificationId(verificationId);
        setResolver(resolver);
        setConfirmation(resolver.resolveSignIn(verificationId));
      } else {
        // Handle other factors or scenarios
        console.error("Unsupported factor or resolver is undefined.");
      }
    } catch (error) {
      console.error("Error verifying user MFA:", error);
    }
  };
  

  const sendOtp = async () => {
    try {
      await verifyUserMFA();
    } catch (err) {
      console.error("Error sending OTP:", err);
    }
  };

  const verifyOTP = async () => {
    try {
      // Verify the OTP using the confirmation object
      await confirmation.confirm(otp);
      console.log("Multi-factor authentication verified successfully!");
      // Redirect to the homepage or any other desired page
      navigate("/homepage");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div>
      <h2>Multi-factor authentication</h2>
      <div>
        <p>Phone Number: {userPhone}</p>
      </div>
      <div>
        <button onClick={sendOtp}>Send OTP</button>
        <div id="recaptcha"></div>
      </div>
      {confirmation !== null && (
        <div>
          <OtpInput
            value={otp}
            onChange={(otp) => setOtp(otp)}
            numInputs={6}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default MfaSetup;
