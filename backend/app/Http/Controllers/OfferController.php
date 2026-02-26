<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OfferController extends Controller
{
    /**
     * Generate a draft offer letter (simulated).
     */
    public function generate(Request $request): JsonResponse
    {
        $request->validate([
            'applicant_id' => 'required|exists:applicants,id',
            'salary' => 'required|numeric',
            'start_date' => 'required|date',
        ]);

        $applicant = Applicant::where('id', $request->applicant_id)
            ->where('tenant_id', $request->user()->tenant_id)
            ->with('jobPosting')
            ->firstOrFail();

        $offerLetter = [
            'applicant_name' => $applicant->name,
            'job_title' => $applicant->jobPosting->title,
            'company' => $request->user()->tenant->name,
            'salary' => $request->salary,
            'start_date' => $request->start_date,
            'content' => "Dear {$applicant->name},\n\nWe are pleased to offer you the position of {$applicant->jobPosting->title} at {$request->user()->tenant->name}..."
        ];

        return response()->json([
            'message' => 'Offer letter generated successfully (Draft)',
            'offer' => $offerLetter
        ]);
    }
}
