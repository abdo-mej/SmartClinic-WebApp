<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClinicController extends Controller {
  public function statistics(){
    return response()->json([
      'patients'=>DB::table('patients')->count(),
      'appointments_today'=>DB::table('appointments')->whereDate('date', now())->count(),
      'invoices_paid'=>DB::table('invoices')->where('status','Paid')->sum('amount'),
      'low_stock'=>DB::table('pharmacy_items')->whereColumn('stock','<=','alert')->count()
    ]);
  }
  public function index($module){ return response()->json(DB::table($module)->latest('id')->get()); }
  public function store(Request $request,$module){ $id=DB::table($module)->insertGetId($request->except(['id'])); return response()->json(['id'=>$id],201); }
  public function update(Request $request,$module,$id){ DB::table($module)->where('id',$id)->update($request->except(['id'])); return response()->json(['updated'=>true]); }
  public function destroy($module,$id){ DB::table($module)->where('id',$id)->update(['status'=>'Archived']); return response()->json(['archived'=>true]); }
}
