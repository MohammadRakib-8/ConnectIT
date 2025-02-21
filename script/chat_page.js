import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push,get,equalTo,orderByChild,query } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { onChildAdded } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
//import { getAuth } from  "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
// import {messageRefRakibLogin}from "../script/login.js";
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
const user=auth.currentUser;
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
const searchBox=document.getElementById("searchBox");
const searchResults=document.getElementById("searchResults");
const chatMain=document.getElementsByClassName("chat-main")[0];
let currentUser=null;



// function search_box(){
//     let input=searchBox.value.toUpperCase();
//     user.providerData.forEach((profile)=>
//     {
//         let valueStore=profile.email.toUpperCase();
//         console.log(valueStore);     
//         if(valueStore.includes(input)){
//         searchBox.style.display="list-item";
//         }
//         else{
//             searchBox.style.display="none";
//         }
//     })

   
// }



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
// sendBTN.addEventListener('click', sendMessage);
// inputMSG.addEventListener('keypress', (event) => {
//     if (event.key === 'Enter') {
//         sendMessage();
//        // search_box();
//     }
// });

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

// receiveMessages();


const messageRefRakibLogin=ref(database,'LoginInfo');

function search_box(){
    let searchInput=searchBox.value.trim().toLowerCase();
      var userDataQuery=query(messageRefRakibLogin,orderByChild("email"));

      if(searchInput===""){
        searchResults.innerHTML="";
return;
    }
get(userDataQuery)
.then((snapshot)=>{
    searchResults.innerHTML="";
    if(snapshot.exists()){         
    //  console.log("User Found");
//searchBox.style.display="block";
        snapshot.forEach((childsnapshots) => {
let userData=childsnapshots.val();
let email=userData.email.toLowerCase();
if(email.includes(searchInput)){
    console.log("User Found");

let emailResultList=document.createElement("li");
emailResultList.textContent=userData.email;
emailResultList.classList.add("resultList");// CSS
emailResultList.onclick=()=>{
    selectUser(userData.email);
    userChatOpen();

}
searchResults.appendChild(emailResultList);
}
});

if(searchResults.innerHTML===""){
    console.log("User not Found");
    searchResults.innerHTML="<li>No result found Dear 🤨​​</li>"
    return;
    }
}
            // else{
              
            //     //searchBox.style.display="";
            // }
        })

        .catch((error)=>{
            console.log("Error appear",error);
        });
    }
function selectUser(email){
    searchBox.value=email;
searchResults.innerHTML="";

}

    if(searchBox){
    searchBox.addEventListener("keyup",(event)=>{
        // if(event.key==='Enter'){
        search_box();
   // }
    }
    );}
else{
        console.error("Elemnt withe searchBoxID",error);
    }


    function userChatOpen(){
        chatMain.innerHTML="";
let createDiv=document.createElement("div");
createDiv.classList.add("bottomArea");
createDiv.innerHTML=`<input type="text" placeholder="Type your message" id="inputMSG">
                <button id="sendBTN">SEND</button>`;
                chatMain.appendChild(createDiv);

    }

// for(let key in storeUser){
//     let userData=storeUser[key].email
//     if(){
//         console.log(user.email+"is found");
//     }

// }




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



