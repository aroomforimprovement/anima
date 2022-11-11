/* eslint-disable no-undef */
const expect = require('chai').expect;
const request = require('request');

const url = 'http://localhost:3000/anim/';
const animGetId = '123456';
const testPostBody = { "animid": "123456", "userid" : "123456789012345678901111", 
    "name": "My Awesome Animation", "type": "animation", "created": "2016-08-29T09:12:33.001Z",
    "modified": "2016-08-29T09:12:33.001Z", "frate": 24, "size": 0, "privacy": 0, "frames": [ { "fid": 0, "animid": "123456", "points": [
          { "x": 0, "y": 0, "pen": "color(100)", "ps": 7, "m": 104 } ] } ] }

describe('Routes/Anim', () => {

    describe('/anim POST', () => {
        it('returns status 201', () => {
            request.post({
                body: JSON.stringify({ testPostBody}),
                headers: {'Content-Type': 'application/json'},
                url: url
            }, (error, response) => {
                if(error){
                    console.error(error);
                }
                if(response){
                    expect(response.statusCode).to.equal(201);
                }
            });
        });
    });

    describe('/anim GET', () => {

        it('returns status 200', () => {
            request(`${url}${animGetId}`, (error, response) => {
                expect(response.statusCode).to.equal(200);
            });
        });

        it('returns a valid anim object', () => {
            request(`${url}${animGetId}`, (error, response) => {
                const body = JSON.parse(response.body);
                expect(body).to.have.property('animid');
                expect(body).to.have.property('name');
                expect(body).to.have.property('userid')
                expect(body).to.have.property('type');
                expect(body).to.have.property('created');
                expect(body).to.have.property('modified');
                expect(body).to.have.property('frate');
                expect(body).to.have.property('size');
                expect(body).to.have.property('privacy');
                expect(body).to.have.property('frames');
            });
        });

    });

    describe('/anim PUT', () => {

        it('returns status 201 and has added a frame', () => {
            request.put(`${url}${animGetId}`, (error, response)  => {
                expect(response.statusCode).to.equal(201);
                const body = JSON.parse(resposne.body);
                expect(body).to.have.nested.property('frames[1]');
            });
        });

    });

    describe('/anim DELETE', () => {
        it('returns status 201', () => {
            request.delete(`${url}${animGetId}`, (error, response) => {
                expect(response.statusCode).to.equal(201);
            });
        });
    });
});