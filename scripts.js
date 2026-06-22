
// ---------------------------------------------------------------
// dark mode
// ---------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const iconContainer = document.getElementById("icon-mode");
    const icon = iconContainer ? iconContainer.querySelector("img") : null;
    const isTopPage = body.classList.contains("top");

    if (!iconContainer || !icon) {
        console.error("#icon-mode element or img not found!");
        return;
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("mode_A");
    } else {
        body.classList.remove("mode_A");
    }

    function updateIcon() {
        if (body.classList.contains("mode_A")) {
            icon.src = isTopPage ? "./bau/img/mode_y.svg" : "./bau/img/mode_g.svg";
        } else {
            icon.src = isTopPage ? "./bau/img/mode_g.svg" : "./bau/img/mode_y.svg";
        }
    }

    updateIcon();

    iconContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        body.classList.toggle("mode_A");
        const newTheme = body.classList.contains("mode_A") ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        updateIcon();
    });
});



// ---------------------------------------------------------------
// clock
// ---------------------------------------------------------------

function updateTime() {
    var now = luxon.DateTime.local();
    var clockElement = document.getElementById('clock');
    var dateElement = document.getElementById('date');
    var timezoneElement = document.getElementById('timezone');
    clockElement.textContent = formatTime(now.hour) + ':' + formatTime(now.minute) + ':' + formatTime(now.second);
    dateElement.textContent = now.toFormat('LLLL dd yyyy');
    timezoneElement.textContent = "(" + getTimeZoneAbbreviation(now.zoneName) + ")";
}

updateTime();
setInterval(updateTime, 1000);

function formatTime(time) {
    return (time < 10) ? '0' + time : time;
}

function getTimeZoneAbbreviation(timezone) {
    var map = {
        "Asia/Tokyo": "JST", "Asia/Shanghai": "CST", "Asia/Kolkata": "IST",
        "Asia/Bangkok": "ICT", "Asia/Dubai": "GST", "Asia/Seoul": "KST",
        "Asia/Singapore": "SGT", "Asia/Taipei": "CST", "Asia/Hong_Kong": "HKT",
        "America/Los_Angeles": "PST", "America/New_York": "EST",
        "Europe/London": "GMT", "Europe/Paris": "CET", "Europe/Berlin": "CET",
    };
    return map[timezone] || timezone;
}



// ---------------------------------------------------------------
// count
// ---------------------------------------------------------------

const startDate = new Date(1720, 12, 1);
const today = new Date();
const timeDifference = today.getTime() - startDate.getTime();
const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
const days = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
document.getElementById('result').textContent = years + " years + " + days + " days";



// ---------------------------------------------------------------
// logo rotate
// ---------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {

    const contentElements = document.querySelectorAll(
        '.leftside, .gallery-container, .calendar-container, #stack'
    );
    const logoElements = document.querySelectorAll('.logoA, .logoB, .logoC');
    const initialRotationMap = { logoA: 0, logoB: 90, logoC: 0 };
    const maxRotationMap = { logoA: 30, logoB: 260, logoC: 280 };
    const stack = document.getElementById('stack');
    const media = window.media || (stack ? [...stack.querySelectorAll('img, video, a')] : []);

    logoElements.forEach(logoElement => {
        const logoClass = Array.from(logoElement.classList).find(cls => cls in initialRotationMap);
        if (!logoClass) return;
        logoElement.style.transform = `rotate(${initialRotationMap[logoClass]}deg)`;
        logoElement.addEventListener('click', (e) => {
            e.stopPropagation();
            logoElement.style.opacity = '0';
            setTimeout(() => { logoElement.style.display = 'none'; }, 300);
        });
    });

    function updateRotation(el) {
        let scrollPosition = 0;
        let maxScroll = 0;
        if (el && el.id === 'stack') {
            if (!media.length) return;
            const visible = media.filter(m => !m.classList.contains('hide'));
            if (!visible.length) return;
            const top = visible[visible.length - 1];
            scrollPosition = Math.abs((scrollY?.get?.(top)) || 0);
            maxScroll = 3000;
        } else if (el.classList.contains('leftside') || el.classList.contains('calendar-container')) {
            scrollPosition = el.scrollTop;
            maxScroll = el.scrollHeight - el.clientHeight;
        } else if (el.classList.contains('gallery-container')) {
            scrollPosition = el.scrollLeft;
            maxScroll = el.scrollWidth - el.clientWidth;
        } else {
            return;
        }
        logoElements.forEach(logo => {
            const logoClass = Array.from(logo.classList).find(cls => cls in maxRotationMap);
            if (!logoClass) return;
            const base = initialRotationMap[logoClass];
            const max = maxRotationMap[logoClass];
            const progress = maxScroll > 0 ? scrollPosition / maxScroll : 0;
            logo.style.transform = `rotate(${base + progress * max}deg)`;
        });
    }

    contentElements.forEach(el => {
        if (el.id === 'stack') return;
        el.addEventListener('scroll', () => { updateRotation(el); });
    });


    const p47el = document.querySelector('.p47');
    if (p47el) {
        p47el.addEventListener('scroll', () => {
            const scrollPosition = p47el.scrollTop;
            const maxScroll = p47el.scrollHeight - p47el.clientHeight;
            logoElements.forEach(logo => {
                const logoClass = Array.from(logo.classList).find(cls => cls in maxRotationMap);
                if (!logoClass) return;
                const base = initialRotationMap[logoClass];
                const max = maxRotationMap[logoClass];
                const progress = maxScroll > 0 ? scrollPosition / maxScroll : 0;
                logo.style.transform = `rotate(${base + progress * max}deg)`;
            });
        });
    }

    window.updateRotation = updateRotation;
});



