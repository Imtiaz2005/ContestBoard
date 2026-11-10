<?php
require_once "../../config/cors.php";
require_once "../../config/session.php";
require_once "../../config/database.php";

header("Content-Type: application/json");

// User must be logged in
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit;
}

$organizer_id = $_SESSION["user_id"];

try {
    // শুধু লগইন করা অর্গানাইজারের কনটেস্টগুলো আনা হবে (নতুনগুলো আগে দেখাবে)
    $stmt = $pdo->prepare("
        SELECT contest_id, title, category, event_mode, contest_start, registration_deadline, status 
        FROM contests 
        WHERE organizer_id = ? 
        ORDER BY created_at DESC
    ");
    $stmt->execute([$organizer_id]);
    $contests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true, 
        "contests" => $contests
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>