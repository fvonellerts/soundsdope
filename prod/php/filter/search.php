<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles store functions:
- return search calls
*/
include_once "../connect.php";
include_once "../config.php";
include_once "search_functions.php";

$search = $_POST["search"];

if(!empty($search)) {
  $search = mysqli_real_escape_string($conn, "%".$search."%");
  $return = array();
  // search

  // Select 3 artists
  $sql = "SELECT DISTINCT artists.id as id,artists.name as name
  FROM artists
  WHERE (LOWER(artists.name) LIKE LOWER('$search')) ORDER BY RAND() LIMIT 2";

  $partreturn = array();

  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    while(($row = $result->fetch_assoc())) {
      $part = array(
        "type" => "artist",
        "id" => htmlspecialchars($row["id"]),
        "name" => htmlspecialchars($row["name"])
      );
      array_push($partreturn, $part);
    }
    array_push($return, $partreturn);
  }

  // Select 4 albums
  $sql = "SELECT DISTINCT albums.id as id,albums.title as title,artists.name as artist
  FROM albums
  LEFT JOIN artists ON albums.artistid = artists.id
  WHERE (LOWER(albums.title) LIKE LOWER('$search') AND albums.verified=true) ORDER BY RAND() LIMIT 3";

  $partreturn = array();

  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    while(($row = $result->fetch_assoc())) {
      $part = array(
        "type" => "album",
        "id" => htmlspecialchars($row["id"]),
        "artist" => htmlspecialchars($row["artist"]),
        "title" => htmlspecialchars($row["title"])
      );
      array_push($partreturn, $part);
    }
    array_push($return, $partreturn);
  }

  // Select 6 tracks
  $sql = "SELECT DISTINCT tracks.id as id,tracks.name as name,albums.id as albumid,artists.name as artist
  FROM tracks
  LEFT JOIN albums ON tracks.albumid = albums.id
  LEFT JOIN artists ON albums.artistid = artists.id
  WHERE (LOWER(tracks.name) LIKE LOWER('$search') AND albums.verified=true) ORDER BY RAND() LIMIT 5";

  $partreturn = array();

  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    while(($row = $result->fetch_assoc())) {
      $part = array(
        "type" => "track",
        "id" => htmlspecialchars($row["id"]),
        "name" => htmlspecialchars($row["name"]),
        "artist" => htmlspecialchars($row["artist"]),
        "albumid" => htmlspecialchars($row["albumid"])
      );
      array_push($partreturn, $part);
    }
    array_push($return, $partreturn);
  }

  // Select 2 playlists
  $sql = "SELECT DISTINCT playlists.id as id,playlists.name as name
  FROM playlists
  WHERE (LOWER(playlists.name) LIKE LOWER('$search')) ORDER BY RAND() LIMIT 2";

  $partreturn = array();

  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    while(($row = $result->fetch_assoc())) {
      $part = array(
        "type" => "playlist",
        "id" => htmlspecialchars($row["id"]),
        "name" => htmlspecialchars($row["name"])
      );
      array_push($partreturn, $part);
    }
    array_push($return, $partreturn);
  }

  die(json_encode($return));

} else if(!empty($_POST["track"])) {

  $return = array();
  // search

  // search track info
  $sql = "SELECT DISTINCT tracks.track, tracks.playtime, tracks.name
  FROM tracks
  WHERE (tracks.albumid = ".mysqli_real_escape_string($conn, intval($_POST["track"])).")";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    while(($row = $result->fetch_assoc())) {
      $part = array(
        "id" => htmlspecialchars($row["id"]),
        "track" => htmlspecialchars($row["track"]),
        "name" => htmlspecialchars($row["name"]),
        "playtime" => htmlspecialchars($row["playtime"])
      );
      array_push($return, $part);
    }
  }
  die(json_encode($return));

}
?>
