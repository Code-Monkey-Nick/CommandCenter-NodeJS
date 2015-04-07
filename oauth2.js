//jshint node:true
"use strict";

var OAuth2 = require("oauth").OAuth2,
    oauth2;

// Live
oauth2 = new OAuth2(
    "F6419F7D-8ACA-5243-A961-FD7EF955C5E8", // Client ID
    "D0761535-41F8-47C4-8D23-BAC5A7F8F166", // Client Secret
    "https://account.guildwars2.com",
    "/oauth2/authorization",
    "/oauth2/token"
);

// Have to auth for every type of request
oauth2.useAuthorizationHeaderforGET(true);

module.exports = oauth2;