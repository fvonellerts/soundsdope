<?php
session_start();
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles upload functions: (single file!)
- verifies albums
*/
include "../connect.php";
include "admin_functions.php";
validate_session();

if(!empty($_SESSION["sd_albumid"])) {

  try {
    $path = "../../covers/" . intval($_SESSION['sd_albumid']);
  } catch ( Exception $e ) {
    json_error("invalid_id");
  }

  $sql = "UPDATE albums SET verified=1 WHERE id='" . mysqli_real_escape_string($conn, $_SESSION['sd_albumid']) . "'";
  if ($conn->query($sql) !== true)
  json_error("invalid_sql");

  json_success("admin_album");
}
?>
