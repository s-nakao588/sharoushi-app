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
let strategyHistory = [], strategyPlan = null;

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

// 📓 マイノート用の一時データ保持
let activeNotebookQId = null;
let activeNotebookImageBase64 = null;

window.onload = function() {
    try {
        const savedKey = localStorage.getItem('gemini_api_key');
        const savedModel = localStorage.getItem('gemini_api_model');
        if(savedKey) { document.getElementById('api-key-input').value = savedKey; userApiKey = savedKey; }
        if(savedModel) { document.getElementById('api-model-input').value = savedModel; userModel = savedModel; }
    } catch(e) {}
    
    sessionTimerInterval = setInterval(() => {
        sessionTotalTimeSec++;
    }, 1000);
    
    flushStudyTimes(); 
    loadAllSubjects();
    fetchHistory(); 
    updateStartScreenNotebookBadge();
};

function unlockAudio() {
    try {
        if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtx.resume();
    } catch (e) {}
}
function toggleSound() {
    isMuted = !isMuted; unlockAudio();
    const txt = isMuted ? "🔇 音声オフ" : "🔊 音声オン";
    const btn1 = document.getElementById('sound-toggle-start-btn');
    const btn2 = document.getElementById('sound-toggle-main-btn');
    if(btn1) btn1.innerHTML = txt;
    if(btn2) btn2.innerHTML = txt;
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

function stopAudio() {
    const p = document.getElementById('tts-player');
    if(p) { p.pause(); p.currentTime = 0; }
    if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); }
}

function playCompletedArticle() {
    const text = document.getElementById('article-text').textContent;
    if(text && text !== "条文なし") speakText(text);
}

function generateAlchemyQuestion() {
    generateAiMessage("alchemy_prep", { textOnly: true });
}

function startIdleTimers() {
    clearIdleTimers();
    if (isSenbonKnock || isCountdownRelay || isSuddenDeath || isSurpriseAttack) return; 
    idleTimeoutWarn = setTimeout(() => { generateAiMessage("idle_warn", { textOnly: false }); }, 15000);
    idleTimeoutPenalty = setTimeout(() => { 
        if (continuousStudyTimeSec < 3600) {
            if (globalTimeLeftSeconds !== null) globalTimeLeftSeconds += 60; 
            generateAiMessage("idle_penalty", { textOnly: false }); 
        } else {
            generateAiMessage("idle_care", { textOnly: false }); 
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
            let pendingTimes = JSON.parse(localStorage.getItem('pending_study_times') || '{}');
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

function saveRequestHabit(input) {
    let reqs = JSON.parse(localStorage.getItem('strategy_habits') || '[]');
    reqs.push({ time: new Date().toISOString(), text: input });
    if(reqs.length > 5) reqs.shift();
    localStorage.setItem('strategy_habits', JSON.stringify(reqs));
}

function sendKarteLog(logType, detailObj) {
    const cond = document.getElementById('condition-select').value;
    const health = document.getElementById('health-select').value;
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
                        q._subjectName = subject.name; q._type = subject.type; q.項目 = q.項目 || "分類なし"; q._id = q.問題文.substring(0, 30); 
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
        allDatabase.forEach(q => {
            if (localFixes[q._id]) {
                let fix = localFixes[q._id];
                if (q._type === '択一' && fix.correctChoice) q.正誤 = fix.correctChoice;
                if (fix.newExplanation) q.解説 = fix.newExplanation;
                q._verified = true;
            }
        });
        
        document.getElementById('loading-status').textContent = `✅ 完了 (${allDatabase.length}問)`;
        buildSubjectAccordionUI(); updateDashboard();
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
        for (let chap in s.chapters) {
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

    if(userApiKey) {
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
        Array.from(chaptersSet).forEach(c => {
            checkboxHTML += `<label class="flex items-center space-x-2 md:space-x-4 cursor-pointer p-2 md:p-4 hover:bg-indigo-50"><input type="checkbox" name="chapter-check" value="${subjectName}::${c}" class="w-6 h-6 md:w-8 md:h-8"><span class="text-sm md:text-lg font-bold">${c}</span></label>`;
        });
        checkboxHTML += `</div>`;
        content.innerHTML = checkboxHTML;
        container.appendChild(header); container.appendChild(content);
    }
}

function checkAllChapters(check) { document.querySelectorAll('input[name="chapter-check"]').forEach(cb => cb.checked = check); }

function triggerAnalysisStrategy() {
    document.getElementById('strategy-input').value = '弱点を分析して特訓プランを作って！';
    sendStrategyMessage();
}

function triggerEbbinghausStrategy() {
    document.getElementById('strategy-input').value = '忘却曲線をベースに復習プランを作って！';
    sendStrategyMessage();
}

async function sendStrategyMessage() {
    userApiKey = document.getElementById('api-key-input').value.trim();
    if(!userApiKey) { alert("APIキーが必要です"); document.getElementById('api-settings-wrapper').classList.remove('hidden'); return; }
    const inputEl = document.getElementById('strategy-input'); const input = inputEl.value.trim();
    if(!input) return;
    sendKarteLog('strategy_chat', { message: input });
    saveRequestHabit(input);
    const logEl = document.getElementById('strategy-chat-log');
    logEl.innerHTML += `<div class="self-end bg-indigo-100 text-indigo-900 p-2 md:p-3 rounded-xl md:rounded-2xl rounded-tr-none max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-sm md:text-xl">${input}</div>`;
    logEl.scrollTop = logEl.scrollHeight; inputEl.value = "";
    const typingId = "typing-" + Date.now();
    logEl.innerHTML += `<div id="${typingId}" class="self-start bg-white border-2 border-pink-200 text-slate-700 p-2 md:p-3 rounded-xl md:rounded-2xl rounded-tl-none max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-sm md:text-xl"><span class="typing">💬 考えてるよ...</span></div>`;
    logEl.scrollTop = logEl.scrollHeight;
    const cond = document.getElementById('condition-select').value; const health = document.getElementById('health-select').value;
    const habits = localStorage.getItem('strategy_habits') || '[]';
    
    let systemPrompt = `あなたは社労士試験の専属個別指導講師（18歳前後の若い女性）です。受講生の要望を最優先で聞き入れ、的確に特訓プランをまとめてください。
【現在のコンディション】
・現在時刻: ${new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'})}
・過去の依頼傾向: ${habits}
・講師モード: ${cond}
・受講生の体調: ${health}

【最重要ルール: 要望の遵守】
受講生が科目数や問題数を具体的に指定した場合は、【絶対に勝手にすり替えたり減らしたりせず】、「了解！その通りに準備するね！」と受講生の指定をそのまま全肯定してプランを確定させてください。
時間帯や過去の傾向（例えば14時にスキマ勉強をよくしている等）から、先回りした提案をしてもよいです。

【話し方・口調】
・現代の普通の若い女性。普通の自然な口語体（1〜2文）で話す。
・「〜だぞ」「〜だろ」「〜わ」「〜よ」「ふふっ」「〜かしら」等の不自然な役割語は【絶対禁止】。

【プラン確定時のJSON出力ルール】
受講生とプランが合意、または受講生から具体的な指定があった場合、返答の最後に必ず以下のJSON（複数科目対応）を出力してください。
\`\`\`json
{
  "plan": [
    { "subject": "労働基準法(択一)", "count": 10 }
  ]
}
\`\`\``;
    let apiMessages = [{ role: "user", parts: [{ text: systemPrompt + " 受講生の要望: " + input }] }];
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: apiMessages })
        });
        if (!res.ok) throw new Error("通信エラー");
        const data = await res.json(); const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        let replyText = text.replace(/```json\n[\s\S]*?\n```/, '').trim();
        document.getElementById(typingId).outerHTML = `<div class="self-start bg-white border-2 border-pink-200 text-slate-700 p-2 md:p-3 rounded-xl md:rounded-2xl rounded-tl-none max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-sm md:text-xl">${replyText}</div>`;
        logEl.scrollTop = logEl.scrollHeight;
        if (jsonMatch) {
            strategyPlan = JSON.parse(jsonMatch[1]);
            document.getElementById('btn-strategy-start').classList.remove('hidden');
        }
    } catch(e) {
        document.getElementById(typingId).outerHTML = `<div class="self-start bg-red-50 text-red-600 p-2 md:p-3 rounded-xl md:rounded-2xl max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-sm md:text-xl border border-red-200">⚠️ 通信エラーが発生したみたい。もう一度話しかけてみて！</div>`;
        logEl.scrollTop = logEl.scrollHeight;
    }
}

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

