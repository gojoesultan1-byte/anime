// Gojo Esultan Full Engine v26.0
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
    let defaultSettings = {
        primaryColor: "#00dfd8",
        secondaryColor: "#030014",
        logoUrl: "https://i.imgur.com/8Km9tLL.png"
    };
    localStorage.setItem("gojo_settings", JSON.stringify(defaultSettings));
}

if (!localStorage.getItem("gojo_sections")) {
    let defaultSections = ["صور ومنشورات الأنمي", "مشاهدة الأنمي"];
    localStorage.setItem("gojo_sections", JSON.stringify(defaultSections));
}

if (!localStorage.getItem("gojo_posts") || JSON.parse(localStorage.getItem("gojo_posts")).length === 0) {
    let samplePosts = [
        {
            id: Date.now(),
            title: "طاقة البعد الموازي",
            desc: "تجربة عرض المحتوى والصور والفيديوهات.",
            url: "https://i.imgur.com/8Km9tLL.png",
            section: "صور ومنشورات الأنمي",
            type: "image",
            likes: 15,
            dislikes: 0,
            views: 40
        }
    ];
    localStorage.setItem("gojo_posts", JSON.stringify(samplePosts));
}

window.addEventListener("DOMContentLoaded", () => {
    applyCosmicSettings();
    renderCosmicAdminButton();
    renderMultiverseContent();
});

function applyCosmicSettings() {
    let settings = JSON.parse(localStorage.getItem("gojo_settings"));
    if (settings && settings.logoUrl) {
        let logoImgs = document.querySelectorAll("#site-logo, .portal-brand img");
        logoImgs.forEach(img => {
            img.src = settings.logoUrl;
        });
    }
}

function renderCosmicAdminButton() {
    let currentUser = JSON.parse(localStorage.getItem("gojo_current_user"));
    let existingBtn = document.getElementById("cosmic-admin-red-btn");
    if (existingBtn) existingBtn.remove();

    if (currentUser && currentUser.id === ADMIN_ID) {
        let redBtn = document.createElement("a");
        redBtn.id = "cosmic-admin-red-btn";
        redBtn.href = "admin.html";
        redBtn.innerHTML = "🔴 لوحة تحكم البعد";
        redBtn.className = "cosmic-admin-btn";
        document.body.appendChild(redBtn);
    }
}

function renderMultiverseContent() {
    let container = document.getElementById("cosmic-content-container");
    if (!container) return;

    let sections = JSON.parse(localStorage.getItem("gojo_sections")) || ["صور ومنشورات الأنمي", "مشاهدة الأنمي"];
    let posts = JSON.parse(localStorage.getItem("gojo_posts")) || [];
    
    container.innerHTML = "";

    sections.forEach(sec => {
        let secPosts = posts.filter(p => p.section === sec || (!p.section && sec === "صور ومنشورات الأنمي"));
        let cardsHtml = "";

        if (secPosts.length === 0) {
            cardsHtml = `<p style="color: #6b7280; font-size: 0.9rem; padding: 10px;">لا توجد طاقة مسجلة في هذا البعد حالياً.</p>`;
        } else {
            secPosts.forEach(p => {
                let mediaSrc = p.url || p.image || "https://i.imgur.com/8Km9tLL.png";
                let mediaElement = "";

                // التحقق من الفيديو ودعم زر ملء الشاشة (Fullscreen) والسرعة أوتوماتيك عبر controls المتصفح
                if (p.type === "video" || mediaSrc.includes("data:video") || mediaSrc.endsWith(".mp4")) {
                    mediaElement = `
                        <video src="${mediaSrc}" controls controlslist="nodownload" playsinline></video>
                    `;
                } else {
                    mediaElement = `
                        <img src="${mediaSrc}" alt="${p.title || 'كون'}" onerror="this.src='https://i.imgur.com/8Km9tLL.png'">
                    `;
                }

                cardsHtml += `
                    <div class="quantum-card">
                        <div>
                            ${mediaElement}
                            <h4>${p.title || 'إشارة مجهولة'}</h4>
                            <p>${p.desc || ''}</p>
                        </div>
                        <div class="quantum-stats">
                            <span>✨ ${p.likes || 0}</span>
                            <span>👁️ ${p.views || 0}</span>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div class="dimension-section">
                <h3 class="dimension-title">🌌 ${sec}</h3>
                <div class="galaxy-grid">
                    ${cardsHtml}
                </div>
            </div>
        `;
    });
}
