<?php
session_start();
?>
<!doctype html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <link rel="shortcut icon" href="/fav/favicon.ico">
  <link rel="icon" sizes="16x16 32x32 64x64" href="/fav/favicon.ico">
  <link rel="icon" type="image/png" sizes="196x196" href="/fav/favicon-192.png">
  <link rel="icon" type="image/png" sizes="160x160" href="/fav/favicon-160.png">
  <link rel="icon" type="image/png" sizes="96x96" href="/fav/favicon-96.png">
  <link rel="icon" type="image/png" sizes="64x64" href="/fav/favicon-64.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16.png">
  <link rel="apple-touch-icon" href="/fav/favicon-57.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/fav/favicon-114.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/fav/favicon-72.png">
  <link rel="apple-touch-icon" sizes="144x144" href="/fav/favicon-144.png">
  <link rel="apple-touch-icon" sizes="60x60" href="/fav/favicon-60.png">
  <link rel="apple-touch-icon" sizes="120x120" href="/fav/favicon-120.png">
  <link rel="apple-touch-icon" sizes="76x76" href="/fav/favicon-76.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/fav/favicon-152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/fav/favicon-180.png">
  <meta name="msapplication-TileColor" content="#FFFFFF">
  <meta name="msapplication-TileImage" content="/fav/favicon-144.png">
  <meta name="msapplication-config" content="/browserconfig.xml">

  <meta name="author" content="thissoundsdope">
  <meta name="publisher" content="thissoundsdope">
  <meta name="copyright" content="thissoundsdope">
  <meta name="description" content="Unlimited free music streaming and upload! No ads, no limitations, with love from the weed nation.">
  <meta name="keywords" content="music, free, download, stream, urban, upload, rap, hip hop, electro, pop, album, online, itunes, full, unlimited, soundsdope, dope">
  <title>Soundsdope NL - Open upload</title>

  <link rel="stylesheet" href="css/normalize.css" />
  <link rel="stylesheet" href="css/index_style.css" />

  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
</head>

<?php
/*
part of soundsdope v3 desk - jquery library / Copyright (c) 2015 Dope Inc.
handles administration functions:
- add album
- mega mail
- ajax calls for management/upload
*/

$display = $_SESSION["step"];
include_once "php/upload/lists.php";
include_once "php/upload/entry.php";
include_once "php/upload/admin_functions.php";

