/* =========================================================
   🤖 AI・Gemini連携モジュール
   ========================================================= */

// main.js の変数を参照するため外部スコープを利用します。

// 🌟 AIコメントの思考レベル（thinkingBudget）制御ヘルパー（gemini-2.5-flash用）
function buildGeminiPayload(contentsData, thinkingBudget) {
    const payload = { contents: contentsData };
    if (typeof userModel === 'string' && userModel.includes('2.5-flash')) {
        payload.generationConfig = {
            thinkingConfig: { thinkingBudget: thinkingBudget }
        };
    }
    return JSON.stringify(payload);
}

// 🌟 GASから取得した日付データを安全に YYYY/MM/DD 形式へ整えるヘルパー
function formatKarteDateStr(rawDate) {
    if (!rawDate) return "";
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    }
    return String(rawDate).trim();
}

// 🌟 パーソナルカルテ＆予定情報を全AIコメントで共有するための要約ヘルパー
function getPersonalKarteContext() {
    const now = new Date();
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
    const todayStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} (${weekDays[now.getDay()]}曜)`;
    const timeStr = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

    let scheduleLines = [];
    if (typeof userSchedule !== 'undefined' && Array.isArray(userSchedule) && userSchedule.length > 0) {
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const upcoming = userSchedule
            .map(s => ({ dateObj: new Date(s.date), dateStr: formatKarteDateStr(s.date), type: s.type || '', memo: s.memo || '' }))
            .filter(s => !isNaN(s.dateObj.getTime()) && (todayStart - s.dateObj) <= 2 * 86400000)
            .sort((a, b) => a.dateObj - b.dateObj)
            .slice(0, 12);

        upcoming.forEach(s => {
            const diffDays = Math.ceil((s.dateObj - todayStart) / 86400000);
            const rel = diffDays === 0 ? "今日" : (diffDays === 1 ? "明日" : (diffDays === -1 ? "昨日" : (diffDays > 1 ? `あと${diffDays}日` : `${Math.abs(diffDays)}日前`)));
            scheduleLines.push(`${s.dateStr}(${rel}) [${s.type}] ${s.memo}`);
        });
    }

    let karteLines = [];
    if (typeof userPersonalKarte !== 'undefined' && Array.isArray(userPersonalKarte) && userPersonalKarte.length > 0) {
        const recentKarte = userPersonalKarte.slice(-25);
        recentKarte.forEach(k => {
            if (k && k.info) {
                karteLines.push(`(${formatKarteDateStr(k.date)} / ${k.category || 'メモ'}) ${k.info}`);
            }
        });
    }

    if (scheduleLines.length === 0 && karteLines.length === 0) {
        return `【現在日時】${todayStr} ${timeStr}\n【パーソナルカルテ・予定記憶】まだ記録なし`;
    }

    return `【現在日時】${todayStr} ${timeStr}
【登録されている予定・試験日（直近〜今後）】
${scheduleLines.length > 0 ? scheduleLines.join(' / ') : '特になし'}
【パーソナルカルテ（過去の雑談から蓄積した受講生の予定・生活リズム・好み・傾向）】
${karteLines.length > 0 ? karteLines.join(' / ') : '特になし'}`;
}

async function speakText(text, isStartScreen = false) {
    if (isMuted || !text) return; 
    let cleanText = text.replace(/<[^>]+>/g, '').trim(); if (!cleanText) return;
    
    if (typeof stopAudio === "function") stopAudio();

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: cleanText }] }] })
        });
        if (!res.ok) throw new Error("TTS API Error");
        const data = await res.json();
        
        if (isMuted) return;

        const p = document.getElementById('tts-player');
        p.src = `data:audio/mp3;base64,${data.candidates[0].content.parts[0].inlineData.data}`; 
        p.onplay = () => {
            if (isStartScreen && typeof onAiGreetingStarted === "function") onAiGreetingStarted();
        };
        setTimeout(() => {
            if (isStartScreen && typeof onAiGreetingStarted === "function") onAiGreetingStarted();
        }, 1000); 
        p.play();
    } catch (err) {
        if ('speechSynthesis' in window && !isMuted) {
            const utterance = new SpeechSynthesisUtterance(cleanText); 
            utterance.lang = 'ja-JP';
            utterance.onstart = () => {
                if (isStartScreen && typeof onAiGreetingStarted === "function") onAiGreetingStarted();
            };
            setTimeout(() => {
                if (isStartScreen && typeof onAiGreetingStarted === "function") onAiGreetingStarted();
            }, 1000);
            
            // 🌟 修正：iPad等での機械音化バグを防ぐため、ピッチとレートを完全無加工（指定しない）とする
            
            window.speechSynthesis.speak(utterance);
        }
    }
}

async function generateAiMessage(situation, extraData = {}, isStartScreen = false) {
    // 🌟 A案：AIが発言する際は必ず吹き出し枠ごと再表示する
    if (typeof setAiBubbleVisible === "function") setAiBubbleVisible(true);

    const aiMessageEl = document.getElementById('ai-message');
    if(aiMessageEl) aiMessageEl.innerHTML = '<span class="typing">💬 ...</span>';
    
    const cond = document.getElementById('condition-select').value;
    const healthSelect = document.getElementById('health-select');
    const health = healthSelect ? healthSelect.value : '普通';

    // 問題解説やヒント以外の場面ではパーソナルカルテ記憶も背景情報として渡す
    const pureProblemSituations = ["hint_takuitsu", "hint_sentaku", "answer_takuitsu", "ignore_fix", "apply_fix", "alchemy_prep"];
    const karteBlock = pureProblemSituations.includes(situation)
        ? ""
        : `\n${getPersonalKarteContext()}\n※上記カルテ記憶は毎回無理に触れる必要はありませんが、現在の時間帯・曜日・疲労度や予定に合うときは自然に一言添えて親しみのある声かけにしてください。\n`;
    
    let prompt = `あなたは社労士試験の専属個別指導講師（18歳前後の若い女性）です。受講生のモードは「${cond}」、体調は「${health}」です。
