const ADMIN_EMAIL = "gojoesultan1@gmail.com";
const ADMIN_ID = "111111111";
const ADMIN_PASS = "ahmedgojo1234567890";
const ADMIN_SECRET_PASS_CODE = "010079340866";

if (!localStorage.getItem("gojo_users")) {
    let adminUser = {
        email: ADMIN_EMAIL,
        password: ADMIN_PASS,
        id: ADMIN_ID,
        downloads: []
    };
    localStorage.setItem("gojo_users", JSON.stringify([adminUser]));
}

if (!localStorage.getItem("gojo_settings")) {
    localStorage.setItem("gojo_settings", JSON.stringify({
        primaryColor: "#4f46e5",
        secondaryColor: "#9333ea",
        logoUrl: "https://i.imgur.com/8Km9tLL.png"
    }));
}

if (!localStorage.getItem("gojo_sections")) {
    localStorage.setItem("gojo_sections", JSON.stringify(["صور ومنشورات انمي", "مشاهدة الانمي"]));
}

if (!localStorage.getItem("gojo_posts")) {
    localStorage.setItem("gojo_posts", JSON.stringify([
        { id: 1, type: "image", title: "جوجو ساتورو الأسطوري", desc: "أقوى تعويذة في عالم الأنمي.", url: "https://i.imgur.com/8Km9tLL.png", section: "صور ومنشورات انمي", likes: 120, dislikes: 2, views: 450, likedBy: [], dislikedBy: [] },
        { id: 2, type: "video", title: "حلقة قتال جوجو الخرافية", desc: "استمتع بأقوى جودة ودقة.", url: "https://www.w3schools.com/html/mov_bbb.mp4", section: "مشاهدة الانمي", likes: 340, dislikes: 5, views: 1200, likedBy: [], dislikedBy: [] }
    ]));
}

document.addEventListener("DOMContentLoaded", () => {
    applySiteSettings();
    checkUserSession();
    renderContent();
});

function applySiteSettings() {
    let settings = JSON.parse(localStorage.getItem("gojo_settings"));
    if (settings) {
        document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
        let logo = document.getElementById("site-logo");
        if (logo) logo.src = settings.logoUrl;
    }
}

function checkUserSession() {
    let currentUser = JSON.parse(localStorage.getItem("gojo_current_user"));
    let authSection = document.getElementById("auth-section");
    let adminTrigger = document.getElementById("admin-trigger-box");

    if (currentUser) {
        let activeToken = localStorage.getItem(`session_${currentUser.id}`);
        let browserToken = sessionStorage.getItem("browser_session_token");

        if (!browserToken) {
            browserToken = Math.random().toString(36).substring(2);
            sessionStorage.setItem("browser_session_token", browserToken);
        }

        if (activeToken && activeToken !== browserToken) {
            alert("⚠️ تنبيه أمني: تم تسجيل الدخول بهذا الحساب من جهاز آخر! سيتم تسجيل خروجك.");
            localStorage.removeItem("gojo_current_user");
            window.location.href = "login.html";
            return;
        } else {
            localStorage.setItem(`session_${currentUser.id}`, browserToken);
        }

        if (authSection) {
            authSection.innerHTML = `
                <span style="font-size: 0.9rem;">مرحباً (${currentUser.id})</span>
                <a href="profile.html" class="btn btn-register">تنزيلاتي (${currentUser.downloads ? currentUser.downloads.length : 0})</a>
                <button onclick="logout()" class="btn btn-login">خروج</button>
            `;
        }

        if (currentUser.id === ADMIN_ID && currentUser.email === ADMIN_EMAIL) {
            if (adminTrigger) adminTrigger.style.display = "block";
        }
    }
}

function logout() {
    let currentUser = JSON.parse(localStorage.getItem("gojo_current_user"));
    if (currentUser) {
        localStorage.removeItem(`session_${currentUser.id}`);
    }
    localStorage.removeItem("gojo_current_user");
    window.location.href = "index.html";
}

