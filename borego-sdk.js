/* Borego Game SDK v1
 * Put this file next to your game's index.html and add <script src="borego-sdk.js"></script> before your game code.
 * Your game never needs any database settings. Borego connects the players for you.
 *
 *   Borego.on('ready', function(){ ... })        game can start. Borego.me, Borego.players, Borego.isHost, Borego.solo are filled in
 *   Borego.send(data)                            fast message to the other players (use for movement, positions, input)
 *   Borego.on('message', function(data, from){}) a message from another player arrived
 *   Borego.saveState(state, 'move')              keep the shared game state safely (use for turns, scores, results)
 *   Borego.on('state', function(state){})        the shared state changed
 *   Borego.on('players', function(players){})    someone joined or left
 *
 * Opened on its own (not inside Borego), the SDK starts a one-player game so you can test in any browser.
 */
(function (w) {
  'use strict';
  var B = { version: 1, ready: false, me: null, roomId: null, players: [], state: null, events: [], status: '', solo: false, spectator: false, isHost: true, seat: 1 };
  var H = { ready: [], message: [], state: [], players: [], error: [] };
  var embedded = w.parent !== w;
  function emit(n, a, b) { (H[n] || []).slice().forEach(function (f) { try { f(a, b); } catch (e) { console.error(e); } }); }
  B.on = function (n, f) {
    if (!H[n]) H[n] = [];
    H[n].push(f);
    if (n === 'ready' && B.ready) setTimeout(function () { try { f(B); } catch (e) { console.error(e); } }, 0);
    return B;
  };
  B.send = function (data) { if (embedded) w.parent.postMessage({ type: 'borego:broadcast', payload: data }, '*'); };
  B.saveState = function (state, eventType, payload) {
    B.state = state;
    if (embedded) w.parent.postMessage({ type: 'borego:event', eventType: String(eventType || 'state'), payload: payload || {}, state: state }, '*');
  };
  function apply(d) {
    var prev = JSON.stringify(B.players.map(function (p) { return p.id; }));
    B.me = d.me; B.roomId = d.roomId; B.status = d.status || ''; B.spectator = !!d.spectator;
    B.players = (d.players || []).slice().sort(function (a, b) { return (a.seat || 0) - (b.seat || 0); });
    B.solo = !!d.solo || B.players.length < 2;
    B.isHost = !B.players.length || B.players[0].id === B.me;
    var mine = B.players.filter(function (p) { return p.id === B.me; })[0];
    B.seat = mine ? mine.seat : 1;
    if (d.events) B.events = d.events;
    var st = d.state;
    var stateChanged = JSON.stringify(st) !== JSON.stringify(B.state);
    if (st !== undefined) B.state = st;
    var first = !B.ready;
    B.ready = true;
    if (first) emit('ready', B);
    else if (prev !== JSON.stringify(B.players.map(function (p) { return p.id; }))) emit('players', B.players);
    if (!first && stateChanged) emit('state', B.state);
  }
  w.addEventListener('message', function (e) {
    if (embedded && e.source !== w.parent) return;
    var d = e.data;
    if (!d || typeof d.type !== 'string' || d.type.indexOf('borego:') !== 0) return;
    if (d.type === 'borego:init' || d.type === 'borego:update') apply(d);
    else if (d.type === 'borego:broadcast') emit('message', d.payload, d.from);
    else if (d.type === 'borego:error') emit('error', d.message);
  });
  if (!embedded) setTimeout(function () { apply({ me: 'local', roomId: 'solo', solo: true, status: 'active', players: [{ id: 'local', name: 'You', seat: 1 }] }); }, 0);
  w.Borego = B;
})(window);
