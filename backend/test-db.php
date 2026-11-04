<?php

header("Content-Type: application/json");

require_once "config/database.php";

try {
    $stmt = $pdo->query("SELECT 1");

    echo json_encode([
        "success" => true,
        "message" => "Database connected successfully!"
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database query failed."
    ]);
}