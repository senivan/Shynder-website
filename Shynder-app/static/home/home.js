const menu = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menuItem");
const hamburger = document.querySelector(".hamburger");
const closeIcon = document.querySelector(".closeIcon");
const menuIcon = document.querySelector(".menuIcon");
const chat = document.querySelector(".home");
let heartButton, crossButton, rectangle;

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

const page = document.querySelector(".homepage");

function generateChats() {
  const nameDiv = document.createElement("div");
  const descriptionDiv = document.createElement("div");
  const matchDiv = document.createElement("div");
  const heartButtonDiv = document.createElement("div");
  const crossButtonDiv = document.createElement("div");
  const name = document.createElement("span");
  const description = document.createElement("span");
  const match = document.createElement("span");
  const heartButton = document.createElement("div");
  const crossButton = document.createElement("div");
  const rectangle = document.createElement("div");
  rectangle.classList.add("card");
  nameDiv.classList.add("usernameDiv");
  descriptionDiv.classList.add("descriptionDiv");
  matchDiv.classList.add("matchDiv");
  heartButtonDiv.classList.add("buttonHeart");
  crossButtonDiv.classList.add("buttonCross");
  heartButton.classList.add("likeText");
  crossButton.classList.add("crossText");
  name.classList.add("username");
  match.classList.add("matchText");
  description.classList.add("descriptionText");
  name.textContent = "Name"; // Replace with actual name
  description.textContent = "Description"; // Replace with actual description
  match.textContent = "Match"; // Replace with actual match
  heartButton.textContent = "❤️";
  crossButton.textContent = "❌";
  nameDiv.appendChild(name);
  descriptionDiv.appendChild(description);
  matchDiv.appendChild(match);
  heartButtonDiv.appendChild(heartButton);
  crossButtonDiv.appendChild(crossButton);
  rectangle.appendChild(nameDiv);
  rectangle.appendChild(descriptionDiv);
  rectangle.appendChild(matchDiv);
  rectangle.appendChild(heartButtonDiv);
  rectangle.appendChild(crossButtonDiv);
  page.appendChild(rectangle);

  // Update event listeners after generating chats
  updateEventListeners();
}

generateChats();
generateChats();

function updateEventListeners() {
  heartButton = document.querySelectorAll(".buttonHeart");
  crossButton = document.querySelectorAll(".buttonCross");
  heartButton.forEach(function (button) {
    button.addEventListener("click", function (event) {
      handleSwipe("left", event.target.closest(".card"));
    });
  });
  crossButton.forEach(function (button) {
    button.addEventListener("click", function (event) {
      handleSwipe("right", event.target.closest(".card"));
    });
  });
}

function handleSwipe(direction, element) {
  if (direction === "left") {
    element.style.transform = "translateX(-100px)";
    element.classList.add("fall-left-animation");
  } else if (direction === "right") {
    element.style.transform = "translateX(100px)";
    element.classList.add("fall-right-animation");
  }

  setTimeout(function () {
    element.remove();
  }, 1000);
}

menuItems.forEach(function (menuItem) {
  menuItem.addEventListener("click", toggleMenu);
});

hamburger.addEventListener("click", toggleMenu);

