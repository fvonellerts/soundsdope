<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
download functions:
- direct download mega
- force download
*/

function album_urls($id) {
  include_once "connect.php";
  include_once "../connect.php";

  $sql = "SELECT tracks.URL as URL, tracks.name as name, tracks.track as track, albums.title as title FROM tracks
  LEFT JOIN albums on tracks.albumid = albums.id
  WHERE (albums.id = '" . mysqli_real_escape_string($conn, intval($id)) . "' AND albums.verified = true)";

  $result = $conn->query($sql);
  if ($result === false)
  return false;

  if (!$result->num_rows > 0)
  return false;

  $return = array();

  while($row = $result->fetch_assoc()) {
    $part = array(
      "URL" => $row["URL"],
      "name" => $row["name"],
      "track" => $row["track"],
      "title" => $row["title"]
    );
    array_push($return, $part);
  }
  return $return;
}
?>
