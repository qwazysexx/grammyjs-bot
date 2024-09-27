require('dotenv').config();
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard, } = require('grammy');
const {hydrate} = require('@grammyjs/hydrate');

const bot = new Bot(process.env.API_KEY_FOR_BOT);
bot.use(hydrate());

bot.api.setMyCommands ([
    {
        command:'start', 
        description: 'Start bot'
    },
    {
        command:'hello', 
        description: 'Receive a greeting'
    },
    {
        command:'id',
        description: 'Check your ID'
    },
    {
        command:'info',
        description: 'Info about the bot'
    },
    {
        command:'mood',
        description:'What`s the mood?'
    },
    {
        command:'menu',
        description:'Call the menu'
    },

]);

bot.command('start', async (ctx) => 
    {
    await ctx.reply('Hello, I`m bot');
});

const menuKeyboard = new InlineKeyboard()
.text('Recognize status', 'order-status')
.text('Contact the support', 'support');
const backKeyboard = new InlineKeyboard().text('< Back to menu', 'back');

bot.command('menu', async (ctx) =>{
    await ctx.reply('Select menu Item', {
        reply_markup: menuKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery('order-status', async (ctx) => {
    await ctx.callbackQuery.message.editText('Order status: On the way',{
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery('support', async (ctx) => {
    await ctx.callbackQuery.message.editText('Email Your request',{
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.callbackQuery('back', async (ctx) => {
    await ctx.callbackQuery.message.editText('Select menu Item',{
        reply_markup: menuKeyboard,
    });
    await ctx.answerCallbackQuery();
});

bot.command('inline_keyboard', async (ctx) => {
    const inlineKeyboard = new InlineKeyboard()
    .text('1', 'button-1')
    .text('2', 'button-2')
    .text('3', 'button-3');

    await ctx.reply('Chose the number', { 
        reply_markup: inlineKeyboard
    }); 
});

bot.callbackQuery(/button-[1-3]/, async (ctx) => {
    await ctx.answerCallbackQuery();
     await ctx.reply(`You chose a number: ${ctx.callbackQuery.data}`);
});

bot.command('info', async (ctx) =>{
    await ctx.react('👌')
    await ctx.reply('Hello I`m bot my link. (https://t.me/qwzsxx_grammy_bot)')
});

bot.command('mood', async (ctx) => {
    const moodKeyboard = new Keyboard().text('Good').row().text('Normal').row().text('Bad').resized().oneTime()
    await ctx.reply('What`s the mood?', {
        reply_markup: moodKeyboard
    })
});

bot.hears(['Good', 'Normal','Bad'], async (ctx) =>{
   const mood = ctx.message.text;

   if(mood === 'Good'){
    await ctx.reply('That`s good!');
   } else if (mood === 'Normal'){
    await ctx.reply('Stay balanced!');
   } else if (mood === 'Bad'){
    await ctx.reply('Hope it gets better soon.');
   }
});

bot.command('id', async (ctx) => {
    await ctx.reply(`Your ID: ${ctx.from.id}`);
});

bot.command(['say_hello', 'hello', 'say_hi'], async (ctx) =>{
    await ctx.reply ('Hello!');
});

bot.on('message', async (ctx) => 
    {
    await ctx.reply('I`ll have to think about it...');
});

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) 
        {
        console.error("Error in request:", e.description);
        } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram", e);
        } else {
        console.error("Unknown error:", e);
        }
}); 

bot.start();