// Gojo Esultan Precise Layout Engine
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

if (!localStorage.getItem("gojo_posts") || JSON.parse(localStorage.getItem("gojo_posts")).length === 0) {
    let samplePosts = [
        {
            id: 1,
            title: "لقطة أسطورية",
            desc: "تجربة عرض المحتوى في المكان المحدد.",
            url: "https://i.imgur.com/8Km9tLL.png",
            section: "صور ومنشورات الأنمي",
            type: "image",
            likes: 10,
            dislikes: 0,
            views: 20
        }
    ];
    localStorage.setItem("gojo_posts", JSON.stringify(samplePosts));
}

window.addEventListener("DOMContentLoaded", () => {
    applySiteSettings();
    injectAdminButtonOnTop();
    loadHomeContent();
});

function applySiteSettings() {
    let settings = JSON.parse(localStorage.getItem("gojo_settings"));
    if (settings && settings.logoUrl) {
        let logoImgs = document.querySelectorAll("#site-logo, .site-logo-element");
        logoImgs.forEach(img => {
            img.src = settings.logoUrl;
        });
    }
}

function injectAdminButtonOnTop() {
    let currentUser = JSON.parse(localStorage.getItem("gojo_current_user"));
    let navContainer = document.querySelector("nav, header, .nav-links, .header-menu") || document.body;
    
    let oldBtn = document.getElementById("admin-red-btn");
    if (oldBtn) oldBtn.remove();

    // يظهر الزرار الأحمر لو المستخدم الحالي هو الأدمن
    if (currentUser && currentUser.id === ADMIN_ID) {
        let redBtn = document.createElement("a");
        redBtn.id = "admin-red-btn";
        redBtn.href = "admin.html";
        redBtn.innerHTML = "🔴 لوحة التحكم";
        redBtn.style.cssText = "background: #ef4444; color: white; padding: 6px 12px; border-radius: 6px; font-weight: bold; text-decoration: none; margin-left: 10px; display: inline-block; font-size: 0.9rem; box-shadow: 0 2px 4px rgba(0,0,0,0.3);";
        
        // محاولة وضعه في الشريط العبوي فوق
        let targetNav = document.querySelector("nav") || document.body.firstElementChild;
        if (targetNav) {
            targetNav.prepend(redBtn);
        }
    }
}

function loadHomeContent() {
    // استهداف المكان المحدّد بالخط الأصفر بالضبط
    let container = document.getElementById("main-content-container");
    if (!container) {
        // لو الحاوية مش موجودة في الـ HTML، بنعملها إدراج تلقائي في مكان الخط الأصفر
        container = document.createElement("div");
        container.id = "main-content-container";
        container.style.cssText = "padding: 20px; width: 100%; box-sizing: border-box;";
        
        let targetLineArea = document.querySelector(".content-area, main") || document.body;
        targetLineArea.appendChild(container);
    }

    let sections = JSON.parse(localStorage.getItem("gojo_sections")) || ["صور ومنشورات الأنمي", "مشاهدة الأنمي"];
    let posts = JSON.parse(localStorage.getItem("gojo_posts")) || [];
    
    container.innerHTML = "";

    sections.forEach(sec => {
        let secPosts = posts.filter(p => p.section === sec || (!p.section && sec === "صور ومنشورات الأنمي"));
        let postsHtml = "";

        if (secPosts.length === 0) {
            postsHtml = `<p style="color: #94a3b8; padding: 10px; font-size: 0.85rem;">لا توجد منشورات في هذا القسم.</p>`;
        } else {
            secPosts.forEach(p => {
                let mediaSrc = p.url || p.image || "https://i.imgur.com/8Km9tLL.png";
                let mediaElement = `<img src="${mediaSrc}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 6px;" onerror="this.src='https://i.imgur.com/8Km9tLL.png'">`;

                postsHtml += `
                    <div style="background: #1e293b; border-radius: 8px; padding: 10px; width: 200px; display: inline-block; margin: 8px; vertical-align: top; border: 1px solid #334155;">
                        ${mediaElement}
                        <h4 style="margin: 8px 0 4px; color: white; font-size: 0.95rem;">${p.title || 'بدون عنوان'}</h4>
                        <p style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 8px;">${p.desc || ''}</p>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div style="margin-bottom: 25px; background: rgba(15, 23, 42, 0.5); padding: 15px; border-radius: 10px; border: 1px solid #38bdf844;">
                <h3 style="color: #38bdf8; border-bottom: 1px solid #38bdf8; padding-bottom: 5px; margin-bottom: 12px; font-size: 1.1rem;">📁 ${sec}</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${postsHtml}
                </div>
            </div>
        `;
    });
}
