/*
part of soundsdope v2 desk - jquery library / Copyright (c) 2015 Dope Inc.
handles administration functions:
- ajax calls for management/upload
- admin album editor
- admin rightclick
*/

var queue = 2;

$('#paste').bind('paste', function(e) {
  e.preventDefault();
  if(e.originalEvent.clipboardData){
    var text = $.trim(e.originalEvent.clipboardData.getData("text/plain"));
    var mult = text.split(" ");
    notyfication("success", "Starting "+queue+" downloads, "+(mult.length-queue)+" links queued.");
    $.each(mult, function( index, textpart ) {
      if(validate_megaurl(textpart)) {
        queuewait(textpart);
      } else {
        notyfication("warning", "Invalid link! ("+textpart+")");
      }
    });
  }
});

function queuewait(textpart){
  if (!(queue > 0)){
    setTimeout(function() {
      queuewait(textpart);
    }, 100);
  } else {
    queue -= 1;
    var dlnoty = notyfication("information", "Download from "+textpart+" in progress...");
    upload_megaurl(textpart, dlnoty);
  }
}

$("#cover").click(function () {
  $("#upload_file").click();
});

$("#cancel").click(function () {
  notyconfirm("Are you sure you want to cancel and delete everything?", "delete_album");
});

$("#confirm").click(function () {
  notyconfirm("Are you sure all fields are filled out? We only verify complete uploads!", "confirm_upload");
});

$("#admin_album_remove").click(function () {
  notyconfirm("Are you sure to delete this album?", "admin_album_remove");
});

$("#admin_album_verify").click(function () {
  notyconfirm("Are you sure to verify this album?", "admin_album_verify");
});

$("#admin_hide_verified").click(function () {
  admin_hide_verified();
});

function validate_megaurl(value) {
  value = $.trim(value);
  var parts = value.split("!");
  if(!(parts[0] === "https://mega.nz/#"))
  return false;

  if(!(parts[1].length === 8))
  return false;

  if(!(parts[2].length === 43))
  return false;

  return true;
}

function upload_megaurl(value, dlnoty) {
  $.ajax({
    method: "POST",
    url: "php/upload/ajax_file.php",
    data: { mega_url: value }
  })
  .done(function( msg ) {
    queue += 1;
    dlnoty.close();
    ajax_complete(msg);
  });
}

$("#upload_file").change(function (){
  var filecount = this.files.length;

  for (var i = 0; i < filecount; i++) {
    var file = this.files[i];
    name = file.name;
    size = file.size;
    type = file.type;

    if(file.name.length < 1) {
    } else {
      var formData = new FormData();
      formData.append('file', $('#upload_file')[0].files[i]);
      $.ajax({
        url: 'php/upload/ajax_image.php',  //server script to process data
        type: 'POST',
        // Ajax events
        success: completeHandler = function(data) {
          ajax_complete(data);
        },
        error: errorHandler = function(myXhr, data, data2) {
          notyfication("error", "General error! "+data+" / "+data2);
        },
        // Form data
        data: formData,
        // Options to tell jQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
      }, 'json');
    }
  }
});

// /EDITOR

