const channels = document.getElementById("channels");
const idUser = Number(channels.dataset.id);
const username = channels.dataset.username;
const targetUser = document.getElementById("targetUser");
const chat = document.getElementById("chat");
const chatForm = document.getElementById("chatForm");
const userResult = document.getElementById("userResult");
let idUsersWithMyMessages = [];
let selectedChannel;

const fillChannels = async function() {
  channels.innerHTML = "";
  idUsersWithMyMessages = [];
  try {
    const readableStreamChannelsData = await fetch("/chats/channels");
    const channelsData = await readableStreamChannelsData.json();
    channelsData.forEach(channelData => {
      idUsersWithMyMessages.push(channelData.targetUser.id);
      const channel = document.createElement("div");
      channel.dataset.id = channelData.targetUser.id;
      channel.classList.add("chats__channel");
      channel.innerHTML = `
        <img class="chats__profile-pic" src="${channelData.targetUser.profilePic}" alt="${channelData.targetUser.username}">
        <p class="chats__username">${channelData.targetUser.username}</p>
      `;
      channels.appendChild(channel);
      channel.addEventListener("click", () => {
        chatForm.style.display = "block";
        targetUser.innerHTML = `
          <a class="chats__link" href="/users/${channelData.targetUser.id}">
            <img class="chats__profile-pic" src="${channelData.targetUser.profilePic}" alt="${channelData.targetUser.username}"></img>
            <span class="chats__target-username">${channelData.targetUser.username}</span>
          </a>
        `;
        chat.innerHTML = "";
        channelData.messages.forEach(messageData => {
          let profilePicture = "";
          if(!(messageData.idSender === idUser)) {
            profilePicture = `<img class="chats__message-profile-pic" src="${channelData.targetUser.profilePic}" alt="${channelData.targetUser.username}">`;
          }
          chat.innerHTML += `
            <div class="chats__message-container ${(messageData.idSender === idUser)? "chats__message-container--sender" : "chats__message-container--receiver"}">
              ${profilePicture}
              <div class="chats__message ${(messageData.idSender === idUser)? "chats__message--sender" : "chats__message--receiver"}">
                ${messageData.message}
              </div>
            </div>
          `;
        });
        selectedChannel = channelData.targetUser.id;
        chatForm.idReceiver.value = channelData.targetUser.id;
      });
    });
  } catch(error) {
    console.log(error.message);
  }
  if(selectedChannel) {
    for(let channel of channels.querySelectorAll(".chats__channel")) {
      if(Number(channel.dataset.id) === selectedChannel) {
        channel.click();
      }
    }
  }
}
fillChannels();

setInterval(() => { fillChannels(); }, 1000);

chatForm.addEventListener("submit", async evt => {
  evt.preventDefault();
  const idReceiver = evt.target.idReceiver.value;
  const messageContent = evt.target.messageContent.value;
  
  const url = "/chats/create";
  const data = {
    idReceiver: idReceiver,
    messageContent: messageContent
  }
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }
  await fetch(url, request);
  await fillChannels();
  for(let channel of channels.querySelectorAll(".chats__channel")) {
    if(channel.dataset.id === idReceiver) {
      channel.click();
    }
  }
  userResult.innerHTML = "";
  evt.target.messageContent.value = "";
});

const userSearchbar = document.getElementById("userSearchbar");
userSearchbar.addEventListener("submit", async evt => {
  evt.preventDefault();
  const username = evt.target.username.value.trim();
  if(!username) { return; } 
  const readableStreamUserData = await fetch(`/users/getUser?username=${username}`);
  const userData = await readableStreamUserData.json();
  if(!userData) {
    userResult.style.display = "flex";
    userResult.textContent = "Not Found";
    return;
  }
  userResult.innerHTML = "";
  if(!idUsersWithMyMessages.some(idUser => idUser === userData.id) && userData.id !== idUser) {
    userResult.style.display = "flex";
    userResult.innerHTML = `
    <img class="chats__profile-pic" src="${userData.profilePic}" alt="${userData.username}">
    <p class="chats__username">${userData.username}</p>
    `;
    userResult.addEventListener("click", () => {
      userResult.style.display = "none";
      chatForm.style.display = "block";
      targetUser.innerHTML = `
        <a class="chats__link" href="/users/${userData.id}">
          <img class="chats__profile-pic" src="${userData.profilePic}" alt="${userData.username}"></img>
          <span class="chats__target-username">${userData.username}</span>
        </a>
      `;
      chat.innerHTML = "";
      chatForm.idReceiver.value = userData.id;
      selectedChannel = false;
    });
  } else {
    for(let channel of channels.querySelectorAll(".chats__channel")) {
      if(Number(channel.dataset.id) === userData.id) {
        channel.click();
        userResult.style.display = "none";
      }
    }
  }
  evt.target.username.value = "";
});