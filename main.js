// main.js
const GAS_URL = "https://script.google.com/macros/s/AKfycbyvjKOaKGyZzzkuD5wXZuvBLGVEShg0mFU05f9xDHBQHq5Gslml-MiiihLbV9nzMT5K8A/exec";

const SUBJECTS = [
    { id: "rouki", type: "択一", name: "労働基準法(択一)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?output=csv" },
    { id: "anei", type: "択一", name: "安全衛生法(択一)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=340566361&single=true&output=csv" },
    { id: "kounen", type: "択一", name: "厚生年金保険法(択一)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=485008277&single=true&output=csv" },
    { id: "kenpo", type: "択一", name: "健康保険法(択一)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=1543277211&single=true&output=csv" },
    { id: "rouki_s", type: "選択", name: "労働基準法(選択)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=743168881&single=true&output=csv" },
    { id: "anei_s", type: "選択", name: "安全衛生法(選択)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=2064794651&single=true&output=csv" },
    { id: "kenpo_s", type: "選択", name: "健康保険法(選択)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=1172602320&single=true&output=csv" },
    { id: "kounen_s", type: "選択", name: "厚生年金保険法(選択)", url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9QYS2xT-fFDtl0VuvMW2djCXMtU0CvANyXjvwY7ucm1HKEse511OH1uIn6QoKlQdcWXSWR_DFufgc/pub?gid=268551140&single=true&output=csv" }
];

const CATEGORY_MANUAL_MAP = {
    "労働憲章": "1 労働基準法の基本理念", "使用者の定義": "1 労働基準法の基本理念", "基本理念": "1 労働基準法の基本理念",
    "労働契約の締結": "2 労働契約", "労働契約の終了": "2 労働契約", "労働契約等": "2 労働契約",
    "賃金の支払": "3 賃金、賃金の支払の5原則", "賃金": "3 賃金、賃金の支払の5原則",
    "休憩、休日": "4 労働時間、休憩、休日",
    "変形労働時間": "5 労働時間、変形労働時間制",
    "時間外・休日": "6 時間外・休日労働、割増賃金", "時間外労働": "6 時間外・休日労働、割増賃金",
    "みなし労働時間": "労働時間の計算等",
    "年次有給休暇": "8 年次有給休暇",
    "年少者": "9 年少者、妊産婦等", "妊産婦": "9 年少者、妊産婦等",
    "就業規則": "就業規則、監督等その他",
    "選択式": "雑則等", "雑則": "雑則等",
    "非常時払": "非常時払、休業手当、平均賃金等",
    "労使協定": "11 労使協定",
    "総則": "1 総則等",
    "全産業の安全衛生": "1 安全衛生管理体制等", "委員会": "1 安全衛生管理体制等", "安全衛生管理体制": "1 安全衛生管理体制等",
    "機械等に関する": "2 機械等及び危険・有害物に関する規制", "危険物及び有害物": "2 機械等及び危険・有害物に関する規制", "機械等及び危険": "2 機械等及び危険・有害物に関する規制",
    "危険又は健康障害": "3 労働者の就業管理・健康管理等", "就業に当たっての措置": "3 労働者の就業管理・健康管理等", "作業環境測定": "3 労働者の就業管理・健康管理等", "就業管理": "3 労働者の就業管理・健康管理等", "面接指導": "3 労働者の就業管理・健康管理等",
    "計画の届出": "4 計画の届出等・報告・罰則",
    "全国健康保険協会": "1 保険者・適用事業所等", "健康保険組合": "1 保険者・適用事業所等", "権限の委任": "1 保険者・適用事業所等", "適用事業所": "1 保険者・適用事業所等", "保険者・適用事業所": "1 保険者・適用事業所等",
    "被保険者の範囲": "2 被保険者・被扶養者", "資格の取得": "2 被保険者・被扶養者", "任意継続被保険者": "2 被保険者・被扶養者", "特例退職被保険者": "2 被保険者・被扶養者", "被扶養者": "2 被保険者・被扶養者", "療養担当者": "2 被保険者・被扶養者",
    "事業主による届出": "届出・通知等", "被保険者による届出": "届出・通知等", "通知": "届出・通知等",
    "保険医療機関": "保険医療機関等・療養担当者", "保険医": "保険医療機関等・療養担当者", "訪問看護事業": "保険医療機関等・療養担当者", "診療報酬": "保険医療機関等・療養担当者",
    "報酬・賞与": "3 報酬・標準報酬月額等", "標準報酬": "3 報酬・標準報酬月額等", "定時決定": "3 報酬・標準報酬月額等", "随時改定": "3 報酬・標準報酬月額等", "終了時改定": "3 報酬・標準報酬月額等", "報酬月額の算定": "3 報酬・標準報酬月額等", "標準賞与額": "3 報酬・標準報酬月額等",
    "国庫負担": "費用の負担・保険料等", "費用の負担": "費用の負担・保険料等", "保険料の負担": "費用の負担・保険料等", "保険料の納付": "費用の負担・保険料等", "督促": "費用の負担・保険料等", "滞納処分": "費用の負担・保険料等",
    "療養の給付": "4 保険給付 1 (療養の給付等)", "保険給付 1": "4 保険給付 1 (療養の給付等)", "入院時食事": "4 保険給付 1 (療養の給付等)", "入院時生活": "4 保険給付 1 (療養の給付等)", "保険外併用": "4 保険給付 1 (療養の給付等)", "療養費": "4 保険給付 1 (療養の給付等)", "訪問看護療養費": "4 保険給付 1 (療養の給付等)", "高額療養費": "4 保険給付 1 (療養の給付等)", "高額介護": "4 保険給付 1 (療養の給付等)", "移送費": "4 保険給付 1 (療養の給付等)",
    "傷病手当金": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "出産育児一時金": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "出産手当金": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "埋葬料": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "資格喪失後の給付": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "保険給付 2": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "付加給付": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "給付通則": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "給付制限": "5 保険給付 2 (現金給付・資格喪失後の給付等)",
    "日雇特例": "日雇特例・保健福祉事業", "保健福祉": "日雇特例・保健福祉事業",
    "時効": "時効・不服申立て・雑則等", "不服申立て": "時効・不服申立て・雑則等", "罰則": "時効・不服申立て・雑則等",
    "目的、管掌": "1 総則・適用事業所等",
    "被保険者の資格の得喪": "2 被保険者・被保険者期間等", "被保険者期間": "2 被保険者・被保険者期間等", "届出等": "2 被保険者・被保険者期間等", "原簿": "2 被保険者・被保険者期間等", "被保険者等": "2 被保険者・被保険者期間等",
    "裁定等": "4 給付通則等",
    "老齢厚生年金の支給": "6 老齢厚生年金", "報酬比例部分": "6 老齢厚生年金", "経過的加算額": "6 老齢厚生年金", "加給年金額": "6 老齢厚生年金", "在職老齢": "6 老齢厚生年金", "支給開始年齢": "6 老齢厚生年金", "障害者・長期加入者": "6 老齢厚生年金", "失業等給付との調整": "6 老齢厚生年金", "老齢厚生年金": "6 老齢厚生年金",
    "障害厚生年金": "7 障害厚生年金・障害手当金", "併合認定": "7 障害厚生年金・障害手当金", "障害手当金": "7 障害厚生年金・障害手当金",
    "遺族厚生年金": "8 遺族厚生年金・脱退一時金", "脱退一時金": "8 遺族厚生年金・脱退一時金", "妻に支給する": "8 遺族厚生年金・脱退一時金",
    "離婚等をした場合": "9 年金分割の特例", "3号分割": "9 年金分割の特例"
};

const CATEGORY_SORT_WEIGHTS = {
    "1 労働基準法の基本理念": 10, "2 労働契約": 20, "3 賃金、賃金の支払の5原則": 30, "非常時払、休業手当、平均賃金等": 35,
    "4 労働時間、休憩、休日": 40, "5 労働時間、変形労働時間制": 50, "6 時間外・休日労働、割増賃金": 60,
    "労働時間の計算等": 70, "11 労使協定": 75, "8 年次有給休暇": 80, "9 年少者、妊産婦等": 90,
    "就業規則、監督等その他": 100, "雑則等": 99999,
    "1 総則等": 1, "1 安全衛生管理体制等": 210, "2 機械等及び危険・有害物に関する規制": 220,
    "3 労働者の就業管理・健康管理等": 230, "4 計画の届出等・報告・罰則": 235,
    "目的等": 1, "1 保険者・適用事業所等": 250, "2 被保険者・被扶養者": 260, "3 報酬・標準報酬月額等": 270,
    "届出・通知等": 280, "保険医療機関等・療養担当者": 290, "費用の負担・保険料等": 300,
    "4 保険給付 1 (療養の給付等)": 310, "5 保険給付 2 (現金給付・資格喪失後の給付等)": 320,
    "日雇特例・保健福祉事業": 330, "時効・不服申立て・雑則等": 99999,
    "1 総則・適用事業所等": 1, "2 被保険者・被保険者期間等": 360, "3 標準報酬等": 370,
    "4 給付通則等": 380, "5 費用の負担・保険料等": 390, "6 老齢厚生年金": 400,
    "7 障害厚生年金・障害手当金": 410, "8 遺族厚生年金・脱退一時金": 420,
    "9 年金分割の特例": 430, "10 不服申立て・雑則等": 99999
};

function normalizeCategory(cat) {
    if (!cat) return "分類なし";
    let c = cat.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
    if (c === "過去問" || c === "最新問題") return c;
    if (CATEGORY_MANUAL_MAP[c]) return CATEGORY_MANUAL_MAP[c];
    for (let key in CATEGORY_MANUAL_MAP) {
        if (c.includes(key) || key.includes(c)) {
            if (key.length >= 4 && c.length >= 4) return CATEGORY_MANUAL_MAP[key];
        }
    }
    if (c === "保険料") return "5 費用の負担・保険料等";
    if (c === "3 被保険者") return "2 被保険者・被保険者期間等";
    return c;
}

let allDatabase = [], userHistory = {}, userTimes = {}, playlistQueue = [], currentQuestions = [];
let parsedSubjectsCount = 0, currentPlaylistIndex = 0, currentIndex = 0;
let userApiKey = '', userModel = 'gemini-2.5-flash';
let audioCtx = null, isMuted = false;

let timerInterval = null, timeLeft = 60, currentLimit = 60;
let globalTimerInterval = null, globalTimeLeftSeconds = null, isTimeUp = false;
let napInterval = null, napSecondsLeft = 0;
let pauseSeconds = 0, pauseInterval = null;

let setCorrectCount = 0, cumulativeQuestions = 0, todayMistakes = [];
let eliminatedWords = new Set(), currentWordBank = [], currentAnswers = {}, currentFullText = "";
let lastAnswerWasCorrect = false;

let activeSubjectForTime = null, studyTimerInterval = null, continuousStudyTimeSec = 0;
let sessionTotalTimeSec = 0, sessionTimerInterval = null;

let idleTimeoutWarn = null, idleTimeoutPenalty = null;
let initialGlobalTime = null, eventTriggeredThisSession = false;
let isSuddenDeath = false, isSuddenDeathGameOver = false, isCountdownRelay = false;
let countdownTimeLeft = 0, relayTimerInterval = null;
let isTrapMode = false, isHardcore = false, isSurpriseAttack = false;
let isSenbonKnock = false, isTimeAttack = false, isBonusMode = false;
let eventQuestionsAnswered = 0, eventCorrectCount = 0;

let isAnsweredTakuitsu = false, currentTakuitsuEval = null, pendingFixData = null;
let freeNoteSubjectMap = {}; 
let currentQuestionStartTime = 0;

// 🌟 集中力低下システム用の変数
let isSleepyMode = false;

function startStrategyPlaylist(config) {
    if (allDatabase.length === 0) { alert("データロード中です..."); return; }
    
    let pool = allDatabase;
    if (config.subject && config.subject !== '全科目' && config.subject !== 'ランダム') {
        pool = pool.filter(q => q._subjectName.includes(config.subject));
    }
    
    if (config.target === 'weakness') {
        pool = pool.filter(q => userHistory[q._id] && userHistory[q._id].playCount > 0);
        pool.sort((a, b) => {
            let rA = userHistory[a._id].correctCount / userHistory[a._id].playCount;
            let rB = userHistory[b._id].correctCount / userHistory[b._id].playCount;
            return rA - rB;
        });
    } else if (config.target === 'forget') {
        pool.sort((a, b) => (userHistory[a._id]?.playCount || 0) - (userHistory[b._id]?.playCount || 0));
    } else if (config.target === 'unattempted') {
        pool = pool.filter(q => !userHistory[q._id] || userHistory[q._id].playCount === 0);
    }
    
    if (config.target === 'random' || pool.length === 0) {
        pool.sort(() => Math.random() - 0.5);
    }
    
    let count = parseInt(config.count) || 10;
    let qs = pool.slice(0, count);
    if (qs.length === 0) qs = allDatabase.sort(()=>Math.random()-0.5).slice(0, 10);
    
    playlistQueue = [{
        subjectName: config.subject || "AIセレクト",
        chapterName: `[作戦決行] ${config.target}`,
        type: qs[0]._type,
        questions: qs
    }];
    
    resetGameFlags();
    currentPlaylistIndex = 0;
    cumulativeQuestions = 0; setCorrectCount = 0; todayMistakes = [];
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('main-area').classList.remove('hidden');
    document.getElementById('main-area').classList.add('flex');
    document.getElementById('aside-area').classList.remove('hidden');
    document.getElementById('aside-area').classList.add('flex');
    
    sendKarteLog('strategy_start', { target: config.target, count: count });
    startNextPlaylistSet(true);
}

window.onload = function() {
    try {
        const savedKey = localStorage.getItem('gemini_api_key');
        const savedModel = localStorage.getItem('gemini_api_model');
        const savedMute = localStorage.getItem('sharoushi_is_muted');
        const savedCond = localStorage.getItem('sharoushi_condition');
        
        if(savedKey) { document.getElementById('api-key-input').value = savedKey; userApiKey = savedKey; }
        if(savedModel) { document.getElementById('api-model-input').value = savedModel; userModel = savedModel; }
        if(savedMute !== null) { isMuted = (savedMute === 'true'); }
        if(savedCond) { document.getElementById('condition-select').value = savedCond; }
        updateSoundButtons();
        
        document.getElementById('condition-select').addEventListener('change', function(e) {
            localStorage.setItem('sharoushi_condition', e.target.value);
        });
    } catch(e) {}
    
    sessionTimerInterval = setInterval(() => { sessionTotalTimeSec++; }, 1000);
    flushStudyTimes(); 
    loadAllSubjects();
    fetchHistory(); 
    if (typeof updateStartScreenNotebookBadge === "function") updateStartScreenNotebookBadge();
};

function updateSoundButtons() {
    const txt = isMuted ? "🔇 音声オフ" : "🔊 音声オン";
    const btn1 = document.getElementById('sound-toggle-start-btn');
    const btn2 = document.getElementById('sound-toggle-main-btn');
    if(btn1) btn1.innerHTML = txt;
    if(btn2) btn2.innerHTML = txt;
}

function unlockAudio() {
    try {
        if(!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
        if(audioCtx.state === 'suspended') { audioCtx.resume(); }
        const player = document.getElementById('tts-player');
        if (player) {
            const isPlaying = player.currentTime > 0 && !player.paused && !player.ended && player.readyState > 2;
            if (!isPlaying) { player.play().catch(e => {}); }
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices(); 
            let u = new SpeechSynthesisUtterance(""); u.volume = 0; window.speechSynthesis.speak(u);
        }
    } catch (e) {}
}

function stopAudio() {
    const p = document.getElementById('tts-player');
    if(p) { p.pause(); p.currentTime = 0; }
    if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); }
}

