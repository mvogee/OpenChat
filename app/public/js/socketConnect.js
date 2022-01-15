var socket = io();
let messageBoard = document.querySelector('#messageBoard');
let form = document.querySelector('#postForm');
let input = document.querySelector('#postInput');
let btn = document.querySelector("#post-btn");

function createPostElement(postObj) {
    // create wrapper div
    postDiv = document.createElement("div");
    postDiv.className = "post-wrapper";
    // create username element
    userNameNode = document.createElement("h3");
    userNameNode.className = "post-username";
    userNameNode.textContent = postObj.userName;
    // create body text element
    textNode = document.createElement("p");
    textNode.className = "post-body";
    textNode.textContent = postObj.postContent;
    // create timeStamp element
    timeStampNode = document.createElement("p");
    timeStampNode.className = "post-timestamp";
    timeStampNode.textContent = postObj.timeStamp.toString();

    postDiv.appendChild(userNameNode);
    postDiv.appendChild(textNode);
    postDiv.appendChild(timeStampNode);

    return postDiv;
}
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
        return (body.user);
    }
    else {
        return (false);
    }
}

async function greyOutMessageForm() {
    if (!(await isAuthenticated())) {
        input.toggleAttribute("disabled");
        btn.toggleAttribute("disabled");
        document.querySelector("#post-label").textContent = "Log in to post";
    }
}

greyOutMessageForm();

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let user = await isAuthenticated();
    if (!user) {
        console.log("unathenticated user tried to make a post");
        // display message to user to log in to make posts.
        alert("You must log in to be able to make posts");
    }
    else {
        if (input.value != "") {
            socket.emit("postFromClient", {
                user: user,
                userId: user._id,
                postContent: input.value,
                timestamp: new(Date)
            });
            input.value = "";
        }
    }
    
});

socket.on("connect", () => {
    console.log("connected to the server");
});

socket.on("messageFromServer", (data) => {
    console.log("messageFromServer", data);
    if (Array.isArray(data)) {
        data.forEach((obj) => {
            messageBoard.appendChild(createPostElement(obj));
        });
    }
    else if (typeof data === "object" && data.user){
        messageBoard.appendChild(createPostElement(data));
    }
    window.scrollTo(0, document.body.scrollHeight);
    messageBoard.scrollTo(0, messageBoard.scrollHeight);
});

// server no other purpose than to be an initial message to the server to confirm a connection.
socket.emit("messageFromClient", {
    to: "server@server",
    text: "Confirm connection from user to server."
});

socket.on("disconnect", (reason) => {
    console.log(reason);
    console.log("Client disconnected from server");
});