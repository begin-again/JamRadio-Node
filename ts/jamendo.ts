/*
   https://developer.jamendo.com/v3.0
*/


export module JamNet {
  const https = require('https');
  const qs = require('querystring');
  const Q = require('q');
  const extras = '&include=musicinfo+stats&groupby=artist_id&imagesize=25&limit=25';
  const urlRoot = 'https://api.jamendo.com/v3.0/';
  const clientID = process.env.JAM_CLIENTID;
  const urlSuffix = "&client_id=" + clientID + "&format=json";
  enum jamResultCodes {'success', 'exception', 'unsupported', 'type', 'missing'}

  /**
   * Retrieves content from Jamendo.com
   * @param  {string}   url
   * @param  {number}   limit max items to return
   * @return {*}      object literal
   */
  export function fetch(url:string, limit:number = 50){
    let prm = Q.defer();
    if( !url.match(/([?])/) ) {
      prm.reject({error: true, msg: 'missing query', url: url });
      return prm.promise;
    }

    try {
      https.get(url, (res) => {
        let statusCode = res.statusCode;
        let rawData = '';
        if (statusCode !== 200) {
          prm.reject({error: true, msg: 'status code: ' + statusCode, url: url })
          return prm.promise;
        }

        res.setEncoding('utf8');
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
          try {
            let parsedData = JSON.parse(rawData);
            prm.resolve({error: false, msg: 'ok', data: parsedData, url: url});
          } catch (e) {
            prm.reject({error: true, msg: e.message, url: url });
          }
        });
      });
     } catch(e) {
       prm.reject({error: true, msg: e.message, url: url });
     }
     return prm.promise;
  }

  // Album Tracks
  export function urlAlbumTracks(albumID:number):string {
    let id = qs.escape(albumID);
    let url =  "albums/tracks/?id=" + albumID + "&imagesize=200";
    return urlRoot + url + urlSuffix;
  }

  // Artist Search
  export function urlArtistSearch(artistName:string, sortBy:string, hasImage:boolean = true, offset:number = 0):string {
    let name = artistName.split(' ').map(qs.escape).join('+');
    let sb;
    if ( sortBy.match(/listen/i) || sortBy.match(/download/i) ) {
      sb = qs.escape(sortBy) + "_desc";
    } else {
      sb = qs.escape(sortBy);
    }
    let img = hasImage ? "&hasimage=true" : "";
    let o = offset > 0 ? ("&offset=" + offset) : "";
    let url= "artists?namesearch=" + name + "&order=" + sb + "&limit=20" + img + o;
    return urlRoot + url + urlSuffix;
  }

  // Artist Albums
  export function urlArtistAlbums(artistID:number):string {
    let id = qs.escape(artistID);
    let url = "artists/albums/?id=" + id + "&imagesize=50";
    return urlRoot + url + urlSuffix;
  }

  // Artist Info
  export function urlArtistInfo(artistID:number):string {
    let id = qs.escape(artistID);
    let url = "artists/musicinfo/?id=" + id;
    return urlRoot + url + urlSuffix;
  }

  // Fuzzy Tag Track Search
  export function urlTrackSearchTagFuzzy(tagName:string, boost:string, offset:number = 0):string {
    let name = tagName.split(' ').join('+');
    let s;
    if ( boost.match(/listen/i) || boost.match(/download/i) ) {
      s = qs.escape(boost) + "_desc";
    } else {
      s = qs.escape(boost);
    }
    let o = offset > 0 ? ("&offset=" + offset) : "";
    let url = "tracks/?fuzzytags=" + name + "&boost=" + boost + extras + o;
    return urlRoot + url + urlSuffix;
  }

  /**
   * Strict Tag Track Search
   * @param  {string}    tagName
   * @param  {string}    order
   * @param  {number}    offset
   * @return {string}
   */
  export function urlTrackSearchTag(tagName:string, order:string, offset:number = 0):string {
    let name = tagName.split(' ').join('+');
    let s;
    if ( order.match(/listen/i) || order.match(/download/i) ) {
      s = qs.escape(order) + "_desc";
    } else {
      s = qs.escape(order);
    }

    let o = offset > 0 ? ("&offset=" + offset) : "";
    let url =  "tracks/?tags=" + name + "&order=" + s + extras + o;
    return urlRoot + url + urlSuffix;
  }

  // Name Track Search
  export function urlTrackSearchName(trackName:string, sortBy:string, offset:number = 0):string {
    let name = qs.escape(trackName).split(' ').join('+');
    let s;
    if ( sortBy.match(/listen/i) || sortBy.match(/download/i) ) {
      s = qs.escape(sortBy) + "_desc";
    } else {
      s = qs.escape(sortBy);
    }
    let o = offset > 0 ? ("&offset=" + offset) : "";
    let url = "tracks/?namesearch=" + name + "&order=" + s + extras + o;
    return urlRoot + url + urlSuffix ;
  }

  export function urlAlbums(artistID:number):string {
    let id = qs.escape(artistID);
    let url = "albums/?artist_id=" + artistID + "&imagesize=50&order=releasedate_desc";
    return urlRoot + url + urlSuffix;
  }
}
