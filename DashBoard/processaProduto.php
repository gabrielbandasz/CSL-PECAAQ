<?php
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "pecaaq";

$conn = new mysqli($servidor, $usuario, $senha, $banco);
if ($conn->connect_error) die("Erro de conexão: " . $conn->connect_error);

// Recebe dados do formulário
$nome = $_POST['nome'] ?? '';
$sku = $_POST['sku'] ?? '';
$marca = $_POST['marca'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$preco = $_POST['preco'] ?? '';
$foto = $_FILES['foto']['name'] ?? '';

if (!$nome || !$preco || !$foto) die("Nome, preço e foto são obrigatórios!");

// Pasta uploads
$pasta = "uploads/";
if (!is_dir($pasta)) mkdir($pasta, 0777, true);

$nomeArquivo = uniqid() . "_" . basename($foto);
$caminho_final = $pasta . $nomeArquivo;

if (move_uploaded_file($_FILES['foto']['tmp_name'], $caminho_final)) {
    $sql = "INSERT INTO produtos (nome, sku_universal, marca, descricao_tecnica, foto_principal, preco)
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss", $nome, $sku, $marca, $descricao, $nomeArquivo, $preco);
    if ($stmt->execute()) {
        echo "Produto cadastrado com sucesso!";
    } else {
        echo "Erro ao cadastrar produto: " . $stmt->error;
    }
    $stmt->close();
} else {
    echo "Erro ao fazer upload da imagem.";
}

$conn->close();