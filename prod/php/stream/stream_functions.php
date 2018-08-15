<?php
/*
part of soundsdope v2 desk - php library / Copyright (c) 2015 Dope Inc.
handles scan functions:
- return tracks
- supply tracks/cover (original path is never used)
*/

function supply($path) {
  set_time_limit(0);
  $strContext=stream_context_create(
  array(
    'http'=>array(
      'method'=>'GET',
      'header'=>"Accept-language: en\r\n"
    )
  )
);
$fpOrigin=fopen($path, 'rb', false, $strContext);
while(!feof($fpOrigin)){
  $buffer=fread($fpOrigin, 4096);
  echo $buffer;
  flush();
}
fclose($fpOrigin);
}

function json_error($string) {

  $return = array(
    "state" => "error",
    "type" => $string
  );

  die(json_encode($return));
}
?>
