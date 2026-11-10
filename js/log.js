const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("logMessage");

// handle login form submission
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // get entered uname and pword
    const uname = document.getElementById("login_uname").value.trim();
    const pword = document.getElementById("login_pword").value;

    // retrieve registered users from localStorage
    const users = JSON.parse(
        localStorage.getItem("groceryKoUsers")
    ) || [];

    if (users.length === 0) {
        showloginMessage("No account is saved in this browser. Please create an account first.", "error");
        return;
    }

    // find matching uname & pword
    const matchedUser = users.find(function(user) {
        return user.uname.trim().toLowerCase() === uname.toLowerCase()
            && user.pword === pword;
    });

    //check whether the account exists.
    if (!matchedUser) {
        showloginMessage("Incorrect username or password. Please try again.", "error");
        return;
    }

    // save current logged-in uname
    localStorage.setItem(
        "groceryKoCurrentUser",
        matchedUser.uname
    );

    showloginMessage("Login successful! Opening your grocery list...", "Success");

    //redirecting to the grocery list page.
    setTimeout(function() {
        window.location.href = "list.html";
    }, 700);
});

// display login messages
function showloginMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = "form-message " + type;
}