switch ($_GET["step"]) {
  case 'mega':
  $display = "mega";
  break;

  case 'albumdef':
  $display = "albumdef";
  break;

  case 'album':
  $error = false;
  $check = add_album($_POST["artist"], $_POST["title"], $_POST["genre"]);
  if ($check["state"] === "success") {
    $display = "album";
    $_SESSION['sd_albumid'] = $check["albumid"];
  } else if ($check["state"] === "exists") {
    if(!empty($check["albumid"])) {
      $display = "album";
      $_SESSION['sd_albumid'] = $check["albumid"];
    }
  } else {
    $error = true;
  }
  break;

  case 'verif':
    validate_session();
    $display = "verif";
    break;

    default:
    $display = "disclaimer";
    $_SESSION['sd_albumid'] = "";
    $_SESSION['mega_pw'] = "";
    $_SESSION['mega_mail'] = "";
    break;
  }

  $_SESSION["step"] = $display;
  ?>

  <body>
    <header>
      <a href="index.html"><div class="logo">
        <svg viewBox="0 0 64.67 31.5"><polyline class="a" points="0 15.5 16.83 31.5 33.33 15.5 49.5 0 64.67 15.5"/><path class="a" d="M100,100" transform="translate(-66.67 -84.5)"/><path class="a" d="M116.17,84.5" transform="translate(-66.67 -84.5)"/><polyline class="b" points="0 15.5 18.46 0 18.46 15.5"/><polyline class="b" points="49.5 15.5 49.5 31.5 64.67 15.5"/><path class="b" d="M100.42,100" transform="translate(-66.67 -84.5)"/><path class="b" d="M131.76,100" transform="translate(-66.67 -84.5)"/></svg>
      </div></a>
    </header>

    <main>
      <div class="centered">
        <?php
        switch ($display) {
          case "disclaimer":
          ?>

          <h1>disclaimer</h1>
          <h2>about contributing to soundsdope</h2>

          <p>We do not accurage the distribution of illegal content (neither image nor audio files) and any kinds of violating/disturbing/incomplete uploads are deleted. Every upload is verified by a soundsdope administrator before going live and not hosted on soundsdope itself. By accepting this offer, you declare yourself responsible for the content uploaded and although the content is delivered over the soundsdope proxy service, still are the rightful owner of the shared material.</p>

          <a href="upload.php?step=mega"><div class="button"><div class="icon_container"><i class="material-icons">check_circle</i></div>All right, I agree</div></a>
          <a href="index.html"><div class="button"><div class="icon_container"><i class="material-icons">backspace</i></div>Back</div></a>

          <?php
          break;

          case "mega":

          $mail = generate_account(6);
          $pw = generate_pw();
          $_SESSION["mega_mail"] = $mail;
          $_SESSION["mega_pw"] = $pw;

          ?>
          <h1>data account</h1>
          <h2>please create a mega.co.nz account</h2>

          <p>The uploads will be saved in an encrypted form on the MEGA filehost. You can create an account using the generated info below or use your own MEGA account.</p><br>
          <p>Mega URL: <span>https://mega.co.nz/#register</span></p>
          <p>First &amp; last name: <span><?php echo generate_account(5); ?></span></p>
          <p>Mail: <span><?php echo $mail ?>@trashmail.de</span> (confirm using <span>trashmail.de/?search=<?php echo $mail ?></span>)</p>
          <p>Password: <span><?php echo $pw ?></span></p>
          <a href="upload.php?step=albumdef"><div class="button"><div class="icon_container"><i class="material-icons">skip_next</i></div>Continue</div></a>

          <?php
          break;

          case "albumdef":
          ?>

          <h1>add album</h1>
          <h2>define the artist and album title</h2>

          <p>In this step we need a few basic informations about the album. Please check if the album is already in our database.<br><?php if($error) { echo "Please fill in all the fields.<br>"; } ?></p>

          <form action="upload.php?step=album" method="post">
            <input list="artist_list" type="text" placeholder="Artist..." name="artist"/>

            <datalist id="artist_list">
              <?php
              echo artist_list();
              ?>
            </datalist>

            <input type="text" placeholder="Album Title..." name="title"/>
            <select name="genre">
              <?php
              echo genre_list();
              ?>
            </select>
            <input type="submit" name="definition" value="Continue"/>
          </form>

          <?php
          break;

          case "album":
          ?>

          <h1>add album</h1>
          <h2>configure cover and tracks</h2>

          <ul><li><p>1. Drag &amp; drop all the audio files onto the MEGA interface.</p></li><li><p>2. Create share links for all the entries <strong>(Select all - Rightclick - 'Export Links')</strong>.</p></li><li><p>3. Navigate to the <strong>'Link with key'</strong> tab and click on the <strong>'Copy'</strong> button in the bottom right corner.</p></li><li><p>4. Paste the clipboard into the <strong>textfield</strong> below. The system will queue the downloads, so this can take about a minute.</p></li></ul>

          <div class="albumbox">
            <ul class="topside">
              <li class="error" id="cancel">cancel</li>
              <input placeholder="Paste clipboard here..." id="paste"></input>
              <li id="confirm">confirm...</li>
            </ul>

            <input type="file" name="file[]" multiple="multiple" id="upload_file"/>

            <div class="leftside">
              <img oncontextmenu="$rc_referer = $(this);rightclick_popup(event, 'edit_cover');return false;" id="cover" width="300" src="img/placeholder.jpg"/>
            </div>
            <ul class="rightside">
              <div id="tracklist">
                <?php
                $tracks = track_list();
                if (!empty($tracks)) {
                  echo $tracks;
                } else {
                  ?>
                  <li id="track_placeholder"><div class="playing"></div><div class="title">No entries found.</div><div class="duration"></div></li>
                  <?php
                }
                ?>
              </div>
            </ul>


          </div>

          <?php
          break;

          case "verif":
            ?>

            <h1>submission</h1>
            <h2>thanks for contributing</h2>

            <p>Your album has been saved and is now ready for verification. This should not take longer than a week.</p>

            <a href="upload.php"><div class="button"><div class="icon_container"><i class="material-icons">cloud_upload</i></div>Upload another album</div></a>
            <a href="desk.html"><div class="button"><div class="icon_container"><i class="material-icons">airplanemode_active</i></div>Stream</div></a>

            <?php
            break;

          }
          ?>
        </div>
      </main>

    </body>

    <script src="js/lib/jquery-2.1.3.min.js"></script>
    <script src="js/lib/jquery.noty.packaged.min.js"></script>

    <script src="js/main_rightclick.js"></script>
    <script src="js/admin_functions.js"></script>

    <script>
    if (screen.width <= 800) {
      window.location = "mobile.html";
    }
    </script>
    </html>
