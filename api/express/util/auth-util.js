const AuthenticationClient = require('auth0').AuthenticationClient;

let token;
const auth0 = new AuthenticationClient({
    domain: process.env.AUTH_DOMAIN,
    clientId: process.env.AUTH_MAN_CLIENT_ID,
    clientSecret: process.env.AUTH_MAN_CLIENT_SECRET,
});
auth0.clientCredentialsGrant(
    {
        audience: `${process.env.AUTH_ISSUER_BASE_URL}/api/v2/`,
        scope: `read:users update:users`
    }
).then((response, err) => {
    if(err){
        console.error(err);
    }
    if(response){
        token = response.access_token;
    }
})

module.exports = {
    getAuthManToken: () => {       
        return token;
    }
}