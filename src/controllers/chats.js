const db = require("../models/index");
const { Op } = require("sequelize");

class ChatController {
  getChatsView(req, res) {
    return res.render("chats", { chatFunctionality: true });
  }

  async getChannels(req, res) {
    const { idUser } = req.session;
    const messages = await db.Messages.findAll({
      where: {
        [Op.or]: [
          { idSender: idUser },
          { idReceiver: idUser }
        ]
      },
      order: [
        ["createdAt", "ASC"]
      ]
    });

    const channels = [];
    let isThatUserThere = false, idTargetUser;
    for(let message of messages) {
      for(let channel of channels) {
        if(channel.targetUser.id === message.idSender || channel.targetUser.id === message.idReceiver) {
          isThatUserThere = true;
        }
      }
      idTargetUser = (idUser !== message.idSender)? message.idSender : message.idReceiver;
      if(isThatUserThere) {
        for(let channel of channels) {
          if(channel.targetUser.id === idTargetUser) {
            console.log(channel.messages.push(message));
          }
        }
      } else {
        const targetUser = await db.User.findOne({
          where: {
            id: idTargetUser
          }
        });
        channels.push({
          targetUser: targetUser,
          messages: [message]
        });
      }
      isThatUserThere = false;
    }

    return res.json(channels);
  }

  async createMessage(req, res) {
    const idSender = req.session.idUser;
    const {idReceiver, messageContent} = req.body;

    const message = await db.Messages.create({
      idSender: idSender,
      idReceiver: idReceiver,
      message: messageContent
    });
    return res.json(message);
  }
}

module.exports = ChatController;