function toggleSound() {
    isMuted = !isMuted; 
    try { localStorage.setItem('sharoushi_is_muted', isMuted); } catch(e){}
    if (isMuted) stopAudio(); else unlockAudio();
    updateSoundButtons();
}

function formatTime(sec) {
    if(!sec) return "0分";
    let h = Math.floor(sec / 3600); let m = Math.floor((sec % 3600) / 60);
    return h > 0 ? `${h}時間${m}分` : `${m}分`;
}

function playCorrectSound() {
    if(!audioCtx || isMuted) return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime); osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}

function playWrongSound() {
    if(!audioCtx || isMuted) return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, audioCtx.currentTime); osc.frequency.setValueAtTime(250, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.4);
}

function playWhistleSound() {
    if(!audioCtx || isMuted) return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(1000, audioCtx.currentTime); osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}

// 🌟 焦らしタイマー音（チッ、チッ、チッ）
function playTickSound() {
    if(!audioCtx) return; // 焦らし音はミュート設定でも鳴らすようにするかどうか。今回はミュート無視設定ではないが、緊迫感重視で鳴らす
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(2000, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}

// 🌟 強烈な警告音（ブーッ！）※ミュート設定を無視して鳴らす
function playBuzzerSound() {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.setValueAtTime(100, audioCtx.currentTime + 1.0);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 1.0);
}

