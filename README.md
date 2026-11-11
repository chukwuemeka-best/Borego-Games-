# Borego Football Online — enhanced build 0.3.0

Upload the extracted folder contents to the root of your GitHub Pages game repository. The entry file is `index.html`.

## Match connection
- Player 1 chooses **Create Online Match**.
- Share the 8-character room code in Borego chat.
- Player 2 opens the same URL, enters the code and chooses **Join**.
- The host simulates the match and sends live state using Supabase Realtime.

## Controls
- Mobile: joystick; PASS, SHOOT, LOB, TACKLE, SPRINT, SWITCH.
- Desktop: WASD/arrows, J pass, K shoot, Shift sprint. On-screen buttons also work.
- SOUND ON/OFF toggles synthesized effects.

## Included
- 3D pitch, two 11-player teams, formation-based basic AI and goalkeeper positioning.
- 1v1 online room-code connection using Supabase Realtime.
- Movement, sprint/stamina, player switching, passing, shooting, lob shots and tackles.
- Goal detection, score, accelerated 90-minute clock, halftime and full-time.
- Throw-in, corner and goal-kick stoppages with restart interaction.
- Synthesized kick, pass, lob, tackle, whistle, goal fanfare, halftime and full-time sounds, plus subtle stadium ambience.

## Important limitations
This is an expanded playable prototype, not a finished commercial-grade football simulator. Official-standard offside decisions, foul/card logic, penalty-area foul/penalty-kick logic, free-kick placement, substitutions and penalty shootouts are not implemented. Player movement/animation and AI are basic. The game currently supports 1v1 only, not 2v2.

Online rooms use public Supabase Realtime broadcast channels with a random code and the public anon key. This package is not connected to Borego account identity or the secure Borego Game SDK gateway; it does not authenticate that the person entering a code is the invited Borego user. Multiplayer has not been live-tested on two separate devices here. Test both phones after deployment before publishing to all users.

Three.js and Supabase JS load from CDNs, so internet is required. No service-role key is included.
