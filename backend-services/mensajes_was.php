<?php
header("Content-Type: text/xml");

$numero_remitente = $_POST['From'] ?? '';
$mensaje_usuario = $_POST['Body'] ?? '';

if (empty($mensaje_usuario)){
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    echo "<Response><Message>Error: Mensaje vacío.</Message></Response>";    exit;
    exit;
}
// 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
$openai_api_key = 'AQUI_VA_TU_CLAVE_DE_API_DE_OPENAI';
$url_openai = 'https://api.openai.com/v1/chat/completions';

$$system_prompt = "Eres un Asistente Financiero para el sistema BillFlow. 
Si el usuario reporta un gasto, DEBES responder ÚNICAMENTE con un objeto JSON con este formato: 
{\"tipo_operacion\": \"GASTO\", \"cantidad\": numero, \"concepto\": \"string\", \"categoria\": \"string\"}. 
Si es una pregunta, responde de forma breve y amigable.";

$datos_post = json_encode([
    "model" => "gpt-4o-mini",
    "messages" => [
        ["role" => "system", "content" => $system_prompt],
        ["role" => "user", "content" => $mensaje_usuario]
    ],
    "temperature" => 0.2
]);

$ch = curl_init($url_openai);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $datos_post);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $openai_api_key
]);
$respuesta_openai = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
$mensaje_respuesta = "Hubo un error procesando tu solicitud.";

if ($http_code == 200 && $respuesta_openai) {
    $resultado = json_decode($respuesta_openai, true);
    $texto_ia = $resultado['choices'][0]['message']['content'] ?? '';
    
    $es_json = json_decode($texto_ia);
    
    if ($es_json && json_last_error() === JSON_ERROR_NONE) {
        $gasto = json_decode($texto_ia, true);
        $mensaje_respuesta = "Gasto registrado en BillFlow:\n" . 
                             "Concepto: " . $gasto['concepto'] . "\n" .
                             "Cantidad: " . $gasto['cantidad'] . "€\n" .
                             "Categoría: " . $gasto['categoria'];
    } else {
        $mensaje_respuesta = $texto_ia;
    }
} else {
    $mensaje_respuesta = "Error de conexión con el cerebro de BillFlow (OpenAI).";
}
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo "<Response>\n";
echo "<Message>" . htmlspecialchars($mensaje_respuesta) . "</Message>\n";
echo "</Response>";
?>