function ajax_complete(data) {

  var entry = JSON.parse(data);
  if(entry.state == "error") {
    var error_string = "";

    switch (entry.type) {
      case "invalid_id":
      error_string = "Album ID is missing or invalid. This should not happen unless you messed around with the DOM.";
      break;
      case "upload_noname":
      error_string = "The filename is missing or invalid.";
      break;
      case "upload_error":
      error_string = "Something went wrong with the upload. Check your internet connection.";
      break;
      case "upload_mime":
      error_string = "Invalid format. Use MP3 for audio and JPG/PNG/GIF for images.";
      break;
      case "upload_ext":
      error_string = "Invalid format. Use MP3 for audio and JPG/PNG/GIF for images.";
      break;
      case "upload_size":
      error_string = "The supplied file's size is over 50MB or under 10KB.";
      break;
      case "invalid_sql":
      error_string = "An internal server error happened while connecting to the database.";
      break;
      case "invalid_image":
      error_string = "Invalid image. It may be corrupted.";
      break;
      case "invalid_delete":
      error_string = "An internal server error happened while deleting.";
      break;
      case "invalid_file":
      error_string = "Invalid file. It may be corrupted.";
      break;
      case "invalid_editchange":
      error_string = "Invalid value for this field.";
      break;
      case "invalid_edittype":
      error_string = "Invalid field.";
      break;
    }

    notyfication("error", error_string);

  } else if(entry.state == "success") {

    if(entry.type == "image") {

      notyfication("success", "The cover image has been set.");

      $("#cover").attr("src", "php/stream/image.php?id="+entry.id);

    } else if(entry.type == "audio") {

      notyfication("success", entry.name + " has been added to the database.");

      $("#track_placeholder").remove();


      $('<li/>').data('id', entry.id).html('<div class="playing"><input placeholder="'+entry.track+'" value="'+entry.track+'"/></div><div class="title"><input placeholder="'+entry.name+'" value="'+entry.name+'"/></div><div class="duration"><input placeholder="'+entry.playtime+'" value="'+entry.playtime+'"/></div>').appendTo("#tracklist");

    } else if(entry.type == "delete_track") {

      notyfication("warning", "Track has been removed from the database.");

      $('*[data-id="' + entry.id + '"]').remove();
      if(!$.trim($("#tracklist").html())) {
        $("#tracklist").append('<li id="track_placeholder"><div class="playing"></div><div class="title">No title found</div><div class="duration"></div></li>');
      }

    } else if(entry.type == "delete_album") {

      window.location = "upload.php";

    } else if(entry.type == "edit_track") {

      notyfication("success", "Change has been saved.");

    } else if(entry.type == "admin_album") {

      window.location = "index.php";

    }

  }
}
$( document ).on( "contextmenu", "#tracklist > li", function(event) {
  $rc_referer = $(this);
  rightclick_popup(event, 'edit_track');
  return false;
});
$( document ).on( "keypress", "#tracklist > li input", function(event) {
  if(event.which === 13) {
    var orig = $(this).attr("placeholder");
    var change = $(this).val();

    var type = $(this).parent().attr("class");
    var id = $(this).parents("li").data("id");
    $.ajax({
      method: "POST",
      url: "php/upload/ajax_edit.php",
      data: { trackid: id, type: type, change: change }
    })
    .done(function( data ) {
      var entry = JSON.parse(data);
      if(entry.state == "error") {
        notyfication("error", "Error changing value.");
        $(this).val(orig);
      } else {
        $(this).attr("placeholder", change);
      }
      ajax_complete(data);
    });
  }
});

function delete_album() {
  $.ajax({
    method: "POST",
    url: "php/upload/ajax_remove.php",
    data: { action: "delete" }
  })
  .done(function( msg ) {
    ajax_complete(msg);
  });
}

function rightclick_action_admin(action) {
  remove_rightclick();

  switch (action) {
    case "edit_remove":
    $.ajax({
      method: "POST",
      url: "php/upload/ajax_remove.php",
      data: { trackid: $rc_referer.data("id") }
    })
    .done(function( msg ) {
      ajax_complete(msg);
    });
    break;

    case "edit_coverupload":
    $("#upload_file").click();
    break;

    case "edit_coverdownload":

    var cover_url = prompt("Please enter an image URL:");
    $.ajax({
      method: "POST",
      url: "php/upload/ajax_image.php",
      data: { cover_url: cover_url }
    })
    .done(function( msg ) {
      ajax_complete(msg);
    });
    break;

  }
}

function confirm_upload() {
  if($("#cover").attr("src") === "img/placeholder.jpg") {
    notyfication("warning", "Cover image missing! Add one by rightclicking the placeholder image.");
    return false;
  }

  if($("#track_placeholder").length > 0) {
    notyfication("warning", "Songs missing! Upload at least one by pasting a MEGA link into the textfield.");
    return false;
  }


  window.location = "upload.php?step=verif";
}

function admin_album_remove() {
  $.ajax({
    method: "POST",
    url: "admin/ajax_remove.php"
  })
  .done(function( msg ) {
    ajax_complete(msg);
  });
}

function admin_album_verify() {
  $.ajax({
    method: "POST",
    url: "admin/ajax_verify.php"
  })
  .done(function( msg ) {
    ajax_complete(msg);
  });
}

function admin_hide_verified() {
  notyfication("success", "Verified albums removed...");
  $('*[data-verified="1"]').remove();
}

function admin_play(id) {
  notyfication("success", "Loading audio with identifier "+id+"...");
  var audio = document.getElementById('audio_player');
  var src = "admin/admin_audio.php?id="+id;
  audio.setAttribute("src", src);
  audio.load();
}

function notyfication(type, string) {
  switch (type) {
    case "success":
    var n = noty({text: string,
      layout: 'topRight',
      theme: 'relax',
      timeout: 2000,
      type: type});
      break;

      case "warning":
      var n = noty({text: string,
        layout: 'topRight',
        theme: 'relax',
        timeout: 4000,
        type: type});
        break;

      default:
      var n = noty({text: string,
        layout: 'topRight',
        theme: 'relax',
        type: type});
      }
      return n;
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
