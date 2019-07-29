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
    const mediaIds = user.images.map(img => img.media_id).join();
    console.log('ids', mediaIds);
    this.resetUser(id);

    await this.client.post('statuses/update', {
      status: `Success by ${user.username}`,
      media_ids: mediaIds,
    });
    
  }

  /**
   * Downloads the image from Discord and uploads it to Twitter's media endpoint.
   * The media id is then added to the user's state.
   * Docs: https://developer.twitter.com/en/docs/media/upload-media/api-reference/post-media-upload.html
   * @param {String} imageUrl
   * @param {String} messageId Discord message id
   * @param {Object} user Discord user (id and username required)
   */
  async addImage(imageUrl, messageId, user) {
    const image = await axios.get(imageUrl, { responseType: 'arraybuffer' }); // Binary Buffer
    const media = await this.client.post('media/upload', { media: image.data }).catch(err => err);
    this.addToUser(media.media_id_string, messageId, user);
    console.log(`Added image from ${user.username}`);
  }

  /**
   * Deletes an image from state, preventing it from being posted. This does not delete any tweets.
   * @param {String} messageId Discord message id
   * @param {String} userId Discord message author id
   */
  async deleteImage(messageId, user) {
    if (!this.state[user.id]) return;
    const { images } = this.state[user.id];
    this.state[user.id].images = images.filter(img => img.message_id !== messageId);
    this._timer(user.id);
    console.log(`Removed image from ${user.username}`);
  }
}

module.exports = Twitter;