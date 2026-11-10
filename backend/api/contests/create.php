<?php
// ফোল্ডার পাথ অনুযায়ী config ফাইলগুলো ঠিক করে নিবেন (৩ ফোল্ডার পেছনে হলে ../../../config)
require_once "../../config/cors.php";
require_once "../../config/session.php";
require_once "../../config/database.php";

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

$organizer_id = $_SESSION["user_id"];
$data = json_decode(file_get_contents("php://input"), true);

// Basic required fields check (Frontend already validates, but backend validation is secure)
if (empty($data['title']) || empty($data['category']) || empty($data['description'])) {
    echo json_encode(["success" => false, "message" => "Title, Category, and Description are required."]);
    exit;
}

try {
    // prepare SQL query
    $stmt = $pdo->prepare("
        INSERT INTO contests (
            organizer_id, title, category, banner_url, event_mode, venue, 
            description, eligibility, team_min, team_max, rules, 
            registration_start, registration_deadline, contest_start, contest_end, results_date, 
            registration_url, registration_fee, participant_limit, 
            prize_first, prize_second, prize_third, 
            contact_email, contact_phone, faq, status
        ) VALUES (
            ?, ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, 
            ?, ?, ?, ?, ?, 
            ?, ?, ?, 
            ?, ?, ?, 
            ?, ?, ?, 'pending'
        )
    ");

    // Execute query with array of values
    $stmt->execute([
        $organizer_id,
        $data['title'],
        $data['category'],
        !empty($data['banner_url']) ? $data['banner_url'] : null,
        $data['event_mode'],
        !empty($data['venue']) ? $data['venue'] : null,
        $data['description'],
        $data['eligibility'],
        $data['team_min'],
        $data['team_max'],
        $data['rules'],
        $data['registration_start'],
        $data['registration_deadline'],
        $data['contest_start'],
        $data['contest_end'],
        !empty($data['results_date']) ? $data['results_date'] : null,
        $data['registration_url'],
        !empty($data['registration_fee']) ? $data['registration_fee'] : 0.00,
        !empty($data['participant_limit']) ? $data['participant_limit'] : null,
        !empty($data['prize_first']) ? $data['prize_first'] : null,
        !empty($data['prize_second']) ? $data['prize_second'] : null,
        !empty($data['prize_third']) ? $data['prize_third'] : null,
        !empty($data['contact_email']) ? $data['contact_email'] : null,
        !empty($data['contact_phone']) ? $data['contact_phone'] : null,
        !empty($data['faq']) ? $data['faq'] : null
    ]);

    echo json_encode([
        "success" => true, 
        "message" => "Contest created successfully and is pending admin approval."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>