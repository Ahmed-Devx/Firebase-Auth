import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

var firstBox = document.getElementsByClassName("signup-card")[0];
var secondBox = document.getElementsByClassName("login-card")[0];
var thirddBox = document.getElementsByClassName("number-card")[0];

document.querySelector("#pagechangelogin").addEventListener("click", () => {
  firstBox.style.display = "none";
  secondBox.style.display = "block";
});
document.querySelector("#pagechangesignup").addEventListener("click", () => {
  firstBox.style.display = "block";
  secondBox.style.display = "none";
});
document.querySelector("#signup-number").addEventListener("click", () => {
  firstBox.style.display = "none";
  secondBox.style.display = "none";
  thirddBox.style.display = "block";
});
document.querySelector("#signup-email").addEventListener("click", () => {
  firstBox.style.display = "block";
  secondBox.style.display = "none";
  thirddBox.style.display = "none";
});

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: " ",
  appId: " ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function signup() {
  const email = document.querySelector("#signupEmail").value;
  const password = document.querySelector("#signupPassword").value;

  if (!email || !password) {
    Swal.fire({
      icon: "warning",
      title: "Empty Fields",
      text: "Please fill all fields",
      confirmButtonColor: "#764ba2",
    });
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Welcome to our platform.",
        confirmButtonColor: "#764ba2",
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Signup Error",
        text: error.message,
        confirmButtonColor: "#764ba2",
      });
    });
}
document.querySelector("#signup").addEventListener("click", signup);

function login() {
  const email = document.querySelector("#loginEmail").value;
  const password = document.querySelector("#loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Glad to see you back!",
        timer: 2000,
        showConfirmButton: false,
      });
      firstBox.style.display = "block";
      secondBox.style.display = "none";
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonColor: "#764ba2",
      });
    });
}
document.querySelector("#login").addEventListener("click", login);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in user:", user);
  }
});

function forgotPassword() {
  const email = document.querySelector("#loginEmail").value;
  if (!email) {
    Swal.fire({
      icon: "question",
      title: "Email Required",
      text: "Please enter your email in the login field first.",
      confirmButtonColor: "#764ba2",
    });
    return;
  }
  sendPasswordResetEmail(auth, email)
    .then(() => {
      Swal.fire({
        icon: "info",
        title: "Email Sent",
        text: "Check your inbox for the reset link.",
        confirmButtonColor: "#764ba2",
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#764ba2",
      });
    });
}
document
  .querySelector("#forgotPassword")
  .addEventListener("click", forgotPassword);

function logout() {
  signOut(auth)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Signed Out",
        text: "See you again soon!",
        timer: 1500,
        showConfirmButton: false,
      });
    })
    .catch((error) => {
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    });
}
document
  .querySelectorAll("#logout")
  .forEach((btn) => btn.addEventListener("click", logout));

// --- Phone Auth Logic ---
window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
  size: "invisible",
});

function onSignInSubmit() {
  const phoneNumber = document.getElementById("phone").value;
  const appVerifier = window.recaptchaVerifier;

  Swal.fire({
    title: "Sending SMS...",
    didOpen: () => {
      Swal.showLoading();
    },
  });

  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: "Please check your phone.",
      });
      window.confirmationResult = confirmationResult;
    })
    .catch((error) => {
      Swal.fire({ icon: "error", title: "SMS Failed", text: error.message });
    });
}
document
  .getElementById("sign-in-button")
  .addEventListener("click", onSignInSubmit);

document.getElementById("verifyBtn").addEventListener("click", () => {
  const code = document.getElementById("otp").value;
  confirmationResult
    .confirm(code)
    .then((result) => {
      Swal.fire({
        icon: "success",
        title: "Verified!",
        text: "Phone authentication successful.",
      });
    })
    .catch((error) => {
      Swal.fire({ icon: "error", title: "Invalid OTP", text: error.message });
    });
});

// --- Google Auth ---
function google() {
  signInWithPopup(auth, provider)
    .then((result) => {
      Swal.fire({
        icon: "success",
        title: "Google Login",
        text: "Authenticated successfully!",
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Google Auth Failed",
        text: error.message,
      });
    });
}
document
  .querySelectorAll("#googleLogin")
  .forEach((btn) => btn.addEventListener("click", google));
