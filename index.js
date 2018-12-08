const botconfig = require("./botconfig.json")
const Discord = require("discord.js");
const supersecret = process.env.SECRET
const bot = new Discord.Client ({disableEveryone: true});
const superagent = require("superagent")

bot.on("ready", async () => {
    console.log(`Lipid Bot is online and connected to ${bot.guilds.size} servers!`);
    bot.user.setActivity("Paint Dry Use $help", {type : "WATCHING"});
})

bot.on("message", async message =>{
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig.prefix
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot, message, args);

  //Normal Commands Start Here
    if(cmd === `${prefix}help`){
      let commandsEmbed = new Discord.RichEmbed()
      .setDescription("Normal Commands")
      .setColor("#15f153")
      .addField("--Prefix", "Prefix for Lipid Bot is $")
      .addField("$help", "What your using right now...")
      .addField("$report", "Reports an user to moderators or admins.")
      .addField("$id", "Gets your discord user ID.")
      .addField("$ping", "Tells the bot's ping!")
      .addField("$serverinfo", "Information about the server your in.")
      .addField("$botinfo", "Information about this bot.")
      .addField("$donate", "Get's a link to help support this bot!");

      let funEmbed = new Discord.RichEmbed()
      .setDescription("Fun Commands")
      .setColor("#15f153")
      .addField("--Prefix", "Prefix for Lipid Bot is $")
      .addField("$hello", "Bot says hi back.")
      .addField("$say", "Bot says anything.")
      .addField("$mimic", "Bot mimics the mentioned user.")
      .addField("$dog (coming soon)", "Generates a random cute dog image :black_heart:")
      .addField("$cat (coming soon)", "Generates a random cute cat image! :heart:")
      .addField("$meme (coming soon)", "Generates a funny meme!");

      let modEmbed = new Discord.RichEmbed()
      .setDescription("Moderator Commands")
      .setColor("#15f153")
      .addField("--Preifx", "Prefix for Lipid Bot is $")
      .addField("$kick","Kicks a user you must have mannage messages permissions!");



      message.channel.send(commandsEmbed);
      message.channel.send(funEmbed);
      return message.channel.send(modEmbed);
    }

    if(cmd === `${prefix}report`){
      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0])); 
      if(!rUser) return message.channel.send("I couldn't find that user, please format with $report <@user> <reason>");
      let reason = args.join(" ").slice(22);

      let reportEmbed = new Discord.RichEmbed()
      .setDescription("Reports")
      .setColor("#15f153")
      .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
      .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
      .addField("Channel", message.channel)
      .addField("Time", message.createdAt)
      .addField("Reason", reason);
      
      let reportschannel = message.guild.channels.find('name', "reports");
      if(!reportschannel) return message.channel.send("Couldn't find a reports channel");


      message.delete().catch(O_o=>{});
      reportschannel.send(reportEmbed);
      // Is this a comment oooooooooooh


      return;
    }

    if(cmd === `${prefix}id`){
      let userid = message.author.id
      return message.channel.send(`Your user ID is ${userid}`);
    }

    if(cmd === `${prefix}ping`){
      message.channel.send(`Pong! Your ping is ${bot.ping}`);
    }

    if(cmd === `${prefix}serverinfo`){
      let serverpfp = message.channel.guild.icon_url
      message.channel.send({embed: {
          color: 4582674,
          author: {
            icon_url: serverpfp
          },
          description: "Server Information",
          fields: [{
              name: "Server Name",
              value: message.guild.name
            },
            {
              name: "Created On",
              value: message.guild.createdAt
            },
            {
              name: "You Joined",
              value: message.member.joinedAt
            },
            {
              name: "Total Members",
              value: message.guild.memberCount
            },
          ],
          footer: {
            icon_url: "https://s6.favim.com/orig/151130/alone-bart-bart-simpson-care-Favim.com-3676656.jpg",
            text: "D.Revolve Development"
          }
      }
  });
  }

  if(cmd === `${prefix}botinfo`){
    message.channel.send({embed: {
      color: 3447003,
      author: {
        name: bot.user.username,
      },
      title: "Bot Information",
      description: "This bot was made for Lipid Clan by Survive and D.Revolve Development. More features will be added. If you would like help with your own bot your always free to dm me, Survive#2605",
      timestamp: "Started Being Developed 12/5/18",
      footer: {
        icon_url: 'https://s6.favim.com/orig/151130/alone-bart-bart-simpson-care-Favim.com-3676656.jpg',
        text: "Made By D.Revolve Development"
      }
    }
  });
  }

  //Fun Commands Start Here
    if(cmd === `${prefix}hello`){
      return message.channel.send("Hi, I'm lipid bot you can use $help for some help and I like cute cats! ($cat)")
    }

    if(cmd === `${prefix}say`){
      let saymsg = args
      return message.channel.send(saymsg)
    }

    if(cmd === `${prefix}mimic`){
      let mimicUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      let mimicmsg = args.join(" ").slice(22);

      if(!mimicUser) return message.channel.send("You haven't specified an user. Please format with $mimic <@user> <message>")
      if(!mimicmsg) return message.channel.send("You haven't specified a message. Please format with $mimic <@user> <message>")

      message.guild.members.get(bot.user.id).setNickname(`${mimicUser.name}`)
      message
      message.channel.send(mimicmsg);
      
      
    }
    
    if(cmd === `${prefix}flex`){
      let imageEmbed = new Discord.RichEmbed()
       .setDescription(`${message.authour.username} does the floss on the haters in his $20 skin that he bought with his moms credit card`)
       .setImage("https://i.pinimg.com/originals/11/e7/09/11e709345ce9ef99b56fd5b3766c648c.jpg");
      return message.channel.send(imageEmbed);
       }


    
  //Moderator Commands Start Here
  
  if(cmd === `${prefix}kick`){
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("I couldn't find that user! Please format with $kick <@user> <reason>");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Uh oh you can't do that my friend!");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You can't kick a moderator!");

    let kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor("#e56b00")
    .addField("Kicked User", `${kUser} with an ID of ${kUser.id}`)
    .addField("Kicked By", `<@${message.author.id}> with and ID of ${message.author.id}`)
    .addField("Kicked In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", kReason);

    let kickChannel = message.guild.channels.find(`name`, "logs");
    if(!kickChannel) return message.channel.send("Can't find logs channel.");

    message.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);

    return;
  }

  //end of commands

});  


bot.login(supersecret);