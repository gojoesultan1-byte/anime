// Gojo Esultan Final Clean Engine
const ADMIN_EMAIL = "gojoesultan1@gmail.com";
const ADMIN_ID = "111111111";

if (!localStorage.getItem("gojo_posts") || JSON.parse(localStorage.getItem("gojo_posts")).length === 0) {
    let samplePosts = [
        {
            title: "لقطة أسطورية",
            desc: "تجربة عرض المحتوى بنجاح تام.",
            url: "https://i.imgur.com/8Km9tLL.png",
            section: "صور ومنشورات الأنمي"
        }
    ];
    localStorage.setItem("gojo_posts", JSON.stringify(samplePosts));
}

window.addEventListener("DOMContentLoaded", () => {
    // تنظيف أي حاوية قديمة متداخلة عشان مايعملش تكرار
    let oldContainer = document.getElementById("gojo-master-container");
    if (oldContainer) oldContainer.remove();

    // إنشاء حاوية أساسية واضحة ومباشرة
    let container = document.createElement("div");
    container.id = "gojo-master-container";
    container.style.cssText = "width: 100%; padding: 20px; box-sizing: border-box; background: #0b0f19; margin-top: 20px; border-radius: 12px;";

    let posts = JSON.parse(localStorage.getItem("gojo_posts")) || [];
    let sections = JSON.parse(localStorage.getItem("gojo_sections")) || ["صور ومنشورات الأنمي", "مشاهدة الأنمي"];

    sections.forEach(sec => {
        let secPosts = posts.filter(p => p.section === sec || (!p.section && sec === "صور ومنشورات الأنمي"));
        let cardsHtml = "";

        if (secPosts.length === 0) {
            cardsHtml = `<p style="color: #64748b; font-size: 0.9rem; padding: 10px;">لا توجد منشورات في هذا القسم حالياً.</p>`;
        } else {
            secPosts.forEach(p => {
                let mediaSrc = p.url || p.image || "https://i.imgur.com/8Km9tLL.png";
                cardsHtml += `
                    <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 12px; width: 220px; display: inline-block; margin: 10px; vertical-align: top; box-shadow: 0 4px 6px rgba(0,0,0,0.4);">
                        <img src="${mediaSrc}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 6px;" onerror="this.src='https://i.imgur.com/8Km9tLL.png'">
                        <h4 style="color: white; margin: 10px 0 5px; font-size: 1rem;">${p.title || 'بدون عنوان'}</h4>
                        <p style="color: #94a3b8; font-size: 0.85rem; margin: 0;">${p.desc || ''}</p>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div style="margin-bottom: 25px;">
                <h3 style="color: #38bdf8; border-bottom: 2px solid #38bdf8; padding-bottom: 6px; margin-bottom: 15px; font-size: 1.15rem;">📁 ${sec}</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${cardsHtml}
                </div>
            </div>
        `;
    });

    // حقن الحاوية في الصفحة فوراً تحت الهيدر أو في الجسم
    let target = document.querySelector(".content-area") || document.body;
    target.appendChild(container);

    // إضافة زر الأدمن الأحمر فوق لو المستخدم مدير
    let currentUser = JSON.parse(localStorage.getItem("gojo_current_user"));
    if (currentUser && currentUser.id === ADMIN_ID) {
        let existingAdminBtn = document.getElementById("top-admin-red-btn");
        if (!existingAdminBtn) {
            let redBtn = document.createElement("a");
            redBtn.id = "top-admin-red-btn";
            redBtn.href = "admin.html";
            redBtn.innerHTML = "🔴 لوحة التحكم";
            redBtn.style.cssText = "position: fixed; top: 15px; left: 15px; background: #ef4444; color: white; padding: 8px 14px; border-radius: 8px; font-weight: bold; text-decoration: none; z-index: 99999; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-size: 0.9rem;";
            document.body.appendChild(redBtn);
        }
    }
});
