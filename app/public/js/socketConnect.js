var socket = io();
let messageBoard = document.querySelector('#messageBoard');
let form = document.querySelector('#postForm');
let input = document.querySelector('#postInput');

function createPostElement(postObj) {
    // create wrapper div
    postDiv = document.createElement("div");
    postDiv.className = "post-wrapper";
    // create username element
    userNameNode = document.createElement("h3");
    userNameNode.className = "post-username";
    userNameNode.textContent = postObj.user
    // create body text element
    textNode = document.createElement("p");
    textNode.className = "post-body";
    textNode.textContent = postObj.text;
    // create timeStamp element
    timeStampNode = document.createElement("p");
    timeStampNode.className = "post-timestamp";
    timeStampNode.textContent = postObj.timeStamp.toString();

    postDiv.appendChild(userNameNode);
    postDiv.appendChild(textNode);
    postDiv.appendChild(timeStampNode);

    return postDiv;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value != "") {
        socket.emit("postFromClient", {
            user: 1,
            postContent: input.value,
            timestamp: new(Date)
        });
        input.value = "";
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
            window.scrollTo(0, document.body.scrollHeight);
        });
    }
    else if (typeof data === "object" && data.user){
        messageBoard.appendChild(createPostElement(data));
        window.scrollTo(0, document.body.scrollHeight);
    }
});

socket.emit("messageFromClient", {
    to: "server@server",
    text: "message to server from user"
});

socket.on("disconnect", () => {
    console.log("Client disconnected from server");
});