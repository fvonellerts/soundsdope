<?php
session_start();
?>
<!doctype html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" href="favicon.ico" type="image/x-icon" />
  <meta name="author" content="Dope Inc.">
  <meta name="publisher" content="Dope Inc.">
  <meta name="copyright" content="Dope Inc.">
  <meta name="description" content="Unlimited free Urban Music streaming! No ads, no limitations, over 600 album large multilingual library in 320kbps, with love from the weed nation.">
  <meta name="keywords" content="music, free, download, stream, urban, rap, hip hop, electro, pop, album, online, itunes, full, unlimited, soundsdope, dope">

  <link rel="stylesheet" href="../css/normalize.css" />
  <link rel="stylesheet" href="../css/index_style.css" />

  <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
  rel="stylesheet">
</head>

<?php
/*
part of soundsdope v3 desk - jquery library / Copyright (c) 2015 Dope Inc.
handles administration functions:
- verification of uploads
- delete uploads
*/

include_once "connect.php";
$display = "start";
$_SESSION["sd_admin"] = true;

if(!empty($_GET["id"]) && $_SESSION["sd_admin"]) {
  $display = "album";
  $_SESSION["sd_albumid"] = intval($_GET["id"]);
}
?>

<body>
  <header>
    <div class="logo">
      <svg viewBox="0 0 64.67 31.5"><polyline class="a" points="0 15.5 16.83 31.5 33.33 15.5 49.5 0 64.67 15.5"/><path class="a" d="M100,100" transform="translate(-66.67 -84.5)"/><path class="a" d="M116.17,84.5" transform="translate(-66.67 -84.5)"/><polyline class="b" points="0 15.5 18.46 0 18.46 15.5"/><polyline class="b" points="49.5 15.5 49.5 31.5 64.67 15.5"/><path class="b" d="M100.42,100" transform="translate(-66.67 -84.5)"/><path class="b" d="M131.76,100" transform="translate(-66.67 -84.5)"/></svg>
    </div>
  </header>

  <main>
    <div class="centered">

      <?php

      switch ($display) {
        case "start":
        ?>

        <h1>edit database</h1>
        <h2>verify or delete albums</h2>

        <div class="albumbox">
          <ul class="topside">
            <li id="admin_hide_verified">hide verified</li>
          </ul>

          <div class="fullside">
            <ul id="albumlist">
              <?php
              include "connect.php";
              $sql = "SELECT albums.id as id, artists.name as artist, albums.title as title, albums.verified as verified FROM albums
              LEFT JOIN artists on albums.artistid = artists.id
              ORDER BY albums.time DESC";
              $result = $conn->query($sql);
              if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                  echo "<li data-verified='".html_entity_decode($row["verified"])."' data-id='".html_entity_decode($row["id"])."' onclick='window.location = \"?id=".html_entity_decode($row["id"])."\"'><div class='playing'><img src='../php/stream/image.php?id=".html_entity_decode($row["id"])."'></div><div class='title'>".html_entity_decode($row["artist"])." - ".html_entity_decode($row["title"])."</div><div class='duration'>Verified: ".html_entity_decode($row["verified"])."</div></li>";
                }
              } else {
                echo "<li id='track_placeholder'><div class='playing'></div><div class='title'>No album found</div><div class='duration'></div></li>";
              }
              ?>
            </ul>
          </div>
        </div>

        <?php
        break;

        case "album":
        ?>

        <h1>configure album</h1>
        <h2>configure cover and tracks</h2>

        <div class="albumbox">
          <ul class="topside">
            <a href="index.php"><li>back</li></a>
            <li class="error" id="admin_album_remove">delete</li>
            <li id="admin_album_verify">verify</li>
          </ul>

          <div class="leftside">
            <audio style="width:100%" controls autoplay id="audio_player"></audio>
            <img oncontextmenu="$rc_referer = $(this);rightclick_popup(event, 'edit_cover');return false;" id="cover" width="300" src="../php/stream/image.php?id=<?php echo $_SESSION["sd_albumid"] ?>"/>
          </div>
          <ul class="rightside">
            <div id="tracklist">
              <?php
              include "connect.php";
              $sql = "SELECT * FROM tracks
              WHERE (albumid = '".mysqli_real_escape_string($conn, $_SESSION["sd_albumid"])."')
              ORDER BY track";
              $result = $conn->query($sql);
              if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                  echo "<li onclick='admin_play(".html_entity_decode($row["id"]).")'><div class='playing'>".html_entity_decode($row["track"])."</div><div class='title'>".html_entity_decode($row["name"])."</div><div class='duration'>".html_entity_decode($row["playtime"])."</div></li>";
                }
              } else {
                echo "<li id='track_placeholder'><div class='playing'></div><div class='title'>No tracks found</div><div class='duration'></div></li>";
              }
              ?>
            </div>
          </ul>


        </div>

        <?php
        break;

    }
    ?>

  </div>
</main>

</body>

<script src="../js/lib/jquery-2.1.3.min.js"></script>
<script src="../js/lib/jquery.noty.packaged.min.js"></script>

<script src="../js/admin_functions.js"></script>

<script>
if (screen.width <= 800) {
  window.location = "../mobile-index.php";
}
</script>
</html>
