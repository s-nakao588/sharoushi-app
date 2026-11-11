/* =========================================================
   📓 マイノート・フリーノート管理モジュール
   ========================================================= */

// モーダルや情報の初期化用変数
let currentNotebookId = null;
let currentNotebookImageBase64 = null;
let isFreeNoteMode = false;
let activeFreeNoteMap = {}; // 🌟 追加：確実に動的に取得するための変数

// 🌟 メニュー画面からの「新規フリーノート作成」用
function openNewFreeNotebook() {
    isFreeNoteMode = true;
    currentNotebookId = "freenote_" + Date.now(); 
    currentNotebookImageBase64 = null;

    // UIの表示切り替え（フリー用ドロップダウン表示、問題文エリア非表示）
    document.getElementById('nb-free-select-area').classList.remove('hidden');
    document.getElementById('nb-free-select-area').classList.add('flex');
    document.getElementById('nb-question-info-area').classList.add('hidden');
    document.getElementById('nb-question-info-area').classList.remove('flex');
    document.getElementById('btn-delete-nb').classList.add('hidden');
    document.getElementById('nb-modal-subtitle').textContent = "フリーノート";

    // 🌟 確実にするため、クリック時に毎回 allDatabase から動的生成する
    activeFreeNoteMap = {};
    if (typeof allDatabase !== "undefined" && allDatabase.length > 0) {
        allDatabase.forEach(q => {
            let baseSubj = q._subjectName.replace(/\(択一\)|\(選択\)/g, ""); // "(択一)"等を除去
            if (!activeFreeNoteMap[baseSubj]) activeFreeNoteMap[baseSubj] = new Set();
            activeFreeNoteMap[baseSubj].add(q.項目 || "分類なし");
        });
    } else if (typeof freeNoteSubjectMap !== "undefined") {
        // 万が一の予備フォールバック
        activeFreeNoteMap = freeNoteSubjectMap;
    }

    // 科目ドロップダウンの生成
    const subjSelect = document.getElementById('nb-free-subject-select');
    subjSelect.innerHTML = "";
    
    const subjects = Object.keys(activeFreeNoteMap);
    if (subjects.length === 0) {
        subjSelect.innerHTML = '<option value="">(データ読み込み中またはデータなし)</option>';
    } else {
        subjects.forEach(subj => {
            let opt = document.createElement('option');
            opt.value = subj; opt.textContent = subj;
            subjSelect.appendChild(opt);
        });
    }
    
    updateFreeNoteChapterSelect(); // 連動して項目を更新

    // リッチテキストエリアと画像エリアの初期化
    document.getElementById('nb-note-input').innerHTML = "";
    document.getElementById('nb-image-input').value = "";
    document.getElementById('nb-image-preview-box').classList.add('hidden');
    document.getElementById('nb-image-preview').src = "";

    document.getElementById('notebook-modal').classList.remove('hidden');
    document.getElementById('notebook-modal').classList.add('flex');
    initColorPicker(); // 🌟 カラーピッカーの初期化
}

// 🌟 フリーノートの「科目」が変更された時に「項目」ドロップダウンを更新
function updateFreeNoteChapterSelect() {
    const subj = document.getElementById('nb-free-subject-select').value;
    const chapSelect = document.getElementById('nb-free-chapter-select');
    chapSelect.innerHTML = "";
    
    if(subj && activeFreeNoteMap[subj]) {
        Array.from(activeFreeNoteMap[subj]).forEach(chap => {
            let opt = document.createElement('option');
            opt.value = chap; opt.textContent = chap;
            chapSelect.appendChild(opt);
        });
    } else {
        chapSelect.innerHTML = '<option value="">(選択不可)</option>';
    }
}

