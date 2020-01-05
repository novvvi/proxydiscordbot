module.exports = {
    commands: {
        "embed": {
            "color": 11858914,
            "footer": {
                "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
                "text": "ENVI PROXIES"
            },
            "author": {
                "name": "ALL COMMANDS"
            },

            "description": "below this is all the commands to manage your proxies",

            "fields": [
                {
                    "name": "Check your GB balance",
                    "value": "```css\n!balance```"
                },
                {
                    "name": "Change your password",
                    "value": "```css\n!pass```"
                },
                {
                    "name": "Genarate your list of proxies",
                    "value": "```css\n!gen <type> <number> <region>``` \n**TYPE:**\n***-r***     *random* \n***-s***     *sticky*\n\n **AMOUNT:**\n*number of proxies*\n\n **REGION:**\n***us***     United States\n***uk***     United Kingdom\n***ca***     Canada\n***jp***     Japan\n                             ***sa***     South Korea\n                             ***sa***     Singapore\n                             ***rdm***  Random\n\n**Example:**          `!gen -s 10 us`\n                            generate sticky 10 United States Proxies\n "
                },
                {
                    "name": "Logout your console: WARNING",
                    "value": "```css\n!logout```"
                },
                {
                    "name": "Show All the Commands",
                    "value": "```css\n!help```"
                },
            ]
        }
    }
}