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
    // ইউজারের কনটেস্ট অ্যাচিভমেন্টস (শুধুমাত্র যাদের রেজাল্ট pending নয়) ফেচ করা
    $stmt = $pdo->prepare("
        SELECT 
            c.title AS contest_name, 
            c.category,
            DATE_FORMAT(cr.result_submitted_at, '%b %Y') AS date_awarded,
            cr.result_status AS position,
            COALESCE(op.organization_name, u.name) AS organizer_name
        FROM contest_registrations cr
        JOIN contests c ON cr.contest_id = c.contest_id
        LEFT JOIN users u ON c.organizer_id = u.user_id
        LEFT JOIN organizer_profiles op ON c.organizer_id = op.user_id
        WHERE cr.user_id = ? AND cr.result_status != 'pending'
        ORDER BY cr.result_submitted_at DESC
    ");
    $stmt->execute([$user_id]);
    $achievements = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "achievements" => $achievements
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>