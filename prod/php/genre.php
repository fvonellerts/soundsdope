<?php
/*
part of soundsdope v2 desk - php library / Copyright (c) 2015 Dope Inc.
handles genre functions:
- display genre list
*/

function genre_list() {
  include "php/connect.php";
  $output = "";
  $sql = "SELECT id,name FROM genres WHERE subgenre = '0' ORDER BY id";

  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
    $output .= "<ul>";
      while($row = $result->fetch_assoc()) {
        $sql2 = "SELECT id,name FROM genres WHERE subgenre = '".intval($row["id"])."' ORDER BY id";

        $result2 = $conn->query($sql2);
        if ($result2->num_rows > 0) {
          $output .= "<li class='dropdown'>".$row["name"];
          $output .= "<ul>";
            while($row2 = $result2->fetch_assoc()) {
              $output .= "<li data-genre='".$row2["id"]."'>".$row2["name"]."</li>";
            }
          $output .= "</ul></li>";

        } else {
            $output .= "<li data-genre='".$row["id"]."'>".$row["name"]."</li>";
        }
      }
      $output .= "</ul>";
      return $output;
  } else {
      return "No genres found!";
  }
}
?>
