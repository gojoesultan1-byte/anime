// Gojo Esultan Robust Full Engine v10.0
const ADMIN_EMAIL = "gojoesultan1@gmail.com";
const ADMIN_ID = "111111111";
const ADMIN_PASS = "ahmedgojo1234567890";
const ADMIN_SECRET_PASS_CODE = "010079340866";

// تهيئة البيانات الأساسية والتخزين المحلي
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
    let defaultSettings = {
        primaryColor: "#38bdf8",
        secondaryColor: "#0f172a",
        logoUrl: "https://i.imgur.com/8Km9tLL.png"
    };
    localStorage.setItem("gojo_settings", JSON.stringify(defaultSettings));
}

if (!localStorage.getItem("gojo_sections")) {
    let defaultSections = ["صور ومنشورات الأنمي", "مشاهدة الأنمي"];
    localStorage.setItem("gojo_sections", JSON.stringify(defaultSections));
}

// إضافة بيانات افتراضية لو كانت المنشورات فارغة تماماً
if (!localStorage.getItem("gojo_posts") || JSON.parse(localStorage.getItem("gojo_posts")).length === 0) {
    let samplePosts = [
        {
            id: Date.now(),
            title: "لقطة أسطورية افتتاحية",
            desc: "تم إنشاء هذا البوست تلقائياً للتأكد من عمل النظام.",
            url: "https://i.imgur.com/8Km9tLL.png",
            section: "صور ومنشورات الأنمي",
            type: "image",
            likes: 12,
            dislikes: 0,
            views: 35
        }
    ];
    localStorage.setItem("gojo_posts", JSON.stringify(samplePosts));
}

window.addEventListener("DOMContentLoaded", () => {
    applySiteSettings();
    injectTopAdminButton();
    renderHomePageContent();
});

function applySiteSettings() {
    let settings = JSON.parse(localStorage.getItem("gojo_settings"));
    if (settings) {
        if (settings.logoUrl) {
            let logoImgs = document.querySelectorAll("#site-logo, .site-logo-element");
            logoImgs.forEach(img => {
                img.src = settings.logoUrl;
            });
        }
        if (settings.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        }
    }
}

function injectTopAdminButton() {
    let currentUser = JSON.parse(localStorage.getItem("gojo_current_user"));
    let existingBtn = document.getElementById("absolute-admin-btn");
    if (existingBtn) existingBtn.remove();

    // إظهار زر لوحة التحكم الأحمر الصغير في أعلى الشاشة حصرياً للمدير
    if (currentUser && currentUser.id === ADMIN_ID) {
        let redBtn = document.createElement("a");
        redBtn.id = "absolute-admin-btn";
        redBtn.href = "admin.html";
        redBtn.innerHTML = "🔴 لوحة التحكم";
        redBtn.style.cssText = "position: fixed; top: 12px; left: 15px; background: #ef4444; color: white; padding: 6px 12px; border-radius: 6px; font-weight: bold; text-decoration: none; z-index: 99999; font-size: 0.85rem; box-shadow: 0 2px 5px rgba(0,0,0,0.5);";
        document.body.appendChild(redBtn);
    }
}

function renderHomePageContent() {
    let container = document.getElementById("main-content-container");
    if (!container) return;

    let sections = JSON.parse(localStorage.getItem("gojo_sections")) || ["صور ومنشورات الأنمي", "مشاهدة الأنمي"];
    let posts = JSON.parse(localStorage.getItem("gojo_posts")) || [];
    
    container.innerHTML = "";

    sections.forEach(sec => {
        let secPosts = posts.filter(p => p.section === sec || (!p.section && sec === "صور ومنشورات الأنمي"));
        let postsHtml = "";

        if (secPosts.length === 0) {
            postsHtml = `<p style="color: #64748b; font-size: 0.9rem; padding: 10px;">لا توجد منشورات حالياً في هذا القسم.</p>`;
        } else {
            secPosts.forEach(p => {
                let mediaSrc = p.url || p.image || "https://i.imgur.com/8Km9tLL.png";
                let mediaElement = "";

                if (p.type === "video" || mediaSrc.includes("data:video")) {
                    mediaElement = `<video src="${mediaSrc}" controls></video>`;
                } else {
                    mediaElement = `<img src="${mediaSrc}" alt="${p.title || 'صورة'}" onerror="this.src='https://i.imgur.com/8Km9tLL.png'">`;
                }

                postsHtml += `
                    <div class="anime-card">
                        <div>
                            ${mediaElement}
                            <h4>${p.title || 'بدون عنوان'}</h4>
                            <p>${p.desc || ''}</p>
                        </div>
                        <div class="card-stats">
                            <span>👍 ${p.likes || 0}</span>
                            <span>👎 ${p.dislikes || 0}</span>
                            <span>👁️ ${p.views || 0}</span>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div class="section-block">
                <h3 class="section-title">📁 ${sec}</h3>
                <div class="posts-grid">
                    ${postsHtml}
                </div>
            </div>
        `;
    });
}
