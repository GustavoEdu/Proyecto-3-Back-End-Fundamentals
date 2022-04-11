const channels = document.getElementById("channels");
const idUser = Number(channels.dataset.id);
const username = channels.dataset.username;
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
        <p>${channelData.targetUser.username}</p>
      `;
      channels.appendChild(channel);
      channel.addEventListener("click", () => {
        chat.innerHTML = "";
        channelData.messages.forEach(messageData => {
          chat.innerHTML += `
            <div>
              <p>${(messageData.idSender === idUser)? username : channelData.targetUser.username}</p> 
              <p style="background-color:${(messageData.idSender === idUser)? "skyblue" : "gray"};">${messageData.message}</p>
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
    for(let channel of channels.querySelectorAll(".channel")) {
      if(Number(channel.dataset.id) === selectedChannel) {
        channel.click();
      }
    }
  }
}
fillChannels();

setInterval(() => { fillChannels() }, 1000);

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
  for(let channel of channels.querySelectorAll(".channel")) {
    if(channel.dataset.id === idReceiver) {
      channel.click();
    }
  }
  userResult.innerHTML = "";
});

const userSearchbar = document.getElementById("userSearchbar");
userSearchbar.addEventListener("submit", async evt => {
  evt.preventDefault();
  const username = evt.target.username.value.trim();
  if(!username) { return; } 
  const readableStreamUserData = await fetch(`/users/getUser?username=${username}`);
  const userData = await readableStreamUserData.json();
  if(!userData) {
    userResult.innerHTML = `
      <p>Not Found</p>
    `;
    return;
  }
  userResult.innerHTML = "";
  if(!idUsersWithMyMessages.some(idUser => idUser === userData.id) && userData.id !== idUser) {
    userResult.innerHTML = `
      <p>${userData.username}</p>
    `;
    userResult.addEventListener("click", () => {
      chat.innerHTML = "";
      chatForm.idReceiver.value = userData.id;
      selectedChannel = false;
    });
  } else {
    for(let channel of channels.querySelectorAll(".channel")) {
      if(Number(channel.dataset.id) === userData.id) {
        channel.click();
      }
    }
  }
});