# I Owe You Discord Bot

A Discord bot to keep track of who owes who money.

Data is neatly stored in a Google Sheets file by month. The bot will keep track of the balance between the two people and allow for easy submission of new entries.

![Interaction with the bot](images/demo.png)

## Limitations

This bot is designed for exclusive use by **two individuals only**.

## Why

I had an existing spreadsheet where my roommate and I kept track of who owed who money. I wanted to make it easier to update and view this information.

I found it really annoying to directly update the spreadsheet after making a purchase in places such as the grocery store, and if I waited to do it at home on my PC, I'd likely forget about it.

We already had a private Discord server where we would communicate, so I thought it would be a good idea to have a bot that could handle this for us.

## Focus

The overall focus is to make submitting purchases as easy as possible. I typically use this with voice dictation on my phone, so I want to keep the commands as short as possible.

This is also the main reason I did not make use of commands for submissions. I wanted the bot to interact with plain messages.

## Messages

Messages are made up of four parts:

-   `Name - optional`: The name of the person who made the purchase
-   `Amount - required`: The amount of the purchase
-   `Description - required`: A brief description of the purchase
-   `Category - optional`: The category of the purchase

### Full length messages

Messages are parsed using regular expressions. Take the following message as an example:

```
John spent $12.48 for Netflix in subscriptions
```

-   `John` - The name of the person who made the purchase, this can be the name / nickname of the other person to submit a purchase on their behalf. If no name is specified or found, it will default to the author of the message
-   `12.48` - The first occurrence of a decimal or whole number is assumed to be the amount
-   `Netflix` - Text that excludes the name, amount, and category will be used as the description
-   `subscriptions` - Text that matches one of the configured categories / category keywords will be used as the category. If no category is found, it will fallback to the default category

### Short messages

Shorthand messages are supported. The bot will look for the following patterns, the example above can be shortened to:

```
12.48 Netflix
```

-   The user defaults to the author of the message
-   Amount remains
-   Description remains, `Netflix` happens to be a category keyword, so `subscriptions` will be automatically assigned as the category.

## Commands

`/balance` - Shows the current balance of the user

`/pay` - Add an entry to pay off any outstanding balances

# Installation

The bot is not hosted anywhere, so you will need to run everything yourself.

### Creating a service account

A service account is required to access the Google Sheets API. Follow the instructions [here](https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication?id=setting-up-your-quotapplicationquot) to create a service account and download the JSON file.

We only need the `client_email` and `private_key` fields from the JSON file to authenticate with the Google Sheets API.
**Make sure not to commit this file to source control.**

## Running the bot

-   Clone the repository
-   Create a `.env` file in the root directory with the content found in [.env.example](.env.example)

    ### Local development

-   Run `npm install`
-   Run `npm run dev`

    ### Production

-   Run `npm build`, followed by `npm start`

## Setting up the spreadsheet

-   Create a copy of the spreadsheet from [here](https://docs.google.com/spreadsheets/d/1q5OcvyquNueBPlrWIpHoLVws0KlqHMnxC8Mc56Tnki8/copy#gid=1759934342)
-   Share the spreadsheet with the email found in the service account JSON file, make sure to give it edit permissions

## Setting up in your server

-   Create a new Discord application and bot [here](https://discord.com/developers/applications)
-   Under the bot menu, enable `SERVER MEMBERS INTENT` and `MESSAGE CONTENT INTENT`
    ![Discord privileged gateway intents](images/discord-intents.png)
-   Under the OAuth2 menu, select the client ID and add it to your `.env` file
    ![Discord OAuth2](images/discord-oauth.png)
