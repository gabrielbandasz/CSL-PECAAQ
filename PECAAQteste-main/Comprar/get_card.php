<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

// DB
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "pecaaq";

$conn = new mysqli($servidor, $usuario, $senha, $banco);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'Erro de conexão']);
    exit;
}

$cart = $_SESSION['cart'] ?? [];
if (empty($cart)) {
    echo json_encode(['status'=>'ok','items'=>[], 'cart_count'=>0, 'total'=>0]);
    $conn->close();
    exit;
}

$ids = array_keys($cart);
$placeholders = implode(',', array_fill(0, count($ids), '?'));
$sql = "SELECT id_anuncio, titulo, preco, quantidade_estoque FROM anuncio WHERE id_anuncio IN ($placeholders)";
$stmt = $conn->prepare($sql);

// bind dinâmico
$types = str_repeat('i', count($ids));
$stmt->bind_param($types, ...$ids);
$stmt->execute();
$res = $stmt->get_result();

$items = [];
$total = 0;
while ($row = $res->fetch_assoc()) {
    $id = (int)$row['id_anuncio'];
    $q = $cart[$id] ?? 0;
    $preco = (float)$row['preco'];
    $subtotal = $preco * $q;
    $items[] = [
        'id_anuncio'=>$id,
        'titulo'=>$row['titulo'],
        'preco'=>$preco,
        'quantidade'=>$q,
        'subtotal'=>$subtotal,
        'estoque'=>$row['quantidade_estoque']
    ];
    $total += $subtotal;
}
$stmt->close();

echo json_encode(['status'=>'ok','items'=>$items,'total'=>$total,'cart_count'=>array_sum($cart)]);
$conn->close();