// ---------------------------------------------------------------
// gallery slide
// ---------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector(".gallery-container");
    const rightside = document.querySelector(".rightside");
    if (!gallery || !rightside) return;
    rightside.addEventListener("click", function (event) {
        const clickX = event.clientX - rightside.getBoundingClientRect().left;
        if (clickX < gallery.clientWidth / 2) {
            gallery.scrollLeft -= 600;
        } else {
            gallery.scrollLeft += 600;
        }
    });
});



// ---------------------------------------------------------------
// modal
// ---------------------------------------------------------------

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");

if (modal) {
    document.querySelectorAll(".gallery-container .gallery-item").forEach((item) => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            modal.classList.add("open");
            modalImage.src = item.src;
            modalCaption.textContent = item.getAttribute("data-caption") || "";
        });
    });

    document.querySelectorAll(".thumbs-container .picsinthumbs").forEach((item) => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            modal.classList.add("open");
            modalImage.src = item.src;
            modalCaption.textContent = item.getAttribute("data-caption") || "";
        });
    });
}



// ---------------------------------------------------------------
// modal slideshow
// ---------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("modal");
    if (!modal) return;

    const modalImg = document.getElementById("modal-image");
    const modalCaption = document.getElementById("modal-caption");
    const closeModal = document.getElementById("close-btn");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    let currentGallery = [];
    let currentIndex = 0;

    function showModal(index) {
        if (index < 0 || index >= currentGallery.length) return;
        currentIndex = index;
        modalImg.src = currentGallery[currentIndex].src;
        modalCaption.textContent = currentGallery[currentIndex].getAttribute("data-caption");
        modal.style.display = "block";
        modal.classList.add("open");
    }

    function closeModalContent() {
        modalImg.src = "";
        modalCaption.textContent = "";
        modal.style.display = "none";
        modal.classList.remove("open");
    }

    [
        "#gallery1 .gallery-item",
        "#gallery2 .picsinthumbs",
        "#gallery3 .picsinthumbs_3",
        "#gallery4 .picsinthumbs_4",
        "#gallery5 .picsinthumbs_5",
    ].forEach((selector) => {
        const items = document.querySelectorAll(selector);
        items.forEach((item, index) => {
            item.addEventListener("click", function (e) {
                e.stopPropagation();
                currentGallery = Array.from(items);
                showModal(index);
            });
        });
    });

    modalImg.addEventListener("click", function (event) {
        event.stopPropagation();
        const imgClickX = event.clientX - modalImg.getBoundingClientRect().left;
        if (imgClickX < modalImg.getBoundingClientRect().width / 2) {
            showModal(currentIndex > 0 ? currentIndex - 1 : currentGallery.length - 1);
        } else {
            showModal(currentIndex < currentGallery.length - 1 ? currentIndex + 1 : 0);
        }
    });

    nextBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        showModal(currentIndex < currentGallery.length - 1 ? currentIndex + 1 : 0);
    });

    prevBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        showModal(currentIndex > 0 ? currentIndex - 1 : currentGallery.length - 1);
    });

    modal.addEventListener("click", function (event) {
        const clickX = event.clientX;
        const modalRect = modal.getBoundingClientRect();
        if (clickX < modalRect.left + modalRect.width / 2) {
            showModal(currentIndex > 0 ? currentIndex - 1 : currentGallery.length - 1);
        } else {
            showModal(currentIndex < currentGallery.length - 1 ? currentIndex + 1 : 0);
        }
    });

    closeModal.addEventListener("click", function (event) {
        event.stopPropagation();
        closeModalContent();
    });
});



// ---------------------------------------------------------------
// alert modal
// ---------------------------------------------------------------

window.addEventListener('load', function () {
    var alertModal = document.getElementById("myModal");
    if (!alertModal) return;
    var closeBtn = document.getElementsByClassName("close")[0];
    var modalContent = document.querySelector(".modal-content");
    alertModal.style.display = "block";
    closeBtn.onclick = function () { alertModal.style.display = "none"; };
    window.addEventListener('click', function (event) {
        if (event.target == alertModal || event.target == modalContent) {
            alertModal.style.display = "none";
        }
    });
    window.addEventListener('touchstart', function (event) {
        if (event.target == alertModal || event.target == modalContent) {
            alertModal.style.display = "none";
        }
    });
});

// ---------------------------------------------------------------
// 2025 stack
// ---------------------------------------------------------------

