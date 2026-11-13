// main.js
const GAS_URL = "https://script.google.com/macros/s/AKfycbwptevf0-SETg8D7-F54qWDwfwKLEAyJzQgNu_C2D1Z_Ohn0toWgWk_D7Czn8uSf1m5kQ/exec";

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
    let c = String(cat).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
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

let pauseSeconds = 0;
let pauseInterval = null;

let setCorrectCount = 0, cumulativeQuestions = 0, todayMistakes = [];
let eliminatedWords = new Set(), currentWordBank = [], currentAnswers = {}, currentFullText = "";
let lastAnswerWasCorrect = false;
let strategyPlan = null, currentQuestionStartTime = 0;

let initialPlaylistConfig = [];

let activeSubjectForTime = null; 
let studyTimerInterval = null;
let continuousStudyTimeSec = 0; 

let sessionTotalTimeSec = 0;
let sessionTimerInterval = null;

let idleTimeoutWarn = null;
let idleTimeoutPenalty = null;
let isReviewAdded = false;
let isExtensionAdded = false;
let hasRestRecommended = false;

let initialGlobalTime = null;
let eventTriggeredThisSession = false;
let isSuddenDeath = false;
let isSuddenDeathGameOver = false;
let isCountdownRelay = false;
let countdownTimeLeft = 0;
let relayTimerInterval = null;
let isTrapMode = false;
let isHardcore = false;
let isSurpriseAttack = false;

let isSenbonKnock = false; 
let isTimeAttack = false;
let isBonusMode = false;
let eventQuestionsAnswered = 0;
let eventCorrectCount = 0;

let isAnsweredTakuitsu = false;
let currentTakuitsuEval = null;

let pendingFixData = null;
let isSleepyMode = false;

window.onload = function() {
    try {
        const savedKey = localStorage.getItem('gemini_api_key');
        const savedModel = localStorage.getItem('gemini_api_model');
        const savedMute = localStorage.getItem('sharoushi_is_muted');
        const savedCond = localStorage.getItem('sharoushi_condition');
        
        if(savedKey) { document.getElementById('api-key-input').value = savedKey; userApiKey = savedKey; }
        if(savedModel) { document.getElementById('api-model-input').value = savedModel; userModel = savedModel; }
        if(savedMute !== null) { isMuted = (savedMute === 'true'); }
        if(savedCond && document.getElementById('condition-select')) { document.getElementById('condition-select').value = savedCond; }
        updateSoundButtons();
        
        // APIキーの自動保存
        const apiKeyInput = document.getElementById('api-key-input');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('input', function(e) {
                userApiKey = e.target.value.trim();
                localStorage.setItem('gemini_api_key', userApiKey);
            });
        }
        
        const apiModelInput = document.getElementById('api-model-input');
        if (apiModelInput) {
            apiModelInput.addEventListener('change', function(e) {
                userModel = e.target.value;
                localStorage.setItem('gemini_api_model', userModel);
            });
        }

        if (document.getElementById('condition-select')) {
            document.getElementById('condition-select').addEventListener('change', function(e) {
                localStorage.setItem('sharoushi_condition', e.target.value);
            });
        }
    } catch(e) {}
    
    sessionTimerInterval = setInterval(() => { sessionTotalTimeSec++; }, 1000);
    
    flushStudyTimes(); 
    loadAllSubjects();
    fetchHistory(); 
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

function toggleCustomTime() {
    const selectVal = document.getElementById('time-limit-select').value;
    const customInput = document.getElementById('custom-time-input');
    if (selectVal === 'custom') customInput.classList.remove('hidden');
    else customInput.classList.add('hidden');
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

function playTickSound() {
    if(!audioCtx) return; 
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(2000, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}

function playBuzzerSound() {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.setValueAtTime(100, audioCtx.currentTime + 1.0);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 1.0);
}

let beepInterval = null;
function playAlarmSound() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = () => {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'square'; osc.frequency.setValueAtTime(880, audioCtx.currentTime); gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    };
    beepInterval = setInterval(() => { playBeep(); setTimeout(playBeep, 150); setTimeout(playBeep, 300); }, 1000);
}

function playCompletedArticle() {
    const text = document.getElementById('article-text').textContent;
    if(text && text !== "条文なし" && typeof speakText === "function") speakText(text);
}

function generateAlchemyQuestion() {
    if (typeof generateAiMessage === "function") generateAiMessage("alchemy_prep", { textOnly: true });
}

function startIdleTimers() {
    clearIdleTimers();
    if (isSenbonKnock || isCountdownRelay || isSuddenDeath || isSurpriseAttack) return; 
    idleTimeoutWarn = setTimeout(() => { if (typeof generateAiMessage === "function") generateAiMessage("idle_warn", { textOnly: false }); }, 15000);
    idleTimeoutPenalty = setTimeout(() => { 
        if (continuousStudyTimeSec < 3600) {
            if (globalTimeLeftSeconds !== null) globalTimeLeftSeconds += 60; 
            if (typeof generateAiMessage === "function") generateAiMessage("idle_penalty", { textOnly: false }); 
        } else {
            if (typeof generateAiMessage === "function") generateAiMessage("idle_care", { textOnly: false }); 
        }
    }, 30000);
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
            let pendingTimes = {};
            try { pendingTimes = JSON.parse(localStorage.getItem('pending_study_times') || '{}'); } catch(e){}
            pendingTimes['ALL'] = (pendingTimes['ALL'] || 0) + 1;
            if(activeSubjectForTime) {
                pendingTimes[activeSubjectForTime] = (pendingTimes[activeSubjectForTime] || 0) + 1;
            }
            localStorage.setItem('pending_study_times', JSON.stringify(pendingTimes));
        }, 1000);
    }
}

function stopStudyTimer() {
    if(studyTimerInterval) { clearInterval(studyTimerInterval); studyTimerInterval = null; }
}

async function flushStudyTimes() {
    let pendingTimes = {};
    try { pendingTimes = JSON.parse(localStorage.getItem('pending_study_times') || '{}'); } catch(e){}
    let keys = Object.keys(pendingTimes);
    if(keys.length === 0) return;
    localStorage.removeItem('pending_study_times'); 
    for(let key of keys) {
        let sec = pendingTimes[key];
        if(sec > 0) {
            try {
                await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'update_time', subject: key, time_sec: sec }) });
            } catch(e) {
                let current = {};
                try { current = JSON.parse(localStorage.getItem('pending_study_times') || '{}'); } catch(e){}
                current[key] = (current[key] || 0) + sec;
                localStorage.setItem('pending_study_times', JSON.stringify(current));
            }
        }
    }
}

function saveRequestHabit(input) {
    let reqs = [];
    try { reqs = JSON.parse(localStorage.getItem('strategy_habits') || '[]'); } catch(e){}
    reqs.push({ time: new Date().toISOString(), text: input });
    if(reqs.length > 5) reqs.shift();
    localStorage.setItem('strategy_habits', JSON.stringify(reqs));
}

function sendKarteLog(logType, detailObj) {
    const cond = document.getElementById('condition-select') ? document.getElementById('condition-select').value : '';
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
                        q._subjectName = subject.name; q._type = subject.type; q.項目 = normalizeCategory(q.項目 || "分類なし"); q._id = q.問題文.substring(0, 30); 
                    });
                    allDatabase = allDatabase.concat(data); parsedSubjectsCount++; checkAllLoaded();
                }
            });
        } catch (error) { parsedSubjectsCount++; checkAllLoaded(); }
    }
}

function checkAllLoaded() {
    if (parsedSubjectsCount === SUBJECTS.length) {
        let localFixes = {};
        try { localFixes = JSON.parse(localStorage.getItem('local_fixes') || '{}'); } catch(e){}
        allDatabase.forEach(q => {
            if (localFixes[q._id]) {
                let fix = localFixes[q._id];
                if (q._type === '択一' && fix.correctChoice) q.正誤 = fix.correctChoice;
                if (fix.newExplanation) q.解説 = fix.newExplanation;
                q._verified = true;
            }
        });
        const statusEl = document.getElementById('loading-status');
        if (statusEl) statusEl.textContent = `✅ 完了 (${allDatabase.length}問)`;
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
    if(!container) return;
    container.innerHTML = "";
    
    let pendingTimes = {};
    try { pendingTimes = JSON.parse(localStorage.getItem('pending_study_times') || '{}'); } catch(e){}
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
                <p class="text-xs md:text-sm font-bold text-slate-700 mb-2 break-words" title="${subj}">${subj} <span class="text-[10px] text-slate-400">▼</span></p>
                <div class="mb-2">
                    <p class="text-[10px] md:text-xs font-bold text-slate-600 mb-1">勉強: ${formatTime(subjTime)} / 進捗: ${s.progressRate}%</p>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500" style="width: ${s.progressRate}%"></div>
                    </div>
                </div>
                <div>
                    <p class="text-[10px] md:text-xs font-bold text-slate-600 mb-1">最新正解: ${s.masterRate}%</p>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full ${mColor}" style="width: ${s.masterRate}%"></div>
                    </div>
                </div>
                ${chaptersHtml}
            </div>`;
        idx++;
    }
    container.innerHTML = htmlContent;

    if(userApiKey && document.getElementById('dash-ai-comment')) {
        let prompt = `あなたは社労士試験の専属コーチ（18歳前後の若い女性）です。現在時刻は${new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'})}。受講生の努力を肯定し、成績データをもとに今日のおすすめ科目を1〜2文で明るく提案して。不自然な役割語（〜わ、〜よ等）は絶対禁止。データ: ${JSON.stringify(stats)}`;
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }).then(res => res.json()).then(data => {
            if (data.candidates && data.candidates[0]) { document.getElementById('dash-ai-comment').textContent = data.candidates[0].content.parts[0].text; }
        }).catch(e => { document.getElementById('dash-ai-comment').textContent = "今日も自分のペースで一問ずつ進めていこう！"; });
    }
}

