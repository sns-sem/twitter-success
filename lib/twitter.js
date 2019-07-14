const State = require('./state');
const axios = require('axios');
const Client = require('twitter');
require('dotenv').config();

class Twitter extends State {
  constructor() {
    super();
    this.on('post', this._post);
    this.client = new Client({
      consumer_key: process.env.API_PUBLIC,
      consumer_secret: process.env.API_SECRET,
      access_token_key: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_SECRET,
    });
  }

  async _post({ id, user }) {
    console.log(`Posting ${user.images.length} images from ${user.username}`);
    const mediaIds = user.images.join();

    await this.client.post('statuses/update', {
      status: `Success by ${user.username}`,
      media_ids: mediaIds,
    });
    
    this.resetUser(id);
  }

  /**
   * Downloads the image from Discord and uploads it to Twitter's media endpoint.
   * The media id is then added to the user's state.
   * Docs: https://developer.twitter.com/en/docs/media/upload-media/api-reference/post-media-upload.html
   * @param {String} imageUrl
   * @param {Object} user Discord user (id and username required)
   */
  async addImage(imageUrl, user) {
    if (this.userIsFull(user.id)) return this.post();
    const image = await axios.get(imageUrl, { responseType: 'arraybuffer' }); // Binary Buffer
    const media = await this.client.post('media/upload', { media: image.data }).catch(err => err);
    this.addToUser(media.media_id_string, user);
    console.log(`Added image from ${user.username}`);
  }
}

module.exports = Twitter;