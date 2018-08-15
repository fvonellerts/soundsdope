<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles scan functions:
- proxy audio, ignoring verified status
*/
include_once "../../php/stream/stream_functions.php";
include_once "../../php/mega/mega_functions.php";
header("Content-type: audio/mpeg; charset=UTF-8");
set_time_limit(0);

if(empty($_GET["id"]))
json_error("empty_id");

$id = intval($_GET["id"]);
$url = mega_url($id, false);
if($url === false)
json_error("invalid_sql");

mega_stream($url);
?>
