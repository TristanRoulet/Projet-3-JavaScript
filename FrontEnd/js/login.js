const loginForm = document.getElementById('loginForm');

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const mailInput = document.getElementById('mail');
    const passwordInput = document.getElementById('password');
    const inputError = document.getElementById("error");

    function inputTest(input) {
        if (!input.value) {
            input.style.border = "1px solid #ff000099";
            inputError.innerHTML = "Veuillez entrer l’identifiant et le mot de passe";
        } else {
            input.style.border = "none";
        }
    }

    inputTest(mailInput);
    inputTest(passwordInput);

    if (mailInput.value && passwordInput.value) {
        try {
            const response = await axios("http://localhost:5678/api/users/login", {
                method: "POST",
                data: {
                    email: mailInput.value,
                    password: passwordInput.value
                },
            })
            .then((response) => response.data);
                sessionStorage.setItem("userData", JSON.stringify(response));
                window.location.assign("index.html");
        } catch (error) {
            inputError.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
        }
    }
});