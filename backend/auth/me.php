
<?php
require_once "../config/cors.php";
header("Content-Type: application/json");

// session_start();
require_once "../config/session.php";

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Not authenticated."
    ]);

    exit;
}

echo json_encode([
    "success" => true,
    "user" => [
        "user_id" => $_SESSION["user_id"],
        "name" => $_SESSION["name"],
        "email" => $_SESSION["email"],
        "role" => $_SESSION["role"]
    ]
]);
