module.exports = {

	'facebookAuth' : {
		'clientID' 		: 1425423071053526,//'your-secret-clientID-here', // your App ID
		'clientSecret' 	: 'b745b88c68deb10aaadb606842d2fb11',//'your-client-secret-here', // your App Secret
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