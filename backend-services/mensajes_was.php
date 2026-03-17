<?php
header('Content-Type: application/json');

$numero_remitente = $_POST['From'] ?? '';
$mensaje_usuario = $_POST['Body'] ?? '';

if (empty($mensaje_usuario)){
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    echo "<Response><Message>Error: Mensaje vacío.</Message></Response>";
    exit;
}
$openai_api_key = ''; 
$url_openai = 'https://api.openai.com/v1/chat/completions';
?>