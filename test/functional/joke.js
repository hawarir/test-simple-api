require('chai').should();
const { initServer } = require('../utils');

describe('joke', () => {
  let app;
  let server;

  before(async () => {
    ({ server, app } = await initServer());
  });

  context('CRUD', () => {
    it('should get joke', async () => {
      const res = await server
        .get('/api/jokes/1')
        .expect(200);

      res.body.should.have.property('id', 1);
      res.body.should.have.property('text', 'How does a computer get drunk? It takes screenshots.');
    });

    it('should list jokes', async () => {
      const res = await server
        .get('/api/jokes')
        .expect(200);

      res.body.length.should.equal(10);
    });

    it('should store new joke', async () => {
      const res = await server
        .post('/api/jokes')
        .send({ text: 'new joke' })
        .expect(200);
      const joke = await app.models.Joke.findById(res.body.id);
      await app.models.Joke.deleteById(res.body.id);

      res.body.should.have.property('id');
      joke.should.have.property('id', res.body.id);
      joke.should.have.property('text', res.body.text);
    });

    it('should not store duplicate jokes', async () => {
      const resFirst = await server
        .post('/api/jokes')
        .send({ text: 'same old joke' })
        .expect(200);
      const resSecond = await server
        .post('/api/jokes')
        .send({ text: 'same old joke' })
        .expect(200);
      await app.models.Joke.deleteById(resFirst.body.id);

      resFirst.body.should.have.property('id');
      resSecond.body.should.have.property('id', resFirst.body.id);
    });

    it('should update joke', async () => {
      const joke = await app.models.Joke.create({
        text: 'joke to be updated',
      });
      await server
        .put('/api/jokes')
        .send({
          id: joke.id,
          text: 'joke that was updated',
        })
        .expect(200);
      const res = await server
        .get(`/api/jokes/${joke.id}`)
        .expect(200);
      await app.models.Joke.deleteById(res.body.id);

      res.body.should.have.property('id', joke.id);
      res.body.should.have.property('text', 'joke that was updated');
    });

    it('should delete joke', async () => {
      const joke = app.models.Joke.create({
        text: 'joke to be deleted',
      });

      const resBefore = await server
        .get(`/api/jokes/${joke.id}`)
        .expect(200);
      const resDel = await server
        .delete(`/api/jokes/${joke.id}`)
        .expect(200);
      const resAfter = await server
        .get(`/api/jokes/${joke.id}`)
        .expect(200);

      resBefore.body.should.have.property('id', joke.id);
      resDel.body.should.have.property('count', 1);
      resAfter.should.have.property('body', null);
    });
  });

  context('text', () => {
    it('should get words from joke', async () => {
      const joke1 = await app.models.Joke.findById('1');
      const words1 = joke1.words();

      words1.should.contain('how');
      words1.should.contain('drunk');
      words1.should.contain('screenshots');

      const joke2 = await app.models.Joke.findById('6');
      const words2 = joke2.words();

      words2.should.contain('programmer');
      words2.should.contain('while');
      words2.should.contain('milk');
    });

    it('should get all words in the stored jokes', async () => {
      const res = await server
        .get('/api/jokes/extract/words')
        .expect(200);

      res.body.should.contain('how');
      res.body.should.contain('drunk');
      res.body.should.contain('screenshots');
      res.body.should.contain('programmer');
      res.body.should.contain('while');
      res.body.should.contain('milk');
    });
  });
});