// 🌟 通常の「問題に紐づくマイノート」を開く処理
function openNotebookForCurrentQuestion() {
    isFreeNoteMode = false;
    const q = currentQuestions[currentIndex];
    if (!q) return;

    currentNotebookId = q._id;
    currentNotebookImageBase64 = null;

    // UIの表示切り替え（問題文エリア表示、フリー用非表示）
    document.getElementById('nb-free-select-area').classList.add('hidden');
    document.getElementById('nb-free-select-area').classList.remove('flex');
    document.getElementById('nb-question-info-area').classList.remove('hidden');
    document.getElementById('nb-question-info-area').classList.add('flex');
    document.getElementById('nb-modal-subtitle').textContent = "個別メモ";

    document.getElementById('nb-badge-subject').textContent = q._subjectName;
    document.getElementById('nb-badge-chapter').textContent = q.項目 || "分類なし";
    document.getElementById('nb-problem-text').innerHTML = (q.問題文 || "").replace(/\n/g, '<br>');
    
    if (q._type === '択一') {
        document.getElementById('nb-answer-text').textContent = (q.正誤 || "").trim() === '〇' ? '〇 正しい' : '✖ 誤り';
    } else {
        document.getElementById('nb-answer-text').innerHTML = `A:${q.正解A} B:${q.正解B}<br>C:${q.正解C} D:${q.正解D} E:${q.正解E}`;
    }

    document.getElementById('nb-article-text').textContent = (q.根拠条文 || "").trim() || "条文なし";
    document.getElementById('nb-explanation-text').innerHTML = (q.解説 || "").trim() || "解説なし";

    // 保存されているノートデータの復元
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    const existingNote = storedNotes[currentNotebookId];

    const inputArea = document.getElementById('nb-note-input');
    const deleteBtn = document.getElementById('btn-delete-nb');
    
    if (existingNote) {
        inputArea.innerHTML = existingNote.text || ""; // 🌟 innerHTMLでリッチテキスト復元
        deleteBtn.classList.remove('hidden');
        if (existingNote.image) {
            currentNotebookImageBase64 = existingNote.image;
            document.getElementById('nb-image-preview').src = currentNotebookImageBase64;
            document.getElementById('nb-image-preview-box').classList.remove('hidden');
        } else {
            document.getElementById('nb-image-preview-box').classList.add('hidden');
        }
    } else {
        inputArea.innerHTML = "";
        deleteBtn.classList.add('hidden');
        document.getElementById('nb-image-preview-box').classList.add('hidden');
    }
    
    document.getElementById('nb-image-input').value = "";
    document.getElementById('notebook-modal').classList.remove('hidden');
    document.getElementById('notebook-modal').classList.add('flex');
    initColorPicker(); // 🌟 カラーピッカーの初期化
}

// 🌟 リッチテキストの書式適用関数
function formatNotebookText(command) {
    if (command === 'removeFormat') {
        document.execCommand('removeFormat', false, null);
    } else {
        document.execCommand(command, false, null);
    }
    document.getElementById('nb-note-input').focus();
}

// 🌟 カラーピッカーの操作性改善（色を選んだ瞬間に自動反映してフォーカスを戻す）
function initColorPicker() {
    const colorPicker = document.getElementById('nb-color-picker');
    const noteInput = document.getElementById('nb-note-input');
    
    // 以前のイベントリスナーが重複しないように一度削除してから登録
    colorPicker.replaceWith(colorPicker.cloneNode(true));
    const newColorPicker = document.getElementById('nb-color-picker');
    
    newColorPicker.addEventListener('change', function(e) {
        // 色を選んだ瞬間にフォーカスを戻して色を適用
        noteInput.focus();
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('foreColor', false, e.target.value);
    });
}

function handleNotebookImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { 
        alert("ファイルサイズが大きすぎます。2MB以下の画像を選択してください。");
        event.target.value = ""; return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200; const MAX_HEIGHT = 1200;
            let width = img.width; let height = img.height;
            if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } 
            else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
            
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            currentNotebookImageBase64 = canvas.toDataURL('image/jpeg', 0.6);
            document.getElementById('nb-image-preview').src = currentNotebookImageBase64;
            document.getElementById('nb-image-preview-box').classList.remove('hidden');
            // 画像追加時にもスクロールを下に移動
            const infoArea = document.querySelector('#notebook-modal .overflow-y-auto');
            if(infoArea) infoArea.scrollTop = infoArea.scrollHeight;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function removeNotebookImage() {
    currentNotebookImageBase64 = null;
    document.getElementById('nb-image-input').value = "";
    document.getElementById('nb-image-preview-box').classList.add('hidden');
    document.getElementById('nb-image-preview').src = "";
}

