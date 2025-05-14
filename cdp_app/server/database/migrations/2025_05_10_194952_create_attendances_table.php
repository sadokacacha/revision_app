<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('attendances', function (Blueprint $table) {
    $table->id();
    $table->foreignId('teacher_id')->constrained('teachers');
    $table->foreignId('schedule_id')->constrained()->onDelete('cascade');
    $table->boolean('present')->default(false);
    $table->integer('hours')->nullable(); // actual hours taught
    $table->date('date');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
