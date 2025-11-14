<?php
// debug_post.php - usar apenas para troubleshooting
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);
session_start();
header('Content-Type: application/json; charset=utf-8');

$raw = file_get_contents('php://input');
echo json_encode([
  'GET' => $_GET,
  'POST' => $_POST,
  'input_raw' => $raw,
  'SESSION' => isset($_SESSION) ? $_SESSION : null
], JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
