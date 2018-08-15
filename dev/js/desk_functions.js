/*
part of soundsdope v2 desk - jquery library / Copyright (c) 2015 Dope Inc.
handles UI functions:
- background
- header slide
- search
- tour
*/

var limit_string = 24;
var query;

$(document).keyup(function(e) {
  //UI
  if (e.keyCode == 27) extoolbar_close();   // esc
  if (e.keyCode == 40) skip_backward(); // down arrow
  if (e.keyCode == 38) skip_forward(); // up arrow

  if(!$("input").is(":focus")) {
    //play
    if (e.keyCode == 32) switch_play(); // space
    if (e.keyCode == 119) switch_play(); // f8 (itunes play, only works if functions disabled)
    if (e.keyCode == 118) skip_backward(); // f7 (itunes play, only works if functions disabled)
    if (e.keyCode == 120) skip_forward(); // f9 (itunes play, only works if functions disabled)

    if (e.keyCode == 37) skip_backward(); // left arrow
    if (e.keyCode == 39) skip_forward(); // right arrow

    // popup
    if (e.keyCode == 83) screenup("cloud"); // s for cloud
    if (e.keyCode == 65) screenup("playlist"); // a for playlist
    if (e.keyCode == 68) screenup("desk"); // d for desk
  } else if ($("#cloud_search").is(":focus")) {
    if (e.keyCode == 13) cloud_search();
  } else if ($("#desk_search").is(":focus")) {
    if (e.keyCode == 13) desk_search();
  }
});

// /BACKGROUND

// SEARCH

$("#desk_search").on('input',function(e){
  // handles searches in localstorage
  desk_search();
});
$("#desk_search").focus(function() {
  desk_search();
});

$("#cloud_search").on('input',function(e){
  cloud_search();
});
$( "#cloud_search" ).focus(function() {
  cloud_search();
});

$("#settings_repeat").click(function () {
  settings_switch("repeat", "count");
});
$("#settings_random").click(function () {
  settings_switch("random", "switch");
});
$("#settings_preload").click(function () {
  settings_switch("preload", "switch");
});
$("#fullsearch_albums").click(function () {
  if($(this).hasClass("active")) {
    cloud_fullsearch("albums");
  }
});
$("#tour").click(function () {
  tour_start();
});

$.fn.uiremove = function(){
  $(this).addClass("uidelete");
  $(".uidelete").on(
    "transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd",
    function() {
      $(this).remove();
    }
  );
}
$.fn.uiadd = function(){
  $(this).addClass("uiadd");
  $(".uiadd").on(
    "transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd",
    function() {
      $(this).removeClass("uiadd");
    }
  );
}
// /SEARCH

$("#select_genre li").click(function () {
  if($(this).data("genre")) {
    var genre = $(this).data("genre");
    genre_list(genre);
  } else {
    $( "#select_genre" ).find("ul").not($(this).find("ul")).removeClass("active");
    if($(this).find("ul").hasClass("active")) {
      $(this).find("ul").removeClass("active");
    } else {
      $(this).find("ul").addClass("active");
    }
  }
});

$(".toolbar li").click(function () {
  extoolbar_close();
  if($(this).data("id")) {
    $(".extended_toolbar .content > ul").removeClass("active");
    $(".extended_toolbar").find("#"+$(this).data("id")).addClass("active");
    extoolbar_open();
  }
});

function extoolbar_close() {
  if($(".extended_toolbar").hasClass("opened")) {
    $(".extended_toolbar").addClass("closed");
    $(".extended_toolbar").removeClass("opened");
  }
}

function extoolbar_open() {
  close_popup();
  $(".extended_toolbar").addClass("opened");
  $(".extended_toolbar").removeClass("closed");
}