【絶対ルール】
1. セリフ本文のみを1〜2文で出力すること。
2. 定型文は一切使わず、毎回必ず状況に合わせて自分の言葉で考えて生成すること。
3. 決して暴言や高圧的な説教はせず、親しみやすい現代の一般的な若い女性の自然な口語体で話すこと。
4. 「〜だぞ」「〜だろ」「〜わ」「〜よ」「ふふっ」「〜かしら」等の不自然な役割語やアニメ口調は絶対に使用しないこと。
5. 受講生は「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」の4科目以外は免除されています。この4科目以外について学習を促す発言や提案は絶対にしないでください。${karteBlock}\n`;

    if (situation === "start_all") prompt += `特訓スタート。全${extraData.total}問だよと伝えて短く前向きに気合を入れて。`;
    else if (situation === "start_takuitsu") prompt += `択一式の特訓スタート。短く前向きに気合を入れて。`;
    else if (situation === "start_sentaku") prompt += `選択式の特訓スタート。文脈を意識して埋めてみてと励まして。`;
    else if (situation === "start_timeattack") prompt += `熱血タイムアタック開始！「15秒で直感で解こう！」と熱く鼓舞して。`;
    else if (situation === "start_bonus") prompt += `ご褒美モード開始！「得意な問題を集めたから、自信つけていこう！」と優しく促して。`;
    else if (situation === "start_suddendeath") prompt += `サドンデスモード発動！「時間が余ってるから、サクッとこれやろう！1問でも間違えたら即終了だよ！」と煽って。`;
    else if (situation === "start_relay") prompt += `カウントダウン・リレー発動！「時間が余ってるから、タイムアタックの進化版やろう！正解すると5秒回復するよ！」と楽しく挑発して。`;
    else if (situation === "start_trap") prompt += `ひっかけ特化モード発動！「今まで間違えた問題や、正答率の低い問題を集めたよ！罠に引っかからないように注意して！」と警告して。`;
    else if (situation === "start_hardcore") prompt += `ハードコア選択式発動！「だいぶ知識がついてきたみたいだから、語群を没収するね！まずは自力で思い出してみて！」と挑戦的に。`;
    else if (situation === "start_surprise") prompt += `不意打ちの1問発動！「油断大敵！気が抜けたところに苦手問題を1問だけ出題するよ！」と警告して。`;
    else if (situation === "hint_takuitsu") prompt += `択一式のヒント。答えは言わず、見るべきポイントを1文で示して。問題:${extraData.questionText} 解説:${extraData.explanation}`;
    else if (situation === "hint_sentaku") prompt += `選択式のヒント。「キーワードを黄色くしたから確認してみて」とアドバイスして。`;
    else if (situation === "answer_takuitsu") prompt += `択一式解答。結果は【${extraData.isCorrect ? "正解" : "不正解"}】。解説から最重要ポイントを1文で要約して。解説:${extraData.explanation}`;
    else if (situation === "result_sentaku") prompt += `選択式解答完了。5点中${extraData.score}点。点数に応じたコメントと、迷ったところは記録してねと促して。`;
    else if (situation === "end_all") prompt += `全問題終了。頑張りを心から労い、次への励ましを。`;
    else if (situation === "nap_start") prompt += `受講生が仮眠に入ります。目を閉じてしっかり休んでね、時間になったらアラームで起こすからねと優しく伝えて。`;
    else if (situation === "nap_end") prompt += `受講生が仮眠から起きてアラームを止めた瞬間です。いきなり急かすのではなく、「おはよう、ぼちぼち始めようか」のように寝起きに寄り添ってゆっくり腰を上げる自然なトーンで声をかけて。`;
    else if (situation === "break_end") prompt += `小休憩を終えて勉強に戻る瞬間です。いきなり「じゃあ頑張ろう！」と急に切り替えるのではなく、「一息つけた？そろそろゆっくり始めようか」のように、ゆっくり腰を上げる自然なトーンで声をかけて。`;
    else if (situation === "idle_warn") prompt += `解説画面で受講生が止まっています。「大丈夫？次進めそう？」と優しく催促して。`;
    else if (situation === "idle_penalty") prompt += `さらに放置されたので、目標時間を1分追加します。少しピシッと注意しつつも前向きに励まして。`;
    else if (situation === "idle_care") prompt += `放置されていますが、1時間以上勉強しているので疲れているのかもしれません。「そろそろ集中力切れてきた？無理せず休憩しようか」と優しく注意・提案して。`;
    else if (situation === "ignore_fix") prompt += `AIの修正提案を保留にしました。「印をつけておいたから、後で自分で調べてみてね」と伝えて。`;
    else if (situation === "apply_fix") prompt += `AIの修正提案を採用して問題を修正しました。「修正しておいたよ！次から新しい内容で出題するね」と伝えて。`;
    else if (situation === "health_check") prompt += `長時間の学習が続いています。体調を気遣う声かけをして、健康状態を尋ねて。`;
    else if (situation === "alchemy_prep") prompt += `錬金術発動！「ちょっと待っててね、別の論点に作り変えるよ！」と伝えて。`;
    else if (situation === "wake_up_night") prompt += `現在深夜です。厳しく寝るように促すか、優しく休むように促してください。`;
    else if (situation === "wake_up_day") prompt += `特訓タイマーが0になりました。「時間だよ！起きて！」と声をかけて。`;
    else if (situation === "end_event") {
        let rate = extraData.qCount > 0 ? Math.round((extraData.correct / extraData.qCount) * 100) : 0;
        if (extraData.eventType === "senbonKnock") {
            prompt += `【千本ノック終了】解答数:${extraData.qCount}問、正答率:${rate}%。\n`;
            if (extraData.qCount >= 50) prompt += `50問以上解き切った執念を凄く褒めてください。正答率が高ければ精度も称賛し、低ければ「最後はバテてたね」と労って。`;
            else prompt += `白旗が早かったこと（10問未満なら特に）を軽くイジりつつ、1時間以上勉強した疲れを優しく労って。`;
        } else if (extraData.eventType === "timeAttack") {
            prompt += `【15秒タイムアタック終了】正答率:${rate}%。\n`;
            if (rate >= 80) prompt += `プレッシャーの中で高正答率を出した直感力を絶賛して。`;
            else if (rate >= 50) prompt += `スピードの中で駆け抜けたことを褒め、本番の練習になると励まして。`;
            else prompt += `タイムプレッシャーで焦ったことを優しく指摘し、良い訓練になったと労って。`;
        } else if (extraData.eventType === "bonus") {
            prompt += `【ご褒美モード終了】正答率:${rate}%。\n`;
            prompt += `得意な問題を集めたセットでした。サクサク解けたことで実力がついていることを実感させ、自己肯定感を高めて終わらせて。`;
        } else if (extraData.eventType === "suddenDeath") {
            prompt += `【サドンデス終了】解答数:${extraData.qCount}問。\n`;
            if(extraData.qCount >= 10) prompt += `プレッシャーの中で二桁以上続いた集中力を大絶賛して！`;
            else prompt += `「あっという間に終わっちゃったね」と軽くイジって、悔しさを煽って。`;
        } else if (extraData.eventType === "countdownRelay") {
            prompt += `【カウントダウン・リレー終了】解答数:${extraData.qCount}問。\n`;
            prompt += `焦りの中で素早く判断し続けたスピードと決断力を称賛して！`;
        } else if (extraData.eventType === "trapMode") {
            prompt += `【ひっかけ特化終了】正答率:${rate}%。\n`;
            prompt += `過去の苦手問題ばかりの罠セットでした。「引っかからなかったね！」か「また罠にハマっちゃったね」と結果に応じてコメントして。`;
        } else if (extraData.eventType === "hardcore") {
            prompt += `【ハードコア選択終了】\n`;
            prompt += `自力で思い出せた割合や正答率を踏まえて、基礎知識の定着度について具体的に褒めるか、復習を促すコメントをして！`;
        } else if (extraData.eventType === "surpriseAttack") {
            prompt += `【不意打ちの1問終了】\n`;
            prompt += `不意打ちで苦手問題を1問だけ出しました。正解していれば「油断してなかったね！」、間違えていれば「やっぱり気が抜けてた？」とイジって。`;
        }
    }

    try {
        // 🌟 特訓中のコメント全般（スタート挨拶・終了・ヒント・解説要約等）は思考ゼロ（0）で即答・最安化
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: buildGeminiPayload([{ parts: [{ text: prompt }] }], 0)
        });
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text;
        if(aiMessageEl) { aiMessageEl.textContent = text; }
        
        // 🌟 過去の正常ファイル通り、textOnlyがtrueでない場合のみ音読する
        if (!extraData.textOnly) speakText(text, isStartScreen); 
        else if (isStartScreen && typeof onAiGreetingStarted === "function") onAiGreetingStarted();
    } catch(e) {
        const fallbackMsg = situation === "nap_end"
            ? "おはよう、少しすっきりしたかな？ぼちぼちゆっくり始めようか。"
            : (situation === "break_end" ? "一息つけたかな？そろそろゆっくり再開しようか。" : "今日も一緒に一問ずつ進めていこうね！");
        if(aiMessageEl) { aiMessageEl.textContent = fallbackMsg; }
        if (!extraData.textOnly) speakText(fallbackMsg, isStartScreen);
        else if (isStartScreen && typeof onAiGreetingStarted === "function") onAiGreetingStarted();
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

// 🌟 作戦会議の最初の挨拶を「現在の目標」＋「パーソナルカルテ記憶」に合わせて動的に生成する（思考上限 1024）
async function initStrategyGreeting() {
    if (!userApiKey || typeof userGoals === 'undefined' || userGoals.length === 0) return;
    const logEl = document.getElementById('strategy-chat-log');
    if (!logEl || !logEl.firstElementChild) return;

    const today = new Date();
    const todayStr = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;
    const goalsText = userGoals.map(g => `${formatKarteDateStr(g.date)}: ${g.goal}`).join('\n');

    const prompt = `あなたは社労士試験の専属講師（18歳前後の若い女性）です。