function saveNotebookEntry() {
    // 🌟 プレーンテキストではなく innerHTML で保存
    const noteHtml = document.getElementById('nb-note-input').innerHTML.trim();
    if (!noteHtml && !currentNotebookImageBase64) {
        alert("メモを入力するか、画像を添付してください。");
        return;
    }

    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    
    // 🌟 フリーノートモードか通常モードかで保存するメタデータを変える
    if (isFreeNoteMode) {
        const subj = document.getElementById('nb-free-subject-select').value;
        const chap = document.getElementById('nb-free-chapter-select').value;
        storedNotes[currentNotebookId] = {
            id: currentNotebookId,
            type: "フリーノート",
            subjectName: subj,
            chapterName: chap,
            text: noteHtml, // HTMLを保存
            image: currentNotebookImageBase64,
            timestamp: new Date().toISOString()
        };
    } else {
        const q = currentQuestions[currentIndex];
        storedNotes[currentNotebookId] = {
            id: currentNotebookId,
            type: q._type,
            subjectName: q._subjectName,
            chapterName: q.項目 || "分類なし",
            problemText: q.問題文,
            explanationText: q.解説,
            text: noteHtml, // HTMLを保存
            image: currentNotebookImageBase64,
            timestamp: new Date().toISOString()
        };
    }

    try {
        localStorage.setItem('user_notebooks', JSON.stringify(storedNotes));
        closeNotebookModal();
        if (typeof updateNotebookButtonDisplay === "function" && !isFreeNoteMode) updateNotebookButtonDisplay(currentNotebookId);
        if (typeof updateStartScreenNotebookBadge === "function") updateStartScreenNotebookBadge();
        if (typeof generateAiMessage === "function") generateAiMessage("notebook_saved", { textOnly: true });
    } catch (e) {
        alert("保存容量の上限に達しました。不要な画像付きのノートを削除してください。");
    }
}

function deleteCurrentNotebookEntry() {
    if(!confirm("このノートを完全に削除しますか？")) return;
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    if(storedNotes[currentNotebookId]) {
        delete storedNotes[currentNotebookId];
        localStorage.setItem('user_notebooks', JSON.stringify(storedNotes));
    }
    closeNotebookModal();
    if (typeof updateNotebookButtonDisplay === "function" && !isFreeNoteMode) updateNotebookButtonDisplay(currentNotebookId);
    if (typeof updateStartScreenNotebookBadge === "function") updateStartScreenNotebookBadge();
}

function closeNotebookModal() {
    document.getElementById('notebook-modal').classList.add('hidden');
    document.getElementById('notebook-modal').classList.remove('flex');
}

function updateNotebookButtonDisplay(q_id) {
    const btnText = document.getElementById('btn-nb-text');
    const btn = document.getElementById('btn-open-notebook');
    if(!btnText || !btn) return;
    
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    if (storedNotes[q_id]) {
        btnText.textContent = "保存済みのマイノートを見る / 編集";
        btn.classList.remove('from-amber-400', 'to-amber-500', 'border-amber-300', 'text-amber-950');
        btn.classList.add('from-indigo-100', 'to-indigo-200', 'border-indigo-300', 'text-indigo-900');
    } else {
        btnText.textContent = "マイノートにメモ・スクショを追加";
        btn.classList.remove('from-indigo-100', 'to-indigo-200', 'border-indigo-300', 'text-indigo-900');
        btn.classList.add('from-amber-400', 'to-amber-500', 'border-amber-300', 'text-amber-950');
    }
}

function updateStartScreenNotebookBadge() {
    const badge = document.getElementById('start-nb-count-badge');
    const nbListCount = document.getElementById('nb-list-count');
    if(!badge) return;
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    const count = Object.keys(storedNotes).length;
    badge.textContent = count;
    if(nbListCount) nbListCount.textContent = count + "件";
}

