/* ==========================================================
   Gojo Esultan Full Engine v26.5 - Ultimate Multiverse Script
   مخصص لإدارة الأبعاد، عرض الوسائط (صور وفيديوهات)، والتفاعلات الكاملة.
   ========================================================== */

const ADMIN_EMAIL = "gojoesultan1@gmail.com";
const ADMIN_ID = "111111111";
const ADMIN_PASS = "ahmedgojo1234567890";
const ADMIN_SECRET_PASS_CODE = "010079340866";

/* تهيئة التخزين المحلي والبيانات الأساسية للكون */
function initializeCosmicDatabase() {
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
                title: "طاقة البعد الموازي الكبرى",
                desc: "تجربة عرض المحتوى والصور والفيديوهات مع نظام التفاعلات الكامل للأيقونات والأزرار.",
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

/* تشغيل الإعدادات عند تحميل الصفحة بالكامل */
window.addEventListener("DOMContentLoaded", () => {
    initializeCosmicDatabase();
    applyCosmicSettings();
    renderCosmicAdminButton();
    renderMultiverseContent();
});

/* تطبيق إعدادات الهوية والشعار المخصص */
function applyCosmicSettings() {
    try {
        let settings = JSON.parse(localStorage.getItem("gojo_settings"));
        if (settings && settings.logoUrl) {
            let logoImgs = document.querySelectorAll("#site-logo, .portal-brand img");
            logoImgs.forEach(img => {
                img.src = settings.logoUrl;
            });
        }
    } catch (error) {
        console.error("خطأ في تطبيق الإعدادات الكونية:", error);
    }
}

/* عرض زر لوحة التحكم الإدارية حصرياً للمدير */
function renderCosmicAdminButton() {
    try {
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
    } catch (error) {
        console.error("خطأ في إظهار زر الإدارة:", error);
    }
}

/* المحرك الرئيسي لعرض الأقسام والكروت والوسائط (صور وفيديوهات مع ملء الشاشة) */
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
            cardsHtml = `<div class="empty-dimension">لا توجد طاقة أو منشورات مسجلة في هذا البعد حالياً.</div>`;
        } else {
            secPosts.forEach(p => {
                let mediaSrc = p.url || p.image || "https://i.imgur.com/8Km9tLL.png";
                let mediaElement = "";

                // التحقق من نوع الملف (فيديو أو صورة) وتوفير عناصر تحكم المتصفح الكاملة (ملء الشاشة، سرعة، كتم)
                if (p.type === "video" || mediaSrc.includes("data:video") || mediaSrc.endsWith(".mp4") || mediaSrc.endsWith(".mov") || mediaSrc.endsWith(".webm")) {
                    mediaElement = `
                        <video src="${mediaSrc}" controls controlslist="nodownload" playsinline preload="metadata"></video>
                    `;
                } else {
                    mediaElement = `
                        <img src="${mediaSrc}" alt="${p.title || 'منشور كونى'}" onerror="this.src='https://i.imgur.com/8Km9tLL.png'">
                    `;
                }

                // بناء كارت العرض بكل تفاصيله والتفاعلات والإيكات المطلوبة
                cardsHtml += `
                    <div class="quantum-card">
                        <div>
                            ${mediaElement}
                            <h4>${p.title || 'إشارة مجهولة'}</h4>
                            <p>${p.desc || 'لا يوجد وصف تفصيلي لهذا المنشور في الوقت الحالي.'}</p>
                        </div>
                        <div class="quantum-stats">
                            <span onclick="reactPost(${p.id}, 'like')" title="إعجاب">👍 إعجاب (${p.likes || 0})</span>
                            <span onclick="reactPost(${p.id}, 'dislike')" title="عدم إعجاب">👎 رفض (${p.dislikes || 0})</span>
                            <span title="إجمالي المشاهدات">👁️ مشاهدات (${p.views || 0})</span>
                        </div>
                    </div>
                `;
            });
        }

        // إضافة القسم بالكامل للحاوية الكونية
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

/* نظام التفاعلات وتحديث الإيكات والديلايكات في التخزين المحلي */
function reactPost(postId, type) {
    try {
        let posts = JSON.parse(localStorage.getItem("gojo_posts")) || [];
        let post = posts.find(p => p.id === postId);
        
        if (post) {
            if (type === 'like') {
                post.likes = (post.likes || 0) + 1;
            } else if (type === 'dislike') {
                post.dislikes = (post.dislikes || 0) + 1;
            }
            
            // حفظ التحديثات وإعادة رسم المحتوى فوراً
            localStorage.setItem("gojo_posts", JSON.stringify(posts));
            renderMultiverseContent();
        }
    } catch (error) {
        console.error("حدث خطأ أثناء تسجيل التفاعل:", error);
    }
}

/* دالة مساعدة لتسجيل مشاهدة جديدة للمنشورات تلقائياً */
function registerPostView(postId) {
    try {
        let posts = JSON.parse(localStorage.getItem("gojo_posts")) || [];
        let post = posts.find(p => p.id === postId);
        if (post) {
            post.views = (post.views || 0) + 1;
            localStorage.setItem("gojo_posts", JSON.stringify(posts));
        }
    } catch (error) {
        console.error("خطأ في تسجيل المشاهدة:", error);
    }
}
