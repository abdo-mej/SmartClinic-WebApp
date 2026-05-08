<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void {
  Schema::create('patients', function(Blueprint $t){$t->id();$t->string('fileNo')->unique();$t->string('firstName');$t->string('lastName');$t->string('gender')->nullable();$t->date('birthDate')->nullable();$t->string('phone')->nullable();$t->string('email')->nullable();$t->string('blood')->nullable();$t->text('address')->nullable();$t->string('cin')->nullable();$t->string('insurance')->nullable();$t->text('allergies')->nullable();$t->text('chronic')->nullable();$t->string('status')->default('Active');$t->timestamps();});
  Schema::create('doctors', function(Blueprint $t){$t->id();$t->string('name');$t->string('specialty');$t->string('phone')->nullable();$t->string('email')->nullable();$t->string('room')->nullable();$t->string('status')->default('Available');$t->timestamps();});
  Schema::create('appointments', function(Blueprint $t){$t->id();$t->foreignId('patient_id');$t->foreignId('doctor_id');$t->date('date');$t->time('time');$t->string('type');$t->text('reason')->nullable();$t->string('status')->default('Scheduled');$t->timestamps();});
  Schema::create('consultations', function(Blueprint $t){$t->id();$t->foreignId('patient_id');$t->foreignId('doctor_id');$t->date('date');$t->text('symptoms')->nullable();$t->text('diagnosis')->nullable();$t->text('notes')->nullable();$t->text('treatment')->nullable();$t->string('follow_up')->nullable();$t->timestamps();});
  Schema::create('prescriptions', function(Blueprint $t){$t->id();$t->foreignId('patient_id');$t->foreignId('doctor_id');$t->date('date');$t->text('medicines');$t->text('instructions')->nullable();$t->string('status')->default('Draft');$t->timestamps();});
  Schema::create('invoices', function(Blueprint $t){$t->id();$t->string('invoice')->unique();$t->foreignId('patient_id');$t->decimal('amount',10,2);$t->string('method');$t->string('status');$t->date('date');$t->text('items')->nullable();$t->timestamps();});
  Schema::create('pharmacy_items', function(Blueprint $t){$t->id();$t->string('medicine');$t->string('category')->nullable();$t->integer('stock')->default(0);$t->string('unit')->default('unit');$t->integer('alert')->default(10);$t->decimal('price',10,2)->default(0);$t->timestamps();});
 }
 public function down(): void { foreach(['pharmacy_items','invoices','prescriptions','consultations','appointments','doctors','patients'] as $table) Schema::dropIfExists($table); }
};
