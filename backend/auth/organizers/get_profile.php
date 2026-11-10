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

$user_id = $_SESSION["user_id"];
$base_url = "http://localhost/ContestBoard/backend/";

try {
    $stmt = $pdo->prepare("
        SELECT u.name, u.email, u.role, 
               o.phone, o.photo_url, o.organization_name as organizationName, 
               o.organization_type as organizationType, 
               o.organization_website as website, 
               o.about_organization as aboutOrganization
        FROM users u
        LEFT JOIN organizer_profiles o ON u.user_id = o.user_id
        WHERE u.user_id = ?
    ");
    $stmt->execute([$user_id]);
    $profile = $stmt->fetch();

    if ($profile) {
        $profile['photo'] = !empty($profile['photo_url']) ? $base_url . $profile['photo_url'] : "";
        echo json_encode(["success" => true, "profile" => $profile]);
    } else {
        echo json_encode(["success" => false, "message" => "Profile not found."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>