function buildSubjectAccordionUI() {
    const container = document.getElementById('subject-accordion-container');
    if(!container) return;
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

function triggerAnalysisStrategy() {
    const input = document.getElementById('strategy-input');
    if(input) input.value = '弱点を分析して特訓プランを作って！';
    if (typeof sendStrategyMessage === "function") sendStrategyMessage();
}

function triggerEbbinghausStrategy() {
    const input = document.getElementById('strategy-input');
    if(input) input.value = '忘却曲線をベースに復習プランを作って！';
    if (typeof sendStrategyMessage === "function") sendStrategyMessage();
}

function resetGameFlags() {
    isSenbonKnock = false; isTimeAttack = false; isBonusMode = false;
    isSuddenDeath = false; isSuddenDeathGameOver = false;
    isCountdownRelay = false;
    if(relayTimerInterval) clearInterval(relayTimerInterval);
    isTrapMode = false; isHardcore = false; isSurpriseAttack = false;
    eventQuestionsAnswered = 0; eventCorrectCount = 0;
    const btn = document.getElementById('btn-surrender');
    if(btn) btn.classList.add('hidden');
    
    const tbar = document.getElementById('timer-bar');
    if(tbar) { tbar.style.width = '100%'; tbar.style.backgroundColor = '#10b981'; }
}

function executeStrategyPlan() {
    if(!strategyPlan) return;
    const apiKeyInput = document.getElementById('api-key-input');
    userApiKey = apiKeyInput ? apiKeyInput.value.trim() : userApiKey;
    const apiModelInput = document.getElementById('api-model-input');
    userModel = apiModelInput ? apiModelInput.value : userModel;
    if (!userApiKey) { alert("APIキーを入力してください！"); return; }
    unlockAudio();
    
    cumulativeQuestions = 0; setCorrectCount = 0; todayMistakes = [];
    playlistQueue = []; let totalQuestionsToPlay = 0;
    
    let planList = strategyPlan.plan || [strategyPlan];
    planList.forEach(item => {
        let pool = allDatabase.filter(q => q._subjectName === item.subject);
        if (item.chapter) pool = pool.filter(q => q.項目 === item.chapter);
        if(pool.length > 0) {
            let chapterMap = {};
            pool.forEach(q => { let c = q.項目 || "分類なし"; if(!chapterMap[c]) chapterMap[c] = []; chapterMap[c].push(q); });
            let pickedChapter = Object.keys(chapterMap)[0];
            let qs = (chapterMap[pickedChapter] || pool).sort(() => Math.random() - 0.5).slice(0, item.count || 10);
            if (qs.length > 0) { playlistQueue.push({ subjectName: item.subject, chapterName: pickedChapter, type: qs[0]._type, questions: qs }); totalQuestionsToPlay += qs.length; }
        }
    });
    if(playlistQueue.length === 0) { alert("条件に合う問題が見つかりませんでした。"); return; }
    
    resetGameFlags();
    currentPlaylistIndex = 0; isReviewAdded = false; isExtensionAdded = false; hasRestRecommended = false;
    
    initialPlaylistConfig = playlistQueue.map(q => ({ subjectName: q.subjectName, chapterName: q.chapterName, type: q.type }));
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('main-area').classList.remove('hidden');
    document.getElementById('main-area').classList.add('flex');
    document.getElementById('aside-area').classList.remove('hidden');
    document.getElementById('aside-area').classList.add('flex');
    
    initialGlobalTime = null;
    eventTriggeredThisSession = false;
    let todayStr = new Date().toDateString();
    if (localStorage.getItem('last_play_date') !== todayStr) {
        localStorage.setItem('last_play_date', todayStr);
        localStorage.setItem('trap_done_date', '');
        localStorage.setItem('today_sentaku_count', '0');
    }
    
    startNextPlaylistSet(true);
}

function startStrategyPlaylist(config) {
    if (allDatabase.length === 0) { return; }
    
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
    isReviewAdded = false; isExtensionAdded = false; hasRestRecommended = false;
    initialPlaylistConfig = playlistQueue.map(q => ({ subjectName: q.subjectName, chapterName: q.chapterName, type: q.type }));
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('main-area').classList.remove('hidden');
    document.getElementById('main-area').classList.add('flex');
    document.getElementById('aside-area').classList.remove('hidden');
    document.getElementById('aside-area').classList.add('flex');
    
    sendKarteLog('strategy_start', { target: config.target, count: count });
    startNextPlaylistSet(true);
}

function startTraining(mode, targetSubject = null, excludePerfect = false, count = 10) {
    if(allDatabase.length === 0) { alert("データがありません。"); return; }
    const apiKeyInput = document.getElementById('api-key-input');
    userApiKey = apiKeyInput ? apiKeyInput.value.trim() : userApiKey;
    const apiModelInput = document.getElementById('api-model-input');
    userModel = apiModelInput ? apiModelInput.value : userModel;
    if (!userApiKey) { alert("APIキーを入力してください！"); document.getElementById('api-settings-wrapper').classList.remove('hidden'); return; }
    try { localStorage.setItem('gemini_api_key', userApiKey); localStorage.setItem('gemini_api_model', userModel); } catch(e) {}
    unlockAudio();
    
    cumulativeQuestions = 0; setCorrectCount = 0; todayMistakes = []; 
    playlistQueue = []; let totalQuestionsToPlay = 0;
    
    const timeLimitVal = document.getElementById('time-limit-select').value;
    if (timeLimitVal === '無制限') globalTimeLeftSeconds = null;
    else if (timeLimitVal === 'custom') {
        const customTimeStr = document.getElementById('custom-time-input').value;
        if (!customTimeStr) { alert("終了時刻を入力してください！"); return; }
        const [h, m] = customTimeStr.split(':');
        const target = new Date(); target.setHours(parseInt(h), parseInt(m), 0);
        if (target <= new Date()) target.setDate(target.getDate() + 1);
        globalTimeLeftSeconds = Math.floor((target - new Date()) / 1000);
    } else if (timeLimitVal === '1分') globalTimeLeftSeconds = 60;
    else globalTimeLeftSeconds = parseInt(timeLimitVal.replace('分','')) * 60;

    const timeDisplay = document.getElementById('time-display');
    if (globalTimeLeftSeconds !== null) {
        if(timeDisplay) timeDisplay.classList.remove('hidden');
        globalTimerInterval = setInterval(globalTimerTick, 1000);
    } else {
        if(timeDisplay) timeDisplay.textContent = '無制限';
    }

    let pool = [];
    if (mode === 'normal') {
        excludePerfect = document.getElementById('exclude-perfect-check').checked;
        const checkboxes = Array.from(document.querySelectorAll('input[name="chapter-check"]:checked')).map(cb => cb.value);
        if (checkboxes.length > 0) {
            checkboxes.forEach(val => {
                const [subj, chap] = val.split("::");
                let p = allDatabase.filter(q => q._subjectName === subj && q.項目 === chap);
                if(excludePerfect) p = p.filter(q => !(userHistory[q._id] && userHistory[q._id].status === '完璧'));
                if(p.length > 0) {
                    let qs = p.sort(()=>Math.random()-0.5).slice(0, 10);
                    playlistQueue.push({ subjectName: subj, chapterName: chap, type: qs[0]._type, questions: qs });
                    totalQuestionsToPlay += qs.length;
                }
            });
        } else { pool = [...allDatabase]; }
    } else if (mode === 'quick') {
        if (targetSubject === '択一') pool = allDatabase.filter(q => q._type === '択一');
        else if (targetSubject === '選択') pool = allDatabase.filter(q => q._type === '選択');
        else if (targetSubject === 'ミックス') pool = [...allDatabase];
    }

    if (mode !== 'normal') {
        if (excludePerfect) pool = pool.filter(q => !(userHistory[q._id] && userHistory[q._id].status === '完璧'));
        let qs = pool.sort(()=>Math.random()-0.5).slice(0, count);
        if(qs.length === 0) { alert("条件に合う問題がありません。"); return; }
        playlistQueue = [{ subjectName: targetSubject, chapterName: "ミックス", type: qs[0]._type, questions: qs }];
        totalQuestionsToPlay = qs.length;
    }

    if(playlistQueue.length === 0) { alert("条件に合う問題がありません。"); return; }
    
    resetGameFlags();
    currentPlaylistIndex = 0; isReviewAdded = false; isExtensionAdded = false; hasRestRecommended = false;
    
    initialPlaylistConfig = playlistQueue.map(q => ({ subjectName: q.subjectName, chapterName: q.chapterName, type: q.type }));
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('main-area').classList.remove('hidden');
    document.getElementById('main-area').classList.add('flex');
    document.getElementById('aside-area').classList.remove('hidden');
    document.getElementById('aside-area').classList.add('flex');
    
    initialGlobalTime = globalTimeLeftSeconds;
    eventTriggeredThisSession = false;
    let todayStr = new Date().toDateString();
    if (localStorage.getItem('last_play_date') !== todayStr) {
        localStorage.setItem('last_play_date', todayStr);
        localStorage.setItem('trap_done_date', '');
        localStorage.setItem('today_sentaku_count', '0');
    }
    
    startNextPlaylistSet(true);
}

function globalTimerTick() {
    if(globalTimeLeftSeconds === null) return;
    globalTimeLeftSeconds--;
    const timeDisplay = document.getElementById('time-display');
    if(!timeDisplay) return;
    if (globalTimeLeftSeconds > 0) {
        const h = Math.floor(globalTimeLeftSeconds / 3600);
        const m = Math.floor((globalTimeLeftSeconds % 3600) / 60);
        const s = globalTimeLeftSeconds % 60;
        let txt = h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` : `${m}:${s.toString().padStart(2,'0')}`;
        timeDisplay.textContent = `⏳ ${txt}`;
        timeDisplay.classList.remove('bg-red-600', 'text-white', 'animate-pulse');
        timeDisplay.classList.add('bg-slate-800', 'text-yellow-400');
    } else {
        isTimeUp = true;
        timeDisplay.textContent = '🏁 時間切れ';
        timeDisplay.classList.remove('bg-slate-800', 'text-yellow-400');
        timeDisplay.classList.add('bg-red-600', 'text-white', 'animate-pulse');
    }
}

function startNextPlaylistSet(isFirstOfAll = false) {
    const currentSet = playlistQueue[currentPlaylistIndex];
    currentQuestions = currentSet.questions; currentIndex = 0;
    const titleEl = document.getElementById('current-playlist-title');
    if(titleEl) titleEl.textContent = `🎧 [${currentPlaylistIndex + 1}/${playlistQueue.length}] ${currentSet.subjectName} - ${currentSet.chapterName}`;
    
    if (isSenbonKnock || isSuddenDeath || isCountdownRelay || isSurpriseAttack) {
        const btn = document.getElementById('btn-surrender');
        if(btn) btn.classList.remove('hidden');
    }
    
    if (currentSet.type === '選択' && !isHardcore && !isSurpriseAttack) {
        let count = parseInt(localStorage.getItem('today_sentaku_count') || '0') + currentQuestions.length;
        localStorage.setItem('today_sentaku_count', count.toString());
    }
    
    loadQuestion(false, isFirstOfAll);
}

function startCountdownRelayTimer() {
    countdownTimeLeft = 20; 
    const tbar = document.getElementById('timer-bar');
    if(tbar) tbar.style.animation = 'none';
    
    relayTimerInterval = setInterval(() => {
        if (isAnsweredTakuitsu) return; 
        countdownTimeLeft--;
        if(tbar) {
            let pct = Math.min(100, (countdownTimeLeft / 30) * 100);
            tbar.style.width = pct + '%';
            tbar.style.backgroundColor = countdownTimeLeft > 10 ? '#10b981' : '#ef4444';
        }
        
        const tDisp = document.getElementById('time-display');
        if(tDisp) {
            tDisp.textContent = `🔥 残 ${countdownTimeLeft}秒`;
            tDisp.classList.add('bg-red-600', 'text-white');
            tDisp.classList.remove('bg-slate-800', 'text-yellow-400');
        }
        
        if (countdownTimeLeft <= 0) {
            playWhistleSound();
            clearInterval(relayTimerInterval);
            finishAllPlaylists();
        }
    }, 1000);
}

function unlockHardcore(type) {
    document.querySelectorAll('.inline-select').forEach(sel => {
        sel.disabled = false;
        sel.classList.remove('opacity-50', 'bg-slate-200', 'cursor-not-allowed');
    });
    const hcArea = document.getElementById('hardcore-unlock-area');
    if(hcArea) { hcArea.classList.add('hidden'); hcArea.classList.remove('flex'); }
    const normArea = document.getElementById('normal-sentaku-actions');
    if(normArea) { normArea.classList.remove('hidden'); normArea.classList.add('flex'); }
    const q = currentQuestions[currentIndex];
    sendKarteLog('hardcore_unlock', { type: type, q_id: q._id, question: q.問題文.substring(0, 20) });
}
        
function startPause() {
    stopStudyTimer();
    clearIdleTimers();
    pauseSeconds = 0;
    const tDisp = document.getElementById('pause-timer-display');
    if(tDisp) tDisp.textContent = "00:00";
    const over = document.getElementById('pause-overlay');
    if(over) { over.classList.remove('hidden'); over.classList.add('flex'); }
    
    pauseInterval = setInterval(() => {
        pauseSeconds++;
        if(tDisp) {
            let m = Math.floor(pauseSeconds / 60).toString().padStart(2, '0');
            let s = (pauseSeconds % 60).toString().padStart(2, '0');
            tDisp.textContent = `${m}:${s}`;
        }
    }, 1000);
}
        
function startNapQuick(minutes) {
    stopStudyTimer();
    clearIdleTimers();
    const over = document.getElementById('nap-overlay');
    if(over) { over.classList.remove('hidden'); over.classList.add('flex'); }
    napSecondsLeft = minutes * 60;
    localStorage.setItem('last_nap_time', new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'}));
    sendKarteLog('nap_start', { time: new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'}), durationMinutes: minutes }); 
    runNapTimer();
    if (typeof generateAiMessage === "function") generateAiMessage("nap_start", { textOnly: true });
}

function loadQuestion(isAlchemy = false, isFirstOfSet = false) {
    const q = currentQuestions[currentIndex];
    if (!q) return;
    
    const condSelect = document.getElementById('condition-select');
    const cond = condSelect ? condSelect.value : '';
    let isBadCondition = cond.includes('眠い') || cond.includes('疲れ');
    isSleepyMode = (continuousStudyTimeSec > 1800) || (isBadCondition && Math.random() < 0.5);

    const qProg = document.getElementById('question-progress');
    if(qProg) {
        if (isSenbonKnock || isSuddenDeath || isCountdownRelay || isSurpriseAttack) {
            qProg.textContent = `${eventQuestionsAnswered + 1} 問目`;
        } else {
            qProg.textContent = `${currentIndex + 1} / ${currentQuestions.length} 問`;
        }
    }

    const sBadge = document.getElementById('q-subject-badge');
    if(sBadge) sBadge.textContent = q._subjectName;
    const cText = document.getElementById('q-chapter-text');
    if(cText) cText.textContent = q.項目 || (isAlchemy ? "Pro AI 錬金問題" : "条文");
    
    const hist = userHistory[q._id] || { playCount: 0, correctCount: 0 };
    let maxScore = q._type === '選択' ? (hist.playCount * 5) : hist.playCount;
    const rate = hist.playCount > 0 ? Math.round((hist.correctCount / maxScore) * 100) : 0;
    const hStats = document.getElementById('q-history-stats');
    if(hStats) hStats.textContent = `挑戦:${hist.playCount} 過去正答:${rate}%`;

    const explArea = document.getElementById('explanation-area');
    if(explArea) explArea.classList.add('hidden');
    const fixAct = document.getElementById('ai-fix-action');
    if(fixAct) fixAct.classList.add('hidden');
    
    const seTak = document.getElementById('self-eval-area-takuitsu');
    if(seTak) { seTak.classList.add('hidden'); seTak.classList.remove('block', '!block'); }
    const seSen = document.getElementById('self-eval-area-sentaku');
    if(seSen) { seSen.classList.add('hidden'); seSen.classList.remove('block', '!block'); }
    
    const teCon = document.getElementById('takuitsu-eval-content');
    if(teCon) teCon.classList.remove('hidden');
    const rpMen = document.getElementById('rest-proposal-menu-takuitsu');
    if(rpMen) { rpMen.classList.add('hidden'); rpMen.classList.remove('flex'); }
    const idMen = document.getElementById('infinite-drill-menu');
    if(idMen) { idMen.classList.add('hidden'); idMen.classList.remove('flex'); }
    
    let ignoredFixes = {};
    try { ignoredFixes = JSON.parse(localStorage.getItem('ignored_fixes') || '{}'); } catch(e){}
    const badge = document.getElementById('ignored-fix-badge');
    if(badge) {
        if (ignoredFixes[q._id]) {
            badge.classList.remove('hidden');
            pendingFixData = ignoredFixes[q._id];
        } else {
            badge.classList.add('hidden');
            pendingFixData = null;
        }
    }
    
    isAnsweredTakuitsu = false;
    currentTakuitsuEval = null;
    const mainArea = document.getElementById('main-area');
    if(mainArea) mainArea.classList.remove('animate-shake', 'bg-red-50'); 
    
    const btnMaru = document.getElementById('btn-takuitsu-maru');
    const btnBatsu = document.getElementById('btn-takuitsu-batsu');
    if (btnMaru && btnBatsu) {
        btnMaru.disabled = false; btnMaru.classList.remove('opacity-30', 'ring-4', 'ring-blue-500', 'cursor-not-allowed');
        btnBatsu.disabled = false; btnBatsu.classList.remove('opacity-30', 'ring-4', 'ring-red-500', 'cursor-not-allowed');
    }
    
    const evalBtns = ['eval-btn-kanpeki', 'eval-btn-mayotta', 'eval-btn-wakaran'];
    evalBtns.forEach(id => {
        let el = document.getElementById(id);
        if(el) el.classList.remove('opacity-40', 'ring-2', 'ring-offset-2', 'ring-slate-400');
    });
    
    const nextBtnTak = document.getElementById('btn-next-takuitsu');
    if(nextBtnTak) {
        if(!isSenbonKnock && !isTimeAttack && !isBonusMode && !isSuddenDeath && !isCountdownRelay && !isTrapMode && !isSurpriseAttack) {
            nextBtnTak.classList.add('opacity-50', 'cursor-not-allowed');
            nextBtnTak.textContent = "評価を選択してください";
        } else {
            nextBtnTak.classList.remove('opacity-50', 'cursor-not-allowed');
            nextBtnTak.textContent = "次の問題へ ➡";
        }
    }

    const teBtns = document.getElementById('takuitsu-eval-buttons');
    const egTak = document.getElementById('eval-guide-text-takuitsu');
    if (teBtns && egTak) {
        if (!isSenbonKnock && !isTimeAttack && !isBonusMode && !isSuddenDeath && !isCountdownRelay && !isTrapMode && !isSurpriseAttack) {
            teBtns.classList.remove('hidden');
            egTak.classList.remove('hidden');
        } else {
            teBtns.classList.add('hidden');
            egTak.classList.add('hidden');
        }
    }
    
    const qtBadge = document.getElementById('q-type-badge-header');
    if(qtBadge) qtBadge.textContent = q._type + "式モード";

    startStudyTimer(q._subjectName);

    if (q._type === '択一') {
        const tUi = document.getElementById('takuitsu-ui'); if(tUi) tUi.classList.remove('hidden');
        const sUi = document.getElementById('sentaku-ui'); if(sUi) sUi.classList.add('hidden');
        const aTak = document.getElementById('action-takuitsu'); if(aTak) aTak.classList.remove('hidden');
        const aSen = document.getElementById('action-sentaku'); if(aSen) aSen.classList.add('hidden');
        const tts = document.getElementById('tts-area'); if(tts) tts.classList.add('hidden');
        const alc = document.getElementById('alchemy-btn'); if(alc) alc.classList.add('hidden');
        const qtTak = document.getElementById('question-text-takuitsu'); if(qtTak) qtTak.innerHTML = q.問題文.replace(/\n/g, '<br>');
        
        if (!isCountdownRelay) {
            clearInterval(timerInterval);
            const timerBar = document.getElementById('timer-bar');
            if(timerBar) { timerBar.style.animation = 'none'; void timerBar.offsetWidth; }
            currentLimit = isTimeAttack ? 15 : (isSenbonKnock || isSuddenDeath || isSurpriseAttack ? 20 : 60);
            if(timerBar) timerBar.style.animation = `timer-run ${currentLimit}s linear forwards`;
            timeLeft = currentLimit;
            timerInterval = setInterval(() => {
                if(isAnsweredTakuitsu) return;
                timeLeft--; 
                
                if (isSleepyMode && timeLeft <= 10 && timeLeft > 0) playTickSound();
                
                if(timeLeft <= 0) { 
                    clearInterval(timerInterval); 
                    if (isSleepyMode) {
                        const h = new Date().getHours();
                        if (h >= 21 || h < 5) {
                            playBuzzerSound();
                            if(typeof generateAiMessage === "function") generateAiMessage("wake_up_night", {}, false, true);
                        } else {
                            if(mainArea) mainArea.classList.add('animate-shake', 'bg-red-50');
                            if(typeof generateAiMessage === "function") generateAiMessage("wake_up_day", {}, false, false);
                        }
                    } else {
                        playWhistleSound();
                    }
                }
            }, 1000);
        }

    } else {
        const tUi = document.getElementById('takuitsu-ui'); if(tUi) tUi.classList.add('hidden');
        const sUi = document.getElementById('sentaku-ui'); if(sUi) sUi.classList.remove('hidden');
        const aTak = document.getElementById('action-takuitsu'); if(aTak) aTak.classList.add('hidden');
        const aSen = document.getElementById('action-sentaku'); if(aSen) aSen.classList.remove('hidden');
        const tts = document.getElementById('tts-area'); if(tts) { tts.classList.remove('hidden'); tts.classList.add('flex'); }
        const alc = document.getElementById('alchemy-btn'); if(alc) alc.classList.remove('hidden');
        
        clearInterval(timerInterval);
        const timerBar = document.getElementById('timer-bar');
        if(timerBar) timerBar.style.animation = 'none';
        
        eliminatedWords.clear();
        currentAnswers = { 'A': q.正解A, 'B': q.正解B, 'C': q.正解C, 'D': q.正解D, 'E': q.正解E };
        let dummies = q.ダミー ? q.ダミー.split(',') : [];
        currentWordBank = [q.正解A, q.正解B, q.正解C, q.正解D, q.正解E, ...dummies].filter(w=>w).slice(0,20);
        currentWordBank.sort(() => Math.random() - 0.5);

        let htmlText = q.問題文.replace(/\n/g, '<br>');
        ['A','B','C','D','E'].forEach(letter => {
            let options = `<option value="" selected disabled>【 ${letter} 】</option>`;
            currentWordBank.forEach((word, idx) => { options += `<option value="${word}" class="opt-word">${idx+1}. ${word}</option>`; });
            const selectHtml = `<select data-letter="${letter}" class="inline-select" onchange="syncSelects('${letter}', this.value)">${options}</select>`;
            htmlText = htmlText.replace(new RegExp(`【${letter}】`, 'g'), selectHtml);
        });
        const qtSen = document.getElementById('question-text-sentaku'); if(qtSen) qtSen.innerHTML = htmlText;

        const wbContainer = document.getElementById('word-bank-container');
        if(wbContainer) {
            wbContainer.innerHTML = "";
            currentWordBank.forEach((word, idx) => {
                wbContainer.innerHTML += `<div id="word-btn-${idx}" onclick="toggleStrike('${word}', this)" class="cursor-pointer border border-slate-300 p-1 md:p-2 rounded md:rounded-lg text-center hover:bg-slate-50 transition-all select-none bg-white"><span class="word-num">${idx+1}</span>${word}</div>`;
            });
        }
        
        if (isHardcore) {
            document.querySelectorAll('.inline-select').forEach(sel => {
                sel.disabled = true;
                sel.classList.add('opacity-50', 'bg-slate-200', 'cursor-not-allowed');
            });
            const hcA = document.getElementById('hardcore-unlock-area'); if(hcA) { hcA.classList.remove('hidden'); hcA.classList.add('flex'); }
            const nsa = document.getElementById('normal-sentaku-actions'); if(nsa) { nsa.classList.add('hidden'); nsa.classList.remove('flex'); }
        } else {
            const hcA = document.getElementById('hardcore-unlock-area'); if(hcA) { hcA.classList.add('hidden'); hcA.classList.remove('flex'); }
            const nsa = document.getElementById('normal-sentaku-actions'); if(nsa) { nsa.classList.remove('hidden'); nsa.classList.add('flex'); }
        }
    }

    if (isFirstOfSet && typeof generateAiMessage === "function") {
        if(isTimeAttack) generateAiMessage("start_timeattack", { textOnly: false });
        else if(isBonusMode) generateAiMessage("start_bonus", { textOnly: false });
        else if(isSenbonKnock) generateAiMessage("start_senbon", { textOnly: true });
        else if(isSurpriseAttack) generateAiMessage("start_surprise", { textOnly: false });
        else if(!isSuddenDeath && !isCountdownRelay && !isTrapMode && !isHardcore) {
            generateAiMessage(`start_${q._type === '択一' ? 'takuitsu' : 'sentaku'}`, { textOnly: false });
        }
    }
    if (typeof verifyDataWithPro === "function") verifyDataWithPro(q);
    currentQuestionStartTime = Date.now();
}

function answerTakuitsu(userAnswer) {
    if (isAnsweredTakuitsu) return;
    isAnsweredTakuitsu = true;
    
    const mainArea = document.getElementById('main-area');
    if (mainArea) mainArea.classList.remove('animate-shake', 'bg-red-50');
    
    stopStudyTimer(); 
    flushStudyTimes(); 
    
    const q = currentQuestions[currentIndex];
    if (!isCountdownRelay) {
        clearInterval(timerInterval); 
        const tbar = document.getElementById('timer-bar'); if(tbar) tbar.style.animationPlayState = 'paused';
    }
    
    const btnMaru = document.getElementById('btn-takuitsu-maru');
    const btnBatsu = document.getElementById('btn-takuitsu-batsu');
    if(btnMaru && btnBatsu) {
        btnMaru.disabled = true; btnBatsu.disabled = true;
        btnMaru.classList.add('cursor-not-allowed'); btnBatsu.classList.add('cursor-not-allowed');
        
        if (userAnswer === '〇') {
            btnMaru.classList.add('ring-4', 'ring-blue-500');
            btnBatsu.classList.add('opacity-30');
        } else {
            btnBatsu.classList.add('ring-4', 'ring-red-500');
            btnMaru.classList.add('opacity-30');
        }
    }
    
    const correctStr = (q.正誤 || "").trim();
    const isCorrect = (userAnswer === '〇' && (correctStr === '〇' || correctStr === '○')) || (userAnswer === '✖' && (correctStr === '✖' || correctStr === '×'));

    lastAnswerWasCorrect = isCorrect;
    if (isCorrect) {
        setCorrectCount++;
        playCorrectSound();
        if (isCountdownRelay) countdownTimeLeft += 5; 
    } else {
        todayMistakes.push(q);
        playWrongSound();
        if (isSuddenDeath) {
            isSuddenDeathGameOver = true;
        }
    }
    
    cumulativeQuestions++;
    if (isSenbonKnock || isTimeAttack || isBonusMode || isSuddenDeath || isCountdownRelay || isTrapMode || isSurpriseAttack) {
        eventQuestionsAnswered++;
        if (isCorrect) eventCorrectCount++;
    }
    
    saveToGAS(q._id, 'save_answer', isCorrect, null, null);
    
    const aTak = document.getElementById('action-takuitsu'); if(aTak) aTak.classList.add('hidden');
    const eArea = document.getElementById('explanation-area'); if(eArea) { eArea.classList.remove('hidden'); eArea.classList.add('flex'); }
    
    const evalArea = document.getElementById('self-eval-area-takuitsu');
    if(evalArea) { evalArea.classList.remove('hidden'); evalArea.classList.add('block', '!block'); }
    
    const badge = document.getElementById('score-badge');
    if(badge) {
        badge.textContent = isCorrect ? "大正解！ 🎉" : "不正解... 💦";
        badge.className = isCorrect ? "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-green-500 shadow-md mb-2 animate-bounce" : "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-red-500 shadow-md mb-2";
    }
    const aText = document.getElementById('article-text'); if(aText) aText.textContent = q.根拠条文 || "条文なし";
    const eText = document.getElementById('explanation-text'); if(eText) eText.innerHTML = q.解説 || "解説なし";
    
    const eGuide = document.getElementById('eval-guide-text-takuitsu');
    if(eGuide) {
        if (!isSenbonKnock && !isTimeAttack && !isBonusMode && !isSuddenDeath && !isCountdownRelay && !isTrapMode && !isSurpriseAttack) {
            if (currentIndex >= currentQuestions.length - 1) {
                eGuide.textContent = "自己評価を選んでセットを完了してね！";
            } else {
                eGuide.textContent = "自己評価を選んで次へ進んでね！";
            }
        }
    }

    startIdleTimers(); 
    
    if (isSenbonKnock || isSuddenDeath || isCountdownRelay || isSurpriseAttack) {
        const aiEl = document.getElementById('ai-message');
        if(aiEl) {
            aiEl.textContent = isCorrect ? "はい、次！" : "遅い！次！";
            aiEl.classList.remove('text-red-500');
        }
    } else {
        if (typeof generateAiMessage === "function") generateAiMessage("answer_takuitsu", { isCorrect: isCorrect, explanation: q.解説, textOnly: true });
    }
}

function showHintTakuitsu() {
    const q = currentQuestions[currentIndex];
    if (typeof generateAiMessage === "function") generateAiMessage("hint_takuitsu", { questionText: q.問題文, explanation: q.解説 || "", textOnly: true });
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
function showHintSentaku() {
    const qArea = document.getElementById('question-text-sentaku');
    if(!qArea) return;
    let text = qArea.innerHTML;
    text = text.replace(/(なければならない|努め|こと|また|ただし|において|ため)/g, '<span class="highlight-clue">$1</span>');
    qArea.innerHTML = text;
    if (typeof generateAiMessage === "function") generateAiMessage("hint_sentaku", { textOnly: true });
}
function fillRandomAnswers() {
    ['A','B','C','D','E'].forEach(letter => {
        let randomWord = currentWordBank[Math.floor(Math.random() * currentWordBank.length)];
        syncSelects(letter, randomWord);
    });
}

function submitSentakuAnswers() {
    let hasUnanswered = false; let userAns = {};
    ['A','B','C','D','E'].forEach(letter => {
        const s = document.querySelector(`.inline-select[data-letter="${letter}"]`);
        if(!s || !s.value) hasUnanswered = true; else userAns[letter] = s.value;
    });
    if(hasUnanswered) { 
        const wModal = document.getElementById('warning-modal');
        if(wModal) { wModal.classList.remove('hidden'); wModal.classList.add('flex'); }
        return; 
    }

    stopStudyTimer(); 
    flushStudyTimes(); 

    let score = 0; let trapsPicked = [];
    currentFullText = currentQuestions[currentIndex].問題文; 

    ['A','B','C','D','E'].forEach(letter => {
        const s = document.querySelector(`.inline-select[data-letter="${letter}"]`);
        const val = s.value; const correct = currentAnswers[letter];
        currentFullText = currentFullText.replace(new RegExp(`【${letter}】`, 'g'), correct); 

        const span = document.createElement('span');
        span.className = 'mx-1 inline-block align-baseline';
        if(val === correct) {
            score++; span.innerHTML = `<span class="bg-blue-100 text-blue-800 border-b md:border-b-2 border-blue-500 font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-sm">${correct}</span>`;
        } else {
            trapsPicked.push(val);
            span.innerHTML = `<span class="bg-red-100 text-red-600 line-through font-bold px-1 rounded">${val}</span><span class="text-slate-400 mx-1 text-xs">➡</span><span class="bg-blue-100 text-blue-800 border-b md:border-b-2 border-blue-500 font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-sm">${correct}</span>`;
        }
        document.querySelectorAll(`.inline-select[data-letter="${letter}"]`).forEach(el => {
            if(el.parentNode) el.parentNode.replaceChild(span.cloneNode(true), el);
        });
    });

    if (score === 5) playCorrectSound();
    else playWrongSound();

    cumulativeQuestions++;
    if (isSenbonKnock || isTimeAttack || isBonusMode || isHardcore || isSurpriseAttack) {
        eventQuestionsAnswered++;
        if (score === 5) eventCorrectCount++;
    }
    
    saveToGAS(currentQuestions[currentIndex]._id, 'save_sentaku', false, score, trapsPicked.join(','));

    const aSen = document.getElementById('action-sentaku'); if(aSen) aSen.classList.add('hidden');
    const eArea = document.getElementById('explanation-area'); if(eArea) { eArea.classList.remove('hidden'); eArea.classList.add('flex'); }
    
    const evalAreaSentaku = document.getElementById('self-eval-area-sentaku');
    if(evalAreaSentaku) { evalAreaSentaku.classList.remove('hidden'); evalAreaSentaku.classList.add('block', '!block'); }
    
    const badge = document.getElementById('score-badge');
    if(badge) {
        badge.textContent = `${score} / 5 点`;
        badge.className = score === 5 ? "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-green-500 shadow-md mb-2 animate-bounce" : "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-red-500 shadow-md mb-2";
    }
    const aText = document.getElementById('article-text'); if(aText) aText.textContent = currentQuestions[currentIndex].根拠条文 || "条文なし";
    const eText = document.getElementById('explanation-text'); if(eText) eText.innerHTML = currentQuestions[currentIndex].解説 || "解説なし";

    const evalTargetContainer = document.getElementById('eval-target-buttons');
    if(evalTargetContainer) {
        evalTargetContainer.innerHTML = '<span id="eval-target-label" class="text-[10px] md:text-xs font-bold text-slate-500 self-center mr-1 md:mr-2">対象:</span>';
        ['A','B','C','D','E'].forEach(letter => {
            evalTargetContainer.innerHTML += `<label class="eval-target-box flex items-center gap-1 cursor-pointer bg-slate-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-slate-300"><input type="checkbox" name="eval-target" value="${letter}"><span class="font-bold text-xs md:text-sm">${letter}</span></label>`;
        });
    }
    const bnSen = document.getElementById('btn-next-sentaku');
    if(bnSen) {
        if (currentIndex >= currentQuestions.length - 1) {
            bnSen.textContent = (currentPlaylistIndex < playlistQueue.length - 1) ? "🟢 次の科目セットへ" : "🟢 特訓終了！判定へ";
        }
    }
    
    startIdleTimers(); 
    if (typeof generateAiMessage === "function") generateAiMessage("result_sentaku", { score: score, textOnly: false });
}
function closeWarningModal() { const w = document.getElementById('warning-modal'); if(w) { w.classList.add('hidden'); w.classList.remove('flex'); } }

async function saveToGAS(q_id, actionStr, isCorrect, score, traps) {
    try {
        let payload = { action: actionStr, q_id: q_id };
        if (actionStr === 'save_answer') payload.is_correct = isCorrect;
        if (actionStr === 'save_sentaku') { payload.score = score; payload.traps = traps; }
        const res = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(payload) });
        const data = await res.json();
        if(data.success && userHistory[q_id]) {
            userHistory[q_id].playCount = data.playCount;
            userHistory[q_id].correctCount = data.correctCount;
        }
    } catch(e) {}
}

function selectEvalTakuitsu(status) {
    currentTakuitsuEval = status;
    const btns = {
        '完璧': document.getElementById('eval-btn-kanpeki'),
        '迷った': document.getElementById('eval-btn-mayotta'),
        'わからん': document.getElementById('eval-btn-wakaran')
    };
    
    for (let key in btns) {
        if(btns[key]) {
            if (key === status) {
                btns[key].classList.remove('opacity-40');
                btns[key].classList.add('ring-2', 'ring-offset-2', 'ring-slate-400');
            } else {
                btns[key].classList.add('opacity-40');
                btns[key].classList.remove('ring-2', 'ring-offset-2', 'ring-slate-400');
            }
        }
    }
    
    const nextBtn = document.getElementById('btn-next-takuitsu');
    if(nextBtn) {
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        nextBtn.textContent = "次の問題へ ➡";
    }
}

function submitEvalAndNext() {
    if (!isSenbonKnock && !isTimeAttack && !isBonusMode && !isSuddenDeath && !isCountdownRelay && !isTrapMode && !isSurpriseAttack) {
        if (!currentTakuitsuEval) return; 
        clearIdleTimers(); 
        const q = currentQuestions[currentIndex];
        
        fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'save_status', q_id: q._id, status: currentTakuitsuEval }) });
        
        if(!userHistory[q._id]) userHistory[q._id] = {};
        userHistory[q._id].status = currentTakuitsuEval;
    }
    nextQuestion();
}

function markEvalSentaku(status) {
    clearIdleTimers(); 
    const checkedBoxes = Array.from(document.querySelectorAll('input[name="eval-target"]:checked'));
    const checked = checkedBoxes.map(cb => cb.value);
    if(checked.length === 0) { alert("対象の空欄(A~E)を選択してください"); return; }
    const statusStr = `${status}(${checked.join(',')})`;
    const q = currentQuestions[currentIndex];
    fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'save_status', q_id: q._id, status: statusStr }) });
    checkedBoxes.forEach(cb => {
        if(cb.parentElement) cb.parentElement.classList.add('opacity-30', 'bg-yellow-200'); cb.checked = false;
    });
    nextQuestion();
}

async function cancelMistake() {
    if(confirm("直近の解答記録を取り消しますか？")) {
        const q = currentQuestions[currentIndex];
        try {
            await fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'cancel_answer', q_id: q._id, was_correct: lastAnswerWasCorrect }) });
            if(q._type === '択一') {
                if(lastAnswerWasCorrect && setCorrectCount > 0) setCorrectCount--; else if(!lastAnswerWasCorrect) todayMistakes.pop();
                if (isSenbonKnock || isTimeAttack || isBonusMode || isSuddenDeath || isCountdownRelay || isTrapMode || isSurpriseAttack) {
                    if(lastAnswerWasCorrect && eventCorrectCount > 0) eventCorrectCount--;
                }
            }
            cumulativeQuestions--; 
            if (isSenbonKnock || isTimeAttack || isBonusMode || isSuddenDeath || isCountdownRelay || isTrapMode || isHardcore || isSurpriseAttack) eventQuestionsAnswered--;
            
            const aiMsg = document.getElementById('ai-message');
            if(aiMsg) aiMsg.textContent = "記録を取り消したよ！次から気をつけてね！";
        } catch(e) { alert("取り消しに失敗しました"); }
    }
}

function applyFixToGAS() {
    if(!pendingFixData) return;
    const q = currentQuestions[currentIndex];
    
    let localFixes = {};
    try { localFixes = JSON.parse(localStorage.getItem('local_fixes') || '{}'); } catch(e){}
    localFixes[q._id] = pendingFixData;
    localStorage.setItem('local_fixes', JSON.stringify(localFixes));
    
    if(q._type === '択一' && pendingFixData.correctChoice) {
        q.正誤 = pendingFixData.correctChoice;
    }
    q.解説 = pendingFixData.newExplanation || q.解説;
    q._verified = true;
    
    let ignored = {};
    try { ignored = JSON.parse(localStorage.getItem('ignored_fixes') || '{}'); } catch(e){}
    if(ignored[q._id]) {
        delete ignored[q._id];
        localStorage.setItem('ignored_fixes', JSON.stringify(ignored));
    }
    
    const fAct = document.getElementById('ai-fix-action'); if(fAct) fAct.classList.add('hidden');
    const iBad = document.getElementById('ignored-fix-badge'); if(iBad) iBad.classList.add('hidden');
    
    if (typeof generateAiMessage === "function") generateAiMessage("apply_fix", { textOnly: true });
    pendingFixData = null;
}

function ignoreFix() {
    if(!pendingFixData) return;
    const q = currentQuestions[currentIndex];
    let ignored = {};
    try { ignored = JSON.parse(localStorage.getItem('ignored_fixes') || '{}'); } catch(e){}
    ignored[q._id] = pendingFixData;
    localStorage.setItem('ignored_fixes', JSON.stringify(ignored));
    
    const fAct = document.getElementById('ai-fix-action'); if(fAct) fAct.classList.add('hidden');
    const iBad = document.getElementById('ignored-fix-badge'); if(iBad) iBad.classList.remove('hidden');
    
    if (typeof generateAiMessage === "function") generateAiMessage("ignore_fix", { textOnly: true });
}

function showIgnoredFix() {
    if(!pendingFixData) return;
    const fRes = document.getElementById('ai-fix-reason'); if(fRes) fRes.textContent = pendingFixData.reason;
    const fAct = document.getElementById('ai-fix-action'); if(fAct) fAct.classList.remove('hidden');
}

function surrenderSenbonKnock() {
    const btn = document.getElementById('btn-surrender'); if(btn) btn.classList.add('hidden');
    currentIndex = currentQuestions.length; 
    nextQuestion();
}

function checkSpecialEvents() {
    let triggered = false;
    
    if (!eventTriggeredThisSession && initialGlobalTime >= 5400 && globalTimeLeftSeconds !== null && globalTimeLeftSeconds >= 600 && globalTimeLeftSeconds <= 900) {
        eventTriggeredThisSession = true;
        let isSudden = Math.random() < 0.5;
        let subjList = ["労働基準法(択一)", "安全衛生法(択一)", "健康保険法(択一)", "厚生年金保険法(択一)"];
        let pool = allDatabase.filter(q => q._subjectName === subjList[0] && q._type === '択一');
        let qs = pool.sort(()=>Math.random()-0.5).slice(0, 10);
        
        playlistQueue = [{ subjectName: subjList[0], chapterName: isSudden ? "☠️ サドンデス" : "⏱️ カウントダウン", type: "択一", questions: qs }];
        currentPlaylistIndex = 0; currentIndex = 0;
        resetGameFlags();
        if (isSudden) isSuddenDeath = true;
        else { isCountdownRelay = true; startCountdownRelayTimer(); }
        
        if (typeof generateAiMessage === "function") generateAiMessage(isSudden ? "start_suddendeath" : "start_relay", { textOnly: false });
        startNextPlaylistSet();
        return true;
    }
    
    let today = new Date().toDateString();
    let trapDone = localStorage.getItem('trap_done_date');
    if (continuousStudyTimeSec >= 3600 && trapDone !== today && Math.random() < 0.25) {
        localStorage.setItem('trap_done_date', today);
        let pool = allDatabase.filter(q => q._type === '択一' && userHistory[q._id] && userHistory[q._id].playCount > 0);
        pool = pool.filter(q => {
            let hist = userHistory[q._id];
            let rate = hist.playCount > 0 ? (hist.correctCount / hist.playCount) : 1;
            let lastAns = hist.historyStr ? hist.historyStr.split(',').pop() : '';
            return rate < 0.5 || lastAns === '✖';
        });
        if (pool.length >= 10) {
            let qs = pool.sort(()=>Math.random()-0.5).slice(0, 10);
            playlistQueue = [{ subjectName: "😈 悪魔の罠", chapterName: "ひっかけ特化", type: "択一", questions: qs }];
            currentPlaylistIndex = 0; currentIndex = 0;
            resetGameFlags();
            isTrapMode = true;
            if (typeof generateAiMessage === "function") generateAiMessage("start_trap", { textOnly: false });
            startNextPlaylistSet();
            return true;
        }
    }
    
    let lastSet = playlistQueue[playlistQueue.length - 1];
    if (lastSet && lastSet.type === '選択' && !isHardcore) {
        let sentakuPool = allDatabase.filter(q => q._type === '選択');
        let playedSum = sentakuPool.reduce((sum, q) => sum + (userHistory[q._id] ? userHistory[q._id].playCount : 0), 0);
        let avgPlay = playedSum / (sentakuPool.length || 1);
        let todaySentakuCount = parseInt(localStorage.getItem('today_sentaku_count') || '0');
        
        if (avgPlay >= 3 && todaySentakuCount >= 30 && Math.random() < 0.5) {
            let qs = sentakuPool.sort(()=>Math.random()-0.5).slice(0, 5);
            playlistQueue = [{ subjectName: "💀 ハードコア", chapterName: "語群没収", type: "選択", questions: qs }];
            currentPlaylistIndex = 0; currentIndex = 0;
            resetGameFlags();
            isHardcore = true;
            if (typeof generateAiMessage === "function") generateAiMessage("start_hardcore", { textOnly: false });
            startNextPlaylistSet();
            return true;
        }
    }
    
    if (continuousStudyTimeSec >= 1800 && Math.random() < 0.15) {
        let pool = allDatabase.filter(q => userHistory[q._id] && userHistory[q._id].playCount > 0);
        pool = pool.filter(q => {
            let hist = userHistory[q._id];
            let maxScore = q._type === '選択' ? (hist.playCount * 5) : hist.playCount;
            let rate = hist.playCount > 0 ? (hist.correctCount / maxScore) : 1;
            let lastAns = hist.historyStr ? hist.historyStr.split(',').pop() : '';
            return rate < 0.5 || lastAns === '✖' || (q._type === '選択' && !lastAns.includes('5点'));
        });
        if (pool.length >= 1) {
            let qs = pool.sort(()=>Math.random()-0.5).slice(0, 1);
            playlistQueue = [{ subjectName: "🎯 不意打ちの1問", chapterName: "油断大敵", type: qs[0]._type, questions: qs }];
            currentPlaylistIndex = 0; currentIndex = 0;
            resetGameFlags();
            isSurpriseAttack = true;
            if (typeof generateAiMessage === "function") generateAiMessage("start_surprise", { textOnly: false });
            startNextPlaylistSet();
            return true;
        }
    }
    
    return false;
}

function nextQuestion() {
    clearIdleTimers();
    stopAudio();
    
    if (isSuddenDeathGameOver) {
        finishAllPlaylists();
        return;
    }
    
    currentIndex++;
    
    if (currentIndex >= currentQuestions.length) {
        
        if (isSuddenDeath || isCountdownRelay) {
            let subjList = ["労働基準法(択一)", "安全衛生法(択一)", "健康保険法(択一)", "厚生年金保険法(択一)"];
            let currentSubj = currentQuestions[0]._subjectName;
            let nextSubjIdx = (subjList.indexOf(currentSubj) + 1) % subjList.length;
            let nextSubj = subjList[nextSubjIdx];
            let pool = allDatabase.filter(q => q._subjectName === nextSubj && q._type === '択一');
            let qs = pool.sort(()=>Math.random()-0.5).slice(0, 10);
            
            playlistQueue.push({ subjectName: nextSubj, chapterName: isSuddenDeath ? "☠️ サドンデス" : "⏱️ カウントダウン", type: "択一", questions: qs });
            currentPlaylistIndex++;
            startNextPlaylistSet();
            return;
        }
        
        currentPlaylistIndex++;
        if (currentPlaylistIndex < playlistQueue.length) {
            startNextPlaylistSet();
        } else {
            if (checkSpecialEvents()) return;
            
            if (isTimeUp && continuousStudyTimeSec >= 3600 && !isExtensionAdded) {
                if (typeof judgeTimeUpExtension === "function") judgeTimeUpExtension();
                else finishAllPlaylists();
            } else if (!hasRestRecommended && !isSenbonKnock && !isTimeAttack && !isBonusMode) {
                if (typeof judgeRestRecommendation === "function") judgeRestRecommendation();
                else finishAllPlaylists();
            } else {
                finishAllPlaylists();
            }
        }
    } else { 
        loadQuestion(currentQuestions[currentIndex].解説 && currentQuestions[currentIndex].解説.includes('錬金術'), false); 
    }
}

// 🌟 延長戦判定と自動休憩提案
async function judgeTimeUpExtension() {
    isExtensionAdded = true; 
    const aiMessageEl = document.getElementById('ai-message');
    if(aiMessageEl) aiMessageEl.innerHTML = '<span class="typing">💬 延長戦するか考えてるよ...</span>';
    
    const condSelect = document.getElementById('condition-select');
    const cond = condSelect ? condSelect.value : '普通';
    const bks = '`' + '`' + '`';
    
    let prompt = `あなたは社労士試験の専属講師（若い女性）です。受講生の目標時間が今終わりました。モードは「${cond}」です。
受講生を少し休ませて「終了」させるか、限界を超えるため「延長戦（1〜3問、または千本ノック）」を追加するか性格に基づいて判定してください。
以下のJSONで返してください。メッセージは定型文を使わず、現代の自然な口語（1〜2文、アニメ口調絶対禁止）で。\n` + 
bks + `json
{ "action": "end" または "extend", "eventType": "normal", "senbonKnock", "timeAttack", "bonus", "count": 1〜10の数字, "message": "セリフ" }
` + bks;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text;
        
        const regex = new RegExp(bks + "json\\n([\\s\\S]*?)\\n" + bks);
        const jsonMatch = text.match(regex);
        
        if (jsonMatch) {
            let judge = JSON.parse(jsonMatch[1]);
            if(aiMessageEl) { aiMessageEl.textContent = judge.message; }
            if(typeof speakText === "function") speakText(judge.message);
            
            if (judge.action === 'extend') {
                hasRestRecommended = true; 
                eventQuestionsAnswered = 0; eventCorrectCount = 0; 
                
                let qs = [];
                let pool = allDatabase.filter(q => q._type === '択一');
                
                if (cond === '厳しめ' || judge.eventType === 'senbonKnock') {
                    isSenbonKnock = true;
                    qs = pool.filter(q => !userHistory[q._id] || userHistory[q._id].playCount === 0).slice(0, 50);
                    if(qs.length < 50) qs = qs.concat(pool.sort(()=>Math.random()-0.5)).slice(0,50);
                    playlistQueue.push({ subjectName: "👹 千本ノック", chapterName: "降参するまで終わらない", questions: qs });
                } else if (cond === '熱血' || judge.eventType === 'timeAttack') {
                    isTimeAttack = true;
                    qs = pool.sort(()=>Math.random()-0.5).slice(0, 10);
                    playlistQueue.push({ subjectName: "🔥 タイムアタック", chapterName: "15秒決戦", questions: qs });
                } else if (cond === '普通' || judge.eventType === 'bonus') {
                    isBonusMode = true;
                    qs = pool.filter(q => userHistory[q._id] && userHistory[q._id].status === '完璧').slice(0,10);
                    if(qs.length < 10) qs = pool.sort(()=>Math.random()-0.5).slice(0,10);
                    playlistQueue.push({ subjectName: "🌱 ご褒美モード", chapterName: "自信回復！", questions: qs });
                } else {
                    qs = pool.sort(()=>Math.random()-0.5).slice(0, judge.count || 3);
                    playlistQueue.push({ subjectName: "🔥 延長戦", chapterName: "AIからの挑戦状", questions: qs });
                }
                
                startNextPlaylistSet();
                return;
            }
        }
    } catch(e) {}
    
    if(typeof judgeRestRecommendation === "function") judgeRestRecommendation();
    else finishAllPlaylists();
}

function acceptRestProposal(minutes) {
    saveRestDecision(`連続${Math.floor(continuousStudyTimeSec/60)}分での${minutes}分休憩提案を受容`);
    startNap(minutes);
}

function rejectRestProposal() {
    saveRestDecision(`連続${Math.floor(continuousStudyTimeSec/60)}分での休憩提案を拒否`);
    const rpMen = document.getElementById('rest-proposal-menu-takuitsu');
    if(rpMen) { rpMen.classList.add('hidden'); rpMen.classList.remove('flex'); }
    finishAllPlaylists();
}

function saveRestDecision(log) {
    let decisions = [];
    try { decisions = JSON.parse(localStorage.getItem('rest_decisions') || '[]'); } catch(e){}
    decisions.push(log);
    if(decisions.length > 5) decisions.shift(); 
    localStorage.setItem('rest_decisions', JSON.stringify(decisions));
}

async function judgeRestRecommendation() {
    if (sessionTotalTimeSec < 5400) { 
        if (continuousStudyTimeSec < 3600) { 
            finishAllPlaylists();
            return;
        }
    } else { 
        if (continuousStudyTimeSec < 2700) { 
            finishAllPlaylists();
            return;
        }
    }
    
    hasRestRecommended = true;
    const aiMessageEl = document.getElementById('ai-message');
    if(aiMessageEl) aiMessageEl.innerHTML = '<span class="typing">💬 休憩について考えてるよ...</span>';
    
    const healthSelect = document.getElementById('health-select');
    const health = healthSelect ? healthSelect.value : '普通';
    const accuracy = cumulativeQuestions > 0 ? Math.round((setCorrectCount / cumulativeQuestions) * 100) : 100;
    const lastNap = localStorage.getItem('last_nap_time') || '記録なし';
    const recentDecisions = localStorage.getItem('rest_decisions') || '[]';
    const bks = '`' + '`' + '`';
    
    let prompt = `あなたは社労士試験の専属講師（若い女性）です。受講生が今のプレイリストを完走しました。
【状態データ】
・現在時刻: ${new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'})}
・アプリ起動からの総経過時間: ${Math.floor(sessionTotalTimeSec / 60)}分
・今回の連続勉強時間: ${Math.floor(continuousStudyTimeSec / 60)}分
・申告された体調: ${health}
・ここまでの正答率: ${accuracy}% (集中力の目安)
・前回の休憩時刻: ${lastNap}
・過去の休憩提案への反応履歴: ${recentDecisions}

このデータから、今すぐ休憩（または仮眠）を促すべきか判定し、休憩が必要ならその分数（5〜30分）を提案してください。履歴を見て「拒否が多い」なら長めに集中できるタイプとして提案を控えめにするなど学習結果を反映して。
以下のJSONで返してください。メッセージは定型文を使わず自然な口語で。\n` + 
bks + `json
{ "recommendRest": true または false, "restMinutes": 5〜30の数字, "message": "セリフ" }
` + bks;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text;
        
        const regex = new RegExp(bks + "json\\n([\\s\\S]*?)\\n" + bks);
        const jsonMatch = text.match(regex);
        
        if (jsonMatch) {
            let judge = JSON.parse(jsonMatch[1]);
            if (judge.recommendRest) {
                if(aiMessageEl) { aiMessageEl.textContent = judge.message; }
                if(typeof speakText === "function") speakText(judge.message);
                
                const expA = document.getElementById('explanation-area');
                if(expA) { expA.classList.remove('hidden'); expA.classList.add('flex'); }
                
                const sTak = document.getElementById('self-eval-area-takuitsu');
                if(sTak) { sTak.classList.remove('hidden'); sTak.classList.add('block', '!block'); }
                
                const sSen = document.getElementById('self-eval-area-sentaku');
                if(sSen) { sSen.classList.add('hidden'); sSen.classList.remove('block', '!block'); }
                
                const tCon = document.getElementById('takuitsu-eval-content');
                if(tCon) tCon.classList.add('hidden');
                const iMenu = document.getElementById('infinite-drill-menu');
                if(iMenu) iMenu.classList.add('hidden');
                
                const rpm = document.getElementById('rest-proposal-menu-takuitsu');
                if(rpm) {
                    rpm.innerHTML = `
                        <p class="text-center text-sm md:text-base font-bold text-slate-600 mb-3">${judge.message}</p>
                        <div class="flex gap-2">
                            <button onclick="acceptRestProposal(${judge.restMinutes})" class="flex-1 bg-indigo-500 text-white font-black py-3 rounded-xl shadow-md active:scale-95 transition-all text-base md:text-lg">💤 ${judge.restMinutes}分 休む</button>
                            <button onclick="rejectRestProposal()" class="flex-1 bg-slate-300 text-slate-700 font-black py-3 rounded-xl shadow-md active:scale-95 transition-all text-base md:text-lg">今は休まず次へ</button>
                        </div>
                    `;
                    rpm.classList.remove('hidden');
                    rpm.classList.add('flex');
                }
                return;
            }
        }
    } catch(e) {}
    
    finishAllPlaylists();
}

