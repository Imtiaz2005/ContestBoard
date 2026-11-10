<?php
require_once "../../config/cors.php";
require_once "../../config/session.php";
require_once "../../config/database.php";

header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;
$status = $data["status"] ?? null;

if (!$id || !in_array($status, ['approved', 'pending', 'rejected'])) {
    echo json_encode(["success" => false, "message" => "Invalid data."]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE contests SET status = ? WHERE contest_id = ?");
    $stmt->execute([$status, $id]);
    echo json_encode(["success" => true, "message" => "Status updated successfully."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>