const menu = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menuItem");
const hamburger= document.querySelector(".hamburger");
const closeIcon= document.querySelector(".closeIcon");
const menuIcon = document.querySelector(".menuIcon");
const chat = document.querySelector(".chat");

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

function toggleChat(event) {
  const clickedChat = event.target;
  const allChats = document.querySelectorAll(".chat");

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

menuItems.forEach(function (menuItem) {
  menuItem.addEventListener("click", toggleMenu);
});
chats = document.querySelectorAll(".chat");
chats.forEach(function (chat) {
  chat.addEventListener("click", toggleChat);
});
// chat.addEventListener("click", toggleChat);
hamburger.addEventListener("click", toggleMenu);