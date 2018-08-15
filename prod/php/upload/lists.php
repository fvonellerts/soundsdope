<?php
/*
part of soundsdope v3 desk - php library / Copyright (c) 2016 Dope Inc.
handles genre functions:
- display upload genre list
- display upload artist list
*/

function genre_list() {
  include "php/connect.php";
  $output = "";
  $sql = "SELECT id,name FROM genres WHERE subgenre = '0' ORDER BY id";

  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        $sql2 = "SELECT id,name FROM genres WHERE subgenre = '".$row["id"]."' ORDER BY id";

        $result2 = $conn->query($sql2);
        if ($result2->num_rows > 0) {

            while($row2 = $result2->fetch_assoc()) {
              $output .= "<option value='".htmlspecialchars($row2["id"])."'>".htmlspecialchars($row2["name"])." (".htmlspecialchars($row["name"]).")</option>";
            }

        } else {
            $output .= "<option value='".htmlspecialchars($row["id"])."'>".htmlspecialchars($row["name"])."</option>";
        }
      }
      return $output;
  } else {
      echo "No genres found!";
  }
}

function artist_list() {
  include "php/connect.php";
  $output = "";
  $sql = "SELECT name FROM artists";

  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        $output .= "<option value='".htmlspecialchars($row["name"])."'>";
      }
      return $output;
  }
}

function track_list() {
  include "php/connect.php";
  $output = "";
  $sql = "SELECT id,name,track,playtime FROM tracks WHERE albumid = " . mysqli_real_escape_string($conn, intval($_SESSION["sd_albumid"])) . " ORDER BY track";

  $result = $conn->query($sql);
  if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        $output .= '<li data-id="'.intval($row["id"]).'" oncontextmenu="$rc_referer = $(this);rightclick_popup(event, &quot;edit_track&quot;);return false;"><div class="playing">'.intval($row["track"]).'</div><div class="title">'.htmlspecialchars($row["name"]).'</div><div class="duration">'.htmlspecialchars($row["playtime"]).'</div></li>';
      }
      return $output;
  }
}

function generate_account($length) {
 return substr(hash('sha512',rand()),0,$length);
}

function generate_pw() {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?";
    $password = substr( str_shuffle( $chars ), 0, 20 );
    return $password;
}
?>
