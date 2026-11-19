// 🌟 AIメッセージ生成（日常会話・ヒント・リアクション）
async function generateAiMessage(promptType, data = {}, isFirstLoad = false, forceNight = false) {
    const aiMessageEl = document.getElementById('ai-message');
    if (!aiMessageEl) return;
    
    const condSelect = document.getElementById('condition-select');
    const cond = condSelect ? condSelect.value : '普通';
    const healthSelect = document.getElementById('health-select');
    const health = healthSelect ? healthSelect.value : '普通';
    
    // 🌟 無音発話による音声アンロック（iOS/Safari対応）
    if (isFirstLoad && !isMuted) {
        if ('speechSynthesis' in window) {
            let u = new SpeechSynthesisUtterance("");
            u.volume = 0;
            window.speechSynthesis.speak(u);
        }
    }

    aiMessageEl.innerHTML = '<span class="typing">💬 考え中...</span>';

    let prompt = `あなたは社労士試験の専属講師（若い女性）です。受講生をサポートします。
    現在のモード（性格）は「${cond}」、受講生の体調は「${health}」です。
    【重要】受講生は「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」の4科目以外は免除されています。この4科目以外について学習を促す発言や提案は絶対にしないでください。
    性格に合わせてセリフの厳しさやテンションを変えてください（アニメ口調は絶対禁止。1〜2文の自然な口語で）。\n`;

    if (forceNight) {
        prompt += "現在深夜です。厳しく寝るように促すか、優しく休むように促してください。\n";
    } else if (promptType === 'start_all' || promptType === 'start_takuitsu' || promptType === 'start_sentaku') {
        prompt += `特訓開始の挨拶をしてください。全${data.total}問です。`;
    } else if (promptType === 'answer_takuitsu') {
        prompt += `択一式問題に${data.isCorrect ? '正解' : '不正解'}しました。解説：「${data.explanation}」\nリアクションと解説の超短い要約をしてください。`;
    } else if (promptType === 'result_sentaku') {
        prompt += `選択式問題で5点中${data.score}点でした。リアクションしてください。`;
    } else if (promptType === 'hint_takuitsu') {
        prompt += `問題文：「${data.questionText}」\n解説：「${data.explanation}」\n答えを直接言わず、着眼点のヒントを出してください。`;
    } else if (promptType === 'hint_sentaku') {
        prompt += `選択式問題のヒントを出しました（キーワードを黄色でハイライト）。文脈に注目するようアドバイスしてください。`;
    } else if (promptType === 'health_check') {
        prompt += `長時間の学習が続いています。体調を気遣う声かけをしてください。`;
    } else if (promptType === 'nap_start') {
        prompt += `仮眠・休憩に入ります。労いの言葉をかけてください。`;
    } else if (promptType === 'nap_end') {
        prompt += `仮眠から復帰しました。再開の挨拶をしてください。`;
    } else if (promptType.startsWith('start_')) {
        prompt += `特殊イベント（${promptType}）が始まります。気合を入れるセリフを言ってください。`;
    } else if (promptType === 'end_all' || promptType === 'end_event') {
        prompt += `特訓が完了しました。労いの言葉と、成績に応じたアドバイスをしてください。`;
    } else {
        prompt += `状況に応じた適切なサポートメッセージを1文でお願いします。`;
    }

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const resultData = await res.json();
        const text = resultData.candidates[0].content.parts[0].text.trim();
        aiMessageEl.textContent = text;
        
        if (isFirstLoad && typeof onAiGreetingStarted === 'function') onAiGreetingStarted();
        speakText(text);
    } catch (e) {
        aiMessageEl.textContent = "一緒にがんばろう！";
        if (isFirstLoad && typeof onAiGreetingStarted === 'function') onAiGreetingStarted();
    }
}

// 🌟 音声読み上げ（iPad対応：ピッチ・レート完全無加工）
function speakText(text) {
    if (isMuted || !text) return;
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    const bestVoice = voices.find(v => 
        v.name.includes('Kyoko') || 
        v.name.includes('Otoya') || 
        v.name.includes('Siri') || 
        v.name.includes('Google 日本語') || 
        v.lang === 'ja-JP'
    );
    if (bestVoice) utterance.voice = bestVoice;
    
    // ※絶対ルール遵守：iPad等の機械音化バグを防ぐため、pitchとrateは一切指定しない（完全無加工）
    window.speechSynthesis.speak(utterance);
}

