
const AuthenticationClient = require('auth0').AuthenticationClient;

let token;

module.exports = {
    getAuthManToken: async () => {   
        if(token){
            return token;
        }
        const auth0 = new AuthenticationClient({
            domain: process.env.AUTH_DOMAIN,
            clientId: process.env.AUTH_MAN_CLIENT_ID,
            clientSecret: process.env.AUTH_MAN_CLIENT_SECRET,
        });   

        const tok = await auth0.clientCredentialsGrant(
            {
                audience: `${process.env.AUTH_ISSUER_BASE_URL}/api/v2/`,
                scope: `read:users update:users`
            }
        ).then((response, err) => {
            if(err){
                console.error(err);
            }
            if(response){
                return response.access_token;
            }
        });
        token = tok;
        return token;
    }
}