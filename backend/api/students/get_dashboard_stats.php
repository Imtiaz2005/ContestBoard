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

$user_id = $_SESSION["user_id"];

try {
    // ইউজারের কনটেস্ট স্ট্যাটিসটিক্স (Participated, Won, Runner-up, Upcoming/Pending)
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(CASE WHEN result_status != 'pending' THEN 1 END) as participated,
            COUNT(CASE WHEN result_status = '1st' THEN 1 END) as won,
            COUNT(CASE WHEN result_status IN ('2nd', '3rd') THEN 1 END) as runner_up,
            COUNT(CASE WHEN result_status = 'pending' THEN 1 END) as upcoming
        FROM contest_registrations 
        WHERE user_id = ?
    ");
    $stmt->execute([$user_id]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    // রিসেন্ট পার্টিসিপেশন হিস্ট্রি আনার জন্য
    $stmtHistory = $pdo->prepare("
        SELECT 
            c.contest_id, c.title, c.category, c.event_mode,
            DATE_FORMAT(c.contest_start, '%b %d, %Y') as date,
            cr.result_status
        FROM contest_registrations cr
        JOIN contests c ON cr.contest_id = c.contest_id
        WHERE cr.user_id = ?
        ORDER BY cr.registered_at DESC LIMIT 5
    ");
    $stmtHistory->execute([$user_id]);
    $history = $stmtHistory->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "stats" => [
            "participated" => (int)$stats['participated'],
            "won" => (int)$stats['won'],
            "runner_up" => (int)$stats['runner_up'],
            "upcoming" => (int)$stats['upcoming']
        ],
        "history" => $history
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>