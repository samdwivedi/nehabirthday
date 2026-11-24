'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Heart, Volume2, VolumeX, Sparkles, LockKeyhole, Camera, Gift, Play, Pause, Crown, PartyPopper, X, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { verifyPasswordAction } from '@/app/actions/unlock';

type Chapter = { kicker: string; title: string; subtitle: string };
const chapters: Chapter[] = [
  { kicker: 'A little invitation', title: 'Somewhere in this universe…', subtitle: 'there is a girl who makes ordinary days feel a little more magical.' },
  { kicker: 'Chapter 01 · The birthday girl', title: 'Welcome, Chota Don.', subtitle: 'Today, the universe has one very important VIP. And yes, she is you.' },
  { kicker: 'Chapter 02 · Our little story', title: 'Six months. A million feelings.', subtitle: 'Since 5 May 2026, life has collected a few more reasons to smile.' },
  { kicker: 'Chapter 03 · The memory museum', title: 'Little moments, kept forever.', subtitle: 'A scrapbook for the photos, the smiles, and the memories still waiting to happen.' },
  { kicker: 'Chapter 04 · Classified files', title: 'The Chota Don files.', subtitle: 'A highly confidential investigation into one very adorable human.' },
  { kicker: 'Chapter 05 · A tiny test', title: 'How well do you know us?', subtitle: 'No pressure. The examiner is cute, but extremely dramatic.' },
  { kicker: 'Chapter 06 · Birthday ceremony', title: 'Make a wish, Neha.', subtitle: 'Twenty-one candles. One beautiful wish. Infinite possibilities.' },
  { kicker: 'Chapter 07 · No jokes for a moment', title: 'A letter from my heart.', subtitle: 'Some things deserve more than a punchline.' },
  { kicker: 'Chapter 08 · The last little surprise', title: 'The best parts are still ahead.', subtitle: 'A promise, a few future plans, and a universe I hope we keep building.' },
];
const quiz = [
  {
    q: 'What is the legendary food review?',
    opts: ['APPLE IS REALLY TASTY, IS IT ?', 'Pineapple is suspicious.', 'Chocolate is a vegetable.', 'No snacks, only vibes.'],
    answer: 0,
    right: 'THE APPLE CASE IS SOLVED! 🍎',
    rightDesc: 'Verdict: 100% tasty and completely impossible to forget.',
    wrong: 'The Don’s investigation team requests a retake! 😭',
    wrongDesc: 'The classified files say you had a much more iconic quote about an apple!'
  },
  {
    q: 'What is Chota Don’s official food status?',
    opts: ['Occasional snacker', 'Foodie royalty', 'Professional salad critic', 'Snack-free citizen'],
    answer: 1,
    right: 'THE CROWN BELONGS TO THE FOOD QUEEN! 🍕',
    rightDesc: 'Official royal decree granted! Food royalty status confirmed across the universe.',
    wrong: 'The kitchen would like to discuss this answer! 😂',
    wrongDesc: 'Come on, Chota Don, your foodie throne is undeniable!'
  },
  {
    q: 'Which set best describes our birthday girl?',
    opts: ['Cute, calm, never dramatic', 'Cute, angry bird, foodie, overthinker', 'Mysterious, silent, never hungry', 'Only serious business'],
    answer: 1,
    right: 'A PERFECTLY ACCURATE DON DOSSIER! 💗',
    rightDesc: 'Cutest storm warning, overthinking CEO, and my absolute favourite person.',
    wrong: 'The classified file says otherwise, Chota Don! 😤',
    wrongDesc: 'Think again... who has 100 tabs open and is dangerously adorable?'
  },
];

