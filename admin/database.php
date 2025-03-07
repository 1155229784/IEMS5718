<?php

// for testing                                      
$servername = "localhost";
$username = "root";
$password = "Lmsybl723";
$databasename = "project";

// for production
// $servername = "localhost";
// $username = "root";
// $password = "Lmsybl723";

// Create connection
$conn = new mysqli($servername, $username, $password, $databasename);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

?>