// 🌟 Proモデルによる高度検証（矛盾・法改正チェック）
async function verifyDataWithPro(questionData) {
    if (!userApiKey) return;
    const prompt = `あなたは社労士試験のプロフェッショナルです。以下の問題文と解説に、現在の法令（法改正）と照らし合わせて矛盾や古い情報がないか検証してください。
    問題文: ${questionData.問題文}
    解説: ${questionData.解説}
    問題があればJSONで {"hasError": true, "reason": "理由", "correctChoice": "〇または✖", "newExplanation": "修正後の解説"} を返してください。
    問題がなければ {"hasError": false} を返してください。バッククォートは不要です。`;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        let text = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(text);
        
        if (result.hasError) {
            pendingFixData = result;
            const afa = document.getElementById('ai-fix-action');
            const afr = document.getElementById('ai-fix-reason');
            if (afa && afr) {
                afr.textContent = result.reason;
                afa.classList.remove('hidden');
            }
        }
    } catch (e) {
        // エラー時は何もしない
    }
}

// 🌟 ダッシュボードのAIアドバイス生成
async function generateDashboardAdvice(stats) {
    const commentEl = document.getElementById('dash-ai-comment');
    if (!commentEl) return;
    commentEl.innerHTML = '<span class="typing">データ分析中...</span>';
    
    let prompt = `受講生のダッシュボードデータです。最も進捗が遅れている科目や、正答率が低い科目を1つ見つけ、1〜2文で激励のアドバイスをしてください。アニメ口調は禁止です。
    【重要】受講生は「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」の4科目以外は免除されています。これら4科目以外についての言及は避けてください。
    データ：${JSON.stringify(stats).substring(0, 1000)}`;
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        commentEl.textContent = data.candidates[0].content.parts[0].text.trim();
    } catch (e) {
        commentEl.textContent = "今日もコツコツ進めていこう！";
    }
}

// 🌟 Pro AI錬金（問題再生成）
async function generateAlchemyQuestion() {
    const q = currentQuestions[currentIndex];
    const qtt = document.getElementById('question-text-takuitsu');
    if (!qtt) return;
    
    generateAiMessage("alchemy_prep", { textOnly: true });
    qtt.innerHTML = '<span class="typing text-purple-600 font-bold">🔥 錬金術発動中... (Proモデルで問題を再構築しています)</span>';
    
    const prompt = `社労士試験の問題です。以下の条文・解説をベースに、別の論点（ひっかけポイント）を抜いた新しい「択一式の〇✖問題」を1問作成してください。
    ベース問題: ${q.問題文}
    解説: ${q.解説}
    必ずJSONで {"question": "新しい問題文", "answer": "〇または✖", "explanation": "解説文"} の形式で出力してください。バッククォート不要。`;
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        let text = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(text);
        
        qtt.innerHTML = result.question;
        q.問題文 = result.question;
        q.正誤 = result.answer;
        q.解説 = result.explanation + " <br><br><span class='text-purple-600 font-bold'>※Pro AI錬金による生成問題</span>";
        
        const qct = document.getElementById('q-chapter-text');
        if(qct) qct.textContent = "Pro AI 錬金問題";
        
    } catch (e) {
        qtt.innerHTML = '<span class="text-red-500">錬金に失敗しました...</span>';
        setTimeout(() => { loadQuestion(false, false, false); }, 2000);
    }
}

