// ==========================================
// events.js: ラストスパート＆残業ルーレット管理モジュール
// ==========================================

// 🌟 グローバル変数を定義（未定義エラー回避）
let isOvertimeTriggered = false;

// 🌟 メニューにラストスパートボタンを動的に追加
document.addEventListener("DOMContentLoaded", () => {
    const drillMenu = document.getElementById("infinite-drill-menu");
    if (drillMenu) {
        const spurtBtn = document.createElement("button");
        spurtBtn.id = "btn-ai-spurt-event";
        spurtBtn.className = "w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-2 md:py-3 rounded-xl border border-pink-300 shadow-sm active:scale-95 text-sm md:text-base";
        spurtBtn.innerHTML = "🔥 AIおまかせラストスパート (残り時間用)";
        spurtBtn.onclick = startAiSpurtEvent;
        // ホームに戻るボタンの上に挿入
        drillMenu.insertBefore(spurtBtn, drillMenu.lastElementChild);
    }
    
    // 既存の main.js の挙動を安全にオーバーライドしてルーレットをフックする
    hookPlaylistEnd();
});

// 🌟 プレイリスト完走時の関数を自動で探してフック（上書き）する
function hookPlaylistEnd() {
    // 現在の main.js で終了処理を統括している finishAllPlaylists をフックする
    if (typeof window.finishAllPlaylists === 'function') {
        const original = window.finishAllPlaylists;
        window.finishAllPlaylists = function() {
            checkAndTriggerEvents(original);
        };
    }
}

function checkAndTriggerEvents(originalFunction) {
    // タイマーが0（isTimeUp）で、まだルーレットを回していない場合
    if (typeof isTimeUp !== 'undefined' && isTimeUp && !isOvertimeTriggered) {
        handleOvertimeRouletteEvent();
    } else {
        // 通常のメニュー表示（元の finishAllPlaylists を実行）
        if (originalFunction) originalFunction();
        
        // 🌟 タイマーが15分(900秒)未満ならラストスパートボタンを光らせてアピール
        if (typeof globalTimeLeftSeconds !== 'undefined' && globalTimeLeftSeconds !== null && globalTimeLeftSeconds > 0 && globalTimeLeftSeconds < 900) {
            const spurtBtn = document.getElementById("btn-ai-spurt-event");
            if (spurtBtn) {
                spurtBtn.classList.remove("hidden");
                spurtBtn.classList.add("animate-pulse", "ring-4", "ring-pink-300");
                const aiMessageEl = document.getElementById('ai-message');
                if (aiMessageEl) {
                    aiMessageEl.innerHTML = "目標時間まであと少しね！迷ってるなら『AIおまかせラストスパート』で最後まで絞り取ってあげるわ！🔥";
                    if (typeof speakText === 'function') speakText("目標時間まであと少しね！迷ってるなら、おまかせラストスパートで最後まで絞り取ってあげるわ！");
                }
            }
        }
    }
}

// 🌟 ラストスパート発動処理
function startAiSpurtEvent() {
    if (typeof todayMistakes === 'undefined' || typeof allDatabase === 'undefined') {
        alert("データが見つかりません。");
        return;
    }
    
    const titleEl = document.getElementById('current-playlist-title');
    if (titleEl) titleEl.textContent = `🔥 講師特選ラストスパート！`;
    
    // UIのリセット
    const drillMenu = document.getElementById('infinite-drill-menu');
    if (drillMenu) drillMenu.classList.add('hidden');
    const explanationArea = document.getElementById('explanation-area');
    if (explanationArea) explanationArea.classList.add('hidden');
    const evalArea = document.getElementById('self-eval-area-takuitsu');
    if (evalArea) evalArea.classList.add('hidden');
    
    currentQuestions = [];
    // 今日間違えた問題を優先して最大5問
    if (todayMistakes.length > 0) {
        let mistakes = todayMistakes.sort(() => Math.random() - 0.5).slice(0, 5);
        currentQuestions = currentQuestions.concat(mistakes);
    }
    // 残りを全体からランダム補充
    let remain = 10 - currentQuestions.length;
    if (remain > 0) {
        let randoms = allDatabase.sort(() => Math.random() - 0.5).slice(0, remain);
        currentQuestions = currentQuestions.concat(randoms);
    }

    playlistQueue = [{ subjectName: "全科目", chapterName: "AI特選ラストスパート", questions: currentQuestions }];
    currentPlaylistIndex = 0;
    currentIndex = 0;
    
    if (typeof loadQuestion === 'function') {
        loadQuestion(false);
    } else if (typeof loadTakuitsuQuestion === 'function') {
        loadTakuitsuQuestion();
    }
}

