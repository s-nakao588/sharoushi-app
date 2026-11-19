const GAS_URL = "https://script.google.com/a/macros/sr-nakao.com/s/AKfycbyHu72D7p9XrmynRKYbt_4HOfhJ47D3xEdv-SgqTWS1iSrxWo6KuhZnzTbMvitQ7r0_Eg/exec";

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

// 🌟 項目の完全統合ルール
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

// 🌟 表示順の重み付け（数字が小さい順に上から並ぶ）
const CATEGORY_SORT_WEIGHTS = {
    // 労働基準法
    "1 労働基準法の基本理念": 10, "2 労働契約": 20, "3 賃金、賃金の支払の5原則": 30, "4 労働時間、休憩、休日": 40, "5 労働時間、変形労働時間制": 50, "6 時間外・休日労働、割増賃金": 60, "労働時間の計算等": 70, "8 年次有給休暇": 80, "9 年少者、妊産婦等": 90, "就業規則、監督等その他": 100,
    "雑則等": 999, // 🌟 最下部
    
    // 安全衛生法
    "1 総則等": 200, // 🌟 一番上
    "1 安全衛生管理体制等": 210, "2 機械等及び危険・有害物に関する規制": 220, "3 労働者の就業管理・健康管理等": 230,
    
    // 健康保険法
    "目的等": 240, "1 保険者・適用事業所等": 250, "2 被保険者・被扶養者": 260, "3 報酬・標準報酬月額等": 270, "届出・通知等": 280, "保険医療機関等・療養担当者": 290, "費用の負担・保険料等": 300, "4 保険給付 1 (療養の給付等)": 310, "5 保険給付 2 (現金給付・資格喪失後の給付等)": 320, "日雇特例・保健福祉事業": 330, "時効・不服申立て・雑則等": 340,
    
    // 厚生年金保険法
    "1 総則・適用事業所等": 350, "2 被保険者・被保険者期間等": 360, "3 標準報酬等": 370, "4 給付通則等": 380,
    "5 費用の負担・保険料等": 390, // 🌟 給付通則等の後ろ
    "6 老齢厚生年金": 400, "7 障害厚生年金・障害手当金": 410, "8 遺族厚生年金・脱退一時金": 420, "9 年金分割の特例": 430, "10 不服申立て・雑則等": 440
};

// 🌟 データ読み込み時に項目名を強制的に整理する関数
function normalizeCategory(cat) {
    if (!cat) return "分類なし";
    let c = cat.trim();
    if (c === "過去問" || c === "最新問題") return c;
    if (CATEGORY_MANUAL_MAP[c]) return CATEGORY_MANUAL_MAP[c];
    
    // 前方一致や部分一致のチェック
    for (let key in CATEGORY_MANUAL_MAP) {
        if (c.startsWith(key) || key.startsWith(c)) {
            return CATEGORY_MANUAL_MAP[key];
        }
    }
    // 厚生年金の「保険料」特例マッチ
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
        if(savedMute !== null) { 
            isMuted = (savedMute === 'true');
        }
        if(savedCond) {
            document.getElementById('condition-select').value = savedCond;
        }
        updateSoundButtons();
        
        document.getElementById('condition-select').addEventListener('change', function(e) {
            localStorage.setItem('sharoushi_condition', e.target.value);
        });
        
    } catch(e) {}
    
    sessionTimerInterval = setInterval(() => {
        sessionTotalTimeSec++;
    }, 1000);
    
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
        if(!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if(audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        const player = document.getElementById('tts-player');
        if (player) {
            const isPlaying = player.currentTime > 0 && !player.paused && !player.ended && player.readyState > 2;
            if (!isPlaying) {
                player.play().catch(e => {}); 
            }
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
    if (isMuted) stopAudio();
    else unlockAudio();
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
        let count = parseInt