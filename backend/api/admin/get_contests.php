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
    // সব কনটেস্ট এবং অর্গানাইজারের নাম আনা হচ্ছে
    $stmt = $pdo->prepare("
        SELECT 
            c.contest_id as id, 
            c.title, 
            c.category, 
            c.status, 
            DATE_FORMAT(c.created_at, '%b %d, %Y') as date,
            COALESCE(op.organization_name, u.name) as organizer
        FROM contests c
        LEFT JOIN users u ON c.organizer_id = u.user_id
        LEFT JOIN organizer_profiles op ON c.organizer_id = op.user_id
        ORDER BY c.created_at DESC
    ");
    $stmt->execute();
    $contests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "contests" => $contests]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>