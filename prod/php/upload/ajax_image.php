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
include "admin_functions.php";
validate_session();

$coverpath = "../../covers/" . $_SESSION["sd_albumid"] . "/";
$covername = "cover.jpg";
$lowcovername = "min.cover.jpg";

if(!empty($_POST["cover_url"])) {
  // download the cover

  $url = $_POST["cover_url"];
  $check = upload_image_from_url($url);
  $check ? json_success("image") : json_error($check);
} else {
  // we are handling a file upload

  $check = validate_upload($_FILES['file']);
  if ($check !== true)
  json_error($check);

// check if we are working with cover
if(validate_image($_FILES['file']["tmp_name"])) {
  mkdir($coverpath, 0755);
  resize("800", $coverpath.$covername, $_FILES["file"]["tmp_name"], getimagesize($_FILES["file"]["tmp_name"]), 90);
  resize("300", $coverpath.$lowcovername, $_FILES["file"]["tmp_name"], getimagesize($_FILES["file"]["tmp_name"]), 40);
  json_success("image");

}
}
?>