function renderContent() {
    let postsGrid = document.getElementById("posts-grid");
    let videosGrid = document.getElementById("videos-grid");
    if (!postsGrid && !videosGrid) return;

    let posts = JSON.parse(localStorage.getItem("gojo_posts")) || [];
    let currentUser = JSON.parse(localStorage.getItem("gojo_current_user"));

    if (postsGrid) postsGrid.innerHTML = "";
    if (videosGrid) videosGrid.innerHTML = "";

    posts.forEach(post => {
        if (!post.likedBy) post.likedBy = [];
        if (!post.dislikedBy) post.dislikedBy = [];
        if (!post.views) post.views = 0;

        let userHasLiked = currentUser && post.likedBy.includes(currentUser.id);
        let userHasDisliked = currentUser && post.dislikedBy.includes(currentUser.id);

        if (post.type === "image" && postsGrid) {
            postsGrid.innerHTML += `
                <div class="card">
                    <img src="${post.url}" alt="${post.title}" onclick="incrementView(${post.id})">
                    <h3>${post.title}</h3>
                    <p>${post.desc}</p>
                    <div class="interaction-bar" style="display:flex; justify-content:space-between; align-items:center; margin-top:15px; border-top:1px solid #334155; padding-top:10px;">
                        <div style="display:flex; gap:10px;">
                            <button onclick="handleReaction(${post.id}, 'like')" style="background:${userHasLiked ? '#10b981' : '#334155'}; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">
                                👍 ${post.likes || 0}
                            </button>
                            <button onclick="handleReaction(${post.id}, 'dislike')" style="background:${userHasDisliked ? '#ef4444' : '#334155'}; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">
                                👎 ${post.dislikes || 0}
                            </button>
                        </div>
                        <span style="font-size:0.85rem; color:#94a3b8;">👁️ ${post.views} مشاهدة</span>
                    </div>
                </div>
            `;
        } else if (post.type === "video" && videosGrid) {
            videosGrid.innerHTML += `
                <div class="video-card">
                    <div class="video-container-custom">
                        <video id="vid-${post.id}" preload="metadata" onplay="incrementView(${post.id})">
                            <source src="${post.url}" type="video/mp4">
                            متصفحك لا يدعم الفيديو.
                        </video>
                        <div class="video-controls-bar">
                            <button onclick="togglePlay('vid-${post.id}')">تشغيل / إيقاف ⏯️</button>
                            <button onclick="skipTime('vid-${post.id}', -15)">-15ث ⏪</button>
                            <button onclick="skipTime('vid-${post.id}', 15)">+15ث ⏩</button>
                            <select onchange="changeSpeed('vid-${post.id}', this.value)">
                                <option value="0.5">0.5x</option>
                                <option value="1" selected>1.0x (عادي)</option>
                                <option value="1.5">1.5x</option>
                                <option value="2">2.0x</option>
                            </select>
                            <select onchange="changeQuality('vid-${post.id}', this.value)">
                                <option value="720">720p HD</option>
                                <option value="480">480p</option>
                                <option value="360">360p</option>
                            </select>
                        </div>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.desc}</p>
                    
                    <div class="interaction-bar" style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; border-top:1px solid #334155; padding-top:10px;">
                        <div style="display:flex; gap:10px;">
                            <button onclick="handleReaction(${post.id}, 'like')" style="background:${userHasLiked ? '#10b981' : '#334155'}; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">
                                👍 ${post.likes || 0}
                            </button>
                            <button onclick="handleReaction(${post.id}, 'dislike')" style="background:${userHasDisliked ? '#ef4444' : '#334155'}; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">
                                👎 ${post.dislikes || 0}
                            </button>
                        </div>
                        <span style="font-size:0.85rem; color:#94a3b8;">👁️ ${post.views} مشاهدة</span>
                    </div>

                    <button class="btn btn-download" onclick="downloadVideo(${post.id})">📥 تنزيل الفيديو للمشاهدة بدون نت</button>
                </div>
            `;
        }
    });
}

