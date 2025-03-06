import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push,set,get,equalTo,orderByChild,query } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { onChildAdded ,orderByKey } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
//import { getAuth } from  "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getAuth,signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
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
//const messageBody = document.getElementById("messageBody");

const searchBox=document.getElementById("searchBox");
const searchResults=document.getElementById("searchResults");
const chatMain=document.getElementsByClassName("chat-main")[0];
//const fullAreaDiv=document.getElementsByClassName("fullArea")[0];
const logoutBtn=document.getElementById("logout")
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



//send MSG
function sendMessage(reciver) {
    const messageText = inputMSG.value.trim(); 
const senderUID=currentUser.uid;
const reciverUID=reciver.uid;
console.log("reciver UID",reciverUID);  //debug 
// console.log("sender UID.",currentUser.uid);//debug


const roomID=[currentUser.uid,reciver.uid].sort().join('_');
const currentUserUID=currentUser.uid;


const roomIDRef = ref(database, `PersonalMSG/${roomID}/Profiles`); //1s para-indicates work with realtime database  //2nd para-indicate the node where chat stored   //messagesRef will point to the location in your Firebase database
const messageRef = ref(database,`PersonalMSG/${roomID}/Chat/${reciverUID}`)   ;
if (messageText === '') return; 
//const queryChatRoom =query();////////////////

const profileUserRoomInfo=ref(database,`PersonalMSG`);
const queryUserRoomID=query(profileUserRoomInfo,orderByKey(),equalTo(roomID));
get(queryUserRoomID)
.then((snapshot)=>{
    if(snapshot.exists()){
       const profilesVal=snapshot.val();
        console.log("Snapshots exist of profiles")
//const profilesVal.senderUID==currentUser.uid

// if(profilesVal.senderUID==currentUser.uid && profilesVal.reciverUID==reciver.uid)
// {
//     console.log("Two uid exist");
// }    
// else{
//     console.log("Not exist two uid");

    
// }

const messageData = {
    uid:currentUser.uid,
    name:currentUser.displayName,
    msg: messageText,
    timestamp: Date.now(),
    
};

push(messageRef, messageData)
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
        <span class="user-name">${messageData.name}</span>
        <p>${messageText}</p>
        <span>${new Date(messageData.timestamp).toLocaleTimeString()}</span>
           
`;
    
    messageBody.appendChild(messageDiv);
    inputMSG.value = "";
   messageBody.scrollTop = chatMain.scrollHeight;



}

else{
    console.log("No snapshot data exist of profiles");////////////////////////////////////////////////////////////
    const messageData = {
        uid:currentUser.uid,
        name:currentUser.displayName,
        msg: messageText,
        timestamp: Date.now(),
        
     };
     push(messageRef,messageData)
     .then(()=>
    {
        console.log("Sucessfully store data on firebase");
    })
    .catch((error)=>{
        console.error("Error Occurred  for storing data on firebase",error);
    });
    const profileData1 ={
       
         name:currentUser.displayName,
         email:currentUser.email,
        uid: currentUser.uid      
            // Default to 'Anonymous' (if no name i get from)
    };   
    const profileData2={
        name:reciver.userName, 
        email:reciver.email, 
        uid:reciver.uid};
    
        //img: userIMG.src || "" // Default to an empty string if no image
        


    // set(roomIDRef,{Profiles:profileData1})
    //     .then(() => {
    //         console.log('Message successfully sent to Firebase');

          
    //     })
    //     .catch((error) => {
    //         console.error('Error sending message to Firebase:', error);
    //         alert('Message could not be sent. Please try again.');
    //     });

        
 set(roomIDRef,{
        [profileData1.uid]: profileData1,
        [profileData2.uid]: profileData2
    })
        .then(() => {
            console.log('Profiles successfully stored in Firebase');
        })
        .catch((error) => {
            console.error('Error storing profiles in Firebase:', error);
            alert('Profiles could not be stored. Please try again.');
        });

        const messageDiv = document.createElement("div");
        messageDiv.classList.add('message', 'sent');
        messageDiv.innerHTML = `
            <span class="user-name">${messageData.ChatRoom.MSG.name}</span>
            <p>${messageText}</p>
            <span>${new Date(messageData.ChatRoom.MSG.timestamp).toLocaleTimeString()}</span>
               
`;
        
        messageBody.appendChild(messageDiv);
        inputMSG.value = "";
       messageBody.scrollTop = chatMain.scrollHeight;
    
}

})
.catch((error)=>{
    console.error("Profiles data fetcbhing error",error)
});

}





function receiveMessages(currentUser) {
    
    onChildAdded(messagesRef, (snapshot) => {
        const messageData = snapshot.val(); 

        const messageDiv = document.createElement("div");
        messageDiv.classList.add('message', 'received');

        messageDiv.innerHTML = `
            <div class="message-header">
                <img src="${messageData.user.img || 'default-avatar.png'}" alt="User Image" class="user-img">
                <span class="user-name">${messageData.currentUser.msg}</span>
                <span class="timestamp">${new Date(messageData.timestamp).toLocaleTimeString()}</span>
            </div>
            <p>${messageData.text}</p>
        `;

        messageBody.appendChild(messageDiv);
        messageBody.scrollTop = messageBody.scrollHeight;
    });
}
 //receiveMessages();


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
    userChatOpen(userData);

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
///////////////////////////////////////////////////////////

function userChatOpen(reciverData){
chatMain.innerHTML="";
let bottomAreaDiv=document.createElement("div");
bottomAreaDiv.classList.add("bottomArea");
bottomAreaDiv.innerHTML=`<input type="text" placeholder="Type your message" id="inputMSG">
                <button id="sendBTN">SEND</button>`;
                chatMain.appendChild(bottomAreaDiv);

let topAreaDiv=document.createElement("div");
topAreaDiv.classList.add("topArea");
topAreaDiv.innerHTML=`<p id="appNameTop">Connect IT</p>
                <img src="logout.png" id="logoutIMG">`;
chatMain.append(topAreaDiv);

let topUnderAreaDiv=document.createElement("div");
topUnderAreaDiv.innerHTML=` <img src="" id="reciverIMG">
<p id="reciverName"></p>`;
chatMain.append(topUnderAreaDiv);

console.log(reciverData.userName);
console.log("reciverUUUUID",reciverData.uid)
document.getElementById("reciverName").innerText=reciverData.userName;
document.getElementById("reciverIMG").src="../asset/img/unknown.png";

let messageBodyDiv=document.createElement("div");
messageBodyDiv.classList.add("messageBody");
messageBodyDiv.id="messageBody";
chatMain.append(messageBodyDiv);

// const messageBody=document.getElementById("messageBody");
// const reciverName=document.getElementById("reciverName");
// const reciverIMG=document.getElementById("reciverIMG");

const inputMSG = document.getElementById("inputMSG");
const sendBTN = document.getElementById("sendBTN");
const logout=document.getElementById("logoutIMG");

sendBTN.addEventListener('click', ()=>sendMessage(reciverData));//reciverData pass er passing val
inputMSG.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage(reciverData);
    
        //receiveMessages();
       // search_box();
    }
});
    }
    
///////////////////////////////////////
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



logoutBtn.addEventListener('click',()=>{
    signOut(auth)
    .then(()=>{
        console.log("Sucessfully SignOut");
        localStorage.clear();
        sessionStorage.clear();
        document.cookie="";
//window.location.href='../login.html';

//window.location.href="https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=" + encodeURIComponent("../login.html");
const logoutURL = "https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=" + 
encodeURIComponent("http://127.0.0.1:5500/login.html");  
window.location.replace(logoutURL);
// const logoutURL="https://login.microsoftonline.com/common/oauth2/v2.0/logout";
// window.location.replace(logout); 
// setTimeout(()=>{
//     window.location.href="./login.html"; },2000);
 })

    .catch((error)=>{
console.error("Error occured in logout",error);
    });
});

