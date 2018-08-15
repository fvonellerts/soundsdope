<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles skip functions:
- random excluding one id
- autoplay forward/backward
*/
include_once "../connect.php";
include_once "search_functions.php";

$id = intval(mysqli_real_escape_string($conn, $_POST["id"]));
$direction = $_POST["direction"];

if(!empty($id)) {
  $sql = "SELECT track,albumid FROM tracks WHERE id = '$id'";


  $result = $conn->query($sql);
  if($result->num_rows === 0)
  json_error("invalid_sql");

  while($row = $result->fetch_assoc()) {
    $albumid = intval($row["albumid"]);
    $track = intval($row["track"]);

    switch ($direction) {
      case 'random':
      die(autoplay_random($track, $albumid));
      break;

      case 'backward':
      $track === 1 ? die(autoplay_track(get_last_track($albumid), $albumid)) : die(autoplay_track($track - 1, $albumid));
      break;

      case 'forward':
        intval(get_last_track($albumid)) === $track ? die(autoplay_track(1, $albumid)) : die(autoplay_track($track + 1, $albumid));
        break;

        default:
        json_error("invalid_skip_direction");
        break;
      }
    }
  }
  ?>
