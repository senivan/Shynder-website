const menu = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menuItem");
const hamburger= document.querySelector(".hamburger");
const closeIcon= document.querySelector(".closeIcon");
const menuIcon = document.querySelector(".menuIcon");

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

function delete_event(){
    var session_id = getCookie("session_id");
    window.location = "/delete_user/?session_id="+session_id;
}

function submit_event(){
    const new_username = document.querySelector(".username_input").value;
    const new_email = document.querySelector(".email_input").value;
    const new_description = document.querySelector(".about_me_input").value;
    const new_password = document.querySelector(".password_input").value;
    const new_age = document.querySelector(".age_input").value;
    
    // user_cook = getCookie("session_id");
    user_cook = "1";
    var user = {}
    if (new_username != ""){
        user["user_name"] = new_username;
    }else{
        user["user_name"] = document.querySelector(".username").innerHTML.split(": ")[1];
    }
    if (new_email != ""){
        user["email"] = new_email;
    }else{
        user["email"] = document.querySelector(".email").innerHTML.split(": ")[1];
    }
    if (new_description != ""){
        user["ddescription"] = new_description;
    }else{
        user["ddescription"] = document.querySelector(".about_me").querySelector("p").innerHTML;
    }
    if (new_password != ""){
        user["ppassword"] = new_password;
    }else{
        user["ppassword"] = document.querySelector(".password").innerHTML.split(": ")[1];
    }
    if (new_age != ""){
        user["age"] = new_age;
    }else{
        user["age"] = document.querySelector(".age").innerHTML.split(": ")[1];
    }
    console.log(user);
    fetch("/delete_user/?session_id="+user_cook)
    fetch("/register_user/?user_name="+user["username"]+"&email="+user["email"]+"&ppassword="+user["ppassword"]+"&ddescription="+user["ddescription"]+"&age="+user["age"])
    fetch("/")

}
hamburger.addEventListener("click", toggleMenu);

// user_cook = getCookie("session_id");
console.log(1);
user_cook = "1";
var user;
if (user_cook != ""){
    fetch("/get_active_user/?session_id="+user_cook)
        .then(response => response.json())
        .then(data => {
            document.querySelector(".username").innerHTML = "Username: "+ data.username;
            document.querySelector(".email").innerHTML = "Email: "+ data.email;
            document.querySelector(".about_me").querySelector("p").innerHTML = data.ddescription;
            document.querySelector(".password").innerHTML = "Password: "+ data.password;
            // document.querySelector(".password").display = "None";
            document.querySelector(".age").innerHTML = "Age: "+ data.age;
        });
}
