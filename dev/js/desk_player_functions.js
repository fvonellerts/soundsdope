/*
part of soundsdope v2 desk - jquery library / Copyright (c) 2015 Dope Inc.
handles audio player functions:
- song calls
- play/pause/load
- playlist functions
- autoplay functions
*/

var audio = document.getElementById('audio_player');
var audio2 = document.getElementById('audio_player2');
var audio_active;
var audio_inactive;
var preloaded = false;

$(function () {
  audio.onended = function() {
    skip_forward();
  }
  audio2.onended = function() {
    skip_forward();
  }
  audio.oncanplay = function() {
    if(audio == audio_active) {
      loaded();
    } else {
      preloaded = true;
    }
  }
  audio2.oncanplay = function() {
    if(audio2 == audio_active) {
      loaded();
    } else {
      preloaded = true;
    }
  }

  audio.addEventListener("timeupdate", function(){
    if(audio == audio_active) {
      autoseek(audio.currentTime);
    }
  });
  audio2.addEventListener("timeupdate", function(){
    if(audio2 == audio_active) {
      autoseek(audio2.currentTime);
    }
  });
  $("#audio_player").data("customvolume", 1);
});

$("#play_slider_bar").click(function(e) {
  percentage = 100 * ((e.pageX - $("#play_slider_bar")[0].offsetLeft) / $("#play_slider_bar").width());
  seek(percentage);
});

$("#settings_volume_bar").click(function(e) {
  percentage = (e.pageX - $("#settings_volume_bar")[0].offsetLeft) / $("#settings_volume_bar").width();
  $("#audio_player").data("customvolume", percentage);
  volume(percentage);
});

$("#play_slider_bar").click(function(e) {
  var max_value = ($("#play_slider_bar").width()/100),
  value = e.pageX - $(this).position().left,
  percentage = value/max_value;
  seek(percentage);
});

$("#play_play, #play_stop").click(function () {
  switch_play();
});
$("#play_back").click(function () {
  skip_backward();
});
$("#play_forward").click(function () {
  skip_forward();
});

$("#playlist_clear").click(function () {
  playlist_clear();
});
$("#playlist_save").click(function () {
  playlist_save();
});
$("#playlist_download").click(function () {
  playlist_download();
});
$("#playlist_share").click(function () {
  playlist_share();
});

$("#settings_volume").click(function (e) {
  volume_switch();
});

function track_preload(id) {
  $("#player_info").data("next-song-id", id);

  $.ajax({
    dataType: "json",
    method: "POST",
    url: "php/filter/filter.php",
    data: { track: id }
  })
  .done(function( msg ) {
    console.log(msg);
    json_errorcheck(msg);
    var entry = msg[0];
    $("#play_forward_info").html(entry.name);
    $("#play_forward_info").addClass("active");

    if(globals_preload) {
      var src = "php/stream/audio.php?id="+id;
      audio_inactive.setAttribute("src", src);
      audio_inactive.load();
    }
  });
}

function skip_forward() {
  $("#player_info").data("last-song-id", $("#player_info").data("song-id"));
  $("#player_info").data("song-id", $("#player_info").data("next-song-id"));
  if(globals_preload) {
    if(audio_active == audio) {
      audio_active = audio2;
      audio_inactive = audio;
    } else {
      audio_active = audio;
      audio_inactive = audio2;
    }
    audio_active.play();
    if(preloaded) {
      loaded();
      preloaded = false;
    } else {
      loading();
    }
    track_play_ui($("#player_info").data("song-id"));
  } else {
    track_play($("#player_info").data("song-id"));
  }
}

function track_next() {
  $("#play_forward_info").removeClass("active");
  var entries = JSON.parse($("#playlist_content").data("playlist"));

  if(globals_repeat === 2) {
    track_preload($("#player_info").data("song-id"));
  } else if(entries.playlist.length > 0) {
    skip_playlist_forward();
  } else if(globals_random) {
    skip_autoplay("random");
  } else {
    skip_autoplay("forward");
  }
}

function skip_backward() {
  if($("#player_info").data("last-song-id") !== $("#player_info").data("song-id")) {
    track_play($("#player_info").data("last-song-id"));
    $("#player_info").data("last-song-id", "");

  } else {
    var entries = JSON.parse($("#playlist_content").data("playlist"));

    if(globals_repeat === 2) {
      track_preload($("#player_info").data("song-id"));
    } else if(entries.playlist.length > 0) {
      skip_playlist_backward();
    } else if(globals_random) {
      $.ajax({
        dataType: "json",
        method: "POST",
        url: "php/filter/skip.php",
        data: { id: $("#player_info").data("song-id"), direction: "random" }
      })
      .done(function( msg ) {
        json_errorcheck(msg);
        track_play(msg[0].id);
      });
    } else {
      $.ajax({
        dataType: "json",
        method: "POST",
        url: "php/filter/skip.php",
        data: { id: $("#player_info").data("song-id"), direction: "backward" }
      })
      .done(function( msg ) {
        json_errorcheck(msg);
        track_play(msg[0].id);
      });
    }
  }
}

