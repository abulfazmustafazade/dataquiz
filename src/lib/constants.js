// Answer themes (Kahoot-style)
export const ANSWER_THEMES = [
  { bg: 'bg-rose-500',    hover: 'hover:bg-rose-600',    solid: '#f43f5e', shape: '▲', name: 'Üçbucaq' },
  { bg: 'bg-sky-500',     hover: 'hover:bg-sky-600',     solid: '#0ea5e9', shape: '◆', name: 'Romb' },
  { bg: 'bg-amber-400',   hover: 'hover:bg-amber-500',   solid: '#fbbf24', shape: '●', name: 'Dairə' },
  { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', solid: '#10b981', shape: '■', name: 'Kvadrat' },
  { bg: 'bg-violet-500',  hover: 'hover:bg-violet-600',  solid: '#8b5cf6', shape: '★', name: 'Ulduz' },
  { bg: 'bg-orange-500',  hover: 'hover:bg-orange-600',  solid: '#f97316', shape: '⬢', name: 'Altıbucaq' },
];

export const QUESTION_TYPES = {
  multiple_choice: { label: 'Çoxvariantlı (1 cavab)',     icon: '🎯', short: 'Çoxvariantlı' },
  true_false:      { label: 'Hə / Yox',                    icon: '✓',  short: 'Hə/Yox' },
  multiple_select: { label: 'Çoxvariantlı (bir neçə cavab)', icon: '☑',  short: 'Çoxlu seçim' },
  type_answer:     { label: 'Mətn cavabı (sərbəst)',       icon: '✏️', short: 'Mətn' },
  sorting:         { label: 'Sıralama (puzzle)',           icon: '🔢', short: 'Sıralama' },
};

// Avatar emojis — random one assigned to each player
export const AVATARS = [
  '🦁', '🐯', '🐺', '🦊', '🐱', '🐶', '🐼', '🐨', '🐸', '🐙',
  '🦄', '🐲', '🦅', '🦉', '🐢', '🐬', '🦋', '🐝', '🦖', '🦒',
  '🦔', '🐙', '🦩', '🦘', '🐧', '🦦', '🦝', '🐰', '🐿️', '🦫',
];

export const PLAYER_COLORS = [
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-green-600',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-fuchsia-500 to-pink-600',
  'from-cyan-500 to-teal-600',
  'from-yellow-500 to-amber-600',
];

// Game status
export const GAME_STATUS = {
  LOBBY: 'lobby',
  PLAYING: 'playing',
  SHOWING_RESULTS: 'showing_results',
  FINISHED: 'finished',
};

// View names
export const VIEWS = {
  HOME: 'home',
  ADMIN_LIBRARY: 'admin-library',
  ADMIN_QUIZ_EDIT: 'admin-quiz-edit',
  ADMIN_QUESTION_EDIT: 'admin-question-edit',
  HOST_LOBBY: 'host-lobby',
  HOST_QUESTION: 'host-question',
  HOST_RESULTS: 'host-results',
  HOST_FINAL: 'host-final',
  PLAYER_JOIN: 'player-join',
  PLAYER_NAME: 'player-name',
  PLAYER_LOBBY: 'player-lobby',
  PLAYER_PLAYING: 'player-playing',
  PLAYER_ANSWERED: 'player-answered',
  PLAYER_RESULT: 'player-result',
  PLAYER_FINAL: 'player-final',
  CROWD_LANDING: 'crowd-landing',
CROWD_HOST: 'crowd-host',
CROWD_JOIN: 'crowd-join',
CROWD_PARTICIPANT: 'crowd-participant',
};
