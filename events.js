// ==========================================
// events.js: AIおまかせラストスパート管理モジュール
// ==========================================

// 🌟 メニューにラストスパートボタンを動的に追加
document.addEventListener("DOMContentLoaded", () => {
    const drillMenu = document.getElementById("infinite-drill-menu");
    if (drillMenu && !document.getElementById("btn-ai-spurt-event")) {
        const spurtBtn = document.createElement("button");
        spurtBtn.id = "btn-ai-spurt-event";
        spurtBtn.className = "w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-2 md:py-3 rounded-xl border border-pink-300 shadow-sm active:scale-95 text-sm md:text-base";
        spurtBtn.innerHTML = "🔥 AIおまかせラストスパート (残り時間用)";
        spurtBtn.onclick = startAiSpurtEvent;
        // ホームに戻るボタンの上に挿入
        drillMenu.insertBefore(spurtBtn, drillMenu.lastElementChild);
    }

    hookPlaylistEnd();
});

// 🌟 プレイリスト完走時の finishAllPlaylists を安全にフックする
function hookPlaylistEnd() {
    if (typeof window.finishAllPlaylists === 'function') {
        const original = window.finishAllPlaylists;
        window.finishAllPlaylists = function() {
            checkAndTriggerEvents(original);
        };
    }
}

function checkAndTriggerEvents(originalFunction) {
    const spurtBtn = document.getElementById("btn-ai-spurt-event");
    if (spurtBtn) {
        spurtBtn.classList.remove("animate-pulse", "ring-4", "ring-pink-300");
    }

    // 目標時間の残り時間が0秒より大きく15分(900秒)未満（通常セット終了時）ならボタンを強調してAIから提案
    const isSpurtTiming = (
        typeof globalTimeLeftSeconds !== 'undefined' &&
        globalTimeLeftSeconds !== null &&
        globalTimeLeftSeconds > 0 &&
        globalTimeLeftSeconds < 900 &&
        !isSenbonKnock && !isTimeAttack && !isBonusMode &&
        !isSuddenDeath && !isCountdownRelay && !isTrapMode &&
        !isHardcore && !isSurpriseAttack
    );

    if (isSpurtTiming && typeof window.generateAiMessage === 'function') {
        // 終了時コメントと二重通信にならないよう end_all 呼び出しを1回だけ置き換える
        const origGenAi = window.generateAiMessage;
        window.generateAiMessage = function(situation, extraData, isStartScreen) {
            window.generateAiMessage = origGenAi;
            if (situation === "end_all") {
                if (spurtBtn) {
                    spurtBtn.classList.remove("hidden");
                    spurtBtn.classList.add("animate-pulse", "ring-4", "ring-pink-300");
                }
                const remainMin = Math.max(1, Math.ceil(globalTimeLeftSeconds / 60));
                const mCount = (typeof todayMistakes !== 'undefined' && Array.isArray(todayMistakes)) ? todayMistakes.length : 0;
                generateSpurtAiComment("recommend", { remainMin: remainMin, mistakesCount: mCount });
                return;
            }
            return origGenAi(situation, extraData, isStartScreen);
        };
        try {
            if (originalFunction) originalFunction();
        } finally {
            window.generateAiMessage = origGenAi;
        }
    } else {
        if (originalFunction) originalFunction();
    }
}

