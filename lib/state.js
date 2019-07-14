const { EventEmitter } = require('events');
class State extends EventEmitter {
  constructor() {
    super();
    this.state = {}
  }

  /**
   * Starts a countdown timer for a user.
   * If a timer is already exists, it will remove it and start over.
   * After the timeout, it'll post all the pictures saved to that user.
   * @param {String} id Discord user id
   */
  _timer(id) {
    const user = this.state[id];
    if (user.timer) clearTimeout(user.timer);
    user.timer = setTimeout(() => this.emit('post', { id, user }), 300000);
  }

  /**
   * Given a media_id, adds it to a user. Initializes user if it does not yet exist.
   * @param {ArrayBuffer} image Byte array of the image
   * @param {Object} user id and username of a Discord user
   */
  addToUser(media_id, { id, username }) {
    // Initializes an object if the user doesn't exist in state yet.
    if (!this.state[id]) this.state[id] = { images: [], timer: null, username };
    this.state[id].images.push(media_id);
    
    if (this.state[id].images.length > 3) {
      return this.emit('post', { id, user: this.state[id] });
    }

    this._timer(id);
    return this.state[id];
  }

  resetUser(id) {
    if (this.state[id]) delete this.state[id];
  }

  /**
   * Checks if a user inside state is 'full', meaning they have 4 images.
   * @param {String} id Discord user id
   */
  userIsFull(id) {
    if (!this.state[id]) return false;
    return this.state[id].images.length === 4
  }
}

module.exports = State;