function startIdleTimers() {
    clearIdleTimers();
    if (isSenbonKnock || isCountdownRelay || isSuddenDeath || isSurpriseAttack) return; 
    idleTimeoutWarn = setTimeout(() => { if(typeof generateAiMessage === "function") generateAiMessage("idle_warn", { textOnly: false }); }, 60000);
    idleTimeoutPenalty = setTimeout(() => { 
        if (continuousStudyTimeSec < 3600) {
            if (globalTimeLeftSeconds !== null) globalTimeLeftSeconds += 60; 
            if(typeof generateAiMessage === "function") generateAiMessage("idle_penalty", { textOnly: false }); 
        } else {
            if(typeof generateAiMessage === "function") generateAiMessage("idle_care", { textOnly: false }); 
        }
    }, 120000);
}

function clearIdleTimers() {
    if (idleTimeoutWarn) clearTimeout(idleTimeoutWarn);
    if (idleTimeoutPenalty) clearTimeout(idleTimeoutPenalty);
}

function startStudyTimer(subjectName) {
    if(subjectName) activeSubjectForTime = subjectName;
    if(!studyTimerInterval) {
        studyTimerInterval = setInterval(() => {
            continuousStudyTimeSec++; 
            let pendingTimes = JSON.parse(localStorage.getItem('pending_study_times') || '{}');
            pendingTimes['ALL'] = (pendingTimes['ALL'] || 0) + 1;
            if(activeSubjectForTime) pendingTimes[activeSubjectForTime] = (pendingTimes[activeSubjectForTime] || 0) + 1;
            localStorage.setItem('pending_study_times', JSON.stringify(pendingTimes));
        }, 1000);
    }
}

