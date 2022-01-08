const form = document.querySelector(".signup-form");

async function signup(event) {
    event.preventDefault();
    let data = {
        username: document.querySelector("#username-input").value,
        password: document.querySelector("#password-input").value,
        email: document.querySelector("#email-input").value,
    }
    const response = await fetch("/signup", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    const body = await response.json();
    console.log(body);
    if (body.status === false) {
        // if username is already used will send back false as response.
        // inform user that username is already used and to choose a new one.
        console.log("server responded with status of false");
        document.querySelector(".errorInfoText").textContent = "Username is already taken. Please choose another username."
    }
    // if username is not already used will create the user and redirect to the home page from the backend
    else {
        // inform user their account has been created and they can navigate to the thread page.
        // this should send back a user to the client. Save as a cookie to be used for future authentication.
        window.locaiton.replace("/");
    }
}

form.addEventListener("submit", signup);