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
$status = $data["status"] ?? null; // 'active' or 'blocked'

if (!$id || !in_array($status, ['active', 'blocked'])) {
    echo json_encode(["success" => false, "message" => "Invalid parameters."]);
    exit;
}

// UI এর 'blocked' স্ট্যাটাসকে ডাটাবেজের 'suspended' এ রূপান্তর
$db_status = ($status === 'blocked') ? 'suspended' : 'active';

try {
    $stmt = $pdo->prepare("UPDATE users SET account_status = ? WHERE user_id = ? AND role = 'organizer'");
    $stmt->execute([$db_status, $id]);

    echo json_encode(["success" => true, "message" => "Organization status updated successfully."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>