var queryString = require('querystring');
var https = require('https');

// Token Endpoint
var hostUrl = "developer.softheon.com";
var tokenEndpointPath = "/IdentityServer3.WebHost/core/connect/token";

// Example Client Credentials
var clientId = "3177AF10D71D4287BC0A8C8946F0BB75";
var clientSecret = "17CA89F45D5E4E21926192ACD3D2B151";
var scope = "exampleapi";

requestAccessToken(hostUrl, tokenEndpointPath, clientId, clientSecret, scope);

/**
 * Gets an Access Token from the token endpoint URI using the given Client ID and Client Secret.
 */
function requestAccessToken(hostUrl, tokenEndpointPath, clientId, clientSecret, scope)
{
    var encodedClientCredentials = encodeClientCredentials(clientId, clientSecret);

    // Set the post data
	var postData = queryString.stringify({
        'grant_type' : 'client_credentials',
        'scope' : scope    
    });

    // Set the post options
    var postOptions = {
        host: hostUrl,
        port: '443',
        path: tokenEndpointPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': 'Basic ' + encodedClientCredentials
        }
    };

    // Set the post request
    var postRequest = https.request(postOptions, function(res)
    {
        var data = '';

        res.setEncoding('utf8');

        res.on('data', function (chunk){
            console.log("Response:")
            console.log(chunk);

            console.log("\nDecoded Access Token:")
            console.log(decodeAccessToken(chunk));
        });
    });

    postRequest.write(postData);
    postRequest.end();
}

/**
 * Returns the access token's decoded Header and Claims.
 */
function decodeAccessToken(response)
{    
    var jsonResponse = JSON.parse(response);

    // Get the access token from the response
    var accessToken = jsonResponse['access_token'];

    if (accessToken == undefined) {
        return "No token";
    }

    // Split the JWT
    var encodedAccessToken = accessToken.split('.');
    var decodedAccessToken = [];
    
    // Only decode the Header and Claims
    for (i = 0; i < 2; i++) {
        decodedAccessToken[i] = new Buffer(encodedAccessToken[i], 'base64').toString();
    }

    return decodedAccessToken;
}

/**
 * Concats together the Client ID and Client Secret and then base64 encodes them. 
 */
function encodeClientCredentials (clientId, clientSecret)
{
    var clientCredentials = clientId + ':' + clientSecret;
    return new Buffer(clientCredentials).toString('base64');
}