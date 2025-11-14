<?php
session_start();

// limpar variáveis da sessão
$_SESSION = [];

// apagar cookie da sessão
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

session_destroy();

// redirecionar para a página de login
header("Location: ../Login/indexLogin.html");
exit;
