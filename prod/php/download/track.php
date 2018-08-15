<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles download functions: (single file!)
- track download (streaming download)
*/
include "../mega/mega_functions.php";
include "download_functions.php";

if(empty($_GET["id"]))
json_error("empty_id");

$id = intval($_GET["id"]);
$url = mega_url($id, true);

if($url === false)
json_error("invalid_sql");

mega_download($url);
?>