export default function BirthdayExperience() {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [wrongError, setWrongError] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizFeedbackOpen, setQuizFeedbackOpen] = useState(false);
  const [isCorrectChoice, setIsCorrectChoice] = useState(false);
  const [quizNudge, setQuizNudge] = useState(false);
  const [candles, setCandles] = useState(21);
  const [wishModalOpen, setWishModalOpen] = useState(false);
  const [bigCandleMode, setBigCandleMode] = useState(false);
  const [bigCandleBlown, setBigCandleBlown] = useState(false);
  const [wishText, setWishText] = useState('');
  const [wishFulfilled, setWishFulfilled] = useState(false);
  const [celebratingBalloons, setCelebratingBalloons] = useState(false);
  const [balloonSecondsLeft, setBalloonSecondsLeft] = useState(20);
  const balloonIntervalRef = useRef<number | null>(null);
  const [canGoToNextPage, setCanGoToNextPage] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [stampOpen, setStampOpen] = useState(false);
  const [finalNoteOpen, setFinalNoteOpen] = useState(false);
  const [photoFlipped, setPhotoFlipped] = useState(false);
  const [beautyModalOpen, setBeautyModalOpen] = useState(false);
  const [countdown, setCountdown] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const current = chapters[chapter];
  const progress = ((chapter + 1) / chapters.length) * 100;
  const stars = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const confettiList = useMemo(() => {
    const colors = ['#e99abd', '#ffd166', '#a881d4', '#ff758f', '#ffffff', '#ff9ebb', '#b95e87'];
    const symbols = ['✦', '✧', '♡', '★', '🍕', '✨', '🎂'];
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: Math.floor((i * 2.1 + 1) % 97),
      delay: (i % 16) * 0.12,
      duration: 2.2 + (i % 6) * 0.35,
      color: colors[i % colors.length],
      rotate: (i * 37) % 360,
      size: 7 + (i % 6) * 2,
      type: i % 3 === 0 ? 'symbol' : i % 2 === 0 ? 'ribbon' : 'dot',
      symbol: symbols[i % symbols.length],
    }));
  }, []);

  const balloonsList = useMemo(() => {
    const colors = [
      '#ff758f', '#ffb3c6', '#ffd166', '#a881d4', '#cdb4db', 
      '#f4a261', '#e76f51', '#e99abd', '#b95e87', '#9381ff'
    ];
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: Math.floor((i * 3.1 + 1) % 96),
      delay: (i % 20) * 0.4,
      duration: 5.5 + (i % 7) * 0.7,
      color: colors[i % colors.length],
      size: 40 + (i % 5) * 8,
      sway: ((i % 2 === 0 ? 1 : -1) * (14 + (i % 4) * 8)) + 'px',
    }));
  }, []);

  const celebrationEmojisList = useMemo(() => {
    const emojis = ['🎈', '🎂', '🍰', '🍕', '🥳', '🎉', '💖', '👑', '✨', '🧁', '🎁', '🌸', '🥂', '♡', '🍩', '🍫'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: Math.floor((i * 2.5 + 1) % 96),
      delay: (i % 22) * 0.42,
      duration: 5.0 + (i % 6) * 0.7,
      size: 24 + (i % 5) * 6,
      rotate: (i * 29) % 360,
    }));
  }, []);

  /* ---- safe play helper (handles mobile autoplay & abort gracefully) ---- */
  const safePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    setMusicError(false);
    const p = a.play();
    if (p !== undefined) {
      p.then(() => {
        setMusicPlaying(true);
      }).catch((err: unknown) => {
        const error = err as { name?: string } | null;
        if (error?.name !== 'AbortError') {
          setMusicError(true);
        }
        setMusicPlaying(false);
      });
    }
  };

  /* ---- countdown timer ---- */
  useEffect(() => {
    const update = () => {
      const target = new Date(2026, 10, 25, 0, 0, 0).getTime();
      const diff = target - Date.now();
      if (diff <= 0) { setCountdown('It is your birthday season, Neha. ♡'); return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      setCountdown(`${days} days · ${hours} hours · ${minutes} minutes`);
    };
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, []);

  /* ---- cleanup on unmount ---- */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (balloonIntervalRef.current) {
        clearInterval(balloonIntervalRef.current);
      }
    };
  }, []);

  const goNext = () => setChapter((c) => Math.min(c + 1, chapters.length - 1));
  const previous = () => setChapter((c) => Math.max(c - 1, 0));

  const handleQuizAnswer = (i: number) => {
    setQuizChoice(i);
    setQuizNudge(false);
    const isRight = i === quiz[quizIndex].answer;
    setIsCorrectChoice(isRight);
    if (isRight) {
      setQuizScore((s) => s + 1);
    }
    setQuizFeedbackOpen(true);
  };

  const nextQuizQuestion = () => {
    setQuizFeedbackOpen(false);
    setQuizChoice(null);
    setQuizNudge(false);
    setQuizIndex((idx) => idx + 1);
  };

  const retryQuizQuestion = () => {
    setQuizFeedbackOpen(false);
    setQuizChoice(null);
  };

  const startMakeWish = () => {
    if (wishFulfilled) return; // Only one wish can be written
    setBigCandleMode(true);
    setBigCandleBlown(false);
    setCandles(0);
    setWishModalOpen(true);
  };

  const blowCandleAndFulfill = () => {
    setWishModalOpen(false);
    setBigCandleBlown(true);
    setWishFulfilled(true);
    setCelebratingBalloons(true);
    setCanGoToNextPage(false);
    setBalloonSecondsLeft(20);

    // Balloons and emojis appear for 20 seconds, then the Move to Next Page button appears!
    if (balloonIntervalRef.current) clearInterval(balloonIntervalRef.current);
    const interval = window.setInterval(() => {
      setBalloonSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCelebratingBalloons(false);
          setCanGoToNextPage(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    balloonIntervalRef.current = interval;
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isValid = await verifyPasswordAction(passwordInput);
      if (isValid) {
        setWrongError(false);
        setUnlocked(true);
      } else {
        setWrongError(true);
      }
    } catch {
      setWrongError(true);
    }
  };

  /* ---- enter universe: navigate to Chapter 1 + start soundtrack ---- */
  const enterUniverse = () => {
    goNext();
    safePlay();
  };

  /* ---- toggle play/pause ---- */
  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (!a.paused) {
      a.pause();
      setMusicPlaying(false);
    } else {
      safePlay();
    }
  };

  /* ---- toggle mute ---- */
  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    const nextMuted = !a.muted;
    a.muted = nextMuted;
    setMuted(nextMuted);
  };

  if (!unlocked) {
    return (
      <main className="gate-shell">
        <div className="gate-stars" aria-hidden="true" />
        <div className="gate-card">
          <div className="gate-icon"><Heart fill="currentColor" size={28} /></div>
          <p className="eyebrow"><Sparkles size={13} /> A PRIVATE LITTLE UNIVERSE</p>
          <h1>For <em>Neha</em>,<br />and only Neha.</h1>
          <p className="gate-copy">A tiny birthday surprise is waiting behind this door. Chota Don, do you know the secret?</p>
          <form onSubmit={handleUnlock} className="password-form">
            <label htmlFor="gate-password">Your secret password</label>
            <input
              id="gate-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter the secret…"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setWrongError(false);
              }}
              required
              autoFocus
            />
            <button type="submit">
              <LockKeyhole size={16} /> Unlock my surprise <Sparkles size={16} />
            </button>
          </form>
          {wrongError && (
            <p className="form-error">Hmm. That's not it, Chota Don. Try again. 💗</p>
          )}
          <p className="gate-foot">Made with an unreasonable amount of love <span>♡</span></p>
        </div>
      </main>
    );
  }

  return (
    <main className="experience-shell">
      {/* Single shared audio instance for all chapters */}
      <audio
        ref={audioRef}
        src="/music/dilruba-dilnasheen.mp3"
        loop
        preload="auto"
        playsInline
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
        onVolumeChange={() => {
          if (audioRef.current) setMuted(audioRef.current.muted);
        }}
        onError={() => {
          setMusicError(true);
          setMusicPlaying(false);
        }}
      />

      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />

      <header className="topbar">
        <a className="wordmark" href="#top" onClick={(e) => { e.preventDefault(); setChapter(0); }}>
          <span className="wordmark-mark">N.</span>
          <span>NEHA&apos;S<span className="wordmark-dot"> BIRTHDAY</span></span>
        </a>
        <div className="top-actions">
          <button
            className="icon-button lock-btn"
            onClick={() => {
              setUnlocked(false);
              setPasswordInput('');
              setWrongError(false);
            }}
            title="Lock & return to secret password screen"
            aria-label="Lock & return to secret password screen"
          >
            <LockKeyhole size={16} />
          </button>
          <button
            className="icon-button"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute music' : 'Mute music'}
            title={muted ? 'Unmute music' : 'Mute music'}
          >
            {muted ? <VolumeX size={17}/> : <Volume2 size={17}/>}
          </button>
        </div>
      </header>

      <section className="story-wrap" id="top">
        <div className="progress-row">
          <span>YOUR LITTLE STORY</span>
          <span>{String(chapter + 1).padStart(2, '0')} <i>/</i> {String(chapters.length).padStart(2, '0')}</span>
        </div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>

        <section className={`chapter chapter-${chapter}`} key={chapter} aria-live="polite">
          <div className="chapter-copy">
            <p className="eyebrow"><Sparkles size={13}/>{current.kicker}</p>
            <h1>{chapter === 0 ? <>Somewhere in<br/><em>this universe…</em></> : chapter === 1 ? <>Welcome,<br/><em>Chota Don.</em></> : current.title}</h1>
            <p className="chapter-subtitle">{current.subtitle}</p>
            {chapter === 0 && <p className="small-note">A little universe has been created for someone very special.</p>}
            {chapter === 1 && (
              <div className="chapter-cards-row">
                <div className="countdown-card">
                  <span>COUNTDOWN TO 25 NOVEMBER</span>
                  <strong>{countdown}</strong>
                  <small>Her 21st birthday is almost here ✨</small>
                </div>
                <div className="rules-card">
                  <p>THE BIRTHDAY RULES</p>
                  <ul>
                    <li>No overthinking today.</li>
                    <li>Unlimited cake. Obviously.</li>
                    <li>Being cute is mandatory.</li>
                    <li>Chota Don is always right. (Under review.)</li>
                  </ul>
                </div>
              </div>
            )}
            {chapter === 2 && (
              <div className="timeline-card">
                <div><b>05 MAY 2026</b><span>The beginning of us</span></div>
                <div><b>05 NOV 2026</b><span>Six-month milestone ♡</span></div>
                <div><b>25 NOV 2026</b><span>Her 21st birthday ✨</span></div>
              </div>
            )}
            {chapter === 3 && (
              <div className="memory-showcase-wrap">
                <div
                  className={`memory-polaroid-card ${photoFlipped ? 'is-flipped' : ''}`}
                  onClick={() => {
                    setPhotoFlipped((f) => !f);
                    setBeautyModalOpen(true);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Memory photo of Neha - tap to turn and read secret message"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setPhotoFlipped((f) => !f);
                      setBeautyModalOpen(true);
                    }
                  }}
                >
                  <div className="polaroid-inner">
                    {/* Front Face */}
                    <div className="polaroid-face polaroid-front">
                      <div className="polaroid-pin-accent" aria-hidden="true" />
                      <div className="polaroid-image-frame">
                        <img
                          src="/images/memories/neha.jpeg"
                          alt="Beautiful Neha"
                          loading="eager"
                        />
                        <span className="polaroid-tap-hint">
                          <Sparkles size={13} /> Tap to turn
                        </span>
                      </div>
                      <div className="polaroid-caption">
                        <span>The prettiest smile in my world ♡</span>
                        <small>Forever my favourite view ✨</small>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className="polaroid-face polaroid-back">
                      <div className="polaroid-back-texture">
                        <div className="polaroid-stamp-seal">
                          <Heart fill="#e65a88" color="#e65a88" size={17} />
                          <span>OFFICIAL LOVE SEAL</span>
                        </div>
                        <p className="polaroid-back-eyebrow">CONFIDENTIAL NOTE</p>
                        <h4 className="polaroid-back-title">Dear Neha,</h4>
                        <p className="polaroid-back-text">
                          In case nobody told you today: you are breathtakingly, ridiculously beautiful. That smile of yours turns any ordinary day into something magical.
                        </p>
                        <div className="polaroid-back-sign">
                          <span>With all my love ♡</span>
                          <small>25 · 11 · 2026</small>
                        </div>
                        <span className="polaroid-flip-back-hint">
                          <RotateCcw size={12} /> Tap to flip back
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Message Button Box */}
                <div className="memory-action-box">
                  <button
                    className="beauty-message-btn pulse-glow"
                    onClick={() => {
                      setPhotoFlipped((f) => !f);
                      setBeautyModalOpen(true);
                    }}
                  >
                    <Sparkles size={16} /> {!photoFlipped ? 'Tap to turn photo & see secret note' : 'Turn photo back & read note again'} <Heart size={15} fill="currentColor" />
                  </button>
                  <p className="memory-hint-text">
                    <span>💡 Tap the picture above or the box to reveal how stunning you are ♡</span>
                  </p>
                </div>
              </div>
            )}
            {chapter === 4 && (
              <div className="dossier">
                <div className="dossier-head"><span>CLASSIFIED · 001</span><Crown size={20}/></div>
                <h3>SUBJECT: NEHA SINGH</h3>
                <p>ALIAS: CHOTA DON 😈</p>
                <div className="award-grid">
                  <span>😤 <b>Angry Bird</b><small>Cutest storm warning</small></span>
                  <span>🍕 <b>Foodie Queen</b><small>Snack operations head</small></span>
                  <span>🧠 <b>Overthinking CEO</b><small>100 tabs open, always</small></span>
                  <span>🥹 <b>Certified Cutie</b><small>Dangerously adorable</small></span>
                </div>
                <div className="apple-case">
                  <span>🍎 THE APPLE INVESTIGATION</span>
                  <strong>“APPLE IS REALLY TASTY, IS IT ?”</strong>
                  <small>Case status: LEGENDARY. Evidence: impossible to forget.</small>
                </div>
              </div>
            )}
            {chapter === 5 && (
              <div className={`quiz-card ${quizNudge ? 'quiz-shake' : ''}`}>
                <div className="quiz-progress-pills">
                  {quiz.map((_, qIdx) => (
                    <div
                      key={qIdx}
                      className={`quiz-pill ${qIdx === quizIndex ? 'active' : qIdx < quizIndex ? 'done' : ''}`}
                    >
                      <span>Q{qIdx + 1}</span>
                      {qIdx < quizIndex && <CheckCircle2 size={13} />}
                    </div>
                  ))}
                  <span className="quiz-score-badge">Score: {quizScore} / {quiz.length}</span>
                </div>

                <h3>{quizIndex < quiz.length ? quiz[quizIndex].q : 'Official relationship certificate'}</h3>

                {quizIndex < quiz.length ? (
                  <>
                    <div className="quiz-options">
                      {quiz[quizIndex].opts.map((opt, i) => (
                        <button
                          key={opt}
                          className={`quiz-option-btn ${quizChoice === i ? (i === quiz[quizIndex].answer ? 'opt-correct' : 'opt-wrong') : ''}`}
                          onClick={() => handleQuizAnswer(i)}
                        >
                          <span className="opt-marker">{String.fromCharCode(65 + i)}</span>
                          <span className="opt-text">{opt}</span>
                        </button>
                      ))}
                    </div>
                    {quizNudge && (
                      <p className="quiz-nudge-note">
                        <Sparkles size={14} /> Tap one of the answers above to continue, Chota Don! ♡
                      </p>
                    )}
                  </>
                ) : (
                  <div className="quiz-result">
                    <div className="quiz-result-badge"><Award size={36} /></div>
                    <strong>{quizScore}/{quiz.length} Correct Answers</strong>
                    <p className="quiz-result-title">Official Certificate of Knowing Us Best 👑</p>
                    <p className="quiz-result-text">
                      {quizScore === quiz.length
                        ? '100% Perfect! You truly remember every iconic food review, our timeline, and all classified files. You are officially the greatest Chota Don in the cosmos. ❤️'
                        : 'Passed with high honours! Still my absolute favourite human in this whole universe. ❤️'}
                    </p>
                    <div className="quiz-result-buttons">
                      <button className="quiz-replay-btn" onClick={() => { setQuizIndex(0); setQuizScore(0); setQuizChoice(null); }}>
                        <RotateCcw size={14} /> Retake test
                      </button>
                      <button className="quiz-proceed-btn" onClick={goNext}>
                        Light our 21 candles ✨ <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {chapter === 6 && (
              <div className="cake-scene">
                <div className="cake-sparkles">✦　·　✧　·　✦</div>

                {bigCandleMode ? (
                  <div className={`big-candle-stage ${bigCandleBlown ? 'blown' : 'burning'}`}>
                    {!bigCandleBlown ? (
                      <div className="big-candle-flame">
                        <span className="big-flame-glow" />
                        <span className="big-flame-outer" />
                        <span className="big-flame-inner" />
                        <span className="big-flame-sparkle">✦</span>
                      </div>
                    ) : (
                      <div className="big-candle-smoke">
                        <span className="smoke-item s1">✨</span>
                        <span className="smoke-item s2">💨</span>
                        <span className="smoke-item s3">✧</span>
                      </div>
                    )}
                    <div className="big-candle-wick" />
                    <div className="big-candle-stem">
                      <span className="big-candle-badge">21</span>
                    </div>
                  </div>
                ) : (
                  <div className="cake-candles">
                    {Array.from({ length: 21 }, (_, i) => (
                      <button
                        key={i}
                        className={`candle ${i >= candles ? 'out' : ''}`}
                        onClick={() => setCandles((n) => Math.max(0, n - 1))}
                        aria-label={`Blow candle ${i + 1}`}
                        title={`Blow candle ${i + 1}`}
                      >
                        <i />
                      </button>
                    ))}
                  </div>
                )}

                <div className="cake-top">NEHA</div>
                <div className="cake-layer layer-one" />
                <div className="cake-layer layer-two" />
                <div className="cake-plate" />

                <div className="cake-controls-wrap">
                  <p className="cake-instruction">
                    {wishFulfilled
                      ? (celebratingBalloons
                          ? `🎈 CELEBRATING YOUR WISH ACROSS THE UNIVERSE (${balloonSecondsLeft}s) 🎈`
                          : '🌟 YOUR WISH HAS BEEN RECORDED IN THE STARS! 🌟')
                      : bigCandleMode
                      ? 'THE 21ST WISH CANDLE IS LIT! WRITE YOUR WISH & BLOW IT OUT ✨'
                      : (candles > 0
                          ? `Tap candles to blow them out (${candles}/21) · or make one grand wish!`
                          : 'ALL 21 CANDLES BLOWN! MAKE YOUR BIG BIRTHDAY WISH! ✨')}
                  </p>

                  {!wishFulfilled && (
                    <div className="cake-wish-buttons">
                      <button
                        className="make-wish-btn pulse-glow"
                        onClick={startMakeWish}
                      >
                        <Sparkles size={16} /> {!bigCandleMode ? 'Make one wish' : 'Open wish box & blow candle'} <Heart size={15} fill="currentColor" />
                      </button>
                    </div>
                  )}
                </div>

                {wishFulfilled && (
                  <div className="wish-fulfilled-banner">
                    <div className="wish-stars-row">✦　✧　✦　✧　✦</div>
                    <h4>YOUR WISH HAS BEEN RECORDED IN THE STARS ✨</h4>
                    <p className="wish-quote-display">
                      “{wishText.trim() ? wishText.trim() : 'Unlimited happiness, good food, and a million reasons to smile! ♡'}”
                    </p>
                    {celebratingBalloons ? (
                      <div className="wish-celebrating-box">
                        <p className="wish-celebrating-note">
                          🎈 Floating with celebration balloons across the universe...
                        </p>
                        <span className="wish-celebrating-pill">
                          Next page unlocks in {balloonSecondsLeft}s
                        </span>
                      </div>
                    ) : (
                      <p className="wish-blessing-note">
                        It is on its way to you, Chota Don. Happy 21st Birthday! 🎂❤️
                      </p>
                    )}
                  </div>
                )}

                {/* Move to Next Page button appears after 5-6 seconds of balloons! */}
                {canGoToNextPage && (
                  <div className="next-chapter-hero-action">
                    <button className="primary-forward-btn" onClick={goNext}>
                      <span>Move to Next Page · Love Letter</span> <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
            {chapter === 7 && (
              <div className="letter-scene">
                {!letterOpen ? (
                  <button className="envelope" onClick={() => setLetterOpen(true)}>
                    <span className="wax-seal">N</span>
                    <span>OPEN YOUR LETTER</span>
                    <small>sealed with love ♡</small>
                  </button>
                ) : (
                  <article className="letter-paper">
                    <p className="letter-date">25 NOVEMBER 2026</p>
                    <h3>My dearest Neha,</h3>
                    <p>Six months ago, I didn’t know that someone could become such a beautiful part of my everyday life.</p>
                    <p>Somewhere between our conversations, silly moments, your foodie adventures and your legendary Chota Don behaviour, you became someone incredibly special to me.</p>
                    <p>I love your cute side, your angry bird moments, and even the way your mind sometimes turns one little thought into a whole universe.</p>
                    <p>I don’t promise that every day will be perfect. I promise to keep showing up, keep listening, keep laughing with you, and keep making room for beautiful memories together.</p>
                    <p>Today is about celebrating you — the person you are and all the lovely things still ahead of you.</p>
                    <p className="letter-sign">Happy birthday, my favourite person. <Heart size={15} fill="currentColor"/></p>
                    <p className="letter-from">Your favourite troublemaker</p>
                  </article>
                )}
              </div>
            )}
            {chapter === 8 && (
              <div className="final-scene">
                <div className="promise-card">
                  <div className="promise-icon"><Gift size={25}/></div>
                  <p className="eyebrow">A PROMISE FOR WHAT COMES NEXT</p>
                  <h3>Not a perfect future.<br/><em>A future we keep choosing.</em></h3>
                  <p>I promise to keep making memories with you — spontaneous plans, long conversations, new places, favourite food, silly photos and quiet moments that become our favourite stories.</p>
                  <p>More birthdays. More adventures. More reasons to laugh. More little things that are ours.</p>
                  <div className="future-tags">
                    <span>✦ New places</span>
                    <span>♡ More memories</span>
                    <span>☼ Little adventures</span>
                  </div>
                  <button className="gift-button" onClick={() => setGiftOpen(true)}>
                    Unlock one last thing <Gift size={16}/>
                  </button>
                </div>
                <div className="final-signoff">
                  <span>HAPPY 21ST BIRTHDAY</span>
                  <h2>Forever my<br/><em>Chota Don.</em></h2>
                  <p>Made with love, just for you. ♡</p>
                </div>
              </div>
            )}

            <div className="chapter-controls">
              {chapter > 0 ? (
                <button className="back-button" onClick={previous}><ArrowLeft size={15}/> Previous</button>
              ) : (
                <span/>
              )}
              {chapter < chapters.length - 1 ? (
                chapter === 5 && quizIndex < quiz.length ? (
                  <button
                    className="next-button"
                    onClick={() => {
                      if (quizChoice === null) {
                        setQuizNudge(true);
                      } else {
                        nextQuizQuestion();
                      }
                    }}
                  >
                    Question {quizIndex + 1} of {quiz.length} <ArrowRight size={16}/>
                  </button>
                ) : (
                  <button
                    className="next-button"
                    onClick={
                      chapter === 0
                        ? enterUniverse
                        : chapter === 6 && !canGoToNextPage && !wishFulfilled
                        ? startMakeWish
                        : goNext
                    }
                  >
                    {chapter === 0
                      ? 'Enter your little universe'
                      : chapter === 5
                      ? 'Continue to Birthday Cake ✨'
                      : chapter === 6
                      ? (canGoToNextPage ? 'Continue to Love Letter ♡' : wishFulfilled ? `Celebrating wish... 🎈 (${balloonSecondsLeft}s)` : 'Make your wish to continue ✨')
                      : 'Continue our story'} <ArrowRight size={16}/>
                  </button>
                )
              ) : (
                <button
                  className="next-button"
                  onClick={() => {
                    setChapter(0);
                    setQuizIndex(0);
                    setQuizScore(0);
                    setQuizChoice(null);
                    setCandles(21);
                    setWishFulfilled(false);
                    setBigCandleMode(false);
                    setBigCandleBlown(false);
                    setWishText('');
                    setCanGoToNextPage(false);
                    setLetterOpen(false);
                    setGiftOpen(false);
                    setStampOpen(false);
                    setFinalNoteOpen(false);
                    setPhotoFlipped(false);
                    setBeautyModalOpen(false);
                    if (balloonIntervalRef.current) clearInterval(balloonIntervalRef.current);
                  }}
                >
                  Replay our story <Heart size={15}/>
                </button>
              )}
            </div>
          </div>

          <div className="chapter-art" aria-hidden="true">
            <div className="art-halo"/>
            <div className="art-orbit orbit-a"/>
            <div className="art-orbit orbit-b"/>
            <div className="hero-heart"><Heart fill="currentColor" strokeWidth={0}/></div>
            <div className="art-spark spark-a">✦</div>
            <div className="art-spark spark-b">✧</div>
            <div className="art-spark spark-c">·</div>
            <div className="art-caption">
              {chapter === 4 ? 'THE DON DOSSIER' : chapter === 6 ? '21 WISHES' : chapter === 8 ? 'ALWAYS & A LITTLE MORE' : 'A LITTLE UNIVERSE, JUST FOR YOU'}
            </div>
          </div>
        </section>

        <footer className="story-footer">
          <span>BUILT WITH ♡ FOR NEHA</span>
          <span>25 · 11 · 2026</span>
        </footer>
      </section>

      <div className="floating-hearts" aria-hidden="true">
        {stars.map((s) => (
          <span
            key={s}
            style={{
              left: `${(s * 37) % 100}%`,
              animationDelay: `${(s % 9) * -1.7}s`,
              animationDuration: `${13 + (s % 8)}s`
            }}
          >
            {s % 3 === 0 ? '♡' : s % 3 === 1 ? '✦' : '·'}
          </span>
        ))}
      </div>

      {/* Floating music control (bottom-right) */}
      <div className="music-fab-wrap" aria-label="Music controls">
        <button
          className="music-fab music-fab-mute"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute music' : 'Mute music'}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          className={`music-fab music-fab-main${musicPlaying ? ' is-playing' : ''}${musicError ? ' has-error' : ''}`}
          onClick={toggleMusic}
          aria-label={musicPlaying ? 'Pause music' : 'Play music'}
          title={musicError ? 'Playback error — tap to retry' : musicPlaying ? 'Pause' : 'Play'}
        >
          <span className={`vinyl-disc${musicPlaying ? ' spinning' : ''}`}>
            <span className="vinyl-label">♡</span>
          </span>
          <span className="fab-icon-overlay">
            {musicPlaying ? <Pause size={15} /> : <Play size={15} />}
          </span>
        </button>
      </div>

      {/* Celebration animation & centered promise modal */}
      {giftOpen && (
        <div className="celebration-overlay" onClick={() => setGiftOpen(false)} role="dialog" aria-modal="true" aria-labelledby="celebration-title">
          <div className="confetti-container" aria-hidden="true">
            {confettiList.map((p) => (
              <span
                key={p.id}
                className={`confetti-piece confetti-${p.type}`}
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  backgroundColor: p.color,
                  color: p.color,
                  transform: `rotate(${p.rotate}deg)`,
                  width: `${p.size}px`,
                  height: p.type === 'ribbon' ? `${p.size * 2.5}px` : `${p.size}px`,
                }}
              >
                {p.type === 'symbol' ? p.symbol : null}
              </span>
            ))}
          </div>

          <div className="celebration-modal" onClick={(e) => e.stopPropagation()}>
            <button className="celebration-close" onClick={() => setGiftOpen(false)} aria-label="Close celebration popup">
              <X size={20} />
            </button>

            <div className="celebration-badge" aria-hidden="true">
              <PartyPopper size={32} />
            </div>

            <p className="eyebrow"><Sparkles size={13} /> A SPECIAL PROMISE · CHAPTER 08</p>
            <h2 id="celebration-title">Our Next <em>Chapter</em> ✨</h2>

            <div className="celebration-promise-box">
              <p className="celebration-main-text">
                “One day soon: a date planned just for us. You choose the food, Chota Don. I’ll handle the rest. 🍕❤️”
              </p>
              <p className="celebration-subtext">
                No overthinking today or tomorrow. Unlimited laughs, warm memories, and a universe we keep choosing together.
              </p>
            </div>

            <div className="celebration-tags">
              <span>✦ The Best Is Ahead</span>
              <span>♡ Forever My Chota Don</span>
              <span>🎂 Happy 21st</span>
            </div>

            <button
              className="celebration-ack-btn"
              onClick={() => {
                setGiftOpen(false);
                setStampOpen(true);
              }}
            >
              Keep this promise forever <Heart size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      {/* Stamp Pop: Promise for forever & You are mine for forever */}
      {stampOpen && (
        <div className="celebration-overlay" onClick={() => setStampOpen(false)} role="dialog" aria-modal="true" aria-labelledby="stamp-modal-title">
          <div className="confetti-container" aria-hidden="true">
            {confettiList.map((p) => (
              <span
                key={p.id}
                className={`confetti-piece confetti-${p.type}`}
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  backgroundColor: p.color,
                  color: p.color,
                  transform: `rotate(${p.rotate}deg)`,
                  width: `${p.size}px`,
                  height: p.type === 'ribbon' ? `${p.size * 2.5}px` : `${p.size}px`,
                }}
              >
                {p.type === 'symbol' ? p.symbol : null}
              </span>
            ))}
          </div>

          <div className="stamp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="celebration-close" onClick={() => setStampOpen(false)} aria-label="Close stamp popup">
              <X size={20} />
            </button>

            {/* Vintage Stamp Wrapper */}
            <div className="vintage-stamp-card">
              <div className="stamp-inner-border">
                {/* Header bar */}
                <div className="stamp-header-row">
                  <span className="stamp-airmail">POSTAGE · SPECIAL DELIVERY</span>
                  <span className="stamp-denomination">21 <span>♡</span></span>
                </div>

                {/* Circular postmark stamp */}
                <div className="stamp-postmark-badge" aria-hidden="true">
                  <div className="stamp-postmark-circle">
                    <span className="postmark-text-top">OFFICIAL LOVE SEAL</span>
                    <span className="postmark-date">25 · 11 · 2026</span>
                    <span className="postmark-text-bot">FOREVER & ALWAYS</span>
                  </div>
                  <div className="stamp-wavy-lines">
                    <span /><span /><span />
                  </div>
                </div>

                {/* Centerpiece content */}
                <div className="stamp-core-content">
                  <div className="stamp-seal-emblem">
                    <Award size={32} />
                  </div>

                  <p className="stamp-eyebrow">✦ AN ETERNAL REGISTRATION ✦</p>

                  <h2 id="stamp-modal-title" className="stamp-headline-forever">
                    PROMISE FOR FOREVER ♡
                  </h2>

                  <div className="stamp-subheadline-box">
                    <p className="stamp-headline-mine">
                      YOU ARE MINE FOR FOREVER 💍✨
                    </p>
                  </div>

                  <p className="stamp-tender-quote">
                    “Signed in laughter, sealed in love, and delivered directly to my favourite person.”
                  </p>

                  {/* Stamp Details Table */}
                  <div className="stamp-specs">
                    <div className="stamp-spec-item">
                      <span className="spec-label">Recipient:</span>
                      <span className="spec-val">Neha (Chota Don)</span>
                    </div>
                    <div className="stamp-spec-item">
                      <span className="spec-label">Validity:</span>
                      <span className="spec-val">Eternal · Non-expiring</span>
                    </div>
                    <div className="stamp-spec-item">
                      <span className="spec-label">Status:</span>
                      <span className="spec-val">Officially Sealed ♡</span>
                    </div>
                  </div>
                </div>

                <div className="stamp-footer-row">
                  <span>UNIVERSE REGISTRY № 25112026</span>
                  <span>100% PURE LOVE</span>
                </div>
              </div>
            </div>

            {/* Button to proceed to the next pop */}
            <button
              className="celebration-ack-btn stamp-forward-btn"
              onClick={() => {
                setStampOpen(false);
                setFinalNoteOpen(true);
              }}
            >
              <span>Accept & Seal in My Heart ♡</span> <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}

      {/* Final Love Pop: I think you enjoyed a lot & Happy Birthday again love you so much */}
      {finalNoteOpen && (
        <div className="celebration-overlay" onClick={() => setFinalNoteOpen(false)} role="dialog" aria-modal="true" aria-labelledby="final-note-title">
          <div className="confetti-container" aria-hidden="true">
            {confettiList.map((p) => (
              <span
                key={p.id}
                className={`confetti-piece confetti-${p.type}`}
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  backgroundColor: p.color,
                  color: p.color,
                  transform: `rotate(${p.rotate}deg)`,
                  width: `${p.size}px`,
                  height: p.type === 'ribbon' ? `${p.size * 2.5}px` : `${p.size}px`,
                }}
              >
                {p.type === 'symbol' ? p.symbol : null}
              </span>
            ))}
          </div>

          <div className="final-love-modal" onClick={(e) => e.stopPropagation()}>
            <button className="celebration-close" onClick={() => setFinalNoteOpen(false)} aria-label="Close message popup">
              <X size={20} />
            </button>

            <div className="final-love-icon-bubble" aria-hidden="true">
              <Heart fill="#e65a88" color="#e65a88" size={36} />
              <Sparkles size={20} className="sparkle-float-icon" />
            </div>

            <p className="eyebrow"><Sparkles size={13} /> FROM MY HEART TO YOURS</p>

            <h2 id="final-note-title" className="final-note-main-heading">
              I think you enjoyed a lot! 🥰
            </h2>

            <div className="final-love-callout">
              <h3>Happy Birthday again, Neha! 🎂✨</h3>
              <p className="final-love-proclamation">
                LOVE YOU SO MUCH! <span>♡</span>
              </p>
            </div>

            <p className="final-note-narrative">
              Seeing your smile and making you laugh is the best feeling in the whole world.
              I hope this little birthday universe reminded you of just how much you mean to me,
              how special you are, and how excited I am for all the memories still waiting for us.
            </p>

            <div className="final-note-tags">
              <span>💖 Forever My Chota Don</span>
              <span>🍕 Unlimited Dates Ahead</span>
              <span>👑 The Prettiest 21-Year-Old</span>
            </div>

            <div className="final-note-actions">
              <button
                className="celebration-ack-btn"
                onClick={() => {
                  setFinalNoteOpen(false);
                  setChapter(0);
                  setQuizIndex(0);
                  setQuizScore(0);
                  setQuizChoice(null);
                  setCandles(21);
                  setWishFulfilled(false);
                  setBigCandleMode(false);
                  setBigCandleBlown(false);
                  setWishText('');
                  setCanGoToNextPage(false);
                  setLetterOpen(false);
                  setPhotoFlipped(false);
                  setBeautyModalOpen(false);
                  if (balloonIntervalRef.current) clearInterval(balloonIntervalRef.current);
                }}
              >
                <span>Replay our little universe from Chapter 0 ↺</span>
              </button>
              <button
                className="final-love-soft-btn"
                onClick={() => setFinalNoteOpen(false)}
              >
                I love you too ♡ Keep this moment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter 03: Beauty Message Popup Modal */}
      {beautyModalOpen && (
        <div className="celebration-overlay" onClick={() => setBeautyModalOpen(false)} role="dialog" aria-modal="true" aria-labelledby="beauty-modal-title">
          <div className="confetti-container" aria-hidden="true">
            {confettiList.slice(0, 32).map((p) => (
              <span
                key={p.id}
                className={`confetti-piece confetti-${p.type}`}
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  backgroundColor: p.color,
                  color: p.color,
                  transform: `rotate(${p.rotate}deg)`,
                  width: `${p.size}px`,
                  height: p.type === 'ribbon' ? `${p.size * 2.5}px` : `${p.size}px`,
                }}
              >
                {p.type === 'symbol' ? p.symbol : null}
              </span>
            ))}
          </div>

          <div className="beauty-modal" onClick={(e) => e.stopPropagation()}>
            <button className="celebration-close" onClick={() => setBeautyModalOpen(false)} aria-label="Close message popup">
              <X size={20} />
            </button>

            <div className="beauty-icon-bubble" aria-hidden="true">
              <Heart fill="#e65a88" color="#e65a88" size={34} />
              <Sparkles size={20} className="sparkle-float-icon" />
            </div>

            <p className="eyebrow"><Sparkles size={13} /> A LITTLE CONFIDENTIAL TRUTH</p>

            <h2 id="beauty-modal-title" className="beauty-modal-heading">
              Just Look At How <em>Beautiful</em> You Are ✨
            </h2>

            <div className="beauty-quote-callout">
              <p className="beauty-quote-main">
                “Some people look pretty in photos. You make the photo look like a masterpiece.”
              </p>
            </div>

            <p className="beauty-modal-narrative">
              You don’t even need to try, Neha. That effortless grace, the spark in your eyes, and the warmth of your smile... you are breathtakingly, undeniably gorgeous.
            </p>
            <p className="beauty-modal-subnarrative">
              Inside and out, you are the most stunning girl in the universe — and forever my absolute favourite person to look at. 💖
            </p>

            <div className="beauty-tags">
              <span>👑 Naturally Stunning</span>
              <span>✨ Prettiest Smile</span>
              <span>♡ Dangerously Cute</span>
            </div>

            <button
              className="celebration-ack-btn"
              onClick={() => setBeautyModalOpen(false)}
            >
              <span>Aww, thank you! ♡ (Keep smiling)</span> <Heart size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      {/* Quiz Victory / Feedback Modal */}
      {quizFeedbackOpen && chapter === 5 && quizIndex < quiz.length && (
        <div className="victory-overlay" onClick={() => setQuizFeedbackOpen(false)} role="dialog" aria-modal="true" aria-labelledby="victory-title">
          <div className="confetti-container" aria-hidden="true">
            {confettiList.slice(0, isCorrectChoice ? 42 : 12).map((p) => (
              <span
                key={p.id}
                className={`confetti-piece confetti-${p.type}`}
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  backgroundColor: p.color,
                  color: p.color,
                  transform: `rotate(${p.rotate}deg)`,
                  width: `${p.size}px`,
                  height: p.type === 'ribbon' ? `${p.size * 2.5}px` : `${p.size}px`,
                }}
              >
                {p.type === 'symbol' ? p.symbol : null}
              </span>
            ))}
          </div>

          <div className="victory-modal" onClick={(e) => e.stopPropagation()}>
            <button className="celebration-close" onClick={() => setQuizFeedbackOpen(false)} aria-label="Close victory popup">
              <X size={18} />
            </button>

            <div className={`victory-badge ${isCorrectChoice ? 'badge-success' : 'badge-retry'}`} aria-hidden="true">
              {isCorrectChoice ? <CheckCircle2 size={40} /> : <RotateCcw size={32} />}
            </div>

            <p className="eyebrow">
              <Sparkles size={13} /> {isCorrectChoice ? 'VICTORY! YOU GOT IT RIGHT!' : 'OOPS! ALMOST, CHOTA DON!'}
            </p>

            <h2 id="victory-title">{isCorrectChoice ? 'Spot On, Food Queen! 👑✨' : 'Nice Try, Troublemaker! 😂'}</h2>

            <div className="victory-message-box">
              <p className="victory-main-text">
                {isCorrectChoice ? quiz[quizIndex].right : quiz[quizIndex].wrong}
              </p>
              <p className="victory-subtext">
                {isCorrectChoice ? quiz[quizIndex].rightDesc : quiz[quizIndex].wrongDesc}
              </p>
            </div>

            <div className="victory-actions">
              {isCorrectChoice ? (
                <button className="victory-next-btn" onClick={nextQuizQuestion}>
                  {quizIndex + 1 < quiz.length ? (
                    <>Next Question ({quizIndex + 2}/{quiz.length}) <ArrowRight size={16} /></>
                  ) : (
                    <>See My Final Certificate 🏆 <ArrowRight size={16} /></>
                  )}
                </button>
              ) : (
                <div className="victory-split-buttons">
                  <button className="victory-retry-btn" onClick={retryQuizQuestion}>
                    <RotateCcw size={15} /> Try again ♡
                  </button>
                  <button className="victory-skip-btn" onClick={nextQuizQuestion}>
                    Skip to Next <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chapter 06: Full-page celebration balloons & emojis (Active for 5-6 sec only) */}
      {celebratingBalloons && chapter === 6 && (
        <div className="full-page-celebration" aria-hidden="true">
          <div className="balloons-layer">
            {balloonsList.map((b) => (
              <div
                key={b.id}
                className="floating-balloon"
                style={{
                  left: `${b.left}%`,
                  animationDelay: `${b.delay}s`,
                  animationDuration: `${b.duration}s`,
                  ['--b-size' as string]: `${b.size}px`,
                  ['--b-color' as string]: b.color,
                  ['--b-sway' as string]: b.sway,
                }}
              >
                <div className="balloon-body" />
                <div className="balloon-string" />
              </div>
            ))}
          </div>

          <div className="emojis-layer">
            {celebrationEmojisList.map((e, idx) => (
              <span
                key={idx}
                className="floating-emoji"
                style={{
                  left: `${e.left}%`,
                  animationDelay: `${e.delay}s`,
                  animationDuration: `${e.duration}s`,
                  fontSize: `${e.size}px`,
                }}
              >
                {e.emoji}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chapter 06: Wish Pop-up Modal */}
      {wishModalOpen && (
        <div className="wish-overlay" onClick={() => setWishModalOpen(false)} role="dialog" aria-modal="true" aria-labelledby="wish-title">
          <div className="wish-modal" onClick={(e) => e.stopPropagation()}>
            <button className="celebration-close" onClick={() => setWishModalOpen(false)} aria-label="Close wish modal">
              <X size={18} />
            </button>

            <div className="wish-badge" aria-hidden="true">
              <Sparkles size={34} />
            </div>

            <p className="eyebrow"><Sparkles size={13} /> CHAPTER 06 · SECRET BIRTHDAY WISH</p>
            <h2 id="wish-title">Make Your 21st <em>Wish</em>, Neha ✨</h2>
            <p className="wish-modal-sub">
              Close your eyes, think of what your heart desires most, and write it in your universe. The stars are listening.
            </p>

            <div className="wish-box-container">
              <label htmlFor="user-wish-text" className="wish-box-label">WRITE YOUR WISH IN THIS BOX ♡</label>
              <textarea
                id="user-wish-text"
                className="wish-textarea"
                rows={3}
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Write your secret birthday wish here, Chota Don... ♡"
                autoFocus
              />
            </div>

            <div className="wish-chips">
              <button type="button" className="wish-chip" onClick={() => setWishText('Happiness, peace & endless laughter ♡')}>
                ✦ Happiness & laughs
              </button>
              <button type="button" className="wish-chip" onClick={() => setWishText('Lots of trips, adventures & great food 🍕')}>
                ♡ Trips & good food
              </button>
              <button type="button" className="wish-chip" onClick={() => setWishText('May all my dreams come true this year ✨')}>
                ★ All dreams come true
              </button>
            </div>

            <button className="blow-candle-btn" onClick={blowCandleAndFulfill}>
              Blow out the candle & make it come true 🎂✨
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
