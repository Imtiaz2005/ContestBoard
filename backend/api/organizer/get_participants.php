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

$organizer_id = $_SESSION["user_id"];
$contest_id = $_GET["contest_id"] ?? null;

if (!$contest_id) {
    echo json_encode(["success" => false, "message" => "Contest ID is required."]);
    exit;
}

try {
    // আগে চেক করি কনটেস্টটা এই অর্গানাইজারের কিনা এবং কনটেস্টের টাইটেলটা নিয়ে আসি
    $stmtContest = $pdo->prepare("SELECT title FROM contests WHERE contest_id = ? AND organizer_id = ?");
    $stmtContest->execute([$contest_id, $organizer_id]);
    $contest = $stmtContest->fetch(PDO::FETCH_ASSOC);

    if (!$contest) {
        echo json_encode(["success" => false, "message" => "Contest not found or access denied."]);
        exit;
    }

    // এবার এই কনটেস্টে যারা রেজিস্টার করেছে তাদের নাম, ইমেইল এবং রেজাল্ট স্ট্যাটাস নিয়ে আসি
    $stmtParticipants = $pdo->prepare("
        SELECT 
            cr.registration_id, 
            u.name, 
            u.email, 
            cr.result_status as position 
        FROM contest_registrations cr
        JOIN users u ON cr.user_id = u.user_id
        WHERE cr.contest_id = ?
        ORDER BY cr.registered_at ASC
    ");
    $stmtParticipants->execute([$contest_id]);
    $participants = $stmtParticipants->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true, 
        "contest" => ["id" => $contest_id, "title" => $contest['title']],
        "participants" => $participants
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>