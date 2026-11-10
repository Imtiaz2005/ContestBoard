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
    echo json_encode(["success" => false, "message" => "Please log in to register."]);
    exit;
}

$user_id = $_SESSION["user_id"];
$data = json_decode(file_get_contents("php://input"), true);
$contest_id = $data["contest_id"] ?? null;

if (!$contest_id) {
    echo json_encode(["success" => false, "message" => "Contest ID is required."]);
    exit;
}

try {
    // চেক করা যে ইউজার আগে থেকেই এই কনটেস্টে রেজিস্টার করেছে কিনা
    $checkStmt = $pdo->prepare("SELECT * FROM contest_registrations WHERE contest_id = ? AND user_id = ?");
    $checkStmt->execute([$contest_id, $user_id]);
    
    if ($checkStmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "You are already registered for this contest."]);
        exit;
    }

    // নতুন রেজিস্ট্রেশন ইনসার্ট করা
    $stmt = $pdo->prepare("INSERT INTO contest_registrations (contest_id, user_id, result_status) VALUES (?, ?, 'pending')");
    $stmt->execute([$contest_id, $user_id]);

    echo json_encode(["success" => true, "message" => "Successfully registered for the contest!"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>