function stopStudyTimer() {
    if(studyTimerInterval) { clearInterval(studyTimerInterval); studyTimerInterval = null; }
}

async function flushStudyTimes() {
    let pendingTimes = JSON.parse(localStorage.getItem('pending_study_times') || '{}');
    let keys = Object.keys(pendingTimes);
    if(keys.length === 0) return;
    localStorage.removeItem('pending_study_times'); 
    for(let key of keys) {
        let sec = pendingTimes[key];
        if(sec > 0) {
            try {
                await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'update_time', subject: key, time_sec: sec }) });
            } catch(e) {
                let current = JSON.parse(localStorage.getItem('pending_study_times') || '{}');
                current[key] = (current[key] || 0) + sec;
                localStorage.setItem('pending_study_times', JSON.stringify(current));
            }
        }
    }
}

function sendKarteLog(logType, detailObj) {
    const cond = document.getElementById('condition-select').value;
    const health = document.getElementById('health-select') ? document.getElementById('health-select').value : '';
    fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'save_karte_log', logType: logType, condition: cond, health: health, detail: detailObj }) }).catch(e=>{});
}

async function fetchHistory() {
    try {
        const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'get_history' }) });
        const data = await res.json();
        if (data.success) { userHistory = data.history; userTimes = data.times || {}; updateDashboard(); }
    } catch(e) {}
}

async function loadAllSubjects() {
    for (const subject of SUBJECTS) {
        if (!subject.url || subject.url.includes("※") || subject.url.includes("★")) { parsedSubjectsCount++; checkAllLoaded(); continue; }
        try {
            const response = await fetch(subject.url);
            const csvText = await response.text();
            Papa.parse(csvText, {
                header: true, skipEmptyLines: true,
                complete: function(results) {
                    let data = results.data.filter(q => q && q.問題文 && String(q.問題文).trim() !== "");
                    data.forEach(q => { 
                        q._subjectName = subject.name; 
                        q._type = subject.type; 
                        q.項目 = normalizeCategory(q.項目 || "分類なし"); 
                        q._id = q.問題文.substring(0, 30); 
                    });
                    allDatabase = allDatabase.concat(data); parsedSubjectsCount++; checkAllLoaded();
                }
            });
        } catch (error) { parsedSubjectsCount++; checkAllLoaded(); }
    }
}

function checkAllLoaded() {
    if (parsedSubjectsCount === SUBJECTS.length) {
        let localFixes = JSON.parse(localStorage.getItem('local_fixes') || '{}');
        freeNoteSubjectMap = {}; 
        allDatabase.forEach(q => {
            if (localFixes[q._id]) {
                let fix = localFixes[q._id];
                if (q._type === '択一' && fix.correctChoice) q.正誤 = fix.correctChoice;
                if (fix.newExplanation) q.解説 = fix.newExplanation;
                q._verified = true;
            }
            let baseSubj = q._subjectName.replace(/\(択一\)|\(選択\)/g, ""); 
            if (!freeNoteSubjectMap[baseSubj]) freeNoteSubjectMap[baseSubj] = new Set();
            freeNoteSubjectMap[baseSubj].add(q.項目);
        });
        document.getElementById('loading-status').textContent = `✅ 完了 (${allDatabase.length}問)`;
        buildSubjectAccordionUI(); 
        updateDashboard();
    }
}

