const db = require("../models/index");
const { Op } = require("sequelize");

class ChatController {
  async getChannels(req, res) {
    const messages = await db.Messages.findAll({
      where: {
        [Op.or]: [
          { idSender: 1 },
          { idReceiver: 1 }
        ]
      },
      order: [
        ["createdAt", "ASC"]
      ]
    });

    const channels = [], myId = 1;
    let isThatUserThere = false, idTargetUser;
    for(let message of messages) {
      for(let channel of channels) {
        if(channel.targetUser.id === message.idSender || channel.targetUser.id === message.idReceiver) {
          isThatUserThere = true;
        }
      }
      idTargetUser = (myId !== message.idSender)? message.idSender : message.idReceiver;
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
    const message = await db.Messages.create({
      idSender: 1,
      idReceiver: 30,
      message: "XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD"
    });

    return res.json(message);
  }
}

module.exports = ChatController;