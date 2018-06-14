// Jamendo API functions
/* jshint mocha: true */
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;
var jamRoot = "https://api.jamendo.com/v3.0/";
var jamSuffix = "&client_id=56d30c95&format=json";
var jam = require('../lib/jamendo.js').JamNet;
var nock = require('nock');
var url = "";
var baseUrl = "https://api.jamendo.com/v3.0/?";
nock.disableNetConnect();

describe('Jamendo API', function(){
  describe('URL Getters', function(){
    describe('urlAlbumTracks()', function(){
      it('should be a string /100/', function(){
        expect(jam.urlAlbumTracks(100) ).to.have.string("100");
      });
    });
    describe('urlArtistInfo', function(){
      it('should have a string', function(){
        expect( jam.urlArtistInfo(1) ).to.have.string("artists/musicinfo/?id=1&");
      });
    });
    describe('urlArtistSearch()', function(){
      it('should not have /hasImage/ when hasImage=false', function(){
        expect( jam.urlArtistSearch('test','test',false) ).to.not.have.string('hasimage=true');
      });
      it('should include /hasImage/ when hasImage is not specified', function(){
        expect( jam.urlArtistSearch('test','test') ).to.have.string('hasimage=true');
      });
      it('should include /hasImage/ when hasImage=true ', function(){
        expect( jam.urlArtistSearch('test','test',true) ).to.have.string('hasimage=true');
      });
      it('should have string /artists?namesearch=test&order=test/', function(){
        expect( jam.urlArtistSearch('test','test',false) ).to.have.string("artists?namesearch=test&order=test");
      });
      it('should include /offset/ when offset > 0', function(){
        expect( jam.urlArtistSearch('test','test',false,10) ).to.have.string('offset=10');
      });
      it('should not include /offset/ when offset <= 0', function(){
        expect( jam.urlArtistSearch('test','test',false,-1) ).to.not.have.string('offset=');
      });
    });
    describe('urlArtistAlbums()', function(){
      it('should have string ', function(){
        expect(jam.urlArtistAlbums(1) ).to.have.string("artists/albums/?id=1&");
      });
    });
    describe('urlTrackSearchTagFuzzy()', function(){
      it('should include /boost/', function(){
        expect( jam.urlTrackSearchTagFuzzy('test','test') ).to.have.string('boost');
      });
      it('should have string /tracks/?fuzzytags=test&boost=test&/', function(){
        expect( jam.urlTrackSearchTagFuzzy('test','test') ).to.have.string("tracks/?fuzzytags=test&boost=test&");
      });
      it('should include /offset/ when offset > 0', function(){
        expect( jam.urlTrackSearchTagFuzzy('test','test',10) ).to.have.string('offset=10');
      });
      it('should NOT include /offset/ when offset <= 0', function(){
        expect( jam.urlTrackSearchTagFuzzy('test','test',0) ).to.not.have.string('offset=');
      });
    });
    describe('urlTrackSearchTag()', function(){
      it('should have string /tracks/?tags=test&order=test&/', function(){
        expect( jam.urlTrackSearchTag('test','test') ).to.have.string("tracks/?tags=test&order=test&");
      });
      it('should include /offset/ when offset > 0', function(){
        expect( jam.urlTrackSearchTag('test','test',10) ).to.have.string('offset=10');
      });
      it('should not include /offset/ when offset <= 0', function(){
        expect( jam.urlTrackSearchTag('test','test',0) ).to.not.have.string('offset=');
      });
    });
    describe('urlTrackSearchName()', function(){
      it('should have string /tracks/?namesearch=test&order=test&/', function(){
        expect( jam.urlTrackSearchName('test','test') ).to.have.string("tracks/?namesearch=test&order=test&");
      });
      it('should include /offset/ when offset > 0', function(){
        expect( jam.urlTrackSearchName('test','test',10) ).to.have.string('offset=10');
      });
      it('should not include /offset/ when offset <= 0', function(){
        expect( jam.urlTrackSearchName('test','test',0) ).to.not.have.string('offset=');
      });
    });
  });
  describe('fetch()', function() {
    before(function(){
      nock.cleanAll(); //
    });
    describe('Top Level Exceptions', function(){
      it('should set /err/ to true when url is bogus', function(done){
        nock(baseUrl).get('/').query(true)
        jam.fetch('fail').catch(function(result) {
          expect( result.error ).to.be.true;
          done();
        });
      });
      it('should have a /msg/ when url is bogus', function(done){
        jam.fetch('fail').catch(function(result) {
          expect( result.msg ).to.not.be.equal('ok');
          done();
        });
      });
      it('should have a /url/ when url is bogus', function(done){
        jam.fetch('xx123xx').catch(function(result) {
          expect( result.url ).to.have.string('xx123xx');
          done();
        });
      });
    });
    describe('functionality within the https request', function(){
      after(function(){
        nock.cleanAll();
      });
      it('should have /msg: status code: 500/', function(done){
        nock(baseUrl)
          .get('/')
          .query(true)
          .reply('500');
        jam.fetch(baseUrl).catch(function(result) {
          expect( result.error ).to.be.true;
          done();
        });
      });
      it('should have /msg: ok/', function(done){
        nock(baseUrl)
        .get('/').query(true)
        .reply('200', {data: []});
        jam.fetch(baseUrl).then(function(result) {
          expect( result.msg ).to.have.string("ok");
          done();
        });
      });
    });
  });
});
