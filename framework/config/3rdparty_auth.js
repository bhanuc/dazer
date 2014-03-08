module.exports = {

	'facebookAuth' : {
		'clientID' 		: 670657392948407,//'your-secret-clientID-here', // your App ID
		'clientSecret' 	: '1beefd26e84f7e7adb4eb8a371c41af8',//'your-client-secret-here', // your App Secret
		'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:3000/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://localhost:3000/auth/google/callback'
	}

};