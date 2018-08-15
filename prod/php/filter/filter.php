<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles store functions:
- return search calls
*/
include_once "../connect.php";
include_once "../config.php";
include_once "search_functions.php";

if(!empty($_POST["artist"])) {

  $return = array();
  // search

  // filter albums by artist
  $sql = "SELECT DISTINCT albums.id as id, albums.title as title, artists.name as artist
  FROM artists
  JOIN albums ON artists.id = albums.artistid
  WHERE (artists.id = ".mysqli_real_escape_string($conn, intval($_POST["artist"]))." AND albums.verified=true) ORDER BY RAND()";

  $result = $conn->query($sql);
  if(!$result || !($result->num_rows > 0))
  json_error("invalid_sql");

  while(($row = $result->fetch_assoc())) {
    $part = array(
      "id" => htmlspecialchars($row["id"]),
      "title" => htmlspecialchars($row["title"]),
      "artist" => htmlspecialchars($row["artist"])
    );
    array_push($return, $part);
  }
  die(json_encode($return));

} else if(!empty($_POST["album_data"])) {

  $return = array();
  // search

  // get album data
  $sql = "SELECT DISTINCT artists.name as artist, albums.title as title
  FROM albums
  LEFT JOIN artists ON albums.artistid = artists.id
  WHERE (albums.id = ".mysqli_real_escape_string($conn, intval($_POST["album_data"])).")";

  $result = $conn->query($sql);
  if(!$result || !($result->num_rows > 0))
  json_error("invalid_sql");

  while(($row = $result->fetch_assoc())) {
    $part = array(
      "artist" => htmlspecialchars($row["artist"]),
      "title" => htmlspecialchars($row["title"])
    );
    array_push($return, $part);
  }
  die(json_encode($return));

} else if(!empty($_POST["album"])) {

  $return = array();
  // search

  // filter tracks by album and get album data
  $sql = "SELECT DISTINCT tracks.id as id, track, playtime, tracks.name as name, artists.name as artist, albums.title as title
  FROM tracks
  LEFT JOIN albums ON tracks.albumid = albums.id
  JOIN artists ON albums.artistid = artists.id
  WHERE (tracks.albumid = ".mysqli_real_escape_string($conn, intval($_POST["album"])).") ORDER BY track";

  $result = $conn->query($sql);
  if(!$result || !($result->num_rows > 0))
  json_error("invalid_sql");

  while(($row = $result->fetch_assoc())) {
    $part = array(
      "id" => htmlspecialchars($row["id"]),
      "track" => htmlspecialchars($row["track"]),
      "name" => htmlspecialchars($row["name"]),
      "playtime" => htmlspecialchars($row["playtime"]),
      "artist" => htmlspecialchars($row["artist"]),
      "title" => htmlspecialchars($row["title"])
    );
    array_push($return, $part);
  }
  die(json_encode($return));

} else if(!empty($_POST["track"])) {

  $return = array();
  // search

  // filter info by track
  $sql = "SELECT DISTINCT track, playtime, tracks.name as name, artists.name as artist, albums.title as title, albums.id as id
  FROM tracks
  LEFT JOIN albums ON tracks.albumid = albums.id
  JOIN artists ON albums.artistid = artists.id
  WHERE (tracks.id = ".mysqli_real_escape_string($conn, intval($_POST["track"])).")";

  $result = $conn->query($sql);
  if(!$result || !($result->num_rows > 0))
  json_error("invalid_sql");

  while(($row = $result->fetch_assoc())) {
    $part = array(
      "id" => htmlspecialchars($row["id"]),
      "track" => htmlspecialchars($row["track"]),
      "name" => htmlspecialchars($row["name"]),
      "playtime" => htmlspecialchars($row["playtime"]),
      "artist" => htmlspecialchars($row["artist"]),
      "title" => htmlspecialchars($row["title"])
    );
    array_push($return, $part);
  }
  die(json_encode($return));

} else if (!empty($_POST["genre"]) && !empty($_POST["limit"])) {
  $genre = mysqli_real_escape_string($conn, intval($_POST["genre"]));
  $limit = mysqli_real_escape_string($conn, intval($_POST["limit"]));

  // filter albums by genre
  $sql = "SELECT DISTINCT albums.id as id, artists.name as artist, albums.title as title FROM genres
  JOIN albums ON albums.genreid = genres.id
  JOIN artists ON albums.artistid = artists.id
  WHERE genres.id = $genre AND albums.verified=true
  ORDER BY RAND() LIMIT $limit";

  $result = $conn->query($sql);
  if(!$result)
  json_error("invalid_sql");

    $return = array();

    while(($row = $result->fetch_assoc())) {
      $partreturn = array(
        "id" => htmlspecialchars($row["id"]),
        "artist" => htmlspecialchars($row["artist"]),
        "title" => htmlspecialchars($row["title"])
      );
      array_push($return, $partreturn);
    }

    die(json_encode($return));
}
?>
