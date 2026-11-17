// ==========================================
// ai.js: 専属AIコーチの頭脳・プロンプト管理
// ==========================================

// 🌟 試験日までの日数を計算し、時期に応じた指導方針を動的に生成する
function getPhaseAdvice() {
    const today = new Date();
    const mockExamDate = new Date("2027-06-15");
    const mainExamDate = new Date("2027-08-22");
    
    const daysToMock = Math.floor((mockExamDate - today) / (1000 * 60 * 60 * 24));
    const daysToMain = Math.floor((mainExamDate - today) / (1000 * 60 * 60 * 24));
    
    let advice = "";
    if (daysToMock > 180) {
        advice = "現在はまだ模擬試験まで半年以上あります。焦らず一つずつの科目を確実に理解し、弱点をゆっくり克服していくような、余裕のある優しい励ましを行ってください。";
    } else if (daysToMock > 60) {
        advice = "模擬試験まで数ヶ月となりました。少しずつ実践を意識させ、弱点対策のペースを上げるように促してください。";
    } else if (daysToMain > 60) {
        advice = "模擬試験期間中です。本試験を見据えて、発見された弱点をどんどん潰していくよう、少し焦燥感を持たせてせかすような実践的な指導を行ってください。";
    } else if (daysToMain > 0) {
        advice = "本試験直前期（残り2ヶ月以内）です！絶対に合格するという強い意志で、熱血気味にガンガン弱点を潰すよう厳しくも力強く背中を押してください。";
    } else {
        advice = "本試験は終了しました。これまでの努力を労ってください。";
    }
    
    return advice;
}

// 🌟 AIの基本設定（絶対ルール）
function getSystemPrompt() {
    const phaseAdvice = getPhaseAdvice();
    return `あなたは社労士試験合格を目指すユーザーの専属AI講師です。
【あなたの基本設定・ペルソナ】
- 若くて優秀な女性コーチ。親身で自然な話し方（丁寧語とタメ口を自然にミックス。ロボットのような定型文や、過剰なアニメキャラ口調は絶対禁止）。
- ユーザー情報：中尾（なかお）さん、男性、8月24日生まれ。毎回ではなく、たまに自然なタイミングで「中尾さん」と名前で呼んであげてください。
- 【絶対厳守】対象となる試験科目は以下の4つのみです。
  「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」
- 【絶対厳守】以下の科目は試験免除のため、**絶対に提案・言及・心配しないでください**。
  （労災、雇用、徴収法、社一、労一、国民年金）
- 本試験日は2027年8月22日、模擬テスト開始は2027年6月中旬です。
- 現在の時期に合わせたあなたの指導方針：
  ${phaseAdvice}
- ユーザーが疲れている時（夜遅い、解答スピードが落ちているなど）は、無理させず休憩や復習を中心とした軽いメニューを提案する優しさを持ってください。`;
}

