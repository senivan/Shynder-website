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

user_cook = getCookie("session_id");

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
        user["username"] = new_username;
    }else{
        user["username"] = document.querySelector(".username").innerHTML.split(": ")[1];
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
    window.location.href = "/update_user/?session_id="+user_cook+"&username="+user["username"]+"&email="+user["email"]+"&ddescription="+user["ddescription"]+"&ppassword="+user["ppassword"]+"&age="+user["age"]

}

function showSubInterest() {
    var mainInterests = document.querySelectorAll('input[name="q2"]:checked');
    // Hide all sub-interests first
    var subInterestContainers = document.querySelectorAll('#subInterestContainer > div');
    subInterestContainers.forEach(function(container) {
      container.style.display = 'none';
    });
  
    // Show sub-interests for each checked main interest
    mainInterests.forEach(function(mainInterest) {
      var subOptionsId = mainInterest.value + 'SubOptions';
      var subOptionsContainer = document.getElementById(subOptionsId);
      if (subOptionsContainer) {
        subOptionsContainer.style.display = 'block';
      }
    });
  
    // Show sub-interest container if any main interest checkbox is checked
    var subInterestContainer = document.getElementById('subInterestContainer');
    subInterestContainer.style.display = mainInterests.length > 0 ? 'block' : 'none';
  }

  function toggleCourse(button) {
    // Remove 'clicked' class from all course buttons
    var courseButtons = document.querySelectorAll('.number-option');
    courseButtons.forEach(function(btn) {
      if (!btn.classList.contains('match-with')){
      btn.classList.remove('clicked');}
    });
  
    // Add 'clicked' class to the clicked button
    button.classList.add('clicked');
  }
  
  function toggleCourse1(button) {
    // Remove 'clicked' class from all course buttons
    if (button.classList.contains('clicked')) {
      button.classList.remove('clicked');
    } else {
      button.classList.add('clicked');
    }}

    function update(){
        fetch("/get_active_user/?session_id="+user_cook).then(response => response.json()).then(data => { user = data;
        var name = document.querySelector('input[name="full_name"]').value;
        console.log(user);
  var username = document.querySelector('input[name="username"]').value;
  var desc = document.querySelector('.desc').value;

  const course_buttons = document.querySelectorAll('.number-option');
  var course = "";
  course_buttons.forEach(function(btn) {
    if (btn.classList.contains('clicked')) {
      course = btn.textContent;
    }
  });

   var general_interests = document.querySelectorAll('.gen_options:checked');
    var gen_interests = [];
    general_interests.forEach(function(btn) {
      gen_interests.push(btn.value);
    });

    var sub_interests = document.querySelectorAll('.sub-interest:checked');
    var interest_dict = {
      "Спорт": [],
      "Книги": [],
      "Фільми": [],
      "Рукоділля": [],
      "Подорожі": [],
      "Ігри": [],
      "Кулінарія": [],
      "Програмування": [],
      "Мистецтво": [],
      "Музика": []
    };

    sub_interests.forEach(function(interest){
      interest_dict[interest.name].push(interest.value);
    })

    var music_taste = document.querySelectorAll('.music-taste input:checked');
    console.log(music_taste);
    var music_taste_list = [];
    music_taste.forEach(function(btn) {
      music_taste_list.push(btn.value);
    });
    console.log(music_taste_list);
    var match_with = document.querySelectorAll('.match-with.clicked');
    var match_with_list = [];
    match_with.forEach(function(btn) {
      match_with_list.push(btn.textContent);
    });

    var my_course = document.querySelector('.number-option.clicked').textContent;
    var test_answers = {
      "sex":JSON.parse(user['test_results'])['sex'],
      "course":my_course,
      "interests":interest_dict,
      "music_taste":music_taste_list,
      "match_with":match_with_list,
    }
    // console.log(name, username, email, password,desc, confirmPassword, interest_dict, music_taste_list, match_with_list, my_course);
//   if (name === '' || username === '' || email === '' || password === '' || confirmPassword === '') {
//     alert('Заповніть всі поля');
//   } else if (password !== confirmPassword) {
//     alert('Паролі не співпадають');
//   } else {
//     alert('На пошту ' + user['email'] + ' відправлено лист з підтвердженням реєстрації. Перейдіть за посиланням у листі для завершення реєстрації.');
    fetch('/update_user/?username='+username+'&email='+user['email']+'&full_name='+name+"&ddescription="+desc+"&test_results="+JSON.stringify(test_answers)+"&course="+my_course+"&session_id="+user_cook).then(response => response.json()).then(data => {
      // alert(data);
      console.log(data);
      });
    });
}
hamburger.addEventListener("click", toggleMenu);

