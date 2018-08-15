<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles scan functions:
- supply cover (original path is never used)
*/

include_once "stream_functions.php";
include_once "../config.php";

header('Content-type: image/jpeg; charset=UTF-8');

$id = intval($_GET["id"]);
$min = "";
if(isset($_GET["min"])) {
  $min = "min.";
}

if(!empty($id)) {
  $path = "../" . $GLOBALS["cover_path"] . $id . "/" . $min . "cover.jpg";
  if(file_exists($path)) {
    supply($path);
  } else {
    json_error("cover_invalid");
  }
}
?>
