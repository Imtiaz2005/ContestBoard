<?php
require_once "../../config/cors.php";
require_once "../../config/session.php";
require_once "../../config/database.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") { // চাইলে এখানে PUT দিতে পারেন, তবে POST নিরাপদ
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit;
}

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit;
}

$organizer_id = $_SESSION["user_id"];
$data = json_decode(file_get_contents("php://input"), true);
$contest_id = $data["contest_id"] ?? null;

if (empty($contest_id) || empty($data['title']) || empty($data['category'])) {
    echo json_encode(["success" => false, "message" => "Required fields are missing."]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE contests SET 
            title = ?, category = ?, banner_url = ?, event_mode = ?, venue = ?, 
            description = ?, eligibility = ?, team_min = ?, team_max = ?, rules = ?, 
            registration_start = ?, registration_deadline = ?, contest_start = ?, contest_end = ?, results_date = ?, 
            registration_url = ?, registration_fee = ?, participant_limit = ?, 
            prize_first = ?, prize_second = ?, prize_third = ?, 
            contact_email = ?, contact_phone = ?, faq = ?
        WHERE contest_id = ? AND organizer_id = ?
    ");

    $stmt->execute([
        $data['title'], $data['category'], $data['banner_url'] ?? null, $data['event_mode'], $data['venue'] ?? null, 
        $data['description'], $data['eligibility'], $data['team_min'], $data['team_max'], $data['rules'], 
        $data['registration_start'], $data['registration_deadline'], $data['contest_start'], $data['contest_end'], $data['results_date'] ?? null, 
        $data['registration_url'], $data['registration_fee'] ?? 0.00, $data['participant_limit'] ?? null, 
        $data['prize_first'] ?? null, $data['prize_second'] ?? null, $data['prize_third'] ?? null, 
        $data['contact_email'] ?? null, $data['contact_phone'] ?? null, $data['faq'] ?? null,
        $contest_id, $organizer_id // এই ২টা কন্ডিশন চেক করবে
    ]);

    echo json_encode(["success" => true, "message" => "Contest updated successfully."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>