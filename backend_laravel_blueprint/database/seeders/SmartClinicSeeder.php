<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SmartClinicSeeder extends Seeder {
 public function run(): void {
  DB::table('users')->insert([
    ['name'=>'System Administrator','email'=>'admin@smartclinic.test','password'=>Hash::make('password'),'role'=>'admin'],
    ['name'=>'Dr. Adam Bennett','email'=>'doctor@smartclinic.test','password'=>Hash::make('password'),'role'=>'doctor']
  ]);
 }
}
