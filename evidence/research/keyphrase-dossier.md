# Keyphrase Research Dossier

## Activation
- Active keyphrase: **Your Dentist in Oujda — Smart Dental Booking Website**
- Normalized interpretation: a modern brochure/marketing website for a specific dental practice in Oujda, with treatment information, practitioner/clinic presentation, FAQ and an appointment-request flow. The intended booking UX captures service, preferred date/time and doctor; real-time availability and automatic confirmation are not currently provisioned.
- Research date: 2026-10-07
- Research state: COMPLETE for initial implementation; production identity/content gaps remain.

## Entity resolution

### FACT — high confidence
Public directory and map sources consistently identify the practice as **Cabinet Dentaire Dr. Mohammed Taha Zarrouki / your dentist in oujda** at **Boulevard Hassan II, Hay Zangout, Imm. Badr, 2e étage, N°13, Oujda 60050, Morocco**.
Sources: Waze listing; BizNiz public business listing; SihaJobs public directory; DentistMaroc; MyDentistPro.

### FACT — high confidence
The public listings consistently expose the phone **+212 5 36 70 10 60**.
Sources: Waze; SihaJobs; MyDentistPro; DentistMaroc.

### FACT — medium/high confidence
MyDentistPro and related public listings mark the same number as a WhatsApp contact channel.

### FACT — medium/high confidence
Public listings associate the cabinet with **implantologie** and **dentisterie esthétique**.
Source: MyDentistPro.

### FACT — medium/high confidence
The public opening schedule most consistently found is:
- Monday 09:00–17:30
- Tuesday–Friday 09:00–18:00
- Saturday 09:00–12:30
- Sunday closed
Sources: Waze, BizNiz, SihaJobs.

### FACT — high confidence
A public Instagram profile is associated with the practice: **@dr_taha_zarrouki**.

## Conflicts / uncertainty
- BizNiz currently exposes a second phone value (06 04 73 15 25) in its unclaimed listing, while Waze and several directories consistently expose +212 5 36 70 10 60. The implementation uses the latter as the primary contact because it is corroborated across more independent public listings.
- A public rating appears around 4.9/5, but review counts differ across directories and therefore the site does not hard-code a review count or rating in the first implementation.
- No authoritative owned website with approved treatment copy, physician biography, clinic photos, pricing or exact booking availability was located during reconnaissance.

## UX / market observations
- Oujda dental practices commonly emphasize phone/WhatsApp contact, treatment/service pages, address/map, hours and appointment requests.
- Existing Oujda dental sites use sections for orthodontics, implantology, aesthetics, preventive/general care and technology/equipment; these are useful pattern references but are not treated as facts about this specific cabinet unless independently corroborated.
- A low-friction contact-first booking model is appropriate for the available evidence because no authenticated booking API was found.

## Safety / content implications
- This is a dental/health practice website. The implementation must remain informational and must not introduce unsupported diagnoses, outcomes, guarantees, testimonials, certifications, prices or clinical claims.
- Appointment submission must not be represented as a confirmed booking unless a real scheduling backend is provisioned and observed working.
- Emergency copy should route patients to direct clinical contact and avoid medical triage claims.

## Design direction
- Calm, premium, clinical visual language: deep blue-green ink, soft mint accents, warm off-white surfaces, generous whitespace.
- Strong mobile-first hierarchy with prominent “Prendre rendez-vous” and WhatsApp CTAs.
- Use generated geometric/abstract graphics instead of unverified clinic photography until approved assets are supplied.

## Technical implications
- Zero-dependency static architecture is appropriate for the first candidate and minimizes attack surface.
- Booking is implemented as structured WhatsApp message composition, not a data-storing backend.
- Google Maps is linked by query URL rather than using a paid/credentialed Maps embed API.
- No analytics or tracking is enabled because no approved measurement configuration was provided.

## Source registry
1. Waze — “your dentist in oujda” / Cabinet Dentaire Dr. Mohammed Taha Zarrouki. Retrieved 2026-10-07.
2. BizNiz.ma — “your dentist in oujda”, business listing and public reviews. Retrieved 2026-10-07.
3. SihaJobs.ma — “Cabinet Dentaire Dr. Mohammed Taha Zarrouki”. Retrieved 2026-10-07.
4. MyDentistPro / DonPro — “Cabinet Dentaire Dr. Mohammed Taha Zarrouki”. Retrieved 2026-10-07.
5. DentistMaroc — “Dr. Mohammed Taha Zarrouki”. Retrieved 2026-10-07.
6. Search results for Oujda dental practices, used for competitive UX pattern context. Retrieved 2026-10-07.

## Research completion
COMPLETE — major entity identity, location, contact, hours, publicly declared specialties, UX patterns, content constraints and implementation limitations were identified. New search families were producing primarily duplicate directory information. Production-approved content, booking backend and deployment identity remain UNKNOWN / TO BE VALIDATED.
