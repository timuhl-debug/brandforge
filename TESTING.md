# BrandForge test checklist

## Automated checks completed for this ZIP

- `npm test`: 16 tests pass after adding checks for project-specific layout persistence and reset defaults. They cover HEX color validation and normalization, PNG/JPEG/WebP file signatures, English/German/French language support and translation lookup, plus static checks that the PNG exporter includes all four logo presets, the selected symbol, brand name, tagline, palette and PNG download flow, that email verification uses a clickable link in email and local development, and that the live preview editor provides drag-and-drop movement, X/Y position controls, resizing, layer controls, layout reset, image selection and position-aware PNG export. Project-specific checks confirm that layout positions, sizes, layer order, typography styles, and selected preview assets use brand-ID-scoped browser-storage keys and are loaded when a brand opens.
- `node --check server.js`
- `node --check routes/auth.js`
- `node --check utils/validation.js`
- Font update endpoints validate font family, purpose and weight on the server.

## Manual integration checklist

These checks need installed npm dependencies, a running MongoDB database and SMTP credentials if real emails should be sent.

1. Copy `.env.example` to `.env` and set a unique `JWT_SECRET` with at least 32 characters.
2. Start MongoDB and run `npm install`, then `npm run dev`.
3. Open `http://localhost:5173` and register with a new email address.
4. Confirm the verification email arrives and contains a clickable “Verify email address” button plus a fallback URL. Without SMTP, click the development verification link shown after registration or use the link printed in the server terminal.
5. Try to sign in before verification, then verify the account and sign in successfully.
6. Open `/profile` in a signed-out browser session and confirm it redirects to the sign-in screen.
7. Create a brand and edit its name, industry, tagline and description. Reload and confirm the saved values remain.
8. Select each logo preset (Monogram, Orbit, Bloom and Frame), save it, reopen the brand and confirm the selected preset remains.
9. Add, edit and delete colors and typography. Try an invalid HEX value and invalid font weight.
10. Upload valid PNG, JPEG and WebP images. Test an unsupported file, a renamed non-image file and a file larger than 5 MB.
11. Duplicate and delete a brand. Confirm the delete prompt appears.
12. Export CSS and JSON. Open the JSON file and check its project data.
13. In the live identity preview, drag the logo, brand name, tagline and color palette to new positions. Select each element in the controls and change its X/Y values and size. Use Bring forward and Send backward to change the stacking order, then reset the layout. Text starts in the foreground by default.
14. Upload an image in Brand assets, select it in the preview controls, then drag and resize it. Confirm the image and text remain visible in the intended order.
15. Use “Export preview as PNG”. Confirm a 1200 × 700 PNG downloads and matches the selected logo preset, current element positions, sizes, layer order, text, background, palette and selected image. The automated tests check the exporter source, but the browser download still requires a manual check.
16. Export the brand guidelines, choose Save as PDF in the print dialog and inspect the result.
17. Switch between English, German and French and between light and dark mode. Reload and confirm the selections persist.
18. Use a second account to request the first account's brand ID and confirm the API does not return that brand.
19. Run `npm test` and `npm run build` before submission.

## Email verification link checks

- The email template includes a clickable verification button and a fallback URL.
- Local development registration responses include a clickable verification URL when SMTP is unavailable. Production responses do not expose the token in the browser response.
- The frontend route `/verify-email?token=...` calls the verification API and displays the result.

## Current test limits

The automated tests do not replace a browser/API end-to-end test. The environment used to prepare this ZIP could run the tests and backend syntax checks, but `npm install` timed out while waiting for package downloads. A second dependency-install attempt also timed out, so a Vite production build and the MongoDB/SMTP flows are not confirmed in this environment. Project-specific layout behavior has been verified with automated source-level tests, but not yet with a full interactive browser session. Run the build and manual checklist locally before submitting.