function skip_autoplay(direction) {
  $.ajax({
    dataType: "json",
    method: "POST",
    url: "php/filter/skip.php",
    data: { id: $("#player_info").data("song-id"), direction: direction }
  })
  .done(function( msg ) {
    json_errorcheck(msg);
    track_preload(msg[0].id);
  });
}

function skip_playlist_forward() {
  var id = $("#player_info").data("song-id");
  var entries = JSON.parse($("#playlist_content").data("playlist"));
  var check = false;
  var count = entries.playlist.length;

  $.each(entries.playlist, function(index, entry) {
    if (entry.song_id === id) {
      if(globals_random) {
        check = true;
        var random = Math.floor(Math.random() * count);
        while(random == index) {
          random = Math.floor(Math.random() * count);
        }
        track_preload(entries.playlist[random].song_id);
      } else {
        if((index+1) < count) {
          track_preload(entries.playlist[index+1].song_id);
          check = true;
        } else if(globals_repeat == 1) {
          track_preload(entries.playlist[0].song_id);
          check = true;
        }
      }
    }
  });

  if(!check) {
    skip_autoplay("forward");
  }
}

function skip_playlist_backward() {
  var id = $("#player_info").data("song-id");
  var entries = JSON.parse($("#playlist_content").data("playlist"));
  var check = false;
  var count = entries.playlist.length;

  $.each(entries.playlist, function(index, entry) {
    if (entry.song_id === id) {
      if(globals_random) {
        check = true;
        var random = Math.floor(Math.random() * count);
        while(random == index) {
          random = Math.floor(Math.random() * count);
        }
        track_play(entries.playlist[random].song_id);
      } else {
        if((index+1) > 1) {
          track_play(entries.playlist[index-1].song_id);
          check = true;
        } else if(globals_repeat == 1) {
          track_play(entries.playlist[count-1].song_id);
          check = true;
        }
      }
    }
  });
  if(!check) {
    return skip_autoplay("backward");
  }
}

function track_play(id) {
  $("#player_info").data("song-id", id);
  $("#play_forward_info").removeClass("active");

  var src = "php/stream/audio.php?id="+id;
  audio.setAttribute("src", src);
  audio.load();
  audio.play();
  audio_active = audio;
  audio_inactive = audio2;
  audio_inactive.pause();

  loading();
  track_play_ui(id);
}

function switch_play() {
  if(audio_active.paused) {
    audio_active.play();
    $("#play_stop").css("display", "block");
    $("#play_play").css("display", "none");
  } else {
    audio_active.pause();
    $("#play_stop").css("display", "none");
    $("#play_play").css("display", "block");
  }
}

function track_play_ui(id) {
  playing();
  autoseek(0);

  $.ajax({
    dataType: "json",
    method: "POST",
    url: "php/filter/filter.php",
    data: { track: id }
  })
  .done(function( msg ) {
    json_errorcheck(msg);
    var entry = msg[0];
    $("#player_info").data("id", entry.id);

    /*if(($("html").find("body:hover").length > 0) && (globals_notifications)) {
      var n = new Notification(name, {
        body: artist+" - "+title,
        icon: "php/stream/image.php?id="+id
      });
    }*/

    $("#play_slider_maxtime").text(entry.playtime);
    $("#play_slider_maxtime").data("seconds", convert_playtime(entry.playtime));

    if($("#player_info_cover").attr("src") !== "php/stream/image.php?id="+entry.id) {
      $('#player_info_cover').fadeOut(500).promise().done(function() {
        $("#player_info_cover").attr("src", "php/stream/image.php?id="+entry.id);
        $( "#player_info_cover" ).fadeTo( 1800 , 1);
        $("#player_info_artist").html(entry.artist);
        $("#player_info_albumname").html(entry.title);
        $("#player_info_trackname").html(entry.name);
        var elem = document.createElement('textarea');
        elem.innerHTML = entry.artist+" - "+entry.name;
        document.title = elem.value;
        $("#play_stop").css("display", "block");
        $("#play_play").css("display", "none");
      });
    } else {
      $("#player_info_artist").html(entry.artist);
      $("#player_info_albumname").html(entry.title);
      $("#player_info_trackname").html(entry.name);
      var elem = document.createElement('textarea');
      elem.innerHTML = entry.artist+" - "+entry.name;
      document.title = elem.value;
      $("#play_stop").css("display", "block");
      $("#play_play").css("display", "none");
    }

  });
}