function rightclick_action(action) {
  remove_rightclick();
  if(action !== "cancel") {
    extoolbar_close();
    switch (action) {
      case "desk_add":
      desk_add($rc_referer.data("id"));
      break;
      case "desk_remove":
      desk_remove($rc_referer.data("id"));
      break;
      case "track_play":
      track_play($rc_referer.data("song-id"));
      break;
      case "track_playlist_add":
      playlist_track_add($rc_referer.data("song-id"));
      break;
      case "track_playlist_remove":
      playlist_track_remove();
      break;
      case "album_playlist_remove":
      playlist_album_remove();
      break;
      case "desk_playlist":
      $.ajax({
        dataType: "json",
        method: "POST",
        url: "php/filter/filter.php",
        data: { album: $rc_referer.data("id") }
      })
      .done(function( msg ) {
        json_errorcheck(msg);
        $.each(msg, function(index, entry) {
          playlist_track_add(entry.id);
        });
      });
      break;
      case "desk_playlist_add":
      playlist_combine($rc_referer.data("playlist"));
      break;
      case "desk_playlist_remove":
      playlist_delete($rc_referer.data("playlist"));
      break;
      case "desk_playlist_rename":
      playlist_rename($rc_referer.data("playlist"));
      break;
      case "track_download":
      window.location="php/download/track.php?id="+$rc_referer.data("song-id");
      break;
      case "album_view":
      album_popup2($rc_referer.data("id"));
      break;
    }
  }
}

function desk_add(id) {
  var entries = ls_custom.get("soundsdope");
  $.ajax({
    dataType: "json",
    method: "POST",
    url: "php/filter/filter.php",
    data: { album_data: id }
  })
  .done(function( msg ) {
    json_errorcheck(msg);
    $.each( msg, function( key, msgentry ) {
      var entry = {
        "id":id,
        "order":entries.albums.length+1,
        "artist":msgentry.artist,
        "title":msgentry.title
      }
      entries.albums.push(entry);
      ls_custom.set("soundsdope", JSON.stringify(entries));
      desk_add_ui(id, msgentry.artist, msgentry.title);
    });
  });
}

function desk_remove(id) {
  if(ls_custom.isSet('soundsdope')) {
    var entries = ls_custom.get("soundsdope");
    var remove_index = "";
    var remove_order = "";
    $.each(entries.albums, function(index, entry) {
      if(entry.id == id) {
        remove_index = index;
        remove_order = entry.order;
      }
    });
    entries.albums.splice(remove_index, 1);
    ls_custom.set('soundsdope', JSON.stringify(entries));
  }
  desk_remove_ui();
}

function desk_search() {
  var string = $("#desk_search").val();
  if(string !== "") {
    var entries = ls_custom.get("soundsdope");
    var check = true;
    $("#desk_content").empty();

    $.each(entries.albums, function(i, entry) {
      if ((entry.title.search(new RegExp(string, "i")) != -1) || (entry.artist.search(new RegExp(string, "i")) != -1)) {
        desk_add_ui(entry.id, entry.artist, entry.title);
        check = false;
      }
    });
    if(check) {
      show_placeholder(4);
    }
  } else {
    reset_desk();
  }
}

function cloud_fullsearch(type) {

  query = "cloud_fullsearch('"+type+"')";

  var string = $("#cloud_search").val();
  extoolbar_close();
  $.ajax({
    dataType: "json",
    method: "POST",
    url: "php/filter/fullsearch.php",
    data: { type: type, search: string, limit: limit_string }
  })
  .done(function( msg ) {
    json_errorcheck(msg);
    hide_placeholder(1);

    $.each(msg, function(index, entry) {
      cloud_add_ui(entry.id,entry.artist,entry.title);
    });

    check_limit();
  });
}

