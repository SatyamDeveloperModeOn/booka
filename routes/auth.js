// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '723086568029279', // your App ID
        'clientSecret'    : 'c52e9994ea34cddfc957e3bbcfa66909', // your App Secret
        'callbackURL'     : 'http://localhost:3000/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields'   : ['id', 'email', 'name'] // For requesting permissions from Facebook API

    },

    'googleAuth' : {
        'clientID'         : '876259512398-21jj25hl6r2ujnbf0etvmogj01u3lcu2.apps.googleusercontent.com',
        'clientSecret'     : 'a-bTkzm1Tg0tb5AZYT8KgaJP',
        'callbackURL'      : 'http://localhost:3000/users/auth/google/callback'
    }

};
