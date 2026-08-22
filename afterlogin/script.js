import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


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


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// ===============================
// CHECK LOGIN
// ===============================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.replace("../login/");

        return;
    }


    if (!user.emailVerified) {

        signOut(auth);

        window.location.replace("../login/");

        return;
    }

});


// ===============================
// LOGOUT
// ===============================

const logoutBtn =
    document.getElementById("logoutBtn");


console.log("Logout button:", logoutBtn);


if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        console.log("Logout clicked");

        try {

            await signOut(auth);

            console.log("Logout successful");

            window.location.replace("../login/");

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    });

}


// ===============================
// MOBILE MENU
// ===============================

const menuBtn =
    document.getElementById("menuBtn");

const navMenu =
    document.getElementById("navMenu");


if (menuBtn && navMenu) {

    menuBtn.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });

}