function playing() {
  $('#album_content > li .playing, #playlist_content .albumview > li .playing').removeClass("active");
  $('#album_content > li, #playlist_content .albumview > li').filter(function() {
    return $(this).data("song-id") == $("#player_info").data("song-id")
  }).find(".playing").addClass("active");
}

function loading() {
  $(".loader").fadeIn("slow");
}
function loaded() {
  $(".loader").fadeOut("slow");
  track_next();
}

function convert_playtime(playtime) {
  var playtime_parts = playtime.split(":"),
  seconds = parseInt(playtime_parts[0])*60 + parseInt(playtime_parts[1]);
  return seconds;
}
function convert_back_playtime(seconds) {
  var minutes = Math.floor(seconds / 60),
  rest = Math.floor(seconds % 60);
  if(rest<10) {
    rest = "0"+rest;
  }
  return minutes+":"+rest;
}

// SEEKER

function seek(percentage) {
  $("#play_slider").css("width", percentage+"%");
  var max_seconds = ($("#play_slider_maxtime").data("seconds")/100),
  seconds = max_seconds*percentage;
  audio.currentTime = seconds;
  $("#play_slider_time").text(convert_back_playtime(seconds));
}

function autoseek(seconds) {
  var max_seconds = $("#play_slider_maxtime").data("seconds"),
  percentage = (seconds*100)/max_seconds;
  $("#play_slider").css("width", percentage+"%");
  $("#play_slider_time").text(convert_back_playtime(seconds));
}

// PLAYLIST

function playlist_track_add(id) {
  var entries = JSON.parse($("#playlist_content").data("playlist"));
  if (entries.playlist.length == 0) {
    $("#playlist_content").empty();
    screenup("playlist");
  }
  if(audio.paused) {
    track_play(id);
  }

  //UI
  $.ajax({
    async: false,
    method: "POST",
    url: "php/filter/filter.php",
    data: { track: id }
  })
  .done(function( msg ) {
    var entries2 = JSON.parse(msg);

    $.each(entries2, function(index, entry) {

      entries.playlist.push(
        {"album_id": entry.id, "song_id": id}
      );
      $("#playlist_content").data("playlist", JSON.stringify(entries));
      playlist_track_add_ui(id, entry);
    });
  });
}

function playlist_track_add_ui(songid, entry) {
  hide_placeholder(2);

  var data = '<li data-song-id="'+songid+'"><div class="playing">'+entry.track+'</div><div class="title">'+entry.name+'</div><div class="rc" data-action="playlist_track"><i class="material-icons">more_horiz</i></div><div class="duration">'+entry.playtime+'</div></li>';

  if($("#playlist_content > li").last().find(".coverview").data("id") == entry.id) {
    $("#playlist_content > li").last().find(".albumview").append(data);
  } else {
    $("#playlist_content").append('<li><div style="background-image:url(\'php/stream/image.php?id='+entry.id+'\');" data-id="'+entry.id+'" class="coverview"><div class="infos"><div id="playlist_info_albumname" class="field2">'+entry.title+'</div><div id="playlist_info_artist" class="field1">'+entry.artist+'</div><span class="rc" data-action="playlist_album"><i class="material-icons">more_horiz</i></span></div></div><ul class="albumview">'+data+'</ul></li>');
  }

  playlist_count();
  playing();
}
$( document ).on( "contextmenu", "#playlist_content .albumview > li", function(event) {
  $rc_referer = $(this);
  rightclick_popup(event, "playlist_track");
  return false;
});
$( document ).on( "contextmenu", "#playlist_content .coverview", function(event) {
  $rc_referer = $(this);
  rightclick_popup(event, "playlist_album");
  return false;
});
$( document ).on( "click", "#playlist_content .coverview", function(event) {
  album_popup2($(this).data("id"));
});

function playlist_track_remove() {
  var entries = JSON.parse($("#playlist_content").data("playlist"));
  var index = $("#playlist_content li li").index($rc_referer);

  if($rc_referer.siblings("li").length < 1) {
    $rc_referer.parents("li").remove();
    if(!$.trim($("#playlist_content").html())) {
      playlist_clear();
    }
  } else {
    $rc_referer.remove();
  }

  entries.playlist.splice(index, 1);
  $("#playlist_content").data("playlist", JSON.stringify(entries));
  playlist_count();
}
function playlist_album_remove() {
  var entries = JSON.parse($("#playlist_content").data("playlist"));
  var indexobj1 = $rc_referer.siblings(".albumview").find("li:first-child");
  var indexobj2 = $rc_referer.siblings(".albumview").find("li:last-child");
  var index1 = $("#playlist_content li li").index(indexobj1);
  var index2 = $("#playlist_content li li").index(indexobj2);

  $rc_referer.parents("li").remove();
  if(!$.trim($("#playlist_content").html())) {
    playlist_clear();
  }

  entries.playlist.splice(index1, index2-index1);
  $("#playlist_content").data("playlist", JSON.stringify(entries));
  playlist_count();
}

