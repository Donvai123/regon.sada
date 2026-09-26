import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "donvai-281a0.firebaseapp.com",
    projectId: "donvai-281a0",
    storageBucket: "donvai-281a0.firebasestorage.app",
    messagingSenderId: "19064202332",
    appId: "1:19064202332:web:d50c02838f285b4c6cb299",
    measurementId: "G-F8B777GL1B"
};


// Firebase start
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);


// Error show function
function showError(message) {
    const errorDiv = document.getElementById("errorMessage");

    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
    }
}


// Login
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.log("loginForm not found");
        return;
    }


    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const emailElement = document.getElementById("email");
        const passwordElement = document.getElementById("password");


        if (!emailElement || !passwordElement) {
            showError("Email or password field not found.");
            return;
        }


        const email = emailElement.value.trim();
        const password = passwordElement.value;


        try {

            // Firebase Authentication login
            const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            // Logged-in Firebase user
            const user = userCredential.user;

            console.log("Login successful!");
            console.log("Email:", user.email);
            console.log("UID:", user.uid);


            // Firestore document
            const userRef = doc(
                db,
                "users",
                user.uid
            );


            const userDoc = await getDoc(userRef);


            if (!userDoc.exists()) {

                showError(
                    "Firebase user exists, but Firestore profile was not found."
                );

                return;
            }


            const userData = userDoc.data();

            console.log("Firestore user data:", userData);


            // Next page
            window.location.href = "index3.html";


        } catch (error) {

            console.error("Firebase Authentication Error:", error);

            if (error.code === "auth/invalid-credential") {

                showError("Email or password is incorrect.");

            } else if (error.code === "auth/user-not-found") {

                showError("User account not found.");

            } else if (error.code === "auth/wrong-password") {

                showError("Incorrect password.");

            } else if (error.code === "auth/invalid-email") {

                showError("Invalid email address.");

            } else {

                showError(
                    "Login failed: " + error.message
                );
            }
        }
    });
});
