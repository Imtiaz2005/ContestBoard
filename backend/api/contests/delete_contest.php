<?php
require_once "../../config/cors.php";
require_once "../../config/session.php";
require_once "../../config/database.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit;
}

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit;
}

$organizer_id = $_SESSION["user_id"];
$data = json_decode(file_get_contents("php://input"), true);
$contest_id = $data["contest_id"] ?? null;

if (!$contest_id) {
    echo json_encode(["success" => false, "message" => "Contest ID is required."]);
    exit;
}

try {
    // ডিলিট করার আগে চেক করা যে এই কনটেস্টটি লগইন করা অর্গানাইজারেরই কিনা
    $stmt = $pdo->prepare("DELETE FROM contests WHERE contest_id = ? AND organizer_id = ?");
    $stmt->execute([$contest_id, $organizer_id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Contest deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Contest not found or you don't have permission."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>