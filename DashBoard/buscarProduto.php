<?php
header("Content-Type: application/json; charset=utf-8");

$conn = new mysqli("localhost", "root", "", "pecaaq");
$id = $_GET["id"] ?? 0;

$sql = $conn->query("SELECT * FROM produtos WHERE id_produto = $id");

if ($sql->num_rows == 0) {
    echo json_encode(["ok" => false]);
    exit;
}

echo json_encode([
    "ok" => true,
    "produto" => $sql->fetch_assoc()
]);
