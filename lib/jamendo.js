"use strict";
/*
   https://developer.jamendo.com/v3.0
*/
Object.defineProperty(exports, "__esModule", { value: true });
var JamNet;
(function (JamNet) {
    var https = require('https');
    var qs = require('querystring');
    var Q = require('q');
    var extras = '&include=musicinfo+stats&groupby=artist_id&imagesize=25&limit=25';
    var urlRoot = 'https://api.jamendo.com/v3.0/';
    var clientID = process.env.JAM_CLIENTID;
    var urlSuffix = "&client_id=" + clientID + "&format=json";
    var jamResultCodes;
    (function (jamResultCodes) {
        jamResultCodes[jamResultCodes["success"] = 0] = "success";
        jamResultCodes[jamResultCodes["exception"] = 1] = "exception";
        jamResultCodes[jamResultCodes["unsupported"] = 2] = "unsupported";
        jamResultCodes[jamResultCodes["type"] = 3] = "type";
        jamResultCodes[jamResultCodes["missing"] = 4] = "missing";
    })(jamResultCodes || (jamResultCodes = {}));
    /**
     * Retrieves content from Jamendo.com
     * @param  {string}   url
     * @param  {number}   limit max items to return
     * @return {*}      object literal
     */
    function fetch(url, limit) {
        if (limit === void 0) { limit = 50; }
        var prm = Q.defer();
        if (!url.match(/([?])/)) {
            prm.reject({ error: true, msg: 'missing query', url: url });
            return prm.promise;
        }
        try {
            https.get(url, function (res) {
                var statusCode = res.statusCode;
                var rawData = '';
                if (statusCode !== 200) {
                    prm.reject({ error: true, msg: 'status code: ' + statusCode, url: url });
                    return prm.promise;
                }
                res.setEncoding('utf8');
                res.on('data', function (chunk) { return rawData += chunk; });
                res.on('end', function () {
                    try {
                        var parsedData = JSON.parse(rawData);
                        prm.resolve({ error: false, msg: 'ok', data: parsedData, url: url });
                    }
                    catch (e) {
                        prm.reject({ error: true, msg: e.message, url: url });
                    }
                });
            });
        }
        catch (e) {
            prm.reject({ error: true, msg: e.message, url: url });
        }
        return prm.promise;
    }
    JamNet.fetch = fetch;
    // Album Tracks
    function urlAlbumTracks(albumID) {
        var id = qs.escape(albumID);
        var url = "albums/tracks/?id=" + albumID + "&imagesize=200";
        return urlRoot + url + urlSuffix;
    }
    JamNet.urlAlbumTracks = urlAlbumTracks;
    // Artist Search
    function urlArtistSearch(artistName, sortBy, hasImage, offset) {
        if (hasImage === void 0) { hasImage = true; }
        if (offset === void 0) { offset = 0; }
        var name = artistName.split(' ').map(qs.escape).join('+');
        var sb;
        if (sortBy.match(/listen/i) || sortBy.match(/download/i)) {
            sb = qs.escape(sortBy) + "_desc";
        }
        else {
            sb = qs.escape(sortBy);
        }
        var img = hasImage ? "&hasimage=true" : "";
        var o = offset > 0 ? ("&offset=" + offset) : "";
        var url = "artists?namesearch=" + name + "&order=" + sb + "&limit=20" + img + o;
        return urlRoot + url + urlSuffix;
    }
    JamNet.urlArtistSearch = urlArtistSearch;
    // Artist Albums
    function urlArtistAlbums(artistID) {
        var id = qs.escape(artistID);
        var url = "artists/albums/?id=" + id + "&imagesize=50";
        return urlRoot + url + urlSuffix;
    }
    JamNet.urlArtistAlbums = urlArtistAlbums;
    // Artist Info
    function urlArtistInfo(artistID) {
        var id = qs.escape(artistID);
        var url = "artists/musicinfo/?id=" + id;
        return urlRoot + url + urlSuffix;
    }
    JamNet.urlArtistInfo = urlArtistInfo;
    // Fuzzy Tag Track Search
    function urlTrackSearchTagFuzzy(tagName, boost, offset) {
        if (offset === void 0) { offset = 0; }
        var name = tagName.split(' ').join('+');
        var s;
        if (boost.match(/listen/i) || boost.match(/download/i)) {
            s = qs.escape(boost) + "_desc";
        }
        else {
            s = qs.escape(boost);
        }
        var o = offset > 0 ? ("&offset=" + offset) : "";
        var url = "tracks/?fuzzytags=" + name + "&boost=" + boost + extras + o;
        return urlRoot + url + urlSuffix;
    }
    JamNet.urlTrackSearchTagFuzzy = urlTrackSearchTagFuzzy;
    /**
     * Strict Tag Track Search
     * @param  {string}    tagName
     * @param  {string}    order
     * @param  {number}    offset
     * @return {string}
     */
    function urlTrackSearchTag(tagName, order, offset) {
        if (offset === void 0) { offset = 0; }
        var name = tagName.split(' ').join('+');
        var s;
        if (order.match(/listen/i) || order.match(/download/i)) {
            s = qs.escape(order) + "_desc";
        }
        else {
            s = qs.escape(order);
        }
        var o = offset > 0 ? ("&offset=" + offset) : "";
        var url = "tracks/?tags=" + name + "&order=" + s + extras + o;
        return urlRoot + url + urlSuffix;
    }
    JamNet.urlTrackSearchTag = urlTrackSearchTag;
    // Name Track Search
    function urlTrackSearchName(trackName, sortBy, offset) {
        if (offset === void 0) { offset = 0; }
        var name = qs.escape(trackName).split(' ').join('+');
        var s;
        if (sortBy.match(/listen/i) || sortBy.match(/download/i)) {
            s = qs.escape(sortBy) + "_desc";
        }
        else {
            s = qs.escape(sortBy);
        }
        var o = offset > 0 ? ("&offset=" + offset) : "";
        var url = "tracks/?namesearch=" + name + "&order=" + s + extras + o;
        return urlRoot + url + urlSuffix;
    }
    JamNet.urlTrackSearchName = urlTrackSearchName;
    function urlAlbums(artistID) {
        var id = qs.escape(artistID);
        var url = "albums/?artist_id=" + artistID + "&imagesize=50&order=releasedate_desc";
        return urlRoot + url + urlSuffix;
    }
    JamNet.urlAlbums = urlAlbums;
})(JamNet = exports.JamNet || (exports.JamNet = {}));
