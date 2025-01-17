import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { onChildAdded } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
//import { getAuth } from  "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
const database = getDatabase(app);//by passing app parameter i told the firebase that i want to interact with the realtime database/////////////////
const auth=getAuth();
// const user=auth.currentUser;

// if(user){

//     console.log(user.uid);

// }
// else{
//     console.log("please login")
// }
// const user = auth.currentUser;
/////////////////////////////////////////////////////////////////////
const userIMG = document.getElementById("userIMG");
//const userName = document.getElementById("userName");
const userInfo=document.getElementsByClassName("userInfo");
const messageBody = document.getElementById("messageBody");
const inputMSG = document.getElementById("inputMSG");
const sendBTN = document.getElementById("sendBTN");
let currentUser=null;


onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("User UID accessed in chat.js:", user.uid);
       console.log(user.email) ;
       console.log(user.displayName);
      // userInfo.innerHtml=`<p>${user.displayName}</p>`;
       currentUser=user;
       console.log(currentUser);
    } else {
        // No user is signed in
        console.log("No user logged in. Please log in first.");
        currentUser=null;
        
    }
});





const messagesRef = ref(database, 'PersonalMSG'); //1s para-indicates work with realtime database  //2nd para-indicate the node where chat stored   //messagesRef will point to the location in your Firebase database
//send MSG
function sendMessage() {
    const messageText = inputMSG.value.trim(); 

    if (messageText === '') return; 

    const messageData = {
        text: messageText,
        timestamp: Date.now(),
        user: {
            name: currentUser.displayName || "Anonymous", // Default to 'Anonymous' (if no name i get from)
            //img: userIMG.src || "" // Default to an empty string if no image
        }
    };

    push(messagesRef, messageData)
        .then(() => {
            console.log('Message successfully sent to Firebase');

          
        })
        .catch((error) => {
            console.error('Error sending message to Firebase:', error);
            alert('Message could not be sent. Please try again.');
        });

        const messageDiv = document.createElement("div");
        messageDiv.classList.add('message', 'sent');
        messageDiv.innerHTML = `
            <span class="user-name">${messageData.user.name}</span>
            <p>${messageText}</p>
            <span>${new Date(messageData.timestamp).toLocaleTimeString()}</span>
               
`;
        
        messageBody.appendChild(messageDiv);
        inputMSG.value = "";
        messageBody.scrollTop = messageBody.scrollHeight;
}
sendBTN.addEventListener('click', sendMessage);
inputMSG.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function receiveMessages() {
    
    onChildAdded(messagesRef, (snapshot) => {
        const messageData = snapshot.val(); 

        const messageDiv = document.createElement("div");
        messageDiv.classList.add('message', 'received');

        messageDiv.innerHTML = `
            <div class="message-header">
                <img src="${messageData.user.img || 'default-avatar.png'}" alt="User Image" class="user-img">
                <span class="user-name">${messageData.user.displayName}</span>
                <span class="timestamp">${new Date(messageData.timestamp).toLocaleTimeString()}</span>
            </div>
            <p>${messageData.text}</p>
        `;

        messageBody.appendChild(messageDiv);
        messageBody.scrollTop = messageBody.scrollHeight;
    });
}

receiveMessages();

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         // User is signed in
//         console.log("User UID accessed in chat.js:", user.uid);
//        console.log(user.email) ;
//     } else {
//         // No user is signed in
//         console.log("No user logged in. Please log in first.");
//     }
// });



