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

$organizer_id = $_SESSION["user_id"];
$contest_id = $_GET["id"] ?? null;

if (!$contest_id) {
    echo json_encode(["success" => false, "message" => "Contest ID is required."]);
    exit;
}

try {
    // শুধু নির্দিষ্ট কনটেস্ট এবং নির্দিষ্ট অর্গানাইজারের ডাটা আনা হবে
    $stmt = $pdo->prepare("SELECT * FROM contests WHERE contest_id = ? AND organizer_id = ?");
    $stmt->execute([$contest_id, $organizer_id]);
    $contest = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($contest) {
        echo json_encode(["success" => true, "contest" => $contest]);
    } else {
        echo json_encode(["success" => false, "message" => "Contest not found or access denied."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>