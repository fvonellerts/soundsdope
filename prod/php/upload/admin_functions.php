<?php
/*
part of soundsdope v2 desk - php library / Copyright (c) 2015 Dope Inc.
handles upload functions:
- convert and resize of cover
- extracts tracknumber & playtime
*/

function validate_session() {
  session_start();

  if(empty($_SESSION['sd_albumid']))
  die("ERROR");

  if(empty($_SESSION['mega_mail']))
  die("ERROR");

  if(empty($_SESSION['mega_pw']))
  die("ERROR");
}

function validate_upload($file_array) {
  $allowedExts = array("jpeg", "jpg", "png", "gif");
  $allowedTypes = array(
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/png'
  );

  $temp = explode(".", $file_array["name"]);
  $extension = end($temp);

  if ($file_array["error"] > 0)
  return "upload_error";

  if ($file_array["name"] === "")
  return "upload_noname";

  if(!validate_mime($file_array["tmp_name"], $allowedTypes))
  return "upload_mime";

  if (!in_array($extension, $allowedExts))
  return "upload_ext";

  if ($file_array["size"] > 50000000 || $file_array["size"] < 30000)
  return "upload_size";

  return true;
}
function validate_mime($file, $allowedTypes) {
  $finfo = new finfo(FILEINFO_MIME);
  $type = explode(";", $finfo->file($file));
  if (in_array($type[0], $allowedTypes))
  {
    return true;
  } else {
    return false;
  }
}
function validate_ext($file, $allowedExts) {
  if (!in_array(pathinfo($file, PATHINFO_EXTENSION), $allowedExts)) {
    return false;
  } else {
    return true;
  }
}

function validate_audio($file) {
  $allowedExts = array("mp3");
  $allowedTypes = array(
    'audio/mpeg',
    'audio/mp3',
    'application/octet-stream'
  );

  if(!validate_mime($file, $allowedTypes))
  return false;
  if(!validate_ext($file, $allowedExts))
  return false;

  return true;
}

function validate_image($file) {
  $img_info = getimagesize($file);
  if (($img_info !== false) && (($img_info[2] == IMAGETYPE_GIF) || ($img_info[2] == IMAGETYPE_JPEG) || ($img_info[2] == IMAGETYPE_PNG))) {
    return true;
  } else {
    return false;
  }
}
function upload_image_from_url($url) {
  session_start();
  include "../config.php";

  $allowedExts = array("jpeg", "jpg", "png", "gif");
  $allowedTypes = array(
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/png'
  );

  $url_headers = get_headers($url, 1);

    if(isset($url_headers['Content-Type'])){

        $type = strtolower($url_headers['Content-Type']);

        if(!in_array($type, $allowedTypes))
        return "upload_mime";

        $temp = explode(".", $url);
        $extension = end($temp);
        if(!in_array($extension, $allowedExts))
        return "upload_ext";

        $temp = tmpfile();
        fwrite($temp, file_get_contents($url));
        $path = stream_get_meta_data($temp);
	$path = $path['uri'];

        if(!validate_mime($path, $allowedTypes))
        return "upload_mime";

        $newpath = "../".$GLOBALS["cover_path"].$_SESSION["sd_albumid"]."/";
        $minimage = "min.cover.jpg";
        $image = "cover.jpg";

        mkdir("../".$GLOBALS["cover_path"].$_SESSION["sd_albumid"], 0755);

        $img_info = getimagesize($path);
        resize("800", $newpath.$image, $path, $img_info, 90);
        resize("300", $newpath.$minimage, $path, $img_info, 40);

        return true;
    } else {
      return false;
    }
}

function resize($newWidth, $targetFile, $originalFile, $img_info, $quality) {

  switch ($img_info[2]) {
    case IMAGETYPE_GIF  : $src = imagecreatefromgif($originalFile);  break;
    case IMAGETYPE_JPEG : $src = imagecreatefromjpeg($originalFile); break;
    case IMAGETYPE_PNG  : $src = imagecreatefrompng($originalFile);  break;
    default : json_error("image_invalidimagetype");
  }

  list($width, $height) = $img_info;

  $newHeight = ($height / $width) * $newWidth;
  $tmp = imagecreatetruecolor($newWidth, $newHeight);
  imagecopyresampled($tmp, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

  if (file_exists($targetFile)) {
    unlink($targetFile);
  }
  imagejpeg($tmp, $targetFile, $quality);
}

function id3($file, $return) {
  require_once 'getid3/getid3.php';

  $getID3 = new getID3;
  $getID3->setOption(array('encoding' => 'UTF-8'));
  header('Content-Type: text/html; charset=UTF-8');
  $fileinformation = $getID3->analyze($file);
  getid3_lib::CopyTagsToComments($fileinformation);
  if(!empty($fileinformation['error'])) {
    die("ERROR>Error with ID3 Tags: " + $fileinformation['error']);
  }
  switch ($return) {
    case 'track':

    // lets try different tag extractions
    $track = $fileinformation['tags']['id3v2']['track_number'][0];

    if(empty($track)) {
      $track = $fileinformation['tags']['id3v1']['track'][0];
    }
    if(empty($track)) {
      $track = $fileinformation['id3v1']['track'][0];
    }
    if(empty($track)) {
      $track = $fileinformation["comments"]["track_number"][0];
    }
    if(empty($track)) {
      $track = $fileinformation["comments"]["track"][0];
    }

    // cut 03 to 3 and 3/10 to 3
    $track = ltrim($track, '0');
    if (strpos($track, '/')) {
      $track = explode("/", $track);
      $track = $track[0];
    }

    return $track;
    break;

    case 'playtime':
    return $fileinformation['playtime_string'];
    break;

    case 'artist':
    return $fileinformation['comments']['artist'][0];
    break;

    case 'album':
    return $fileinformation['comments']['album'][0];
    break;

    case 'name':
    $title = $fileinformation['tags']['id3v2']['title'][0];
    if(empty($title)) {
      $title = $fileinformation['tags']['id3v1']['title'][0];
    }

    return $title;
    break;
  }
}

function json_error($string) {

  $return = array(
    "state" => "error",
    "type" => $string
  );

  die(json_encode($return));
}

function json_success($string) {

  $return = array(
    "state" => "success",
    "type" => $string,
    "id" => $_SESSION["sd_albumid"]
  );

  die(json_encode($return));
}
?>