function playlist_clear() {
  var entries = {};
  var playlist = [];
  entries.playlist = playlist;
  $("#playlist_content").data("playlist", JSON.stringify(entries));
  $("#playlist_content").empty();
  show_placeholder(5);

  playlist_count();
}

function playlist_count() {
  var entries = JSON.parse($("#playlist_content").data("playlist"));
  if(entries.playlist.length == 0) {
    $("#playlist_count").removeClass("active");
  } else {
    $("#playlist_count").addClass("active");
    $("#playlist_count").text(entries.playlist.length);
  }
}

function playlist_save() {
  var entries = JSON.parse($("#playlist_content").data("playlist"));
  var saveplaylist = JSON.stringify(entries);
  if (entries.playlist.length !== 0) {

    // 4 COVERS
    var ids = [];
    var count = 0;
    var last_id = "";
    $.each(entries.playlist, function(index, entry) {
      if(entry.album_id !== last_id && count !== 4) {
        last_id = entry.album_id;
        ids.push(entry.album_id);
        count++;
      }
    });

    var title = $("#save_name").val();
    if (title !== "") {
      var entries2 = ls_custom.get("soundsdope");
      var entry2 = {
        "ids":ids,
        "title":title,
        "playlist": saveplaylist
      }
      entries2.playlists.push(entry2);
      ls_custom.set("soundsdope", JSON.stringify(entries2));

      playlist_save_ui(ids, title, saveplaylist);
      extoolbar_close();
      screenup("desk");
    } else {
      notyfication("error", "save_notitle");
    }

  }
}

function playlist_delete(playlist) {
  if(ls_custom.isSet('soundsdope')) {
    var entries = ls_custom.get("soundsdope");
    var remove_index = "";
    $.each(entries.playlists, function(index, entry) {
      if(entry.playlist == playlist) {
        remove_index = index;
      }
    });
    entries.playlists.splice(remove_index, 1);
    ls_custom.set('soundsdope', JSON.stringify(entries));
  }
  playlist_delete_ui(playlist);
}
function playlist_delete_ui(playlist) {
  $('#desk_content li').filter(function(){
    if($(this).data("playlist") == playlist) {
      $(this).remove();
    }
  });
}

function playlist_rename(playlist) {
  var title = prompt("Please enter a playlist title", "");
  if (title != null && ls_custom.isSet('soundsdope')) {
    var entries = ls_custom.get("soundsdope");
    var remove_index = "";
    $.each(entries.playlists, function(index, entry) {
      if(entry.playlist == playlist) {
        entry.title = title;
      }
    });
    ls_custom.set('soundsdope', JSON.stringify(entries));
    playlist_rename_ui(playlist, title);
  }
}
function playlist_rename_ui(playlist, title) {
  $('#desk_content li').filter(function(){
    if($(this).data("playlist") == playlist) {
      $(this).find(".field2").text(title);
    }
  });
}

function playlist_restore() {
  var playlist = $lc_referer.data("playlist");
  var entries = JSON.parse(playlist);
  playlist_clear();
  $.each(entries.playlist, function(index, entry) {
    playlist_track_add(entry.song_id);
  });
}

function playlist_combine(playlist) {
  var entries = JSON.parse(playlist);
  $.each(entries.playlist, function(index, entry) {
    playlist_track_add(entry.song_id);
  });
}

//VOLUME

function volume_switch() {
  if(($("#audio_player").data("volume") == 0) && ($("#audio_player").data("customvolume") > 0.9)) {
    volume(1);
  } else if($("#audio_player").data("volume") == 0) {
    volume($("#audio_player").data("customvolume"));
  } else {
    volume(0);
  }
}

function volume(percentage) {
  audio_player.volume = percentage;
  audio_player2.volume = percentage;

  if(percentage == 1) {
    $("#settings_volume i").text("volume_up");
  } else if (percentage == 0) {
    $("#settings_volume i").text("volume_mute");
  } else {
    $("#settings_volume i").text("volume_down");
  }
  $("#settings_volume_slider").css("width", percentage*100+"%");
  $("#audio_player").data("volume", percentage);
}

// /VOLUME
