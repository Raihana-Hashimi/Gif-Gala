// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase configuration
const appSettings = {
  databaseURL: "https://gif-gala-76ac1-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings);
const database = getDatabase(app);

// Reference to the 'messages' node in the database
const messagesInDB = ref(database, "messages");

// Get the form element and confirmation message element
const rsvpForm = document.getElementById('rsvp-form');
const email = document.getElementById('email');
const confirmationMessage = document.getElementById('confirmation-message');
const showList = document.getElementById('show-list');
const messageList = document.querySelector(".messages")
const attendanceDropdown = document.getElementById('attendance');
const messageField = document.getElementById('message-field'); // Get the message field
const body = document.body;

// Event listener for the attendance dropdown
attendanceDropdown.addEventListener('change', (event) => {
  // Check if the selected value is 'yes'
  if (event.target.value === 'yes') {
    // Show the message field
    messageField.style.display = 'block';
  } else {
    // Hide the message field
    messageField.style.display = 'none';
  }
});

// Event listener for the form submission
rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent form submission

  // Get the selected attendance value and message value
  const attendance = document.getElementById('attendance').value;
  const message = document.getElementById('message').value;
  
  // Display confirmation message based on attendance selection
  if (attendance === 'yes') {
    // Save the message to the database only if attendance is 'yes'
    push(messagesInDB, { message, timestamp: new Date().toISOString() });
    
    confirmationMessage.innerHTML = `🎉 Party on! We look forward to seeing you at the GIF Gala!`;
    body.style.backgroundImage = 'url("https://media.giphy.com/media/l2JHPB58MjfV8W3K0/giphy.gif")';
  } else if (attendance === 'no') {
    confirmationMessage.innerHTML = '😔 We will miss you at the GIF Gala!';
    body.style.backgroundImage = 'url("https://media.giphy.com/media/JER2en0ZRiGUE/giphy.gif")';
  }

  // Show the confirmation message
  confirmationMessage.style.display = 'block';

  // Reset the form
  rsvpForm.reset();
});

// Event listener for the 'Show Messages' button
showList.addEventListener('click', showMessages);

function showMessages() {
  // Check if the list is currently visible
  if (messageList.style.display === 'none') {
    // If not visible, make it visible
    messageList.style.display = 'flex';
    showList.textContent = 'Hide Messages';
  } else {
    // If already visible, hide it
    messageList.style.display = 'none';
    showList.textContent = 'Show Messages';
  }
}

// Event listener for real-time updates from the database
onValue(messagesInDB, (snapshot) => {
  // Clear existing messages in the list
  messageList.innerHTML = '';

  // Iterate over the received data and add it as list items
  snapshot.forEach((childSnapshot) => {
    const messageData = childSnapshot.val();
    const listItem = document.createElement('li');
    listItem.textContent = `${messageData.message} (Timestamp: ${messageData.timestamp})`;
    messageList.appendChild(listItem);
  });
});
