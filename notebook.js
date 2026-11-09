/* =========================================================
   📓 マイノート機能 (LocalStorage駆動 / 問題・正解・解説の表示 / グループ化表示)
   ========================================================= */

function getNotebookData() {
    return JSON.parse(localStorage.getItem('sharoushi_notebooks') || '{}');
}

function saveNotebookData(data) {
    try {
        localStorage.setItem('sharoushi_notebooks', JSON.stringify(data));
        updateStartScreenNotebookBadge();
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert("⚠️ 保存容量の限界（約5MB）に達しました！不要なノート（特に画像付きのもの）を削除してから再度お試しください。");
        }
    }
}

function updateStartScreenNotebookBadge() {
    const data = getNotebookData();
    const count = Object.keys(data).length;
    const badge = document.getElementById('start-nb-count-badge');
    if (badge) badge.textContent = count;
}

function updateNotebookButtonDisplay(q_id) {
    const data = getNotebookData();
    const btn = document.getElementById('btn-open-notebook');
    const btnText = document.getElementById('btn-nb-text');
    if (!btn || !btnText) return;

    if (data[q_id]) {
        btnText.textContent = "📓 マイノートを確認・編集（登録済）";
        btn.classList.add('ring-2', 'ring-amber-500', 'bg-amber-300');
    } else {
        btnText.textContent = "📓 マイノートにメモ・スクショを追加";
        btn.classList.remove('ring-2', 'ring-amber-500', 'bg-amber-300');
    }
}

function openNotebookForCurrentQuestion() {
    const q = currentQuestions[currentIndex];
    if (!q) return;
    openNotebookModal(q);
}

