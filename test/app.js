const app = require('../index');
const request = require('supertest').agent(app.listen());


describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request
      .get('/')
      .expect(200, done);
  });
});

describe('GET /login', () => {
  it('should return 200 OK', (done) => {
    request
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup', () => {
  it('should return 200 OK', (done) => {
    request
      .get('/signup')
      .expect(200, done);
  });
});


describe('GET /contact', () => {
  it('should return 200 OK', (done) => {
    request
      .get('/contact')
      .expect(200, done);
  });
});

describe('GET /bad-url', () => {
  it('should return 404', (done) => {
    request
      .get('/reset')
      .expect(404, done);
  });
});
