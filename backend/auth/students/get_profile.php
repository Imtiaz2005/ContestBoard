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
$base_url = "http://localhost/ContestBoard/backend/"; // ছবির জন্য বেস URL

try {
    // users এবং student_profile টেবিল জয়েন করে ডাটা আনা
    $stmt = $pdo->prepare("
        SELECT u.name, u.email, u.role, 
               p.phone, p.photo_url, p.university, p.department, p.skills, p.about as bio
        FROM users u
        LEFT JOIN student_profiles p ON u.user_id = p.user_id
        WHERE u.user_id = ?
    ");
    $stmt->execute([$user_id]);
    $profile = $stmt->fetch();

    if ($profile) {
        // ফ্রন্টএন্ডের সুবিধার জন্য photo_url-এর আগে base_url বসিয়ে 'photo' প্রপার্টিতে দেওয়া
        if (!empty($profile['photo_url'])) {
            $profile['photo'] = $base_url . $profile['photo_url'];
        } else {
            $profile['photo'] = "";
        }
        
        echo json_encode(["success" => true, "profile" => $profile]);
    } else {
        echo json_encode(["success" => false, "message" => "Profile not found."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>