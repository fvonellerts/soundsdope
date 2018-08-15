<?php
session_start();
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles upload functions: (single file!)
- edits of the database entrys for albums/tracks
*/
include "connect.php";
include "admin_functions.php";
validate_session();

if(!empty($_POST["trackid"]) && empty($_POST["megalink"])) {

  $type = htmlspecialchars($_POST["type"]);
  if(empty($type))
  json_error("invalid_edittype");

  $change = htmlspecialchars($_POST["change"]);
  if(empty($change))
    json_error("invalid_editchange");

  switch ($type) {
    case 'playing':
    $type2 = "track";
    $change = intval($change);
    break;
    case 'title':
    $type2 = "name";
    break;
    case 'duration':
    $type2 = "playtime";
    if (strpos($change, ':') === false)
    json_error("invalid_editchange");

    break;
    default:
    json_error("invalid_edittype");
  }

  $sql = "UPDATE tracks SET ". mysqli_real_escape_string($conn, $type2) ."='" . mysqli_real_escape_string($conn, $change) . "' WHERE (id='" . mysqli_real_escape_string($conn, intval($_POST["trackid"])) . "' AND albumid='" . mysqli_real_escape_string($conn, $_SESSION['sd_albumid']) . "')";
  if ($conn->query($sql) !== true)
  json_error("invalid_sql");

  $return = array(
    "state" => "success",
    "type" => "edit_track",
    "id" => intval($_POST["trackid"]),
    "edit_type" => $type,
    "change" => $change
  );

  die(json_encode($return));

} else if(!empty($_POST["megalink"])) {

  $sql = "UPDATE tracks SET URL='" . mysqli_real_escape_string($conn, $_POST["megalink"]) . "' WHERE (id='" . mysqli_real_escape_string($conn, intval($_POST["trackid"])) . "' AND albumid='" . mysqli_real_escape_string($conn, $_SESSION['sd_albumid']) . "')";
  if ($conn->query($sql) !== true)
  json_error("invalid_sql");

  $return = array(
    "state" => "success",
    "type" => "mega_link",
    "id" => intval($_POST["trackid"])
  );

  die(json_encode($return));

} else if(!empty($_POST["action"])) {

  /*
  OLD CODE
  if (strpos($change, ' - ') !== false) {
    $change = explode(" - ", $change);
    $sql = "UPDATE albums SET artist='" . mysqli_real_escape_string($conn, $change[0]) . "', title='" . mysqli_real_escape_string($conn, $change[1]) . "' WHERE id='" . mysqli_real_escape_string($conn, $_POST["albumid"]) . "'";
    if ($conn->query($sql) !== TRUE) {
        echo "ERROR>SQL: " . $sql . "<br>" . $conn->error;
    } else {
      echo "SUCCESS>edited";
    }
  } else {
    die("ERROR>String not split!");
  }
  */

}
?>