function finishAllPlaylists() {
    const eArea = document.getElementById('explanation-area');
    if(eArea) { eArea.classList.remove('hidden'); eArea.classList.add('flex'); }
    
    const seTak = document.getElementById('self-eval-area-takuitsu');
    if(seTak) { seTak.classList.remove('hidden'); seTak.classList.add('block', '!block'); }
    
    const seSen = document.getElementById('self-eval-area-sentaku');
    if(seSen) { seSen.classList.add('hidden'); seSen.classList.remove('block', '!block'); }
    
    const teCon = document.getElementById('takuitsu-eval-content');
    if(teCon) teCon.classList.add('hidden');
    
    const rpmTak = document.getElementById('rest-proposal-menu-takuitsu');
    if(rpmTak) { rpmTak.classList.add('hidden'); rpmTak.classList.remove('flex'); }
    
    const iMenu = document.getElementById('infinite-drill-menu');
    if(iMenu) { iMenu.classList.remove('hidden'); iMenu.classList.add('flex'); }
    
    if (isSenbonKnock || isTimeAttack || isBonusMode || isSuddenDeath || isCountdownRelay || isTrapMode || isHardcore || isSurpriseAttack) {
        let evType = isSenbonKnock ? "senbonKnock" : (isTimeAttack ? "timeAttack" : (isSuddenDeath ? "suddenDeath" : (isCountdownRelay ? "countdownRelay" : (isTrapMode ? "trapMode" : (isHardcore ? "hardcore" : (isSurpriseAttack ? "surpriseAttack" : "bonus"))))));
        if (typeof generateAiMessage === "function") generateAiMessage("end_event", { eventType: evType, qCount: eventQuestionsAnswered, correct: eventCorrectCount, textOnly: false });
    } else {
        sendKarteLog('session_end', { totalAnswered: cumulativeQuestions, mistakes: todayMistakes.length, continuousStudyTimeSec: continuousStudyTimeSec });
        if (typeof generateAiMessage === "function") generateAiMessage("end_all", { totalPlayed: cumulativeQuestions, mistakes: todayMistakes.length, textOnly: false });
    }
}

