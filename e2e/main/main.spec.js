'use strict';

//describe('Main View', function() {
//  var page;
//
//  //Pre-generated
//  beforeEach(function() {
//    browser.get('/');
//    page = require('./main.po');
//  });
//
//  it('should include jumbotron with correct data', function() {
//    expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
//    expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/);
//    expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
//  });
//
//Added by Dalton
//  browser.get('main.html');
//
//  it('should blah blah blah', function() {
//     expect(browser.getLocationAbsUrl()).toMatch('/');
//  });
//
//
//  describe('login', function() {
//       it('should redirect to login page', function() {
//         expect(browser.getLocationLogin()).toMatch(';')
//       });
//
//  });
//
//});

describe('Test get title', function() {
    it('should have a title lawl', function() {
       browser.get('http://localhost:9000/');

       expect(browser.getTitle()).toEqual('http://localhost:9000/');
       //https://ursa-major.herokuapp.com/
    });
});
