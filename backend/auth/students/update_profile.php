<?php
// ২ স্টেপ পেছনে গিয়ে config ফোল্ডার কল করতে হবে
require_once "../../config/cors.php";
require_once "../../config/session.php";
require_once "../../config/database.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
    exit;
}

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated."]);
    exit;
}

$user_id = $_SESSION["user_id"];

$name = trim($_POST["name"] ?? "");
$email = strtolower(trim($_POST["email"] ?? ""));
$phone = trim($_POST["phone"] ?? null);
$university = trim($_POST["university"] ?? null);
$department = trim($_POST["department"] ?? null);
$skills = trim($_POST["skills"] ?? null);
$about = trim($_POST["bio"] ?? null);

if ($name === "") {
    echo json_encode(["success" => false, "message" => "Name is required."]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Update basic info in 'users' table
// 1. Update basic info in 'users' table
    $stmtUser = $pdo->prepare("UPDATE users SET name = ? WHERE user_id = ?");
    $stmtUser->execute([$name, $user_id]);

    $_SESSION["name"] = $name;
    // email লাইনটি ডিলিট করে দিন

    // 2. Image Upload Logic
    $photo_url = null; 

    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['photo']['tmp_name'];
        $fileName = $_FILES['photo']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        $allowedfileExtensions = ['jpg', 'gif', 'png', 'jpeg'];
        
        if (in_array($fileExtension, $allowedfileExtensions)) {
            $newFileName = "user_" . $user_id . "_" . time() . '.' . $fileExtension;
            
            // Upload directory ২ স্টেপ পেছনে 
            $uploadFileDir = '../../uploads/profiles/';
            
            // ফোল্ডার না থাকলে তৈরি করে নিবে
            if (!is_dir($uploadFileDir)) {
                mkdir($uploadFileDir, 0777, true);
            }

            $dest_path = $uploadFileDir . $newFileName;

            if (move_uploaded_file($fileTmpPath, $dest_path)) {
                $photo_url = "uploads/profiles/" . $newFileName;
            }
        }
    }

    // 3. Update or Insert into 'student_profile' table
    if ($photo_url) {
        $stmtProfile = $pdo->prepare("
            INSERT INTO student_profiles (user_id, phone, photo_url, university, department, skills, about)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            phone = VALUES(phone), 
            photo_url = VALUES(photo_url),
            university = VALUES(university), 
            department = VALUES(department), 
            skills = VALUES(skills), 
            about = VALUES(about)
        ");
        $stmtProfile->execute([$user_id, $phone, $photo_url, $university, $department, $skills, $about]);
    } else {
        $stmtProfile = $pdo->prepare("
            INSERT INTO student_profiles (user_id, phone, university, department, skills, about)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            phone = VALUES(phone), 
            university = VALUES(university), 
            department = VALUES(department), 
            skills = VALUES(skills), 
            about = VALUES(about)
        ");
        $stmtProfile->execute([$user_id, $phone, $university, $department, $skills, $about]);
    }

    $pdo->commit();

    echo json_encode([
        "success" => true, 
        "message" => "Profile updated successfully.",
        "photo_url" => $photo_url 
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>