function openNotebookListModal() {
    const container = document.getElementById('nb-list-container');
    container.innerHTML = "";
    
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    const notesArray = Object.values(storedNotes);
    
    if (notesArray.length === 0) {
        container.innerHTML = `<div class="text-center p-10 text-slate-400 font-bold">まだ保存されたノートはありません。<br>解説画面の「マイノートに追加」や「新規フリーノート作成」から作ってみましょう！</div>`;
    } else {
        // 科目 > 項目 の順にグループ化して表示
        const grouped = {};
        notesArray.forEach(n => {
            const subj = n.subjectName || "その他";
            const chap = n.chapterName || "分類なし";
            if (!grouped[subj]) grouped[subj] = {};
            if (!grouped[subj][chap]) grouped[subj][chap] = [];
            grouped[subj][chap].push(n);
        });
        
        let html = "";
        for (let subj in grouped) {
            html += `<h4 class="text-lg md:text-xl font-black text-white bg-indigo-800 px-4 py-2 rounded-xl mt-4 shadow-sm">${subj}</h4>`;
            for (let chap in grouped[subj]) {
                html += `<div class="ml-2 md:ml-4 mt-3 border-l-4 border-indigo-200 pl-3 md:pl-4 flex flex-col gap-3">`;
                html += `<h5 class="text-sm md:text-lg font-bold text-slate-700">${chap}</h5>`;
                
                grouped[subj][chap].forEach(note => {
                    const date = new Date(note.timestamp).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    // フリーノート判定フラグ
                    const isFree = (note.type === "フリーノート");
                    const typeBadge = isFree ? 
                        `<span class="bg-amber-100 text-amber-800 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded border border-amber-300">フリーノート</span>` :
                        `<span class="bg-pink-100 text-pink-800 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded border border-pink-300">問題連携 (${note.type})</span>`;
                    
                    html += `
                        <div class="bg-white p-3 md:p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
                            <button onclick="deleteNoteFromList('${note.id}')" class="absolute top-3 right-3 text-slate-300 hover:text-red-500 font-bold p-1 transition-colors" title="削除">✕</button>
                            <div class="flex items-center gap-2 mb-2">
                                ${typeBadge}
                                <span class="text-[10px] md:text-xs text-slate-400 font-bold">${date}</span>
                            </div>`;
                            
                    if (!isFree && note.problemText) {
                        html += `<p class="text-xs md:text-sm text-slate-500 font-medium mb-3 line-clamp-2 italic border-l-2 border-slate-200 pl-2">${note.problemText}</p>`;
                    }
                    
                    if (note.text) {
                        // 🌟 保存されたHTML(装飾付きテキスト)をそのまま流し込む
                        html += `<div class="text-sm md:text-base text-slate-800 font-medium leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100 mb-3">${note.text}</div>`;
                    }
                    if (note.image) {
                        html += `<img src="${note.image}" class="max-h-48 md:max-h-64 rounded-lg object-contain shadow-sm border border-slate-200 cursor-pointer" onclick="window.open('${note.image}', '_blank')">`;
                    }
                    html += `</div>`;
                });
                html += `</div>`;
            }
        }
        container.innerHTML = html;
    }
    
    document.getElementById('notebook-list-modal').classList.remove('hidden');
    document.getElementById('notebook-list-modal').classList.add('flex');
}

function closeNotebookListModal() {
    document.getElementById('notebook-list-modal').classList.add('hidden');
    document.getElementById('notebook-list-modal').classList.remove('flex');
}

function deleteNoteFromList(noteId) {
    if(!confirm("このノートを削除しますか？")) return;
    const storedNotes = JSON.parse(localStorage.getItem('user_notebooks') || '{}');
    if(storedNotes[noteId]) {
        delete storedNotes[noteId];
        localStorage.setItem('user_notebooks', JSON.stringify(storedNotes));
    }
    updateStartScreenNotebookBadge();
    openNotebookListModal(); 
}