// 🌟 対話可能なスケジュール作成ロジック（作戦会議チャット）
async function sendStrategyMessage() {
    const inputEl = document.getElementById('strategy-input');
    const userText = inputEl.value.trim();
    if (!userText) return;
    inputEl.value = '';

    const log = document.getElementById('strategy-chat-log');
    log.innerHTML += `<div class="self-end bg-indigo-100 border-2 border-indigo-200 text-indigo-900 p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm font-bold text-sm md:text-xl mt-2">${userText}</div>`;
    log.innerHTML += `<div class="self-start bg-white border-2 border-pink-200 text-slate-700 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm font-bold text-sm md:text-xl mt-2" id="typing-indicator"><span class="typing">💬 プランを練っているよ...</span></div>`;
    log.scrollTop = log.scrollHeight;

    const condSelect = document.getElementById('condition-select');
    const cond = condSelect ? condSelect.value : '普通';
    const healthSelect = document.getElementById('health-select');
    const health = healthSelect ? healthSelect.value : '普通';
    const timeLimitSelect = document.getElementById('time-limit-select');
    const timeLimit = timeLimitSelect ? timeLimitSelect.value : '無制限';

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

    const prompt = `あなたは社労士試験の専属講師（若い女性）です。ユーザーと対話形式で作戦会議をしています。
【状態データ】
・講師の性格: ${cond}（この性格に基づいてセリフの厳しさやテンションを変えること）
・ユーザーの体調: ${health}
・目標時間設定: ${timeLimit}
・現在時刻: ${new Date().toLocaleTimeString('ja-JP')}
・スケジュール状況: ${scheduleInfo}
・ユーザーの発言: 「${userText}」

【重要ルール】
1. 受講生は「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」の4科目以外は免除されています。出力するプランの科目は必ずこの4科目のみで構成し、他の科目は含めないでください。
2. ユーザーの発言が単なる質問や雑談（「あと何日？」など）であり、プランの作成や変更を求めていないと判断した場合は、"plan"の配列を空（[]）にして、会話の返事のみを返してください。

ユーザーの発言に対する返答と、学習プラン（フェーズごとの時間割）をJSONで出力してください。
時間は指定された目標時間の枠内で配分してください。
必ず以下のJSON形式でのみ出力し、バッククォート等の装飾はしないでください。
{
  "message": "ユーザーへの返答セリフ（1〜2文で自然な口語。アニメ口調は絶対禁止。残り稼働日数や提案内容に触れること）",
  "plan": [
    { "phase": "導入/メイン/総仕上げ等", "subject": "労働基準法(択一)、安全衛生法(択一)等の正確な科目名", "target": "復習/弱点/未着手/ランダム", "minutes": 30 },
    { "phase": "...", "subject": "...", "target": "...", "minutes": 60 }
  ]
}`;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${userModel}:generateContent?key=${userApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json/g, '').replace(/ কলকাতায়/g, '').replace(/```/g, '').trim();
        const aiRes = JSON.parse(text);

        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();

        log.innerHTML += `<div class="self-start bg-white border-2 border-pink-200 text-slate-700 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm font-bold text-sm md:text-xl mt-2">${aiRes.message}</div>`;
        
        const btn = document.getElementById('btn-strategy-start');
        
        // プランが存在する場合のみスケジュールを表示し、スタートボタンを出す
        if (aiRes.plan && aiRes.plan.length > 0) {
            strategyPlan = { plan: aiRes.plan };
            
            let planHtml = `<div class="w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 md:p-4 mt-3 shadow-sm text-left">
                <h4 class="text-indigo-800 font-black text-sm md:text-base mb-2 border-b border-indigo-200 pb-1 flex items-center gap-1"><span>📋</span> AI提案スケジュール</h4>
                <div class="flex flex-col gap-2">`;
            
            aiRes.plan.forEach((p, i) => {
                planHtml += `<div class="bg-white p-2 rounded-lg border border-indigo-100 shadow-sm text-xs md:text-sm">
                    <div class="font-black text-indigo-600 mb-1">フェーズ${i+1} <span class="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-[10px] md:text-xs ml-1">⏱️ ${p.minutes}分</span></div> 
                    <div class="font-bold text-slate-700">📚 ${p.subject} - ${p.target}</div>
                    <div class="text-slate-500 font-bold text-[10px] md:text-xs mt-1">🎯 目的: ${p.phase}</div>
                </div>`;
            });
            planHtml += `</div></div>`;
            log.innerHTML += planHtml;
            
            if (btn) {
                btn.classList.remove('hidden');
                btn.textContent = "🔥 このプランで特訓スタート！";
            }
        } else {
            // 単なる雑談の場合はスタートボタンを隠す
            if (btn) btn.classList.add('hidden');
        }
        
        log.scrollTop = log.scrollHeight;
        if(typeof speakText === "function") speakText(aiRes.message);

    } catch (e) {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
        log.innerHTML += `<div class="self-start bg-white border-2 border-red-200 text-red-600 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm font-bold text-sm mt-2">ごめん、プランの作成に失敗しちゃった。もう一度教えてくれる？</div>`;
    }
}