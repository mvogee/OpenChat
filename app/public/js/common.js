// if user is not logged in hide the log out button
// if user is logged in display their username in the #username-display area
let loggedInDisplayItms = document.querySelector("#logged-in-details");
let usernameDisplay = document.querySelector("#username-display");

// hit the server to see if the user is authenticated or not
async function isAuthenticated() {
    const response = await fetch("/checkAuthenticated", {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    const body = await response.json();
    console.log(body);
    if (body.authenticated) {
        usernameDisplay.textContent = body.user.userName;
        loggedInDisplayItms.toggleAttribute("hidden");
    }
}
isAuthenticated();
// if authenticated display username
// if not hide log out btn