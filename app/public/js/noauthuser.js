let messageBoard = document.querySelector('#messageBoard');
// fetch data from the server no authentication

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

async function populateChat() {

    const response = await fetch("/getRecentPosts", {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    const data = await response.json();
    console.log(data);
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
}

populateChat();
