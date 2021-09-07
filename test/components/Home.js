import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { expect } from 'chai';
import Home from '../../src/components/Home';

let jsdom = require('mocha-jsdom');

global.document = jsdom({
    url: 'http://localhost:3001/'
})

let testContainer;


beforeEach(() => {
    testContainer = document.createElement('div');
    document.body.appendChild(testContainer);
});

afterEach(() => {
    document.body.removeChild(testContainer);
    testContainer = null;
});

describe('Home component', () => {
    it('Renders the app greeting text', () => {
        act(() => {
            ReactDOM.render(<Home />, testContainer);
        });
        const heading = testContainer.querySelector('h3');
        expect(heading.textContent).to.equal("Welcome to Animator");
    });
});