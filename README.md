# Create Telegram Mini App


## Step 1: Clone the project and deploy the project on the server.

- Git clone from the repository or pull from dev_thomas branch
- Deploy the proejct on the hosting server such as vercel or netlify by importing current github repository.


## Step 2: Set up the Telegram App and get the token key.

- Create Telegram app using @BotFather on the telegram.
- Search the text as "@BotFather" or input text as "@BotFather" in any input filed on the telgram.
- After getting it, click on search button and you will see the commands which is displayed by BotFather.
- You can create new bot by click on Menu or input command as "/newbot"
- Input the name for your telegram bot.
- Input the username for your bot. Remember: It must end in `bot`. Like this, for example: TetrisBot or tetris_bot
- After creating your telegram app, you will see the token key. It is under this text "Use this token to access the HTTP API:"
- Copy and save the token key.


## Step 3: Integrate deployed project to the telegram backend server

### 1. Integrate deployed frontend url into our telegram bot.
- Open telegram BotFather by input "@BotFather".
- Choose the /mybots after clicking menu button or input "/mybots" and then click on your gamestaker bot.
- You will see some options. Click on "Bot Settings".
- Next, click on "Menu Button".
- Next, click on "Configure menu button".
- After that, input our frontend url which is deployed on the hosting server as vercel.


### 2. Integrate the telegram bot into our backend server.  
- You will see the backend server folder for your telegram miniapp in root direct as "server_telegram" once you clone the project or pull the update.
- Create .env file by copy & paste the existed .env_example file and then input server's port number, your telegram's token key and the depolyed project url (on the vercel or others) into the .env file something like this format.
```bash
PORT =    // server port number
BOT_TOKEN =     // this is just for your telegram token key
URL_HOSTING_TELEGRM_APP =    // deployed project url on the vercel
```

- You install node module by command as "npm install" and run the server with this command "npm run start". (or you can deploy the backend server on the hosting server as render or heroku.)

## Step 4: You click your telegram mini app and then can enjoy with it.

