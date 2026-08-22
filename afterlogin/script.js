import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ========================================
// FIREBASE CONFIG
// ========================================

const firebaseConfig = {

    apiKey:
    "AIzaSyAj-LOc7fbr1xFs_iNxFwyULwrBUKI-r4k",

    authDomain:
    "donvai-281a0.firebaseapp.com",

    projectId:
    "donvai-281a0",

    storageBucket:
    "donvai-281a0.firebasestorage.app",

    messagingSenderId:
    "19064202332",

    appId:
    "1:19064202332:web:e97db30e47c20a6c6cb299"

};


// ========================================
// INITIALIZE FIREBASE
// ========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// ========================================
// HTML ELEMENTS
// ========================================

const loginForm =
    document.getElementById("loginForm");

const msg =
    document.getElementById("msg");


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
    "submit",
    async function(e) {

        e.preventDefault();


        const email =
            document
            .getElementById("username")
            .value
            .trim();


        const password =
            document
            .getElementById("password")
            .value;


        msg.innerText =
            "Checking login...";

        msg.style.color =
            "white";


        try {

            // ==============================
            // FIREBASE LOGIN
            // ==============================

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user = userCredential.user;

console.log("EMAIL:", user.email);
console.log("EMAIL VERIFIED:", user.emailVerified);


            

            if (!user.emailVerified) {

                // Send verification email

                await sendEmailVerification(user);


                msg.innerText =
                    "Verification email sent! Please check your inbox and verify your email.";

                msg.style.color =
                    "orange";


                // Logout until email is verified

                await signOut(auth);


                return;
            }


            // ==============================
            // EMAIL VERIFIED
            // ==============================

            msg.innerText =
                "Login successful!";

            msg.style.color =
                "lightgreen";


            // Go to protected page

            setTimeout(() => {

                window.location.href =
                    "../afterlogin/";

            }, 500);


        }


        catch(error) {

            console.error(
                "Login error:",
                error
            );


            // ==============================
            // ERROR MESSAGES
            // ==============================

            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                msg.innerText =
                    "Wrong Email or Password.";

            }

            else if (
                error.code ===
                "auth/user-not-found"
            ) {

                msg.innerText =
                    "User not found.";

            }

            else if (
                error.code ===
                "auth/wrong-password"
            ) {

                msg.innerText =
                    "Wrong Password.";

            }

            else if (
                error.code ===
                "auth/too-many-requests"
            ) {

                msg.innerText =
                    "Too many attempts. Please try again later.";

            }

            else if (
                error.code ===
                "auth/network-request-failed"
            ) {

                msg.innerText =
                    "Network error. Please check your internet.";

            }

            else {

                msg.innerText =
                    "Something went wrong. Please try again.";

            }


            msg.style.color =
                "red";

        }

    }
);
