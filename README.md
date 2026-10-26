# NextStep SA

A React, TypeScript and Tailwind career-development website for South African job seekers. It includes a landing page, local sign-up/login, profile-driven vacancy matching, saved jobs, a printable CV draft, career resources and a Z83 application guide.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Run `npm run dev` and open the local address printed by Vite.

No database, API keys or `.env` file is required.

## Browser-local storage

Accounts, password hashes, profiles, saved jobs and vacancies are stored in this browser's local storage. Passwords are salted and hashed with PBKDF2 before they are saved. The browser-local implementation is for a prototype/demo and is not production authentication: browser data can be inspected or changed by someone with access to the device, and the app does not provide server-side account security, shared accounts, cross-device sync, administrator review or backups. Clearing the browser's site data removes the accounts and records. Do not reuse a password or enter sensitive personal information in a demo.

## Vacancies

The app does not invent job listings or automatically scrape other websites. Sign in, choose **Add a vacancy**, and copy the role details from an actual advert, including its secure HTTPS source link and application deadline. Check the confirmation that the vacancy is current. The listing is saved only in this browser and is ranked against the signed-in profile's skills, qualification, interests, sectors, location and preferred work type. Confirm requirements and deadlines on the original employer or government advert before applying. The official [DPSA vacancy circular](https://www.dpsa.gov.za/newsroom/psvc/) is linked from the job and Z83 pages.

## Build

Run `npm run build` to type-check and create the production build in `dist/`.
