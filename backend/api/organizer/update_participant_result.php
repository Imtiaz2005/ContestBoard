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
$registration_id = $data["registration_id"] ?? null;
$position = $data["position"] ?? null; // 'pending', 'participated', '1st', '2nd', '3rd'

if (!$contest_id || !$registration_id || !$position) {
    echo json_encode(["success" => false, "message" => "Required data is missing."]);
    exit;
}

try {
    // সিকিউরিটি চেক: কনটেস্টটা আসলেই এই অর্গানাইজারের কিনা
    $stmtCheck = $pdo->prepare("SELECT contest_id FROM contests WHERE contest_id = ? AND organizer_id = ?");
    $stmtCheck->execute([$contest_id, $organizer_id]);
    if ($stmtCheck->rowCount() === 0) {
        echo json_encode(["success" => false, "message" => "Permission denied."]);
        exit;
    }

    // রেজাল্ট স্ট্যাটাস আপডেট করা (সাথে result_submitted_at টাইমস্ট্যাম্প আপডেট হবে)
    $stmtUpdate = $pdo->prepare("
        UPDATE contest_registrations 
        SET result_status = ?, result_submitted_at = CURRENT_TIMESTAMP
        WHERE registration_id = ? AND contest_id = ?
    ");
    $stmtUpdate->execute([$position, $registration_id, $contest_id]);

    echo json_encode(["success" => true, "message" => "Result updated successfully."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>