function startInfiniteDrill(mode) {
    flushStudyTimes();
    
    let newPlaylistQueue = [];
    
    initialPlaylistConfig.forEach(config => {
        let subjName = config.subjectName;
        let chapName = config.chapterName;
        let qType = config.type;
        
        let pool = allDatabase.filter(q => q._subjectName === subjName && q._type === qType);
        let qs = [];
        
        if (mode === 'okawari') {
            let chapPool = pool.filter(q => q.項目 === chapName);
            chapPool.sort((a, b) => {
                let aC = userHistory[a._id] ? userHistory[a._id].playCount : 0;
                let bC = userHistory[b._id] ? userHistory[b._id].playCount : 0;
                return aC - bC;
            });
            qs = chapPool.slice(0, 10);
            if(qs.length > 0) newPlaylistQueue.push({ subjectName: subjName, chapterName: chapName + " (おかわり)", type: qType, questions: qs });
            
        } else if (mode === 'nextChapter') {
            if (chapName === "ミックス" || chapName.includes("作戦決行")) {
                qs = pool.sort(()=>Math.random()-0.5).slice(0, 10);
                if(qs.length > 0) newPlaylistQueue.push({ subjectName: subjName, chapterName: "ミックス", type: qType, questions: qs });
            } else {
                let allChaps = [...new Set(pool.map(q => q.項目))];
                let currentIdx = allChaps.indexOf(chapName);
                let nextChap = allChaps[(currentIdx + 1) % allChaps.length];
                let chapPool = pool.filter(q => q.項目 === nextChap);
                qs = chapPool.sort(()=>Math.random()-0.5).slice(0, 10);
                if(qs.length > 0) newPlaylistQueue.push({ subjectName: subjName, chapterName: nextChap, type: qType, questions: qs });
                config.chapterName = nextChap;
            }
        } else if (mode === 'review') {
            let chapPool = pool.filter(q => q.項目 === chapName);
            if (chapName === "ミックス" || chapName.includes("作戦決行")) chapPool = pool;
            
            let mistakes = chapPool.filter(q => {
                let h = userHistory[q._id];
                if(!h || !h.historyStr) return false;
                let hArr = h.historyStr.split(',');
                let latest = hArr[hArr.length - 1];
                return (q._type === '択一' && latest === '✖') || (q._type === '選択' && !latest.includes('5点'));
            });
            qs = mistakes.slice(0, 10);
            if (qs.length < 10) {
                let remains = chapPool.filter(q => !qs.includes(q)).sort((a,b) => {
                    let aC = userHistory[a._id] ? userHistory[a._id].playCount : 0;
                    let bC = userHistory[b._id] ? userHistory[b._id].playCount : 0;
                    return aC - bC;
                });
                qs = qs.concat(remains.slice(0, 10 - qs.length));
            }
            if(qs.length > 0) newPlaylistQueue.push({ subjectName: subjName, chapterName: chapName + " (復習)", type: qType, questions: qs });
        }
    });

    if (newPlaylistQueue.length === 0) { alert("抽出できる問題がありませんでした。"); return; }
    
    playlistQueue = newPlaylistQueue;
    
    resetGameFlags();
    currentPlaylistIndex = 0; isReviewAdded = false; isExtensionAdded = false; hasRestRecommended = false;
    
    const iMenu = document.getElementById('infinite-drill-menu');
    if(iMenu) { iMenu.classList.add('hidden'); iMenu.classList.remove('flex'); }
    
    const teCon = document.getElementById('takuitsu-eval-content');
    if(teCon) teCon.classList.remove('hidden');
    
    const btns = ['eval-btn-kanpeki', 'eval-btn-mayotta', 'eval-btn-wakaran'];
    btns.forEach(id => {
        let el = document.getElementById(id);
        if(el) {
            el.classList.add('opacity-40');
            el.classList.remove('ring-2', 'ring-offset-2', 'ring-slate-400');
        }
    });
    const nextBtn = document.getElementById('btn-next-takuitsu');
    if(nextBtn) {
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
        nextBtn.textContent = "評価を選択してください";
    }
    
    startNextPlaylistSet(true);
}

