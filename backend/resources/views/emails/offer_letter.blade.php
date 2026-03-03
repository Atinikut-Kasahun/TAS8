<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Offer Letter</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1A2B3D;
            margin: 0;
            padding: 0;
            background-color: #F9FAFB;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border: 1px solid #F0F0F0;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .header {
            background: linear-gradient(135deg, #1A2B3D 0%, #1F7A6E 100%);
            color: #ffffff;
            padding: 48px;
            text-align: center;
        }

        .badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 6px 16px;
            border-radius: 100px;
            margin-bottom: 16px;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 900;
            line-height: 1.2;
            letter-spacing: -0.02em;
        }

        .content {
            padding: 48px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 16px;
        }

        .intro {
            color: #4B5563;
            font-size: 16px;
            margin-bottom: 32px;
        }

        .offer-card {
            background: #F0FDF9;
            border: 1px solid #D1FAE5;
            border-radius: 20px;
            padding: 32px;
            margin-bottom: 32px;
        }

        .offer-title {
            font-size: 12px;
            font-weight: 800;
            color: #047857;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 24px;
            display: block;
        }

        .offer-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(4, 120, 87, 0.1);
        }

        .offer-row:last-child {
            border-bottom: none;
        }

        .offer-label {
            font-size: 14px;
            color: #6B7280;
            font-weight: 600;
        }

        .offer-value {
            font-size: 15px;
            color: #111827;
            font-weight: 700;
            text-align: right;
        }

        .salary-highlight {
            font-size: 20px;
            color: #1F7A6E;
            font-weight: 900;
        }

        .notes-section {
            background: #F9FAFB;
            border-left: 4px solid #1F7A6E;
            padding: 24px;
            margin-bottom: 32px;
            border-radius: 0 16px 16px 0;
        }

        .notes-section p {
            margin: 0;
            font-style: italic;
            color: #4B5563;
            font-size: 14px;
        }

        .cta {
            text-align: center;
            margin: 40px 0;
        }

        .cta p {
            font-size: 15px;
            color: #6B7280;
            margin-bottom: 24px;
        }

        .signature {
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid #F0F0F0;
        }

        .company-name {
            font-weight: 900;
            color: #1A2B3D;
        }

        .footer {
            background: #111827;
            padding: 40px;
            text-align: center;
        }

        .footer p {
            color: #9CA3AF;
            font-size: 12px;
            margin: 4px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="badge">Official Offer Letter</div>
            <h1>Congratulations, {{ explode(' ', $applicant->name)[0] }}!</h1>
        </div>

        <div class="content">
            <p class="greeting">Dear {{ $applicant->name }},</p>
            <p class="intro">
                We are thrilled to formally offer you the position of <strong
                    class="company-name">{{ $jobPosting->title }}</strong> at <strong
                    class="company-name">{{ $applicant->tenant->name ?? 'our company' }}</strong>. Your skills and
                passion truly stood out during our interview process, and we are excited to have you join our team.
            </p>

            <div class="offer-card">
                <span class="offer-title">Offer Summary</span>
                <div class="offer-row">
                    <span class="offer-label">Position</span>
                    <span class="offer-value">{{ $jobPosting->title }}</span>
                </div>
                <div class="offer-row">
                    <span class="offer-label">Department</span>
                    <span class="offer-value">{{ $jobPosting->department ?? 'To be confirmed' }}</span>
                </div>
                <div class="offer-row">
                    <span class="offer-label">Start Date</span>
                    <span class="offer-value">{{ $startDate }}</span>
                </div>
                <div class="offer-row">
                    <span class="offer-label">Offered Salary</span>
                    <span class="offer-value salary-highlight">{{ $offeredSalary }}</span>
                </div>
            </div>

            @if($notes)
                <div class="notes-section">
                    <span class="offer-title" style="color: #1F7A6E; margin-bottom: 8px;">Additional Notes</span>
                    <p>{{ $notes }}</p>
                </div>
            @endif

            <p style="color: #4B5563; font-size: 15px;">
                To accept this offer, please reply to this email with your confirmation or contact us within 5 business
                days. We look forward to working with you!
            </p>

            <div class="signature">
                <p>Warm regards,<br>
                    <span class="company-name">{{ $applicant->tenant->name ?? 'The' }} Hiring Team</span>
                </p>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ $applicant->tenant->name ?? 'Company' }} &bull; Powered by Droga TAS</p>
            <p>This is an automated professional communication.</p>
        </div>
    </div>
</body>

</html>