<?php
require_once "../../config/cors.php";
require_once "../../config/database.php";

header("Content-Type: application/json");

try {
    // c.banner_url যুক্ত করা হয়েছে
    $stmt = $pdo->prepare("
        SELECT 
            c.contest_id, c.title, c.category, c.event_mode, c.venue, 
            c.registration_deadline, c.registration_fee, c.banner_url,
            COALESCE(op.organization_name, u.name) AS organizer
        FROM contests c
        LEFT JOIN users u ON c.organizer_id = u.user_id
        LEFT JOIN organizer_profiles op ON c.organizer_id = op.user_id
        WHERE c.status = 'approved'
        ORDER BY c.created_at DESC
    ");
    $stmt->execute();
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