function cloud_search() {
  var string = $("#cloud_search").val();
  if(string.length < 1) {
    $("#sz_artists").prev().removeClass("active");
    $("#sz_artists").html("");
    $("#sz_albums").prev().removeClass("active");
    $("#sz_albums").html("");
    $("#sz_tracks").prev().removeClass("active");
    $("#sz_tracks").html("");
    $("#sz_playlists").prev().removeClass("active");
    $("#sz_playlists").html("");
    extoolbar_close();
    return;
  }

  extoolbar_open();

  $.ajax({
    dataType: "json",
    method: "POST",
    url: "php/filter/search.php",
    data: { search: string }
  })
  .done(function( msg ) {
    json_errorcheck(msg);

    $("#sz_artists").prev().removeClass("active");
    $("#sz_artists").html("");
    $("#sz_albums").prev().removeClass("active");
    $("#sz_albums").html("");
    $("#sz_tracks").prev().removeClass("active");
    $("#sz_tracks").html("");

    $.each(msg, function(index, entry) {
      $.each(entry, function(index, entry) {
        switch (entry.type) {
          case "artist":
          $('<li/>').data('id', entry.id).html(entry.name).appendTo("#sz_artists");
          $("#sz_artists").prev().addClass("active");
          break;
          case "album":
          $('<li/>').data('id', entry.id).data('action', 'album').html("<img src='php/stream/image.php?id="+entry.id+"'/><p>"+entry.title+"<br><span>"+entry.artist+"</span></p><span class='rc' data-action='album'><i class='material-icons'>more_horiz</i></span>").appendTo("#sz_albums");
          $("#sz_albums").prev().addClass("active");
          break;
          case "track":
          $('<li/>').data('song-id', entry.id).data('id', entry.albumid).data('action', 'track').html("<p>"+entry.name+"</p><span class='rc' data-action='popup_track'><i class='material-icons'>more_horiz</i></span><span>"+entry.artist+"</span>").appendTo("#sz_tracks");
          $("#sz_tracks").prev().addClass("active");
          break;
        }
      });
    });
  });
}

$( document ).on( "click", "#search_zone > ul", function() {
  extoolbar_close();
});
$( document ).on( "click", "#sz_artists > li", function() {
  list_artist($(this).data("id"));
});
$( document ).on( "click", "#sz_albums > li, #player_info, #desk_content > li, #cloud_content > li", function() {
  extoolbar_close();
  album_popup2($(this).data("id"));
});
$( document ).on( "click", "#sz_tracks > li, #album_content > li, #playlist_content .albumview > li", function() {
  track_play($(this).data("song-id"));
});
$( document ).on( "contextmenu", "#sz_albums > li, #desk_content > li, #cloud_content > li, #sz_tracks > li, #player_info, #album_info", function(event) {
  $rc_referer = $(this);
  rightclick_popup(event, $(this).data("action"));
  return false;
});

function list_artist(id) {
  $.ajax({
    dataType: "json",
    method: "POST",
    url: "php/filter/filter.php",
    data: { artist: id }
  })
  .done(function( msg ) {
    json_errorcheck(msg);
    hide_placeholder(1);
    $.each(msg, function(index, entry) {
      cloud_add_ui(entry.id,entry.artist,entry.title);
    });
  });
}

// SETTINGS

function settings_switch(name, type) {
  var target = "#settings_"+name;

  if(ls_custom.isSet('soundsdope')) {
    var entries = ls_custom.get("soundsdope");
    var check = true;
    $.each(entries.settings, function(index, entry) {
      if(entry.name == name) {
        check = false;
        var value = entry.value;
        if(value == "true") {
          value = "false";
        } else if (value == "false") {
          value = "true";
        } else if (value == "0") {
          value = "1";
        } else if (value == "1") {
          value = "2";
        } else {
          value = "0";
        }
        entry.value = value;
        settings_restore(name, value);
      }
    });
    if(check) {
      if(type == "switch") {
        var entry = {
          "name":name,
          "value":"true"
        }
      } else {
        var entry = {
          "name":name,
          "value":"1"
        }
      }
      if (name == "random") {
        globals_random = true;
      } else if (name == "preload") {
        globals_preload = true;
      } else if (name == "repeat") {
        globals_repeat = 1;
      }
      entries.settings.push(entry);
      $(target).addClass("active");
      $(target).find("#settings_repeat_icon").html("repeat");
    }
    ls_custom.set("soundsdope", JSON.stringify(entries));
    track_next();
  }
}

function settings_restore(name, value) {
  var target = "#settings_"+name;
  var globals = "globals_"+name;
  switch (value) {
    case "2": //repeat song
    $(target).addClass("active");
    $(target).find("#settings_repeat_icon").html("repeat_one");
    window[globals] = 2;
    break;
    case "0": //nothing
    $(target).removeClass("active");
    $(target).find("#settings_repeat_icon").html("repeat");
    window[globals] = 0;
    break;
    case "1": //repeat
    $(target).addClass("active");
    $(target).find("#settings_repeat_icon").html("repeat");
    window[globals] = 1;
    break;
    case "true": //on
    $(target).addClass("active");
    window[globals] = true;
    break;
    case "false": //off
    $(target).removeClass("active");
    window[globals] = false;
    break;
  }
}

