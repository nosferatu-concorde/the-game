// Player speech bubbles
export const PLAYER_IDLE = "IF (idle)\n  start.idling()";

// Enemy speech bubbles
export const ENEMY_CHASE = "10 'KILL KILL KILL'\n20 GOTO 10";
export const ENEMY_PATROL_LEFT = "IF !ENEMY patrol()";
export const ENEMY_PATROL_RIGHT = "IF !ENEMY patrol()";

// Saw speech bubbles
export const SAW_LOOP = "while(true)\ncirculate ()";

// Title screen
export const TITLE_TEXT = "IF !AI THIS.GAME";
export const TITLE_PROMPT =
  "/* Traditional anti-intelligence with IF and Else */\n/* Press SPACE to begin */";
// Halfway screen (after level 5)
export const HALFWAY_MESSAGE =
  "Well done, you are halfway through the game.\nI never made it past this point.\nUncharted territory! Best of luck!";

// End screen (after level 10)
export const END_MESSAGE =
  "You made it! Congrats!\nTHANK YOU FOR PLAYING and THANK YOU TO SUPERCELL for the game Jam!";

// Game over
export const DEATH_TEXT = "IF DEATH DEAD";
