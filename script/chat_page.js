import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC51WaB_HGCmQGABrEFxc3hWBdkUEVnkyI",
    authDomain: "app1-ed7d8.firebaseapp.com",
    databaseURL: "https://app1-ed7d8-default-rtdb.firebaseio.com",
    projectId: "app1-ed7d8",
    storageBucket: "app1-ed7d8.appspot.com", // Fixed typo
    messagingSenderId: "342309820112",
    appId: "1:342309820112:web:b8753b3d9aac4341e930d5",
    measurementId: "G-DT6LXKH4FB"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);//by passing app parameter i told the firebase that i want to interact with the realtime database 

// DOM Elements
const userIMG = document.getElementById("userIMG");
const userName = document.getElementById("userName");
const messageBody = document.getElementById("messageBody");
const inputMSG = document.getElementById("inputMSG");
const sendBTN = document.getElementById("sendBTN");


// Reference to the 'messages' node in the Realtime Database
const messagesRef = ref(database, 'messages'); //1s para-indicates work with realtime database  //2nd para-indicate the node where chat stored    //messagesRef will point to the location in your Firebase database
// Function to send a message
function sendMessage() {
    const messageText = inputMSG.value.trim(); // Remove leading/trailing spaces

    if (messageText === '') return; // Do nothing if input is empty

    // Message object to store in Firebase
    const messageData = {
        text: messageText,
        timestamp: Date.now(),
        user: {
            name: userName.textContent || "Anonymous", // Default to 'Anonymous' if no name
            img: userIMG.src || "" // Default to an empty string if no image
        }
    };

    // Push message to Firebase Realtime Database
    push(messagesRef, messageData)
        .then(() => {
            console.log('Message successfully sent to Firebase');

            // Add the message to the UI
            const messageDiv = document.createElement("div");
            messageDiv.classList.add('message', 'sent');
            messageDiv.innerHTML = `
                <p>${messageText}</p>
                <span>${new Date(messageData.timestamp).toLocaleTimeString()}</span>`;
            messageBody.appendChild(messageDiv);

            // Clear the input field
            inputMSG.value = "";

            // Scroll to the bottom of the messageBody
            messageBody.scrollTop = messageBody.scrollHeight;
        })
        .catch((error) => {
            console.error('Error sending message to Firebase:', error);
            alert('Message could not be sent. Please try again.');
        });
  
    
}

// Add Event Listeners
sendBTN.addEventListener('click', sendMessage);
inputMSG.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});