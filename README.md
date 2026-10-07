# Your Dentist in Oujda

Production-oriented brochure + appointment-request website for **Cabinet Dentaire Dr. Mohammed Taha Zarrouki** in Oujda, Morocco.

## Local run

This repository is intentionally dependency-free for the initial delivery.

```bash
python3 -m http.server 4173
```

Then open http://127.0.0.1:4173/.

## Booking behavior

The appointment form collects a treatment, preferred doctor/date/time and contact details, then prepares a WhatsApp request for the clinic. It does **not** claim real-time availability or automatic medical/appointment confirmation because no scheduling API or booking credential has been provisioned.

## Evidence

Research provenance and implementation constraints are tracked under `/evidence/research/`. AEOS progression is tracked in `AEOS_STATUS.md`.
