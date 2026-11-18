const GAS_URL = "https://script.google.com/macros/s/AKfycbxNQUvUpps4yicC1i3DkbwCwBAwlHPcvbuX0Yhe33TccNtCGasr820HRNbEuLjJmZqs5Q/exec";

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
    // 労基法
    "1 労働憲章、適用等": "1 労働基準法の基本理念", "労働者・使用者の定義等": "1 労働基準法の基本理念", "1 労働基準法の基本理念等": "1 労働基準法の基本理念", "労働基準法の基本理念等": "1 労働基準法の基本理念",
    "3 労働契約の締結": "2 労働契約", "4 労働契約の終了等": "2 労働契約", "2 労働契約等": "2 労働契約", "労働契約等": "2 労働契約",
    "3 賃金": "3 賃金、賃金の支払の5原則", "賃金、賃金の支払の5原則": "3 賃金、賃金の支払の5原則",
    "休憩、休日": "4 労働時間、休憩、休日",
    "5 変形労働時間制": "5 労働時間、変形労働時間制", "労働時間、変形労働時間制": "5 労働時間、変形労働時間制",
    "6 時間外労働・休日労働": "6 時間外・休日労働、割増賃金", "時間外・休日労働、割増賃金": "6 時間外・休日労働、割増賃金",
    "みなし労働時間制": "労働時間の計算等",
    "年次有給休暇": "8 年次有給休暇", "年少者、妊産婦等": "9 年少者、妊産婦等",
    "就業規則等": "就業規則、監督等その他", "就業規則、監督等その他": "就業規則、監督等その他",
    "選択式（労働基準法及び労働安全衛生法）": "雑則等", "雑則等": "雑則等",
    
    // 安衛法
    "1 総則等": "1 総則等",
    "全産業の安全衛生管理体制": "1 安全衛生管理体制等", "委員会": "1 安全衛生管理体制等", "1 安全衛生管理体制等": "1 安全衛生管理体制等",
    "機械等に関する規制": "2 機械等及び危険・有害物に関する規制", "危険物及び有害物に関する規制": "2 機械等及び危険・有害物に関する規制", "機械等及び危険・有害物に関する規制": "2 機械等及び危険・有害物に関する規制", "2 機械等及び危険・有害物に関する規制": "2 機械等及び危険・有害物に関する規制",
    "労働者の危険又は健康障害を防止するための措置": "3 労働者の就業管理・健康管理等", "労働者の就業に当たっての措置": "3 労働者の就業管理・健康管理等", "作業環境測定、健康診断": "3 労働者の就業管理・健康管理等", "労働者の就業管理・健康管理等": "3 労働者の就業管理・健康管理等", "3 労働者の就業管理・健康管理等": "3 労働者の就業管理・健康管理等",
    
    // 健康保険法
    "全国健康保険協会": "1 保険者・適用事業所等", "健康保険組合": "1 保険者・適用事業所等", "権限の委任等": "1 保険者・適用事業所等", "5 適用事業所": "1 保険者・適用事業所等", "保険者・適用事業所": "1 保険者・適用事業所等",
    "被保険者の範囲、被保険者から除外される者(適用除": "2 被保険者・被扶養者", "被保険者資格の取得及び喪失、得喪の確認": "2 被保険者・被扶養者", "任意継続被保険者": "2 被保険者・被扶養者", "特例退職被保険者": "2 被保険者・被扶養者", "10 被扶養者": "2 被保険者・被扶養者", "2 被保険者・被扶養者・療養担当者": "2 被保険者・被扶養者",
    "11 事業主による届出": "届出・通知等", "被保険者による届出等": "届出・通知等", "通知": "届出・通知等",
    "14 保険医療機関又は保険薬局": "保険医療機関等・療養担当者", "保険医又は保険薬剤師": "保険医療機関等・療養担当者", "指定訪問看護事業者": "保険医療機関等・療養担当者", "診療報酬": "保険医療機関等・療養担当者",
    "報酬・賞与": "3 報酬・標準報酬月額等", "19 標準報酬の概要": "3 報酬・標準報酬月額等", "20 定時決定": "3 報酬・標準報酬月額等", "資格取得時決定": "3 報酬・標準報酬月額等", "22 随時改定": "3 報酬・標準報酬月額等", "育児休業等終了時改定": "3 報酬・標準報酬月額等", "産前産後休業終了時改定": "3 報酬・標準報酬月額等", "25 報酬月額の算定の特例": "3 報酬・標準報酬月額等", "任意継続被保険者、特例退職被保険者の標準報酬月額": "3 報酬・標準報酬月額等", "標準賞与額": "3 報酬・標準報酬月額等", "3 報酬・標準報酬": "3 報酬・標準報酬月額等",
    "28 国庫負担等": "費用の負担・保険料等", "保険料": "費用の負担・保険料等", "6 費用の負担・保険料": "費用の負担・保険料等", "保険料率": "費用の負担・保険料等", "31 保険料の負担": "費用の負担・保険料等", "32 保険料の納付": "費用の負担・保険料等", "33 督促、滞納処分及び延滞金": "費用の負担・保険料等",
    "療養の給付": "4 保険給付 1 (療養の給付等)", "4 保険給付 1 (療養の給付等)": "4 保険給付 1 (療養の給付等)", "Basic 4 保険給付 1": "4 保険給付 1 (療養の給付等)", "入院時食事療養費": "4 保険給付 1 (療養の給付等)", "入院時生活療養費": "4 保険給付 1 (療養の給付等)", "保険外併用療養費": "4 保険給付 1 (療養の給付等)", "療養費": "4 保険給付 1 (療養の給付等)", "家族療養費": "4 保険給付 1 (療養の給付等)", "訪問看護療養費": "4 保険給付 1 (療養の給付等)", "高額療養費": "4 保険給付 1 (療養の給付等)", "高額介護合算療養費": "4 保険給付 1 (療養の給付等)", "移送費及び家族移送費": "4 保険給付 1 (療養の給付等)", "4 保険給付1": "4 保険給付 1 (療養の給付等)",
    "傷病手当金": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "出産育児一時金及び出産手当金、家族出産育児一時金": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "46 埋葬料及び埋葬費、家族埋葬料": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "資格喪失後の給付": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "保険給付 2 (傷病手当金等・資格喪失後の給付等)": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "48 健康保険組合の付加給付": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "49 給付通則(給付制限以外)": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "給付制限 (給付通則)": "5 保険給付 2 (現金給付・資格喪失後の給付等)", "5 保険給付2": "5 保険給付 2 (現金給付・資格喪失後の給付等)",
    "日雇特例被保険者に関する特例": "日雇特例・保健福祉事業", "保健福祉事業": "日雇特例・保健福祉事業",
    "53 時効": "時効・不服申立て・雑則等", "54 雑則": "時効・不服申立て・雑則等", "55 罰則": "時効・不服申立て・雑則等", "56 不服申立て": "時効・不服申立て・雑則等", "時効・不服申立て等": "時効・不服申立て・雑則等",

    // 厚生年金保険法
    "目的、管掌等": "1 総則・適用事業所等", "適用事業所": "1 総則・適用事業所等",
    "3 被保険者": "2 被保険者・被保険者期間等", "被保険者の資格の得喪の確認": "2 被保険者・被保険者期間等", "5 被保険者期間等": "2 被保険者・被保険者期間等", "6 届出等": "2 被保険者・被保険者期間等", "被保険者に関する原簿等": "2 被保険者・被保険者期間等", "1 被保険者等・標準報酬": "2 被保険者・被保険者期間等",
    "標準報酬月額及び標準賞与額（標準報酬）": "3 標準報酬等",
    "11 裁定等": "4 給付通則等", "5 給付通則等": "4 給付通則等",
    "督促、滞納処分及び延滞金": "5 費用の負担・保険料等", "6 費用の負担・不服申立て等": "5 費用の負担・保険料等", "費用の負担・保険料等": "5 費用の負担・保険料等", 
    "12 本来支給の老齢厚生年金の支給要件": "6 老齢厚生年金", "報酬比例部分の額": "6 老齢厚生年金", "14 経過的加算額": "6 老齢厚生年金", "15 加給年金額": "6 老齢厚生年金", "16 在職老齢年金 (高在老)": "6 老齢厚生年金", "老齢厚生年金の支給の繰上げ": "6 老齢厚生年金", "老齢厚生年金の支給の繰下げ": "6 老齢厚生年金", "特別支給の老齢厚生年金の支給要件・年金額": "6 老齢厚生年金", "特別支給の老齢厚生年金の支給開始年齢": "6 老齢厚生年金", "21 障害者・長期加入者等の特例": "6 老齢厚生年金", "22 雇用保険法の失業等給付との調整": "6 老齢厚生年金", "老齢厚生年金の支給繰上げの特例": "6 老齢厚生年金", "2 老齢厚生年金": "6 老齢厚生年金",
    "障害厚生年金の支給要件": "7 障害厚生年金・障害手当金", "25 障害厚生年金の併給の調整（併合認定）": "7 障害厚生年金・障害手当金", "障害厚生年金等の年金額": "7 障害厚生年金・障害手当金", "障害の程度が変わった場合の年金額の改定": "7 障害厚生年金・障害手当金", "障害厚生年金の支給停止": "7 障害厚生年金・障害手当金", "障害厚生年金の失権": "7 障害厚生年金・障害手当金", "障害手当金": "7 障害厚生年金・障害手当金", "3 障害厚生年金・障害手当金": "7 障害厚生年金・障害手当金", "Step-Up 3 障害厚生年金・障害手当金": "7 障害厚生年金・障害手当金",
    "遺族厚生年金の支給要件": "8 遺族厚生年金・脱退一時金", "遺族": "8 遺族厚生年金・脱退一時金", "4 遺族厚生年金・脱退一時金": "8 遺族厚生年金・脱退一時金", "遺族厚生年金の年金額": "8 遺族厚生年金・脱退一時金", "34 妻に支給する遺族厚生年金の加算額": "8 遺族厚生年金・脱退一時金", "遺族厚生年金の支給停止": "8 遺族厚生年金・脱退一時金", "遺族厚生年金の失権": "8 遺族厚生年金・脱退一時金", "37 脱退一時金": "8 遺族厚生年金・脱退一時金",
    "離婚等をした場合における特例（合意分割）": "9 年金分割の特例", "40 被扶養配偶者である期間についての特例（3号分割）": "9 年金分割の特例",
    "不服申立て・雑則等": "10 不服申立て・雑則等"
};

