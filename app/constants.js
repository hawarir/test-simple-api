module.exports = {
  jokeSources: [
    {
      url: 'https://official-joke-api.appspot.com/jokes/random',
      extractJoke: (({ setup, punchline, type }) => {
        return {
          text: `${setup} ${punchline}`,
          category: type,
          source: 'official-joke-api.appspot.com',
        };
      }),
    },
    {
      url: 'https://sv443.net/jokeapi/v2/joke/any',
      extractJoke: (({ setup, delivery, flags, category }) => {
        let explicit = false;
        for (const property in flags) {
          if (flags[property] === true) {
            explicit = true;
            break;
          }
        }
        return {
          text: `${setup} ${delivery}`,
          category,
          source: 'svg443.net',
          explicit,
        };
      }),
    },
    {
      url: 'https://icanhazdadjoke.com/',
      extractJoke: (({ joke }) => {
        return {
          text: joke,
          source: 'icanhazdadjoke.com',
        };
      }),
    },
  ],
};
