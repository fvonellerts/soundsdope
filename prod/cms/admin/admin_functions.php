<?php
/*
part of soundsdope v2 desk - php library / Copyright (c) 2015 Dope Inc.
handles upload functions:
- convert and resize of cover
- extracts tracknumber & playtime
*/

function validate_session() {
  session_start();

  if($_SESSION['sd_admin'] !== true)
  die("ERROR");
}

function json_error($string) {

  $return = array(
    "state" => "error",
    "type" => $string
  );

  die(json_encode($return));
}

function json_success($string) {

  $return = array(
    "state" => "success",
    "type" => $string,
    "id" => $_SESSION["sd_albumid"]
  );

  die(json_encode($return));
}
?>