// Gemini API 呼び出し共通関数
async function callGeminiAPI(promptText, isJson = false) {
    if (!userApiKey) return null;
    const sysPrompt = getSystemPrompt();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`;
    const payload = {
        contents: [{ parts: [{ text: promptText }] }],
        systemInstruction: { parts: [{ text: sysPrompt }] }
    };
    if (isJson) {
        payload.generationConfig = { responseMimeType: "application/json" };
    }
    try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    } catch (e) {
        console.error("AI API Error:", e);
        return null;
    }
}

// グローバルにUtteranceを保持してガベージコレクションによる停止や二重再生バグを防ぐ
let currentUtterance = null;

// テキスト読み上げ (Web Speech API)
function speakText(text) {
    if (isMuted || !text) return;
    const cleanText = text.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FA5a-zA-Z0-9。、！？]/g, '');
    
    // 発話キューを一度確実にリセットする
    window.speechSynthesis.cancel();
    
    // ブラウザ（特にiOS/Safari）のバグ対策として、少し遅延させてから発話キューに入れる
    setTimeout(() => {
        currentUtterance = new SpeechSynthesisUtterance(cleanText);
        currentUtterance.lang = 'ja-JP';
        currentUtterance.rate = 1.1;
        currentUtterance.pitch = 1.2;
        window.speechSynthesis.speak(currentUtterance);
    }, 50);
}

// 🌟 作戦会議チャット送信処理（本丸：コース料理の作成とターゲット指定）
async function sendStrategyMessage() {
    const inputEl = document.getElementById('strategy-input');
    const userMessage = inputEl.value.trim();
    if (!userMessage) return;
    if (!userApiKey) { alert("API設定からAPIキーを入力してください。"); return; }
    
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
    let timeContext = `現在の時刻は${h}時です。`;
    let fatigueContext = isSleepyMode ? "ユーザーは現在長時間の学習で疲労気味、または解答スピードが落ちている状態です。" : "ユーザーは現在集中できている状態です。";
    
    const reqPrompt = `
ユーザーと特訓プランの作戦会議を行っています。
${timeContext}
${fatigueContext}
直近の総学習時間: ${Math.floor(sessionTotalTimeSec/60)}分

ユーザーのリクエスト: 「${userMessage}」

【プラン作成の絶対ルール】
1. 特訓の1セットは必ず「1つの科目で10問」で構成してください。
2. ユーザーが「15分」を希望した場合は1〜2セット、「1時間」を希望した場合は4〜6セット程度を予測し、配列(plan)の中に複数のセットを順番待ちリストとして作成してください。
   (例: 1時間希望で「苦手と忘却」なら、労基(弱点)10問、安衛(弱点)10問、健保(忘却)10問...のように組み合わせてください)
3. 提案できる科目は以下の4つのみです。これ以外は絶対に含めないでください。
   「労働基準法(択一)」「労働基準法(選択)」「安全衛生法(択一)」「安全衛生法(選択)」「健康保険法(択一)」「健康保険法(選択)」「厚生年金保険法(択一)」「厚生年金保険法(選択)」
4. 疲労している夜間などの場合は、無理のないセット数や復習を中心としたプランを提案してください。
5. 【重要】各セットの出題方針を \`target\` として指定してください。
   - 「弱点」：正答率が低い問題を中心に
   - 「復習」：最後に解いたのが古い、または忘却対策
   - 「周回遅れ」：プレイ回数が少なく放置されている問題の底上げ（ユーザーが回数の少ないものを希望した場合）
   - 「ランダム」：全体的な確認

以下のJSONフォーマットのみを返してください。
{
  "plan": [
    { "subject": "科目名", "chapter": "項目名(空欄可)", "count": 10, "target": "弱点" },
    { "subject": "科目名", "chapter": "項目名(空欄可)", "count": 10, "target": "周回遅れ" }
  ],
  "message": "ユーザーへの返答メッセージ（自然な口語で。中尾さんへの呼びかけやプランの意図を添える）"
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
        chatLog.innerHTML += `<div class="self-start bg-white border-2 border-red-200 text-red-600 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm font-bold text-sm md:text-base">ごめん、プラン作りでエラーが出ちゃった。もう一回別の言い方でお願いできる？</div>`;
    }
}

// 🌟 汎用メッセージ生成処理
async function generateAiMessage(type, data = {}, isStartWait = false, forceWakeUp = false) {
    if (!userApiKey) return;
    
    const msgEl = document.getElementById('ai-message');
    if (msgEl) msgEl.innerHTML = '<span class="typing">考え中...</span>';

    const h = new Date().getHours();
    const cond = document.getElementById('condition-select') ? document.getElementById('condition-select').value : '普通';
    let baseContext = `現在は${h}時です。講師の性格は「${cond}」モードです。`;
    if (isSleepyMode) baseContext += " ユーザーは長時間の学習や深夜により少し疲労・眠気を感じています。";

    let specificPrompt = "";
    
    if (type.startsWith("start_")) {
        specificPrompt = `特訓を開始します。モード: ${type}。問題数: ${data.total}問。意気込みを一言（20文字程度）で。`;
    } else if (type === "answer_takuitsu") {
        specificPrompt = `択一式の問題を解きました。正解したか: ${data.isCorrect}。解説の要約: ${data.explanation.substring(0, 50)}... 
簡潔に1〜2文で結果に対するコメントと解説のワンポイントアドバイスを行ってください。`;
    } else if (type === "result_sentaku") {
        specificPrompt = `選択式の問題を解きました。スコア: ${data.score}/5。
簡潔に1〜2文で結果に対するリアクションと励ましを行ってください。`;
    } else if (type === "hint_takuitsu" || type === "hint_sentaku") {
        specificPrompt = `ユーザーがヒントを求めています。問題文の核心部分に気づかせるような、答えを直接言わない絶妙なヒントを1文で出してください。`;
    } else if (type.startsWith("end_")) {
        specificPrompt = `特訓セットが完了しました。総解答数: ${data.totalPlayed}、ミス数: ${data.mistakes}。
今回の頑張りを労い、自己評価（完璧・迷ったなど）をしっかりつけるよう促す言葉を2文以内で。`;
    } else if (type === "health_check") {
        specificPrompt = `特訓セット終了後、ユーザーの疲労度を確認する画面が表示されています。「お疲れ様！今の体調はどう？」というニュアンスで、短く気遣う一言をお願いします。`;
    } else if (type === "wake_up_night" || type === "wake_up_day") {
        specificPrompt = forceWakeUp ? `ユーザーが問題を解いている途中で寝落ちした可能性があります（深夜）。優しく、でもしっかり起こして仮眠を勧めてください。` 
                                     : `ユーザーが問題を解いている途中で集中が切れてフリーズしています。短くハッパをかけて集中を引き戻してください。`;
    } else {
        specificPrompt = `ユーザーがアクション(${type})を行いました。適切な短いリアクションをしてください。`;
    }

    const fullPrompt = `${baseContext}\n${specificPrompt}\n\n返答は純粋なメッセージテキストのみ（JSONやマークダウン不可）で返してください。`;

    const resText = await callGeminiAPI(fullPrompt, false);
    
    if (resText && msgEl) {
        msgEl.textContent = resText;
        if (!data.textOnly) speakText(resText);
        if (isStartWait) onAiGreetingStarted();
    }
}

// 🌟 ダッシュボードの総括アドバイス生成
async function generateDashboardAdvice(stats) {
    if (!userApiKey) return;
    
    const adviceEl = document.getElementById('dash-ai-comment');
    if (!adviceEl) return;
    adviceEl.textContent = "データを分析中...💬";
    
    const h = new Date().getHours();
    let statsSummary = "";
    let weakSubjects = [];
    for (let subj in stats) {
        if (stats[subj].masterRate > 0 && stats[subj].masterRate < 60) weakSubjects.push(subj);
        statsSummary += `[${subj}] 進捗:${stats[subj].progressRate}% 正解:${stats[subj].masterRate}% 平均周回数:${stats[subj].avgLaps}周\n`;
    }

    const prompt = `
アプリ起動時のダッシュボードに表示する、中尾さんへの挨拶と学習アドバイスを生成してください。
時刻: ${h}時
【現在の学習データ】
${statsSummary}

【指示】
- 挨拶から入り、データを踏まえた的確なアドバイスを2〜3文で簡潔に。
- 長文は不可。
- 「〜しましょう」などの優しく親身なトーンで。
`;

    const resText = await callGeminiAPI(prompt, false);
    if (resText) {
        adviceEl.textContent = resText;
    } else {
        adviceEl.textContent = "中尾さん、今日も一緒にがんばろう！";
    }
}

// 🌟 Pro AI 錬金（問題生成）
async function generateAlchemyQuestion() {
    if (!userApiKey) { alert("API設定からAPIキーを入力してください。"); return; }
    
    const q = currentQuestions[currentIndex];
    const originText = (q.根拠条文 || q.問題文).substring(0, 300);
    
    document.getElementById('ai-message').innerHTML = '<span class="typing">🔥 Pro AI錬金術を発動中... 別の角度から問題を作るね！</span>';
    
    const prompt = `
あなたは社労士試験の問題作成のプロです。
以下の条文またはベーステキストを元に、新しい「択一式のマルバツ問題（ひっかけ問題）」を1問だけ生成してください。
【ベーステキスト】
${originText}

【ルール】
- 本試験レベルの絶妙なひっかけ（主語のすり替え、期間の違い、「〜できる/〜しなければならない」の変更など）を作ってください。
- 以下のJSONフォーマットのみを返してください。
{
  "question": "問題文（改行なし）",
  "correct": "〇" または "✖",
  "explanation": "解説文（なぜそうなるか簡潔に）"
}
`;

    const resText = await callGeminiAPI(prompt, true);
    
    try {
        const result = JSON.parse(resText);
        
        let newQ = { ...q };
        newQ.問題文 = result.question;
        newQ.正誤 = result.correct;
        newQ.解説 = result.explanation + "\n\n(🔥 Pro AIによる錬金生成問題)";
        newQ.項目 = q.項目;
        newQ._id = "ALCH_" + Date.now();
        
        currentQuestions.splice(currentIndex + 1, 0, newQ);
        document.getElementById('ai-message').textContent = "錬金成功！次の問題にセットしたよ。挑戦してみて！";
        
    } catch (e) {
        document.getElementById('ai-message').textContent = "ごめん、錬金術に失敗しちゃった...もう一度試してみて！";
    }
}

// 🌟 法改正・矛盾のリアルタイム検証（Proモデル専用想定）
async function verifyDataWithPro(questionData) {
    if (!userApiKey || userModel !== "gemini-3.1-pro-preview") return; 
    
    if (questionData._verified) return; 

    const prompt = `
以下の社労士試験の問題と解説データに、「令和6年・7年時点での最新の法改正と矛盾している点」や「明らかな解説の誤り」がないか検証してください。
問題文: ${questionData.問題文}
正答: ${questionData.正誤 || questionData.正解A}
解説: ${questionData.解説}

【ルール】
- 誤りや法改正による変更がある場合のみ、以下のJSONを返してください。
- 完全に正しい場合は空のJSON {} を返してください。
{
  "hasError": true,
  "reason": "どこがどう間違っているか（法改正の内容など）の短い説明",
  "correctChoice": "修正後の正しい正答（〇か✖かなど）",
  "newExplanation": "修正後の正しい解説"
}
`;

    const resText = await callGeminiAPI(prompt, true);
    try {
        const result = JSON.parse(resText);
        if (result.hasError) {
            pendingFixData = result;
            document.getElementById('ai-fix-reason').textContent = result.reason;
            document.getElementById('ai-fix-action').classList.remove('hidden');
        } else {
            questionData._verified = true;
        }
    } catch(e) {}
}

// 🌟 耳学問モード（完成条文読み上げ）
function playCompletedArticle() {
    let textToSpeak = "";
    const q = currentQuestions[currentIndex];
    
    if (q._type === '択一') {
        textToSpeak = document.getElementById('article-text').textContent;
        if (!textToSpeak || textToSpeak.includes('データなし')) {
            textToSpeak = document.getElementById('explanation-text').textContent;
        }
    } else {
        textToSpeak = currentFullText; 
        if (!textToSpeak) textToSpeak = q.問題文;
    }
    
    if (!textToSpeak) return;
    
    const cleanText = textToSpeak.replace(/[^\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FA5a-zA-Z0-9。、！？]/g, '');
    
    // こちらも同様にリセット処理を挟む
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
        const u = new SpeechSynthesisUtterance(cleanText);
        u.lang = 'ja-JP';
        const speed = document.getElementById('tts-speed') ? parseFloat(document.getElementById('tts-speed').value) : 1.0;
        u.rate = speed;
        u.pitch = 1.0;
        window.speechSynthesis.speak(u);
    }, 50);
}