

function submit_password(){
    const password = document.getElementById('new-password').value;
    const confirm_password = document.getElementById('confirm-password').value;
    if (password == "" || confirm_password == ""){
        alert("Please enter your password");
        return 0;
    }
    if (password != confirm_password){
        alert("Passwords do not match");
        return 0;
    }
    token = window.location.href.split('?')[1].split('=')[1];
    fetch('/change_password/?new_password='+password+"&token="+token).then(response => response.json()).then(data => {
         if (data['message'] == "Success"){
                alert("Пароль було змінено");
                window.location.href = '/';
         } else {
                alert("Помилка зміни паролю");
         }
    });
}

function submit_email(){
    const email = document.getElementById('email').value;
    if (email == ""){
        alert("Please enter your email");
        return 0;
    }
    fetch('/forgot_password/?email='+email).then(response => response.json()).then(data => {
       if (data['message'] == "Success"){
            alert("На вашу пошту було відправлено лист з інструкціями по відновленню паролю");
       } else {
            alert("Перевірте правильність введення пошти");
       }
    });
}