import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "donvai-281a0.firebaseapp.com",
    projectId: "donvai-281a0",
    storageBucket: "donvai-281a0.firebasestorage.app",
    messagingSenderId: "19064202332",
    appId: "1:19064202332:web:d50c02838f285b4c6cb299",
    measurementId: "G-F8B777GL1B"
};


// ==========================================
// FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentCaptcha = "";

let globalUserData = null;

let globalUserRef = null;


// ==========================================
// CAPTCHA GENERATOR
// ==========================================

function generateCaptcha() {

    const chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let captcha = "";

    for (let i = 0; i < 6; i++) {

        const randomIndex =
            Math.floor(Math.random() * chars.length);

        captcha += chars[randomIndex];
    }

    currentCaptcha = captcha;

    const captchaText =
        document.getElementById("captchaText");

    if (captchaText) {

        captchaText.textContent =
            currentCaptcha;
    }
}


// ==========================================
// SYSTEM COUNTDOWN
// ==========================================

function startCountdown() {

    const targetDate =
        new Date("2027-04-02T00:00:00").getTime();


    function updateCountdown() {

        const now =
            Date.now();

        const difference =
            targetDate - now;


        const timer =
            document.getElementById("systemTimer");


        if (!timer) {
            return;
        }


        // Date reached
        if (difference <= 0) {

            timer.innerHTML = `
                <span style="color:#10b981;">
                    ✔ Login Enabled Now!
                </span>
            `;

            return;
        }


        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        const hours =
            Math.floor(
                (difference %
                    (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            );


        const minutes =
            Math.floor(
                (difference %
                    (1000 * 60 * 60)) /
                (1000 * 60)
            );


        const seconds =
            Math.floor(
                (difference %
                    (1000 * 60)) /
                1000
            );


        timer.innerHTML = `
            Login will enable on 02/04/2027
            <br>

            <span style="
                font-size:13px;
                opacity:0.8;
                color:#fff;
            ">

                Time Remaining:
                ${days} Days,
                ${hours} Hours,
                ${minutes} Mins,
                ${seconds} Secs

            </span>
        `;
    }


    // Immediately show countdown
    updateCountdown();


    // Update every second
    setInterval(
        updateCountdown,
        1000
    );
}


// ==========================================
// ERROR MESSAGE
// ==========================================

function showError(message) {

    const error =
        document.getElementById(
            "errorMessage"
        );


    if (error) {

        error.textContent = message;

        error.style.display = "block";
    }
}


// ==========================================
// HIDE ERROR
// ==========================================

function hideError() {

    const error =
        document.getElementById(
            "errorMessage"
        );


    if (error) {

        error.style.display = "none";
    }
}


// ==========================================
// 12 HOUR LOCKOUT
// ==========================================

async function trigger12HourLockout() {

    if (!globalUserRef) {
        return;
    }


    const lockoutUntil =
        Date.now() +
        (12 * 60 * 60 * 1000);


    await updateDoc(
        globalUserRef,
        {
            lockoutUntil:
                lockoutUntil.toString()
        }
    );
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        // Start countdown
        startCountdown();


        // Generate CAPTCHA
        generateCaptcha();


        // ======================================
        // CAPTCHA REFRESH BUTTON
        // ======================================

        const refreshBtn =
            document.getElementById(
                "refreshBtn"
            );


        if (refreshBtn) {

            refreshBtn.addEventListener(
                "click",
                () => {

                    generateCaptcha();

                    const captchaInput =
                        document.getElementById(
                            "captchaInput"
                        );

                    if (captchaInput) {

                        captchaInput.value = "";
                    }
                }
            );
        }


        // ======================================
        // LOGIN FORM
        // ======================================

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (!loginForm) {

            console.error(
                "loginForm not found!"
            );

            return;
        }


        loginForm.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();

                hideError();


                const emailElement =
                    document.getElementById(
                        "email"
                    );


                const passwordElement =
                    document.getElementById(
                        "password"
                    );


                const captchaElement =
                    document.getElementById(
                        "captchaInput"
                    );


                if (
                    !emailElement ||
                    !passwordElement ||
                    !captchaElement
                ) {

                    showError(
                        "Login fields not found."
                    );

                    return;
                }


                const email =
                    emailElement.value.trim();


                const password =
                    passwordElement.value;


                const captchaInput =
                    captchaElement.value.trim();


                // ==================================
                // CAPTCHA CHECK
                // ==================================

                if (
                    captchaInput !==
                    currentCaptcha
                ) {

                    showError(
                        "Invalid CAPTCHA! Please enter the correct CAPTCHA."
                    );


                    generateCaptcha();

                    captchaElement.value = "";

                    return;
                }


                try {

                    // ==================================
                    // FIREBASE AUTH
                    // ==================================

                    const userCredential =
                        await signInWithEmailAndPassword(
                            auth,
                            email,
                            password
                        );


                    const user =
                        userCredential.user;


                    console.log(
                        "Firebase login successful:",
                        user.uid
                    );


                    // ==================================
                    // FIRESTORE UID DOCUMENT
                    // ==================================

                    globalUserRef =
                        doc(
                            db,
                            "users",
                            user.uid
                        );


                    const userSnapshot =
                        await getDoc(
                            globalUserRef
                        );


                    if (
                        !userSnapshot.exists()
                    ) {

                        await signOut(auth);


                        showError(
                            "Firebase account found, but Firestore profile does not exist."
                        );


                        return;
                    }


                    globalUserData =
                        userSnapshot.data();


                    // ==================================
                    // LOCKOUT CHECK
                    // ==================================

                    if (
                        globalUserData.lockoutUntil
                    ) {

                        const lockoutUntil =
                            Number(
                                globalUserData.lockoutUntil
                            );


                        if (
                            Date.now() <
                            lockoutUntil
                        ) {

                            const hours =
                                Math.ceil(
                                    (
                                        lockoutUntil -
                                        Date.now()
                                    ) /
                                    (1000 * 60 * 60)
                                );


                            await signOut(auth);


                            showError(
                                `Account locked. Try again after ${hours} hours.`
                            );


                            return;
                        }
                    }


                    // ==================================
                    // 24 HOUR LOGIN LIMIT
                    // ==================================

                    if (
                        globalUserData.lastLoginTime
                    ) {

                        const lastLogin =
                            Number(
                                globalUserData.lastLoginTime
                            );


                        const elapsed =
                            Date.now() -
                            lastLogin;


                        const oneDay =
                            24 *
                            60 *
                            60 *
                            1000;


                        if (
                            elapsed < oneDay
                        ) {

                            const hours =
                                Math.ceil(
                                    (oneDay - elapsed) /
                                    (1000 * 60 * 60)
                                );


                            await signOut(auth);


                            showError(
                                `Login already used. Try again after ${hours} hours.`
                            );


                            return;
                        }
                    }


                    // ==================================
                    // STEP 1 → STEP 2
                    // ==================================

                    const step1 =
                        document.getElementById(
                            "step1-wrapper"
                        );


                    const step2 =
                        document.getElementById(
                            "step2-wrapper"
                        );


                    if (step1) {

                        step1.classList.add(
                            "hidden"
                        );
                    }


                    if (step2) {

                        step2.classList.remove(
                            "hidden"
                        );
                    }


                    hideError();


                    console.log(
                        "Security questions ready."
                    );


                } catch (error) {

                    console.error(
                        "Firebase Error:",
                        error
                    );


                    if (
                        error.code ===
                        "auth/invalid-credential"
                    ) {

                        showError(
                            "Incorrect email or password."
                        );

                    } else if (
                        error.code ===
                        "auth/invalid-email"
                    ) {

                        showError(
                            "Invalid email address."
                        );

                    } else if (
                        error.code ===
                        "auth/too-many-requests"
                    ) {

                        showError(
                            "Too many attempts. Please try again later."
                        );

                    } else {

                        showError(
                            "Firebase Error: " +
                            error.message
                        );
                    }


                    generateCaptcha();

                    captchaElement.value = "";
                }
            }
        );


        // ======================================
        // SECURITY QUESTIONS
        // ======================================

        const securityForm =
            document.getElementById(
                "securityForm"
            );


        if (!securityForm) {
            return;
        }


        securityForm.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();

                hideError();


                if (
                    !globalUserData ||
                    !globalUserRef
                ) {

                    showError(
                        "Session expired. Please login again."
                    );

                    return;
                }


                const dob =
                    document.getElementById(
                        "q_dob"
                    );


                const relation =
                    document.getElementById(
                        "q_relation"
                    );


                const birthAddress =
                    document.getElementById(
                        "q_birthAddress"
                    );


                const ansDob =
                    dob.value
                        .trim()
                        .toLowerCase();


                const ansRelation =
                    relation.value
                        .trim()
                        .toLowerCase();


                const ansAddress =
                    birthAddress.value
                        .trim()
                        .toLowerCase();


                const correctDob =
                    String(
                        globalUserData.dob || ""
                    )
                    .trim()
                    .toLowerCase();


                const correctRelation =
                    String(
                        globalUserData.relation || ""
                    )
                    .trim()
                    .toLowerCase();


                const correctAddress =
                    String(
                        globalUserData.birthAddress || ""
                    )
                    .trim()
                    .toLowerCase();


                // ==================================
                // ALL THREE CORRECT
                // ==================================

                if (
                    ansDob === correctDob &&
                    ansRelation === correctRelation &&
                    ansAddress === correctAddress
                ) {

                    const loginTime =
                        Date.now();


                    await updateDoc(
                        globalUserRef,
                        {
                            lockoutUntil: "",
                            lastLoginTime:
                                loginTime.toString()
                        }
                    );


                    sessionStorage.setItem(
                        "loginActive",
                        "true"
                    );


                    sessionStorage.setItem(
                        "loginTime",
                        loginTime.toString()
                    );


                    // ==================================
                    // SUCCESS
                    // ==================================

                    const dashboard =
                        document.getElementById(
                            "dashboard-wrapper"
                        );


                    if (dashboard) {

                        dashboard.classList.remove(
                            "hidden"
                        );
                    }


                    // FINAL REDIRECT
                    window.location.href =
                        "index3.html";

                }

                // ==================================
                // WRONG SECURITY ANSWER
                // ==================================

                else {

                    await trigger12HourLockout();


                    const step2 =
                        document.getElementById(
                            "step2-wrapper"
                        );


                    const step1 =
                        document.getElementById(
                            "step1-wrapper"
                        );


                    if (step2) {

                        step2.classList.add(
                            "hidden"
                        );
                    }


                    if (step1) {

                        step1.classList.remove(
                            "hidden"
                        );
                    }


                    showError(
                        "Security verification failed. Account locked for 12 hours."
                    );


                    generateCaptcha();


                    const captchaInput =
                        document.getElementById(
                            "captchaInput"
                        );


                    if (captchaInput) {

                        captchaInput.value = "";
                    }


                    // Sign out Firebase
                    await signOut(auth);
                }

            }
        );

    }
);
