// Gojo Esultan Complete Engine
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
        primaryColor: "#38bdf8",
        secondaryColor: "#0f172a",
        logoUrl: ""
    };
    localStorage.setItem("gojo_settings", JSON.stringify(defaultSettings));
}

if (!localStorage.getItem("gojo_sections")) {
    let defaultSections = ["صور ومنشورات الأنمي", "مشاهدة الأنمي"];
    localStorage.setItem("gojo_sections", JSON.stringify(defaultSections));
}

window.addEventListener("DOMContentLoaded", () => {
    applySiteSettings();
    loadHomeContent();
    checkAuthUI();
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

function checkAuthUI() {
    let currentUser = JSON.parse(localStorage.getItem("gojo_current_user"));
    let adminBtn = document.getElementById("admin-panel-btn");
    if (currentUser && currentUser.id === "111111111") {
        if (adminBtn) adminBtn.style.display = "block";
    } else {
        if (adminBtn) adminBtn.style.display = "none";
    }
}

function loadHomeContent() {
    let container = document.getElementById("main-content-container");
    if (!container) return;

    let sections = JSON.parse(localStorage.getItem("gojo_sections")) || [];
    let posts = JSON.parse(localStorage.getItem("gojo_posts")) || [];
    
    container.innerHTML = "";

    sections.forEach(sec => {
        let secPosts = posts.filter(p => p.section === sec);
        let postsHtml = "";

        if (secPosts.length === 0) {
            postsHtml = `<p style="color: #94a3b8; padding: 15px;">لا توجد محتويات مضافة في هذا القسم حتى الآن. يمكنك إضافتها من لوحة التحكم!</p>`;
        } else {
            secPosts.forEach(p => {
                let mediaElement = "";
                if (p.type === "video") {
                    mediaElement = `<video src="${p.url}" controls style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; background: black;"></video>`;
                } else {
                    mediaElement = `<img src="${p.url}" alt="${p.title}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px;">`;
                }

                postsHtml += `
                    <div class="anime-card" style="background: #1e293b; border-radius: 10px; padding: 12px; width: 240px; display: inline-block; margin: 10px; vertical-align: top; border: 1px solid #334155;">
                        ${mediaElement}
                        <h4 style="margin: 10px 0 5px; color: white; font-size: 1rem;">${p.title}</h4>
                        <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 10px; line-height: 1.4;">${p.desc}</p>
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #38bdf8; border-top: 1px solid #334155; padding-top: 8px;">
                            <span>👍 ${p.likes || 0}</span>
                            <span>👎 ${p.dislikes || 0}</span>
                            <span>👁️ ${p.views || 0}</span>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div class="section-block" style="margin-bottom: 35px; background: rgba(15, 23, 42, 0.6); padding: 20px; border-radius: 12px;">
                <h2 style="border-bottom: 2px solid #38bdf8; padding-bottom: 8px; margin-bottom: 15px; color: #f8fafc; font-size: 1.25rem;">📁 ${sec}</h2>
                <div class="section-posts-grid" style="display: flex; flex-wrap: wrap; gap: 15px;">
                    ${postsHtml}
                </div>
            </div>
        `;
    });
}
