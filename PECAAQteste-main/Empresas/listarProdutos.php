<?php
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "pecaaq";

$conn = new mysqli($servidor, $usuario, $senha, $banco);
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

$sql = "SELECT id_produto, nome, sku_universal, marca, descricao_tecnica, foto_principal, preco, categoria, data_cadastro FROM produtos ORDER BY id_produto DESC";
$result = $conn->query($sql);
$produtos = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $produtos[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($produtos);
$conn->close();
?>