const CATEGORY_SORT_WEIGHTS = {
    "1 労働基準法の基本理念": 10, "2 労働契約": 20, "3 賃金、賃金の支払の5原則": 30, "4 労働時間、休憩、休日": 40, "5 労働時間、変形労働時間制": 50, "6 時間外・休日労働、割増賃金": 60, "労働時間の計算等": 70, "8 年次有給休暇": 80, "9 年少者、妊産婦等": 90, "就業規則、監督等その他": 100,
    "雑則等": 999,
    
    "1 総則等": 200,
    "1 安全衛生管理体制等": 210, "2 機械等及び危険・有害物に関する規制": 220, "3 労働者の就業管理・健康管理等": 230,
    
    "目的等": 240, "1 保険者・適用事業所等": 250, "2 被保険者・被扶養者": 260, "3 報酬・標準報酬月額等": 270, "届出・通知等": 280, "保険医療機関等・療養担当者": 290, "費用の負担・保険料等": 300, "4 保険給付 1 (療養の給付等)": 310, "5 保険給付 2 (現金給付・資格喪失後の給付等)": 320, "日雇特例・保健福祉事業": 330, "時効・不服申立て・雑則等": 340,
    
    "1 総則・適用事業所等": 350, "2 被保険者・被保険者期間等": 360, "3 標準報酬等": 370, "4 給付通則等": 380,
    "5 費用の負担・保険料等": 390,
    "6 老齢厚生年金": 400, "7 障害厚生年金・障害手当金": 410, "8 遺族厚生年金・脱退一時金": 420, "9 年金分割の特例": 430, "10 不服申立て・雑則等": 440
};

function normalizeCategory(cat) {
    if (!cat) return "分類なし";
    let c = cat.trim();
    if (c === "過去問" || c === "最新問題") return c;
    if (CATEGORY_MANUAL_MAP[c]) return CATEGORY_MANUAL_MAP[c];
    for (let key in CATEGORY_MANUAL_MAP) {
        if (c.startsWith(key) || key.startsWith(c)) { return CATEGORY_MANUAL_MAP[key]; }
    }
    if (c === "保険料") return "5 費用の負担・保険料等";
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
let strategyHistory = [], strategyPlan = null;
let initialPlaylistConfig = [];

let activeSubjectForTime = null, studyTimerInterval = null, continuousStudyTimeSec = 0;
let sessionTotalTimeSec = 0, sessionTimerInterval = null;

let idleTimeoutWarn = null, idleTimeoutPenalty = null;
let isReviewAdded = false, isExtensionAdded = false, hasRestRecommended = false;

let initialGlobalTime = null, eventTriggeredThisSession = false;
let isSuddenDeath = false, isSuddenDeathGameOver = false, isCountdownRelay = false;
let countdownTimeLeft = 0, relayTimerInterval = null;
let isTrapMode = false, isHardcore = false, isSurpriseAttack = false;
let isSenbonKnock = false, isTimeAttack = false, isBonusMode = false;
let eventQuestionsAnswered = 0, eventCorrectCount = 0;

let isAnsweredTakuitsu = false, currentTakuitsuEval = null, pendingFixData = null;
let freeNoteSubjectMap = {}; 
let currentQuestionStartTime = 0;
let currentQuestionHintCount = 0;
let isSleepyMode = false; 

let lastHealthCheckTimeSec = 0;

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
            let u = new SpeechSynthesisUtterance("");
            u.volume = 0;
            window.speechSynthesis.speak(u);
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
    if (selectVal === 'custom') customInput.classList.remove('hidden'); else customInput.classList.add('hidden');
}
function formatTime(sec) {
    if(!sec) return "0分";
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec % 3600) / 60);
    if(h > 0) return `${h}時間${m}分`;
    return `${m}分`;
}

function playCorrectSound() {
    if(!audioCtx || isMuted || audioCtx.state !== 'running') return;
    try {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime); osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}
}
function playWrongSound() {
    if(!audioCtx || isMuted || audioCtx.state !== 'running') return;
    try {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, audioCtx.currentTime); osc.frequency.setValueAtTime(250, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    } catch(e) {}
}
function playWhistleSound() {
    if(!audioCtx || isMuted || audioCtx.state !== 'running') return;
    try {
        const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
        osc.type = 'square'; osc.frequency.setValueAtTime(1000, audioCtx.currentTime); osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}
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
    const condSelect = document.getElementById('condition-select');
    const cond = condSelect ? condSelect.value : '';
    const healthSelect = document.getElementById('health-select');
    const health = healthSelect ? healthSelect.value : '';
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
        let localFixes = {};
        try { localFixes = JSON.parse(localStorage.getItem('local_fixes') || '{}'); } catch(e){}
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
        
        const loadingStatusEl = document.getElementById('loading-status');
        if (loadingStatusEl) loadingStatusEl.textContent = `✅ 完了 (${allDatabase.length}問)`;
        buildSubjectAccordionUI(); 
        updateDashboard();
    }
}

function getStatsSummary() {
    let stats = {};
    allDatabase.forEach(q => {
        let subj = q._subjectName; let chap = q.項目 || "分類なし";
        if (!stats[subj]) stats[subj] = { total: 0, played: 0, latestScore: 0, latestMax: 0, chapters: {}, rawPlays: [] };
        if (!stats[subj].chapters[chap]) stats[subj].chapters[chap] = { total: 0, played: 0, latestScore: 0, latestMax: 0, rawPlays: [] };
        stats[subj].total++; stats[subj].chapters[chap].total++;
        
        let hist = userHistory[q._id];
        let pCount = 0;
        let isPerf = false;
        
        if (hist && hist.playCount > 0) {
            pCount = hist.playCount;
            isPerf = (hist.status === '完璧');
            if (hist.historyStr) {
                stats[subj].played++; stats[subj].chapters[chap].played++;
                let hArr = String(hist.historyStr).split(',');
                let latest = hArr[hArr.length - 1];
                let lScore = 0; let mScore = q._type === '選択' ? 5 : 1;
                if (q._type === '択一') { if (latest === '〇') lScore = 1; } 
                else { let match = latest.match(/(\d+)点/); if (match) lScore = parseInt(match[1], 10); }
                stats[subj].latestScore += lScore; stats[subj].latestMax += mScore;
                stats[subj].chapters[chap].latestScore += lScore; stats[subj].chapters[chap].latestMax += mScore;
            }
        }
        stats[subj].rawPlays.push({ play: pCount, perf: isPerf });
        stats[subj].chapters[chap].rawPlays.push({ play: pCount, perf: isPerf });
    });
    
    for (let subj in stats) {
        let s = stats[subj];
        s.progressRate = s.total > 0 ? Math.round((s.played / s.total) * 100) : 0;
        s.masterRate = s.latestMax > 0 ? Math.round((s.latestScore / s.latestMax) * 100) : 0;
        
        let maxSPlay = Math.max(0, ...s.rawPlays.map(r => r.play));
        let totalSPlay = 0;
        s.rawPlays.forEach(r => { totalSPlay += r.perf ? Math.max(r.play, maxSPlay) : r.play; });
        s.avgLaps = s.total > 0 ? (totalSPlay / s.total).toFixed(1) : "0.0";
        
        for (let chap in s.chapters) {
            let c = s.chapters[chap];
            c.progressRate = c.total > 0 ? Math.round((c.played / c.total) * 100) : 0;
            c.masterRate = c.latestMax > 0 ? Math.round((c.latestScore / c.latestMax) * 100) : 0;
            
            let maxCPlay = Math.max(0, ...c.rawPlays.map(r => r.play));
            let totalCPlay = 0;
            c.rawPlays.forEach(r => { totalCPlay += r.perf ? Math.max(r.play, maxCPlay) : r.play; });
            c.avgLaps = c.total > 0 ? (totalCPlay / c.total).toFixed(1) : "0.0";
        }
    }
    return stats;
}

