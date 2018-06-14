var express = require('express')
  , jam = require('../lib/jamendo.js').JamNet
  , router = express.Router()
  ;

// TRACKS
router.get('/tracks', function(req, res, next) {
  res.render(
    'form_track_search',{title: 'Find Tracks'}
  );
});

router.post('/tracks', function(req, res, next) {
  var url;
  if (req.body.searchType === "Name") {
    url = jam.urlTrackSearchName(req.body.inputText, req.body.sort_by);
  } else {
    if (req.body.isFuzzy === "Yes") {
      url = jam.urlTrackSearchTagFuzzy(req.body.inputText, req.body.sort_by);
    } else {
      url = jam.urlTrackSearchTag(req.body.inputText, req.body.sort_by)
    }
  }
  jam.fetch(url)
    .then(function(o){
      // o contains the fetch result
      res.render('tracks_found', {title: 'Tracks', header: o.data.headers, tracks: o.data.results } );
    })
    .catch(function(e){
      console.error(e);
    });

});

// ALBUMS
router.get('/album/:id', function(req, res, next) {
  var url = jam.urlAlbumTracks( req.params["id"] );
  jam.fetch(url)
    .then(function(o){
      res.render('album', {
          title: 'Album',
          header: o.data.headers,
          album: o.data.results[0]
        }
      );
    })
    .catch(function(o){
      res.send("error: " + o.msg);
    });
});

// ARTIST
router.get('/artists', function(req, res, next) {
  res.render(
    'form_artist_search',{title: 'Find Artist'}
  );
});

router.post('/artists', function(req, res, next) {
  // url varies based on params
  var url = jam.urlArtistSearch( req.body.ArtistName, req.body.SortType);
  jam.fetch(url,30)
    .then(function(o){
      res.render('artist_found', {title: 'Artists', error: o.error, msg: o.msg, header: o.data.headers, artists: o.data.results} );
    })
    .catch(function(e){
      console.error(e);
    });
});

router.get('/artist/:id', function(req, res, next) {
  var url = jam.urlArtistAlbums( req.params.id );
  console.info(url);
  jam.fetch(url)
    .then(function(o){
      var artist = null;
      if (o.data.results.length > 0) {
        artist = o.data.results[0];
      }

      res.render('artist', {
        title: 'Artist',
        header: o.data.headers,
        artist: artist }
      );
    })
    .catch(function(e){
      console.error(e);
    })
});

router.get('/artist/:id/info', function(req, res) {
  var urlArtist = jam.urlArtistInfo( req.params.id );
  console.info("urlArtist: " + urlArtist);
  jam.fetch(urlArtist)
    .then(function(o){
      var info = {};
      if (o.data.results ) {
        if (o.data.results.length > 0) {
          info["artistInfo"] = o.data.results[0];
        }
        info["header"] = o.data.headers
      }
      info["error"] = o.error
      info["msg"] = o.msg
      info["url"] = o.url

      res.render( '_artist_info', info);
    })
    .catch(function(e){
      console.error(e);
    });
});

router.get('/artist/:id/albums', function(req, res) {
  var urlAlbums= jam.urlAlbums( req.params.id );
  console.info("urlAlbums: " + urlAlbums);
  jam.fetchAsyc(urlAlbums, 30)
    .then(function(o){
      var info = {};
      if (o.data.results) {
        if (o.data.results.length > 0) {
          info["albums"] = o.data.results;
        }
        info["header"] = o.data.headers
      }
      info["error"] = o.error
      info["msg"] = o.msg
      info["url"] = o.url
      res.render( '_artist_albums', info);
    })
    .catch(function(e){
      console.error(e);
    });
});


// HOME
router.get('/', function(req, res, next) {
  res.render(
    'form_track_search',{title: 'Find Tracks'}
  );
});

module.exports = router;