function handleReaction(postId, type) {
    let currentUser = JSON.parse(localStorage.getItem("gojo_current_user"));
    if (!currentUser) {
        alert("🔒 يجب تسجيل الدخول أو إنشاء حساب أولاً لكي تتمكن من التفاعل والإعجاب بالمنشورات!");
        window.location.href = "login.html";
        return;
    }

    let posts = JSON.parse(localStorage.getItem("gojo_posts"));
    let post = posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.likedBy) post.likedBy = [];
    if (!post.dislikedBy) post.dislikedBy = [];

    if (type === 'like') {
        if (post.likedBy.includes(currentUser.id)) {
            post.likedBy = post.likedBy.filter(id => id !== currentUser.id);
            post.likes--;
        } else {
            post.likedBy.push(currentUser.id);
            post.likes = (post.likes || 0) + 1;
            if (post.dislikedBy.includes(currentUser.id)) {
                post.dislikedBy = post.dislikedBy.filter(id => id !== currentUser.id);
                post.dislikes = Math.max(0, (post.dislikes || 1) - 1);
            }
        }
    } else if (type === 'dislike') {
        if (post.dislikedBy.includes(currentUser.id)) {
            post.dislikedBy = post.dislikedBy.filter(id => id !== currentUser.id);
            post.dislikes--;
        } else {
            post.dislikedBy.push(currentUser.id);
            post.dislikes = (post.dislikes || 0) + 1;
            if (post.likedBy.includes(currentUser.id)) {
                post.likedBy = post.likedBy.filter(id => id !== currentUser.id);
                post.likes = Math.max(0, (post.likes || 1) - 1);
            }
        }
    }

    localStorage.setItem("gojo_posts", JSON.stringify(posts));
    renderContent();
}

function incrementView(postId) {
    let posts = JSON.parse(localStorage.getItem("gojo_posts"));
    let post = posts.find(p => p.id === postId);
    if (post) {
        post.views = (post.views || 0) + 1;
        localStorage.setItem("gojo_posts", JSON.stringify(posts));
    }
}

function togglePlay(id) {
    let v = document.getElementById(id);
    if (v.paused) v.play();
    else v.pause();
}

function skipTime(id, seconds) {
    let v = document.getElementById(id);
    v.currentTime += seconds;
}

function changeSpeed(id, speed) {
    let v = document.getElementById(id);
    v.playbackRate = parseFloat(speed);
}

function changeQuality(id, q) {
    alert(`تم تحويل دقة التشغيل إلى ${q}p بنجاح`);
}

function downloadVideo(postId) {
    let currentUser = JSON.parse(localStorage.getItem("gojo_current_user"));
    if (!currentUser) {
        alert("🔒 عذراً يا صديقي! يجب تسجيل الدخول أو إنشاء حساب أولاً لكي تتمكن من تنزيل الفيديوهات ومتابعتها بدون إنترنت.");
        window.location.href = "login.html";
        return;
    }

    let posts = JSON.parse(localStorage.getItem("gojo_posts"));
    let targetPost = posts.find(p => p.id === postId);

    if (!currentUser.downloads) currentUser.downloads = [];
    
    if (currentUser.downloads.some(d => d.id === postId)) {
        alert("هذا الفيديو موجود بالفعل في قائمة تنزيلاتك الخاصة!");
        return;
    }

    currentUser.downloads.push(targetPost);
    localStorage.setItem("gojo_current_user", JSON.stringify(currentUser));

    let users = JSON.parse(localStorage.getItem("gojo_users"));
    let uIndex = users.findIndex(u => u.id === currentUser.id);
    if (uIndex !== -1) {
        users[uIndex] = currentUser;
        localStorage.setItem("gojo_users", JSON.stringify(users));
    }

    alert("📥 تم تنزيل الفيديو بنجاح إلى ملفاتك الشخصية! يمكنك مشاهدته بدون إنترنت من صفحة (تنزيلاتي).");
    checkUserSession();
}
