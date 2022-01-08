const form = document.querySelector(".login-form");


async function logIn(event) {
    event.preventDefault();
    let data = {
        username: document.querySelector("#username-input").value,
        password: document.querySelector("#password-input").value,
    }
    const response = await fetch("/login", {
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
    if (body.status !== true) {
        // if password does not match username server returns false
        // inform user that username or password are incorrect
        console.log("received status of false from server");
        document.querySelector(".errorInfoText").textContent = "The password or username are incorrect. Please try again.";
    }
    // redirect happens from back end
    else {
        // if not redirected from back end display message saying you are logged in and can navigate to other pages
        console.log("you have been logged in");
        window.location.replace("/");
    }
}

form.addEventListener("submit", logIn);