今日の日付は ${todayStr} です。
以下は受講生がこれまでに記録した学習目標（方針）の履歴です（下にいくほど新しい）。
${goalsText}

${getPersonalKarteContext()}

【判定ルール】
・今日の日付（${todayStr}）時点で有効な目標だけを抽出してください。
・過ぎた月や週の目標、後から「変更」「中止」された古い目標は自動で無視してください。
・今月の目標と今週の目標など、同じ期間で両立する目標は両方とも適用してください。
・パーソナルカルテや予定（今日の予定・眠くなる時間帯・週末の方針など）で今触れると自然な要素があれば、2行目の呼びかけにさりげなく反映してください。
・受講生は「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」の4科目以外は免除されています。

有効な目標がある場合、以下の形式で出力してください（1行目に目標、改行して2行目に目標に沿った作戦会議の最初の呼びかけを1〜2文で）。
「〜だぞ」「〜だろ」「〜わ」「〜よ」「ふふっ」等の不自然な役割語やアニメ口調は絶対禁止です。
有効な目標が1つもない場合のみ「NONE」とだけ出力してください。

出力例：
🎯 現在の目標：労働基準法をマスターする / 今週は労基の弱点克服
今日は労働基準法のどの項目をやる？それとも弱点克服からサクッと始める？`;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: buildGeminiPayload([{ parts: [{ text: prompt }] }], 1024)
        });
        if (!res.ok) return;
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text.trim();
        if (text && text !== "NONE") {
            logEl.firstElementChild.innerHTML = text.replace(/\n/g, '<br>');
        }
    } catch(e) {}
}

async function sendStrategyMessage() {
    userApiKey = document.getElementById('api-key-input').value.trim();
    if(!userApiKey) { alert("APIキーが必要です"); document.getElementById('api-settings-wrapper').classList.remove('hidden'); return; }
    const inputEl = document.getElementById('strategy-input'); const input = inputEl.value.trim();
    if(!input) return;
    if(typeof sendKarteLog === "function") sendKarteLog('strategy_chat', { message: input });
    if(typeof saveRequestHabit === "function") saveRequestHabit(input);
    const logEl = document.getElementById('strategy-chat-log');
    
    // 🌟 修正：作戦会議の文字サイズを md:text-xl (現在の挨拶文字サイズ) に強制拡大
    logEl.innerHTML += `<div class="self-end bg-indigo-100 text-indigo-900 p-3 md:p-4 rounded-xl md:rounded-2xl rounded-tr-none max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-sm md:text-xl mt-2">${input}</div>`;
    logEl.scrollTop = logEl.scrollHeight; inputEl.value = "";
    
    const typingId = "typing-" + Date.now();
    logEl.innerHTML += `<div id="${typingId}" class="self-start bg-white border-2 border-pink-200 text-slate-700 p-3 md:p-4 rounded-xl md:rounded-2xl rounded-tl-none max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-sm md:text-xl mt-2"><span class="typing">💬 考えてるよ...</span></div>`;
    logEl.scrollTop = logEl.scrollHeight;
    
    const cond = document.getElementById('condition-select').value; 
    const health = document.getElementById('health-select').value;
    const timeLimit = document.getElementById('time-limit-select').value;
    const habits = localStorage.getItem('strategy_habits') || '[]';
    
    const today = new Date();
    const todayStr = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;
    const goalsText = (typeof userGoals !== 'undefined' && userGoals.length > 0)
        ? userGoals.map(g => `${formatKarteDateStr(g.date)}: ${g.goal}`).join(' / ')
        : "まだ設定なし";
    
    let scheduleInfo = "予定データなし";
    if (typeof userSchedule !== 'undefined' && userSchedule.length > 0) {
        let now = new Date();
        let exams = userSchedule.filter(s => s.type === '本試験' || s.type === '模試');
        let offDays = userSchedule.filter(s => s.type === '休み').filter(s => new Date(s.date) > now);
        
        if (exams.length > 0) {
            let nextExam = exams.sort((a,b) => new Date(a.date) - new Date(b.date)).find(s => new Date(s.date) > now);
            if (nextExam) {
                let diffDays = Math.ceil((new Date(nextExam.date) - now) / (1000*60*60*24));
                let actualDays = diffDays - offDays.filter(s => new Date(s.date) < new Date(nextExam.date)).length;
                scheduleInfo = `次の目標: ${nextExam.type}(${new Date(nextExam.date).toLocaleDateString()})まであと${diffDays}日（予定された休みを引いた実質稼働日数は ${actualDays}日）`;
            }
        }
    }
    
    let systemPrompt = `あなたは社労士試験の専属個別指導講師（18歳前後の若い女性）です。受講生の要望を最優先で聞き入れ、的確に特訓プランをまとめてください。
