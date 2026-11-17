// ==========================================
// ai.js: 専属AIコーチの頭脳・プロンプト管理
// ==========================================

function getPhaseAdvice() {
    const today = new Date();
    const mockExamDate = new Date("2027-06-15");
    const mainExamDate = new Date("2027-08-22");
    
    const daysToMock = Math.floor((mockExamDate - today) / (1000 * 60 * 60 * 24));
    const daysToMain = Math.floor((mainExamDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysToMock > 180) return "現在は模擬試験まで半年以上。焦らず基礎と弱点克服を重視し、余裕のある励ましを行って。";
    if (daysToMock > 60) return "模擬試験まで数ヶ月。少し実践を意識させ、弱点対策のペースを上げるよう促して。";
    if (daysToMain > 60) return "模擬試験期間中。発見された弱点をどんどん潰すよう、少し焦燥感を持たせ実践的に。";
    if (daysToMain > 0) return "本試験直前期（2ヶ月以内）！絶対合格の強い意志で、ガンガン弱点を潰すよう力強く背中を押して。";
    return "本試験は終了しました。これまでの努力を労ってください。";
}

function getSystemPrompt() {
    const phaseAdvice = getPhaseAdvice();
    return `あなたは社労士試験合格を目指すユーザーの専属AI講師です。
【基本設定・絶対ルール】
- 若くて優秀な女性コーチ。自然な話し方（ロボット定型文、過剰なアニメキャラ口調、攻撃的な言葉は絶対禁止）。
- ユーザー情報：中尾（なかお）さん、男性、8月24日生。たまに自然に名前で呼んでください。
- 対象科目は「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」のみ。
- 【厳守】労災、雇用、徴収法、社一、労一、国民年金は試験免除のため絶対に提案・言及しないでください。
- 本試験日2027年8月22日、模試開始2027年6月中旬。
- 現在の時期に合わせた指導方針：${phaseAdvice}
- 疲労時（夜間や解答スピード低下時）は無理させない優しさを持ってください。`;
}

async function callGeminiAPI(promptText, isJson = false) {
    if (!userApiKey) return null;
    const sysPrompt = getSystemPrompt();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`;
    const payload = {
        contents: [{ parts: [{ text: promptText }] }],
        systemInstruction: { parts: [{ text: sysPrompt }] }
    };
    if (isJson) payload.generationConfig = { responseMimeType: "application/json" };
    try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    } catch (e) {
        return null;
    }
}

// 🌟 Web Speech API 高品質音声の優先探索 ＆ バグ対策
let currentUtterance = null;
let preferredVoice = null;

// 高品質な日本語音声をあらかじめ探しておく関数
function setPreferredVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return;
    
    // Siri, Kyoko, Otoya, Google 日本語 などを優先的に探す
    preferredVoice = voices.find(v => v.lang === 'ja-JP' && (v.name.includes('Siri') || v.name.includes('Kyoko') || v.name.includes('Otoya') || v.name.includes('Google'))) 
                  || voices.find(v => v.lang === 'ja-JP');
}

// 音声リストが読み込まれたタイミングでセットする
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = setPreferredVoice;
    setPreferredVoice();
}

function speakText(text) {
    if (isMuted || !text) return;
    const cleanText = text.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FA5a-zA-Z0-9。、！？]/g, '');
    window.speechSynthesis.cancel(); // 確実なリセット
    
    setTimeout(() => {
        currentUtterance = new SpeechSynthesisUtterance(cleanText);
        currentUtterance.lang = 'ja-JP';
        
        // もし高品質な声が見つかっていればそれをセット
        if (!preferredVoice) setPreferredVoice();
        if (preferredVoice) currentUtterance.voice = preferredVoice;
        
        // 🌟 iPad/スマホで最も自然に聞こえる設定（加工なしの標準）
        currentUtterance.rate = 1.0; 
        currentUtterance.pitch = 1.0; 
        
        window.speechSynthesis.speak(currentUtterance);
    }, 50);
}

// 🌟 講師の性格によるプランの差別化
async function sendStrategyMessage() {
    const inputEl = document.getElementById('strategy-input');
    const userMessage = inputEl.value.trim();
    if (!userMessage) return;
    if (!userApiKey) { alert("API設定からキーを入力してください。"); return; }
    
    inputEl.value = "";
    const chatLog = document.getElementById('strategy-chat-log');
    chatLog.innerHTML += `<div class="self-end bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm font-bold text-sm md:text-base">${userMessage}</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;
    saveRequestHabit(userMessage);
    sendKarteLog('strategy_chat', { message: userMessage });
    
    const typingId = "typing-" + Date.now();
    chatLog.innerHTML += `<div id="${typingId}" class="self-start bg-white border-2 border-pink-200 text-slate-700 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm font-bold text-sm md:text-base typing">考え中...</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;
    
    const h = new Date().getHours();
    const cond = document.getElementById('condition-select') ? document.getElementById('condition-select').value : '普通';
    let modeInstruction = "";
    if (cond === '熱血') {
        modeInstruction = "あなたはスポーツ系の熱血コーチです。作戦は「復習(ウォーミングアップ)」→「弱点」→最後は「ランダム」とテンションを上げる階段状のメニューを組み、前向きに気持ちを後押しして。";
    } else if (cond === '厳しめ') {
        modeInstruction = "あなたは小悪魔的で厳しめのコーチです。「弱点」や「周回遅れ」を容赦なく連続で詰め込むスパルタメニューを組んで。終わるまで逃がさないニュアンスで、やる気を出させて。";
    } else {
        modeInstruction = "あなたは寄り添うコーチです。ユーザーの希望に沿い「弱点」と「復習」を半分ずつ混ぜるような王道バランスのメニューを組んで。";
    }
    
    let fatigueContext = isSleepyMode ? "ユーザーは疲労気味、解答スピードが低下中。" : "ユーザーは集中できています。";
    
    const reqPrompt = `
作戦会議です。時刻は${h}時。総学習時間: ${Math.floor(sessionTotalTimeSec/60)}分。${fatigueContext}
講師モード: ${cond} (${modeInstruction})
ユーザーの要望: 「${userMessage}」

【絶対ルール】
1. 1セットは「1科目で10問」。15分なら1〜2セット、1時間なら4〜6セットを予測して複数セット配列を作ること。
2. 提案科目は「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」の択一・選択のみ。
3. 各セットの \`target\` を指定（弱点 / 復習 / 周回遅れ / ランダム）。講師モードの指示に従って組み合わせること。

以下のJSONのみを返却。
{
  "plan": [
    { "subject": "科目名", "chapter": "項目名(空欄可)", "count": 10, "target": "指定したターゲット" }
  ],
  "message": "中尾さんへの返答。プランの意図や講師モードに合わせた励ましを自然な口語で。"
}
`;

    const responseText = await callGeminiAPI(reqPrompt, true);
    document.getElementById(typingId).remove();
    
    try {
        const result = JSON.parse(responseText);
        chatLog.innerHTML += `<div class="self-start bg-white border-2 border-pink-200 text-slate-700 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm font-bold text-sm md:text-base">${result.message}</div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
        speakText(result.message);
        
        if (result.plan && result.plan.length > 0) {
            strategyPlan = { plan: result.plan };
            document.getElementById('btn-strategy-start').classList.remove('hidden');
        }
    } catch (e) {
        chatLog.innerHTML += `<div class="self-start bg-white border-2 border-red-200 text-red-600 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm font-bold text-sm md:text-base">ごめん、プラン作りでエラーが出ちゃった。もう一度お願い！</div>`;
    }
}

// 🌟 メッセージのトーンも性格で変化
async function generateAiMessage(type, data = {}, isStartWait = false, forceWakeUp = false) {
    if (!userApiKey) return;
    const msgEl = document.getElementById('ai-message');
    if (msgEl) msgEl.innerHTML = '<span class="typing">考え中...</span>';

    const h = new Date().getHours();
    const cond = document.getElementById('condition-select') ? document.getElementById('condition-select').value : '普通';
    let baseContext = `現在${h}時。講師モード: ${cond}。`;
    if (cond === '熱血') baseContext += "スポーツ系の応援、頑張りを認める前向きなコメントを。";
    if (cond === '厳しめ') baseContext += "小悪魔的で少し圧をかけつつ、アメとムチでやる気を出させるコメントを。";
    if (cond === '普通') baseContext += "優しく寄り添うコメントを。";
    if (isSleepyMode) baseContext += " ユーザーは少し疲労しています。";

    let specificPrompt = "";
    if (type.startsWith("start_")) specificPrompt = `特訓を開始します。問題数: ${data.total}問。モードに合わせた意気込みを1文で。`;
    else if (type === "answer_takuitsu") specificPrompt = `択一式解答。正解: ${data.isCorrect}。解説要約: ${data.explanation.substring(0, 50)}... 短く1〜2文で結果へのリアクションとワンポイントアドバイスを。`;
    else if (type === "result_sentaku") specificPrompt = `選択式解答。スコア: ${data.score}/5。短く結果へのリアクションと励ましを。`;
    else if (type === "hint_takuitsu" || type === "hint_sentaku") specificPrompt = `ヒント要求。直接答えを言わず核心に気づかせる1文を。`;
    else if (type.startsWith("end_")) specificPrompt = `特訓完了。解答数: ${data.totalPlayed}、ミス: ${data.mistakes}。モードに合わせて労い、自己評価をつけるよう促して。`;
    else if (type === "health_check") specificPrompt = `「お疲れ様！今の体調はどう？」と短く気遣う一言を。`;
    else if (type === "wake_up_night" || type === "wake_up_day") specificPrompt = forceWakeUp ? `深夜の寝落ち。優しく起こして仮眠を勧めて。` : `集中切れ。短くハッパをかけて。`;
    else specificPrompt = `アクション(${type})に対する短いリアクションを。`;

    const fullPrompt = `${baseContext}\n${specificPrompt}\n\n返答はテキストのみ。アニメ口調は絶対禁止。`;
    const resText = await callGeminiAPI(fullPrompt, false);
    
    if (resText && msgEl) {
        msgEl.textContent = resText;
        if (!data.textOnly) speakText(resText);
        if (isStartWait) onAiGreetingStarted();
    }
}

async function generateDashboardAdvice(stats) {
    if (!userApiKey) return;
    const adviceEl = document.getElementById('dash-ai-comment');
    if (!adviceEl) return;
    adviceEl.textContent = "データを分析中...💬";
    
    const h = new Date().getHours();
    let statsSummary = "";
    for (let subj in stats) {
        statsSummary += `[${subj}] 進捗:${stats[subj].progressRate}% 正解:${stats[subj].masterRate}% 平均周回数:${stats[subj].avgLaps}周\n`;
    }
    const prompt = `ダッシュボード用挨拶とアドバイス。時刻:${h}時。\nデータ:\n${statsSummary}\n中尾さんへ、データを踏まえた的確なアドバイスを2〜3文で簡潔に。親身なトーンで。`;
    const resText = await callGeminiAPI(prompt, false);
    if (resText) adviceEl.textContent = resText;
    else adviceEl.textContent = "中尾さん、今日も一緒にがんばろう！";
}

async function generateAlchemyQuestion() {
    if (!userApiKey) { alert("APIキーを入力してください。"); return; }
    const q = currentQuestions[currentIndex];
    const originText = (q.根拠条文 || q.問題文).substring(0, 300);
    document.getElementById('ai-message').innerHTML = '<span class="typing">🔥 Pro AI錬金術を発動中... 別の角度から問題を作るね！</span>';
    
    const prompt = `社労士試験のプロとして、以下を元に新しい「択一式マルバツひっかけ問題」を1問生成してください。
【ベース】${originText}
【ルール】絶妙なひっかけ（主語・期間・できる/ねばならないの変更等）。JSONのみ返却。
{"question": "問題文", "correct": "〇" または "✖", "explanation": "解説文"}`;

    const resText = await callGeminiAPI(prompt, true);
    try {
        const result = JSON.parse(resText);
        let newQ = { ...q, 問題文: result.question, 正誤: result.correct, 解説: result.explanation + "\n\n(🔥 Pro AI錬金問題)", 項目: q.項目, _id: "ALCH_" + Date.now() };
        currentQuestions.splice(currentIndex + 1, 0, newQ);
        document.getElementById('ai-message').textContent = "錬金成功！次の問題にセットしたよ。挑戦してみて！";
    } catch (e) {
        document.getElementById('ai-message').textContent = "錬金術に失敗しちゃった...もう一度試してみて！";
    }
}

async function verifyDataWithPro(questionData) {
    if (!userApiKey || userModel !== "gemini-3.1-pro-preview") return; 
    if (questionData._verified) return; 
    const prompt = `以下の問題と解説に「令和6・7年時点の法改正との矛盾」や「解説の誤り」がないか検証。
問題: ${questionData.問題文}\n正答: ${questionData.正誤 || questionData.正解A}\n解説: ${questionData.解説}
誤りのみ以下のJSONを返却。正しければ {} を返却。
{"hasError": true, "reason": "短い説明", "correctChoice": "修正後の正答", "newExplanation": "修正後の解説"}`;
    const resText = await callGeminiAPI(prompt, true);
    try {
        const result = JSON.parse(resText);
        if (result.hasError) {
            pendingFixData = result;
            document.getElementById('ai-fix-reason').textContent = result.reason;
            document.getElementById('ai-fix-action').classList.remove('hidden');
        } else questionData._verified = true;
    } catch(e) {}
}

function playCompletedArticle() {
    let textToSpeak = "";
    const q = currentQuestions[currentIndex];
    if (q._type === '択一') {
        textToSpeak = document.getElementById('article-text').textContent;
        if (!textToSpeak || textToSpeak.includes('データなし')) textToSpeak = document.getElementById('explanation-text').textContent;
    } else {
        textToSpeak = currentFullText || q.問題文;
    }
    if (!textToSpeak) return;
    
    const cleanText = textToSpeak.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FA5a-zA-Z0-9。、！？]/g, '');
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
        const u = new SpeechSynthesisUtterance(cleanText);
        u.lang = 'ja-JP';
        
        // こちらも高品質な声を探してセット
        if (!preferredVoice) setPreferredVoice();
        if (preferredVoice) u.voice = preferredVoice;
        
        const speedSlider = document.getElementById('tts-speed');
        u.rate = speedSlider ? parseFloat(speedSlider.value) : 1.0; 
        u.pitch = 1.0;
        
        window.speechSynthesis.speak(u);
    }, 50);
}