// 🌟 残業ルーレット発動処理
function handleOvertimeRouletteEvent() {
    isOvertimeTriggered = true; 
    const roll = Math.floor(Math.random() * 10) + 1; 
    let cond = '普通';
    if (typeof getEffectiveCondition === 'function') {
        cond = getEffectiveCondition();
    }

    const aiBox = document.getElementById('ai-message-box');
    if (aiBox) aiBox.className = "bg-red-100 rounded-2xl md:rounded-3xl rounded-tl-none p-2 md:p-4 shadow-sm border-2 border-red-300 relative";
    
    const surrenderBtn = document.getElementById('btn-surrender');
    if (surrenderBtn) surrenderBtn.classList.remove('hidden');
    
    const drillMenu = document.getElementById('infinite-drill-menu');
    if (drillMenu) drillMenu.classList.add('hidden');

    if (cond === 'Sっ気') {
        if (roll <= 6) { 
            if (typeof generateAiMessage === 'function') generateAiMessage("roulette_s_10");
            setRouletteQuestionsEvent(allDatabase, 10);
        } else if (roll <= 9) { 
            if (typeof generateAiMessage === 'function') generateAiMessage("roulette_s_end");
            setTimeout(() => { alert("今日はここまで。よく頑張りましたね。"); location.reload(); }, 5000);
        } else { 
            isSuddenDeath = true;
            if (typeof generateAiMessage === 'function') generateAiMessage("roulette_s_20");
            setRouletteQuestionsEvent(allDatabase, 20);
        }
    } else if (cond === '熱血') {
        if (roll <= 3) { 
            if (typeof generateAiMessage === 'function') generateAiMessage("roulette_n_random");
            setRouletteQuestionsEvent(allDatabase, 10);
        } else if (roll <= 6) { 
            if (typeof generateAiMessage === 'function') generateAiMessage("roulette_n_mistake");
            setRouletteQuestionsEvent(todayMistakes.length > 0 ? todayMistakes : allDatabase, 10);
        } else if (roll <= 9) { 
            if (typeof generateAiMessage === 'function') generateAiMessage("roulette_n_weak");
            setRouletteQuestionsEvent(allDatabase, 10);
        } else { 
            if (typeof generateAiMessage === 'function') generateAiMessage("roulette_n_end");
            setTimeout(() => { alert("今日の特訓は終了！よくやり切ったぞ！"); location.reload(); }, 5000);
        }
    } else {
        alert("目標時間が終了しました。今日の学習はここまでです！お疲れ様でした！");
        location.reload();
    }
}

function setRouletteQuestionsEvent(pool, count) {
    if (!pool || pool.length === 0) return;
    let extra = pool.sort(() => Math.random() - 0.5).slice(0, count);
    playlistQueue = [{ subjectName: "残業ルーレット", chapterName: "特別課題", questions: extra }];
    currentPlaylistIndex = 0;
    currentQuestions = extra;
    currentIndex = 0;
    
    const explanationArea = document.getElementById('explanation-area');
    if (explanationArea) explanationArea.classList.add('hidden');
    const evalArea = document.getElementById('self-eval-area-takuitsu');
    if (evalArea) evalArea.classList.add('hidden');

    if (typeof loadQuestion === 'function') {
        loadQuestion(false);
    } else if (typeof loadTakuitsuQuestion === 'function') {
        loadTakuitsuQuestion();
    }
}