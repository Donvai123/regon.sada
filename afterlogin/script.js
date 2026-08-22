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
// CHECK LOGIN
// =================================

onAuthStateChanged(auth, (user) => {

    console.log("AUTH USER:", user);

    if (!user) {

        window.location.replace("../login/");

        return;
    }

});


// =================================
// LOGOUT BUTTON
// =================================

const logoutBtn =
    document.getElementById("logoutBtn");

console.log("LOGOUT BUTTON:", logoutBtn);


if (!logoutBtn) {

    console.error("ERROR: logoutBtn not found!");

} else {

    logoutBtn.addEventListener("click", async () => {

        console.log("LOGOUT BUTTON CLICKED");

        try {

            await signOut(auth);

            console.log("FIREBASE LOGOUT SUCCESS");

            window.location.replace("../login/");

        } catch (error) {

            console.error("LOGOUT ERROR:", error);

        }

    });

}
