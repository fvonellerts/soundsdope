<?php
session_start();
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles upload functions: (single file!)
- gets path / creates it if necessary
- checks if handling valid cover or valid music
- resize and convert image to jpg
- extracts tracknumber, name & playtime
- saves to DB
*/
//set_time_limit(0);
include "connect.php";
include "admin_functions.php";
include_once "../mega/mega_functions.php";
validate_session();

if(!empty($_POST["mega_url"])) {
  // we are handling a file upload

  $file = mega_save($_POST["mega_url"]);
  if ($file === false)
  json_error($file);

if(validate_audio($file)) {

  try {

    $hash = hash_file("sha256", $file);
    $filename = basename($file);

    $track = id3($file, "track");
    if(empty($track))
    $track = "1";
    $playtime = id3($file, "playtime");
    if(empty($playtime))
    $playtime = "0:00";
    $name = id3($file, "name");
    if(empty($name)) {
      $name = $filename;
    }

    $sql = "INSERT INTO tracks (track, playtime, hash, name, albumid, URL) VALUES ('" . mysqli_real_escape_string($conn, intval($track)) . "', '" . mysqli_real_escape_string($conn, $playtime) . "', '" . mysqli_real_escape_string($conn, $hash) . "', '" . mysqli_real_escape_string($conn, $name) . "', '" . mysqli_real_escape_string($conn, $_SESSION['sd_albumid']) . "', '" . mysqli_real_escape_string($conn, $_POST['mega_url']) . "')";

    if ($conn->query($sql) !== TRUE)
    json_error("invalid_sql");

            $return = array(
              "state" => "success",
              "type" => "audio",
              "id" => $conn->insert_id,
              "track" => htmlspecialchars(intval($track)),
              "name" => htmlspecialchars($name),
              "playtime" => htmlspecialchars($playtime)
            );

            die(json_encode($return));

  } catch (Exception $e) {
    json_error("invalid_file");
  }

} else {
  json_error("invalid_file");
}
unlink($file);
}
?>
