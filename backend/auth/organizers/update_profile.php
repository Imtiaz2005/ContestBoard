<?php
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
$phone = trim($_POST["phone"] ?? null);
$organization_name = trim($_POST["organizationName"] ?? null);
$organization_type = trim($_POST["organizationType"] ?? "University");
$organization_website = trim($_POST["website"] ?? null);
$about_organization = trim($_POST["aboutOrganization"] ?? null);

if ($name === "") {
    echo json_encode(["success" => false, "message" => "Full Name is required."]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Update Name in 'users' table
    $stmtUser = $pdo->prepare("UPDATE users SET name = ? WHERE user_id = ?");
    $stmtUser->execute([$name, $user_id]);
    $_SESSION["name"] = $name;

    // 2. Image Upload Logic
    $photo_url = null;

    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['photo']['tmp_name'];
        $fileName = $_FILES['photo']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        $allowedfileExtensions = ['jpg', 'gif', 'png', 'jpeg'];
        
        if (in_array($fileExtension, $allowedfileExtensions)) {
            $newFileName = "org_" . $user_id . "_" . time() . '.' . $fileExtension;
            $uploadFileDir = '../../uploads/profiles/';
            
            if (!is_dir($uploadFileDir)) {
                mkdir($uploadFileDir, 0777, true);
            }

            $dest_path = $uploadFileDir . $newFileName;

            if (move_uploaded_file($fileTmpPath, $dest_path)) {
                $photo_url = "uploads/profiles/" . $newFileName;
            }
        }
    }

    // 3. Update or Insert into 'organizer_profiles' table
    if ($photo_url) {
        $stmtProfile = $pdo->prepare("
            INSERT INTO organizer_profiles (user_id, phone, photo_url, organization_name, organization_type, organization_website, about_organization)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            phone = VALUES(phone), 
            photo_url = VALUES(photo_url),
            organization_name = VALUES(organization_name), 
            organization_type = VALUES(organization_type), 
            organization_website = VALUES(organization_website), 
            about_organization = VALUES(about_organization)
        ");
        $stmtProfile->execute([$user_id, $phone, $photo_url, $organization_name, $organization_type, $organization_website, $about_organization]);
    } else {
        $stmtProfile = $pdo->prepare("
            INSERT INTO organizer_profiles (user_id, phone, organization_name, organization_type, organization_website, about_organization)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            phone = VALUES(phone), 
            organization_name = VALUES(organization_name), 
            organization_type = VALUES(organization_type), 
            organization_website = VALUES(organization_website), 
            about_organization = VALUES(about_organization)
        ");
        $stmtProfile->execute([$user_id, $phone, $organization_name, $organization_type, $organization_website, $about_organization]);
    }

    $pdo->commit();

    echo json_encode([
        "success" => true, 
        "message" => "Organizer profile updated successfully.",
        "photo_url" => $photo_url 
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>