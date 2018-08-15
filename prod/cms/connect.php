<?php
/*
part of soundsdope v2 desk - php library / Copyright (c) 2015 Dope Inc.
handles the mysql connection
*/
include "config.php";

// Create connection USE INSERT AND READ
$conn = new mysqli($GLOBALS["mysqli_server"], $GLOBALS["mysqli_user_full"], $GLOBALS["mysqli_pw_full"], $GLOBALS["mysqli_db"]);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
 ?>
