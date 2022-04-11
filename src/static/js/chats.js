const channels = document.getElementById("channels");
const idUser = Number(channels.dataset.id);
const username = channels.dataset.username;
const chat = document.getElementById("chat");
const chatForm = document.getElementById("chatForm");
let selectedChannel;

const fillChannels = async function() {
  channels.innerHTML = "";
  try {
    const readableStreamChannelsData = await fetch("/chats/channels");
    const channelsData = await readableStreamChannelsData.json();
    channelsData.forEach(channelData => {
      const channel = document.createElement("div");
      channel.dataset.id = channelData.targetUser.id;
      channel.classList.add("channel");
      channel.innerHTML = `
      <p>${channelData.targetUser.name}</p>
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
});