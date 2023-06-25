const logInOut = document.getElementById('logInOut');

if(!sessionStorage.userData) {
    logInOut.innerHTML = "login";
    logInOut.addEventListener("click", function() {
        window.location.assign("login.html");
    });
} else {
    logInOut.innerHTML = "logout";
    logInOut.addEventListener("click", function() {
        sessionStorage.clear();
        window.location.reload();
    });
};