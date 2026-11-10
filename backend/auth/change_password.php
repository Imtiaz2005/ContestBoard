<?php
// ফোল্ডার অনুযায়ী পাথ ঠিক করে নিবেন (যদি auth/ এর ভেতর হয় তাহলে ../config)
require_once "../config/cors.php";
require_once "../config/session.php";
require_once "../config/database.php";

header("Content-Type: application/json");

// Only POST requests allowed
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit;
}

// User must be logged in
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit;
}

$user_id = $_SESSION["user_id"];
$data = json_decode(file_get_contents("php://input"), true);

$currentPassword = $data["currentPassword"] ?? "";
$newPassword = $data["newPassword"] ?? "";

// Validation
if (empty($currentPassword) || empty($newPassword)) {
    echo json_encode(["success" => false, "message" => "Both current and new passwords are required."]);
    exit;
}

if (strlen($newPassword) < 8) {
    echo json_encode(["success" => false, "message" => "New password must be at least 8 characters."]);
    exit;
}

try {
    // 1. ডাটাবেজ থেকে ইউজারের বর্তমান পাসওয়ার্ড হ্যাশটি নিয়ে আসা
    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    // 2. বর্তমান পাসওয়ার্ডটি সঠিক কিনা তা চেক করা
    if (!$user || !password_verify($currentPassword, $user["password_hash"])) {
        echo json_encode(["success" => false, "message" => "Current password is incorrect."]);
        exit;
    }

    // 3. নতুন পাসওয়ার্ডটি এনক্রিপ্ট (Hash) করা
    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    // 4. ডাটাবেজে নতুন পাসওয়ার্ড আপডেট করা
    $updateStmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE user_id = ?");
    $updateStmt->execute([$newPasswordHash, $user_id]);

    echo json_encode(["success" => true, "message" => "Password updated successfully."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>