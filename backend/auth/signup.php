
<?php
require_once "../config/cors.php";
header("Content-Type: application/json");

require_once "../config/database.php";

// Only POST requests allowed
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method not allowed."
    ]);
    exit;
}

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$email = strtolower(trim($data["email"] ?? ""));
$password = $data["password"] ?? "";
$role = $data["role"] ?? "student";

// Validate input
if ($name === "" || $email === "" || $password === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "All fields are required."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid email address."
    ]);
    exit;
}

// Admin signup is not allowed
if (!in_array($role, ["student", "organizer"], true)) {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Invalid account role."
    ]);
    exit;
}

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Password must be at least 8 characters."
    ]);
    exit;
}

try {
    // Check existing email
    $check = $pdo->prepare(
        "SELECT user_id FROM users WHERE email = ?"
    );
    $check->execute([$email]);

    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Email already exists."
        ]);
        exit;
    }

    // Hash password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Create account
    $stmt = $pdo->prepare(
        "INSERT INTO users (name, email, password_hash, role)
         VALUES (?, ?, ?, ?)"
    );

    $stmt->execute([
        $name,
        $email,
        $passwordHash,
        $role
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Account created successfully.",
        "user_id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Something went wrong."
    ]);
}
