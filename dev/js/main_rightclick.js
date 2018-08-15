/*
part of soundsdope v2 desk - jquery library / Copyright (c) 2015 Dope Inc.
handles rightclick functions:
- triggering
- popup
*/

var $rc_referer;

$(function () {
  $("body").append('<ul class="rightclick_popup"></ul>');

  $(document).mouseup(function (e) {
    if (e.which != 1) return false;
    if (!$(".rightclick_popup").is(e.target)
    && $(".rightclick_popup").has(e.target).length === 0)
    {
      if($(".rightclick_popup").hasClass("popin")) {
        remove_rightclick();
      }
    }
  });
});

$( document ).on( "click", ".rc", function(event) {
  if($(this).parent().hasClass("infos")) {
    $rc_referer = $(this).parent().parent();
  } else {
    $rc_referer = $(this).parent();
  }
  rightclick_popup(event, $(this).data("action"));
  return false;
});

function remove_rightclick() {
  $(".rightclick_popup").addClass("popout");
  $(".rightclick_popup").removeClass("popin");
}

$( document ).on( "click", ".rightclick_popup > li", function(event) {
  rightclick_action($(this).data("action"));
});

function rightclick_popup(event, action) {
  var pos1 = event.pageY+($('.rightclick_popup').height()/2);
  var pos2 = event.pageX+($('.rightclick_popup').width()/2);
  if((pos2+($('.rightclick_popup').width()/2))>$(window).width()) {
    pos2 = $(window).width()-10-($('.rightclick_popup').width()/2);
  }

  if(!$(".rightclick_popup").hasClass("popin")) {
    //popup closed, fill content
    rightclick_fill(action);
    $('.rightclick_popup').css({'top':pos1,'left':pos2});
    $(".rightclick_popup").addClass("popin");
    $(".rightclick_popup").removeClass("popout");
  } else {
    //different button, change content
    $( ".rightclick_popup" ).fadeTo( "fast" , 0, function() {
      rightclick_fill(action);
      $('.rightclick_popup').css({'top':pos1,'left':pos2});
      $( ".rightclick_popup" ).fadeTo( "slow" , 1);
    });
  }
}

function rightclick_fill(action) {
  $(".rightclick_popup").empty();
  var icon_playlistadd = '<div class="icon_container"><i class="material-icons">playlist_add</i></div>';
  var icon_playlistremove = '<div class="icon_container"><i class="material-icons">playlist_play</i></div>';
  var icon_deskadd = '<div class="icon_container"><i class="material-icons">favorite</i></div>';
  var icon_deskremove = '<div class="icon_container"><i class="material-icons">favorite_border</i></div>';
  var icon_download = '<div class="icon_container"><i class="material-icons">file_download</i></div>';
  var icon_cloud = '<div class="icon_container"><i class="material-icons">cloud_queue</i></div>';
  var icon_share = '<div class="icon_container"><i class="material-icons">share</i></div>';
  var icon_cancel = '<div class="icon_container"><i class="material-icons">close</i></div>';
  var icon_edit = '<div class="icon_container"><i class="material-icons">mode_edit</i></div>';
  var icon_play = '<div class="icon_container"><i class="material-icons">play_arrow</i></div>';
  var string = "";

  var string_cancel = icon_cancel + "Cancel";
  var string_play = icon_play + "Play";
  var string_playlistadd = icon_playlistadd + "Add to playlist";
  var string_playlistremove = icon_playlistremove + "Remove from playlist";
  var string_deskadd = icon_deskadd + "Favorite";
  var string_deskremove = icon_deskremove + "Unfavorite";
  var string_rename = icon_edit + "Rename";
  var string_cloudview = icon_cloud + "View album";
  var string_trackdownload = icon_download + "Download track";

  var entry_cancel = $("<li/>").data("action", "cancel").html(string_cancel);
  var entry_play = $("<li/>").data("action", "track_play").html(string_play);
  var entry_playlistadd_album = $("<li/>").data("action", "desk_playlist").html(string_playlistadd);
  var entry_playlistadd_playlist = $("<li/>").data("action", "desk_playlist_add").html(string_playlistadd);
  var entry_playlistadd_track = $("<li/>").data("action", "track_playlist_add").html(string_playlistadd);
  var entry_playlistremove_album = $("<li/>").data("action", "album_playlist_remove").html(string_playlistremove);
  var entry_playlistremove_track = $("<li/>").data("action", "track_playlist_remove").html(string_playlistremove);
  var entry_deskadd = $("<li/>").data("action", "desk_add").html(string_deskadd);
  var entry_deskremove = $("<li/>").data("action", "desk_remove").html(string_deskremove);
  var entry_deskrename = $("<li/>").data("action", "desk_rename").html(string_rename);
  var entry_cloudview = $("<li/>").data("action", "album_view").html(string_cloudview);
  var entry_download_track = $("<li/>").data("action", "track_download").html(string_trackdownload);

  switch (action) {
    case "desk_album":
    $(".rightclick_popup").append(entry_cloudview);
    $(".rightclick_popup").append(entry_playlistadd_album);
    $(".rightclick_popup").append(entry_deskremove);
    break;
    case "desk_playlist":
    $(".rightclick_popup").append(entry_playlistadd_playlist);
    $(".rightclick_popup").append(entry_deskrename);
    $(".rightclick_popup").append(entry_deskremove);
    break;
    case "track":
    $(".rightclick_popup").append(entry_play);
    $(".rightclick_popup").append(entry_playlistadd_track);
    $(".rightclick_popup").append(entry_cloudview);
    $(".rightclick_popup").append(entry_download_track);
    break;
    case "popup_track":
    $(".rightclick_popup").append(entry_play);
    $(".rightclick_popup").append(entry_playlistadd_track);
    $(".rightclick_popup").append(entry_download_track);
    break;
    case "album":
    $(".rightclick_popup").append(entry_cloudview);
    $(".rightclick_popup").append(entry_playlistadd_album);
    $(".rightclick_popup").append(entry_deskadd);
    break;
    case "playlist_track":
    $(".rightclick_popup").append(entry_play);
    $(".rightclick_popup").append(entry_playlistremove_track);
    $(".rightclick_popup").append(entry_download_track);
    break;
    case "playlist_album":
    $(".rightclick_popup").append(entry_cloudview);
    $(".rightclick_popup").append(entry_playlistremove_album);
    break;
    case "edit_track":
    string += "<li onclick=\"rightclick_action_admin('edit_remove')\">Remove track</li>";
    break;
    case "edit_cover":
    string += "<li onclick=\"rightclick_action_admin('edit_coverupload')\">Upload image</li>";
    string += "<li onclick=\"rightclick_action_admin('edit_coverdownload')\">Download image from URL</li>";
    break;
    case "edit_album":
    string += "<li onclick=\"rightclick_action_admin('edit_album_edit')\">Edit album</li>";
    string += "<li onclick=\"rightclick_action_admin('edit_album_info')\">Edit info</li>";
    string += "<li onclick=\"rightclick_action_admin('edit_album_remove')\">Delete album</li>";
    break;
  }
  $(".rightclick_popup").append(string);
  $(".rightclick_popup").append(entry_cancel);
}
