<?php

use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);

Route::middleware('mock.auth')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load('tenant', 'roles');
    });

    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index']);

    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);

    // Requisition API
    Route::prefix('v1')->group(function () {
        Route::get('/requisitions', [\App\Http\Controllers\JobRequisitionController::class, 'index']);
        Route::post('/requisitions', [\App\Http\Controllers\JobRequisitionController::class, 'store']);
        Route::post('/requisitions/bulk-approve', [\App\Http\Controllers\JobRequisitionController::class, 'bulkApprove']);
        Route::post('/requisitions/{id}/duplicate', [\App\Http\Controllers\JobRequisitionController::class, 'duplicate']);
        Route::patch('/requisitions/{id}/status', [\App\Http\Controllers\JobRequisitionController::class, 'updateStatus']);

        Route::get('/jobs', [\App\Http\Controllers\JobPostingController::class, 'index']);
        Route::post('/jobs', [\App\Http\Controllers\JobPostingController::class, 'store']);

        // Internal Job Management
        Route::apiResource('jobs', \App\Http\Controllers\JobController::class)->except(['index', 'show']);

        // Applicant Management
        Route::get('/applicants', [\App\Http\Controllers\ApplicantController::class, 'index']);
        Route::patch('/applicants/{id}/status', [\App\Http\Controllers\ApplicantController::class, 'updateStatus']);

        // Interview Management
        Route::get('/interviews', [\App\Http\Controllers\InterviewController::class, 'index']);
        Route::post('/interviews', [\App\Http\Controllers\InterviewController::class, 'store']);
        Route::patch('/interviews/{id}', [\App\Http\Controllers\InterviewController::class, 'update']);
        // Offer Management
        Route::post('/offers/generate', [\App\Http\Controllers\OfferController::class, 'generate']);
    });
});

// Public API
Route::prefix('v1')->group(function () {
    Route::get('/jobs', [JobController::class, 'index']);
    Route::get('/jobs/{id}', [JobController::class, 'show']);
    Route::post('/apply', [\App\Http\Controllers\JobApplicationController::class, 'store']);
});