function genre_list(string) {
  extoolbar_close();

  query = "genre_list('"+string+"')";
  $.ajax({
    dataType: "json",
    method: "POST",
    url: "php/filter/filter.php",
    data: { genre: string, limit: limit_string }
  })
  .done(function( msg ) {
    json_errorcheck(msg);

    hide_placeholder(1);
    $.each(msg, function(index, entry) {
      cloud_add_ui(entry.id,entry.artist,entry.title);
    });
    check_limit();

  });
}

function hide_placeholder(int) {
  switch (int) {
    case 1:
    $("#cloud_placeholder").hide();
    $("#cloud_content").empty();
    break;
    case 2:
    $("#playlist_placeholder").hide();
    break;
  }

}

function show_placeholder(int) {
  switch (int) {
    case 1:
    $("#cloud_placeholder").show();
    $("#cloud_placeholder p").text('Nothing found!');
    break;
    case 2:
    $("#cloud_placeholder").show();
    $("#cloud_placeholder p").text('Search or list content...');
    break;
    case 3:
    $("#desk_placeholder").show();
    $("#desk_placeholder p").text('');
    break;
    case 4:
    $("#desk_placeholder").show();
    $("#desk_placeholder p").text('Nothing found!');
    break;
    case 5:
    $("#playlist_placeholder").show();
    $("#playlist_placeholder p").text('Playlist empty...');
    break;
  }
}

function check_limit() {
  var code = '<div class="loadbuttoncontainer"><div onclick="raise_limit()" id="load_button">Load '+limit_string+' more</div></div>';
  if($("#cloud_content").find("li").length == limit_string) {
    $("#cloud_content").append(code);
  }
}
function raise_limit() {
  limit_string = limit_string*2;
  repeat_query();
}

function repeat_query() {
  jQuery.globalEval(query);
}

function notyfication(type, string) {
  switch (string) {
    case "save_notitle":
    string = "Please enter a name to save under.";
    break;
    case "invalid_sql":
    string = "Nothing found.";
    break;
    case "wip":
    string = "This feature is still in development.";
    break;
    default:
    string = "An error occured.";
  }
  var n = noty({text: string,
    layout: 'topRight',
    theme: 'relax',
    timeout: 2000,
    type: type});
  }

  function notyconfirm(string, func) {
    noty({
      layout: 'topRight',
      theme: 'relax',
      type: 'warning',
      text: string,
      buttons: [
        {text: 'Cancel', onClick: function($noty) {
          $noty.close();
        }
      },
      {text: 'Yes', onClick: function($noty) {
        $noty.close();
        window[func]();
      }
    }
  ]
});
}

function json_errorcheck(msg) {
    if(msg.state === "error")
    throw new json_error(msg.type);
}

function json_error() {
  var returned = Error.apply(this, arguments);
  notyfication("error", returned.message);
}
json_error.prototype = new Error();

function tour_start() {
  var tour = new Tour({
    storage: false,
    steps: [
      {
        element: "#open_playlist",
        title: "The three sections",
        content: "Soundsdope is split into three parts. You can switch between the sections using these icons."
      },
      {
        element: "#open_desk",
        title: "Your Favorites",
        content: "When you visit soundsdope, this is the first section you see. It's where your favorite albums and saved playlists are stored. Since soundsdope uses local storage, you wont loose your desk unless you delete your browser data."
      },
      {
        element: "#open_cloud",
        title: "The Store",
        content: "This is where you get your music from. You can either search for any artist, album or track or filter albums by genre. The store is completely free and can be used without limits or ads."
      },
      {
        element: "#open_playlist",
        title: "The Playlist",
        content: "By default soundsdope plays throughout the album. However, you are able to create playlists and listen to your own mixtapes."
      },
      {
        element: ".toolbar",
        title: "The Functions",
        content: "Below the section switcher, the different functions within the current section are listed."
      },
      {
        title: "Freedom streaming",
        content: "How about taking a trip to the clouds and discovering the endless possibilities of soundsdope? If you would like to suggest or ask something, feel free to contact me over 99.9Xz21gxhj9@hmamail.com.",
        orphan: true
      }
    ]});

    tour.init();
    tour.start();
  }
