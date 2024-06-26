const menu = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menuItem");
const hamburger = document.querySelector(".hamburger");
const closeIcon = document.querySelector(".closeIcon");
const menuIcon = document.querySelector(".menuIcon");
const chat = document.querySelector(".home");
let heartButton, crossButton, rectangle;
const UPDATE_AT = 1;
let match_counter = 0;

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

let user_cook = getCookie("session_id");

let matches = []


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

function get_matches(){
  fetch('/gen_matches/?session_id=' + user_cook).then(response => response.json()).then(data => {
    // matches.push(data);
    console.log(data);
    matches.push(data);
    generateChats(data.username, data.description, "", data.id, data.matched_interests);
    match_counter ++;
  });
}

function go_home(){
  window.location = "/home";
}

function go_profile(){
  window.location = "/profile";
}

function go_messages(){
  window.location = "/chats_page";
}

function go_logout(){
  window.location = "/logout/?session_id="+user_cook;

}

const page = document.querySelector(".homepage");

function generateChats(username, ddesription, matched, id, matched_interests) {
  const nameDiv = document.createElement("div");
  const descriptionDiv = document.createElement("div");
  const matchDiv = document.createElement("div");
  const heartButtonDiv = document.createElement("div");
  const crossButtonDiv = document.createElement("div");
  const name = document.createElement("span");
  const description = document.createElement("span");
  const interestDiv = document.createElement("div");
  const interestText = document.createElement("span");
  const subCategoryDiv = document.createElement("div");
  const subCategoryText = document.createElement("span");
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
  description.classList.add("descriptionText");
  interestDiv.classList.add("interestDiv");
  interestText.classList.add("interestText");
  subCategoryDiv.classList.add("subCategoryDiv");
  subCategoryText.classList.add("subCategoryText");
  name.textContent = username;
  description.textContent = ddesription;
  for (const key in matched_interests) {
    if (matched_interests.hasOwnProperty(key)) {
      if (matched_interests[key].length === 0) {
        continue;
      }
      const interestDiv = document.createElement("div");
      const subCategoryDiv = document.createElement("div");
      const interestText = document.createElement("span");
      const subCategoryText = document.createElement("span");
      interestDiv.classList.add("interestDiv");
      interestText.classList.add("interestText");
      subCategoryDiv.classList.add("subCategoryDiv");
      subCategoryText.classList.add("subCategoryText");
      interestText.textContent = key + ": ";
      subCategoryText.textContent = matched_interests[key];
      interestDiv.appendChild(interestText);
      subCategoryDiv.appendChild(subCategoryText);
      interestDiv.appendChild(subCategoryDiv);
      matchDiv.appendChild(interestDiv);
    }
  }
  heartButton.textContent = "❤️";
  crossButton.textContent = "❌";
  // rectangle.attributes["data-id"] = id;
  nameDiv.appendChild(name);
  descriptionDiv.appendChild(description);
  // matchDiv.appendChild(match);
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


function updateEventListeners() {
  heartButton = document.querySelectorAll(".buttonHeart");
  crossButton = document.querySelectorAll(".buttonCross");
  var cards  = document.querySelectorAll('.usernameDiv');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var username = card.querySelector('.username').textContent;
      console.log(username); 
      user_id = matches.find(match => match.username === username).id;
      console.log(user_id);
      fetch('/get_user_by_id/?user_id='+user_id).then(response => response.json()).then(data => {
        window.location.href = '/profile/?email='+data.email;
    });
  });
});
  var cards = document.querySelectorAll('.descriptionDiv');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var username = card.querySelector('.username').textContent;
      console.log(username); 
      user_id = matches.find(match => match.username === username).id;
      console.log(user_id);
      fetch('/get_user_by_id/?user_id='+user_id).then(response => response.json()).then(data => {
        window.location.href = '/profile/?email='+data.email;
    });
  });
  var cards = document.querySelectorAll('.matchDiv');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var username = card.querySelector('.username').textContent;
      console.log(username); 
      user_id = matches.find(match => match.username === username).id;
      console.log(user_id);
      fetch('/get_user_by_id/?user_id='+user_id).then(response => response.json()).then(data => {
        window.location.href = '/profile/?email='+data.email;
    });
  });
  });
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
});
}

function handleSwipe(direction, element) {
  if (direction === "left") {
    element.style.transform = "translateX(-100px)";
    element.classList.add("fall-left-animation");
    fetch('/swipe_left/?session_id=' + user_cook + '&user_id=' + matches.find(match => match.username === element.querySelector('.username').textContent).id);
  } else if (direction === "right") {
    element.style.transform = "translateX(100px)";
    element.classList.add("fall-right-animation");
    fetch('/swipe_right/?session_id=' + user_cook + '&user_id=' + matches.find(match => match.username === element.querySelector('.username').textContent).id);
  }

  match_counter --;
    if (match_counter <= UPDATE_AT){
      get_matches();
  }

  setTimeout(function () {
    element.remove();
  }, 1000);
}

menuItems.forEach(function (menuItem) {
  menuItem.addEventListener("click", toggleMenu);
});



hamburger.addEventListener("click", toggleMenu);
get_matches();


