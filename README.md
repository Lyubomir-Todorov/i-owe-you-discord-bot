# I Owe You Discord Bot

**A Discord bot to keep track of who owes who money.**

This bot keeps track of your financial exchanges with a roommate or friend, storing data securely in a Google Sheets file. It allows for easy submission of new entries and quick balance checks, all within your Discord server.

![Interaction with the bot](https://github.com/Lyubomir-Todorov/i-owe-you-discord-bot/assets/73316704/7c3532c4-85d2-4ba7-a0e1-83ed953f84fd)
![Overview of the spreadsheet](https://github.com/Lyubomir-Todorov/i-owe-you-discord-bot/assets/73316704/47ebb451-b39c-49a7-9abd-6c72f36dd550)

## Why Use This Bot?

This bot was created to simplify expense tracking for two individuals, removing the need to manually update a shared spreadsheet.

The bot doesn't require commands to add entries. Instead, it uses regular Discord messages with a flexible syntax that is very forgiving and can make a lot of assumptions on your behalf. This is especially useful when you're outside and want to add an entry immediately after making a purchase, so you don't forget to do it later.

The short message syntax also works well for quickly adding entries using your phone's voice dictation.

## Submitting Entries

Messages are parsed using regular expressions and consist of four parts:

### Required arguments

-   `Amount` - The first occurrence of a decimal or whole number is assumed to be the amount
-   `Description` - Text that excludes the name, amount, and category will be used as the description

### Optional arguments

-   `Name` - The name of the person who made the purchase
    -   The name / nickname of the other person can be used to indicate that the amount is owed to them
    -   If no name is found, the name of the user who submitted the message will be used
-   `Category` - Text that matches one of the configured categories / category keywords will be used as the category
    -   If no category is found, the default category will be used

### Full length message example

```
John spent $12.48 for Netflix in subscriptions
```

### Shortened message example

Assuming Netflix is a keyword for the subscriptions category, the example above can be shortened to:

```
12.48 Netflix
```

## Commands

`/balance` - Shows the current balance of the user

`/pay` - Add an entry to pay off any outstanding balances

## Installation requirements

This bot requires self-hosting.

_Hosting on a service such as Railway or Render is recommended. Make sure to set the environment variables in the hosting service._

## Getting started

-   Clone the repository
-   Create a `.env` file in the root directory with the content found in [.env.example](.env.example)
    -   Only variables starting with `GOOGLE` and `DISCORD` are required, the rest are optional

### Creating a service account

A service account is required to access the Google Sheets API. Follow the instructions [here](https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication?id=setting-up-your-quotapplicationquot) to create a service account and download the JSON file.

**Make sure not to commit this file to source control.**

From the JSON file, Add `client_email` as the value for `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`, and `private_key` for `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` to your `.env` file.

## Setting up the spreadsheet

-   Create a copy of the spreadsheet from [here](https://docs.google.com/spreadsheets/d/1q5OcvyquNueBPlrWIpHoLVws0KlqHMnxC8Mc56Tnki8/copy#gid=1759934342)
-   Share the spreadsheet with the `client_email` value, make sure to give it **Edit** permissions
-   Populate the cells found in the `Configuration` worksheet.
-   Copy the `Spreadsheet ID` from the URL of the spreadsheet and add it to `GOOGLE_SHEETS_SPREADSHEET_ID` in your `.env` file

_The spreadsheet ID can be found in the URL of the spreadsheet:_

```
https://docs.google.com/spreadsheets/d/<SPREADSHEET ID>/edit#gid=0
```

## Running the bot

### Local development

-   Run `npm install`
-   Run `npm run dev`

### Production

-   Run `npm build`, followed by `npm start`

### Testing

-   Run `npm test` to run the test suite

## Setting up in your server

-   Create a new Discord application and bot [here](https://discord.com/developers/applications)
-   Copy the bot token and add it to `DISCORD_TOKEN` in your `.env` file
-   Under `Bot`, enable `SERVER MEMBERS INTENT` and `MESSAGE CONTENT INTENT`

    ![Discord privileged gateway intents](https://github.com/Lyubomir-Todorov/i-owe-you-discord-bot/assets/73316704/5d89b006-098a-4643-9205-ab3d9c74cd34)

-   Under `OAuth2`, select the client ID and add it to `DISCORD_CLIENT_ID` in your `.env` file

    ![Discord OAuth2](https://github.com/Lyubomir-Todorov/i-owe-you-discord-bot/assets/73316704/a4518787-3848-454c-8ae1-0f70ab5c58b3)

-   Finally, head to `Installation`. Set `Install link` to `Discord provided link` and use it to invite the bot to your server
-   Create a text channel strictly for the bot to post messages in. This is where the bot will post balance updates and other messages. Restrict permissions to only allow the bot to send messages in this channel.
