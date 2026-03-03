<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1A2B3D;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            border: 1px solid #F0F0F0;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .header {
            background-color: #1F7A6E;
            color: #ffffff;
            padding: 40px;
            text-align: center;
        }

        .content {
            padding: 40px;
            background-color: #ffffff;
        }

        .footer {
            background-color: #F9FAFB;
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #9CA3AF;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .details-box {
            background-color: #F9FAFB;
            border: 1px solid #F0F0F0;
            border-radius: 16px;
            padding: 24px;
            margin: 24px 0;
        }

        .details-item {
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }

        .details-label {
            font-weight: 700;
            width: 120px;
            color: #6B7280;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .details-value {
            font-weight: 600;
            color: #1A2B3D;
            font-size: 15px;
        }

        .custom-message {
            padding: 20px;
            background: #F0F9F8;
            border-left: 4px solid #1F7A6E;
            margin: 24px 0;
            font-style: italic;
            color: #155A50;
            border-radius: 0 12px 12px 0;
        }

        h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 900;
            letter-spacing: -0.01em;
        }

        p {
            margin-bottom: 16px;
            font-size: 16px;
        }

        .highlight {
            color: #1F7A6E;
            font-weight: 700;
        }

        .signature {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #F0F0F0;
        }

        .company-name {
            font-weight: 900;
            color: #1A2B3D;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Interview Invitation</h1>
        </div>
        <div class="content">
            <p>Dear <strong>{{ $interview->applicant->name }}</strong>,</p>

            <p>We are pleased to inform you that we would like to schedule an interview for the <span
                    class="highlight">{{ $interview->applicant->jobPosting->title }}</span> position at <span
                    class="company-name">{{ $interview->tenant->name }}</span>.</p>

            <div class="details-box">
                <div class="details-item">
                    <span class="details-label">Date & Time</span>
                    <span class="details-value">{{ $interview->scheduled_at->format('l, F j, Y') }} at
                        {{ $interview->scheduled_at->format('g:i A') }}</span>
                </div>
                <div class="details-item">
                    <span class="details-label">Type</span>
                    <span class="details-value">{{ ucfirst($interview->type) }}</span>
                </div>
                @if($interview->location)
                    <div class="details-item">
                        <span class="details-label">Location</span>
                        <span class="details-value">{{ $interview->location }}</span>
                    </div>
                @endif
                <div class="details-item">
                    <span class="details-label">Interviewer</span>
                    <span class="details-value">{{ $interview->interviewer->name }}</span>
                </div>
            </div>

            @if($customMessage)
                <div class="custom-message">
                    <strong>Note from the Hiring Team:</strong><br>
                    {!! nl2br(e($customMessage)) !!}
                </div>
            @endif

            <p>Please make sure to be available at the scheduled time. If you need to reschedule or have any immediate
                questions, please reply to this email.</p>

            <p>We look forward to meeting you and learning more about your background! <strong>Good luck!</strong></p>

            <div class="signature">
                <p>Best regards,<br>
                    <span class="company-name">{{ $interview->tenant->name }} – Hiring Team</span>
                </p>
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} {{ $interview->tenant->name }} &bull; Powered by Droga TAS
        </div>
    </div>
</body>

</html>