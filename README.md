# Paul & Malampi Wedding Website

A mobile-first, static and free wedding website for GitHub Pages. One `guest.html` serves all personalized invitations using `?g=guest-slug`.

## Included
- 68 personalized guest groups with stable IDs
- Personal name and party size
- Countdown, schedule, photo gallery and calendar file
- Corrected Minsundu Recreation Park link
- WhatsApp RSVP plus visible phone numbers
- Personal entry ticket QR on the final section, usable from a screenshot offline
- Black, ivory and antique-gold design optimized for phones

## Publish free with GitHub Pages
1. Create a public GitHub repository.
2. Upload everything in this folder to the repository root.
3. Open Settings > Pages.
4. Choose Deploy from a branch, main, /(root), then Save.
5. Open the Pages URL shown by GitHub.

## Generate personal invitation QR codes
After publishing, install Python and run:

```bash
pip install "qrcode[pil]"
python generate_qr.py "https://USERNAME.github.io/REPOSITORY"
```

The final invitation QR codes appear in `qr-codes/`. Upload that folder again if desired, though the website itself does not need it.

## Test locally
```bash
python -m http.server 8000
```
Then open `http://localhost:8000/guest.html?g=mr-mrs-bwalya`. Do not test by double-clicking the HTML because browsers can block loading the local JSON file.
