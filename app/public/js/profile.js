let profileUsername = document.querySelector("#profileUsername");
let profileEmail = document.querySelector("#profileEmail");
let profileUserSince = document.querySelector("#profileCreated");

async function fillProfileContent() {
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
        profileUsername.textContent = body.user.userName;
        profileEmail.textContent = body.user.email;
        profileUserSince.textContent = body.user.created;
    }
}

fillProfileContent();