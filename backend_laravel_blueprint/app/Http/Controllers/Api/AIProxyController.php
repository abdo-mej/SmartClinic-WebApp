<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIProxyController extends Controller {
  public function chat(Request $request){
    return Http::post(env('AI_SERVICE_URL','http://127.0.0.1:5001').'/chat', $request->all())->json();
  }
  public function symptoms(Request $request){
    return Http::post(env('AI_SERVICE_URL','http://127.0.0.1:5001').'/symptoms', $request->all())->json();
  }
}
