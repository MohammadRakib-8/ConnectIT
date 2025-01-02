import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, OAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";


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
const connected='false';

const login = document.getElementById("microsoft-login");
const status = document.getElementById("status");

login.addEventListener('click', (event) => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // After signed in.
            const credential = OAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            const idToken = credential.idToken;
           //const uid=user.result.uid
          // console.log(uid);
            console.log("Successfully logged in");
            console.log("User Info:", result.user);
            console.log("UID",result.user.uid);
            const r=console.log("ID",result.user.email.substring(0,10));
            status.textContent = `Welcome, ${result.user.displayName}`; 
            window.location.href='../html/chat_page.html';
            // connected='true';
        })
        .catch((error) => {
          
            const errorMessage = error.message || "An unknown error occurred.";
            status.textContent = `Login failed. Error: ${errorMessage}`; 
        });
});

// if(connected=='true'){
//     window.location.href='../html/chat_page.html';

// }
// else{
//     status.innerHTML='Please give correct info';
//}