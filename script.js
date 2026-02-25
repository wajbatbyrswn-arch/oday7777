/**
 * نظام إدارة الحالة (State Management)
 * يتم تخزين البيانات في localStorage للحفاظ عليها عند تحديث الصفحة
 */
const userState = {
    visitedSections: parseInt(localStorage.getItem('visitedSections')) || 0,
    quizScore: parseInt(localStorage.getItem('quizScore')) || 0,
    rating: parseInt(localStorage.getItem('rating')) || 0
};

// دالة لتحديث الحالة وحفظها في localStorage
function updateState(key, value) {
    userState[key] = value;
    localStorage.setItem(key, value);
}

/**
 * تكامل الصوتيات
 * استخدام كائن Audio لتشغيل الأصوات عند أحداث معينة
 */
const correctSound = new Audio('assets/correct.mp3');
const wrongSound = new Audio('assets/wrong.mp3');
const clapSound = new Audio('assets/clap.mp3');

/**
 * محرك الاختبار الديناميكي
 * مصفوفة تحتوي على 15 سؤالاً عن السياحة في الأردن
 */
const allQuestions = [
    { question: "ما هي المدينة الملقبة بالوردية؟", options: ["البتراء", "جرش", "العقبة", "مادبا"], correctAnswer: "البتراء" },
    { question: "أخفض بقعة على وجه الأرض؟", options: ["البحر الميت", "وادي عربة", "غور الأردن", "العقبة"], correctAnswer: "البحر الميت" },
    { question: "أين يقع وادي القمر؟", options: ["وادي رم", "وادي الموجب", "وادي بن حماد", "وادي الهيدان"], correctAnswer: "وادي رم" },
    { question: "مدينة الأطلال الرومانية والمسارح؟", options: ["جرش", "أم قيس", "عمان", "الكرك"], correctAnswer: "جرش" },
    { question: "لؤلؤة البحر الأحمر؟", options: ["العقبة", "البحر الميت", "عمان", "إربد"], correctAnswer: "العقبة" },
    { question: "الجبل المطل على وادي الأردن؟", options: ["جبل نيبو", "جبل القلعة", "جبل عمان", "جبل اللويبدة"], correctAnswer: "جبل نيبو" },
    { question: "الأكلة الشعبية الأولى في الأردن؟", options: ["المنسف", "المقلوبة", "المسخن", "الشاورما"], correctAnswer: "المنسف" },
    { question: "أفضل وقت لزيارة الأردن؟", options: ["الربيع والخريف", "الصيف", "الشتاء", "طوال العام"], correctAnswer: "الربيع والخريف" },
    { question: "المدينة في أقصى الجنوب؟", options: ["العقبة", "معان", "الطفيلة", "الكرك"], correctAnswer: "العقبة" },
    { question: "أين يمكن الطفو دون غرق؟", options: ["البحر الميت", "البحر الأحمر", "نهر الأردن", "سد الملك طلال"], correctAnswer: "البحر الميت" },
    { question: "قلعة بناها الصليبيون في الكرك؟", options: ["قلعة الكرك", "قلعة عجلون", "قلعة الشوبك", "قلعة عمان"], correctAnswer: "قلعة الكرك" },
    { question: "مدينة الفسيفساء في الأردن؟", options: ["مادبا", "السلط", "إربد", "الزرقاء"], correctAnswer: "مادبا" },
    { question: "محمية طبيعية تعتبر الأكبر في الأردن؟", options: ["محمية ضانا", "محمية الشومري", "محمية عجلون", "محمية الأزرق"], correctAnswer: "محمية ضانا" },
    { question: "نهر يفصل بين الأردن وفلسطين؟", options: ["نهر الأردن", "نهر اليرموك", "نهر الزرقاء", "نهر النيل"], correctAnswer: "نهر الأردن" },
    { question: "عاصمة الأردن؟", options: ["عمان", "إربد", "الزرقاء", "المفرق"], correctAnswer: "عمان" }
];

let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;

/**
 * بيانات المعالم السياحية
 */
const landmarks = [
    {
        id: 'petra',
        title: 'البتراء',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Treasury_petra_crop.jpeg/800px-Treasury_petra_crop.jpeg',
        desc: 'المدينة الوردية المحفورة في الصخر، من عجائب الدنيا السبع.'
    },
    {
        id: 'deadsea',
        title: 'البحر الميت',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Dead_sea_newspaper.jpg/800px-Dead_sea_newspaper.jpg',
        desc: 'أخفض بقعة على وجه الأرض، ويشتهر بمياهه عالية الملوحة.'
    },
    {
        id: 'wadirum',
        title: 'وادي رم',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Wadi_Rum_-_desert.jpg/800px-Wadi_Rum_-_desert.jpg',
        desc: 'يُعرف بوادي القمر، يتميز برماله الحمراء وجباله الشاهقة.'
    },
    {
        id: 'jerash',
        title: 'جرش',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Jerash_Oval_Forum.jpg/800px-Jerash_Oval_Forum.jpg',
        desc: 'أكبر مدينة رومانية محفوظة في العالم، تشتهر بأعمدتها ومسارحها.'
    },
    {
        id: 'aqaba',
        title: 'العقبة',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Aqaba_from_the_sea.jpg/800px-Aqaba_from_the_sea.jpg',
        desc: 'المنفذ البحري الوحيد للأردن المطل على البحر الأحمر، وتشتهر بالشعاب المرجانية.'
    },
    {
        id: 'nebo',
        title: 'جبل نيبو',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Mount_Nebo_View.jpg/800px-Mount_Nebo_View.jpg',
        desc: 'موقع ديني وتاريخي يوفر إطلالة بانورامية رائعة على وادي الأردن.'
    }
];

