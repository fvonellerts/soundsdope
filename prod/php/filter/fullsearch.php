<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2015 Dope Inc.
handles store functions:
- return search calls
*/
include_once "../connect.php";
include_once "../config.php";
include_once "search_functions.php";

$search = $_POST["search"];
$limit = $_POST["limit"];

if(!empty($search) && !empty($_POST["type"]) && !empty($limit)) {
  $search = mysqli_real_escape_string($conn, "%".$search."%");
  $limit = mysqli_real_escape_string($conn, intval($limit));
  $return = array();
  // search

  switch ($_POST["type"]) {
    case 'albums':
    $sql = "SELECT DISTINCT albums.id as id,albums.title as title,artists.name as artist
    FROM albums
    LEFT JOIN artists ON albums.artistid = artists.id
    WHERE (LOWER(albums.title) LIKE LOWER('$search') AND albums.verified=true) ORDER BY RAND() LIMIT $limit";


    $result = $conn->query($sql);
    if(!$result || !($result->num_rows > 0))
    json_error("invalid_sql");

    if ($result->num_rows > 0) {
      while(($row = $result->fetch_assoc())) {
        $part = array(
          "id" => htmlspecialchars($row["id"]),
          "title" => htmlspecialchars($row["title"]),
          "artist" => htmlspecialchars($row["artist"])
        );
        array_push($return, $part);
      }
    }
    break;

    case 'playlists':
    $sql = "SELECT DISTINCT playlists.id as id,playlists.name as name
    FROM playlists
    WHERE (LOWER(playlists.name) LIKE LOWER('$search')) ORDER BY RAND() LIMIT $limit";

    $result = $conn->query($sql);
    if(!$result || !($result->num_rows > 0))
    json_error("invalid_sql");

    if ($result->num_rows > 0) {
      while(($row = $result->fetch_assoc())) {
        $part = array(
          "id" => htmlspecialchars($row["id"]),
          "name" => htmlspecialchars($row["name"])
        );
        array_push($return, $part);
      }
    }
    break;

    default:
    json_error("invalid_argument");
    break;
  }

  die(json_encode($return));

}
?>
