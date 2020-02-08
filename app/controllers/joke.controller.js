module.exports = function main(app) {
  const { Joke } = app.models;

  // CRUD

  Joke.remoteMethod('getJoke', {
    http: { path: '/:id', verb: 'get' },
    accepts: { arg: 'id', type: 'string' },
    returns: { root: true },
  });
  Joke.getJoke = async (id) => Joke.findById(id);

  Joke.remoteMethod('getJokes', {
    http: { path: '/', verb: 'get' },
    returns: { root: true },
  });
  Joke.getJokes = async () => Joke.find({});

  Joke.remoteMethod('createJoke', {
    http: { path: '/', verb: 'post' },
    accepts: [{ arg: 'data', type: 'object', http: { source: 'body' } }],
    returns: { root: true },
  });
  Joke.createJoke = async (data) => {
    const [joke] = await Joke.findOrCreate({ where: { text: data.text } }, data);
    return joke;
  };

  Joke.remoteMethod('updateJoke', {
    http: { path: '/', verb: 'put' },
    accepts: [{ arg: 'data', type: 'object', http: { source: 'body' } }],
    returns: { root: true },
  });
  Joke.updateJoke = async (data) => Joke.upsert(data);

  Joke.remoteMethod('deleteJoke', {
    http: { path: '/:id', verb: 'delete' },
    accepts: { arg: 'id', type: 'string' },
    returns: { root: true },
  });
  Joke.deleteJoke = async (id) => Joke.deleteById(id);

  // TEXT

  Joke.remoteMethod('getWords', {
    http: { path: '/extract/words/:id', verb: 'get' },
    accepts: { arg: 'id', type: 'string' },
    returns: { root: true },
  });
  Joke.getWords = async (id) => {
    const joke = await Joke.findById(id);
    return joke.words();
  };

  Joke.remoteMethod('getWordsAll', {
    http: { path: '/extract/words', verb: 'get' },
    returns: { root: true },
  });
  Joke.getWordsAll = async () => {
    const jokes = await Joke.find({});
    const words = jokes.map((joke) => joke.words());
    return [].concat(...words);
  };
};
