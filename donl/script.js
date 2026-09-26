// 1. Sahi Firebase CDN Imports (v10+ Fully Supported Links) - FIXED
import { initializeApp } from "https://gstatic.com";
import { getFirestore, doc, getDoc, updateDoc } from "https://gstatic.com";

// Aapki Firebase config details - AUTH DOMAIN FIXED
const firebaseConfig = {
    apiKey: "AIzaSyAj-LOc7fbr1xFs_iNxFwyULwrBUKI-r4k",
    authDomain: "://firebaseapp.com",
    projectId: "donvai-281a0",
    storageBucket: "donvai-281a0.firebasestorage.app",
    messagingSenderId: "19064202332",
    appId: "1:19064202332:web:d50c02838f285b4c6cb299",
    measurementId: "G-F8B777GL1B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentCaptcha = "";
let globalUserData = null;
let globalUserRef = null;

// --- 1. Alphanumeric Captcha System ---
function generateCaptcha() {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
        captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    currentCaptcha = captcha;
    
    const captchaElem = document.getElementById("captchaText");
    if (captchaElem) {
        captchaElem.textContent = captcha;
    }
}

// --- 2. Real System Countdown Framework (Target: 02/04/2027) ---
const targetDate = new Date("April 2, 2027 00:00:00").getTime();

const systemTimerInterval = setInterval(() => {
    const now = new Date().getTime();
    const difference = targetDate - now;
    const timerElem = document.getElementById("systemTimer");
    
    if (!timerElem) return;

    if (difference <= 0) {
        clearInterval(systemTimerInterval);
        timerElem.innerHTML = "<span style='color: #10b981;'>✔ Login Enabled Now!</span>";
    } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        timerElem.innerHTML = `Login will enable on 02/04/2027<br><span style='font-size: 13px; opacity:0.8; color:#fff;'>Time Remaining: ${days} Days, ${hours} Hours, ${minutes} Mins, ${seconds} Secs</span>`;
    }
}, 1000);

// Global function triggers 12-hour instant lockouts
async function trigger12HourLockout() {
    const currentTime = new Date().getTime();
    const lockoutTime = currentTime + (12 * 60 * 60 * 1000);
    if (globalUserRef) {
        await updateDoc(globalUserRef, {
            lockoutUntil: lockoutTime.toString()
        });
    }
}

