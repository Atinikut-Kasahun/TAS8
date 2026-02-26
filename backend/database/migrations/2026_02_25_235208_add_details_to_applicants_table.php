<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('applicants', function (Blueprint $table) {
            $table->integer('age')->nullable()->after('email');
            $table->string('gender')->nullable()->after('age');
            $table->text('professional_background')->nullable()->after('gender');
            $table->integer('years_of_experience')->nullable()->after('professional_background');
        });
    }

    public function down(): void
    {
        Schema::table('applicants', function (Blueprint $table) {
            $table->dropColumn(['age', 'gender', 'professional_background', 'years_of_experience']);
        });
    }
};
