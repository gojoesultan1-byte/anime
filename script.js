// Gojo Esultan Full Engine
const ADMIN_EMAIL = "gojoesultan1@gmail.com";
const ADMIN_ID = "111111111";
const ADMIN_PASS = "ahmedgojo1234567890";
const ADMIN_SECRET_PASS_CODE = "010079340866";

// Initial Setup
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
    let defaultSections = ["أحدث الأنميات", "أفلام الأنمي", "قائمة المفضلة"];
    localStorage.setItem("gojo_sections", JSON.stringify(defaultSections));
}

// Apply Settings on Load
window.addEventListener("DOMContentLoaded", () => {
    applySiteSettings();
    if (typeof loadHomeContent === "function") {
        loadHomeContent();
    }
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
            postsHtml = `<p style="color: #94a3b8; padding: 10px;">لا توجد منشورات في هذا القسم حالياً.</p>`;
        } else {
            secPosts.forEach(p => {
                postsHtml += `
                    <div class="anime-card" style="background: #1e293b; border-radius: 8px; padding: 15px; width: 220px; display: inline-block; margin: 10px; vertical-align: top;">
                        <img src="${p.url}" alt="${p.title}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 6px;">
                        <h4 style="margin: 10px 0 5px; color: white;">${p.title}</h4>
                        <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 10px;">${p.desc}</p>
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #38bdf8;">
                            <span>👍 ${p.likes || 0}</span>
                            <span>👎 ${p.dislikes || 0}</span>
                            <span>👁️ ${p.views || 0}</span>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div class="section-block" style="margin-bottom: 30px;">
                <h2 style="border-bottom: 2px solid #38bdf8; padding-bottom: 5px; margin-bottom: 15px; color: #f8fafc;">📁 ${sec}</h2>
                <div class="section-posts-grid" style="display: flex; flex-wrap: wrap; gap: 15px;">
                    ${postsHtml}
                </div>
            </div>
        `;
    });
}
