<?php
/*
part of soundsdope v3 desk - jquery library / Copyright (c) 2015 Dope Inc.
handles administration functions:
- enters/removes albums from database
- generates the locations
*/

function add_album($artist, $title, $genre) {
  include "connect.php";

  $artist = mysqli_real_escape_string($conn, $artist);
  $title = mysqli_real_escape_string($conn, $title);
  $genre = mysqli_real_escape_string($conn, $genre);
  $time = time();

  if ( empty($artist) || empty($title) || empty($genre) ) {
    $return = array(
      "state" => "error"
    );
    return $return;
  }

  $sql = "SELECT albums.id as id
  FROM albums
  LEFT JOIN artists ON albums.artistid = artists.id
  WHERE ((LOWER(artists.name) LIKE LOWER('$artist')) AND (LOWER(albums.title) LIKE LOWER('$title')))";

  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    while(($row = $result->fetch_assoc())) {
      $return = array(
        "state" => "error"
      );
    }
    return $return;
  }


  $sql = "INSERT INTO artists (name) VALUES ('$artist')";
  $conn->query($sql);

  $sql = "INSERT INTO albums (artistid, title, genreid, time, verified) VALUES ((SELECT id FROM artists WHERE (name = '$artist')), '$title', (SELECT id FROM genres WHERE (id = '$genre')), FROM_UNIXTIME($time), 0)";

  if ($conn->query($sql) === true) {
    $return = array(
      "state" => "success",
      "albumid" => $conn->insert_id
    );

  } else {
    $return = array(
      "state" => "error"
    );
  }

  return $return;
}
?>
