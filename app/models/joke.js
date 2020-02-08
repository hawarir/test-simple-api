module.exports = function main(Joke) {
  Joke.prototype.words = function words() {
    return this.text.split(' ').map((item) => item.toLowerCase().replace(/\W/g, ''));
  };
};