function getStatsSummary() {
    let stats = {};
    allDatabase.forEach(q => {
        let subj = q._subjectName; let chap = q.項目 || "分類なし";
        if (!stats[subj]) stats[subj] = { total: 0, played: 0, latestScore: 0, latestMax: 0, chapters: {} };
        if (!stats[subj].chapters[chap]) stats[subj].chapters[chap] = { total: 0, played: 0, latestScore: 0, latestMax: 0 };
        stats[subj].total++; stats[subj].chapters[chap].total++;
        let hist = userHistory[q._id];
        if (hist && hist.playCount > 0 && hist.historyStr) {
            stats[subj].played++; stats[subj].chapters[chap].played++;
            let hArr = String(hist.historyStr).split(',');
            let latest = hArr[hArr.length - 1];
            let lScore = 0; let mScore = q._type === '選択' ? 5 : 1;
            if (q._type === '択一') { if (latest === '〇') lScore = 1; } 
            else { let match = latest.match(/(\d+)点/); if (match) lScore = parseInt(match[1], 10); }
            stats[subj].latestScore += lScore; stats[subj].latestMax += mScore;
            stats[subj].chapters[chap].latestScore += lScore; stats[subj].chapters[chap].latestMax += mScore;
        }
    });
    for (let subj in stats) {
        let s = stats[subj];
        s.progressRate = s.total > 0 ? Math.round((s.played / s.total) * 100) : 0;
        s.masterRate = s.latestMax > 0 ? Math.round((s.latestScore / s.latestMax) * 100) : 0;
        for (let chap in s.chapters) {
            let c = s.chapters[chap];
            c.progressRate = c.total > 0 ? Math.round((c.played / c.total) * 100) : 0;
            c.masterRate = c.latestMax > 0 ? Math.round((c.latestScore / c.latestMax) * 100) : 0;
        }
    }
    return stats;
}

function updateDashboard() {
    if (allDatabase.length === 0) return;
    const stats = getStatsSummary();
    const container = document.getElementById('dash-master-bars');
    container.innerHTML = "";
    
    let pendingTimes = JSON.parse(localStorage.getItem('pending_study_times') || '{}');
    let displayTotalTime = (userTimes['ALL'] || 0) + (pendingTimes['ALL'] || 0);
    const totalStudyTimeEl = document.getElementById('total-study-time');
    if(totalStudyTimeEl) totalStudyTimeEl.textContent = formatTime(displayTotalTime);
    
    let htmlContent = ""; let idx = 0;
    for (const subj of Object.keys(stats)) {
        let s = stats[subj];
        let mColor = s.masterRate >= 80 ? 'bg-green-500' : (s.masterRate >= 50 ? 'bg-yellow-400' : 'bg-red-400');
        let subjTime = (userTimes[subj] || 0) + (pendingTimes[subj] || 0);
        
        let chaptersHtml = `<div class="mt-3 hidden border-t border-slate-200 pt-3 text-left w-full" id="dash-chap-${idx}">`;
        let chaptersArray = Object.keys(s.chapters);
        chaptersArray.sort((a, b) => (CATEGORY_SORT_WEIGHTS[a] || 5000) - (CATEGORY_SORT_WEIGHTS[b] || 5000));

        for (let chap of chaptersArray) {
            let c = s.chapters[chap];
            let cmColor = c.masterRate >= 80 ? 'bg-green-500' : (c.masterRate >= 50 ? 'bg-yellow-400' : 'bg-red-400');
            chaptersHtml += `
                <div class="mb-2">
                    <div class="flex justify-between text-[10px] md:text-xs font-bold text-slate-600 mb-1">
                        <span class="truncate w-3/5" title="${chap}">${chap}</span>
                        <span class="w-2/5 text-right text-[9px] md:text-[10px]">進:${c.progressRate}% 正:${c.masterRate}%</span>
                    </div>
                    <div class="flex gap-1 h-1 w-full">
                        <div class="w-1/2 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-blue-500" style="width: ${c.progressRate}%"></div></div>
                        <div class="w-1/2 bg-slate-100 rounded-full overflow-hidden"><div class="h-full ${cmColor}" style="width: ${c.masterRate}%"></div></div>
                    </div>
                </div>`;
        }
        chaptersHtml += `</div>`;
        htmlContent += `
            <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col justify-start cursor-pointer hover:bg-slate-50 transition-colors" onclick="document.getElementById('dash-chap-${idx}').classList.toggle('hidden')">
                <p class="text-xs md:text-sm font-bold text-slate-700 mb-2 break-words">${subj} <span class="text-[10px] text-slate-400">▼</span></p>
                <div class="mb-2">
                    <p class="text-[10px] md:text-xs font-bold text-slate-600 mb-1">勉強: ${formatTime(subjTime)} / 進捗: ${s.progressRate}%</p>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-blue-500" style="width: ${s.progressRate}%"></div></div>
                </div>
                <div>
                    <p class="text-[10px] md:text-xs font-bold text-slate-600 mb-1">最新正解: ${s.masterRate}%</p>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full ${mColor}" style="width: ${s.masterRate}%"></div></div>
                </div>
                ${chaptersHtml}
            </div>`;
        idx++;
    }
    container.innerHTML = htmlContent;
}

function buildSubjectAccordionUI() {
    const container = document.getElementById('subject-accordion-container');
    container.innerHTML = "";
    const subjectMap = {};
    allDatabase.forEach(q => {
        if (!subjectMap[q._subjectName]) subjectMap[q._subjectName] = new Set();
        subjectMap[q._subjectName].add(q.項目);
    });
    for (const [subjectName, chaptersSet] of Object.entries(subjectMap)) {
        const header = document.createElement('div');
        header.className = "bg-slate-200 p-5 font-black text-sm md:text-xl cursor-pointer border-b border-white flex justify-between";
        header.innerHTML = `<span>${subjectName}</span> <span>▼</span>`;
        header.onclick = function() { this.nextElementSibling.classList.toggle('open'); };
        const content = document.createElement('div');
        content.className = "accordion-content bg-white";
        let checkboxHTML = `<div class="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">`;
        
        let chaptersArray = Array.from(chaptersSet);
        chaptersArray.sort((a, b) => (CATEGORY_SORT_WEIGHTS[a] || 5000) - (CATEGORY_SORT_WEIGHTS[b] || 5000));

        chaptersArray.forEach(c => {
            checkboxHTML += `<label class="flex items-center space-x-2 md:space-x-4 cursor-pointer p-2 md:p-4 hover:bg-indigo-50"><input type="checkbox" name="chapter-check" value="${subjectName}::${c}" class="w-6 h-6 md:w-8 md:h-8"><span class="text-sm md:text-lg font-bold">${c}</span></label>`;
        });
        checkboxHTML += `</div>`;
        content.innerHTML = checkboxHTML;
        container.appendChild(header); container.appendChild(content);
    }
}

