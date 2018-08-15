/*
part of soundsdope v2 desk - jquery library / Copyright (c) 2015 Dope Inc.
handles boot functions:
- checks for html5
- webstorage for saved albums (cookie fallback)
- notification
- loads webstorage
*/

var ls_custom = $.localStorage;
var globals_random = false;
var globals_repeat = 0;
var globals_notifications = false;
var globals_preload = false;

$(function () {

  if (screen.width <= 800) {
    window.location = "mobile.html";
  }

  //notifications
  if ("Notification" in window) {
    if ((Notification.permission !== 'denied') && (Notification.permission !== "granted")) {
      Notification.requestPermission(function (permission) {
        if (permission === "granted") {
          globals_notifications = true;
        }
      });
    }
  }

  // empty playlist
  var entries = {};
  var array = [];
  entries.playlist = array;
  $("#playlist_content").data("playlist", JSON.stringify(entries));

  // configuration
  //$.ajaxSetup({ async: false });

  // html5 webstorage
  if(ls_custom.isSet('soundsdope')) {
    reset_desk();
    var entries = ls_custom.get('soundsdope');
    $.each(entries.settings, function(index, entry) {
      settings_restore(entry.name, entry.value);
    });
  } else {
    var entries = {};
    var array = [];
    entries.albums = array;
    entries.playlists = array;
    entries.settings = array;
    ls_custom.set('soundsdope', JSON.stringify(entries));
    show_placeholder(3);
  }

  // perfectscrollbar
  $( "#album_content" ).perfectScrollbar();
  $( "#playlist_content" ).perfectScrollbar();

  // loader
  $("body").addClass("loaded");

});

function reset_desk() {
  $("#desk_content").empty();
  var check = true;
  var entries = ls_custom.get('soundsdope');
  $.each(entries.albums, function(index, entry) {
    desk_add_ui(entry.id, entry.artist, entry.title);
    check = false;
  });
  $.each(entries.playlists, function(index, entry) {
    playlist_save_ui(entry.ids, entry.title, entry.playlist);
    check = false;
  });
  if(check) {
    show_placeholder(3);
  }
}

/*function desk_add_ui(id, artist, title) {
$('<li/>').data('id', id).html('<div class="infos"><div class="field2">'+title+'</div><div class="field1">'+artist+'</div></div><img src="php/stream/image.php?id='+id+'"></img>').appendTo("#desk_content");
var text = '<li data-id="'+id+'" oncontextmenu="$rc_referer = $(this);rightclick_popup(event, \'desk_album\');return false;" onclick="$lc_referer = $(this);album_popup()" class="album"><div class="infos"><div class="field2">'+title+'</div><div class="field1">'+artist+'</div></div><img src="php/stream/image.php?id='+id+'"></img></li>';
$("#desk_content").append(text);
$("#desk_placeholder").css("display", "none");
}
function cloud_add_ui(id, artist, title) {
var text = '<li data-id="'+id+'" oncontextmenu="$rc_referer = $(this);rightclick_popup(event, \'cloud_album\');return false;" onclick="$lc_referer = $(this);album_popup()" class="album"><div class="infos"><div id="album_info_albumname" class="field2">'+title+'</div><div id="album_info_artist" class="field1">'+artist+'</div></div><img src="php/stream/image.php?id='+id+'"></img></li>';
$("#cloud_content").append(text);
}*/

function desk_add_ui(id, artist, title) {
  $('<li/>').data('id', id).data('action', 'desk_album').html('<div class="infos"><div class="field2">'+title+'</div><div class="field1">'+artist+'</div><div class="rc" data-action="album"><i class="material-icons">more_horiz</i></div></div><img src="php/stream/image.php?id='+id+'"></img>').appendTo("#desk_content");
  $("#desk_placeholder").css("display", "none");
}
function cloud_add_ui(id, artist, title) {
  $('<li/>').data('id', id).data('action', 'album').html('<div class="infos"><div class="field2">'+title+'</div><div class="field1">'+artist+'</div><div class="rc" data-action="album"><i class="material-icons">more_horiz</i></div></div><img src="php/stream/image.php?id='+id+'"></img>').appendTo("#cloud_content");
}

function desk_remove_ui() {
  $rc_referer.uiremove();
  if($.trim($("#desk_content").html())=='') {
    $("#desk_placeholder").css("display", "block");
  }
}

function playlist_save_ui(ids, title, playlist) {
  var covers = "";
  var amount = ids.length;
  switch (amount) {
    case 4:
    covers += '<div class="cover"><img src="php/stream/image.php?id='+ids[0]+'"></div>';
    covers += '<div class="cover"><img src="php/stream/image.php?id='+ids[1]+'"></div>';
    covers += '<div class="cover"><img src="php/stream/image.php?id='+ids[2]+'"></div>';
    covers += '<div class="cover"><img src="php/stream/image.php?id='+ids[3]+'"></div>';
    break;
    case 3:
    covers += '<div class="midcover"><img src="php/stream/image.php?id='+ids[0]+'"></div>';
    covers += '<div class="cover"><img src="php/stream/image.php?id='+ids[1]+'"></div>';
    covers += '<div class="cover"><img src="php/stream/image.php?id='+ids[2]+'"></div>';
    break;
    case 2:
    covers += '<div class="midcover"><img src="php/stream/image.php?id='+ids[0]+'"></div>';
    covers += '<div class="midcover"><img src="php/stream/image.php?id='+ids[1]+'"></div>';
    break;
    case 1:
    covers += '<div class="fullcover"><img src="php/stream/image.php?id='+ids[0]+'"></div>';
    break;
  }
  var text = '<li data-ids="'+ids+'" oncontextmenu="$rc_referer = $(this);rightclick_popup(event, \'desk_playlist\');return false;" onclick="$lc_referer = $(this);playlist_restore()" class="album playlist"><div class="infos"><div class="field2">'+title+'</div></div><div class="multicover">'+covers+'</div></li>';
  $(text).prependTo("#desk_content").data("playlist", playlist);
}
