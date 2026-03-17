<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$cantidad = isset($_GET['cantidad']) ? floatval($_GET['cantidad']) : 1;
$from = isset($_GET['from']) ? strtoupper($_GET['from']) : 'EUR';
$to = isset($_GET['to']) ? strtoupper($_GET['to']) : 'USD';

if ($cantidad <= 0){
    echo json_encode(["status" => "error", "message" => "La cantidad debe ser mayor que cero."]);
    exit;
}
$url = "https://api.frankfurter.app/latest?amount={$cantidad}&from={$from}&to={$to}";

try{
    $respuesta = @file_get_contents($url);
    if ($respuesta === FALSE) {
        throw new Exception("Error al obtener los datos de la API.");
    }
    $datos = json_decode($respuesta, true);

    echo json_encode(["status" => "success", "data" => $datos]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>