<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles search functions:
- run the queries
*/

function autoplay_random($skip, $albumid) {
  include "../connect.php";

  $return = array();
  $last = get_last_track($albumid);

  $random_num = rand(1, $last);
  while(intval($random_num) === intval($skip)) {
    $random_num = rand(1, $last);
  }
  $sql = "SELECT id FROM tracks WHERE albumid = '$albumid' AND track = '$random_num'";
  $result = $conn->query($sql);

  if ($result->num_rows === 0)
  json_error("invalid_sql");

  while($row = $result->fetch_assoc()) {
    $partreturn = array(
      "oldid" => $skip,
      "genid" => $random_num,
      "id" => htmlspecialchars($row["id"])
    );
    array_push($return, $partreturn);
  }

  echo json_encode($return);
}

function get_last_track($albumid) {
  include "../connect.php";

  $sql = "SELECT MAX(track) as max_track FROM tracks WHERE albumid = '$albumid'";
  $result = $conn->query($sql);

  if($result->num_rows === 0)
  return "invalid_sql";

  while($row = $result->fetch_assoc()) {
    $return = htmlspecialchars(intval($row["max_track"]));
  }

  return $return;
}

function autoplay_track($track, $albumid) {
  include "../connect.php";
  $return = array();

  // get track before
  $sql = "SELECT id FROM tracks WHERE albumid = '$albumid' AND track = '$track'";

  $result = $conn->query($sql);
  if ($result->num_rows === 0)
  json_error("invalid_sql");

  while($row = $result->fetch_assoc()) {

    $partreturn = array(
      "id" => htmlspecialchars($row["id"])
    );
    array_push($return, $partreturn);

    echo json_encode($return);
  }
}

function json_error($string) {

  $return = array(
    "state" => "error",
    "type" => htmlspecialchars($string)
  );

  die(json_encode($return));
}

function json_success($string) {

  $return = array(
    "state" => "success",
    "type" => htmlspecialchars($string)
  );

  die(json_encode($return));
}
?>