async function verifyDataWithPro(q) {
    if (q._verified) return; 
    
    let localFixes = {};
    try { localFixes = JSON.parse(localStorage.getItem('local_fixes') || '{}'); } catch(e){}
    if (localFixes[q._id]) {
        q._verified = true;
        return;
    }
    
    const today = new Date(); const todayStr = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`;
    const prompt = `あなたはデータ検証プロです。【本日の日付】: ${todayStr}。令和9年4月以前に施行される法令を基準に正誤を判断し、間違っていれば「NG | 〇か✖ | 新しい解説 | 理由」で出力。問題なければ「OK」のみ。問題文: ${q.問題文}\n正誤: ${q.正誤}\n解説: ${q.解説}`;
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json(); const text = data.candidates[0].content.parts[0].text;
        q._verified = true; 
        
        if (text.startsWith("NG")) {
            const parts = text.split("|");
            pendingFixData = { question: q, correctChoice: (parts[1]||"").trim(), newExplanation: (parts[2]||"").trim(), reason: (parts[3]||"").trim() };
            
            let ignored = {};
            try { ignored = JSON.parse(localStorage.getItem('ignored_fixes') || '{}'); } catch(e){}
            const badge = document.getElementById('ignored-fix-badge');
            const actionArea = document.getElementById('ai-fix-action');
            const reasonArea = document.getElementById('ai-fix-reason');
            
            if(ignored[q._id]) {
                pendingFixData = ignored[q._id];
                if(badge) badge.classList.remove('hidden');
            } else {
                if(reasonArea) reasonArea.textContent = pendingFixData.reason;
                if(actionArea) actionArea.classList.remove('hidden');
            }
        }
    } catch(e) {}
}

function resumeTimer() { 
    const pOverlay = document.getElementById('pause-overlay');
    if(pOverlay) { pOverlay.classList.add('hidden'); pOverlay.classList.remove('flex'); }
    
    if (pauseInterval) clearInterval(pauseInterval);
    
    const mArea = document.getElementById('main-area');
    const eArea = document.getElementById('explanation-area');
    
    if(mArea && mArea.classList.contains('hidden')) {
        
    } else if(currentQuestions[currentIndex] && eArea && eArea.classList.contains('hidden')) {
        if (currentQuestions[currentIndex]._type === '択一' && !isCountdownRelay) {
            timerInterval = setInterval(() => { 
                timeLeft--; 
                
                if (isSleepyMode && timeLeft <= 10 && timeLeft > 0) playTickSound();
                
                if (timeLeft <= 0) { 
                    playWhistleSound(); clearInterval(timerInterval); 
                    if (isSleepyMode) {
                        const h = new Date().getHours();
                        if (h >= 21 || h < 5) {
                            playBuzzerSound();
                            if(typeof generateAiMessage === "function") generateAiMessage("wake_up_night", {}, false, true);
                        } else {
                            if(mArea) mArea.classList.add('animate-shake', 'bg-red-50');
                            if(typeof generateAiMessage === "function") generateAiMessage("wake_up_day", {}, false, false);
                        }
                    }
                } 
            }, 1000);
        }
        startStudyTimer(); 
    } else if (currentQuestions[currentIndex] && eArea && !eArea.classList.contains('hidden')) {
        startIdleTimers(); 
    }
}
function openNapMenu() { stopStudyTimer(); clearIdleTimers(); const nOverlay = document.getElementById('nap-overlay'); if(nOverlay) { nOverlay.classList.remove('hidden'); nOverlay.classList.add('flex'); } if(typeof generateAiMessage === "function") generateAiMessage("nap_start", { textOnly: true });}
function cancelNapMenu() { const nOverlay = document.getElementById('nap-overlay'); if(nOverlay) { nOverlay.classList.add('hidden'); nOverlay.classList.remove('flex'); } resumeTimer(); }
function startNap(minutes) { 
    napSecondsLeft = minutes * 60; 
    localStorage.setItem('last_nap_time', new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'}));
    sendKarteLog('nap_start', { time: new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'}), durationMinutes: minutes }); 
    runNapTimer(); 
}
function startNapCustom() {
    const tInput = document.getElementById('nap-time-input');
    if(!tInput) return;
    const timeStr = tInput.value; if(!timeStr) { alert("時刻を入力してね"); return; }
    const [h, m] = timeStr.split(':'); const target = new Date(); target.setHours(parseInt(h), parseInt(m), 0);
    if(target <= new Date()) target.setDate(target.getDate() + 1); 
    napSecondsLeft = Math.floor((target - new Date()) / 1000); 
    let durationMinutes = Math.round(napSecondsLeft / 60);
    localStorage.setItem('last_nap_time', new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'}));
    sendKarteLog('nap_start', { time: new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'}), durationMinutes: durationMinutes }); 
    runNapTimer();
}
function runNapTimer() {
    unlockAudio(); 
    const nSetup = document.getElementById('nap-setup'); if(nSetup) nSetup.classList.add('hidden'); 
    const nRun = document.getElementById('nap-running'); if(nRun) { nRun.classList.remove('hidden'); nRun.classList.add('flex'); }
    const eArea = document.getElementById('explanation-area'); if(eArea) { eArea.classList.add('hidden'); eArea.classList.remove('flex'); }
    const seTak = document.getElementById('self-eval-area-takuitsu'); if(seTak) seTak.classList.add('hidden');
    updateNapDisplay();
    napInterval = setInterval(() => {
        napSecondsLeft--; updateNapDisplay();
        if(napSecondsLeft <= 0) { 
            clearInterval(napInterval); playAlarmSound(); 
            const nCD = document.getElementById('nap-countdown'); if(nCD) nCD.classList.add('animate-ping', 'text-red-500'); 
        }
    }, 1000);
}
function updateNapDisplay() {
    let m = Math.floor(Math.max(0, napSecondsLeft) / 60).toString().padStart(2, '0'); let s = (Math.max(0, napSecondsLeft) % 60).toString().padStart(2, '0');
    const nCD = document.getElementById('nap-countdown');
    if(nCD) nCD.textContent = `${m}:${s}`;
}
function stopNap() {
    clearInterval(napInterval); if(beepInterval) clearInterval(beepInterval);
    const nCD = document.getElementById('nap-countdown'); if(nCD) nCD.classList.remove('animate-ping', 'text-red-500');
    const nOverlay = document.getElementById('nap-overlay'); if(nOverlay) { nOverlay.classList.add('hidden'); nOverlay.classList.remove('flex'); }
    
    continuousStudyTimeSec = 0;
    finishAllPlaylists();
    if (typeof generateAiMessage === "function") generateAiMessage("nap_end", { textOnly: true }); 
}