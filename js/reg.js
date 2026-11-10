// Get the registration form and message element.
const regForm = document.getElementById("regForm");
const regMessage = document.getElementById("regMessage");

// Get a;; registered users from localStorage.
function getUsers() {
    return JSON.parse(
        localStorage.getItem("groceryKoUsers")
    ) || [];
}

//Handle registration form submission.
regForm.addEventListener("submit", function(event) {
    event.preventDefault();
    // get the user's info
    const user = {
        fname: document.getElementById("full_name").value,
        address: document.getElementById("address").value,
        uname: document.getElementById("u_name").value.trim(),
        email: document.getElementById("email").value,
        pword: document.getElementById("pword").value
    };

    // retrieve existing user records.
    const users = getUsers();
    // check whether uname or email already exists.
    const accExists = users.some(function(savedUser) {
        return savedUser.uname.toLowerCase() === user.uname.toLowerCase() 
            || savedUser.email.toLowerCase() === user.email.toLowerCase();
    });

    if (accExists) {
        showMessage("Username or email is already registered.", "error");
        return;
    }

    // validate uname and pword length.
    if (user.uname.length < 10 || user.pword.length < 8) {
        showMessage("Username must have at least 10 characters and password at least 8 characters.", "error");
        return;
    }

    //add new user object to the users array.
    users.push(user);

    //save updated array in localStorage
    localStorage.setItem(
        "groceryKoUsers",
        JSON.stringify(users)
    );

    showMessage("Account created successfully! Redirecting to login...", "Success");
    regForm.reset();

    //redirect user to login page
    setTimeout(function() {
        window.location.href = "login.html";
    }, 900);
});

//display registration message
function showMessage(message, type) {
    regMessage.textContent = message;
    regMessage.className = "form-message " + type;
}