function updateDashboard() {
    if (allDatabase.length === 0) return;
    const stats = getStatsSummary();
    const container = document.getElementById('dash-master-bars');
    if (!container) return;
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
        chaptersArray.sort((a, b) => {
            let wA = CATEGORY_SORT_WEIGHTS[a] || 9999;
            let wB = CATEGORY_SORT_WEIGHTS[b] || 9999;
            if (wA !== wB) return wA - wB;
            return a.localeCompare(b, 'ja');
        });

        for (let chap of chaptersArray) {
            let c = s.chapters[chap];
            let cmColor = c.masterRate >= 80 ? 'bg-green-500' : (c.masterRate >= 50 ? 'bg-yellow-400' : 'bg-red-400');
            chaptersHtml += `
                <div class="mb-2">
                    <div class="flex justify-between items-end text-[10px] md:text-xs font-bold text-slate-600 mb-1 gap-1">
                        <span class="truncate flex-1" title="${chap}">${chap}</span>
                        <span class="text-right shrink-0">進:${c.progressRate}% 正:${c.masterRate}% <span class="text-indigo-600 font-black ml-1 bg-indigo-50 px-1 rounded">${c.avgLaps}周</span></span>
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
                <p class="text-xs md:text-sm font-bold text-slate-700 mb-2 break-words leading-tight flex flex-col items-center justify-center gap-1" title="${subj}">
                    <span>${subj}</span>
                    <span class="text-[10px] md:text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 shadow-sm font-black">🔥平均 ${s.avgLaps}周</span>
                </p>
                <div class="mb-2">
                    <div class="flex justify-between text-[10px] md:text-xs font-bold text-slate-600 mb-1">
                        <span>時間: ${formatTime(subjTime)}</span>
                        <span>進捗: ${s.progressRate}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500" style="width: ${s.progressRate}%"></div>
                    </div>
                </div>
                <div>
                    <div class="flex justify-between text-[10px] md:text-xs font-bold text-slate-600 mb-1">
                        <span>最新正解:</span>
                        <span>${s.masterRate}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full ${mColor}" style="width: ${s.masterRate}%"></div>
                    </div>
                </div>
                ${chaptersHtml}
            </div>`;
        idx++;
    }
    container.innerHTML = htmlContent;

    if(userApiKey && typeof generateDashboardAdvice === "function") {
        generateDashboardAdvice(stats);
    }
}

function buildSubjectAccordionUI() {
    const container = document.getElementById('subject-accordion-container');
    if (!container) return;
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
        chaptersArray.sort((a, b) => {
            let wA = CATEGORY_SORT_WEIGHTS[a] || 9999;
            let wB = CATEGORY_SORT_WEIGHTS[b] || 9999;
            if (wA !== wB) return wA - wB;
            return a.localeCompare(b, 'ja');
        });

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
    const btn = document.getElementById('btn-surrender');
    if (btn) btn.classList.add('hidden');
    const tb = document.getElementById('timer-bar');
    if (tb) { tb.style.width = '100%'; tb.style.backgroundColor = '#10b981'; }
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
    
    const sc = document.getElementById('start-screen'); if (sc) sc.classList.add('hidden');
    const ma = document.getElementById('main-area'); if (ma) { ma.classList.remove('hidden'); ma.classList.add('flex'); }
    const aa = document.getElementById('aside-area'); if (aa) { aa.classList.remove('hidden'); aa.classList.add('flex'); }
    
    const tl = document.getElementById('time-limit-select');
    const timeLimitVal = tl ? tl.value : '無制限';
    sendKarteLog('session_start', { mode: 'strategy_auto', target: config.target, count: count, timeLimit: timeLimitVal });
    
    lastHealthCheckTimeSec = continuousStudyTimeSec; 
    
    startNextPlaylistSet(true);
}

function executeStrategyPlan() {
    if(!strategyPlan) return;
    const ap = document.getElementById('api-key-input');
    userApiKey = ap ? ap.value.trim() : userApiKey;
    const am = document.getElementById('api-model-input');
    userModel = am ? am.value : userModel;
    if (!userApiKey) { alert("APIキーを入力してください！"); return; }
    unlockAudio();
    
    cumulativeQuestions = 0; setCorrectCount = 0; todayMistakes = []; usedQuestionIds = new Set();
    playlistQueue = []; totalQuestionsToPlay = 0;
    
    let planList = strategyPlan.plan || [strategyPlan];
    planList.forEach(item => {
        let pool = allDatabase.filter(q => q._subjectName === item.subject);
        if (item.chapter) pool = pool.filter(q => q.項目 === item.chapter);
        
        if(pool.length > 0) {
            let targetPool = pool.filter(q => !(userHistory[q._id] && userHistory[q._id].status === '完璧'));
            if(targetPool.length === 0) targetPool = pool; 
            
            if (item.target === "弱点") {
                targetPool.sort((a, b) => {
                    let rA = userHistory[a._id] && userHistory[a._id].playCount > 0 ? (userHistory[a._id].correctCount / userHistory[a._id].playCount) : 1;
                    let rB = userHistory[b._id] && userHistory[b._id].playCount > 0 ? (userHistory[b._id].correctCount / userHistory[b._id].playCount) : 1;
                    return rA - rB;
                });
            } else if (item.target === "復習" || item.target === "周回遅れ") {
                targetPool.sort((a, b) => {
                    let cA = userHistory[a._id] ? userHistory[a._id].playCount : 0;
                    let cB = userHistory[b._id] ? userHistory[b._id].playCount : 0;
                    return cA - cB;
                });
            } else {
                targetPool.sort(() => Math.random() - 0.5);
            }
            
            let chapterMap = {};
            targetPool.forEach(q => { let c = q.項目 || "分類なし"; if(!chapterMap[c]) chapterMap[c] = []; chapterMap[c].push(q); });
            let pickedChapter = Object.keys(chapterMap)[0];
            let qs = (chapterMap[pickedChapter] || targetPool).slice(0, item.count || 10);
            
            if (qs.length > 0) {
                let displayChapter = pickedChapter;
                if (item.target) displayChapter += ` (${item.target})`;
                playlistQueue.push({ subjectName: item.subject, chapterName: displayChapter, type: qs[0]._type, questions: qs });
                totalQuestionsToPlay += qs.length;
            }
        }
    });
    
    if(playlistQueue.length === 0) { alert("条件に合う問題が見つかりませんでした。"); return; }
    
    resetGameFlags();
    currentPlaylistIndex = 0; isReviewAdded = false; isExtensionAdded = false; hasRestRecommended = false;
    initialPlaylistConfig = playlistQueue.map(q => ({ subjectName: q.subjectName, chapterName: q.chapterName, type: q.type }));
    
    const sc = document.getElementById('start-screen'); if (sc) sc.classList.add('hidden');
    const ma = document.getElementById('main-area'); if (ma) { ma.classList.remove('hidden'); ma.classList.add('flex'); }
    const aa = document.getElementById('aside-area'); if (aa) { aa.classList.remove('hidden'); aa.classList.add('flex'); }
    
    initialGlobalTime = null;
    eventTriggeredThisSession = false;
    let todayStr = new Date().toDateString();
    if (localStorage.getItem('last_play_date') !== todayStr) {
        localStorage.setItem('last_play_date', todayStr);
        localStorage.setItem('trap_done_date', '');
        localStorage.setItem('today_sentaku_count', '0');
    }
    
    const tl = document.getElementById('time-limit-select');
    const timeLimitVal = tl ? tl.value : '無制限';
    sendKarteLog('session_start', { mode: 'strategy', plan: strategyPlan, timeLimit: timeLimitVal });
    
    lastHealthCheckTimeSec = continuousStudyTimeSec;
    
    startNextPlaylistSet(true);
}

