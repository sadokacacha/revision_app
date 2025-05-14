<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::table('schedules', function (Blueprint $table) {
        // assuming subjects.id is unsignedBigInteger
        $table->unsignedBigInteger('subject_id')->after('classroom_id');
        $table->foreign('subject_id')->references('id')->on('subjects')
              ->onDelete('cascade');
    });
}

public function down()
{
    Schema::table('schedules', function (Blueprint $table) {
        $table->dropForeign(['subject_id']);
        $table->dropColumn('subject_id');
    });
}
};
