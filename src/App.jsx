import { useEffect, useState, useRef, useCallback } from 'react';
import { VIEWS, GAME_STATUS } from './lib/constants';
import { genPin, genId, totalSeconds } from './lib/utils';
import { quizLib } from './lib/storage';
import { gameAPI, FIREBASE_OK } from './lib/firebase';
import { scoreAnswer, createQuestion } from './lib/scoring';
import { sounds } from './lib/sounds';
import { useGameState } from './hooks/useGameState';
import { useQuestionTimer } from './hooks/useQuestionTimer';
import { useToast } from './hooks/useToast';

import Toast from './components/Toast';
import FirebaseWarning from './components/FirebaseWarning';

import HomeView from './views/HomeView';
import AdminLibraryView from './views/AdminLibraryView';
import AdminQuizEditView from './views/AdminQuizEditView';
import AdminQuestionEditView from './views/AdminQuestionEditView';
import HostLobbyView from './views/HostLobbyView';
import HostQuestionView from './views/HostQuestionView';
import HostResultsView from './views/HostResultsView';
import HostFinalView from './views/HostFinalView';
import PlayerJoinView from './views/PlayerJoinView';
import PlayerNameView from './views/PlayerNameView';
import PlayerLobbyView from './views/PlayerLobbyView';
import PlayerPlayingView from './views/PlayerPlayingView';
import PlayerAnsweredView from './views/PlayerAnsweredView';
import PlayerResultView from './views/PlayerResultView';
import PlayerFinalView from './views/PlayerFinalView';

