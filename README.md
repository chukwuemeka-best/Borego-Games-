# Borego Football Online — enhanced build 0.3.0

Upload all files to the top level of your GitHub Pages game repository (or into a folder for another game). The entry file is `index.html`.

## How it connects
No codes and no database keys. Borego connects the players (see borego-sdk.js).
- 1 player: tap "1 player" in Borego's game list. You play against the computer.
- 2 players: start Football from a chat and invite your friend. 1 vs 1.
- 3 or 4 players: start Football from a squad chat. 2 vs 2, two real people on each team (the computer fills a missing spot).
The first player (host) presses KICK OFF in the lobby.

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
This is an expanded playable prototype, not a finished commercial-grade football simulator. Official-standard offside decisions, foul/card logic, penalty-area foul/penalty-kick logic, free-kick placement, substitutions and penalty shootouts are not implemented. Player movement/animation and AI are basic. Supports 1 player (vs computer), 1v1, and 2v2.

Players are connected through Borego rooms, so only invited members can join. Multiplayer has been tested here with simulated players, not on real phones. Test with a friend after you upload.

Three.js loads from a CDN, so internet is required. No service-role key is included.


## Cover picture
cover.png is the game's picture. After uploading, paste this in the admin panel's picture link box:
https://chukwuemeka-best.github.io/borego-games-/cover.png
