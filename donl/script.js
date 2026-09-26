// ============================================================
// FIREBASE IMPORTS
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyAj-LOc7fbr1xFs_iNxFwyULwrBUKI-r4k",
    authDomain: "donvai-281a0.firebaseapp.com",
    projectId: "donvai-281a0",
    storageBucket: "donvai-281a0.firebasestorage.app",
    messagingSenderId: "19064202332",
    appId: "1:19064202332:web:d50c02838f285b4c6cb299",
    measurementId: "G-F8B777GL1B"
};


// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let currentCaptcha = "";
let globalUserData = null;
let globalUserRef = null;


// ============================================================
// CAPTCHA SYSTEM
// ============================================================

function generateCaptcha() {

    const chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let captcha = "";

    for (let i = 0; i < 6; i++) {

        captcha += chars[
            Math.floor(Math.random() * chars.length)
        ];

    }

    currentCaptcha = captcha;

    const captchaElem =
        document.getElementById("captchaText");

    if (captchaElem) {
        captchaElem.textContent = captcha;
    }
}


// ============================================================
// SYSTEM COUNTDOWN
// Target: 02 April 2027
// ============================================================

const targetDate =
    new Date("April 2, 2027 00:00:00").getTime();


const systemTimerInterval = setInterval(() => {

    const now = new Date().getTime();

    const difference =
        targetDate - now;

    const timerElem =
        document.getElementById("systemTimer");


    if (!timerElem) {
        return;
    }


    if (difference <= 0) {

        clearInterval(systemTimerInterval);

        timerElem.innerHTML =
            "<span style='color:#10b981;'>✔ Login Enabled Now!</span>";

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


    timerElem.innerHTML = `
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

}, 1000);


// ============================================================
// 12-HOUR LOCKOUT
// ============================================================

async function trigger12HourLockout() {

    const currentTime =
        new Date().getTime();

    const lockoutTime =
        currentTime +
        (12 * 60 * 60 * 1000);


    if (!globalUserRef) {
        return;
    }


    await updateDoc(globalUserRef, {

        lockoutUntil:
            lockoutTime.toString()

    });
}


// ============================================================
// ERROR MESSAGE
// ============================================================

function showError(message) {

    const errorDiv =
        document.getElementById("errorMessage");


    if (errorDiv) {

        errorDiv.textContent = message;

        errorDiv.style.display = "block";
    }
}


// ============================================================
// DOM CONTENT LOADED
// ============================================================

document.addEventListener("DOMContentLoaded", () => {


    // ========================================================
    // INITIAL CAPTCHA
    // ========================================================

    generateCaptcha();


    // ========================================================
    // CAPTCHA REFRESH BUTTON
    // ========================================================

    const refreshBtn =
        document.getElementById("refreshBtn");


    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            generateCaptcha
        );

    }


    // ========================================================
    // STEP 1 LOGIN FORM
    // ========================================================

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();


                // --------------------------------------------
                // GET INPUT VALUES
                // --------------------------------------------

                const usernameElement =
                    document.getElementById("username");

                const passwordElement =
                    document.getElementById("password");

                const captchaElement =
                    document.getElementById("captchaInput");


                if (
                    !usernameElement ||
                    !passwordElement ||
                    !captchaElement
                ) {

                    showError(
                        "Login form elements not found."
                    );

                    return;
                }


                const username =
                    usernameElement.value
                        .trim()
                        .toLowerCase();


                const passwordInput =
                    passwordElement.value;


                const captchaInput =
                    captchaElement.value.trim();


                const errorDiv =
                    document.getElementById(
                        "errorMessage"
                    );


                if (errorDiv) {

                    errorDiv.style.display =
                        "none";

                }


                const currentTime =
                    new Date().getTime();


                // ====================================================
                // CAPTCHA CHECK
                // ====================================================

                if (
                    captchaInput !==
                    currentCaptcha
                ) {

                    showError(
                        "Invalid Captcha authentication sequence! Please retry."
                    );

                    generateCaptcha();

                    return;
                }


                // ====================================================
                // FIRESTORE USER DOCUMENT
                // ====================================================

                try {

                    globalUserRef =
                        doc(
                            db,
                            "users",
                            username
                        );


                    const userDocSnap =
                        await getDoc(
                            globalUserRef
                        );


                    // ====================================================
                    // USER NOT FOUND
                    // ====================================================

                    if (
                        !userDocSnap.exists()
                    ) {

                        showError(
                            "Error: Gateway Identifier not found in Cloud registry."
                        );

                        generateCaptcha();

                        return;
                    }


                    // ====================================================
                    // USER DATA
                    // ====================================================

                    globalUserData =
                        userDocSnap.data();


                    // ====================================================
                    // 12-HOUR LOCK CHECK
                    // ====================================================

                    if (
                        globalUserData.lockoutUntil
                    ) {

                        const lockoutUntil =
                            Number(
                                globalUserData.lockoutUntil
                            );


                        if (
                            currentTime <
                            lockoutUntil
                        ) {

                            const timeLeft =
                                lockoutUntil -
                                currentTime;


                            const hoursLeft =
                                Math.ceil(
                                    timeLeft /
                                    (1000 * 60 * 60)
                                );


                            showError(
                                `Access Blocked: Account under lock restriction. Resubmission allowed in ${hoursLeft} hours.`
                            );

                            return;
                        }

                    }


                    // ====================================================
                    // 24-HOUR LOGIN LIMIT
                    // ====================================================

                    if (
                        globalUserData.lastLoginTime
                    ) {

                        const lastLoginTime =
                            Number(
                                globalUserData.lastLoginTime
                            );


                        const timeSinceLastLogin =
                            currentTime -
                            lastLoginTime;


                        if (
                            timeSinceLastLogin <
                            (24 * 60 * 60 * 1000)
                        ) {

                            const hoursToWait =
                                Math.ceil(
                                    (
                                        (24 * 60 * 60 * 1000) -
                                        timeSinceLastLogin
                                    ) /
                                    (1000 * 60 * 60)
                                );


                            showError(
                                `Quota Limit: Only 1 session initialization allowed per 24 hours. Wait ${hoursToWait} hours.`
                            );

                            return;
                        }

                    }


                    // ====================================================
                    // PASSWORD CHECK
                    // ====================================================

                    if (
                        globalUserData.password ===
                        passwordInput
                    ) {

                        // ----------------------------------------
                        // STEP 1 HIDE
                        // ----------------------------------------

                        const step1 =
                            document.getElementById(
                                "step1-wrapper"
                            );


                        // ----------------------------------------
                        // STEP 2 SHOW
                        // ----------------------------------------

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


                        // Clear old error
                        if (errorDiv) {
                            errorDiv.style.display =
                                "none";
                        }


                    } else {

                        // ====================================================
                        // WRONG PASSWORD
                        // ====================================================

                        await trigger12HourLockout();


                        showError(
                            "Critical Threat Alert: Access credentials mismatched. Channel blocked for 12 Hours."
                        );


                        generateCaptcha();

                    }


                } catch (error) {

                    console.error(
                        "Firebase Error:",
                        error
                    );


                    showError(
                        "Gateway Connection Mismatch Error."
                    );

                }

            }
        );

    }


    // ========================================================
    // STEP 2 SECURITY QUESTIONS
    // ========================================================

    const securityForm =
        document.getElementById(
            "securityForm"
        );


    if (securityForm) {

        securityForm.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();


                const errorDiv =
                    document.getElementById(
                        "errorMessage"
                    );


                if (errorDiv) {

                    errorDiv.style.display =
                        "none";

                }


                // ====================================================
                // CHECK USER DATA
                // ====================================================

                if (
                    !globalUserData ||
                    !globalUserRef
                ) {

                    showError(
                        "Session data missing. Please login again."
                    );

                    return;
                }


                // ====================================================
                // GET ANSWERS
                // ====================================================

                const dobElement =
                    document.getElementById(
                        "q_dob"
                    );


                const relationElement =
                    document.getElementById(
                        "q_relation"
                    );


                const birthAddressElement =
                    document.getElementById(
                        "q_birthAddress"
                    );


                if (
                    !dobElement ||
                    !relationElement ||
                    !birthAddressElement
                ) {

                    showError(
                        "Security question fields not found."
                    );

                    return;
                }


                const ansDob =
                    dobElement.value
                        .trim()
                        .toLowerCase();


                const ansRelation =
                    relationElement.value
                        .trim()
                        .toLowerCase();


                const ansBirthAddress =
                    birthAddressElement.value
                        .trim()
                        .toLowerCase();


                // ====================================================
                // FIRESTORE CORRECT ANSWERS
                // ====================================================

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


                const correctBirthAddress =
                    String(
                        globalUserData.birthAddress || ""
                    )
                    .trim()
                    .toLowerCase();


                // ====================================================
                // SECURITY QUESTIONS CHECK
                // ====================================================

                if (

                    ansDob === correctDob &&

                    ansRelation === correctRelation &&

                    ansBirthAddress ===
                    correctBirthAddress

                ) {


                    // ====================================================
                    // LOGIN SUCCESS
                    // ====================================================

                    const currentTime =
                        new Date().getTime();


                    await updateDoc(
                        globalUserRef,
                        {

                            lockoutUntil: "",

                            lastLoginTime:
                                currentTime.toString()

                        }
                    );


                    // ====================================================
                    // STEP 2 HIDE
                    // ====================================================

                    const step2 =
                        document.getElementById(
                            "step2-wrapper"
                        );


                    if (step2) {

                        step2.classList.add(
                            "hidden"
                        );

                    }


                    // ====================================================
                    // DASHBOARD SHOW
                    // ====================================================

                    const dashboard =
                        document.getElementById(
                            "dashboard-wrapper"
                        );


                    if (dashboard) {

                        dashboard.classList.remove(
                            "hidden"
                        );

                    }


                    // ====================================================
                    // SESSION STORAGE
                    // ====================================================

                    sessionStorage.setItem(
                        "loginActive",
                        "true"
                    );


                    sessionStorage.setItem(
                        "loginTime",
                        currentTime.toString()
                    );


                    sessionStorage.setItem(
                        "targetPage",
                        globalUserData.redirectUrl || ""
                    );


                    // ====================================================
                    // START AUTO LOGOUT
                    // ====================================================

                    startAutoLogoutCounter(
                        currentTime
                    );


                } else {


                    // ====================================================
                    // WRONG SECURITY ANSWERS
                    // ====================================================

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
                        "Security Token Failed: Parameter response values mismatched. System lockout active for 12 Hours."
                    );


                    generateCaptcha();

                }

            }
        );

    }


    // ========================================================
    // SESSION RECOVERY AFTER PAGE RELOAD
    // ========================================================

    if (
        sessionStorage.getItem(
            "loginActive"
        ) === "true"
    ) {


        const step1 =
            document.getElementById(
                "step1-wrapper"
            );


        const step2 =
            document.getElementById(
                "step2-wrapper"
            );


        const dashboard =
            document.getElementById(
                "dashboard-wrapper"
            );


        if (step1) {

            step1.classList.add(
                "hidden"
            );

        }


        if (step2) {

            step2.classList.add(
                "hidden"
            );

        }


        if (dashboard) {

            dashboard.classList.remove(
                "hidden"
            );

        }


        const loginTime =
            sessionStorage.getItem(
                "loginTime"
            );


        if (loginTime) {

            startAutoLogoutCounter(
                Number(loginTime)
            );

        }

    }

});


// ============================================================
// AUTO LOGOUT COUNTER
// ============================================================

function startAutoLogoutCounter(
    loginTimestamp
) {


    const banner =
        document.getElementById(
            "logoutCountdownBanner"
        );


    if (banner) {

        banner.style.display =
            "block";

    }


    const logoutInterval =
        setInterval(() => {


            const now =
                new Date().getTime();


            const timePassed =
                now -
                Number(loginTimestamp);


            // ====================================================
            // SESSION TIME = 5 MINUTES
            // ====================================================

            const totalSessionTime =
                5 * 60 * 1000;


            const timeLeft =
                totalSessionTime -
                timePassed;


            // ====================================================
            // AUTO LOGOUT
            // ====================================================

            if (timeLeft <= 0) {

                clearInterval(
                    logoutInterval
                );


                sessionStorage.clear();


                alert(
                    "Security Protocol Triggered: Session exceeded 5 minutes threshold. Auto-logout processed."
                );


                window.location.href =
                    "index2.html";


                return;
            }


            // ====================================================
            // REMAINING MINUTES
            // ====================================================

            const minutes =
                Math.floor(
                    (
                        timeLeft %
                        (1000 * 60 * 60)
                    ) /
                    (1000 * 60)
                );


            // ====================================================
            // REMAINING SECONDS
            // ====================================================

            const seconds =
                Math.floor(
                    (
                        timeLeft %
                        (1000 * 60)
                    ) /
                    1000
                );


            // ====================================================
            // DISPLAY COUNTDOWN
            // ====================================================

            if (banner) {

                banner.textContent =
                    `Time remaining for Auto-Logout: ${minutes}m ${seconds}s`;

            }


        }, 1000);


    // ========================================================
    // REDIRECT TO USER'S TARGET PAGE AFTER 4 SECONDS
    // ========================================================

    setTimeout(() => {


        const target =
            sessionStorage.getItem(
                "targetPage"
            );


        if (target) {

            window.location.href =
                target;

        }


    }, 4000);

}