function openNotebookModal(q) {
    activeNotebookQId = q._id;
    const data = getNotebookData();
    const existing = data[q._id] || null;

    document.getElementById('nb-badge-subject').textContent = q._subjectName || "社労士";
    document.getElementById('nb-badge-chapter').textContent = q.項目 || "項目";
    document.getElementById('nb-problem-text').innerHTML = (q.問題文 || "").replace(/\n/g, '<br>');
    
    // 🌟 空欄対策：CSVデータが空の場合は安全に代替テキストを表示
    document.getElementById('nb-article-text').textContent = (q.根拠条文 || "").trim() || "（条文データなし）";
    document.getElementById('nb-explanation-text').innerHTML = (q.解説 || "").trim() || "（解説データなし）";
    
    // 🌟 空欄対策：正解テキストの生成と安全表示
    let ansText = "";
    if (q._type === '択一') {
        ansText = (q.正誤 || "").trim() || "（正解データなし）";
    } else if (q._type === '選択') {
        ansText = `【A】${q.正解A || "-"} 【B】${q.正解B || "-"} 【C】${q.正解C || "-"} 【D】${q.正解D || "-"} 【E】${q.正解E || "-"}`;
    } else {
        ansText = existing ? existing.correctAnswer : "（正解データなし）";
    }
    document.getElementById('nb-answer-text').textContent = ansText;
    
    const noteInput = document.getElementById('nb-note-input');
    const deleteBtn = document.getElementById('btn-delete-nb');
    const previewBox = document.getElementById('nb-image-preview-box');
    const previewImg = document.getElementById('nb-image-preview');
    const fileInput = document.getElementById('nb-image-input');
    if (fileInput) fileInput.value = "";

    if (existing) {
        document.getElementById('nb-modal-subtitle').textContent = "登録済みノート";
        noteInput.value = existing.note || "";
        activeNotebookImageBase64 = existing.image || null;
        if (existing.image) {
            previewImg.src = existing.image;
            previewBox.classList.remove('hidden');
        } else {
            previewBox.classList.add('hidden');
        }
        deleteBtn.classList.remove('hidden');
    } else {
        document.getElementById('nb-modal-subtitle').textContent = "新規作成";
        noteInput.value = "";
        activeNotebookImageBase64 = null;
        previewBox.classList.add('hidden');
        deleteBtn.classList.add('hidden');
    }

    const modal = document.getElementById('notebook-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeNotebookModal() {
    const modal = document.getElementById('notebook-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    activeNotebookQId = null;
    activeNotebookImageBase64 = null;
    if (currentQuestions[currentIndex]) {
        updateNotebookButtonDisplay(currentQuestions[currentIndex]._id);
    }
}

function handleNotebookImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert("画像サイズが大きすぎます。容量制限（5MB）を節約するため、2MB以下の画像を選択するか、少し画質を落としてください。");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        activeNotebookImageBase64 = e.target.result;
        const previewBox = document.getElementById('nb-image-preview-box');
        const previewImg = document.getElementById('nb-image-preview');
        previewImg.src = activeNotebookImageBase64;
        previewBox.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function removeNotebookImage() {
    activeNotebookImageBase64 = null;
    const previewBox = document.getElementById('nb-image-preview-box');
    const fileInput = document.getElementById('nb-image-input');
    if (previewBox) previewBox.classList.add('hidden');
    if (fileInput) fileInput.value = "";
}

function saveNotebookEntry() {
    if (!activeNotebookQId) return;
    const note = document.getElementById('nb-note-input').value.trim();

    if (!note && !activeNotebookImageBase64) {
        alert("メモを入力するか、画像を添付してください。");
        return;
    }

    const q = allDatabase.find(item => item._id === activeNotebookQId) || currentQuestions[currentIndex];
    
    let ansText = "";
    if (q._type === '択一') {
        ansText = (q.正誤 || "").trim() || "（正解データなし）";
    } else if (q._type === '選択') {
        ansText = `A:${q.正解A} B:${q.正解B} C:${q.正解C} D:${q.正解D} E:${q.正解E}`;
    }

    const data = getNotebookData();
    data[activeNotebookQId] = {
        q_id: activeNotebookQId,
        type: q?._type || "不明",
        subject: q?._subjectName || "社労士",
        chapter: q?.項目 || "一般",
        questionText: q?.問題文 || "",
        correctAnswer: ansText,
        officialExplanation: q?.解説 || "",
        article: q?.根拠条文 || "",
        note: note,
        image: activeNotebookImageBase64,
        updatedAt: new Date().toLocaleDateString('ja-JP')
    };

    saveNotebookData(data);
    closeNotebookModal();
    
    if (!document.getElementById('notebook-list-modal').classList.contains('hidden')) {
        openNotebookListModal();
    }
}

function deleteCurrentNotebookEntry() {
    if (!activeNotebookQId) return;
    if (confirm("この問題のマイノートを完全に削除しますか？")) {
        const data = getNotebookData();
        delete data[activeNotebookQId];
        saveNotebookData(data);
        closeNotebookModal();
        if (!document.getElementById('notebook-list-modal').classList.contains('hidden')) {
            openNotebookListModal();
        }
    }
}

function openNotebookListModal() {
    const data = getNotebookData();
    const listContainer = document.getElementById('nb-list-container');
    const countBadge = document.getElementById('nb-list-count');
    const keys = Object.keys(data);
    countBadge.textContent = `${keys.length}件`;
    listContainer.innerHTML = "";

    if (keys.length === 0) {
        listContainer.innerHTML = `
            <div class="p-8 text-center text-slate-400 font-bold mt-10">
                <span class="text-6xl block mb-4">📓</span>
                まだマイノートが登録されていません。<br><br>
                特訓で問題を解いた後の解説画面から、気になる問題やテキストのスクショを保存してみましょう！
            </div>`;
    } else {
        // 🌟 科目ごと ➡ 項目順 にソートする処理
        const entries = keys.map(k => data[k]);
        entries.sort((a, b) => {
            if (a.subject !== b.subject) return a.subject.localeCompare(b.subject, 'ja');
            if (a.chapter !== b.chapter) return a.chapter.localeCompare(b.chapter, 'ja');
            return 0;
        });

        let currentSubject = "";
        let currentChapter = "";

        entries.forEach(item => {
            if (item.subject !== currentSubject) {
                currentSubject = item.subject;
                currentChapter = ""; 
                const subjHeader = document.createElement('h4');
                subjHeader.className = "text-xl md:text-2xl font-black text-indigo-800 mt-6 mb-2 border-b-4 border-indigo-200 pb-1 flex items-center gap-2";
                subjHeader.innerHTML = `<span>📘</span> ${currentSubject}`;
                listContainer.appendChild(subjHeader);
            }
            
            if (item.chapter !== currentChapter) {
                currentChapter = item.chapter;
                const chapHeader = document.createElement('h5');
                chapHeader.className = "text-sm md:text-lg font-bold text-slate-700 mt-3 mb-2 ml-1 md:ml-3 border-l-4 border-amber-400 pl-2";
                chapHeader.textContent = currentChapter;
                listContainer.appendChild(chapHeader);
            }

            const hasImgBadge = item.image ? '<span class="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm">📸 画像あり</span>' : '';
            const card = document.createElement('div');
            card.className = "bg-white border-2 border-slate-200 hover:border-amber-400 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-2.5 cursor-pointer ml-2 md:ml-6";
            
            card.onclick = () => {
                const targetQ = allDatabase.find(q => q._id === item.q_id) || {
                    _id: item.q_id,
                    _type: item.type,
                    _subjectName: item.subject,
                    項目: item.chapter,
                    問題文: item.questionText,
                    解説: item.officialExplanation,
                    根拠条文: item.article
                };
                closeNotebookListModal();
                openNotebookModal(targetQ);
            };

            card.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <div class="flex items-center gap-2">
                        <span class="bg-slate-200 text-slate-600 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded">${item.type}</span>
                        ${hasImgBadge}
                    </div>
                    <span class="text-[10px] md:text-xs text-slate-400 font-bold">${item.updatedAt} 更新</span>
                </div>
                <p class="text-sm md:text-base text-slate-800 font-medium line-clamp-2">${item.questionText}</p>
                <div class="bg-amber-50/80 border border-amber-200 p-2.5 rounded-xl text-xs md:text-sm text-amber-950 font-bold line-clamp-2 shadow-sm mt-1">
                    📝 ${item.note || "(画像のみ登録されています)"}
                </div>`;
            listContainer.appendChild(card);
        });
    }

    const modal = document.getElementById('notebook-list-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeNotebookListModal() {
    const modal = document.getElementById('notebook-list-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}