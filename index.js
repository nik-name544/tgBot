const TgApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "1819781201:AAEc7KG__k58iCtR_eOFhZ6bvotu-AvhlDA";

const bot = new TgApi(token, { polling: true });

const chats = {};

const rndNum = () => Math.floor(Math.random() * 10);

const game = async (chatId) => {
  await bot.sendMessage(chatId, "let's play now");
  chats[chatId] = rndNum();
  await bot.sendMessage(chatId, "guess", gameOptions);
};

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  const first_name = msg.from.first_name;

  bot.setMyCommands([
    { command: "/start", description: "first greeting" },
    { command: "/info", description: "get info" },
    { command: "/game", description: "let's play now" },
  ]);

  if (text === "/start") {
    await bot.sendSticker(
      chatId,
      "CAACAgIAAxkBAAMsYOyXNmNCmECafX82Y9Sf2zi4cdoAApJYAALgo4IHj6ziY0dH-TcgBA"
    );
    await bot.sendMessage(chatId, `hi ${first_name})`);
  } else if (text === "/info") {
    await bot.sendMessage(chatId, "some useless info");
  } else if (!!msg.sticker) {
    const newMsg = JSON.stringify(msg, undefined, 2);
    await bot.sendMessage(chatId, newMsg);
  } else if (text === "/game") {
    return game(chatId);
  } else {
    await bot.sendMessage(chatId, "smth not ok");
  }

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return game(chatId);
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `${msg.from.first_name} you win num was ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `${msg.from.first_name} you was wrong num was ${chats[chatId]}`,
        againOptions
      );
    }
  });
});
