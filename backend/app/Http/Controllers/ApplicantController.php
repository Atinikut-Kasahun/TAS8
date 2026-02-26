<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ApplicantController extends Controller
{
    /**
     * Display a listing of applicants for the tenant.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Applicant::with(['jobPosting', 'attachments']);

        if (!$user->hasRole('admin')) {
            $query->where('tenant_id', $user->tenant_id);
        }

        if ($request->has('job_posting_id')) {
            $query->where('job_posting_id', $request->job_posting_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * Store a new applicant for a job posting.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'job_posting_id' => 'required|exists:job_postings,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'resume_path' => 'nullable|string',
            'source' => 'nullable|string',
        ]);

        $jobPosting = JobPosting::findOrFail($request->job_posting_id);

        $applicant = Applicant::create([
            'tenant_id' => $jobPosting->tenant_id,
            'job_posting_id' => $request->job_posting_id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'resume_path' => $request->resume_path,
            'source' => $request->source ?? 'website',
            'status' => 'new',
        ]);

        return response()->json($applicant, 201);
    }

    /**
     * Update applicant status and add feedback.
     */
    public function updateStatus(string $id, Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:applied,phone_screen,interview,offer,hired,rejected',
            'feedback' => 'nullable|string',
        ]);

        $applicant = Applicant::where('id', $id)
            ->where('tenant_id', $request->user()->tenant_id)
            ->firstOrFail();

        $feedback = $applicant->feedback ?? [];
        if ($request->feedback) {
            $feedback[] = [
                'user' => $request->user()->name,
                'note' => $request->feedback,
                'date' => now()->toDateTimeString(),
            ];
        }

        $applicant->update([
            'status' => $request->status,
            'feedback' => $feedback,
        ]);

        return response()->json($applicant);
    }
}
