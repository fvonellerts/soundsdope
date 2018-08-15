<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles mega functions:
- confirm files
- get file info
- save files
- stream files
- download files
*/
include "lib/mega.class.php";

function mega_stream($url) {
  set_time_limit(0);
  $mega = new Mega();
  $mega->public_file_stream_from_link($url);
}

function mega_download($url) {
  $name = mega_name($url);
  header("Content-type: audio/mpeg; charset=UTF-8");
  header("Content-Disposition: attachment; filename=\"$name.mp3\"");
  set_time_limit(0);
  $mega = new Mega();
  echo $mega->public_file_stream_from_link($url);
}

function mega_save($url) {
  $mega = new Mega();

  try {
    $tmp = sys_get_temp_dir();
    return $mega->public_file_save_from_link($url, $tmp);
  } catch (Exception $e) {
    return false;
  }

}

function mega_name($url) {
  include "../connect.php";

  $sql = "SELECT tracks.name as name FROM tracks
  LEFT JOIN albums on tracks.albumid = albums.id
  WHERE (tracks.URL = '" . mysqli_real_escape_string($conn, $url) . "' AND albums.verified = true)";

  $result = $conn->query($sql);
  if ($result === false)
  return false;

  if (!$result->num_rows > 0)
  return false;

  while($row = $result->fetch_assoc()) {
    $return = $row["name"];
  }
  return $return;
}

function mega_url($id, $verified) {
  include_once "../connect.php";

  if($verified) {
    $sql = "SELECT tracks.URL as URL, tracks.name as name FROM tracks
    LEFT JOIN albums on tracks.albumid = albums.id
    WHERE (tracks.id = '" . mysqli_real_escape_string($conn, intval($id)) . "' AND albums.verified = true)";
  } else {
    $sql = "SELECT tracks.URL as URL FROM tracks
    WHERE tracks.id = '" . mysqli_real_escape_string($conn, intval($id)) . "'";
  }
  $result = $conn->query($sql);
  if ($result === false)
  return false;

  if (!$result->num_rows > 0)
  return false;

  while($row = $result->fetch_assoc()) {
    $return = $row["URL"];
  }
  return $return;
}

function mega_hash($path, $hash) {
  hash_file("sha256", $path) === $hash ? $return = true : $return = false;
  return $return;
}
?>
