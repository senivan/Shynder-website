const menu = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menuItem");
const hamburger= document.querySelector(".hamburger");
const closeIcon= document.querySelector(".closeIcon");
const menuIcon = document.querySelector(".menuIcon");
const chat = document.querySelector(".chat");

user_session_id = '1';
var websocket = new WebSocket('ws://127.0.0.1:8000/chats_websocket/'+user_session_id);

// MessageJson{
//   "sender":email,
//   "receiver":email,
//   "text":message,
//   "time":time,
//   "command":"send"
// }

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

function send_message(event) {
  websocket.send("test");
}

websocket.onmessage = function(event) {
  console.log(event.data);
}

function toggleChat(event) {
  const clickedChat = event.target;
  const allChats = document.querySelectorAll(".chat");
  const messages = document.querySelector(".messages");

  allChats.forEach(function (chat) {
    if (chat === clickedChat) {
      chat.classList.toggle("showChat");
      chat.classList.toggle("highlight");
      chat.style.backgroundColor = chat.classList.contains("showChat") ? "#9A7BEC" : "transparent";
      chat.style.color = chat.classList.contains("showChat") ? "white" : "black";
      chat.addEventListener("hover", function () {
        chat.style.backgroundColor = chat.classList.contains("showChat") ? "#9A7BEC" : "transparent";
        chat.style.color = chat.classList.contains("showChat") ? "white" : "black";
      });
      // open the chat
      messages.innerHTML = "";
      if (chat.classList.contains("showChat")) {
        const chat_id = chat.getAttribute("chat_id");
        websocket.send(chat_id);
        fetch("/chats/"+chat_id+"/messages")
          .then(response => response.json())
          .then(data => {
            data.forEach(function (message) {
              const messageDiv = document.createElement("div");
              const messageInfo = document.createElement("div");
              const text = document.createElement("p");
              const time = document.createElement("span");
              const msg_avatar = document.createElement("img");
              messageDiv.classList.add("message");
              messageInfo.classList.add("message_info");
              text.classList.add("text");
              time.classList.add("time");
              msg_avatar.classList.add("msg_avatar");
              text.innerHTML = message.text;
              time.innerHTML = message.time;
              msg_avatar.src = message.avatar;
              messageDiv.appendChild(msg_avatar);
              messageDiv.appendChild(messageInfo);
              messageInfo.appendChild(text);
              messageInfo.appendChild(time);
              messages.appendChild(messageDiv);
            });
          });
          
      }
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
  const input = document.querySelector(".message_input");
  const message = input.value;
  if (message) {
    const messages = document.createElement("div");
    const your_message_info = document.createElement("div");
    const your_text = document.createElement("p");
    const your_time = document.createElement("span");
    const your_msg_avatar = document.createElement("img");
    user_email = "sen.pn@ucu.edu.ua"
    messages.classList.add("your_message");
    your_message_info.classList.add("your_message_info");
    your_text.classList.add("your_text");
    your_time.classList.add("your_time");
    your_msg_avatar.classList.add("your_msg_avatar");
    your_text.innerHTML = message;
    your_time.innerHTML = "10:00";
    your_msg_avatar.src = "https://www.w3schools.com/howto/img_avatar.png";
    messages.appendChild(your_message_info);
    messages.appendChild(your_msg_avatar);
    your_message_info.appendChild(your_text);
    your_message_info.appendChild(your_time);
    
    document.getElementById("messages").appendChild(messages);
    input.value = "";
    websocket.send(JSON.stringify({"sender": user_session_id, "receiver":user_email , "messege": message,"time": your_time.innerHTML, "command":"send"}));
  }
}

// function open_chat() {
//   const chat = document.querySelector(".chat");
//   chat.classList.add("showChat");
//   chat.classList.add("highlight");
//   chat.style.backgroundColor = "#9A7BEC";
//   chat.style.color = "white";
//   chat.addEventListener("hover", function () {
//     chat.style.backgroundColor = "#9A7BEC";
//     chat.style.color = "white";
//   });
// }

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