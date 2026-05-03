<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/api/health') {
  echo json_encode(['status'=>'ok','message'=>'SmartClinic API running','mode'=>'stable local API']);
  exit;
}
if ($path === '/api/login' && $_SERVER['REQUEST_METHOD']==='POST') {
  $input=json_decode(file_get_contents('php://input'), true) ?: [];
  $email=$input['email']??''; $password=$input['password']??'';
  $users=[
    'admin@smartclinic.test'=>['name'=>'System Administrator','role'=>'admin'],
    'doctor@smartclinic.test'=>['name'=>'Dr. Adam Bennett','role'=>'doctor'],
    'nurse@smartclinic.test'=>['name'=>'Nurse Emma Clark','role'=>'nurse'],
    'secretary@smartclinic.test'=>['name'=>'Sophia Reception','role'=>'secretary'],
    'patient@smartclinic.test'=>['name'=>'John Carter','role'=>'patient']
  ];
  if(isset($users[$email]) && $password==='password') {
    echo json_encode(['success'=>true,'token'=>'smartclinic-token','user'=>array_merge(['email'=>$email],$users[$email])]);
  } else { http_response_code(401); echo json_encode(['success'=>false,'message'=>'Invalid credentials']); }
  exit;
}
echo json_encode(['status'=>'ok','message'=>'SmartClinic local backend. Frontend stores demo data in browser localStorage.']);
