# Success Bot

Takes images from a Discord channel and uploads them onto Twitter. This package has album support, meaning when users post multiple images within a prefined amount of time (timer resets when new image is received), it'll bundle into a single tweet album. Maximum album size is 4.


**New 07/29**: Deleting an image in discord while the image is in state will remove it from state, meaning it won't be posted on Twitter. (Default 5 min)

### Usage

After downloading, install dependencies with `npm install` or `yarn`.

Requires a `.env` file with:

Twitter API keys:
* API_PUBLIC
* API_SECRET
* ACCESS_TOKEN
* ACCESS_SECRET

Discord Token and success channel id:

* BOT_TOKEN
* CHANNEL_ID
