var app = require('../index');
var request = require('supertest').agent(app.listen());


describe('GET /',function(){
  it('should return 200 OK', function(done){
    request
      .get('/')
      .expect(200, done);
  });
});

describe('GET /login',function() {
  it('should return 200 OK', function(done){
    request
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup',function() {
  it('should return 200 OK', function(done){
    request
      .get('/signup')
      .expect(200, done);
  });
});


describe('GET /contact',function() {
  it('should return 200 OK', function(done){
    request
      .get('/contact')
      .expect(200, done);
  });
});

describe('GET /bad-url',function() {
  it('should return 404', function(done){
    request
      .get('/reset')
      .expect(404, done);
  });
});