// ai.js
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

let strategyHistory = [];
let strategyPlan = null;

// 🌟 バックアップから復元：高品質音声TTS機能（絶対ルール4準拠）
async function speakText(text) {
    if (isMuted || !text) return; 
    let cleanText = text.replace(/<[^>]+>/g, '').trim(); 
    if (!cleanText) return;
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent?key=${userApiKey}`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ contents: [{ parts: [{ text: cleanText }] }] })
        });
        if (!res.ok) throw new Error("TTS API Error");
        const data = await res.json();
        const p = document.getElementById('tts-player');
        if (p) {
            p.src = `data:audio/mp3;base64,${data.candidates[0].content.parts[0].inlineData.data}`; 
            p.play();
        }
    } catch (err) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(cleanText); 
            utterance.lang = 'ja-JP';
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v => v.lang === 'ja-JP' && (v.name.includes('Kyoko') || v.name.includes('Otoya') || v.name.includes('Siri') || v.name.includes('Google 日本語')));
            if(femaleVoice) utterance.voice = femaleVoice;
            window.speechSynthesis.speak(utterance);
        }
    }
}

// 🌟 API通信の土台
async function callGeminiAPI(systemInstruction, userText, history = []) {
    if (!userApiKey) {
        console.warn("APIキーが設定されていません。");
        return "ごめんね、APIキーが設定されていないみたい！設定画面から入力してね。";
    }

    const modelToUse = userModel || 'gemini-2.5-flash';
    const endpoint = `${GEMINI_API_URL}${modelToUse}:generateContent?key=${userApiKey}`;
    
    let contents = [...history];
    if (userText && userText.trim() !== "") {
        contents.push({ role: "user", parts: [{ text: userText }] });
    } else {
        contents.push({ role: "user", parts: [{ text: "状況を分析してコメントをお願い！" }] });
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
            console.error("Gemini API Error Detail:", data);
            throw new Error("APIレスポンスエラー");
        }
    } catch (error) {
        console.error("Gemini API Request Error:", error);
        return "ごめん、ちょっと考え中…！もう一度試してみて！";
    }
}

// 🌟 作戦会議（チャット）機能 (バックアップからの完全復元)
async function sendStrategyMessage() {
    userApiKey = document.getElementById('api-key-input').value.trim();
    if(!userApiKey) { alert("APIキーが必要です"); document.getElementById('api-settings-wrapper').classList.remove('hidden'); return; }
    const inputEl = document.getElementById('strategy-input'); const input = inputEl.value.trim();
    if(!input) return;
    sendKarteLog('strategy_chat', { message: input });
    saveRequestHabit(input);
    const logEl = document.getElementById('strategy-chat-log');
    logEl.innerHTML += `<div class="self-end bg-indigo-100 text-indigo-900 p-2 md:p-3 rounded-xl md:rounded-2xl rounded-tr-none max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-xs md:text-base">${input}</div>`;
    logEl.scrollTop = logEl.scrollHeight; inputEl.value = "";
    const typingId = "typing-" + Date.now();
    logEl.innerHTML += `<div id="${typingId}" class="self-start bg-white border-2 border-pink-200 text-slate-700 p-2 md:p-3 rounded-xl md:rounded-2xl rounded-tl-none max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-xs md:text-base"><span class="typing">💬 考えてるよ...</span></div>`;
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
        document.getElementById(typingId).outerHTML = `<div class="self-start bg-white border-2 border-pink-200 text-slate-700 p-2 md:p-3 rounded-xl md:rounded-2xl rounded-tl-none max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-xs md:text-base">${replyText}</div>`;
        logEl.scrollTop = logEl.scrollHeight;
        if (jsonMatch) {
            strategyPlan = JSON.parse(jsonMatch[1]);
            document.getElementById('btn-strategy-start').classList.remove('hidden');
        }
    } catch(e) {
        document.getElementById(typingId).outerHTML = `<div class="self-start bg-red-50 text-red-600 p-2 md:p-3 rounded-xl md:rounded-2xl max-w-[85%] md:max-w-[80%] shadow-sm font-bold text-xs md:text-base border border-red-200">⚠️ 通信エラーが発生したみたい。もう一度話しかけてみて！</div>`;
        logEl.scrollTop = logEl.scrollHeight;
    }
}

// 🌟 AIセリフ生成機能（条件分岐完全復元 ＋ 眠気検知統合）
async function generateAiMessage(situation, extraData = {}, isFirst = false, forceSpeak = false) {
    const aiMessageEl = document.getElementById('ai-message');
    if (aiMessageEl) aiMessageEl.innerHTML = '<span class="animate-pulse">💬 考え中...</span>';

    const coachSelect = document.getElementById('condition-select');
    const cond = coachSelect ? coachSelect.value : '普通';
    
    let prompt = `あなたは社労士試験の専属個別指導講師（18歳前後の若い女性）です。受講生のモードは「${cond}」です。
【絶対ルール】
1. セリフ本文のみを1〜2文で出力すること。
2. 定型文は一切使わず、毎回必ず状況に合わせて自分の言葉で考えて生成すること。
3. 決して暴言や高圧的な説教はせず、親しみやすい現代の一般的な若い女性の自然な口語体で話すこと。
4. モード（熱血や厳しめ等）による性格の違いは、不自然な言葉遣い（「～だ」「～しろ」「～だわ」「～よ」「～ぞ」などのアニメ口調）で表現するのではなく、あくまで「話す内容やアプローチの仕方」で表現すること。\n`;

    if (situation === "start_takuitsu") prompt += `択一式の特訓スタート。短く前向きに気合を入れて。`;
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
    else if (situation === "result_sentaku") prompt += `選択式解答完了。5点中${extraData.score}点。点数に応じたコメントと、迷ったところは下のボタンで記録しておいてと促して。`;
    else if (situation === "end_all") prompt += `全問題終了。頑張りを心から労い、次への励ましを。`;
    else if (situation === "nap_start") prompt += `受講生が仮眠・休憩。しっかり休んでね。時間になったら起こすからねと優しく伝えて。`;
    else if (situation === "nap_end") prompt += `休憩終了。すっきりした？さあ、もうひと頑張りいこうと明るく声かけして。`;
    else if (situation === "idle_warn") prompt += `解説画面で受講生が止まっています。「大丈夫？次進めそう？」と優しく催促して。`;
    else if (situation === "idle_penalty") prompt += `さらに放置されたので、目標時間を1分追加します。少しピシッと注意しつつも前向きに励まして。`;
    else if (situation === "idle_care") prompt += `放置されていますが、1時間以上勉強しているので疲れているのかもしれません。「そろそろ集中力切れてきた？無理せず休憩しようか」と優しく注意・提案して。`;
    else if (situation === "ignore_fix") prompt += `AIの修正提案を保留にしました。「印をつけておいたから、後で自分で調べてみてね」と伝えて。`;
    else if (situation === "apply_fix") prompt += `AIの修正提案を採用して問題を修正しました。「修正しておいたよ！次から新しい内容で出題するね」と伝えて。`;
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
    else if (situation === 'wake_up_night') {
        prompt += `夜遅くにユーザーが問題を解く途中で寝落ちしかけて時間切れになりました。少し驚かせるように、かなり強めに目を覚まさせる言葉をかけてください。（例：ちょっと！起きてる！？）`;
    } else if (situation === 'wake_up_day') {
        prompt += `日中ですがユーザーが時間切れになりました。集中力が切れているようなので、気合を入れ直す言葉をかけてください。`;
    } else {
        prompt += `ユーザーを応援してください。`;
    }

    const response = await callGeminiAPI(prompt, "状況を確認してコメントをお願い！");
    
    if (aiMessageEl) {
        aiMessageEl.innerHTML = response;
        if (situation === 'wake_up_day' || situation === 'wake_up_night') {
            aiMessageEl.classList.add('text-red-600', 'font-black');
            setTimeout(() => aiMessageEl.classList.remove('text-red-600', 'font-black'), 5000);
        }
    }
    
    if (!isMuted || forceSpeak) {
        if (situation === 'wake_up_night' && typeof window.speechSynthesis !== 'undefined') {
            let u = new SpeechSynthesisUtterance(response.replace(/[\*\#\`\_]/g, ''));
            u.lang = 'ja-JP'; u.rate = 1.3; u.pitch = 1.5; 
            window.speechSynthesis.speak(u);
        } else {
            speakText(response);
        }
    }
    
    if (isFirst && typeof onAiGreetingStarted === "function") {
        onAiGreetingStarted();
    }
}