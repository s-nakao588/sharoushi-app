// ai.js
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

// 🌟 作戦会議用の会話履歴を保持する配列
let strategyHistory = [];

async function callGeminiAPI(systemInstruction, userText, history = []) {
    if (!userApiKey) {
        console.warn("APIキーが設定されていません。");
        return "ごめんね、APIキーが設定されていないみたい！設定画面から入力してね。";
    }

    const modelToUse = userModel || 'gemini-2.5-flash';
    const endpoint = `${GEMINI_API_URL}${modelToUse}:generateContent?key=${userApiKey}`;
    
    // 過去の履歴と今回のメッセージを結合
    let contents = [...history];
    if (userText) {
        contents.push({ role: "user", parts: [{ text: userText }] });
    }

    const payload = {
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: contents,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
        }
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("APIレスポンスエラー");
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "ごめん、ちょっと考え中…！もう一度試してみて！";
    }
}

// 🌟 作戦会議（チャット）専用の送信関数
async function sendStrategyMessage(userInput = null) {
    const inputField = document.getElementById('strategy-input');
    const text = userInput || inputField.value.trim();
    if (!text && strategyHistory.length > 0) return;
    
    if (inputField) inputField.value = '';

    const chatArea = document.getElementById('strategy-chat-area');
    if (chatArea && text) {
        chatArea.innerHTML += `<div class="mb-2 text-right"><span class="inline-block bg-blue-100 text-blue-800 p-2 rounded-lg text-sm">${text}</span></div>`;
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    // AIに渡す情報の組み立て
    const coachSelect = document.getElementById('coach-select');
    const coachMode = coachSelect ? coachSelect.value : '普通';
    const condition = document.getElementById('condition-select') ? document.getElementById('condition-select').value : '普通';
    
    // 試験日（2027年8月22日と仮定）までの日数
    const examDate = new Date('2027-08-22');
    const today = new Date();
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    
    // 簡単な成績サマリーを生成
    let statsSummary = "";
    if (typeof getStatsSummary === "function") {
        const stats = getStatsSummary();
        let totalPlayed = 0; let totalQuestions = 0;
        for (let subj in stats) {
            totalPlayed += stats[subj].played;
            totalQuestions += stats[subj].total;
            if(stats[subj].played > 0) {
                statsSummary += `[${subj}] 正答率:${stats[subj].masterRate}% `;
            }
        }
        statsSummary += `\n全体進捗: ${totalPlayed}/${totalQuestions}問。`;
    }

    const systemPrompt = `
あなたは18歳の女性講師として、ユーザーの社労士試験（2027年8月）合格をサポートする作戦会議を行います。
試験まで残り: ${daysLeft}日
現在の指導スタンス: ${coachMode}（このテンションに合わせること。スパルタなら厳しめ、寄り添いなら優しく）
ユーザーの今日の体調: ${condition}
学習データ: ${statsSummary}

【絶対ルール】
1. 「〜だぞ」「〜だろ」「〜わ」「〜よ」「ふふっ」などの不自然な役割語は絶対に禁止。自然な話し言葉にすること。
2. 1回の返信は2〜3文以内で簡潔に。一気に複数の質問をしない。

【作戦会議のステップ】
以下の順番で会話のキャッチボールを行い、今日のメニューを決めてください。
① データの分析と提案: 「労基法の正答率が低いね」や「最近健保をやってないね（忘却対策）」などのデータを提示し、「今日はどの科目をやる？」と聞く。
② 量の相談: 科目が決まったら「何問くらい（または何分くらい）やる？」と聞く。
③ 質の相談: 量が決まったら「弱点対策（間違えた問題）？それともまだ解いてない問題？完全ランダム？」と聞く。
④ 合意と実行: すべて決まったら、「了解！じゃあ始めるね！」という言葉と共に、返信の【最後】に以下のJSONコードブロックのみを出力して会話を終了してください。

\`\`\`json
{"command": "start_strategy", "subject": "科目名(例:労働基準法(択一))", "target": "weakness または forget または unattempted または random", "count": 問題数}
\`\`\`
※JSONを出力すると自動でシステムが起動します。JSONの前後に余計な説明は入れないでください。`;

    if (chatArea) {
        chatArea.innerHTML += `<div class="mb-2 text-left" id="ai-typing"><span class="inline-block bg-slate-100 text-slate-600 p-2 rounded-lg text-sm">考え中...💬</span></div>`;
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    const aiResponse = await callGeminiAPI(systemPrompt, text, strategyHistory);
    
    if (text) strategyHistory.push({ role: "user", parts: [{ text: text }] });
    
    const typingEl = document.getElementById('ai-typing');
    if (typingEl) typingEl.remove();

    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
    let displayText = aiResponse;
    
    if (jsonMatch) {
        displayText = aiResponse.replace(jsonMatch[0], '').trim();
        try {
            const config = JSON.parse(jsonMatch[1].trim());
            if (config.command === 'start_strategy' && typeof startStrategyPlaylist === 'function') {
                setTimeout(() => { startStrategyPlaylist(config); }, 1500);
            }
        } catch(e) { console.error("Strategy JSON Parse Error:", e); }
    }

    strategyHistory.push({ role: "model", parts: [{ text: aiResponse }] });

    if (chatArea && displayText) {
        chatArea.innerHTML += `<div class="mb-2 text-left"><span class="inline-block bg-slate-100 text-slate-800 p-2 rounded-lg text-sm font-bold border border-slate-300">${displayText.replace(/\n/g, '<br>')}</span></div>`;
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    if (!isMuted && typeof audioCtx !== 'undefined') {
        let u = new SpeechSynthesisUtterance(displayText.replace(/[\*\#\`\_]/g, ''));
        u.lang = 'ja-JP'; u.rate = 1.1; window.speechSynthesis.speak(u);
    }
}

// 🌟 通常のゲーム中のAIメッセージ生成
async function generateAiMessage(type, data = {}, isFirst = false, forceSpeak = false) {
    const aiMessageEl = document.getElementById('ai-message');
    if (aiMessageEl) aiMessageEl.innerHTML = '<span class="animate-pulse">考え中...💬</span>';

    const coachSelect = document.getElementById('coach-select');
    const coachMode = coachSelect ? coachSelect.value : '普通';
    const condition = document.getElementById('condition-select') ? document.getElementById('condition-select').value : '普通';

    let prompt = `あなたは18歳の女性講師。社労士試験の勉強をサポートしています。
指導スタンス: ${coachMode}
ユーザーの体調: ${condition}
絶対ルール: 役割語（だぞ、だろ、わ、よ、ふふっ等）は禁止。1〜2文で短く自然な言葉で話すこと。

状況: `;

    if (type.startsWith('start_')) {
        prompt += `これから学習セットを開始します。励ましてください。`;
    } else if (type === 'answer_takuitsu') {
        prompt += `ユーザーが問題を解きました。正解かどうか: ${data.isCorrect ? '正解' : '不正解'}。解説の要約を交えて一言コメントしてください。`; } else if (type === 'result_sentaku') { prompt += `選択式問題の結果が出ました。スコア: ${data.score}/5。一言コメントしてください。`;
    } else if (type === 'end_all') {
        prompt += `今日の学習セットが終わりました。労いの言葉をかけてください。`;
    } else if (type === 'wake_up_night') {
        prompt += `夜遅くにユーザーが問題を解く途中で寝落ちしかけて時間切れになりました。少し驚かせるように、かなり強めに目を覚まさせる言葉をかけてください。（例：ちょっと！起きてる！？）`;
    } else if (type === 'wake_up_day') {
        prompt += `日中ですがユーザーが時間切れになりました。集中力が切れているようなので、気合を入れ直す言葉をかけてください。`;
    } else {
        prompt += `ユーザーを応援してください。`;
    }

    const response = await callGeminiAPI(prompt, "");
    
    if (aiMessageEl) {
        aiMessageEl.innerHTML = response;
        if (type === 'wake_up_day' || type === 'wake_up_night') {
            aiMessageEl.classList.add('text-red-600', 'font-black');
            setTimeout(() => aiMessageEl.classList.remove('text-red-600', 'font-black'), 5000);
        }
    }
    
    // 🌟 forceSpeakがtrueなら、ミュート設定を無視して喋る
    if ((!isMuted || forceSpeak) && typeof audioCtx !== 'undefined') {
        let u = new SpeechSynthesisUtterance(response.replace(/[\*\#\`\_]/g, ''));
        u.lang = 'ja-JP'; u.rate = (type === 'wake_up_night') ? 1.3 : 1.1; 
        if (type === 'wake_up_night') u.pitch = 1.5; // 少し高めの声で焦らせる
        window.speechSynthesis.speak(u);
    }
    
    if (isFirst && typeof onAiGreetingStarted === "function") {
        onAiGreetingStarted();
    }
}