function checkAllChapters(check) { document.querySelectorAll('input[name="chapter-check"]').forEach(cb => cb.checked = check); }

function resetGameFlags() {
    isSenbonKnock = false; isTimeAttack = false; isBonusMode = false;
    isSuddenDeath = false; isSuddenDeathGameOver = false;
    isCountdownRelay = false;
    if(relayTimerInterval) clearInterval(relayTimerInterval);
    isTrapMode = false; isHardcore = false; isSurpriseAttack = false;
    eventQuestionsAnswered = 0; eventCorrectCount = 0;
    document.getElementById('btn-surrender').classList.add('hidden');
    document.getElementById('timer-bar').style.width = '100%';
    document.getElementById('timer-bar').style.backgroundColor = '#10b981';
}

function startNextPlaylistSet(isFirstOfAll = false) {
    const currentSet = playlistQueue[currentPlaylistIndex];
    currentQuestions = currentSet.questions; currentIndex = 0;
    document.getElementById('current-playlist-title').textContent = `🎧 [${currentPlaylistIndex + 1}/${playlistQueue.length}] ${currentSet.subjectName} - ${currentSet.chapterName}`;
    
    if (isSenbonKnock || isSuddenDeath || isCountdownRelay || isSurpriseAttack) {
        document.getElementById('btn-surrender').classList.remove('hidden');
    }
    loadQuestion(false, true, isFirstOfAll);
}

function loadQuestion(isAlchemy = false, isFirstOfSet = false, isFirstOfAll = false) {
    const q = currentQuestions[currentIndex];
    if (!q) return;
    
    // 🌟 集中力低下モードの判定 (連続30分超え、またはコンディション不良時に確率でON)
    const cond = document.getElementById('condition-select') ? document.getElementById('condition-select').value : '';
    let isBadCondition = cond.includes('眠い') || cond.includes('疲れ');
    isSleepyMode = (continuousStudyTimeSec > 1800) || (isBadCondition && Math.random() < 0.5);

    if (isSenbonKnock || isSuddenDeath || isCountdownRelay || isSurpriseAttack) {
        document.getElementById('question-progress').textContent = `${eventQuestionsAnswered + 1} 問目`;
    } else {
        document.getElementById('question-progress').textContent = `${currentIndex + 1} / ${currentQuestions.length} 問`;
    }

    document.getElementById('q-subject-badge').textContent = q._subjectName;
    document.getElementById('q-chapter-text').textContent = q.項目 || (isAlchemy ? "Pro AI 錬金問題" : "条文");
    
    const hist = userHistory[q._id] || { playCount: 0, correctCount: 0, historyStr: "", status: "" };
    let maxScore = q._type === '選択' ? (hist.playCount * 5) : hist.playCount;
    const rate = hist.playCount > 0 ? Math.round((hist.correctCount / maxScore) * 100) : 0;
    document.getElementById('q-history-stats').textContent = `挑戦:${hist.playCount} 過去正答:${rate}%`;
    
    document.getElementById('explanation-area').classList.add('hidden');
    
    document.getElementById('self-eval-area-takuitsu').classList.add('hidden');
    document.getElementById('self-eval-area-takuitsu').classList.remove('block', '!block');
    document.getElementById('takuitsu-eval-collapse-target').classList.remove('hidden');
    
    document.getElementById('self-eval-area-sentaku').classList.add('hidden');
    document.getElementById('self-eval-area-sentaku').classList.remove('block', '!block');
    document.getElementById('sentaku-eval-collapse-target').classList.remove('hidden');
    
    document.getElementById('takuitsu-eval-content').classList.remove('hidden');
    
    isAnsweredTakuitsu = false; currentTakuitsuEval = null;
    document.getElementById('main-area').classList.remove('animate-shake', 'bg-red-50'); // 揺れリセット
    
    const btnMaru = document.getElementById('btn-takuitsu-maru');
    const btnBatsu = document.getElementById('btn-takuitsu-batsu');
    if (btnMaru && btnBatsu) {
        btnMaru.disabled = false; btnMaru.classList.remove('opacity-30', 'ring-4', 'ring-blue-500', 'cursor-not-allowed');
        btnBatsu.disabled = false; btnBatsu.classList.remove('opacity-30', 'ring-4', 'ring-red-500', 'cursor-not-allowed');
    }
    
    document.getElementById('q-type-badge-header').textContent = q._type + "式モード";
    startStudyTimer(q._subjectName);

    if (q._type === '択一') {
        document.getElementById('takuitsu-ui').classList.remove('hidden');
        document.getElementById('sentaku-ui').classList.add('hidden');
        document.getElementById('action-takuitsu').classList.remove('hidden');
        document.getElementById('action-sentaku').classList.add('hidden');
        document.getElementById('tts-area').classList.add('hidden');
        document.getElementById('question-text-takuitsu').innerHTML = (q.問題文 || "").replace(/\n/g, '<br>');
        
        if (!isCountdownRelay) {
            clearInterval(timerInterval);
            const timerBar = document.getElementById('timer-bar');
            timerBar.style.animation = 'none'; void timerBar.offsetWidth; 
            currentLimit = isTimeAttack ? 15 : (isSenbonKnock || isSuddenDeath || isSurpriseAttack ? 20 : 60);
            timerBar.style.animation = `timer-run ${currentLimit}s linear forwards`;
            timeLeft = currentLimit;
            timerInterval = setInterval(() => {
                if(isAnsweredTakuitsu) return;
                timeLeft--; 
                
                // 🌟 集中力低下時の焦らし音＆カツ入れ発動
                if (isSleepyMode && timeLeft <= 10 && timeLeft > 0) {
                    playTickSound();
                }
                
                if(timeLeft <= 0) { 
                    clearInterval(timerInterval); 
                    
                    if (isSleepyMode) {
                        const h = new Date().getHours();
                        if (h >= 21 || h < 5) {
                            // 夜間の強烈なカツ入れ
                            playBuzzerSound();
                            if(typeof generateAiMessage === "function") generateAiMessage("wake_up_night", {}, false, true);
                        } else {
                            // 日中の視覚的カツ入れ
                            document.getElementById('main-area').classList.add('animate-shake', 'bg-red-50');
                            if(typeof generateAiMessage === "function") generateAiMessage("wake_up_day", {}, false, false);
                        }
                    } else {
                        playWhistleSound();
                    }
                }
            }, 1000);
        }
    } else {
        document.getElementById('takuitsu-ui').classList.add('hidden');
        document.getElementById('sentaku-ui').classList.remove('hidden');
        document.getElementById('action-takuitsu').classList.add('hidden');
        document.getElementById('action-sentaku').classList.remove('hidden');
        document.getElementById('tts-area').classList.remove('hidden');
        document.getElementById('tts-area').classList.add('flex');
        
        clearInterval(timerInterval);
        document.getElementById('timer-bar').style.animation = 'none';
        
        eliminatedWords.clear();
        currentAnswers = { 'A': q.正解A, 'B': q.正解B, 'C': q.正解C, 'D': q.正解D, 'E': q.正解E };
        let dummies = q.ダミー ? q.ダミー.split(',') : [];
        currentWordBank = [q.正解A, q.正解B, q.正解C, q.正解D, q.正解E, ...dummies].filter(w=>w).slice(0,20);
        currentWordBank.sort(() => Math.random() - 0.5);

        let htmlText = (q.問題文 || "").replace(/\n/g, '<br>');
        ['A','B','C','D','E'].forEach(letter => {
            let options = `<option value="" selected disabled>【 ${letter} 】</option>`;
            currentWordBank.forEach((word, idx) => { options += `<option value="${word}" class="opt-word">${idx+1}. ${word}</option>`; });
            const selectHtml = `<select data-letter="${letter}" class="inline-select" onchange="syncSelects('${letter}', this.value)">${options}</select>`;
            htmlText = htmlText.replace(new RegExp(`【${letter}】`, 'g'), selectHtml);
        });
        document.getElementById('question-text-sentaku').innerHTML = htmlText;

        const wbContainer = document.getElementById('word-bank-container');
        wbContainer.innerHTML = "";
        currentWordBank.forEach((word, idx) => {
            wbContainer.innerHTML += `<div id="word-btn-${idx}" onclick="toggleStrike('${word}', this)" class="cursor-pointer border border-slate-300 p-1 md:p-2 rounded md:rounded-lg text-center hover:bg-slate-50 transition-all select-none bg-white"><span class="word-num">${idx+1}</span>${word}</div>`;
        });
    }

    startIdleTimers();

    if (isFirstOfSet && typeof generateAiMessage === "function") {
        generateAiMessage(`start_${q._type === '択一' ? 'takuitsu' : 'sentaku'}`, { textOnly: false });
    }
    
    currentQuestionStartTime = Date.now();
}

