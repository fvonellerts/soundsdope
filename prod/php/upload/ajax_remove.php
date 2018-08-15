<?php
session_start();
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles upload functions: (single file!)
- deletes db entries
- deletes cover
*/
include "connect.php";
include "admin_functions.php";
validate_session();

if(!empty($_POST["trackid"])) {

  // we are just removing a track from db
  $sql = "DELETE FROM tracks WHERE (id='" . mysqli_real_escape_string($conn, intval($_POST["trackid"])) . "' AND albumid='".mysqli_real_escape_string($conn, $_SESSION['sd_albumid'])."')";

  if ($conn->query($sql) === true) {
    $return = array(
      "state" => "success",
      "type" => "delete_track",
      "id" => intval($_POST["trackid"])
    );

    die(json_encode($return));

  } else {
    json_error("invalid_sql");
  }

} else if(!empty($_POST["action"])) {

  try {
    $path = "../../covers/" . intval($_SESSION['sd_albumid']);
  } catch ( Exception $e ) {
    json_error("invalid_id");
  }

  $sql = "DELETE FROM albums WHERE id='" . mysqli_real_escape_string($conn, $_SESSION['sd_albumid']) . "'";
  if ($conn->query($sql) !== true)
  json_error("invalid_sql");

  $sql = "DELETE FROM tracks WHERE albumid='" . mysqli_real_escape_string($conn, $_SESSION['sd_albumid']) . "'";
  if ($conn->query($sql) !== true)
  json_error("invalid_sql");

  try {
    array_map('unlink', glob($path."*"));
    rmdir($path);
  } catch ( Exception $e ) {
    json_error("invalid_delete");
  }

  json_success("delete_album");
}
?>
