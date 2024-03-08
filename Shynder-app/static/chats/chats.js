const menu = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menuItem");
const hamburger= document.querySelector(".hamburger");
const closeIcon= document.querySelector(".closeIcon");
const menuIcon = document.querySelector(".menuIcon");
const chat = document.querySelector(".chat");

user_session_id = '1';
var websocket = new WebSocket('ws://127.0.0.1:8000/chats_websocket/'+user_session_id);
var receivers = [];
let chat_opened = false;
// MessageJson{
//   "sender":email,
//   "receiver":email,
//   "text":message,
//   "time":time,
//   "command":"send"
// }

websocket.onopen = function(event) {
  websocket.send(JSON.stringify({"sender": user_email, "receiver":"sen.pn@ucu.edu.ua", "messege": "test","time": "10:00", "command":"get_all_matches"}));
};

function home_click() {
  window.location.href = "/home";
}
// Waiting for cookie
// function profile_click() {
//   window.location.href = "/profile/1";
// }

function chats_click() {
  window.location.href = "/chats_page";
}

// Waiting for cookie
// function logout_click() {
//   window.location.href = "/logout";
// }

function getTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;
  const full_date = `${now.getFullYear()}:${now.getMonth()}:${now.getDate()} ${time}`;
  return full_date;
}

let div = document.getElementById('messages');

// Listen for a scroll event on the div
div.addEventListener('scroll', () => {
  let scrollTop = div.scrollTop;
  let scrollHeight = div.scrollHeight;
  let clientHeight = div.clientHeight;
});

// Function to scroll to the bottom of the div
function scrollToDivBottom() {
  setTimeout(() => {
    div.scrollTop = div.scrollHeight;
  }, 0);
}

user_email = '';
fetch(`/get_active_user/?session_id=${user_session_id}`)
  .then(response => response.json())
  .then(data => {
    user_email = data.email;
    console.log('User email:', user_email);
  })
  .catch(error => {
    console.error('Error retrieving user email:', error);
  });
websocket.onmessage = async function(event) {
  scrollToDivBottom();
  messag = JSON.parse(event.data)
  console.log(messag instanceof Array);
  if (messag instanceof Array){
    for (const match of messag){
      user1 = ""
      user2 = ""
      await fetch('/get_user_by_id/?user_id='+match.user1_id).then(response => response.json()).then(data => {user1 = data; console.log(user1);});
      await fetch('/get_user_by_id/?user_id='+match.user2_id).then(response => response.json()).then(data => user2 = data);
      const chat = document.createElement("div");
      const chat_avatar = document.createElement("img");
      const chat_info = document.createElement("div");
      const name = document.createElement("p");
      const last_message = document.createElement("p");
      chat.classList.add("chat");
      chat_avatar.classList.add("chat_avatar");
      chat_avatar.src = "https://www.w3schools.com/howto/img_avatar.png";
      chat_info.classList.add("chat_info");
      name.classList.add("name");
      last_message.classList.add("last_message");
      if (user1.email == user_email){
        chat.setAttribute("chat_id", user2.email);
        name.innerHTML = user2.username;
        receivers.push(user1.email);
      }else{
        chat.setAttribute("chat_id", user1.email);
        name.innerHTML = user1.username;
        receivers.push(user2.email);
      }
      last_message.innerHTML = "Last message";
      chat.appendChild(chat_avatar);
      chat.appendChild(chat_info);
      chat_info.appendChild(name);
      chat_info.appendChild(last_message);
      chat.addEventListener("click", toggleChat);
      document.querySelector(".chats").appendChild(chat);
    }
  }else if (messag.command == "send"){
  let user = ""
  if (user_email == messag.receiver){
    user = "other"
  }else{
    user = "your"
  }
  if (messag) {
    const messages = document.createElement("div");
    const your_message_info = document.createElement("div");
    const your_text = document.createElement("p");
    const your_time = document.createElement("span");
    const your_msg_avatar = document.createElement("img");
    messages.classList.add(user + "_message");
    your_message_info.classList.add(user + "_message_info");
    your_text.classList.add(user + "_text");
    your_time.classList.add(user + "_time");
    your_msg_avatar.classList.add(user + "_msg_avatar");
    your_text.innerHTML = messag.messege;
    your_time.innerHTML = messag.time.split(' ')[1];
    your_msg_avatar.src = "https://www.w3schools.com/howto/img_avatar.png";
    if (user == "other"){
      messages.appendChild(your_msg_avatar);
      messages.appendChild(your_message_info);
    }else{
      messages.appendChild(your_message_info);
      messages.appendChild(your_msg_avatar);
    }
    your_message_info.appendChild(your_text);
    your_message_info.appendChild(your_time);
    
    document.getElementById("messages").appendChild(messages);
  }}
}

