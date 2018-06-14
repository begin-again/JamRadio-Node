var audioSection = $('section#audio');
var trackInfo = $('#info');

function setListeners() {
  $('.tracks tbody tr td').not('.dl, .artist, .album, .row').on('click', function() {

    var audio = $('<audio>', {
         controls : 'controls',
         autoplay : 'autoplay',
         loop : 'loop'
    });

    // from the td get into the row; find the a.html element
    var track_item = $(this).parent();
    var url = $(track_item).data('audio');
    var play_name = $(track_item).data('playing');
    var artist_name = $(track_item).data('artist-name');
    var artist_id =  $(track_item).data('artist-id');
    trackInfo.html('<p><span class="track_name">' + play_name +
      '</span></a><span>&nbsp;by&nbsp;</span><a href="/artist/'+ artist_id + '"><span class="artist_name">' +  artist_name + '</span></a></p>');
    $('<source>').attr('src', url).appendTo(audio);
    audioSection.html(audio);
    return false;
  });
  $('#artists-found tbody tr td').not('td > a').on('click', function(){
    var id = $(this).parent().data('artist-id');
    document.location.href = "/artist/" + id;
  });
  $('table.albums tbody tr td').on('click', function(){
    var id = $(this).parent().data('album-id');
    document.location.href = "/album/" + id;
  });
}

function getTracks(direction) {
  var url = '/tracks/next/' + direction;
  console.log("getTracks => " + url);
  $.ajax({
      type: 'post',
      url: url,
      dataType: 'html',
      timeout: 10000,
      async: true,

      success: function(data, textStatus, jqXHR)
      {
          replaceTracks(data);
      },
      error: function(data, textStatus, jqXHR) {
          console.log(textStatus);
      }
  });
}
// replace existing tbody
function replaceTracks(data) {
  $('table.tracks tbody').html(data);
  setListeners();
}

setListeners();
