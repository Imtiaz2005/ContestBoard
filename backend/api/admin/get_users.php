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
    // account_status কলামটিকে status হিসেবে অ্যালিয়াস (alias) করে আনা হচ্ছে
    $stmt = $pdo->prepare("
        SELECT 
            user_id as id, 
            name, 
            email, 
            role, 
            account_status as status,
            DATE_FORMAT(created_at, '%b %d, %Y') as joined
        FROM users
        WHERE role != 'admin'
        ORDER BY created_at DESC
    ");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "users" => $users]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>