export default function App() {
  // Routing / view state
  const [view, setView] = useState(VIEWS.HOME);

  // Admin state
  const [library, setLibrary] = useState(() => quizLib.getAll());
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState({ idx: -1, draft: null });

  // Game state
  const [pin, setPin] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const game = useGameState(pin);

  // Player input state
  const [pinInput, setPinInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [nameError, setNameError] = useState('');

  // Track which question index the player has answered (so we can transition)
  const playerAnsweredRef = useRef(-1);
  // Track question end auto-trigger so we don't fire twice
  const lastEndedRef = useRef(-1);

  const { toast, show: showToast } = useToast();

  // -------------------------------------------------------------------
  // URL ?pin=XXX auto-fill
  // -------------------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPin = params.get('pin');
    if (urlPin && /^\d{6}$/.test(urlPin)) {
      setPinInput(urlPin);
      setView(VIEWS.PLAYER_JOIN);
    }
  }, []);

  const refreshLibrary = useCallback(() => setLibrary(quizLib.getAll()), []);

  const goHome = useCallback(() => {
    setView(VIEWS.HOME);
    setPin(null);
    setIsHost(false);
    setPlayerId(null);
    setPlayerName('');
    setPinInput('');
    setNameInput('');
    setJoinError('');
    setNameError('');
    setEditingQuiz(null);
    playerAnsweredRef.current = -1;
    lastEndedRef.current = -1;
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    refreshLibrary();
  }, [refreshLibrary]);

  // -------------------------------------------------------------------
  // PLAYER auto-transitions based on Firebase game state
  // -------------------------------------------------------------------
  useEffect(() => {
    if (isHost || !game || !playerId) return;

    if (game.status === GAME_STATUS.PLAYING) {
      // New question started — reset answered tracker if question changed
      if (playerAnsweredRef.current !== game.currentQuestionIndex) {
        playerAnsweredRef.current = -1;
      }
      // If we haven't answered this question yet, show playing view
      if (playerAnsweredRef.current !== game.currentQuestionIndex) {
        setView(VIEWS.PLAYER_PLAYING);
      } else {
        setView(VIEWS.PLAYER_ANSWERED);
      }
    } else if (game.status === GAME_STATUS.SHOWING_RESULTS) {
      setView(VIEWS.PLAYER_RESULT);
    } else if (game.status === GAME_STATUS.FINISHED) {
      setView(VIEWS.PLAYER_FINAL);
    } else if (game.status === GAME_STATUS.LOBBY) {
      setView(VIEWS.PLAYER_LOBBY);
    }
  }, [game?.status, game?.currentQuestionIndex, isHost, playerId]);

  // -------------------------------------------------------------------
  // HOST auto-end question when timer expires
  // -------------------------------------------------------------------
  const currentQ = game?.questions?.[game?.currentQuestionIndex];
  const { secondsLeft } = useQuestionTimer(
    currentQ,
    game?.questionStartedAt,
    isHost && view === VIEWS.HOST_QUESTION
  );

  useEffect(() => {
    if (!isHost || view !== VIEWS.HOST_QUESTION || !game) return;
    if (secondsLeft === 0 && lastEndedRef.current !== game.currentQuestionIndex) {
      lastEndedRef.current = game.currentQuestionIndex;
      handleShowResults();
    }
  }, [secondsLeft, isHost, view, game?.currentQuestionIndex]);

  // -------------------------------------------------------------------
  // ADMIN HANDLERS
  // -------------------------------------------------------------------
  const createNewQuiz = () => {
    const quiz = {
      id: genId(),
      title: 'Yeni quiz',
      questions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    quizLib.save(quiz);
    setEditingQuiz(quiz);
    refreshLibrary();
    setView(VIEWS.ADMIN_QUIZ_EDIT);
  };

  const editQuiz = (id) => {
    const q = library.find(x => x.id === id);
    if (q) {
      setEditingQuiz(q);
      setView(VIEWS.ADMIN_QUIZ_EDIT);
    }
  };

  const addQuestionToQuiz = (type) => {
    const newQ = createQuestion(type);
    setEditingQuestion({ idx: -1, draft: newQ });
    setView(VIEWS.ADMIN_QUESTION_EDIT);
  };

  const editQuestionInQuiz = (idx) => {
    setEditingQuestion({ idx, draft: editingQuiz.questions[idx] });
    setView(VIEWS.ADMIN_QUESTION_EDIT);
  };

  const saveQuestionDraft = (q) => {
    let updated;
    if (editingQuestion.idx === -1) {
      updated = { ...editingQuiz, questions: [...editingQuiz.questions, q] };
    } else {
      const newQs = [...editingQuiz.questions];
      newQs[editingQuestion.idx] = q;
      updated = { ...editingQuiz, questions: newQs };
    }
    quizLib.save(updated);
    setEditingQuiz(updated);
    refreshLibrary();
    showToast('Sual yadda saxlandı', 'success');
    setView(VIEWS.ADMIN_QUIZ_EDIT);
  };

  // -------------------------------------------------------------------
  // GAME LIFECYCLE — Host
  // -------------------------------------------------------------------
  const startGameFromQuiz = async (quiz) => {
    if (!quiz.questions.length) {
      showToast('Quizdə sual yoxdur', 'error');
      return;
    }
    const newPin = genPin();
    const gameData = {
      pin: newPin,
      title: quiz.title,
      questions: quiz.questions,
      players: {},
      answers: {},
      status: GAME_STATUS.LOBBY,
      currentQuestionIndex: 0,
      questionStartedAt: null,
      createdAt: Date.now(),
    };
    const ok = await gameAPI.set(newPin, gameData);
    if (!ok) {
      showToast('Firebase xətası — config-i yoxla', 'error');
      return;
    }
    setPin(newPin);
    setIsHost(true);
    setView(VIEWS.HOST_LOBBY);
  };

  const startQuiz = async () => {
    if (!game || !pin) return;
    if (Object.keys(game.players || {}).length === 0) {
      showToast('Heç bir iştirakçı yoxdur', 'warning');
      return;
    }
    lastEndedRef.current = -1;
    await gameAPI.update(pin, {
      status: GAME_STATUS.PLAYING,
      currentQuestionIndex: 0,
      questionStartedAt: Date.now(),
    });
    setView(VIEWS.HOST_QUESTION);
  };

  // CRITICAL: Host computes scoring with scoreAnswer() and writes results back.
  // Players read these same results — guaranteeing identical view.
  const handleShowResults = async () => {
    if (!game || !pin) return;
    const qIdx = game.currentQuestionIndex;
    const q = game.questions[qIdx];
    const ansForQ = game.answers?.[qIdx] || {};
    const startedAt = game.questionStartedAt;

    const updates = {};
    const newPlayers = { ...(game.players || {}) };

    for (const [pid] of Object.entries(game.players || {})) {
      const a = ansForQ[pid];
      if (!a) continue; // no answer
      // Recompute and persist canonical result
      const result = scoreAnswer(q, a, a.answeredAt || (startedAt + totalSeconds(q) * 1000), startedAt);
      updates[`answers/${qIdx}/${pid}/correct`] = result.correct;
      updates[`answers/${qIdx}/${pid}/points`] = result.points;
      updates[`answers/${qIdx}/${pid}/correctness`] = result.correctness;
      updates[`answers/${qIdx}/${pid}/details`] = result.details || {};
      // Add points to player's score
      newPlayers[pid] = {
        ...newPlayers[pid],
        score: (newPlayers[pid].score || 0) + result.points,
      };
    }

    updates['players'] = newPlayers;
    updates['status'] = GAME_STATUS.SHOWING_RESULTS;

    await gameAPI.update(pin, updates);
    setView(VIEWS.HOST_RESULTS);
  };

  const handleNextQuestion = async () => {
    if (!game || !pin) return;
    const next = game.currentQuestionIndex + 1;
    if (next >= game.questions.length) {
      await gameAPI.update(pin, { status: GAME_STATUS.FINISHED });
      setView(VIEWS.HOST_FINAL);
    } else {
      lastEndedRef.current = -1;
      await gameAPI.update(pin, {
        currentQuestionIndex: next,
        status: GAME_STATUS.PLAYING,
        questionStartedAt: Date.now(),
      });
      setView(VIEWS.HOST_QUESTION);
    }
  };

  // -------------------------------------------------------------------
  // PLAYER HANDLERS
  // -------------------------------------------------------------------
  const joinByPin = async () => {
    if (pinInput.length !== 6) {
      setJoinError('PIN 6 rəqəm olmalıdır');
      return;
    }
    const g = await gameAPI.get(pinInput);
    if (!g) {
      setJoinError('Belə oyun tapılmadı');
      return;
    }
    if (g.status !== GAME_STATUS.LOBBY) {
      setJoinError('Oyun artıq başlayıb');
      return;
    }
    setJoinError('');
    setPin(pinInput);
    setView(VIEWS.PLAYER_NAME);
  };

  const submitName = async () => {
    const name = nameInput.trim();
    if (!name) { setNameError('Ad boş ola bilməz'); return; }
    const g = await gameAPI.get(pin);
    if (!g) { setNameError('Oyun tapılmadı'); return; }
    const taken = Object.values(g.players || {}).some(p => p.name.toLowerCase() === name.toLowerCase());
    if (taken) { setNameError('Bu ad artıq götürülüb'); return; }

    const newId = genId();
    await gameAPI.addPlayer(pin, newId, { name, score: 0, joinedAt: Date.now() });
    setPlayerId(newId);
    setPlayerName(name);
    setNameError('');
    setView(VIEWS.PLAYER_LOBBY);
  };

  const submitAnswerValue = async (value) => {
    if (!game || !pin || !playerId) return;
    const qIdx = game.currentQuestionIndex;
    // Write only the player's answer slot — atomic, race-free.
    await gameAPI.submitAnswer(pin, qIdx, playerId, {
      value,
      answeredAt: Date.now(),
    });
    playerAnsweredRef.current = qIdx;
    setView(VIEWS.PLAYER_ANSWERED);
  };

  // -------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------
  if (!FIREBASE_OK) return <FirebaseWarning />;

  return (
    <>
      <Toast {...toast} />

      {view === VIEWS.HOME && (
        <HomeView
          onAdmin={() => setView(VIEWS.ADMIN_LIBRARY)}
          onJoin={() => setView(VIEWS.PLAYER_JOIN)}
        />
      )}

      {view === VIEWS.ADMIN_LIBRARY && (
        <AdminLibraryView
          library={library}
          onRefresh={refreshLibrary}
          onHome={goHome}
          onCreate={createNewQuiz}
          onEdit={editQuiz}
          onStart={startGameFromQuiz}
          onShowToast={showToast}
        />
      )}

      {view === VIEWS.ADMIN_QUIZ_EDIT && editingQuiz && (
        <AdminQuizEditView
          quiz={editingQuiz}
          onBack={() => { refreshLibrary(); setView(VIEWS.ADMIN_LIBRARY); }}
          onUpdate={setEditingQuiz}
          onAddQuestion={addQuestionToQuiz}
          onEditQuestion={editQuestionInQuiz}
          onStart={startGameFromQuiz}
          onShowToast={showToast}
        />
      )}

      {view === VIEWS.ADMIN_QUESTION_EDIT && editingQuestion.draft && (
        <AdminQuestionEditView
          initialQuestion={editingQuestion.draft}
          qIdx={editingQuestion.idx}
          onBack={() => setView(VIEWS.ADMIN_QUIZ_EDIT)}
          onSave={saveQuestionDraft}
        />
      )}

      {view === VIEWS.HOST_LOBBY && game && (
        <HostLobbyView pin={pin} game={game} onHome={goHome} onStart={startQuiz} />
      )}

      {view === VIEWS.HOST_QUESTION && game && (
        <HostQuestionView game={game} onShowResults={handleShowResults} />
      )}

      {view === VIEWS.HOST_RESULTS && game && (
        <HostResultsView game={game} onNext={handleNextQuestion} />
      )}

      {view === VIEWS.HOST_FINAL && game && (
        <HostFinalView game={game} onHome={goHome} />
      )}

      {view === VIEWS.PLAYER_JOIN && (
        <PlayerJoinView
          pinInput={pinInput}
          setPinInput={setPinInput}
          error={joinError}
          onJoin={joinByPin}
          onHome={goHome}
        />
      )}

      {view === VIEWS.PLAYER_NAME && (
        <PlayerNameView
          nameInput={nameInput}
          setNameInput={setNameInput}
          error={nameError}
          gameTitle={game?.title || ''}
          onSubmit={submitName}
        />
      )}

      {view === VIEWS.PLAYER_LOBBY && game && (
        <PlayerLobbyView playerName={playerName} playerId={playerId} game={game} />
      )}

      {view === VIEWS.PLAYER_PLAYING && game && (
        <PlayerPlayingView game={game} onSubmit={submitAnswerValue} />
      )}

      {view === VIEWS.PLAYER_ANSWERED && (
        <PlayerAnsweredView playerName={playerName} />
      )}

      {view === VIEWS.PLAYER_RESULT && game && (
        <PlayerResultView playerId={playerId} playerName={playerName} game={game} />
      )}

      {view === VIEWS.PLAYER_FINAL && game && (
        <PlayerFinalView playerId={playerId} playerName={playerName} game={game} onHome={goHome} />
      )}
    </>
  );
}