// 🌟 ラストスパート発動処理（今日間違えた問題最大5問＋ランダム補充で計10問）
function startAiSpurtEvent() {
    if (typeof allDatabase === 'undefined' || allDatabase.length === 0) {
        if (typeof setAiBubbleVisible === "function") setAiBubbleVisible(true);
        const aiMessageEl = document.getElementById('ai-message');
        if (aiMessageEl) aiMessageEl.textContent = "問題データを読み込み中だから、もう少しだけ待っててね。";
        return;
    }

    if (typeof stopAudio === "function") stopAudio();
    if (typeof flushStudyTimes === "function") flushStudyTimes();
    if (typeof resetGameFlags === "function") resetGameFlags();

    let spurtQuestions = [];

    // 今日間違えた問題を優先して最大5問（重複除外・元の配列を壊さない非破壊シャッフル）
    if (typeof todayMistakes !== 'undefined' && Array.isArray(todayMistakes) && todayMistakes.length > 0) {
        const uniqueMistakes = [];
        const seenIds = new Set();
        todayMistakes.forEach(q => {
            if (q && q._id && !seenIds.has(q._id)) {
                seenIds.add(q._id);
                uniqueMistakes.push(q);
            }
        });
        const pickedMistakes = [...uniqueMistakes].sort(() => Math.random() - 0.5).slice(0, 5);
        spurtQuestions = spurtQuestions.concat(pickedMistakes);
    }

    // 残りを全体からランダム補充（非破壊・すでに選んだ問題は除外）
    const remain = 10 - spurtQuestions.length;
    if (remain > 0) {
        const pickedIds = new Set(spurtQuestions.map(q => q._id));
        const pool = allDatabase.filter(q => q && !pickedIds.has(q._id));
        const randoms = [...pool].sort(() => Math.random() - 0.5).slice(0, remain);
        spurtQuestions = spurtQuestions.concat(randoms);
    }

    if (spurtQuestions.length === 0) return;

    currentQuestions = spurtQuestions;
    playlistQueue = [{
        subjectName: "全科目",
        chapterName: "AI特選ラストスパート",
        type: currentQuestions[0]._type,
        questions: currentQuestions
    }];
    currentPlaylistIndex = 0;
    currentIndex = 0;

    const titleEl = document.getElementById('current-playlist-title');
    if (titleEl) titleEl.textContent = `🔥 講師特選ラストスパート！`;

    const drillMenu = document.getElementById('infinite-drill-menu');
    if (drillMenu) { drillMenu.classList.add('hidden'); drillMenu.classList.remove('flex'); }
    const explanationArea = document.getElementById('explanation-area');
    if (explanationArea) { explanationArea.classList.add('hidden'); explanationArea.classList.remove('flex'); }
    const evalArea = document.getElementById('self-eval-area-takuitsu');
    if (evalArea) { evalArea.classList.add('hidden'); evalArea.classList.remove('block', '!block'); }

    if (typeof sendKarteLog === "function") {
        sendKarteLog('spurt_start', { count: currentQuestions.length });
    }

    if (typeof loadQuestion === 'function') {
        loadQuestion(false, false, false);
    }

    generateSpurtAiComment("start", { total: currentQuestions.length });
}

// 🌟 ラストスパート専用のAI声かけ（思考ゼロ thinkingBudget: 0・定型文排除・ペルソナ＆4科目制限厳守）
async function generateSpurtAiComment(mode, extra = {}) {
    if (typeof setAiBubbleVisible === "function") setAiBubbleVisible(true);
    const aiMessageEl = document.getElementById('ai-message');
    if (aiMessageEl) aiMessageEl.innerHTML = '<span class="typing">💬 ...</span>';

    const condEl = document.getElementById('condition-select');
    const cond = condEl ? condEl.value : '普通';
    const healthEl = document.getElementById('health-select');
    const health = healthEl ? healthEl.value : '普通';

    let prompt = `あなたは社労士試験の専属個別指導講師（18歳前後の若い女性）です。受講生のモードは「${cond}」、体調は「${health}」です。
【絶対ルール】
1. セリフ本文のみを1〜2文で出力すること。
2. 定型文は一切使わず、毎回必ず状況に合わせて自分の言葉で考えて生成すること。
3. 決して暴言や高圧的な説教はせず、親しみやすい現代の一般的な若い女性の自然な口語体で話すこと。
4. 「〜だぞ」「〜だろ」「〜わ」「〜よ」「ふふっ」「〜かしら」等の不自然な役割語やアニメ口調は絶対に使用しないこと。
5. 受講生は「労働基準法」「安全衛生法」「健康保険法」「厚生年金保険法」の4科目以外は免除されています。この4科目以外について学習を促す発言や提案は絶対にしないでください。\n`;

    if (mode === "recommend") {
        prompt += `1セット完走しました。目標時間まで残り約${extra.remainMin}分です。頑張りを労いつつ、次で迷ったら『AIおまかせラストスパート』ボタンで今日のミス復習も含めた総仕上げができると前向きに案内して。`;
    } else {
        prompt += `『AIおまかせラストスパート』（今日の間違い復習＋ランダムの計${extra.total || 10}問）を開始します。最後まで集中して駆け抜けられるよう短く前向きに気合を入れて。`;
    }

    try {
        const modelName = (typeof userModel === 'string' && userModel) ? userModel : 'gemini-2.5-flash';
        const bodyStr = (typeof buildGeminiPayload === 'function')
            ? buildGeminiPayload([{ parts: [{ text: prompt }] }], 0)
            : JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { thinkingConfig: { thinkingBudget: 0 } }
            });

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${userApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: bodyStr
        });
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        const text = data.candidates[0].content.parts[0].text.trim();
        if (aiMessageEl) aiMessageEl.textContent = text;
        if (typeof speakText === "function") speakText(text);
    } catch (e) {
        const fallback = (mode === "recommend")
            ? "セット完了お疲れさま！目標時間まであと少しだから、迷ったら『AIおまかせラストスパート』で総仕上げしてみてね！"
            : "ここまでのミスも含めた特別メニューでいくね！最後まで集中して駆け抜けよう！";
        if (aiMessageEl) aiMessageEl.textContent = fallback;
        if (typeof speakText === "function") speakText(fallback);
    }
}