<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';
$data = $input['data'] ?? [];

// FreePBX Configuration
$client_id = 'e76bdc5ea8c9b588ec0ce3a796bfb52e83a3a4925a6fb4f2935815ac05575c91';
$client_secret = '9afa837ebb1523b6a15437181f04aebb';
$token_url = 'https://voice.tolpar.com.bd/admin/api/api/token';
$gql_url = 'https://voice.tolpar.com.bd/admin/api/api/gql';

function getToken($client_id, $client_secret, $token_url) {
    $auth_data = [
        "client_id" => $client_id,
        "client_secret" => $client_secret,
        "grant_type" => "client_credentials",
        "scope" => "gql",
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $auth_data);
    curl_setopt($ch, CURLOPT_URL, $token_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $result = curl_exec($ch);
    if (!$result) {
        curl_close($ch);
        return false;
    }
    curl_close($ch);
    
    $obj = json_decode($result);
    return $obj->access_token ?? false;
}

function executeQuery($query, $token, $gql_url) {
    $data = json_encode(["query" => $query]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $gql_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . $token,
        "Content-Type: application/json",
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $result = curl_exec($ch);
    curl_close($ch);
    
    return $result;
}

$token = getToken($client_id, $client_secret, $token_url);
if (!$token) {
    echo json_encode(['success' => false, 'error' => 'Failed to get token']);
    exit;
}

switch ($action) {
    case 'create_extension':
        $extensionId = $data['extensionId'];
        $name = $data['name'];
        $tech = $data['tech'];
        $callerID = $data['callerID'];
        $secret = $data['secret'];
        
        $addQuery = "mutation {
            addExtension(input: {
                extensionId: $extensionId, 
                name: \"$name\",
                tech: \"$tech\",
                email: \"\",
                channelName: \"\", 
                outboundCid: \"$callerID\",
                callerID: \"$callerID\",
                maxContacts: \"2\",
            }) {
                status
                message
            }
        }";
        
        $updateQuery = "mutation {
            updateExtension(input: {
                extensionId: $extensionId, 
                name: \"$name\",
                tech: \"$tech\",
                email: \"\",
                channelName: \"\", 
                outboundCid: \"$callerID\",
                callerID: \"$callerID\",
                extPassword: \"$secret\",
            }) {
                status
                message
            }
        }";
        
        $applyQuery = "mutation { 
            doreload(input: {}) { 
                message 
                status 
                transaction_id 
            } 
        }";
        
        executeQuery($addQuery, $token, $gql_url);
        executeQuery($updateQuery, $token, $gql_url);
        executeQuery($applyQuery, $token, $gql_url);
        
        echo json_encode(['success' => true]);
        break;
        
    case 'delete_extension':
        $extensionId = $data['extensionId'];
        
        $deleteQuery = "mutation {
            deleteExtension(input: {
                extensionId: $extensionId
            }) {
                status
                message
            }
        }";
        
        $applyQuery = "mutation { 
            doreload(input: {}) { 
                message 
                status 
                transaction_id 
            } 
        }";
        
        executeQuery($deleteQuery, $token, $gql_url);
        executeQuery($applyQuery, $token, $gql_url);
        
        echo json_encode(['success' => true]);
        break;
        
    default:
        echo json_encode(['success' => false, 'error' => 'Unknown action']);
}
?>