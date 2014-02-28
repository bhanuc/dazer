var request = require('supertest');
var assert = require('assert');
var http = require('http');
var dazer = require('../app');

describe('dazer starts', function(){
     it('respond with 200', function(done){
request(dazer.listen())
  .get('/')
  .expect(200, done)
 
})
})