// Submissions Event Listeners ko DOMContentLoaded ke andar dala hai taaki crash na ho - FIXED
document.addEventListener("DOMContentLoaded", () => {
    // Initial Captcha Load
    generateCaptcha();

    // Refresh Button Click
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", generateCaptcha);
    }

    // --- 3. STEP 1 Form Submission (Username, Password, Captcha) ---
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value.trim().toLowerCase();
            const passwordInput = document.getElementById("password").value;
            const captchaInput = document.getElementById("captchaInput").value.trim();
            const errorDiv = document.getElementById("errorMessage");
            
            if (errorDiv) errorDiv.style.display = "none";
            const currentTime = new Date().getTime();

            if (captchaInput !== currentCaptcha) {
                showError("Invalid Captcha authentication sequence! Please retry.");
                generateCaptcha();
                return;
            }

            try {
                globalUserRef = doc(db, "users", username);
                const userDocSnap = await getDoc(globalUserRef);

                if (!userDocSnap.exists()) {
                    showError("Error: Gateway Identifier not found in Cloud registry.");
                    return;
                }

                globalUserData = userDocSnap.data();

                // 12-Hour Lock Checking block
                if (globalUserData.lockoutUntil && currentTime < Number(globalUserData.lockoutUntil)) {
                    const timeLeft = Number(globalUserData.lockoutUntil) - currentTime;
                    const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
                    showError(`Access Blocked: Account under lock restriction. Resubmission allowed in ${hoursLeft} hours.`);
                    return;
                }

                // 24-Hour Per-Day Single Login Limit Validation block
                if (globalUserData.lastLoginTime) {
                    const timeSinceLastLogin = currentTime - Number(globalUserData.lastLoginTime);
                    if (timeSinceLastLogin < (24 * 60 * 60 * 1000)) {
                        const hoursToWait = Math.ceil(((24 * 60 * 60 * 1000) - timeSinceLastLogin) / (1000 * 60 * 60));
                        showError(`Quota Limit: Only 1 session initialization allowed per 24 hours. Wait ${hoursToWait} hours.`);
                        return;
                    }
                }

                // Verify crypt password tokens
                if (globalUserData.password === passwordInput) {
                    document.getElementById("step1-wrapper").classList.add("hidden");
                    document.getElementById("step2-wrapper").classList.remove("hidden");
                } else {
                    await trigger12HourLockout();
                    showError("Critical Threat Alert: Access credentials mismatched. Channel blocked for 12 Hours.");
                    generateCaptcha();
                }

            } catch (error) {
                console.error(error);
                showError("Gateway Connection Mismatch Error.");
            }
        });
    }

    // --- 4. STEP 2 Form Submission (3 Security Questions Checker) ---
    const securityForm = document.getElementById("securityForm");
    if (securityForm) {
        securityForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const errorDiv = document.getElementById("errorMessage");
            if (errorDiv) errorDiv.style.display = "none";

            const ansDob = document.getElementById("q_dob").value.trim().toLowerCase();
            const ansRelation = document.getElementById("q_relation").value.trim().toLowerCase();
            const ansBirthAddress = document.getElementById("q_birthAddress").value.trim().toLowerCase();

            const correctDob = globalUserData.dob.trim().toLowerCase();
            const correctRelation = globalUserData.relation.trim().toLowerCase();
            const correctBirthAddress = globalUserData.birthAddress.trim().toLowerCase();

            if (ansDob === correctDob && ansRelation === correctRelation && ansBirthAddress === correctBirthAddress) {
                const currentTime = new Date().getTime();
                await updateDoc(globalUserRef, {
                    lockoutUntil: "",
                    lastLoginTime: currentTime.toString()
                });

                document.getElementById("step2-wrapper").classList.add("hidden");
                document.getElementById("dashboard-wrapper").classList.remove("hidden");

                sessionStorage.setItem("loginActive", "true");
                sessionStorage.setItem("loginTime", currentTime.toString());
                sessionStorage.setItem("targetPage", globalUserData.redirectUrl);

                startAutoLogoutCounter(currentTime);

            } else {
                await trigger12HourLockout();
                document.getElementById("step2-wrapper").classList.add("hidden");
                document.getElementById("step1-wrapper").classList.remove("hidden");
                showError("Security Token Failed: Parameter response values mismatched. System lockout active for 12 Hours.");
                generateCaptcha();
            }
        });
    }

    // Auto trigger if page reloads and user session is still alive
    if (sessionStorage.getItem("loginActive") === "true") {
        const step1 = document.getElementById("step1-wrapper");
        const dash = document.getElementById("dashboard-wrapper");
        if (step1 && dash) {
            step1.classList.add("hidden");
            dash.classList.remove("hidden");
            startAutoLogoutCounter(sessionStorage.getItem("loginTime"));
        }
    }
});

function showError(msg) {
    const errorDiv = document.getElementById("errorMessage");
    if (errorDiv) {
        errorDiv.textContent = msg;
        errorDiv.style.display = "block";
    }
}

// --- 5. Realtime Decrement Countdown Loop for Auto Logout Window ---
function startAutoLogoutCounter(loginTimestamp) {
    const banner = document.getElementById("logoutCountdownBanner");
    if (banner) banner.style.display = "block";

    const logoutInterval = setInterval(() => {
        const now = new Date().getTime();
        const timePassed = now - Number(loginTimestamp);
        const totalSessionTime = 5 * 60 * 1000; // 5 Mins in ms
        const timeLeft = totalSessionTime - timePassed;

        if (timeLeft <= 0) {
            clearInterval(logoutInterval);
            sessionStorage.clear();
            alert("Security Protocol Triggered: Idle session exceeded 5 minutes threshold. Auto-logout processed.");
            window.location.href = "index2.html";
        } else {
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            if (banner) {
                banner.textContent = Time remaining for Auto-Logout: ${minutes}m ${seconds}s;}}}, 1000);
    setTimeout(() => {const target = sessionStorage.getItem("targetPage");if (target) {window.location.href = target;}}, 4000);}
