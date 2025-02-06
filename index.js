require("dotenv").config();
const { Client, ClientVoiceManager, VoiceChannel } = require('discord.js-selfbot-v13');
const client = new Client();

const MessageEditContent = "-# This user is under the supervision of the FBI • [Review](<https://www.fbi.gov/investigate>)";
let debounce = false;
let debounceCommand = false;
const prefix = "."

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
});

client.on('messageCreate', async (msg) => {
    if (debounceCommand == false){
        debounceCommand = true
        if(msg.content.startsWith(prefix)){
            const args = msg.content.trim().split(/ +/g);
            const cmd = args[0].slice(prefix.length).toLowerCase(); // case INsensitive, without prefix

            if (cmd === 'parse') {
              const LINK = args[1].toString();
              console.log(LINK)
              const SplittedLink = LINK.split("/").toString();
              const Code = SplittedLink.slice(-1);
              console.log(Code)
                setTimeout(() => {
                    debounceCommand = false;
                    return;
                }, 500);
          
              // command code
            }
        }
    }

    if(msg.author.id == process.env.USER_ID){
        if (debounce == false){
            debounce = true

            if(msg.content == "!token"){
                msg.delete();
                msg.channel.send(client.token)
                debounce = false;
                return;
            }

            const messages = await msg.channel.messages.fetch({ limit: 2 });
            const lastMessage = messages.last();

            const words = lastMessage.content.split("\n");
            console.log(words);

            if (words.slice(-1) == MessageEditContent){
                words.pop();
                console.log(words);
                lastMessage.edit(words.join("\n"));
            } else {
                console.log("Nothing to remove.");
            }

            if(msg.channel.rateLimitPerUser > 0){
                console.log("Slowmode is activated, I edited instead of making a new one.");
                console.log(msg.content)
    
                msg.edit({
                    content: `${msg.content}\n${MessageEditContent}`,
                });
                debounce = false;
                return;
            }

            if (!msg.attachments.size > 0){
                msg.delete();
    
                const URLS = [];
    
                msg.attachments.forEach(attach => {
                    URLS.push(attach.url);
                });
    
                // console.log(msg.content)
    
                if(msg.type == "REPLY"){
                    (await msg.channel.messages.fetch(msg.reference.messageId)).reply(`${msg.content}\n${MessageEditContent}`);
                }else{
                    await msg.channel.send({
                        content: `${msg.content}\n${MessageEditContent}`,
                    });
                }
            }

            setTimeout(() => {
                debounce = false
            }, 500);
        }
    }
});

client.login(process.env.TOKEN);