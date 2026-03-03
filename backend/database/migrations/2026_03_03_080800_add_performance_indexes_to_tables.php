<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_postings', function (Blueprint $table) {
            $table->index(['tenant_id', 'status']);
            $table->index('created_at');
        });

        Schema::table('applicants', function (Blueprint $table) {
            $table->index(['tenant_id', 'status']);
            $table->index('created_at');
        });

        Schema::table('job_requisitions', function (Blueprint $table) {
            $table->index(['tenant_id', 'status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_postings', function (Blueprint $table) {
            $table->dropIndex(['tenant_id', 'status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('applicants', function (Blueprint $table) {
            $table->dropIndex(['tenant_id', 'status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('job_requisitions', function (Blueprint $table) {
            $table->dropIndex(['tenant_id', 'status']);
            $table->dropIndex(['created_at']);
        });
    }
};
