<?php
require('fpdf.php');
class PDF extends FPDF
{
    function Header() {
        $this->SetFont('Arial', 'B', 18);
        $this->Cell(60);
        $this->Cell(70, 10, 'BillFlow - Reporte de Economia', 0, 0, 'C');
        $this->Ln(20);
    }

    // pie de página
    function Footer() {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(0, 10, 'Pagina ' . $this->PageNo() . '/{nb}', 0, 0, 'C');
    }

}
$gastos_mock = [
    ["fecha" => "2023-10-02", "concepto" => "Alquiler Piso", "categoria" => "Fijo", "cantidad" => 850.00],
    ["fecha" => "2023-10-05", "concepto" => "Compra Mercadona", "categoria" => "Alimentacion", "cantidad" => 125.50],
    ["fecha" => "2023-10-10", "concepto" => "Factura Luz", "categoria" => "Suministros", "cantidad" => 60.20],
    ["fecha" => "2023-10-12", "concepto" => "Netflix", "categoria" => "Suscripcion", "cantidad" => 12.99],
    ["fecha" => "2023-10-15", "concepto" => "Gasolina Repsol", "categoria" => "Transporte", "cantidad" => 50.00]
];

$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Arial', '', 12);
// información del usuario y periodo
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 10, 'Usuario: Familia Robles Gomez', 0, 1);
$pdf->Cell(0, 10, 'Periodo: Octubre 2023', 0, 1);
$pdf->Ln(5);
//tabla de gastos
$pdf->SetFillColor(41,128,185);
$pdf->SetTextColor(255);
$pdf->SetDrawColor(31,97,141);
$pdf->SetLineWidth(.3);
$pdf->SetFont('', 'B');

$header = array('Fecha', 'Concepto', 'Categoria', 'Cantidad (€)');
$w = array(35, 65, 50, 40);

for($i=0; $i<count($header); $i++){
    $pdf->Cell($w[$i], 7, $header[$i], 1, 0, 'C', true);
}
$pdf->Ln();

$pdf->SetFillColor(224,235,255);
$pdf->SetTextColor(0);
$pdf->SetFont('Arial', '', 12);
$fill = false;
$total_gastos = 0;

foreach($gastos_mock as $fila) {
    $pdf->Cell($w[0], 6, $fila['fecha'], 'LR', 0, 'C', $fill);
    $pdf->Cell($w[1], 6, utf8_decode($fila['concepto']), 'LR', 0, 'L', $fill);
    $pdf->Cell($w[2], 6, utf8_decode($fila['categoria']), 'LR', 0, 'C', $fill);
    $pdf->Cell($w[3], 6, number_format($fila['cantidad'], 2) . ' ' . chr(128), 'LR', 0, 'R', $fill);
    $pdf->Ln();
    $fill = !$fill;
    $total_gastado += $fila['cantidad'];
}

$pdf->Cell(array_sum($w), 0, '', 'T');
$pdf->Ln(5);
// total gastado
$pdf->SetFont('Arial', 'B', 12);
$pdf->Ceññ(150,10, 'TOTAL GASTADO:', 0, 0, 'R');
$pdf->SetTextColor(200,0,0);
$pdf->Cell(40,10, number_format($total_gastado, 2) . ' ' . chr(128), 0, 1, 'R');
// salida del PDF
$pdf->Output('I', 'Reporte_Mensual_BillFlow.pdf');
?>