import React, { useState } from "react";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import OtpInput from "otp-input-react";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { toast, Toaster } from 'react-hot-toast';
import { CgSpinner } from "react-icons/cg";

const App = () => {
  const [ph, setPh] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Validations
  const nameRegex = /^[A-Za-z ]{10,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const usernameRegex = /^[a-zA-Z0-9!@#$%^&*]{3,}$/;

  function validateForm() {
    if (!fullName.match(nameRegex)) {
      toast.error("Full Name should be 10-15 characters long and contain only alphabets.");
      return false;
    }
    if (!email.match(emailRegex)) {
      toast.error("Invalid email format.");
      return false;
    }
    if (!username.match(usernameRegex)) {
      toast.error("Username can contain letters, numbers, and special characters (!@#$%^&*) and must be at least 3 characters long.");
      return false;
    }
    return true;
  }

  function onCaptchaVerify() {
    if (!window.RecaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        callback: (response) => {
          onSignup();
        },
        'expired-callback': () => { }
      }, auth);
    }
  }

  function onSignup() {
    if (!validateForm()) return;

    setLoading(true);
    onCaptchaVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult.confirm(otp).then(async (res) => {
      console.log(res);
      setUser(res.user);
      setLoading(false);
    }).catch(err => {
      console.log(err);
      toast.error("Invalid OTP, please try again!");
      setLoading(false);
    });
  }

  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen bg-custom-bg bg-cover bg-center">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {
          user ? (
            <h2 className="text-center text-white font-medium text-7xl ">You Logged in Successfully!</h2>
          ) : (
            <div className="w-96 flex flex-col gap-4 rounded-lg p-4">
              <h1 className="text-center leading-normal text-white font-medium text-4xl mb-6">
                {showOTP ? "Verify OTP" : "Register Here"}
              </h1>
              {showOTP ? (
                <>
                  <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                    <BsFillShieldLockFill size={30} />
                  </div>
                  <label htmlFor="ph" className="font-bold text-xl text-white text-center">
                    Enter your OTP
                  </label>
                  <OtpInput value={otp} onChange={setOtp} OTPLength={6} otpType="number" disabled={false} autoFocus className="opt-container"></OtpInput>
                  <button onClick={onOTPVerify} className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded">
                    {loading && <CgSpinner size={20} className="mt-1 animate-spin"></CgSpinner>}
                    <span>Verify OTP</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="font-bold text-xl text-white text-center">
                    <form>
                      <input placeholder="Full Name" className="mb-2 p-2.5 rounded text-gray-700 font-medium text-sm w-full" value={fullName} onChange={(e) => setFullName(e.target.value)}></input>
                      <input placeholder="Email" className="mb-2 p-2.5 rounded text-gray-700 font-medium text-sm w-full" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                      <input placeholder="Username" className="mb-2 p-2.5 rounded text-gray-700 font-medium text-sm w-full" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                      <input type="password" placeholder="Password" className="mb-2 p-2.5 rounded font-medium text-gray-700 text-sm w-full" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </form>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="bg-white text-emerald-500 p-2 rounded-full">
                      <BsTelephoneFill size={10} />
                    </div>
                    <label htmlFor="ph" className="font-bold text-sm text-white text-center">
                      Verify your Phone number
                    </label>
                  </div>
                  <PhoneInput country={"in"} value={ph} onChange={setPh} />
                  <button onClick={onSignup} className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded">
                    {loading && <CgSpinner size={20} className="mt-1 animate-spin"></CgSpinner>}
                    <span>Send code via SMS</span>
                  </button>
                </>
              )}
            </div>
          )
        }
      </div>
    </section>
  );
}

export default App
