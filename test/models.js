const chai = require('chai');
const expect = chai.expect;
const User = require('../model/user').User;

describe('User Model', function() {
    it('should create a new user', function(done) {
        const user = new User({
            email: 'test@gmail.com',
            password: 'password'
        });
        user.save((err) => {
            expect(err).to.be.null;
            expect(user.email).to.equal('test@gmail.com');
            done();
        });
    });


    it('should find user by email', function(done) {
        User.findOne({
            email: 'test@gmail.com'
        }, (err, user) => {
            expect(err).to.be.null;
            expect(user.email).to.equal('test@gmail.com');
            done();
        });
    });

    it('should delete a user', function(done) {
        User.remove({
            email: 'test@gmail.com'
        }, (err) => {
            expect(err).to.be.null;
            done();
        });
    });
});