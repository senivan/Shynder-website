const menu = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menuItem");
const hamburger= document.querySelector(".hamburger");
const closeIcon= document.querySelector(".closeIcon");
const menuIcon = document.querySelector(".menuIcon");
const chat = document.querySelector(".home");

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
document.addEventListener("DOMContentLoaded", function() {
  // Get references to the heart and cross buttons
  const heartButton = document.getElementById("heartButton");
  const crossButton = document.getElementById("crossButton");

  // Add click event listeners
  heartButton.addEventListener("click", function(event) {
    toggleButton(event.target);
  });

  crossButton.addEventListener("click", function(event) {
    toggleButton(event.target);
  });

  // Function to toggle button styles
  function toggleButton(clickedButton) {
    const allButtons = document.querySelectorAll(".homepagedesctop-button, .homepagedesctop-button1");

    allButtons.forEach(function(button) {
      if (button === clickedButton) {
        button.classList.add("showButton");
        button.classList.add("highlight");
      } else {
        button.classList.remove("showButton");
        button.classList.remove("highlight");
      }
    });
  }
});


menuItems.forEach(function (menuItem) {
  menuItem.addEventListener("click", toggleMenu);
});
hamburger.addEventListener("click", toggleMenu);
// Get references to the heart and cross buttons
// document.addEventListener("DOMContentLoaded", function() {
//   // Get references to the heart and cross buttons
//   const heartButton = document.getElementById("heartButton");
//   const crossButton = document.getElementById("crossButton");

//   // Add onclick event listeners
//   heartButton.addEventListener("click", function() {
//     // Handle click event for heart button
//     console.log("Heart button clicked!");
//     // Add your custom functionality here
//   });

//   crossButton.addEventListener("click", function() {
//     // Handle click event for cross button
//     console.log("Cross button clicked!");
//     // Add your custom functionality here
//   });

//   // Your existing code
//   const menu = document.querySelector(".menu");
//   const menuItems = document.querySelectorAll(".menuItem");
//   const hamburger = document.querySelector(".hamburger");
//   const closeIcon = document.querySelector(".closeIcon");
//   const menuIcon = document.querySelector(".menuIcon");

//   function toggleMenu() {
//     if (menu.classList.contains("showMenu")) {
//       menu.classList.remove("showMenu");
//       closeIcon.style.display = "none";
//       menuIcon.style.display = "block";
//     } else {
//       menu.classList.add("showMenu");
//       closeIcon.style.display = "block";
//       menuIcon.style.display = "none";
//     }
//   }

//   menuItems.forEach(function(menuItem) {
//     menuItem.addEventListener("click", toggleMenu);
//   });
//   hamburger.addEventListener("click", toggleMenu);
// });