console.log(user_cook);
var user;
var user_email = document.querySelector(".user").innerHTML;
if (user_cook != "" && user_email == ""){
    fetch("/get_active_user/?session_id="+user_cook)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var name = document.querySelector('input[name="full_name"]');
            var username = document.querySelector('input[name="username"]');
            // var email = document.querySelector('input[name="email"]');
            var desc = document.querySelector('.desc');
            
            name.value = data["full_name"].length * '*';
            username.value = data["username"];
            desc.value = data["ddescription"];

            const course_buttons = document.querySelectorAll('.number-option');
            if (data["course"] == 1){
                course_buttons[0].classList.add('clicked');
            }
            if (data["course"] == 2){
                course_buttons[1].classList.add('clicked');
            }
            if (data["course"] == 3){
                course_buttons[2].classList.add('clicked');
            }
            if (data["course"] == 4){
                course_buttons[3].classList.add('clicked');
            }
            if (data["course"] == 5){
                course_buttons[4].classList.add('clicked');
            }
            if (data["course"] == 6){
                course_buttons[5].classList.add('clicked');
            }
            if (data["course"] == 7){
                course_buttons[6].classList.add('clicked');
            }

            var interest_dict = JSON.parse(data["test_results"])['interests'];
            console.log(interest_dict);
            const main_interests = document.querySelectorAll('.gen_options');
            for (const interest of main_interests){
                if (interest_dict[interest.value].length != 0){
                    interest.checked = true;
                }
            }

            var sub_interests = document.querySelectorAll('.sub-interest');
            console.log(sub_interests);
            console.log(interest_dict);
            for (let interest of sub_interests){
                if (interest_dict[interest.name].length != 0 && interest_dict[interest.name].includes(interest.value)){
                    interest.checked = true;
                }
            }

            var music_taste = document.querySelectorAll('.music-taste');
            console.log(music_taste);
            var music_dict = JSON.parse(data["test_results"])['music_taste'];
            console.log(music_dict);
            for (let taste of music_taste){
                if (music_dict.includes(taste.value)){
                    taste.checked = true;
                }
            }

            var match_with = document.querySelectorAll('.match-with');
            console.log(match_with);
            var match_dict = JSON.parse(data["test_results"])['match_with'];
            console.log(match_dict);
            for (let match of match_with){
                if (match_dict.includes(match.innerHTML)){
                    match.classList.add('clicked');
                }
            }
            
        });
    }else{
        fetch("/get_user_by_email/?email="+user_email).then(response => response.json()).then(data => {
            var name = document.querySelector('input[name="full_name"]');
            var username = document.querySelector('input[name="username"]');
            // var email = document.querySelector('input[name="email"]');
            var desc = document.querySelector('.desc');
            
            name.value = data["full_name"];
            name.disabled = true;
            username.value = data["username"];
            username.disabled = true;
            desc.value = data["ddescription"];
            desc.disabled = true;

            const course_buttons = document.querySelectorAll('.number-option');
            if (data["course"] == 1){
                course_buttons[0].classList.add('clicked');
            }
            if (data["course"] == 2){
                course_buttons[1].classList.add('clicked');
            }
            if (data["course"] == 3){
                course_buttons[2].classList.add('clicked');
            }
            if (data["course"] == 4){
                course_buttons[3].classList.add('clicked');
            }
            if (data["course"] == 5){
                course_buttons[4].classList.add('clicked');
            }
            if (data["course"] == 6){
                course_buttons[5].classList.add('clicked');
            }
            if (data["course"] == 7){
                course_buttons[6].classList.add('clicked');
            }
            course_buttons.forEach(function(btn) {
                btn.disabled = true;
            });

            var options = document.querySelector('.options-wrappper');
            options.style.display = "none";
            // var h3 = document.querySelector("h3");
            // h3.style.display = "none";
            var sub_options = document.querySelector('#subInterestContainer');
            sub_options.style.display = "none";

            var music_taste = document.querySelector('.music_taste');
            music_taste.style.display = "none";

            var match_with = document.querySelector('.match_with');
            match_with.style.display = "none";

        });
    }        
showSubInterest();