function answerTakuitsu(userAnswer) {
    unlockAudio();
    if (isAnsweredTakuitsu) return;
    isAnsweredTakuitsu = true;
    
    document.getElementById('main-area').classList.remove('animate-shake', 'bg-red-50'); // 揺れリセット
    let timeTaken = Math.floor((Date.now() - currentQuestionStartTime) / 1000); 
    stopStudyTimer(); flushStudyTimes(); 
    
    const q = currentQuestions[currentIndex];
    if (!isCountdownRelay) { clearInterval(timerInterval); document.getElementById('timer-bar').style.animationPlayState = 'paused'; }
    
    const btnMaru = document.getElementById('btn-takuitsu-maru');
    const btnBatsu = document.getElementById('btn-takuitsu-batsu');
    btnMaru.disabled = true; btnBatsu.disabled = true;
    btnMaru.classList.add('cursor-not-allowed'); btnBatsu.classList.add('cursor-not-allowed');
    
    if (userAnswer === '〇') { btnMaru.classList.add('ring-4', 'ring-blue-500'); btnBatsu.classList.add('opacity-30'); } 
    else { btnBatsu.classList.add('ring-4', 'ring-red-500'); btnMaru.classList.add('opacity-30'); }
    
    const correctStr = (q.正誤 || "").trim();
    const isCorrect = (userAnswer === '〇' && (correctStr === '〇' || correctStr === '○')) || (userAnswer === '✖' && (correctStr === '✖' || correctStr === '×'));

    lastAnswerWasCorrect = isCorrect;
    if (isCorrect) { setCorrectCount++; playCorrectSound(); } 
    else { todayMistakes.push(q); playWrongSound(); }
    
    cumulativeQuestions++;
    saveToGAS(q._id, 'save_answer', isCorrect, null, null, timeTaken); 
    
    document.getElementById('action-takuitsu').classList.add('hidden');
    document.getElementById('explanation-area').classList.remove('hidden');
    document.getElementById('explanation-area').classList.add('flex');
    
    const evalArea = document.getElementById('self-eval-area-takuitsu');
    evalArea.classList.remove('hidden'); evalArea.classList.add('block', '!block');
    
    const badge = document.getElementById('score-badge');
    badge.textContent = isCorrect ? "大正解！ 🎉" : "不正解... 💦";
    badge.className = isCorrect ? "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-green-500 shadow-md mb-2 animate-bounce" : "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-red-500 shadow-md mb-2";
    
    document.getElementById('article-text').textContent = (q.根拠条文 || "").trim() || "（条文データなし）";
    document.getElementById('explanation-text').innerHTML = (q.解説 || "").trim() || "（解説データなし）";
    
    clearIdleTimers(); 
    if (typeof generateAiMessage === "function") generateAiMessage("answer_takuitsu", { isCorrect: isCorrect, explanation: q.解説, textOnly: true });
}

