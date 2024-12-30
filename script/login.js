import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, OAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC51WaB_HGCmQGABrEFxc3hWBdkUEVnkyI",
    authDomain: "app1-ed7d8.firebaseapp.com",
    databaseURL: "https://app1-ed7d8-default-rtdb.firebaseio.com",
    projectId: "app1-ed7d8",
    storageBucket: "app1-ed7d8.appspot.com",
    messagingSenderId: "342309820112",
    appId: "1:342309820112:web:b8753b3d9aac4341e930d5",
    measurementId: "G-DT6LXKH4FB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new OAuthProvider('microsoft.com');

const login = document.getElementById("microsoft-login");
const status = document.getElementById("status");

login.addEventListener('click', (event) => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // After signed in.
            const credential = OAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            const idToken = credential.idToken;

            console.log("Successfully logged in");
            console.log("User Info:", result.user); 
            status.textContent = `Welcome, ${result.user.displayName}`; 
        })
        .catch((error) => {
          
            const errorMessage = error.message || "An unknown error occurred.";
            status.textContent = `Login failed. Error: ${errorMessage}`; // Provide error message to the user
        });
});
