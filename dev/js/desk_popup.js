/*
part of soundsdope v2 desk - jquery library / Copyright (c) 2015 Dope Inc.
handles popup UI functions:
- display/hide/change popup
- display/hide/change screenup
- fills album popup
*/

$lc_referer = "";

$(function () {

  $("#open_desk").addClass("active");

});

$("#open_desk").click(function () {
  screenup("desk"); // opens desk
});
$("#open_cloud").click(function () {
  screenup("cloud"); // opens desk
});
$("#open_playlist").click(function () {
  screenup("playlist"); // opens desk
});

function screenup(id) {
  switch (id) {
    case "desk":
    $("#desk_view").addClass("flyin");
    $("#cloud_view").addClass("flyout");
    $("#playlist_view").addClass("flyout");

    $("#desk_view").removeClass("flyout");
    $("#cloud_view").removeClass("flyin");
    $("#playlist_view").removeClass("flyin");

    $("#open_desk").addClass("active");
    $("#open_cloud").removeClass("active");
    $("#open_playlist").removeClass("active");
    break;
    case "cloud":
    $("#desk_view").addClass("flyout");
    $("#cloud_view").addClass("flyin");
    $("#playlist_view").addClass("flyout");

    $("#desk_view").removeClass("flyin");
    $("#cloud_view").removeClass("flyout");
    $("#playlist_view").removeClass("flyin");

    $("#open_desk").removeClass("active");
    $("#open_cloud").addClass("active");
    $("#open_playlist").removeClass("active");
    break;
    case "playlist":
    $("#desk_view").addClass("flyout");
    $("#cloud_view").addClass("flyout");
    $("#playlist_view").addClass("flyin");

    $("#desk_view").removeClass("flyin");
    $("#cloud_view").removeClass("flyin");
    $("#playlist_view").removeClass("flyout");

    $("#open_desk").removeClass("active");
    $("#open_cloud").removeClass("active");
    $("#open_playlist").addClass("active");
    break;
  }
}

function close_popup() {
  if($("#album_browser").hasClass("popin")) {
    $("#album_browser").addClass("popout");
    $("#album_browser").removeClass("popin");
    block_off();
  }
}

function album_popup2(id) {
  $.ajax({
    method: "POST",
    url: "php/filter/filter.php",
    data: { album: id }
  })
  .done(function( msg ) {
    json_errorcheck(msg);

    var entries = JSON.parse(msg);

    $("#album_info").data("id", id);
    $("#album_content").empty();
    $("#coverview_info_cover").attr("src", "php/stream/image.php?id="+id);
    $("#coverview_info_artist").html(entries[0].artist);
    $("#coverview_info_albumname").html(entries[0].title);
    $.each(entries, function(index, entry) {
      $('<li/>').data('song-id', entry.id).html('<div class="playing">'+entry.track+'</div><div class="title">'+entry.name+'</div><div class="rc" data-action="popup_track"><i class="material-icons">more_horiz</i></div><div class="duration">'+entry.playtime+'</div>').appendTo("#album_content");
    });
    $("#album_browser").removeClass("popout");
    $("#album_browser").addClass("popin");
    playing();
    block_on();
  });
}

$( document ).on( "contextmenu", "#album_content > li", function(event) {
  $rc_referer = $(this);
  rightclick_popup(event, 'popup_track');
  return false;
});

function album_fill(id, data, artist, title) {
  $("#album_info").data("id", id);

  //popup closed
  $("#album_content").empty();
  $("#coverview_info_cover").attr("src", "php/stream/image.php?id="+id);
  $("#coverview_info_artist").html(artist);
  $("#coverview_info_albumname").html(title);
  $("#album_content").append(data);
  $("#album_browser").removeClass("popout");
  $("#album_browser").addClass("popin");
  playing();
  block_on();
}

function block_on() {
  $(".block").attr("id", "block_active");
}
function block_off() {
  $(".block").attr("id", "");
}
