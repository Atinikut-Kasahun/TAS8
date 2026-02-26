<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Models\ApplicantAttachment;
use App\Models\JobPosting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class JobApplicationController extends Controller
{
    /**
     * Submit a new job application.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'job_posting_id' => 'required|exists:job_postings,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'age' => 'nullable',
            'gender' => 'nullable|string',
            'professional_background' => 'nullable|string',
            'years_of_experience' => 'nullable',
            'resume' => 'required|file|mimes:pdf|max:10000',
            'attachments.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:10000',
        ]);

        $job = JobPosting::findOrFail($request->job_posting_id);

        // Upload main resume
        $resumePath = $request->file('resume')->store('resumes', 'public');

        // Create Applicant
        $applicant = Applicant::create([
            'tenant_id' => $job->tenant_id,
            'job_posting_id' => $job->id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'age' => is_numeric($request->age) ? (int) $request->age : null,
            'gender' => $request->gender,
            'professional_background' => $request->professional_background,
            'years_of_experience' => is_numeric($request->years_of_experience) ? (int) $request->years_of_experience : null,
            'resume_path' => $resumePath,
            'status' => 'new',
            'source' => 'website',
        ]);

        // Upload and create additional attachments
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('attachments', 'public');
                ApplicantAttachment::create([
                    'applicant_id' => $applicant->id,
                    'file_path' => $path,
                    'file_type' => $file->getClientOriginalExtension(),
                    'label' => $file->getClientOriginalName(),
                ]);
            }
        }

        // Mock Requirement #4: Trigger automated email
        \Log::info("Automated Email Sent: Thank you for applying to {$job->title} at {$job->tenant->name}. Recipient: {$applicant->email}");

        return response()->json([
            'message' => 'Application submitted successfully',
            'applicant' => $applicant->load('attachments'),
        ], 201);
    }
}