function startTraining(mode, targetSubject = null, excludePerfect = false, count = 10) {
    if(allDatabase.length === 0) { alert("データがありません。"); return; }
    const ap = document.getElementById('api-key-input');
    userApiKey = ap ? ap.value.trim() : userApiKey;
    const am = document.getElementById('api-model-input');
    userModel = am ? am.value : userModel;
    if (!userApiKey) { alert("APIキーを入力してください！"); document.getElementById('api-settings-wrapper').classList.remove('hidden'); return; }
    try { localStorage.setItem('gemini_api_key', userApiKey); localStorage.setItem('gemini_api_model', userModel); } catch(e) {}
    
    unlockAudio();
    
    cumulativeQuestions = 0; setCorrectCount = 0; todayMistakes = []; usedQuestionIds = new Set();
    playlistQueue = []; totalQuestionsToPlay = 0;
    
    const tl = document.getElementById('time-limit-select');
    const timeLimitVal = tl ? tl.value : '無制限';
    if (timeLimitVal === '無制限') globalTimeLeftSeconds = null;
    else if (timeLimitVal === 'custom') {
        const cti = document.getElementById('custom-time-input');
        const customTimeStr = cti ? cti.value : '';
        if (!customTimeStr) { alert("終了時刻を入力してください！"); return; }
        const [h, m] = customTimeStr.split(':');
        const target = new Date(); target.setHours(parseInt(h), parseInt(m), 0);
        if (target <= new Date()) target.setDate(target.getDate() + 1);
        globalTimeLeftSeconds = Math.floor((target - new Date()) / 1000);
    } else if (timeLimitVal === '1分') globalTimeLeftSeconds = 60;
    else globalTimeLeftSeconds = parseInt(timeLimitVal.replace('分','')) * 60;

    const td = document.getElementById('time-display');
    if (globalTimeLeftSeconds !== null) {
        if (td) { td.classList.remove('hidden'); td.textContent = `⏳ --秒`; }
    } else {
        if (td) td.textContent = '無制限';
    }

    let pool = [];
    if (mode === 'normal') {
        const epc = document.getElementById('exclude-perfect-check');
        excludePerfect = epc ? epc.checked : false;
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
    
    const sc = document.getElementById('start-screen'); if (sc) sc.classList.add('hidden');
    const ma = document.getElementById('main-area'); if (ma) { ma.classList.remove('hidden'); ma.classList.add('flex'); }
    const aa = document.getElementById('aside-area'); if (aa) { aa.classList.remove('hidden'); aa.classList.add('flex'); }
    
    initialGlobalTime = globalTimeLeftSeconds;
    eventTriggeredThisSession = false;
    let todayStr = new Date().toDateString();
    if (localStorage.getItem('last_play_date') !== todayStr) {
        localStorage.setItem('last_play_date', todayStr);
        localStorage.setItem('trap_done_date', '');
        localStorage.setItem('today_sentaku_count', '0');
    }

    sendKarteLog('session_start', { mode: mode, targetSubject: targetSubject, excludePerfect: excludePerfect, count: count, timeLimit: timeLimitVal });
    
    lastHealthCheckTimeSec = continuousStudyTimeSec;

    if (!isMuted) {
        const sw = document.getElementById('start-wait-overlay'); if(sw) { sw.classList.remove('hidden'); sw.classList.add('flex'); }
        const btnAct = document.getElementById('btn-actual-start'); if(btnAct) btnAct.classList.add('hidden');
        const stt = document.getElementById('start-wait-text'); if(stt) stt.textContent = "準備中...💬";
        
        let promptType = mode === 'normal' ? "start_all" : `start_${playlistQueue[0].type === '択一' ? 'takuitsu' : 'sentaku'}`;
        if(typeof generateAiMessage === "function") generateAiMessage(promptType, { total: totalQuestionsToPlay, textOnly: false }, true);
    } else {
        startSessionAndTimer();
    }
}

function onAiGreetingStarted() {
    const overlay = document.getElementById('start-wait-overlay');
    if(overlay && !overlay.classList.contains('hidden')) {
        const swt = document.getElementById('start-wait-text'); if(swt) swt.textContent = "よし、いけるよ！";
        const swi = document.querySelector('#start-wait-icon'); if(swi) swi.classList.remove('animate-pulse');
        const bas = document.getElementById('btn-actual-start'); if(bas) bas.classList.remove('hidden');
    }
}

function hideStartWaitOverlayAndStart() {
    const sw = document.getElementById('start-wait-overlay');
    if(sw) { sw.classList.add('hidden'); sw.classList.remove('flex'); }
    startSessionAndTimer();
}

function startSessionAndTimer() {
    if (globalTimeLeftSeconds !== null && !globalTimerInterval) {
        globalTimerInterval = setInterval(globalTimerTick, 1000);
    }
    startNextPlaylistSet(true);
}

function globalTimerTick() {
    if(globalTimeLeftSeconds === null) return;
    globalTimeLeftSeconds--;
    const td = document.getElementById('time-display');
    if(!td) return;
    if (globalTimeLeftSeconds > 0) {
        const h = Math.floor(globalTimeLeftSeconds / 3600);
        const m = Math.floor((globalTimeLeftSeconds % 3600) / 60);
        const s = globalTimeLeftSeconds % 60;
        let txt = h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` : `${m}:${s.toString().padStart(2,'0')}`;
        td.textContent = `⏳ ${txt}`;
        td.classList.remove('bg-red-600', 'text-white', 'animate-pulse');
        td.classList.add('bg-slate-800', 'text-yellow-400');
    } else {
        isTimeUp = true;
        td.textContent = '🏁 時間切れ';
        td.classList.remove('bg-slate-800', 'text-yellow-400');
        td.classList.add('bg-red-600', 'text-white', 'animate-pulse');
    }
}

function startNextPlaylistSet(isFirstOfAll = false) {
    const currentSet = playlistQueue[currentPlaylistIndex];
    currentQuestions = currentSet.questions; currentIndex = 0;
    const cpt = document.getElementById('current-playlist-title');
    if (cpt) cpt.textContent = `🎧 [${currentPlaylistIndex + 1}/${playlistQueue.length}] ${currentSet.subjectName} - ${currentSet.chapterName}`;
    
    if (isSenbonKnock || isSuddenDeath || isCountdownRelay || isSurpriseAttack) {
        const bs = document.getElementById('btn-surrender');
        if (bs) bs.classList.remove('hidden');
    }
    
    if (currentSet.type === '選択' && !isHardcore && !isSurpriseAttack) {
        let count = parseInt(localStorage.getItem('today_sentaku_count') || '0') + currentQuestions.length;
        localStorage.setItem('today_sentaku_count', count.toString());
    }

    loadQuestion(false, true, isFirstOfAll);
}

function startCountdownRelayTimer() {
    countdownTimeLeft = 20; 
    const tb = document.getElementById('timer-bar');
    if (tb) tb.style.animation = 'none';
    relayTimerInterval = setInterval(() => {
        if (isAnsweredTakuitsu) return; 
        countdownTimeLeft--;
        if (tb) {
            let pct = Math.min(100, (countdownTimeLeft / 30) * 100);
            tb.style.width = pct + '%';
            tb.style.backgroundColor = countdownTimeLeft > 10 ? '#10b981' : '#ef4444';
        }
        const td = document.getElementById('time-display');
        if (td) {
            td.textContent = `🔥 残 ${countdownTimeLeft}秒`;
            td.classList.add('bg-red-600', 'text-white');
            td.classList.remove('bg-slate-800', 'text-yellow-400');
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
    const hc = document.getElementById('hardcore-unlock-area');
    if (hc) { hc.classList.add('hidden'); hc.classList.remove('flex'); }
    const ns = document.getElementById('normal-sentaku-actions');
    if (ns) { ns.classList.remove('hidden'); ns.classList.add('flex'); }
    const q = currentQuestions[currentIndex];
    sendKarteLog('hardcore_unlock', { type: type, q_id: q._id, question: q.問題文.substring(0, 20) });
}

function submitHealthHearing(statusStr) {
    const hs = document.getElementById('health-select');
    if (hs) hs.value = statusStr;
    
    sendKarteLog('health_update', { condition: statusStr, continuousTimeSec: continuousStudyTimeSec });
    
    lastHealthCheckTimeSec = continuousStudyTimeSec;
    
    const hha = document.getElementById('health-hearing-area');
    if (hha) { hha.classList.add('hidden'); hha.classList.remove('flex'); }
    
    nextQuestion();
}

function startPause() {
    stopStudyTimer();
    clearIdleTimers();
    pauseSeconds = 0;
    const ptd = document.getElementById('pause-timer-display');
    if(ptd) ptd.textContent = "00:00";
    const po = document.getElementById('pause-overlay');
    if (po) { po.classList.remove('hidden'); po.classList.add('flex'); }
    pauseInterval = setInterval(() => {
        pauseSeconds++;
        if (ptd) {
            let m = Math.floor(pauseSeconds / 60).toString().padStart(2, '0');
            let s = (pauseSeconds % 60).toString().padStart(2, '0');
            ptd.textContent = `${m}:${s}`;
        }
    }, 1000);
}

function startNapQuick(minutes) {
    stopStudyTimer();
    clearIdleTimers();
    const no = document.getElementById('nap-overlay');
    if(no) { no.classList.remove('hidden'); no.classList.add('flex'); }
    napSecondsLeft = minutes * 60;
    localStorage.setItem('last_nap_time', new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'}));
    sendKarteLog('nap_start', { time: new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'}), durationMinutes: minutes }); 
    runNapTimer();
    if(typeof generateAiMessage === "function") generateAiMessage("nap_start", { textOnly: true });
}

function toggleEvalPanel(type) {
    const target = document.getElementById(`${type}-eval-collapse-target`);
    const toggleBtn = document.getElementById(`${type}-eval-toggle`);
    
    if (!target || !toggleBtn) return;

    if (type === 'sentaku') {
        const markBtn = document.getElementById('btn-mark-sentaku');
        if (target.classList.contains('hidden')) {
            target.classList.remove('hidden');
            if(markBtn) markBtn.classList.remove('hidden');
            toggleBtn.innerHTML = '▼ 評価をたたむ';
        } else {
            target.classList.add('hidden');
            if(markBtn) markBtn.classList.add('hidden');
            toggleBtn.innerHTML = '▲ 評価を開く';
        }
    } else {
        if (target.classList.contains('hidden')) {
            target.classList.remove('hidden');
            toggleBtn.innerHTML = '▼ 評価をたたむ';
        } else {
            target.classList.add('hidden');
            toggleBtn.innerHTML = '▲ 評価を開く';
        }
    }
}

function loadQuestion(isAlchemy = false, isFirstOfSet = false, isFirstOfAll = false) {
    const q = currentQuestions[currentIndex];
    if (!q) return;
    
    const condSelect = document.getElementById('condition-select');
    const cond = condSelect ? condSelect.value : '';
    let isBadCondition = cond.includes('眠い') || cond.includes('疲れ');
    isSleepyMode = (continuousStudyTimeSec > 1800) || (isBadCondition && Math.random() < 0.5);

    const qp = document.getElementById('question-progress');
    if (qp) {
        if (isSenbonKnock || isSuddenDeath || isCountdownRelay || isSurpriseAttack) {
            qp.textContent = `${eventQuestionsAnswered + 1} 問目`;
        } else {
            qp.textContent = `${currentIndex + 1} / ${currentQuestions.length} 問`;
        }
    }

    const qsb = document.getElementById('q-subject-badge');
    if(qsb) qsb.textContent = q._subjectName;
    const qct = document.getElementById('q-chapter-text');
    if(qct) qct.textContent = q.項目 || (isAlchemy ? "Pro AI 錬金問題" : "条文");
    
    const hist = userHistory[q._id] || { playCount: 0, correctCount: 0, historyStr: "", status: "" };
    let maxScore = q._type === '選択' ? (hist.playCount * 5) : hist.playCount;
    const rate = hist.playCount > 0 ? Math.round((hist.correctCount / maxScore) * 100) : 0;
    const qhs = document.getElementById('q-history-stats');
    if(qhs) qhs.textContent = `挑戦:${hist.playCount} 過去正答:${rate}%`;
    
    const rht = document.getElementById('recent-history-text');
    if(rht) rht.textContent = hist.historyStr || "-----";
    const letxt = document.getElementById('last-eval-text');
    if(letxt) letxt.textContent = hist.status || "なし";

    const ea = document.getElementById('explanation-area');
    if(ea) ea.classList.add('hidden');
    const afa = document.getElementById('ai-fix-action');
    if(afa) afa.classList.add('hidden');
    
    const seat = document.getElementById('self-eval-area-takuitsu');
    if(seat) { seat.classList.add('hidden'); seat.classList.remove('block', '!block'); }
    const tet = document.getElementById('takuitsu-eval-toggle');
    if(tet) tet.classList.add('hidden');
    const tect = document.getElementById('takuitsu-eval-collapse-target');
    if(tect) tect.classList.remove('hidden');
    
    const seas = document.getElementById('self-eval-area-sentaku');
    if(seas) { seas.classList.add('hidden'); seas.classList.remove('block', '!block'); }
    const set = document.getElementById('sentaku-eval-toggle');
    if(set) set.classList.add('hidden');
    const sect = document.getElementById('sentaku-eval-collapse-target');
    if(sect) sect.classList.remove('hidden');
    const bms = document.getElementById('btn-mark-sentaku');
    if (bms) bms.classList.remove('hidden');
    
    const tec = document.getElementById('takuitsu-eval-content');
    if(tec) tec.classList.remove('hidden');
    
    const hha = document.getElementById('health-hearing-area');
    if (hha) { hha.classList.add('hidden'); hha.classList.remove('flex'); }
    
    const rpmt = document.getElementById('rest-proposal-menu-takuitsu');
    if(rpmt) { rpmt.classList.add('hidden'); rpmt.classList.remove('flex'); }
    const idm = document.getElementById('infinite-drill-menu');
    if(idm) { idm.classList.add('hidden'); idm.classList.remove('flex'); }
    
    let ignoredFixes = {};
    try { ignoredFixes = JSON.parse(localStorage.getItem('ignored_fixes') || '{}'); } catch(e){}
    const badge = document.getElementById('ignored-fix-badge');
    if (badge) {
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
    if (mainArea) mainArea.classList.remove('animate-shake', 'bg-red-50');
    
    const btnMaru = document.getElementById('btn-takuitsu-maru');
    const btnBatsu = document.getElementById('btn-takuitsu-batsu');
    if (btnMaru && btnBatsu) {
        btnMaru.disabled = false; btnMaru.classList.remove('opacity-30', 'ring-4', 'ring-blue-500', 'cursor-not-allowed');
        btnBatsu.disabled = false; btnBatsu.classList.remove('opacity-30', 'ring-4', 'ring-red-500', 'cursor-not-allowed');
    }
    
    const evalBtns = ['eval-btn-kanpeki', 'eval-btn-kantan', 'eval-btn-mayotta', 'eval-btn-wakaran'];
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

    const teb = document.getElementById('takuitsu-eval-buttons');
    const egt = document.getElementById('eval-guide-text-takuitsu');
    if (teb && egt) {
        if (!isSenbonKnock && !isTimeAttack && !isBonusMode && !isSuddenDeath && !isCountdownRelay && !isTrapMode && !isSurpriseAttack) {
            teb.classList.remove('hidden');
            egt.classList.remove('hidden');
        } else {
            teb.classList.add('hidden');
            egt.classList.add('hidden');
        }
    }

    const qtbh = document.getElementById('q-type-badge-header');
    if(qtbh) qtbh.textContent = q._type + "式モード";
    
    startStudyTimer(q._subjectName);

    if (q._type === '択一') {
        const tUi = document.getElementById('takuitsu-ui'); if(tUi) tUi.classList.remove('hidden');
        const sUi = document.getElementById('sentaku-ui'); if(sUi) sUi.classList.add('hidden');
        const aTak = document.getElementById('action-takuitsu'); if(aTak) aTak.classList.remove('hidden');
        const aSen = document.getElementById('action-sentaku'); if(aSen) aSen.classList.add('hidden');
        const tts = document.getElementById('tts-area'); if(tts) tts.classList.add('hidden');
        const alc = document.getElementById('alchemy-btn'); if(alc) alc.classList.add('hidden');
        const qtt = document.getElementById('question-text-takuitsu'); if(qtt) qtt.innerHTML = (q.問題文 || "").replace(/\n/g, '<br>');
        
        if (!isCountdownRelay) {
            clearInterval(timerInterval);
            const timerBar = document.getElementById('timer-bar');
            if (timerBar) { timerBar.style.animation = 'none'; void timerBar.offsetWidth; }
            currentLimit = isTimeAttack ? 15 : (isSenbonKnock || isSuddenDeath || isSurpriseAttack ? 20 : 60);
            if (timerBar) timerBar.style.animation = `timer-run ${currentLimit}s linear forwards`;
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

        let htmlText = (q.問題文 || "").replace(/\n/g, '<br>');
        ['A','B','C','D','E'].forEach(letter => {
            let options = `<option value="" selected disabled>【 ${letter} 】</option>`;
            currentWordBank.forEach((word, idx) => { options += `<option value="${word}" class="opt-word">${idx+1}. ${word}</option>`; });
            const selectHtml = `<select data-letter="${letter}" class="inline-select" onchange="syncSelects('${letter}', this.value)">${options}</select>`;
            htmlText = htmlText.replace(new RegExp(`【${letter}】`, 'g'), selectHtml);
        });
        const qts = document.getElementById('question-text-sentaku');
        if(qts) qts.innerHTML = htmlText;

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
            const hca = document.getElementById('hardcore-unlock-area'); if(hca) { hca.classList.remove('hidden'); hca.classList.add('flex'); }
            const nsa = document.getElementById('normal-sentaku-actions'); if(nsa) { nsa.classList.add('hidden'); nsa.classList.remove('flex'); }
        } else {
            const hca = document.getElementById('hardcore-unlock-area'); if(hca) { hca.classList.add('hidden'); hca.classList.remove('flex'); }
            const nsa = document.getElementById('normal-sentaku-actions'); if(nsa) { nsa.classList.remove('hidden'); nsa.classList.add('flex'); }
        }
    }

    startIdleTimers();

    if (isFirstOfSet) {
        if (typeof generateAiMessage === "function") {
            if(isTimeAttack) generateAiMessage("start_timeattack", { textOnly: false });
            else if(isBonusMode) generateAiMessage("start_bonus", { textOnly: false });
            else if(isSenbonKnock) generateAiMessage("start_senbon", { textOnly: true });
            else if(isTrapMode) generateAiMessage("start_trap", { textOnly: false });
            else if(isHardcore) generateAiMessage("start_hardcore", { textOnly: false });
            else if(isSurpriseAttack) generateAiMessage("start_surprise", { textOnly: false });
            else if(!isSuddenDeath && !isCountdownRelay && !isFirstOfAll) {
                generateAiMessage(`start_${q._type === '択一' ? 'takuitsu' : 'sentaku'}`, { textOnly: false });
            }
        }
    }
    if (typeof verifyDataWithPro === "function") verifyDataWithPro(q);
    
    currentQuestionStartTime = Date.now();
    currentQuestionHintCount = 0;
}

function answerTakuitsu(userAnswer) {
    unlockAudio();

    if (isAnsweredTakuitsu) return;
    isAnsweredTakuitsu = true;
    
    const mainArea = document.getElementById('main-area');
    if (mainArea) mainArea.classList.remove('animate-shake', 'bg-red-50');
    
    stopStudyTimer(); 
    flushStudyTimes(); 
    
    const q = currentQuestions[currentIndex];
    if (!isCountdownRelay) {
        clearInterval(timerInterval); 
        const tb = document.getElementById('timer-bar');
        if(tb) tb.style.animationPlayState = 'paused';
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
    
    let answerTimeSec = Math.floor((Date.now() - currentQuestionStartTime) / 1000);
    saveToGAS(q._id, 'save_answer', isCorrect, null, null, answerTimeSec, currentQuestionHintCount);
    
    const at = document.getElementById('action-takuitsu'); if(at) at.classList.add('hidden');
    const ea = document.getElementById('explanation-area'); if(ea) { ea.classList.remove('hidden'); ea.classList.add('flex'); }
    
    const seat = document.getElementById('self-eval-area-takuitsu');
    if (seat) { seat.classList.remove('hidden'); seat.classList.add('block', '!block'); }
    
    const tet = document.getElementById('takuitsu-eval-toggle');
    if(tet) {
        tet.classList.remove('hidden');
        tet.innerHTML = '▼ 評価をたたむ';
    }
    
    const badge = document.getElementById('score-badge');
    if (badge) {
        badge.textContent = isCorrect ? "大正解！ 🎉" : "不正解... 💦";
        badge.className = isCorrect ? "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-green-500 shadow-md mb-2 animate-bounce" : "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-red-500 shadow-md mb-2";
    }
    const aText = document.getElementById('article-text'); if(aText) aText.textContent = (q.根拠条文 || "").trim() || "（条文データなし）";
    const eText = document.getElementById('explanation-text'); if(eText) eText.innerHTML = (q.解説 || "").trim() || "（解説データなし）";
    
    if (typeof updateNotebookButtonDisplay === "function") updateNotebookButtonDisplay(q._id);

    const egt = document.getElementById('eval-guide-text-takuitsu');
    if (egt) {
        if (!isSenbonKnock && !isTimeAttack && !isBonusMode && !isSuddenDeath && !isCountdownRelay && !isTrapMode && !isSurpriseAttack) {
            if (currentIndex >= currentQuestions.length - 1) {
                egt.textContent = "自己評価を選んでセットを完了してね！";
            } else {
                egt.textContent = "自己評価を選んで次へ進んでね！";
            }
        }
    }

    clearIdleTimers(); 
    
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

function fillRandomAnswers() {
    ['A','B','C','D','E'].forEach(letter => {
        let randomWord = currentWordBank[Math.floor(Math.random() * currentWordBank.length)];
        syncSelects(letter, randomWord);
    });
}

function submitSentakuAnswers() {
    unlockAudio();
    
    let hasUnanswered = false; let userAns = {};
    ['A','B','C','D','E'].forEach(letter => {
        const s = document.querySelector(`.inline-select[data-letter="${letter}"]`);
        if(!s || !s.value) hasUnanswered = true; else userAns[letter] = s.value;
    });
    if(hasUnanswered) { 
        const wm = document.getElementById('warning-modal');
        if (wm) { wm.classList.remove('hidden'); wm.classList.add('flex'); }
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
    
    let answerTimeSec = Math.floor((Date.now() - currentQuestionStartTime) / 1000);
    saveToGAS(currentQuestions[currentIndex]._id, 'save_sentaku', false, score, trapsPicked.join(','), answerTimeSec, currentQuestionHintCount);

    const as = document.getElementById('action-sentaku'); if (as) as.classList.add('hidden');
    const ea = document.getElementById('explanation-area'); if (ea) { ea.classList.remove('hidden'); ea.classList.add('flex'); }
    
    const seas = document.getElementById('self-eval-area-sentaku');
    if (seas) { seas.classList.remove('hidden'); seas.classList.add('block', '!block'); }
    
    const set = document.getElementById('sentaku-eval-toggle');
    if (set) {
        set.classList.remove('hidden');
        set.innerHTML = '▼ 評価をたたむ';
    }
    
    const sb = document.getElementById('score-badge');
    if (sb) {
        sb.textContent = `${score} / 5 点`;
        sb.className = score === 5 ? "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-green-500 shadow-md mb-2 animate-bounce" : "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-red-500 shadow-md mb-2";
    }
    const at = document.getElementById('article-text'); if(at) at.textContent = (currentQuestions[currentIndex].根拠条文 || "").trim() || "（条文データなし）";
    const et = document.getElementById('explanation-text'); if(et) et.innerHTML = (currentQuestions[currentIndex].解説 || "").trim() || "（解説データなし）";

    if (typeof updateNotebookButtonDisplay === "function") updateNotebookButtonDisplay(currentQuestions[currentIndex]._id);

    const etb = document.getElementById('eval-target-buttons');
    if (etb) {
        etb.innerHTML = '<span id="eval-target-label" class="text-[10px] md:text-xs font-bold text-slate-500 self-center mr-1 md:mr-2">対象:</span>';
        ['A','B','C','D','E'].forEach(letter => {
            etb.innerHTML += `<label class="eval-target-box flex items-center gap-1 cursor-pointer bg-slate-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-slate-300"><input type="checkbox" name="eval-target" value="${letter}"><span class="font-bold text-xs md:text-sm">${letter}</span></label>`;
        });
    }
    const bns = document.getElementById('btn-next-sentaku');
    if (bns) {
        if (currentIndex >= currentQuestions.length - 1) {
            bns.textContent = (currentPlaylistIndex < playlistQueue.length - 1) ? "🟢 次の科目セットへ" : "🟢 特訓終了！判定へ";
        }
    }
    
    clearIdleTimers(); 
    if (typeof generateAiMessage === "function") generateAiMessage("result_sentaku", { score: score, textOnly: false });
}

function closeWarningModal() { 
    const wm = document.getElementById('warning-modal'); 
    if (wm) { wm.classList.add('hidden'); wm.classList.remove('flex'); } 
}

async function saveToGAS(q_id, actionStr, isCorrect, score, traps, timeSec = 0, hintCount = 0) {
    try {
        let payload = { action: actionStr, q_id: q_id, time_sec: timeSec, hint_count: hintCount };
        if (actionStr === 'save_answer') payload.is_correct = isCorrect;
        if (actionStr === 'save_sentaku') { payload.score = score; payload.traps = traps; }
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
    const btns = { 
        '完璧': document.getElementById('eval-btn-kanpeki'), 
        '簡単': document.getElementById('eval-btn-kantan'), 
        '迷った': document.getElementById('eval-btn-mayotta'), 
        'わからん': document.getElementById('eval-btn-wakaran') 
    };
    for (let key in btns) {
        let el = btns[key];
        if (!el) continue;
        if (key === status) { el.classList.remove('opacity-40'); el.classList.add('ring-2', 'ring-offset-2', 'ring-slate-400'); }
        else { el.classList.add('opacity-40'); el.classList.remove('ring-2', 'ring-offset-2', 'ring-slate-400'); }
    }
    
    const nextBtn = document.getElementById('btn-next-takuitsu');
    if (nextBtn) {
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        nextBtn.textContent = "次の問題へ ➡";
    }
    
    const target = document.getElementById('takuitsu-eval-collapse-target');
    if (target && !target.classList.contains('hidden')) {
        toggleEvalPanel('takuitsu');
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
    
    if (currentIndex >= currentQuestions.length - 1 && currentPlaylistIndex >= playlistQueue.length - 1) {
        if (continuousStudyTimeSec - lastHealthCheckTimeSec >= 1200) {
            showHealthHearingPanel();
            return;
        }
    }
    
    nextQuestion();
}

function markEvalSentaku(status) {
    clearIdleTimers(); 
    const checked = Array.from(document.querySelectorAll('input[name="eval-target"]:checked')).map(cb => cb.value);
    if(checked.length === 0) { alert("対象の空欄(A~E)を選択してください"); return; }
    const statusStr = `${status}(${checked.join(',')})`;
    const q = currentQuestions[currentIndex];
    fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'save_status', q_id: q._id, status: statusStr }) });
    if(!userHistory[q._id]) userHistory[q._id] = {};
    userHistory[q._id].status = statusStr;
    document.querySelectorAll('input[name="eval-target"]:checked').forEach(cb => { 
        if (cb.parentElement) {
            cb.parentElement.classList.add('opacity-30', 'bg-yellow-200'); 
            cb.checked = false; 
        }
    });
    
    if (currentIndex >= currentQuestions.length - 1 && currentPlaylistIndex >= playlistQueue.length - 1) {
        if (continuousStudyTimeSec - lastHealthCheckTimeSec >= 1200) {
            showHealthHearingPanel();
            return;
        }
    }
    
    nextQuestion();
}

function showHealthHearingPanel() {
    const tec = document.getElementById('takuitsu-eval-content');
    if (tec) tec.classList.add('hidden');
    const etb = document.getElementById('eval-target-buttons');
    if (etb) etb.classList.add('hidden');
    const seb = document.getElementById('sentaku-eval-buttons');
    if (seb) seb.classList.add('hidden');
    const egt = document.getElementById('eval-guide-text');
    if (egt) egt.classList.add('hidden');

    const seat = document.getElementById('self-eval-area-takuitsu');
    if (seat) { seat.classList.remove('hidden'); seat.classList.add('block', '!block'); }
    
    const seas = document.getElementById('self-eval-area-sentaku');
    if (seas) { seas.classList.add('hidden'); seas.classList.remove('block', '!block'); }

    const hha = document.getElementById('health-hearing-area');
    if (hha) {
        hha.classList.remove('hidden');
        hha.classList.add('flex');
    }
    
    if (typeof generateAiMessage === "function") generateAiMessage("health_check", { textOnly: true });
}

function submitHealthHearing(statusStr) {
    const hs = document.getElementById('health-select');
    if (hs) hs.value = statusStr;
    
    sendKarteLog('health_update', { condition: statusStr, continuousTimeSec: continuousStudyTimeSec });
    
    lastHealthCheckTimeSec = continuousStudyTimeSec;
    
    const hha = document.getElementById('health-hearing-area');
    if (hha) { hha.classList.add('hidden'); hha.classList.remove('flex'); }
    
    nextQuestion();
}

async function cancelMistake() {
    if(confirm("直近の解答記録を取り消しますか？")) {
        const q = currentQuestions[currentIndex];
        sendKarteLog('cancel_mistake', { q_id: q._id });
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
            const aim = document.getElementById('ai-message');
            if (aim) aim.textContent = "記録を取り消したよ！次から気をつけてね！";
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
    
    if(q._type === '択一' && pendingFixData.correctChoice) q.正誤 = pendingFixData.correctChoice;
    q.解説 = pendingFixData.newExplanation || q.解説;
    q._verified = true;
    
    let ignored = {};
    try { ignored = JSON.parse(localStorage.getItem('ignored_fixes') || '{}'); } catch(e){}
    if(ignored[q._id]) { delete ignored[q._id]; localStorage.setItem('ignored_fixes', JSON.stringify(ignored)); }
    
    const afa = document.getElementById('ai-fix-action'); if (afa) afa.classList.add('hidden');
    const ifb = document.getElementById('ignored-fix-badge'); if (ifb) ifb.classList.add('hidden');
    if(typeof generateAiMessage === "function") generateAiMessage("apply_fix", { textOnly: true });
    pendingFixData = null;
}

function ignoreFix() {
    if(!pendingFixData) return;
    const q = currentQuestions[currentIndex];
    let ignored = {};
    try { ignored = JSON.parse(localStorage.getItem('ignored_fixes') || '{}'); } catch(e){}
    ignored[q._id] = pendingFixData;
    localStorage.setItem('ignored_fixes', JSON.stringify(ignored));
    
    const afa = document.getElementById('ai-fix-action'); if (afa) afa.classList.add('hidden');
    const ifb = document.getElementById('ignored-fix-badge'); if (ifb) ifb.classList.remove('hidden');
    if(typeof generateAiMessage === "function") generateAiMessage("ignore_fix", { textOnly: true });
}

function showIgnoredFix() {
    if(!pendingFixData) return;
    const afr = document.getElementById('ai-fix-reason'); if(afr) afr.textContent = pendingFixData.reason;
    const afa = document.getElementById('ai-fix-action'); if(afa) afa.classList.remove('hidden');
}

function surrenderSenbonKnock() {
    const bs = document.getElementById('btn-surrender'); if (bs) bs.classList.add('hidden');
    currentIndex = currentQuestions.length; 
    nextQuestion();
}

function checkSpecialEvents() {
    if (!eventTriggeredThisSession && initialGlobalTime >= 5400 && globalTimeLeftSeconds !== null && globalTimeLeftSeconds >= 600 && globalTimeLeftSeconds <= 900) {
        eventTriggeredThisSession = true;
        let isSudden = Math.random() < 0.5;
        let subjList = ["労働基準法(択一)", "安全衛生法(択一)", "健康保険法(択一)", "厚生年金保険法(択一)"];
        let pool = allDatabase.filter(q => q._subjectName === subjList[0] && q._type === '択一');
        let qs = pool.sort(()=>Math.random()-0.5).slice(0, 10);
        
        playlistQueue = [{ subjectName: subjList[0], chapterName: isSudden ? "☠️ サドンデス" : "⏱️ カウントダウン", type: "択一", questions: qs }];
        currentPlaylistIndex = 0; currentIndex = 0;
        resetGameFlags();
        if (isSudden) isSuddenDeath = true; else { isCountdownRelay = true; startCountdownRelayTimer(); }
        
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
    clearIdleTimers(); stopAudio();
    if (isSuddenDeathGameOver) { finishAllPlaylists(); return; }
    
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

async function judgeTimeUpExtension() {
    isExtensionAdded = true; 
    const aiMessageEl = document.getElementById('ai-message');
    if(aiMessageEl) aiMessageEl.innerHTML = '<span class="typing">💬 延長戦するか考えてるよ...</span>';
    
    const condSelect = document.getElementById('condition-select');
    const cond = condSelect ? condSelect.value : '普通';
    
    let prompt = `あなたは社労士試験の専属講師（若い女性）です。受講生の目標時間が今終わりました。モードは「${cond}」です。
受講生を少し休ませて「終了」させるか、限界を超えるため「延長戦（1〜3問、または千本ノック）」を追加するか性格に基づいて判定してください。
以下のJSONで返してください。メッセージは定型文を使わず、現代の自然な口語（1〜2文、アニメ口調絶対禁止）で。
\`\`\`json
{ "action": "end" または "extend", "eventType": "normal", "senbonKnock", "timeAttack", "bonus", "count": 1〜10の数字, "message": "セリフ" }
\`\`\``;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        
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
以下のJSONで返してください。メッセージは定型文を使わず自然な口語で。
\`\`\`json
{ "recommendRest": true または false, "restMinutes": 5〜30の数字, "message": "セリフ" }
\`\`\``;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        
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
                
                const hha = document.getElementById('health-hearing-area');
                if (hha) { hha.classList.add('hidden'); hha.classList.remove('flex'); }
                
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
    
    const hha = document.getElementById('health-hearing-area');
    if (hha) { hha.classList.add('hidden'); hha.classList.remove('flex'); }
    
    const rpmTak = document.getElementById('rest-proposal-menu-takuitsu');
    if(rpmTak) { rpmTak.classList.add('hidden'); rpmTak.classList.remove('flex'); }
    
    const iMenu = document.getElementById('infinite-drill-menu');
    if(iMenu) { iMenu.classList.remove('hidden'); iMenu.classList.add('flex'); }
    
    const tet = document.getElementById('takuitsu-eval-toggle');
    if(tet) { tet.classList.add('hidden'); }
    
    sendKarteLog('session_end', { totalAnswered: cumulativeQuestions, mistakes: todayMistakes.length, continuousStudyTimeSec: continuousStudyTimeSec });
    
    if (isSenbonKnock || isTimeAttack || isBonusMode || isSuddenDeath || isCountdownRelay || isTrapMode || isHardcore || isSurpriseAttack) {
        let evType = isSenbonKnock ? "senbonKnock" : (isTimeAttack ? "timeAttack" : (isSuddenDeath ? "suddenDeath" : (isCountdownRelay ? "countdownRelay" : (isTrapMode ? "trapMode" : (isHardcore ? "hardcore" : (isSurpriseAttack ? "surpriseAttack" : "bonus"))))));
        if (typeof generateAiMessage === "function") generateAiMessage("end_event", { eventType: evType, qCount: eventQuestionsAnswered, correct: eventCorrectCount, textOnly: false });
    } else {
        if (typeof generateAiMessage === "function") generateAiMessage("end_all", { totalPlayed: cumulativeQuestions, mistakes: todayMistakes.length, textOnly: false });
    }
}

function startInfiniteDrill(mode) {
    flushStudyTimes();
    let newPlaylistQueue = [];
    initialPlaylistConfig.forEach(config => {
        let subjName = config.subjectName, chapName = config.chapterName, qType = config.type;
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
    currentPlaylistIndex = 0;
    
    const iMenu = document.getElementById('infinite-drill-menu');
    if(iMenu) { iMenu.classList.add('hidden'); iMenu.classList.remove('flex'); }
    
    const teCon = document.getElementById('takuitsu-eval-content');
    if(teCon) teCon.classList.remove('hidden');
    
    const btns = ['eval-btn-kanpeki', 'eval-btn-kantan', 'eval-btn-mayotta', 'eval-btn-wakaran'];
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

function pauseTimer() { stopStudyTimer(); clearIdleTimers(); const p = document.getElementById('pause-overlay'); if(p) { p.classList.remove('hidden'); p.classList.add('flex'); } }
function resumeTimer() { 
    const p = document.getElementById('pause-overlay'); if(p) { p.classList.add('hidden'); p.classList.remove('flex'); } 
    if (pauseInterval) clearInterval(pauseInterval);
    
    const ma = document.getElementById('main-area');
    const ea = document.getElementById('explanation-area');
    
    if(ma && ma.classList.contains('hidden')) {
        
    } else if(currentQuestions[currentIndex] && ea && ea.classList.contains('hidden')) {
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
                            if(ma) ma.classList.add('animate-shake', 'bg-red-50');
                            if(typeof generateAiMessage === "function") generateAiMessage("wake_up_day", {}, false, false);
                        }
                    }
                } 
            }, 1000);
        }
        startStudyTimer(); 
    } else if (currentQuestions[currentIndex] && ea && !ea.classList.contains('hidden')) {
        startIdleTimers(); 
    }
}
function openNapMenu() { stopStudyTimer(); clearIdleTimers(); const n = document.getElementById('nap-overlay'); if(n) { n.classList.remove('hidden'); n.classList.add('flex'); } if(typeof generateAiMessage === "function") generateAiMessage("nap_start", { textOnly: true });}
function cancelNapMenu() { const n = document.getElementById('nap-overlay'); if(n) { n.classList.add('hidden'); n.classList.remove('flex'); } resumeTimer(); }
function startNap(minutes) { napSecondsLeft = minutes * 60; localStorage.setItem('last_nap_time', new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'})); sendKarteLog('nap_start', { time: new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'}), durationMinutes: minutes }); runNapTimer(); }
function startNapCustom() {
    const ti = document.getElementById('nap-time-input'); if(!ti) return;
    const timeStr = ti.value; if(!timeStr) { alert("時刻を入力してね"); return; }
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
    const ns = document.getElementById('nap-setup'); if(ns) ns.classList.add('hidden'); 
    const nr = document.getElementById('nap-running'); if(nr) { nr.classList.remove('hidden'); nr.classList.add('flex'); }
    const ea = document.getElementById('explanation-area'); if(ea) { ea.classList.add('hidden'); ea.classList.remove('flex'); }
    const se = document.getElementById('self-eval-area-takuitsu'); if(se) se.classList.add('hidden');
    updateNapDisplay();
    napInterval = setInterval(() => {
        napSecondsLeft--; updateNapDisplay();
        if(napSecondsLeft <= 0) { 
            clearInterval(napInterval); playAlarmSound(); 
            const nc = document.getElementById('nap-countdown'); if(nc) nc.classList.add('animate-ping', 'text-red-500'); 
        }
    }, 1000);
}
function updateNapDisplay() {
    let m = Math.floor(Math.max(0, napSecondsLeft) / 60).toString().padStart(2, '0'); let s = (Math.max(0, napSecondsLeft) % 60).toString().padStart(2, '0');
    const nc = document.getElementById('nap-countdown');
    if(nc) nc.textContent = `${m}:${s}`;
}
function stopNap() {
    clearInterval(napInterval); if(beepInterval) clearInterval(beepInterval);
    const nc = document.getElementById('nap-countdown'); if(nc) nc.classList.remove('animate-ping', 'text-red-500');
    const no = document.getElementById('nap-overlay'); if(no) { no.classList.add('hidden'); no.classList.remove('flex'); }
    
    continuousStudyTimeSec = 0;
    finishAllPlaylists();
    if (typeof generateAiMessage === "function") generateAiMessage("nap_end", { textOnly: true }); 
}

