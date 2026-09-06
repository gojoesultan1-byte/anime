/* ==========================================================
   Gojo Esultan Ultimate Engine - Main Script
   ========================================================== */

const ADMIN_EMAIL = "gojoesultan1@gmail.com";
const ADMIN_ID = "111111111";
const ADMIN_PASS = "ahmedgojo1234567890";

function initializeCosmicDatabase() {
    if (!localStorage.getItem("gojo_users")) {
        let adminUser = { email: ADMIN_EMAIL, password: ADMIN_PASS, id: ADMIN_ID, downloads: [] };
        localStorage.setItem("gojo_users", JSON.stringify([adminUser]));
    }
    if (!localStorage.getItem("gojo_settings")) {
        let defaultSettings = { primaryColor: "#00dfd8", secondaryColor: "#030014", logoUrl: "https://i.imgur.com/8Km9tLL.png" };
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
                title: "طاقة البعد الموازي الكبرى",
                desc: "تجربة عرض المحتوى والصور والفيديوهات مع التفاعلات.",
                url: "https://i.imgur.com/8Km9tLL.png",
                section: "صور ومنشورات الأنمي",
                type: "image",
                likes: 42,
                dislikes: 3,
                views: 120
            }
        ];
        localStorage.setItem("gojo_posts", JSON.stringify(samplePosts));
    }
}

window.addEventListener("DOMContentLoaded", () => {
    initializeCosmicDatabase();
    applyCosmicSettings();
    renderCosmicAdminButton();
    renderMultiverseContent();
});

function applyCosmicSettings() {
    let settings = JSON.parse(localStorage.getItem("gojo_settings"));
    if (settings && settings.logoUrl) {
        let logoImgs = document.querySelectorAll("#site-logo, .portal-brand img");
        logoImgs.forEach(img => img.src = settings.logoUrl);
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
            cardsHtml = `<div style="color: #6b7280; padding: 20px; text-align: center; grid-column: 1/-1;">لا توجد طاقة مسجلة في هذا البعد حالياً.</div>`;
        } else {
            secPosts.forEach(p => {
                let mediaSrc = p.url || p.image || "https://i.imgur.com/8Km9tLL.png";
                let mediaElement = "";

                if (p.type === "video" || mediaSrc.includes("data:video") || mediaSrc.endsWith(".mp4") || mediaSrc.endsWith(".mov")) {
                    mediaElement = `<video src="${mediaSrc}" controls controlslist="nodownload" playsinline preload="metadata"></video>`;
                } else {
                    mediaElement = `<img src="${mediaSrc}" alt="${p.title || 'منشور'}" onerror="this.src='https://i.imgur.com/8Km9tLL.png'">`;
                }

                cardsHtml += `
                    <div class="quantum-card">
                        <div>
                            ${mediaElement}
                            <h4>${p.title || 'إشارة مجهولة'}</h4>
                            <p>${p.desc || ''}</p>
                        </div>
                        <div class="quantum-stats">
                            <span onclick="reactPost(${p.id}, 'like')" title="إعجاب">👍 إعجاب (${p.likes || 0})</span>
                            <span onclick="reactPost(${p.id}, 'dislike')" title="عدم إعجاب">👎 رفض (${p.dislikes || 0})</span>
                            <span title="المشاهدات">👁️ مشاهدات (${p.views || 0})</span>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <section class="dimension-section">
                <h3 class="dimension-title">🌌 ${sec}</h3>
                <div class="galaxy-grid">
                    ${cardsHtml}
                </div>
            </section>
        `;
    });
}

function reactPost(postId, type) {
    let posts = JSON.parse(localStorage.getItem("gojo_posts")) || [];
    let post = posts.find(p => p.id === postId);
    if (post) {
        if (type === 'like') {
            post.likes = (post.likes || 0) + 1;
        } else if (type === 'dislike') {
            post.dislikes = (post.dislikes || 0) + 1;
        }
        localStorage.setItem("gojo_posts", JSON.stringify(posts));
        renderMultiverseContent();
    }
}