function executeStrategyPlan() {
    if(!strategyPlan) return;
    userApiKey = document.getElementById('api-key-input').value.trim();
    userModel = document.getElementById('api-model-input').value;
    if (!userApiKey) { alert("APIキーを入力してください！"); return; }
    unlockAudio();
    
    cumulativeQuestions = 0; setCorrectCount = 0; todayMistakes = []; usedQuestionIds = new Set();
    playlistQueue = []; totalQuestionsToPlay = 0;
    
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
    startNextPlaylistSet(true);
}

function startTraining(mode, targetSubject = null, excludePerfect = false, count = 10) {
    if(allDatabase.length === 0) { alert("データがありません。"); return; }
    userApiKey = document.getElementById('api-key-input').value.trim();
    userModel = document.getElementById('api-model-input').value;
    if (!userApiKey) { alert("APIキーを入力してください！"); document.getElementById('api-settings-wrapper').classList.remove('hidden'); return; }
    try { localStorage.setItem('gemini_api_key', userApiKey); localStorage.setItem('gemini_api_model', userModel); } catch(e) {}
    unlockAudio();
    
    cumulativeQuestions = 0; setCorrectCount = 0; todayMistakes = []; usedQuestionIds = new Set();
    playlistQueue = []; totalQuestionsToPlay = 0;
    
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

    if (globalTimeLeftSeconds !== null) {
        document.getElementById('time-display').classList.remove('hidden');
        globalTimerInterval = setInterval(globalTimerTick, 1000);
    } else {
        document.getElementById('time-display').textContent = '無制限';
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
    startNextPlaylistSet(true);
}

function globalTimerTick() {
    if(globalTimeLeftSeconds === null) return;
    globalTimeLeftSeconds--;
    if (globalTimeLeftSeconds > 0) {
        const h = Math.floor(globalTimeLeftSeconds / 3600);
        const m = Math.floor((globalTimeLeftSeconds % 3600) / 60);
        const s = globalTimeLeftSeconds % 60;
        let txt = h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}` : `${m}:${s.toString().padStart(2,'0')}`;
        document.getElementById('time-display').textContent = `⏳ ${txt}`;
        document.getElementById('time-display').classList.remove('bg-red-600', 'text-white', 'animate-pulse');
        document.getElementById('time-display').classList.add('bg-slate-800', 'text-yellow-400');
    } else {
        isTimeUp = true;
        document.getElementById('time-display').textContent = '🏁 時間切れ';
        document.getElementById('time-display').classList.remove('bg-slate-800', 'text-yellow-400');
        document.getElementById('time-display').classList.add('bg-red-600', 'text-white', 'animate-pulse');
    }
}

function startNextPlaylistSet(isFirstOfAll = false) {
    const currentSet = playlistQueue[currentPlaylistIndex];
    currentQuestions = currentSet.questions; currentIndex = 0;
    document.getElementById('current-playlist-title').textContent = `🎧 [${currentPlaylistIndex + 1}/${playlistQueue.length}] ${currentSet.subjectName} - ${currentSet.chapterName}`;
    
    if (isSenbonKnock || isSuddenDeath || isCountdownRelay || isSurpriseAttack) {
        document.getElementById('btn-surrender').classList.remove('hidden');
    }
    loadQuestion(false, isFirstOfAll);
}

function startCountdownRelayTimer() {
    countdownTimeLeft = 20; 
    document.getElementById('timer-bar').style.animation = 'none';
    relayTimerInterval = setInterval(() => {
        if (isAnsweredTakuitsu) return; 
        countdownTimeLeft--;
        let pct = Math.min(100, (countdownTimeLeft / 30) * 100);
        document.getElementById('timer-bar').style.width = pct + '%';
        document.getElementById('timer-bar').style.backgroundColor = countdownTimeLeft > 10 ? '#10b981' : '#ef4444';
        document.getElementById('time-display').textContent = `🔥 残 ${countdownTimeLeft}秒`;
        document.getElementById('time-display').classList.add('bg-red-600', 'text-white');
        document.getElementById('time-display').classList.remove('bg-slate-800', 'text-yellow-400');
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
    document.getElementById('hardcore-unlock-area').classList.add('hidden');
    document.getElementById('hardcore-unlock-area').classList.remove('flex');
    document.getElementById('normal-sentaku-actions').classList.remove('hidden');
    document.getElementById('normal-sentaku-actions').classList.add('flex');
    const q = currentQuestions[currentIndex];
    sendKarteLog('hardcore_unlock', { type: type, q_id: q._id, question: q.問題文.substring(0, 20) });
}

function startPause() {
    stopStudyTimer();
    clearIdleTimers();
    pauseSeconds = 0;
    document.getElementById('pause-timer-display').textContent = "00:00";
    document.getElementById('pause-overlay').classList.remove('hidden');
    document.getElementById('pause-overlay').classList.add('flex');
    pauseInterval = setInterval(() => {
        pauseSeconds++;
        let m = Math.floor(pauseSeconds / 60).toString().padStart(2, '0');
        let s = (pauseSeconds % 60).toString().padStart(2, '0');
        document.getElementById('pause-timer-display').textContent = `${m}:${s}`;
    }, 1000);
}

function startNapQuick(minutes) {
    stopStudyTimer();
    clearIdleTimers();
    document.getElementById('nap-overlay').classList.remove('hidden');
    document.getElementById('nap-overlay').classList.add('flex');
    napSecondsLeft = minutes * 60;
    localStorage.setItem('last_nap_time', new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'}));
    sendKarteLog('nap_start', { time: new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'}), durationMinutes: minutes }); 
    runNapTimer();
    generateAiMessage("nap_start", { textOnly: true });
}

function loadQuestion(isAlchemy = false, isFirstOfSet = false) {
    const q = currentQuestions[currentIndex];
    if (!q) return;
    
    if (isSenbonKnock || isSuddenDeath || isCountdownRelay || isSurpriseAttack) {
        document.getElementById('question-progress').textContent = `${eventQuestionsAnswered + 1} 問目`;
    } else {
        document.getElementById('question-progress').textContent = `${currentIndex + 1} / ${currentQuestions.length} 問`;
    }

    document.getElementById('q-subject-badge').textContent = q._subjectName;
    document.getElementById('q-chapter-text').textContent = q.項目 || (isAlchemy ? "Pro AI 錬金問題" : "条文");
    
    const hist = userHistory[q._id] || { playCount: 0, correctCount: 0 };
    let maxScore = q._type === '選択' ? (hist.playCount * 5) : hist.playCount;
    const rate = hist.playCount > 0 ? Math.round((hist.correctCount / maxScore) * 100) : 0;
    document.getElementById('q-history-stats').textContent = `挑戦:${hist.playCount} 過去正答:${rate}%`;

    document.getElementById('explanation-area').classList.add('hidden');
    document.getElementById('ai-fix-action').classList.add('hidden');
    
    document.getElementById('self-eval-area-takuitsu').classList.add('hidden');
    document.getElementById('self-eval-area-takuitsu').classList.remove('block', '!block');
    document.getElementById('self-eval-area-sentaku').classList.add('hidden');
    document.getElementById('self-eval-area-sentaku').classList.remove('block', '!block');
    
    document.getElementById('takuitsu-eval-content').classList.remove('hidden');
    document.getElementById('rest-proposal-menu-takuitsu').classList.add('hidden');
    document.getElementById('rest-proposal-menu-takuitsu').classList.remove('flex');
    document.getElementById('infinite-drill-menu').classList.add('hidden');
    document.getElementById('infinite-drill-menu').classList.remove('flex');
    
    const ignoredFixes = JSON.parse(localStorage.getItem('ignored_fixes') || '{}');
    const badge = document.getElementById('ignored-fix-badge');
    if (ignoredFixes[q._id]) {
        badge.classList.remove('hidden');
        pendingFixData = ignoredFixes[q._id];
    } else {
        badge.classList.add('hidden');
        pendingFixData = null;
    }
    
    isAnsweredTakuitsu = false;
    currentTakuitsuEval = null;
    
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

    if (!isSenbonKnock && !isTimeAttack && !isBonusMode && !isSuddenDeath && !isCountdownRelay && !isTrapMode && !isSurpriseAttack) {
        document.getElementById('takuitsu-eval-buttons').classList.remove('hidden');
        document.getElementById('eval-guide-text-takuitsu').classList.remove('hidden');
    } else {
        document.getElementById('takuitsu-eval-buttons').classList.add('hidden');
        document.getElementById('eval-guide-text-takuitsu').classList.add('hidden');
    }
    
    document.getElementById('q-type-badge-header').textContent = q._type + "式モード";
    startStudyTimer(q._subjectName);

    if (q._type === '択一') {
        document.getElementById('takuitsu-ui').classList.remove('hidden');
        document.getElementById('sentaku-ui').classList.add('hidden');
        document.getElementById('action-takuitsu').classList.remove('hidden');
        document.getElementById('action-sentaku').classList.add('hidden');
        document.getElementById('tts-area').classList.add('hidden');
        document.getElementById('alchemy-btn').classList.add('hidden');
        document.getElementById('question-text-takuitsu').innerHTML = q.問題文.replace(/\n/g, '<br>');
        
        if (!isCountdownRelay) {
            clearInterval(timerInterval);
            const timerBar = document.getElementById('timer-bar');
            timerBar.style.animation = 'none'; void timerBar.offsetWidth; 
            currentLimit = isTimeAttack ? 15 : (isSenbonKnock || isSuddenDeath || isSurpriseAttack ? 20 : 60);
            timerBar.style.animation = `timer-run ${currentLimit}s linear forwards`;
            timeLeft = currentLimit;
            timerInterval = setInterval(() => {
                timeLeft--; 
                if(timeLeft <= 0) { playWhistleSound(); clearInterval(timerInterval); }
            }, 1000);
        }

    } else {
        document.getElementById('takuitsu-ui').classList.add('hidden');
        document.getElementById('sentaku-ui').classList.remove('hidden');
        document.getElementById('action-takuitsu').classList.add('hidden');
        document.getElementById('action-sentaku').classList.remove('hidden');
        document.getElementById('tts-area').classList.remove('hidden');
        document.getElementById('tts-area').classList.add('flex');
        document.getElementById('alchemy-btn').classList.remove('hidden');
        
        clearInterval(timerInterval);
        document.getElementById('timer-bar').style.animation = 'none';
        
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
        document.getElementById('question-text-sentaku').innerHTML = htmlText;

        const wbContainer = document.getElementById('word-bank-container');
        wbContainer.innerHTML = "";
        currentWordBank.forEach((word, idx) => {
            wbContainer.innerHTML += `<div id="word-btn-${idx}" onclick="toggleStrike('${word}', this)" class="cursor-pointer border border-slate-300 p-1 md:p-2 rounded md:rounded-lg text-center hover:bg-slate-50 transition-all select-none bg-white"><span class="word-num">${idx+1}</span>${word}</div>`;
        });
        
        if (isHardcore) {
            document.querySelectorAll('.inline-select').forEach(sel => {
                sel.disabled = true;
                sel.classList.add('opacity-50', 'bg-slate-200', 'cursor-not-allowed');
            });
            document.getElementById('hardcore-unlock-area').classList.remove('hidden');
            document.getElementById('hardcore-unlock-area').classList.add('flex');
            document.getElementById('normal-sentaku-actions').classList.add('hidden');
            document.getElementById('normal-sentaku-actions').classList.remove('flex');
        } else {
            document.getElementById('hardcore-unlock-area').classList.add('hidden');
            document.getElementById('hardcore-unlock-area').classList.remove('flex');
            document.getElementById('normal-sentaku-actions').classList.remove('hidden');
            document.getElementById('normal-sentaku-actions').classList.add('flex');
        }
    }

    if (isFirstOfSet) {
        if(isTimeAttack) generateAiMessage("start_timeattack", { textOnly: false });
        else if(isBonusMode) generateAiMessage("start_bonus", { textOnly: false });
        else if(isSenbonKnock) generateAiMessage("start_senbon", { textOnly: true });
        else if(isSurpriseAttack) generateAiMessage("start_surprise", { textOnly: false });
        else if(!isSuddenDeath && !isCountdownRelay && !isTrapMode && !isHardcore) {
            generateAiMessage(`start_${q._type === '択一' ? 'takuitsu' : 'sentaku'}`, { textOnly: false });
        }
    }
    verifyDataWithPro(q);
}

function answerTakuitsu(userAnswer) {
    if (isAnsweredTakuitsu) return;
    isAnsweredTakuitsu = true;
    
    stopStudyTimer(); 
    flushStudyTimes(); 
    
    const q = currentQuestions[currentIndex];
    if (!isCountdownRelay) {
        clearInterval(timerInterval); document.getElementById('timer-bar').style.animationPlayState = 'paused';
    }
    
    const btnMaru = document.getElementById('btn-takuitsu-maru');
    const btnBatsu = document.getElementById('btn-takuitsu-batsu');
    btnMaru.disabled = true; btnBatsu.disabled = true;
    btnMaru.classList.add('cursor-not-allowed'); btnBatsu.classList.add('cursor-not-allowed');
    
    if (userAnswer === '〇') {
        btnMaru.classList.add('ring-4', 'ring-blue-500');
        btnBatsu.classList.add('opacity-30');
    } else {
        btnBatsu.classList.add('ring-4', 'ring-red-500');
        btnMaru.classList.add('opacity-30');
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
    
    document.getElementById('action-takuitsu').classList.add('hidden');
    document.getElementById('explanation-area').classList.remove('hidden');
    document.getElementById('explanation-area').classList.add('flex');
    
    const evalArea = document.getElementById('self-eval-area-takuitsu');
    evalArea.classList.remove('hidden');
    evalArea.classList.add('block', '!block');
    
    const badge = document.getElementById('score-badge');
    badge.textContent = isCorrect ? "大正解！ 🎉" : "不正解... 💦";
    badge.className = isCorrect ? "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-green-500 shadow-md mb-2 animate-bounce" : "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-red-500 shadow-md mb-2";
    document.getElementById('article-text').textContent = q.根拠条文 || "条文なし";
    document.getElementById('explanation-text').innerHTML = q.解説 || "解説なし";
    
    // 📓 マイノートボタンの表示状態更新
    updateNotebookButtonDisplay(q._id);

    if (!isSenbonKnock && !isTimeAttack && !isBonusMode && !isSuddenDeath && !isCountdownRelay && !isTrapMode && !isSurpriseAttack) {
        if (currentIndex >= currentQuestions.length - 1) {
            document.getElementById('eval-guide-text-takuitsu').textContent = "自己評価を選んでセットを完了してね！";
        } else {
            document.getElementById('eval-guide-text-takuitsu').textContent = "自己評価を選んで次へ進んでね！";
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
        generateAiMessage("answer_takuitsu", { isCorrect: isCorrect, explanation: q.解説, textOnly: true });
    }
}

function showHintTakuitsu() {
    const q = currentQuestions[currentIndex];
    generateAiMessage("hint_takuitsu", { questionText: q.問題文, explanation: q.解説 || "", textOnly: true });
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
    let text = qArea.innerHTML;
    text = text.replace(/(なければならない|努め|こと|また|ただし|において|ため)/g, '<span class="highlight-clue">$1</span>');
    qArea.innerHTML = text;
    generateAiMessage("hint_sentaku", { textOnly: true });
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
    if(hasUnanswered) { document.getElementById('warning-modal').classList.remove('hidden'); document.getElementById('warning-modal').classList.add('flex'); return; }

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

    document.getElementById('action-sentaku').classList.add('hidden');
    document.getElementById('explanation-area').classList.remove('hidden');
    document.getElementById('explanation-area').classList.add('flex');
    
    const evalAreaSentaku = document.getElementById('self-eval-area-sentaku');
    evalAreaSentaku.classList.remove('hidden');
    evalAreaSentaku.classList.add('block', '!block');
    
    document.getElementById('score-badge').textContent = `${score} / 5 点`;
    document.getElementById('score-badge').className = score === 5 ? "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-green-500 shadow-md mb-2 animate-bounce" : "inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-lg md:text-2xl font-black text-white bg-red-500 shadow-md mb-2";
    document.getElementById('article-text').textContent = currentQuestions[currentIndex].根拠条文 || "条文なし";
    document.getElementById('explanation-text').innerHTML = currentQuestions[currentIndex].解説 || "解説なし";

    // 📓 マイノートボタンの表示状態更新
    updateNotebookButtonDisplay(currentQuestions[currentIndex]._id);

    const evalTargetContainer = document.getElementById('eval-target-buttons');
    evalTargetContainer.innerHTML = '<span id="eval-target-label" class="text-[10px] md:text-xs font-bold text-slate-500 self-center mr-1 md:mr-2">対象:</span>';
    ['A','B','C','D','E'].forEach(letter => {
        evalTargetContainer.innerHTML += `<label class="eval-target-box flex items-center gap-1 cursor-pointer bg-slate-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-slate-300"><input type="checkbox" name="eval-target" value="${letter}"><span class="font-bold text-xs md:text-sm">${letter}</span></label>`;
    });
    if (currentIndex >= currentQuestions.length - 1) {
        document.getElementById('btn-next-sentaku').textContent = (currentPlaylistIndex < playlistQueue.length - 1) ? "🟢 次の科目セットへ" : "🟢 特訓終了！判定へ";
    }
    
    startIdleTimers(); 
    generateAiMessage("result_sentaku", { score: score, textOnly: false });
}
function closeWarningModal() { document.getElementById('warning-modal').classList.add('hidden'); document.getElementById('warning-modal').classList.remove('flex'); }

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
        if (key === status) {
            btns[key].classList.remove('opacity-40');
            btns[key].classList.add('ring-2', 'ring-offset-2', 'ring-slate-400');
        } else {
            btns[key].classList.add('opacity-40');
            btns[key].classList.remove('ring-2', 'ring-offset-2', 'ring-slate-400');
        }
    }
    
    const nextBtn = document.getElementById('btn-next-takuitsu');
    nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    nextBtn.textContent = "次の問題へ ➡";
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
    const checked = Array.from(document.querySelectorAll('input[name="eval-target"]:checked')).map(cb => cb.value);
    if(checked.length === 0) { alert("対象の空欄(A~E)を選択してください"); return; }
    const statusStr = `${status}(${checked.join(',')})`;
    const q = currentQuestions[currentIndex];
    fetch(GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'save_status', q_id: q._id, status: statusStr }) });
    document.querySelectorAll('input[name="eval-target"]:checked').forEach(cb => {
        cb.parentElement.classList.add('opacity-30', 'bg-yellow-200'); cb.checked = false;
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
            
            document.getElementById('ai-message').textContent = "記録を取り消したよ！次から気をつけてね！";
        } catch(e) { alert("取り消しに失敗しました"); }
    }
}

function applyFixToGAS() {
    if(!pendingFixData) return;
    const q = currentQuestions[currentIndex];
    
    let localFixes = JSON.parse(localStorage.getItem('local_fixes') || '{}');
    localFixes[q._id] = pendingFixData;
    localStorage.setItem('local_fixes', JSON.stringify(localFixes));
    
    if(q._type === '択一' && pendingFixData.correctChoice) {
        q.正誤 = pendingFixData.correctChoice;
    }
    q.解説 = pendingFixData.newExplanation || q.解説;
    q._verified = true;
    
    let ignored = JSON.parse(localStorage.getItem('ignored_fixes') || '{}');
    if(ignored[q._id]) {
        delete ignored[q._id];
        localStorage.setItem('ignored_fixes', JSON.stringify(ignored));
    }
    
    document.getElementById('ai-fix-action').classList.add('hidden');
    document.getElementById('ignored-fix-badge').classList.add('hidden');
    
    generateAiMessage("apply_fix", { textOnly: true });
    pendingFixData = null;
}

function ignoreFix() {
    if(!pendingFixData) return;
    const q = currentQuestions[currentIndex];
    let ignored = JSON.parse(localStorage.getItem('ignored_fixes') || '{}');
    ignored[q._id] = pendingFixData;
    localStorage.setItem('ignored_fixes', JSON.stringify(ignored));
    
    document.getElementById('ai-fix-action').classList.add('hidden');
    document.getElementById('ignored-fix-badge').classList.remove('hidden');
    
    generateAiMessage("ignore_fix", { textOnly: true });
}

function showIgnoredFix() {
    if(!pendingFixData) return;
    document.getElementById('ai-fix-reason').textContent = pendingFixData.reason;
    document.getElementById('ai-fix-action').classList.remove('hidden');
}

function surrenderSenbonKnock() {
    document.getElementById('btn-surrender').classList.add('hidden');
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
        if (isSudden) isSuddenDeath = true;
        else { isCountdownRelay = true; startCountdownRelayTimer(); }
        
        generateAiMessage(isSudden ? "start_suddendeath" : "start_relay", { textOnly: false });
        startNextPlaylistSet();
        return true;
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
        currentPlaylistIndex++;
        if (currentPlaylistIndex < playlistQueue.length) {
            startNextPlaylistSet();
        } else {
            if (checkSpecialEvents()) return;
            finishAllPlaylists();
        }
    } else { 
        loadQuestion(currentQuestions[currentIndex].解説 && currentQuestions[currentIndex].解説.includes('錬金術'), false); 
    }
}

function finishAllPlaylists() {
    document.getElementById('explanation-area').classList.remove('hidden'); document.getElementById('explanation-area').classList.add('flex');
    
    const evalArea = document.getElementById('self-eval-area-takuitsu');
    evalArea.classList.remove('hidden');
    evalArea.classList.add('block', '!block');
    
    document.getElementById('self-eval-area-sentaku').classList.add('hidden');
    document.getElementById('self-eval-area-sentaku').classList.remove('block', '!block');
    
    document.getElementById('takuitsu-eval-content').classList.add('hidden');
    document.getElementById('rest-proposal-menu-takuitsu').classList.add('hidden');
    document.getElementById('rest-proposal-menu-takuitsu').classList.remove('flex');
    
    document.getElementById('infinite-drill-menu').classList.remove('hidden');
    document.getElementById('infinite-drill-menu').classList.add('flex');
    
    generateAiMessage("end_all", { totalPlayed: cumulativeQuestions, mistakes: todayMistakes.length, textOnly: false });
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
            let allChaps = [...new Set(pool.map(q => q.項目))];
            let currentIdx = allChaps.indexOf(chapName);
            let nextChap = allChaps[(currentIdx + 1) % allChaps.length];
            let chapPool = pool.filter(q => q.項目 === nextChap);
            qs = chapPool.sort(()=>Math.random()-0.5).slice(0, 10);
            if(qs.length > 0) newPlaylistQueue.push({ subjectName: subjName, chapterName: nextChap, type: qType, questions: qs });
            config.chapterName = nextChap;
        } else if (mode === 'review') {
            let chapPool = pool.filter(q => q.項目 === chapName);
            let mistakes = chapPool.filter(q => {
                let h = userHistory[q._id];
                if(!h || !h.historyStr) return false;
                let hArr = h.historyStr.split(',');
                let latest = hArr[hArr.length - 1];
                return (q._type === '択一' && latest === '✖') || (q._type === '選択' && !latest.includes('5点'));
            });
            qs = mistakes.slice(0, 10);
            if (qs.length < 10) {
                let remains = chapPool.filter(q => !qs.includes(q)).sort((a,b) => (userHistory[a._id]?.playCount || 0) - (userHistory[b._id]?.playCount || 0));
                qs = qs.concat(remains.slice(0, 10 - qs.length));
            }
            if(qs.length > 0) newPlaylistQueue.push({ subjectName: subjName, chapterName: chapName + " (復習)", type: qType, questions: qs });
        }
    });

    if (newPlaylistQueue.length === 0) { alert("抽出できる問題がありませんでした。"); return; }
    playlistQueue = newPlaylistQueue;
    resetGameFlags();
    currentPlaylistIndex = 0;
    
    document.getElementById('infinite-drill-menu').classList.add('hidden');
    document.getElementById('infinite-drill-menu').classList.remove('flex');
    document.getElementById('takuitsu-eval-content').classList.remove('hidden');
    startNextPlaylistSet(true);
}

async function speakText(text) {
    if (isMuted || !text) return; 
    let cleanText = text.replace(/<[^>]+>/g, '').trim(); if (!cleanText) return;
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: cleanText }] }] })
        });
        if (!res.ok) throw new Error("TTS API Error");
        const data = await res.json();
        const p = document.getElementById('tts-player');
        p.src = `data:audio/mp3;base64,${data.candidates[0].content.parts[0].inlineData.data}`; p.play();
    } catch (err) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(cleanText); utterance.lang = 'ja-JP';
            window.speechSynthesis.speak(utterance);
        }
    }
}

async function generateAiMessage(situation, extraData = {}) {
    const aiMessageEl = document.getElementById('ai-message');
    if(aiMessageEl) aiMessageEl.innerHTML = '<span class="typing">💬 ...</span>';
    
    const cond = document.getElementById('condition-select').value;
    let prompt = `あなたは社労士試験の専属個別指導講師（18歳前後の若い女性）です。受講生のモードは「${cond}」です。
【絶対ルール】
1. セリフ本文のみを1〜2文で出力すること。
2. 定型文は一切使わず、毎回必ず状況に合わせて自分の言葉で考えて生成すること。
3. 決して暴言や高圧的な説教はせず、親しみやすい現代の一般的な若い女性の自然な口語体で話すこと。\n`;

    if (situation === "start_takuitsu") prompt += `択一式の特訓スタート。短く前向きに気合を入れて。`;
    else if (situation === "start_sentaku") prompt += `選択式の特訓スタート。文脈を意識して埋めてみてと励まして。`;
    else if (situation === "hint_takuitsu") prompt += `択一式のヒント。答えは言わず、見るべきポイントを1文で示して。問題:${extraData.questionText} 解説:${extraData.explanation}`;
    else if (situation === "hint_sentaku") prompt += `選択式のヒント。「キーワードを黄色くしたから確認してみて」とアドバイスして。`;
    else if (situation === "answer_takuitsu") prompt += `択一式解答。結果は【${extraData.isCorrect ? "正解" : "不正解"}】。解説から最重要ポイントを1文で要約して。解説:${extraData.explanation}`;
    else if (situation === "result_sentaku") prompt += `選択式解答完了。5点中${extraData.score}点。点数に応じたコメントと、迷ったところは記録してねと促して。`;
    else if (situation === "end_all") prompt += `全問題終了。頑張りを心から労い、次への励ましを。`;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text;
        if(aiMessageEl) { aiMessageEl.textContent = text; }
        if (!extraData.textOnly) speakText(text); 
    } catch(e) {
        if(aiMessageEl) { aiMessageEl.textContent = `今日も一緒に一問ずつ進めていこうね！`; }
    }
}

async function verifyDataWithPro(q) {
    if (q._verified) return; 
    let localFixes = JSON.parse(localStorage.getItem('local_fixes') || '{}');
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
            document.getElementById('ai-fix-reason').textContent = pendingFixData.reason;
            document.getElementById('ai-fix-action').classList.remove('hidden');
        }
    } catch(e) {}
}

function pauseTimer() { stopStudyTimer(); clearIdleTimers(); document.getElementById('pause-overlay').classList.remove('hidden'); document.getElementById('pause-overlay').classList.add('flex'); }
function resumeTimer() { 
    document.getElementById('pause-overlay').classList.add('hidden'); document.getElementById('pause-overlay').classList.remove('flex'); 
    if (pauseInterval) clearInterval(pauseInterval);
    startStudyTimer();
}
function openNapMenu() { stopStudyTimer(); clearIdleTimers(); document.getElementById('nap-overlay').classList.remove('hidden'); document.getElementById('nap-overlay').classList.add('flex'); }
function cancelNapMenu() { document.getElementById('nap-overlay').classList.add('hidden'); document.getElementById('nap-overlay').classList.remove('flex'); resumeTimer(); }
function startNap(minutes) { napSecondsLeft = minutes * 60; runNapTimer(); }
function startNapCustom() {
    const timeStr = document.getElementById('nap-time-input').value; if(!timeStr) { alert("時刻を入力してね"); return; }
    const [h, m] = timeStr.split(':'); const target = new Date(); target.setHours(parseInt(h), parseInt(m), 0);
    if(target <= new Date()) target.setDate(target.getDate() + 1); 
    napSecondsLeft = Math.floor((target - new Date()) / 1000); 
    runNapTimer();
}
function runNapTimer() {
    unlockAudio(); document.getElementById('nap-setup').classList.add('hidden'); document.getElementById('nap-running').classList.remove('hidden'); document.getElementById('nap-running').classList.add('flex');
    updateNapDisplay();
    napInterval = setInterval(() => {
        napSecondsLeft--; updateNapDisplay();
        if(napSecondsLeft <= 0) { clearInterval(napInterval); playAlarmSound(); }
    }, 1000);
}
function updateNapDisplay() {
    let m = Math.floor(Math.max(0, napSecondsLeft) / 60).toString().padStart(2, '0'); let s = (Math.max(0, napSecondsLeft) % 60).toString().padStart(2, '0');
    document.getElementById('nap-countdown').textContent = `${m}:${s}`;
}
function playAlarmSound() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}
function stopNap() {
    clearInterval(napInterval);
    document.getElementById('nap-overlay').classList.add('hidden'); document.getElementById('nap-overlay').classList.remove('flex');
    resumeTimer();
}

/* =========================================================
   📓 マイノート機能 (LocalStorage駆動 / 問題ID紐付け / 画像添付)
   ========================================================= */

function getNotebookData() {
    return JSON.parse(localStorage.getItem('sharoushi_notebooks') || '{}');
}

function saveNotebookData(data) {
    localStorage.setItem('sharoushi_notebooks', JSON.stringify(data));
    updateStartScreenNotebookBadge();
}

function updateStartScreenNotebookBadge() {
    const data = getNotebookData();
    const count = Object.keys(data).length;
    const badge = document.getElementById('start-nb-count-badge');
    if (badge) badge.textContent = count;
}

function updateNotebookButtonDisplay(q_id) {
    const data = getNotebookData();
    const btn = document.getElementById('btn-open-notebook');
    const btnText = document.getElementById('btn-nb-text');
    if (!btn || !btnText) return;

    if (data[q_id]) {
        btnText.textContent = "📓 マイノートを確認・編集（登録済）";
        btn.classList.add('ring-2', 'ring-amber-500', 'bg-amber-300');
    } else {
        btnText.textContent = "📓 マイノートにメモ・スクショを追加";
        btn.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-300');
    }
}

function openNotebookForCurrentQuestion() {
    const q = currentQuestions[currentIndex];
    if (!q) return;
    openNotebookModal(q);
}

function openNotebookModal(q) {
    activeNotebookQId = q._id;
    const data = getNotebookData();
    const existing = data[q._id] || null;

    document.getElementById('nb-badge-subject').textContent = q._subjectName || "社労士";
    document.getElementById('nb-badge-chapter').textContent = q.項目 || "項目";
    document.getElementById('nb-problem-text').textContent = q.問題文 || "";
    
    const noteInput = document.getElementById('nb-note-input');
    const deleteBtn = document.getElementById('btn-delete-nb');
    const previewBox = document.getElementById('nb-image-preview-box');
    const previewImg = document.getElementById('nb-image-preview');
    const fileInput = document.getElementById('nb-image-input');
    if (fileInput) fileInput.value = "";

    if (existing) {
        document.getElementById('nb-modal-subtitle').textContent = "登録済みノート";
        noteInput.value = existing.note || "";
        activeNotebookImageBase64 = existing.image || null;
        if (existing.image) {
            previewImg.src = existing.image;
            previewBox.classList.remove('hidden');
        } else {
            previewBox.classList.add('hidden');
        }
        deleteBtn.classList.remove('hidden');
    } else {
        document.getElementById('nb-modal-subtitle').textContent = "新規作成";
        noteInput.value = "";
        activeNotebookImageBase64 = null;
        previewBox.classList.add('hidden');
        deleteBtn.classList.add('hidden');
    }

    const modal = document.getElementById('notebook-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeNotebookModal() {
    const modal = document.getElementById('notebook-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    activeNotebookQId = null;
    activeNotebookImageBase64 = null;
    if (currentQuestions[currentIndex]) {
        updateNotebookButtonDisplay(currentQuestions[currentIndex]._id);
    }
}

function handleNotebookImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
        alert("画像サイズが大きすぎます。3MB以下の画像を選択してください。");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        activeNotebookImageBase64 = e.target.result;
        const previewBox = document.getElementById('nb-image-preview-box');
        const previewImg = document.getElementById('nb-image-preview');
        previewImg.src = activeNotebookImageBase64;
        previewBox.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function removeNotebookImage() {
    activeNotebookImageBase64 = null;
    const previewBox = document.getElementById('nb-image-preview-box');
    const fileInput = document.getElementById('nb-image-input');
    if (previewBox) previewBox.classList.add('hidden');
    if (fileInput) fileInput.value = "";
}

function saveNotebookEntry() {
    if (!activeNotebookQId) return;
    const note = document.getElementById('nb-note-input').value.trim();

    if (!note && !activeNotebookImageBase64) {
        alert("メモを入力するか、画像を添付してください。");
        return;
    }

    const q = allDatabase.find(item => item._id === activeNotebookQId) || currentQuestions[currentIndex];
    const data = getNotebookData();
    data[activeNotebookQId] = {
        q_id: activeNotebookQId,
        subject: q?._subjectName || "社労士",
        chapter: q?.項目 || "一般",
        questionText: q?.問題文 || "",
        officialExplanation: q?.解説 || "",
        article: q?.根拠条文 || "",
        note: note,
        image: activeNotebookImageBase64,
        updatedAt: new Date().toLocaleDateString('ja-JP')
    };

    saveNotebookData(data);
    closeNotebookModal();
}

function deleteCurrentNotebookEntry() {
    if (!activeNotebookQId) return;
    if (confirm("この問題のマイノートを削除しますか？")) {
        const data = getNotebookData();
        delete data[activeNotebookQId];
        saveNotebookData(data);
        closeNotebookModal();
        if (!document.getElementById('notebook-list-modal').classList.contains('hidden')) {
            openNotebookListModal();
        }
    }
}

function openNotebookListModal() {
    const data = getNotebookData();
    const listContainer = document.getElementById('nb-list-container');
    const countBadge = document.getElementById('nb-list-count');
    const keys = Object.keys(data);
    countBadge.textContent = `${keys.length}件`;
    listContainer.innerHTML = "";

    if (keys.length === 0) {
        listContainer.innerHTML = `
            <div class="p-8 text-center text-slate-400 font-bold">
                <span class="text-5xl block mb-2">📓</span>
                まだマイノートが登録されていません。<br>
                特訓で問題を解いた後の解説画面から、気になる問題をノートに保存してみましょう！
            </div>`;
    } else {
        keys.forEach(key => {
            const item = data[key];
            const hasImgBadge = item.image ? '<span class="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">📸 画像あり</span>' : '';
            const card = document.createElement('div');
            card.className = "bg-white border-2 border-slate-200 hover:border-amber-400 p-4 rounded-2xl shadow-sm transition-all flex flex-col gap-2 cursor-pointer";
            card.onclick = () => {
                const targetQ = allDatabase.find(q => q._id === item.q_id) || {
                    _id: item.q_id,
                    _subjectName: item.subject,
                    項目: item.chapter,
                    問題文: item.questionText,
                    解説: item.officialExplanation,
                    根拠条文: item.article
                };
                closeNotebookListModal();
                openNotebookModal(targetQ);
            };

            card.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-1.5">
                        <span class="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">${item.subject}</span>
                        <span class="text-xs font-black text-slate-700">${item.chapter}</span>
                        ${hasImgBadge}
                    </div>
                    <span class="text-[10px] text-slate-400 font-bold">${item.updatedAt}</span>
                </div>
                <p class="text-xs md:text-sm text-slate-600 font-medium line-clamp-2">${item.questionText}</p>
                <div class="bg-amber-50/80 border border-amber-200 p-2 rounded-xl text-xs md:text-sm text-amber-950 font-bold line-clamp-2">
                    📝 ${item.note || "(画像のみ)"}
                </div>`;
            listContainer.appendChild(card);
        });
    }

    const modal = document.getElementById('notebook-list-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeNotebookListModal() {
    const modal = document.getElementById('notebook-list-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}