function showHintTakuitsu() {
    currentQuestionHintCount++;
    const q = currentQuestions[currentIndex];
    if (typeof generateAiMessage === "function") generateAiMessage("hint_takuitsu", { questionText: q.問題文, explanation: q.解説 || "", textOnly: true });
}

function showHintSentaku() {
    currentQuestionHintCount++;
    const qArea = document.getElementById('question-text-sentaku');
    let text = qArea.innerHTML;
    text = text.replace(/(なければならない|努め|こと|また|ただし|において|ため)/g, '<span class="highlight-clue">$1</span>');
    qArea.innerHTML = text;
    if (typeof generateAiMessage === "function") generateAiMessage("hint_sentaku", { textOnly: true });
}

function executeAlchemyStart() {
    if(typeof generateAiMessage === "function") generateAiMessage("alchemy_prep", { textOnly: true });
}

function triggerAnalysisStrategy() {
    const si = document.getElementById('strategy-input');
    if (si) si.value = '弱点を分析して特訓プランを作って！';
    if(typeof sendStrategyMessage === "function") sendStrategyMessage();
}

function triggerEbbinghausStrategy() {
    const si = document.getElementById('strategy-input');
    if (si) si.value = '忘却曲線をベースに復習プランを作って！';
    if(typeof sendStrategyMessage === "function") sendStrategyMessage();
}