【現在のコンディション】
・今日の日付: ${todayStr}
・現在時刻: ${new Date().toLocaleTimeString('ja-JP', {hour:'2-digit', minute:'2-digit'})}
・記録されている学習目標（方針）の履歴: ${goalsText}
・過去の依頼傾向: ${habits}
・目標時間設定: ${timeLimit}
・スケジュール状況: ${scheduleInfo}
・講師モード: ${cond}
・受講生の体調: ${health}
${getPersonalKarteContext()}

【最重要ルール】
1. 受講生は「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」の4科目以外は免除されています。出力するプランの科目は必ずこの4科目のみで構成し、他の科目は含めないでください。
2. ユーザーの発言が単なる質問や雑談、あるいは目標の登録・変更・中止のみであり、今すぐの特訓プランの作成を求めていないと判断した場合は、"plan"の配列を空（[]）にして、会話の返事のみを返してください。
3. ユーザーの発言に「今月は〜をやる」「今週は〜を目標にする」「今月の目標を〜に変更して」「今週の目標は中止」などの【中長期の学習目標・方針の設定・変更・中止】が含まれていた場合は、その内容を短くまとめて "newGoal" に出力してください。含まれていない場合は "newGoal" を空文字（""）にしてください。
4. プランを提案する際は、今日時点で有効な学習目標（過ぎた期間や中止・変更前のものは除外）を最優先しつつ、パーソナルカルテの傾向（眠くなる時間帯や休日の過ごし方など）も自然に配慮してください。
5. セリフ本文は常に1〜2文の自然な現代の口語で出力し、「〜だぞ」「〜だろ」「〜わ」「〜よ」「ふふっ」等の不自然な役割語やアニメ口調は絶対に使用しないでください。

