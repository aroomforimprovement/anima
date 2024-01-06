# animator-app

* React frontend for p5.js animation creation web-app

Initially created with create-react-app, updated using react-app-rewired.
Backend reconfigured from Express app to netlify functions

## Launch

`cd '/api/'`
`netlify dev`
`cd ..`
`yarn start`

Access [http://localhost:[port]](http://localhost:[port])

## ENV VARS - api

AUTH_REQ=false
AUTH_OUT=true
AUTH_APP_NAME=
AUTH_BASE_URL=
AUTH_CLIENT_ID=
AUTH_SECRET=
AUTH_ISSUER_BASE_URL=
AUTH_DOMAIN=
AUTH_AUDIENCE=
AUTH_MAN_CLIENT_ID=
AUTH_MAN_CLIENT_SECRET=
DB_URL_I=
DB_URL_II=
DB_NAME=
DB_USER=
DB_PW=
DB_RS_NAME=
PORT=
UNSECURE_LISTEN_PORT=
TEST_BASE_URL=
SSL_KEY= 
SSL_CERT=

## ENV VARS - app 

REACT_APP_URL=
REACT_APP_AUTH_REQ=
REACT_APP_AUTH_OUT=
REACT_APP_AUTH_APP_NAME=
REACT_APP_AUTH_SECRET=
REACT_APP_AUTH_BASE_URL=
REACT_APP_AUTH_CLIENT_ID=
REACT_APP_AUTH_DOMAIN=
REACT_APP_API_URL=
REACT_APP_LOCAL_API_URL=
REACT_APP_AUTH_AUDIENCE=
REACT_APP_AUTH_SCOPE=openid profile email
REACT_APP_PROXY_URL=
REACT_APP_SSL_KEY=
REACT_APP_SSL_CERT=
REACT_APP_LOCAL_SECRET=
