<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles download functions:
- album download (create temp zip)

include "../mega/mega_functions.php";
include "download_functions.php";

if(empty($_GET["id"]))
json_error("empty_id");

$id = intval($_GET["id"]);
$urls = album_urls($id);

if($urls === false)
json_error("invalid_sql");

$file = tempnam("tmp", "zip");
$zip = new ZipArchive();
$zip->open($file, ZipArchive::OVERWRITE);
$zipname = "album.zip";

foreach ($urls as $url) {
  foreach ($url as $key => $value) {
    $filename = "0".$url["track"]." ".$url["name"].".mp3";
    $zip->addFile(mega_save($url["URL"]), $filename);
  }
}

$zip->close();
header("Content-Type: application/zip");
header("Content-Length: " . filesize($file));
header("Content-Disposition: attachment; filename=\"$zipname\"");
readfile($file);

unlink($file);
*/
?>