ユーザーの発言に対する返答と、学習プラン（フェーズごとの時間割）をJSONで出力してください。
必ず以下のJSON形式でのみ出力し、バッククォート等の装飾はしないでください。
{
  "message": "ユーザーへの返答セリフ",
  "newGoal": "目標の設定・変更・中止があった場合のみ記載（なければ空文字）",
  "plan": [
    { "phase": "目的", "subject": "労働基準法(択一)等の正確な科目名", "target": "弱点など", "minutes": 30 }
  ]
}`;
    let apiMessages = [{ role: "user", parts: [{ text: systemPrompt + " 受講生の要望: " + input }] }];
    try {
        // 🌟 作戦会議は質を担保しつつ長考・高額化を防ぐため思考上限 1024 を設定
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: buildGeminiPayload(apiMessages, 1024)
        });
        if (!res.ok) throw new Error("通信エラー");
        const data = await res.json(); 
        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiRes = JSON.parse(text);

        let goalBadgeHtml = "";
        if (aiRes.newGoal && aiRes.newGoal.trim() !== "") {
            if (typeof saveGoalToGAS === "function") saveGoalToGAS(aiRes.newGoal.trim());
            goalBadgeHtml = `<div class="mt-2 inline-block bg-amber-100 border border-amber-300 text-amber-900 text-xs md:text-sm font-black px-2.5 py-1 rounded-full">🎯 目標を記録しました: ${aiRes.newGoal.trim()}</div>`;
        }

        // 🌟 文字サイズ拡大
        document.getElementById(typingId).outerHTML = `<div class="self-start bg-white border-2 border-pink-200 text-slate-700 p-3 md:p-4 rounded-xl md:rounded-2xl rounded-tl-none max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-sm md:text-xl mt-2">${aiRes.message}${goalBadgeHtml}</div>`;
        
        const btn = document.getElementById('btn-strategy-start');
        
        if (aiRes.plan && aiRes.plan.length > 0) {
            strategyPlan = { plan: aiRes.plan };
            // 🌟 スケジュール表示枠も文字サイズを拡大して見やすく
            let planHtml = `<div class="w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 md:p-5 mt-3 shadow-sm text-left">
                <h4 class="text-indigo-800 font-black text-sm md:text-lg mb-3 border-b border-indigo-200 pb-2">📋 AI提案スケジュール</h4>
                <div class="flex flex-col gap-3">`;
            
            aiRes.plan.forEach((p, i) => {
                planHtml += `<div class="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm text-sm md:text-lg">
                    <div class="font-black text-indigo-600 mb-1">フェーズ${i+1} <span class="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs md:text-sm ml-2">⏱️ ${p.minutes}分</span></div> 
                    <div class="font-bold text-slate-700">📚 ${p.subject} - ${p.target}</div>
                </div>`;
            });
            planHtml += `</div></div>`;
            logEl.innerHTML += planHtml;
            
            if (btn) btn.classList.remove('hidden');
        } else {
            if (btn) btn.classList.add('hidden');
        }
        
        logEl.scrollTop = logEl.scrollHeight;
        
        // 🌟 修正：作戦会議での音声読み上げ(speakText)を削除（サクッと始められるように）
        
    } catch(e) {
        document.getElementById(typingId).outerHTML = `<div class="self-start bg-red-50 text-red-600 p-3 md:p-4 rounded-xl md:rounded-2xl max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-sm md:text-xl mt-2 border border-red-200">⚠️ 通信エラーが発生したみたい。もう一度話しかけてみて！</div>`;
        logEl.scrollTop = logEl.scrollHeight;
    }
}

function generateDashboardAdvice(stats) {
    const today = new Date();
    const todayStr = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;
    const goalsText = (typeof userGoals !== 'undefined' && userGoals.length > 0)
        ? userGoals.map(g => `${formatKarteDateStr(g.date)}: ${g.goal}`).join(' / ')
        : "特になし";

    let prompt = `受講生のダッシュボードデータです。今日の日付は ${todayStr} です。
