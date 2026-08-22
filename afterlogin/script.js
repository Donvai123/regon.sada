import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const firebaseConfig = {

    apiKey: "AIzaSyAj-LOc7fbr1xFs_iNxFwyULwrBUKI-r4k",

    authDomain: "donvai-281a0.firebaseapp.com",

    projectId: "donvai-281a0",

    storageBucket: "donvai-281a0.firebasestorage.app",

    messagingSenderId: "19064202332",

    appId: "1:19064202332:web:e97db30e47c20a6c6cb299"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// =================================
// CHECK USER LOGIN
// =================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        // User login nahi hai
        window.location.href = "../login/";

    }

});


// =================================
// LOGOUT
// =================================

const logoutBtn =
    document.getElementById("logoutBtn");


logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        // Logout ke baad login page
        window.location.href = "../login/";

    }

    catch(error) {

        console.log("Logout error:", error);

    }

});


// =================================
// MOBILE MENU
// =================================

const menuBtn =
    document.getElementById("menuBtn");

const navMenu =
    document.getElementById("navMenu");


menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("active");

});
