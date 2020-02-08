module.exports = async (app) => {
  const promises = [...Array(25)].map(() => app.models.Joke.getRandomJoke());
  return Promise.all(promises);
};