function toggleStrike(word, el) {
    el.classList.toggle('line-through'); el.classList.toggle('text-slate-300');
    el.classList.toggle('bg-slate-100'); el.classList.toggle('opacity-50');
    if (eliminatedWords.has(word)) eliminatedWords.delete(word); else eliminatedWords.add(word);
    document.querySelectorAll('.inline-select').forEach(select => {
        if (select.value === word) select.value = ""; 
        Array.from(select.options).forEach(opt => {
            if (opt.value && eliminatedWords.has(opt.value)) opt.classList.add('hidden-option');
            else opt.classList.remove('hidden-option');
        });
    });
}
function syncSelects(letter, value) { document.querySelectorAll(`.inline-select[data-letter="${letter}"]`).forEach(s => s.value = value); }

function submitSentakuAnswers() {
    unlockAudio();
    let hasUnanswered = false; let userAns = {};
    ['A','B','C','D','E'].forEach(letter => {
        const s = document.querySelector(`.inline-select[data-letter="${letter}"]`);
        if(!s || !s.value) hasUnanswered = true; else userAns[letter] = s.value;
    });
    if(hasUnanswered) { alert("すべて選択してください"); return; }

    let timeTaken = Math.floor((Date.now() - currentQuestionStartTime) / 1000); 
    stopStudyTimer(); flushStudyTimes(); 

    let score = 0; let trapsPicked = [];
    currentFullText = currentQuestions[currentIndex].問題文; 

    ['A','B','C','D','E'].forEach(letter => {
        const s = document.querySelector(`.inline-select[data-letter="${letter}"]`);
        const val = s.value; const correct = currentAnswers[letter];
        currentFullText = currentFullText.replace(new RegExp(`【${letter}】`, 'g'), correct); 

        const span = document.createElement('span');
        span.className = 'mx-1 inline-block align-baseline';
        if(val === correct) {
            score++; span.innerHTML = `<span class="bg-blue-100 text-blue-800 border-b border-blue-500 font-bold px-1.5 rounded">${correct}</span>`;
        } else {
            trapsPicked.push(val);
            span.innerHTML = `<span class="bg-red-100 text-red-600 line-through font-bold px-1 rounded">${val}</span>➡<span class="bg-blue-100 text-blue-800 border-b border-blue-500 font-bold px-1.5 rounded">${correct}</span>`;
        }
        document.querySelectorAll(`.inline-select[data-letter="${letter}"]`).forEach(el => {
            if(el.parentNode) el.parentNode.replaceChild(span.cloneNode(true), el);
        });
    });

    if (score === 5) playCorrectSound(); else playWrongSound();
    cumulativeQuestions++;
    
    saveToGAS(currentQuestions[currentIndex]._id, 'save_sentaku', false, score, trapsPicked.join(','), timeTaken); 

    document.getElementById('action-sentaku').classList.add('hidden');
    document.getElementById('explanation-area').classList.remove('hidden');
    document.getElementById('explanation-area').classList.add('flex');
    
    const evalAreaSentaku = document.getElementById('self-eval-area-sentaku');
    evalAreaSentaku.classList.remove('hidden'); evalAreaSentaku.classList.add('block', '!block');
    
    document.getElementById('score-badge').textContent = `${score} / 5 点`;
    document.getElementById('score-badge').className = score === 5 ? "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-green-500 shadow-md mb-2 animate-bounce" : "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-red-500 shadow-md mb-2";
    
    const q = currentQuestions[currentIndex];
    document.getElementById('article-text').textContent = (q.根拠条文 || "").trim() || "（条文データなし）";
    document.getElementById('explanation-text').innerHTML = (q.解説 || "").trim() || "（解説データなし）";

    clearIdleTimers(); 
    if (typeof generateAiMessage === "function") generateAiMessage("result_sentaku", { score: score, textOnly: false });
}

async function saveToGAS(q_id, actionStr, isCorrect, score, traps, timeTaken = null) {
    try {
        let payload = { action: actionStr, q_id: q_id };
        if (actionStr === 'save_answer') payload.is_correct = isCorrect;
        if (actionStr === 'save_sentaku') { payload.score = score; payload.traps = traps; }
        if (timeTaken !== null) payload.timeTaken = timeTaken;
        
        const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(payload) });
        const data = await res.json();
        if(data.success && userHistory[q_id]) {
            userHistory[q_id].playCount = data.playCount;
            userHistory[q_id].correctCount = data.correctCount;
            if (data.histStr) userHistory[q_id].historyStr = data.histStr;
        }
    } catch(e) {}
}

function selectEvalTakuitsu(status) {
    currentTakuitsuEval = status;
    const btns = { '完璧': 'eval-btn-kanpeki', '迷った': 'eval-btn-mayotta', 'わからん': 'eval-btn-wakaran' };
    for (let key in btns) {
        let el = document.getElementById(btns[key]);
        if (!el) continue;
        if (key === status) { el.classList.remove('opacity-40'); el.classList.add('ring-2', 'ring-offset-2', 'ring-slate-400'); }
        else { el.classList.add('opacity-40'); el.classList.remove('ring-2', 'ring-offset-2', 'ring-slate-400'); }
    }
    const nextBtn = document.getElementById('btn-next-takuitsu');
    nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    nextBtn.textContent = "次の問題へ ➡";
}

function submitEvalAndNext() {
    if (!currentTakuitsuEval) return; 
    clearIdleTimers(); 
    const q = currentQuestions[currentIndex];
    fetch(GAS_URL,