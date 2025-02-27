
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithPopup, OAuthProvider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref,get, push,query,orderByChild,equalTo} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const database=getDatabase(app);
const user=auth.currentUser;//ony set currentUser after auth
//const connected='false';

const login = document.getElementById("microsoft-login");
const status = document.getElementById("status");

 var messageRefRakibLogin=ref(database,'LoginInfo');
// window.messageRefRakibLogin=messageRefRakibLogin;//////////


login.addEventListener('click', (event) => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const userRakib = result.user; // This will now contain the user info

            // After signed in.
        //     const credential = OAuthProvider.credentialFromResult(result);
        //     const accessToken = credential.accessToken;
        //     const idToken = credential.idToken;
        //    const uid=user.result.uid
        //   console.log(uid);
            console.log("Successfully logged in");
            console.log("User Info:",userRakib);
            console.log("UID",userRakib.uid);
            const r=console.log("ID",userRakib.email.substring(0,10));
            status.textContent = `Welcome, ${userRakib.displayName}`; 
            // connected='true';
//User details saved in db

const userQuery=query(messageRefRakibLogin,orderByChild("email"),equalTo(userRakib.email));
//console.log("User Query ",userQuery);

get(userQuery)
.then((snapshot)=>{
if(snapshot.exists()){
    console.log("User already exist");
    window.location.href='../html/chat_page.html';
}
else{
    const rakibAccData={
        userName:userRakib.displayName,
        email:userRakib.email,
        pic:userRakib.photoURL,
        uid:userRakib.uid
        };
        
         push(messageRefRakibLogin, rakibAccData)
         window.location.href='../html/chat_page.html';
  
}


})

 .catch((error) => {
    console.log("Error storing login details:", error)


});
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