【記録されている学習目標（方針）の履歴】
${goalsText}

${getPersonalKarteContext()}

【指示】
1. まず今日の日付（${todayStr}）時点で有効な学習目標（過ぎた月や週、変更・中止前の古いものは無視）を確認してください。
2. 有効な目標がある場合は、必ずその目標（例：労基マスターなど）を最優先にして、その科目やテーマに沿った1〜2文の激励アドバイスをしてください。目標がない場合のみ、進捗が遅れている科目や正答率が低い科目を1つ見つけてアドバイスしてください。
3. パーソナルカルテや予定（今日の予定・昨日の出来事・時間帯の傾向・試験までの日数など）で今触れると自然な要素があれば、さりげなく織り交ぜて「自分をわかってくれている専属講師」らしい一言にしてください。
4. 【重要】受講生は「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」の4科目以外は免除されています。これら以外についての言及は避けてください。
5. 【厳守事項】セリフ本文は自然な現代の口語とし、「〜だぞ」「〜だろ」「〜わ」「〜よ」「ふふっ」等の不自然な役割語やアニメ口調は絶対に使用しないでください。
データ: ${JSON.stringify(stats).substring(0, 1000)}`;
    // 🌟 メイン画面の専属講師アドバイスも質重視＋高額化防止のため思考上限 1024 を設定
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: buildGeminiPayload([{ parts: [{ text: prompt }] }], 1024)
    }).then(res => res.json()).then(data => {
        if (data.candidates && data.candidates[0]) { document.getElementById('dash-ai-comment').textContent = data.candidates[0].content.parts[0].text; }
    }).catch(e => {});
}

/* =========================================================
   ☕ 休憩中の気晴らし雑談・ランダムミニゲーム・カルテ自動蓄積
   ========================================================= */

// 🌟 休憩開始時の最初の一言（無音・思考上限 512）
async function initBreakChatGreeting(minutes) {
    const logEl = document.getElementById('break-chat-log');
    if (!logEl) return;

    const greetId = "break-greet-" + Date.now();
    logEl.innerHTML = `<div id="${greetId}" class="self-start bg-white border-2 border-pink-200 text-slate-700 p-2.5 md:p-3.5 rounded-xl rounded-tl-none max-w-[88%] shadow-sm font-bold text-sm md:text-lg"><span class="typing">💬 ...</span></div>`;

    if (!userApiKey) {
        const keyInput = document.getElementById('api-key-input');
        if (keyInput && keyInput.value.trim()) userApiKey = keyInput.value.trim();
    }
    if (!userApiKey) {
        const gEl = document.getElementById(greetId);
        if (gEl) gEl.textContent = `おつかれさま！${minutes}分間ゆっくり一息つこうね。`;
        return;
    }

    const condEl = document.getElementById('condition-select');
    const cond = condEl ? condEl.value : '普通';
    const healthEl = document.getElementById('health-select');
    const health = healthEl ? healthEl.value : '普通';

    const prompt = `あなたは社労士試験の専属個別指導講師（18歳前後の若い女性）です。講師モードは「${cond}」、受講生の体調は「${health}」です。
今、受講生が勉強の合間に「${minutes}分間の小休憩」に入りました。
${getPersonalKarteContext()}

