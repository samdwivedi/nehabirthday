# Neha's Birthday — The Chota Don Chronicles

A password-protected, mobile-first birthday story for Neha Singh. Built with Next.js 15, React 19 and TypeScript.

## Included
- Server-side password gate using an HTTP-only, signed cookie
- Nine connected story chapters
- Relationship timeline (5 May 2026; six-month milestone 5 November 2026)
- Local photo preview uploader for adding memories later
- Personalised Chota Don awards and Apple inside-joke case file
- Interactive quiz, 21-candle cake, love letter and promise reveal
- Music toggle expecting a locally supplied audio file
- Responsive layout and reduced-motion support

## Run locally
1. Install Node.js 20.9 or later.
2. Copy `.env.example` to `.env.local`.
3. Set `BIRTHDAY_PASSWORD` to a private password you choose.
4. Set `SESSION_SECRET` to a random secret of at least 32 characters.
5. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add music
Place an audio file you are authorised to use at:
`public/music/dilruba-dilnasheen.mp3`

The app does not bundle copyrighted music. The title alone is not an audio file; add your own legally obtained copy if you have permission to use it.

## Add photos
The memory chapter currently includes a browser-local preview uploader. To make the photos part of the deployed website, copy selected images into `public/images/memories/` and update the gallery data in `src/components/BirthdayExperience.tsx`. Do not upload private photos to a public repository unless you are comfortable with that exposure.

## Password protection and deployment
The password is checked in a server action; it is not embedded in the client bundle. The access cookie is HTTP-only and signed using `SESSION_SECRET`.

Before deployment:
- Set both environment variables in your hosting provider's server-side environment settings.
- Use HTTPS.
- Add rate limiting at the hosting/WAF layer to protect the unlock endpoint from repeated guesses.
- Keep `.env.local`, private photos and audio out of public Git repositories.
- If using a platform with preview deployments, apply the same environment protection to previews.

The password gate protects access to the story page. Uploaded browser-local previews are not persisted or uploaded to a server.
