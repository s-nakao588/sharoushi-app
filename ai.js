/* =========================================================
   🤖 AI・Gemini連携モジュール
   ========================================================= */

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
時間帯や過去の傾向から、先回りした提案をしてもよいです。不自然な役割語は絶対禁止。

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