【絶対ルール】
1. 1〜2文で、勉強の疲れを労いつつリラックスして過ごせる自然な最初の一言だけを出力してください。
2. 情報収集のために質問攻めにはせず、目を閉じて休んでもいいし気が向いたら雑談しようね、くらいの心地よい距離感にしてください（カルテに直近の話題や時間帯の特徴があれば自然に一言触れてもOK）。
3. 勝手にミニゲームを始めないでください。
4. 「〜だぞ」「〜だろ」「〜わ」「〜よ」「ふふっ」「〜かしら」等の不自然な役割語やアニメ口調は絶対禁止です。`;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: buildGeminiPayload([{ parts: [{ text: prompt }] }], 512)
        });
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text.trim();
        const gEl = document.getElementById(greetId);
        if (gEl) gEl.textContent = text;
        if (typeof breakChatHistory !== 'undefined' && Array.isArray(breakChatHistory)) {
            breakChatHistory.unshift({ role: 'ai', text: text });
        }
        logEl.scrollTop = logEl.scrollHeight;
    } catch (e) {
        const fallback = `おつかれさま！${minutes}分間ちょっと頭を休めようね。気が向いたら何でも話しかけてね。`;
        const gEl = document.getElementById(greetId);
        if (gEl) gEl.textContent = fallback;
    }
}

// 🌟 休憩中の雑談送受信＆カルテ・スケジュール自動抽出（無音・思考上限 512）
async function sendBreakChatMessage() {
    const inputEl = document.getElementById('break-chat-input');
    const logEl = document.getElementById('break-chat-log');
    if (!inputEl || !logEl) return;

    const input = inputEl.value.trim();
    if (!input) return;

    if (!userApiKey) {
        const keyInput = document.getElementById('api-key-input');
        if (keyInput && keyInput.value.trim()) userApiKey = keyInput.value.trim();
    }
    if (!userApiKey) {
        logEl.innerHTML += `<div class="self-start bg-red-50 text-red-600 p-2.5 rounded-xl text-xs md:text-base font-bold border border-red-200">スタート画面でAPIキーを設定するとおしゃべりできるからね！</div>`;
        logEl.scrollTop = logEl.scrollHeight;
        return;
    }

    inputEl.value = "";
    logEl.innerHTML += `<div class="self-end bg-indigo-100 text-indigo-900 p-2.5 md:p-3.5 rounded-xl rounded-tr-none max-w-[85%] shadow-sm font-bold text-sm md:text-lg">${input.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
    logEl.scrollTop = logEl.scrollHeight;

    if (typeof breakChatHistory === 'undefined' || !Array.isArray(breakChatHistory)) {
        window.breakChatHistory = [];
    }
    breakChatHistory.push({ role: 'user', text: input });

    const typingId = "break-typing-" + Date.now();
    logEl.innerHTML += `<div id="${typingId}" class="self-start bg-white border-2 border-pink-200 text-slate-700 p-2.5 md:p-3.5 rounded-xl rounded-tl-none max-w-[88%] shadow-sm font-bold text-sm md:text-lg"><span class="typing">💬 ...</span></div>`;
    logEl.scrollTop = logEl.scrollHeight;

    const condEl = document.getElementById('condition-select');
    const cond = condEl ? condEl.value : '普通';
    const healthEl = document.getElementById('health-select');
    const health = healthEl ? healthEl.value : '普通';
    const remainSec = (typeof napSecondsLeft !== 'undefined') ? Math.max(0, napSecondsLeft) : 0;

    // 話題を振られた時に毎回違うミニゲームが選ばれるようJS側でランダム抽選しておく
    const miniGames = [
        "究極の2択トーク（疲れた時は甘いもの派？しょっぱいもの派？など頭を使わない好み・価値観の2択）",
        "直感4択！プチ心理テスト＆ご褒美診断（直感で1つ選んでもらい、ユーモア交じりに診断）",
        "法律用語は絶対禁止！しばり付きしりとり（食べ物しばりや3文字しばり等で勉強用語を出したら負け）",
        "ウソ？ホント？雑学マルバツ1問クイズ（社労士とは無関係なグルメ・動物・日常の意外な雑学を1問出題）",
        "3つのヒントで当てて！連想あてっこゲーム（ある食べ物や動物などの特徴を3つ出して当ててもらう軽いクイズ）"
    ];
    const pickedGame = miniGames[Math.floor(Math.random() * miniGames.length)];

    const historyText = breakChatHistory.slice(-10).map(h => `${h.role === 'user' ? '受講生' : '講師'}: ${h.text}`).join('\n');

    const prompt = `あなたは社労士試験の専属個別指導講師（18歳前後の若い女性）です。現在は勉強の合間の休憩タイム（残り約${remainSec}秒）です。
講師モードは「${cond}」、受講生の体調は「${health}」です。

${getPersonalKarteContext()}

【今回の休憩中の会話履歴】
${historyText}

【会話・ミニゲームの絶対ルール】
1. 休憩中なので勉強の説教はせず、親しみやすい現代の若い女性の自然な口語体で気晴らしになる会話をしてください。情報収集のために変に質問攻めにするのは厳禁です。
2. 「〜だぞ」「〜だろ」「〜わ」「〜よ」「ふふっ」「〜かしら」等の不自然な役割語やアニメ口調は絶対に使用しないでください。通常の雑談は1〜2文でテンポよく返してください（ミニゲーム出題・結果発表時のみ2〜3文程度まで可）。
3. 受講生は「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」以外は免除のため、他科目の話は絶対にしないでください。
4. 【ミニゲーム発動条件】普段は勝手にミニゲームを始めないでください。受講生から「何か話題ある？」「話ある？」「暇だな」「何か面白いことない？」のように話題や遊びを求められた場合のみ、今回はランダム抽選された『${pickedGame}』をサプライズで楽しく始めてください！（すでに会話履歴でミニゲーム進行中の場合は、そのままそのゲームの判定や続きを進行してください）

【カルテ・予定の裏側自動抽出ルール】
受講生の最新発言（「${input}」）の中に、今後の会話や学習ペース把握に役立つ新しい情報が含まれていた場合のみ抽出してください（普通の相槌やミニゲームの回答など記録不要な場合は必ず空配列 [] にしてください）。
・newSchedules: 「今度の日曜に〇〇へ遊びに行く」「今週土曜に美容院を予約する」など具体的な日付が特定できる外出・休み予定（または模試・本試験）があれば、現在日時を基準に正確な YYYY/MM/DD を計算して {"date":"YYYY/MM/DD","type":"休み","memo":"予定内容"} を出力（模試なら type は "模試"）。日付がまだ未定の話は newKarte に入れてください。
・newKarte: 「土日祝は勉強したくない」「22時になるといつも眠くなる」「甘いものが好き」「そろそろ髪を切りたいと思っている」など、やる気・集中力・疲労・生活習慣・好み・近況に関する情報を {"category":"予定メモ/生活リズム/学習スタイル/好み 等","info":"簡潔な内容"} で出力。

必ず以下のJSON形式のみで出力してください（バッククォート不要）。
{
  "reply": "受講生への返答セリフ",
  "newKarte": [],
  "newSchedules": []
}`;

    try {
        // 🌟 休憩中の雑談はカルテ抽出＆日付計算の精度とコストのバランスを取り思考上限 512 を設定
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: buildGeminiPayload([{ parts: [{ text: prompt }] }], 512)
        });
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        let rawText = data.candidates[0].content.parts[0].text.trim();
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        let replyText = rawText;
        let savedSomething = false;

        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.reply) replyText = parsed.reply;
                if (Array.isArray(parsed.newKarte) && parsed.newKarte.length > 0) {
                    if (typeof savePersonalKarteToGAS === "function") savePersonalKarteToGAS(parsed.newKarte);
                    savedSomething = true;
                }
                if (Array.isArray(parsed.newSchedules) && parsed.newSchedules.length > 0) {
                    if (typeof saveScheduleFromChatToGAS === "function") saveScheduleFromChatToGAS(parsed.newSchedules);
                    savedSomething = true;
                }
            } catch (parseErr) {}
        }

        breakChatHistory.push({ role: 'ai', text: replyText });

        const memoBadge = savedSomething
            ? `<div class="mt-1.5 text-[10px] md:text-xs text-amber-700 font-bold">📝 カルテにそっとメモしました</div>`
            : "";

        const tEl = document.getElementById(typingId);
        const bubbleHtml = `<div class="self-start bg-white border-2 border-pink-200 text-slate-700 p-2.5 md:p-3.5 rounded-xl rounded-tl-none max-w-[88%] shadow-sm font-bold text-sm md:text-lg">${replyText.replace(/\n/g, '<br>')}${memoBadge}</div>`;
        if (tEl) tEl.outerHTML = bubbleHtml;
        else logEl.innerHTML += bubbleHtml;

        logEl.scrollTop = logEl.scrollHeight;
    } catch (e) {
        const tEl = document.getElementById(typingId);
        if (tEl) tEl.outerHTML = `<div class="self-start bg-red-50 text-red-600 p-2.5 md:p-3.5 rounded-xl max-w-[88%] text-xs md:text-base font-bold border border-red-200">ごめんね、通信がうまくいかなかったみたい。もう一回送ってみて！</div>`;
        logEl.scrollTop = logEl.scrollHeight;
    }
}