const stack = document.getElementById('stack');
const media = [...stack.querySelectorAll('img, video, a')];

let restoring = false;
const baseTransform = new Map();
const scrollY = new Map();

media.forEach(el => {
    const t = window.getComputedStyle(el).transform;
    baseTransform.set(el, t === 'none' ? 'translate(0px,0px)' : t);
    scrollY.set(el, 0);
    if (el.tagName === 'VIDEO') el.play();
});

// p47表示状態を更新する関数（デスクトップ・モバイル両方）
function updateP47Visibility() {
    const p47 = document.querySelector('.p47');
    if (!p47) return;
    const allHidden = media.every(el => el.classList.contains('hide'));
    if (allHidden) {
        p47.classList.remove('hide');
        p47.style.pointerEvents = 'auto';
    } else {
        p47.classList.add('hide');
        p47.style.pointerEvents = 'none';
    }
}

// 初期状態：両方hideに
const p47init = document.querySelector('.p47');
if (p47init) {
    p47init.classList.add('hide');
    p47init.style.pointerEvents = 'none';
}


// ---------------------------------------------------------------
// wheel scroll
// ---------------------------------------------------------------

document.addEventListener('wheel', e => {

    if (window.innerWidth <= 500) return;

    const p47el = document.querySelector('.p47');
    const visible = media.filter(el => !el.classList.contains('hide'));

    if (visible.length === 0) {
        if (p47el) {
            p47el.scrollTop += e.deltaY;
        }
        return;
    }

    const top = visible[visible.length - 1];
    const base = baseTransform.get(top);
    let y = scrollY.get(top) || 0;
    y -= e.deltaY;
    top.style.transform = `${base} translateY(${y}px)`;
    scrollY.set(top, y);
    updateRotation(stack);

}, { passive: false });


// ---------------------------------------------------------------
// touch scroll
// ---------------------------------------------------------------

let touchStartY = 0;

document.addEventListener('touchstart', e => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', e => {

    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;

    if (window.innerWidth <= 500) return;

    const visible = media.filter(el => !el.classList.contains('hide'));
    if (!visible.length) return;
    if (visible.length > 1) return;

    const top = visible[visible.length - 1];
    const deltaY = touchStartY - e.touches[0].clientY;
    touchStartY = e.touches[0].clientY;
    const base = baseTransform.get(top);
    let y = scrollY.get(top) || 0;
    y -= deltaY;
    top.style.transform = `${base} translateY(${y}px)`;
    scrollY.set(top, y);
    updateRotation(stack);
    e.preventDefault();

}, { passive: false });


// ---------------------------------------------------------------
// stack click
// ---------------------------------------------------------------

let mouseDownX = 0;
let mouseDownY = 0;

document.addEventListener('mousedown', (e) => {
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
});

document.addEventListener('click', (e) => {

    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;

    const dx = Math.abs(e.clientX - mouseDownX);
    const dy = Math.abs(e.clientY - mouseDownY);
    if (dx > 5 || dy > 5) return;

    if (e.target.closest('#icon-mode')) return;
    if (e.target.closest('.logoA, .logoB, .logoC')) return;
    if (e.target.closest('#modal')) return;
    if (e.target.closest('.footer')) return;
    if (e.target.closest('.header')) return;

    const visible = media.filter(el => !el.classList.contains('hide'));

    if (!restoring) {
        if (visible.length === 0) {
            restoring = true;
        } else {
            const top = visible[visible.length - 1];
            if (top.tagName === 'VIDEO') { top.pause(); top.currentTime = 0; }
            top.classList.add('hide');
        }
    }

    if (restoring) {
        const hidden = media.filter(el => el.classList.contains('hide'));
        if (hidden.length) {
            if (window.innerWidth > 500 && hidden[0].classList.contains('mobile-only')) {
                const nextHidden = media.filter(m => m.classList.contains('hide') && !m.classList.contains('mobile-only'));
                if (nextHidden.length) {
                    const next = nextHidden[0];
                    next.classList.remove('hide');
                    next.style.transform = '';
                    scrollY.set(next, 0);
                    if (next.tagName === 'VIDEO') next.play();
                }
            } else {
                const el = hidden[0];
                el.classList.remove('hide');
                el.style.transform = '';
                scrollY.set(el, 0);
                if (el.tagName === 'VIDEO') el.play();
            }
        }
        if (!media.some(el => el.classList.contains('hide') && !el.classList.contains('mobile-only'))) {
            restoring = false;
        }
    }

    updateP47Visibility();

});


// ---------------------------------------------------------------
// init
// ---------------------------------------------------------------

media.forEach(el => {
    const t = window.getComputedStyle(el).transform;
    baseTransform.set(el, t === 'none' ? 'translate(0px,0px)' : t);
    scrollY.set(el, 0);
    if (el.classList.contains('mobile-only')) {
        if (window.innerWidth > 500) {
            el.classList.add('hide');
            el.style.display = 'none';
        }
    }
    if (el.tagName === 'VIDEO') el.play();
});
