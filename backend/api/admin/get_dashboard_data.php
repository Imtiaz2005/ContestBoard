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

try {
    // ১. স্ট্যাটিস্টিকস ফেচ করা
    $stmtStats = $pdo->prepare("
        SELECT 
            (SELECT COUNT(*) FROM users WHERE role != 'admin') as total_users,
            (SELECT COUNT(*) FROM contests) as total_contests,
            (SELECT COUNT(*) FROM contests WHERE status = 'pending') as pending_contests,
            (SELECT COUNT(*) FROM users WHERE role = 'organizer' AND account_status = 'active') as active_organizers
    ");
    $stmtStats->execute();
    $stats = $stmtStats->fetch(PDO::FETCH_ASSOC);

    // ২. পেন্ডিং কনটেস্টের তালিকা ফেচ করা
    $stmtPending = $pdo->prepare("
        SELECT 
            c.title, 
            COALESCE(op.organization_name, u.name) as organizer, 
            c.category, 
            DATE_FORMAT(c.created_at, '%b %d, %Y') as date
        FROM contests c
        LEFT JOIN users u ON c.organizer_id = u.user_id
        LEFT JOIN organizer_profiles op ON c.organizer_id = op.user_id
        WHERE c.status = 'pending'
        ORDER BY c.created_at DESC
        LIMIT 10
    ");
    $stmtPending->execute();
    $pendingContests = $stmtPending->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true, 
        "stats" => $stats, 
        "pendingContests" => $pendingContests
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>