// 🌟 休憩タイマーが 00:00 になった瞬間の「ゆっくり腰を上げる」開始合図（音声あり・思考ゼロ 0）
async function triggerBreakTimeUpVoice() {
    const condEl = document.getElementById('condition-select');
    const cond = condEl ? condEl.value : '普通';
    const healthEl = document.getElementById('health-select');
    const health = healthEl ? healthEl.value : '普通';

    const recentChat = (typeof breakChatHistory !== 'undefined' && Array.isArray(breakChatHistory) && breakChatHistory.length > 0)
        ? breakChatHistory.slice(-4).map(h => `${h.role === 'user' ? '受講生' : '講師'}: ${h.text}`).join('\n')
        : "（会話なし・静かに休憩）";

    const prompt = `あなたは社労士試験の専属個別指導講師（18歳前後の若い女性）です。講師モードは「${cond}」、受講生の体調は「${health}」です。
今ちょうど小休憩のタイマーが 00:00（終了時間）になりました。
【直前の休憩中の様子】
${recentChat}

【絶対ルール】
1. 1〜2文で、休憩終了と勉強再開の合図を出してください。
2. いきなり「じゃあ頑張ろう！」と急に切り替えるのではなく、「そろそろ時間だから、ゆっくり始めようか」（もし雑談やミニゲームの途中だったなら「続きはまた次の休憩にしようか、そろそろ時間だからゆっくり始めようね」など）のように、ゆっくり腰を上げる自然なトーンにしてください。
3. 「〜だぞ」「〜だろ」「〜わ」「〜よ」「ふふっ」「〜かしら」等の不自然な役割語やアニメ口調は絶対禁止です。`;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: buildGeminiPayload([{ parts: [{ text: prompt }] }], 0)
        });
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text.trim();

        if (typeof lastBreakEndMessage !== 'undefined') lastBreakEndMessage = text;

        const logEl = document.getElementById('break-chat-log');
        if (logEl) {
            logEl.innerHTML += `<div class="self-start bg-amber-50 border-2 border-amber-300 text-amber-900 p-2.5 md:p-3.5 rounded-xl rounded-tl-none max-w-[90%] shadow-sm font-black text-sm md:text-lg mt-1">⏰ ${text}</div>`;
            logEl.scrollTop = logEl.scrollHeight;
        }
        if (typeof setAiBubbleVisible === "function") setAiBubbleVisible(true);
        const aiEl = document.getElementById('ai-message');
        if (aiEl) aiEl.textContent = text;

        speakText(text);
    } catch (e) {
        const fallback = "そろそろ休憩の時間おしまいだね。一息つけたかな、ゆっくり始めようか。";
        if (typeof lastBreakEndMessage !== 'undefined') lastBreakEndMessage = fallback;
        const logEl = document.getElementById('break-chat-log');
        if (logEl) {
            logEl.innerHTML += `<div class="self-start bg-amber-50 border-2 border-amber-300 text-amber-900 p-2.5 md:p-3.5 rounded-xl rounded-tl-none max-w-[90%] shadow-sm font-black text-sm md:text-lg mt-1">⏰ ${fallback}</div>`;
            logEl.scrollTop = logEl.scrollHeight;
        }
        speakText(fallback);
    }
}