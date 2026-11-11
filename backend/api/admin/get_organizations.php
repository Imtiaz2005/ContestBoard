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
    // users ও organizer_profiles টেবিল জয়েন করে অর্গানাইজারদের ডাটা আনা
    $stmt = $pdo->prepare("
        SELECT 
            u.user_id as id, 
            COALESCE(op.organization_name, u.name) as name, 
            u.email, 
            COALESCE(op.organization_type, 'Organization') as type,
            COALESCE(op.organization_website, '#') as website,
            CASE 
                WHEN u.account_status = 'suspended' THEN 'blocked' 
                ELSE 'active' 
            END as status
        FROM users u
        LEFT JOIN organizer_profiles op ON u.user_id = op.user_id
        WHERE u.role = 'organizer'
        ORDER BY u.created_at DESC
    ");
    $stmt->execute();
    $organizations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "organizations" => $organizations]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>