function toggleMenu() {
  if (menu.classList.contains("showMenu")) {
    menu.classList.remove("showMenu");
    closeIcon.style.display = "none";
    menuIcon.style.display = "block";
  } else {
    menu.classList.add("showMenu");
    closeIcon.style.display = "block";
    menuIcon.style.display = "none";
  }
}

// function send_message(event) {
//   websocket.send("test");
// }

function toggleChat(event) {
  const clickedChat = event.target;
  console.log(clickedChat);
  const allChats = document.querySelectorAll(".chat");
  const messages = document.querySelector(".messages");
  chat_opened = (clickedChat.classList.contains("showChat")) ? false : true;

  allChats.forEach(function (chat) {
    if (chat == clickedChat) {
      console.log(chat);
      chat.classList.toggle("showChat");
      chat.classList.toggle("highlight");
      chat.style.backgroundColor = chat.classList.contains("showChat") ? "#9A7BEC" : "transparent";
      chat.style.color = chat.classList.contains("showChat") ? "white" : "black";
      chat.addEventListener("hover", function () {
        chat.style.backgroundColor = chat.classList.contains("showChat") ? "#9A7BEC" : "transparent";
        chat.style.color = chat.classList.contains("showChat") ? "white" : "black";
      });
      messages.innerHTML = "";
      if (chat.classList.contains("showChat")) {
        receiver_email = chat.getAttribute("chat_id");
        websocket.send(JSON.stringify({"sender": user_email, "receiver":receiver_email , "messege": "test","time": "10:00", "command":"get_all"}));
      }
      // receiver = clickedChat.getAttribute("chat_id");
      // console.log(receiver);
      // websocket.send(JSON.stringify({"sender": user_email, "receiver": receiver , "messege": "test","time": "10:00", "command":"get_all"}));
    } else {
      chat.classList.remove("showChat");
      chat.classList.remove("highlight");
      chat.style.backgroundColor = "transparent";
      chat.style.color = chat.classList.contains("showChat") ? "white" : "black"
      chat.addEventListener("hover", function () {
        chat.style.backgroundColor = chat.classList.contains("showChat") ? "#9A7BEC" : "transparent";
        chat.style.color = chat.classList.contains("showChat") ? "white" : "black";
      });
    }
  });
  
}

function send_click() {
  if (chat_opened) {
    const input = document.querySelector(".message_input");
    const message = input.value;
    if (message) {
      const messages = document.createElement("div");
      const your_message_info = document.createElement("div");
      const your_text = document.createElement("p");
      const your_time = document.createElement("span");
      const your_msg_avatar = document.createElement("img");
      messages.classList.add("your_message");
      your_message_info.classList.add("your_message_info");
      your_text.classList.add("your_text");
      your_time.classList.add("your_time");
      your_msg_avatar.classList.add("your_msg_avatar");
      your_text.innerHTML = message;
      full_date = getTime();
      your_time.innerHTML = full_date.split(' ')[1];
      your_msg_avatar.src = "https://www.w3schools.com/howto/img_avatar.png";
      messages.appendChild(your_message_info);
      messages.appendChild(your_msg_avatar);
      your_message_info.appendChild(your_text);
      your_message_info.appendChild(your_time);
      document.getElementById("messages").appendChild(messages);
      input.value = "";
      receiver_email = document.querySelector(".highlight").getAttribute("chat_id");
      websocket.send(JSON.stringify({"sender": user_email, "receiver":receiver_email , "messege": message,"time": full_date, "command":"send"}));
    }
    scrollToDivBottom();
  }
}

var input = document.querySelector(".message_input");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector(".send_button").click();
  }
});

menuItems.forEach(function (menuItem) {
  menuItem.addEventListener("click", toggleMenu);
});
chats = document.querySelectorAll(".chat");
chats.forEach(function (chat) {
  chat.addEventListener("click", toggleChat);
});
// chat.addEventListener("click", toggleChat);
hamburger.addEventListener("click", toggleMenu);
