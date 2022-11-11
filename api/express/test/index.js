/* eslint-disable no-undef */
const expect = require('chai').expect;
const assert = require('chai').assert;
const request = require('request');

const url = 'http://localhost:3000/';


describe('Routes/Index', () => {
    
    describe("/", () => {
        it('returns status 200', () => {
            request(url, (error, response) => {
                expect(response.statusCode).to.equal(200);
            });
        });
        it('returns an object containing a bool for isAuthenticated', () => {
            request(url, (error, response) => {
                expect(JSON.parse(response.body)).to.have.property("isAuthenticated");
            });
        });
    });
    
});

describe('Routes/Login', () => {
    before(() => {
        const postUrl = `${url}signup`;
        request.post({
            body: JSON.stringify({
                "username": "Test Username",
                "email" : "fakemail@mymail.com",
                "userid": "123456789012345678901111"
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            url: postUrl
        }, (error, response) => {
            if(error){
                console.error(error);
            }
            if(response){
                return;
            }
        });
    });

    after(() => {    
        request(`${url}signup/delete/test`, (error, response) => {
            if(error){
                console.error(error);
            }
            if(response){
                console.log(response.statusCode);
            }
        });
    });

    describe('/login PUT', () => {
        const putUrl = `${url}login`;
        it('returns status 201', () => {
            request.put({
                body: JSON.stringify({
                    "userid": "123456789012345678901111"
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                url: putUrl
            }, (error, response) => {
                if(error){
                    console.error(error);
                }
                if(response){
                    expect(response.statusCode).to.equal(201);
                }
            })
        });
    });
});

describe('Routes/Logout', () => {
    before(() => {
        const postUrl = `${url}signup`;
        request.post({
            body: JSON.stringify({
                "username": "Test Username",
                "email" : "fakemail@mymail.com",
                "userid": "123456789012345678901111"
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            url: postUrl
        }, (error, response) => {
            if(error){
                console.error(error);
            }
            if(response){
                return;
            }
        });
    });

    after(() => {    
        request(`${url}signup/delete/test`, (error, response) => {
            if(error){
                console.error(error);
            }
            if(response){
                console.log(response.statusCode);
            }
        });
    });

    describe('/logout', () => {
        const putUrl = `${url}logout`;
        it('returns status 201', () => {
            request.put({
                body: JSON.stringify({
                    "userid": "123456789012345678901111"
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                url: putUrl
            }, (error, response) => {
                if(error){
                    console.log(error);
                }
                if(response){
                    expect(response.statusCode).to.equal(201);
                }
            })
        });
    });
});

describe('Routes/Signup', () => {

    after(() => {    
        request(`${url}signup/delete/test`, (error, response) => {
            if(error){
                console.error(error);
            }
            if(response){
                console.log(response.statusCode);
            }
        });
    });

    describe('/signup', () => {
        const postUrl = `${url}signup`;
            it('returns status 201', () => {
                request.post({
                    body: JSON.stringify({
                        "username": "Test Username",
                        "email" : "fakemail@mymail.com",
                        "userid": "123456789012345678901111"
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: postUrl
                }, (error, response) => {
                    if(error){
                        console.error(error);
                    }
                    if(response){
                        expect(response.statusCode).to.equal(201);
                        request(`${url}signup/delete/test`, function(error, response) {
                            if(error){
                                console.error(error);
                            }
                            if(response){
                                console.log(response.statusCode);
                            }
                        });
                    }
                });
                
            });
            it('returns a new Collection object', () => {
                request.post({
                    body: JSON.stringify({
                        "username": "Test Username",
                        "email" : "fakemail@mymail.com",
                        "userid": "123456789012345678901111"
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: postUrl
                }, (error, response, body) => {
                    if(error){
                        console.error(error);
                    }
                    if(response){
                        assert(typeof body == 'object');
                        expect(JSON.parse(body)).to.have.keys([
                            'userid', 'name', 'joined', 'privacy',
                            'contacts', 'anims', 'logins', 'logouts'
                        ]);
                        request(`${url}signup/delete/test`, (error, response) => {
                            if(error){
                                console.error(error);
                            }
                            if(response){
                                console.log(response.statusCode);
                            }
                        });
                    }
                });
                
            });
    });

});

