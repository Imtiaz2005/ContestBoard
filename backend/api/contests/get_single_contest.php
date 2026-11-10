<?php
require_once "../../config/cors.php";
require_once "../../config/database.php";

header("Content-Type: application/json");

$contest_id = $_GET["id"] ?? null;

if (!$contest_id) {
    echo json_encode(["success" => false, "message" => "Contest ID is required."]);
    exit;
}

try {
    // কনটেস্ট এবং অর্গানাইজারের বিস্তারিত ডাটা আনা
    $stmt = $pdo->prepare("
        SELECT 
            c.*, 
            COALESCE(op.organization_name, u.name) as organizer_name,
            u.email as organizer_email,
            op.organization_type
        FROM contests c
        LEFT JOIN users u ON c.organizer_id = u.user_id
        LEFT JOIN organizer_profiles op ON c.organizer_id = op.user_id
        WHERE c.contest_id = ? AND c.status = 'approved'
    ");
    $stmt->execute([$contest_id]);
    $contest = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($contest) {
        // একই ক্যাটাগরির অন্যান্য কনটেস্ট (Similar contests)
        $stmtSimilar = $pdo->prepare("
            SELECT contest_id, title, event_mode, contest_start 
            FROM contests 
            WHERE category = ? AND contest_id != ? AND status = 'approved' 
            ORDER BY created_at DESC LIMIT 3
        ");
        $stmtSimilar->execute([$contest['category'], $contest_id]);
        $similarContests = $stmtSimilar->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true, 
            "contest" => $contest,
            "similarContests" => $similarContests
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Contest not found."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>