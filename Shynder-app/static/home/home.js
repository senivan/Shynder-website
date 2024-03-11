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
  heartButton = document.querySelectorAll(".homepagedesctop-button");
  crossButton = document.querySelectorAll(".homepagedesctop-button1");
  rectangle = document.querySelectorAll(".homepagedesctop-rectangle1");
  console.log(heartButton)
  heartButton.forEach(function (button){
    button.addEventListener("click", function (event) {
      toggleButton(event.target);
      handleSwipe("left", rectangle);
    })
  })
  crossButton.forEach(function (button){
    button.addEventListener("click", function (event) {
      toggleButton(event.target);
      handleSwipe("right", rectangle);
    })
  })


  // heartButton.addEventListener("click", function(event) {
  //   toggleButton(event.target);
  //   handleSwipe("left", rectangle);
  // }); 
  // crossButton.addEventListener("click", function(event) {
  //   toggleButton(event.target);
  //   handleSwipe("right", rectangle);
  // });

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

  function handleSwipe(direction, element) {
    if (direction === "left") {
      element.style.transform = "translateX(-100px)";
      element.classList.add("fall-left-animation");
    } else if (direction === "right") {
      element.style.transform = "translateX(100px)";
      element.classList.add("fall-right-animation");
    }

    setTimeout(function() {
      element.remove();
    }, 1000); 
  }
});



















menuItems.forEach(function (menuItem) {
  menuItem.addEventListener("click", toggleMenu);
});
hamburger.addEventListener("click", toggleMenu);


menuItems.forEach(function (menuItem) {
  menuItem.addEventListener("click", toggleMenu);
});
hamburger.addEventListener("click", toggleMenu);