/**
 * التنقل بين الشاشات
 */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    // تحديث عدد الصفحات التي تم زيارتها
    updateState('visitedSections', userState.visitedSections + 1);
}

/**
 * تهيئة قائمة المعالم السياحية
 */
function initLandmarks() {
    const list = document.querySelector('.landmarks-list');
    landmarks.forEach((lm, index) => {
        const item = document.createElement('div');
        item.className = `landmark-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <div class="landmark-header" onclick="toggleLandmark(this)">
                <div class="landmark-title">
                    <i class="fas fa-check-circle check-icon"></i>
                    <span>${lm.title}</span>
                </div>
                <i class="fas fa-chevron-down arrow-icon"></i>
            </div>
            <div class="landmark-content">
                <img src="${lm.image}" alt="${lm.title}">
                <p>${lm.desc}</p>
            </div>
        `;
        list.appendChild(item);
    });
}

/**
 * فتح وإغلاق تفاصيل المعلم السياحي
 */
function toggleLandmark(header) {
    const item = header.parentElement;
    
    if (item.classList.contains('active')) {
        item.classList.remove('active');
    } else {
        // إغلاق جميع العناصر الأخرى
        document.querySelectorAll('.landmark-item').forEach(el => {
            el.classList.remove('active');
        });
        item.classList.add('active');
    }
}

/**
 * خوارزمية خلط المصفوفة (Fisher-Yates Shuffle)
 */
function shuffleArray(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

/**
 * بدء الاختبار
 */
function startQuiz() {
    // اختيار 5 أسئلة عشوائية
    currentQuiz = shuffleArray(allQuestions).slice(0, 5);
    currentQuestionIndex = 0;
    score = 0;
    showScreen('quiz-screen');
    loadQuestion();
}

/**
 * تحميل السؤال الحالي
 */
function loadQuestion() {
    const q = currentQuiz[currentQuestionIndex];
    document.getElementById('quiz-title').innerText = `اختبار المعلومات (${currentQuestionIndex + 1}/5)`;
    document.getElementById('question-text').innerText = q.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // خلط الخيارات
    const shuffledOptions = shuffleArray(q.options);
    shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => handleAnswer(opt, q.correctAnswer);
        optionsContainer.appendChild(btn);
    });
}

/**
 * معالجة إجابة المستخدم
 */
function handleAnswer(selected, correct) {
    // تعطيل الأزرار لمنع النقر المتعدد
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);

    if (selected === correct) {
        score++;
        // تشغيل صوت الإجابة الصحيحة
        correctSound.play().catch(e => console.log('Audio play failed:', e));
        showToast('إجابة صحيحة!', true);
    } else {
        // تشغيل صوت الإجابة الخاطئة
        wrongSound.play().catch(e => console.log('Audio play failed:', e));
        showToast('إجابة خاطئة!', false);
    }
    
    // الانتظار قليلاً لرؤية النتيجة قبل الانتقال للسؤال التالي
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < 5) {
            loadQuestion();
        } else {
            endQuiz();
        }
    }, 1500);
}

/**
 * إظهار إشعار الإجابة
 */
function showToast(message, isCorrect) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.className = `toast show ${isCorrect ? 'correct' : 'wrong'}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1500);
}

/**
 * إنهاء الاختبار وعرض النتيجة
 */
function endQuiz() {
    updateState('quizScore', score);
    document.getElementById('score-value').innerText = score;
    showScreen('result-screen');
    initRating();
}

/**
 * تهيئة نظام التقييم
 */
function initRating() {
    const stars = document.querySelectorAll('.stars .fa-star');
    
    // استرجاع التقييم السابق إن وجد
    if (userState.rating > 0) {
        highlightStars(userState.rating);
    } else {
        highlightStars(0);
    }

    stars.forEach(star => {
        star.onclick = function() {
            const val = parseInt(this.getAttribute('data-value'));
            updateState('rating', val);
            highlightStars(val);
            
            // تشغيل صوت التصفيق إذا كان التقييم 4 نجوم أو أكثر
            if (val >= 4) {
                clapSound.play().catch(e => console.log('Audio play failed:', e));
            }
        };
    });
}

/**
 * تظليل النجوم بناءً على التقييم
 */
function highlightStars(val) {
    const stars = document.querySelectorAll('.stars .fa-star');
    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= val) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// ربط الأحداث بالأزرار
document.getElementById('start-btn').addEventListener('click', () => {
    showScreen('landmarks-screen');
});

document.getElementById('start-quiz-btn').addEventListener('click', () => {
    startQuiz();
});

// التهيئة الأولية عند تحميل الصفحة
window.onload = () => {
    initLandmarks();
    // استرجاع التقييم إن وجد
    if (userState.rating > 0) {
        highlightStars(userState.rating);
    }
};
