// ---------------------------------------------------------------
// dark mode
// ---------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const iconContainer = document.getElementById("icon-mode");
    const icon = iconContainer
        ? iconContainer.querySelector("img")
        : null;

    const isTopPage = body.classList.contains("top");

    if (!iconContainer || !icon) {
        console.error("#icon-mode element or img not found!");
        return;
    }

    // load theme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        body.classList.add("mode_A");
    } else {
        body.classList.remove("mode_A");
    }

    // icon update
    function updateIcon() {

        if (body.classList.contains("mode_A")) {

            // dark mode
            icon.src = isTopPage
                ? "./bau/img/mode_y.svg"
                : "./bau/img/mode_g.svg";

        } else {

            // light mode
            icon.src = isTopPage
                ? "./bau/img/mode_g.svg"
                : "./bau/img/mode_y.svg";
        }
    }

    updateIcon();

    // click
    iconContainer.addEventListener("click", (e) => {

        // prevent global click
        e.stopPropagation();

        body.classList.toggle("mode_A");

        const newTheme = body.classList.contains("mode_A")
            ? "dark"
            : "light";

        localStorage.setItem("theme", newTheme);

        updateIcon();
    });
});



// ---------------------------------------------------------------
// clock
// ---------------------------------------------------------------

function updateTime() {

    var now = luxon.DateTime.local();

    var hours = now.hour;
    var minutes = now.minute;
    var seconds = now.second;

    var date = now.toFormat('LLLL dd yyyy');
    var timezone = now.zoneName;

    var clockElement = document.getElementById('clock');
    var dateElement = document.getElementById('date');
    var timezoneElement = document.getElementById('timezone');

    var timeString =
        formatTime(hours) + ':' +
        formatTime(minutes) + ':' +
        formatTime(seconds);

    clockElement.textContent = timeString;
    dateElement.textContent = date;

    var timeZoneAbbreviation =
        getTimeZoneAbbreviation(timezone);

    timezoneElement.textContent =
        "(" + timeZoneAbbreviation + ")";
}

updateTime();

setInterval(updateTime, 1000);

function formatTime(time) {
    return (time < 10)
        ? '0' + time
        : time;
}

function getTimeZoneAbbreviation(timezone) {

    var timeZoneAbbreviations = {

        "Asia/Tokyo": "JST",
        "Asia/Shanghai": "CST",
        "Asia/Kolkata": "IST",
        "Asia/Bangkok": "ICT",
        "Asia/Dubai": "GST",
        "Asia/Seoul": "KST",
        "Asia/Singapore": "SGT",
        "Asia/Taipei": "CST",
        "Asia/Hong_Kong": "HKT",

        "America/Los_Angeles": "PST",
        "America/New_York": "EST",

        "Europe/London": "GMT",
        "Europe/Paris": "CET",
        "Europe/Berlin": "CET",
    };

    return timeZoneAbbreviations[timezone] || timezone;
}



// ---------------------------------------------------------------
// count
// ---------------------------------------------------------------

const startDate = new Date(1720, 12, 1);

const today = new Date();

const timeDifference =
    today.getTime() - startDate.getTime();

const years = Math.floor(
    timeDifference /
    (1000 * 60 * 60 * 24 * 365)
);

const days = Math.floor(
    (
        timeDifference %
        (1000 * 60 * 60 * 24 * 365)
    ) /
    (1000 * 60 * 60 * 24)
);

const resultElement =
    document.getElementById('result');

resultElement.textContent =
    years + " years + " + days + " days";



// ---------------------------------------------------------------
// logo rotate
// ---------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {

    const contentElements = document.querySelectorAll(
        '.leftside, .gallery-container, .calendar-container, #stack'
    );

    const logoElements = document.querySelectorAll(
        '.logoA, .logoB, .logoC'
    );

    const initialRotationMap = {
        logoA: 0,
        logoB: 90,
        logoC: 0,
    };

    const maxRotationMap = {
        logoA: 30,
        logoB: 260,
        logoC: 280,
    };

    const stack =
        document.getElementById('stack');

    const media = window.media ||
        (
            stack
                ? [...stack.querySelectorAll('img, video, a, p')]
                : []
        );

    const scrollYMap =
        window.scrollYMap || new Map();

    // initial rotation
    logoElements.forEach(logoElement => {

        const logoClass =
            Array.from(logoElement.classList)
                .find(cls => cls in initialRotationMap);

        if (!logoClass) return;

        logoElement.style.transform =
            `rotate(${initialRotationMap[logoClass]}deg)`;

        // logo click
        logoElement.addEventListener('click', (e) => {

            // prevent stack click
            e.stopPropagation();

            logoElement.style.opacity = '0';

            setTimeout(() => {
                logoElement.style.display = 'none';
            }, 300);
        });
    });

    // rotation update
    function updateRotation(el) {

        let scrollPosition = 0;
        let maxScroll = 0;

        // stack
        if (el && el.id === 'stack') {

            if (!media.length) return;

            const visible =
                media.filter(m =>
                    !m.classList.contains('hide')
                );

            if (!visible.length) return;

            const top =
                visible[visible.length - 1];

            scrollPosition =
                Math.abs(
                    (scrollY?.get?.(top)) || 0
                );

            maxScroll = 3000;
        }

        // vertical
        else if (
            el.classList.contains('leftside') ||
            el.classList.contains('calendar-container')
        ) {

            scrollPosition = el.scrollTop;

            maxScroll =
                el.scrollHeight - el.clientHeight;
        }

        // horizontal
        else if (
            el.classList.contains('gallery-container')
        ) {

            scrollPosition = el.scrollLeft;

            maxScroll =
                el.scrollWidth - el.clientWidth;
        }

        else {
            return;
        }

        // apply rotation
        logoElements.forEach(logo => {

            const logoClass =
                Array.from(logo.classList)
                    .find(cls => cls in maxRotationMap);

            if (!logoClass) return;

            const base =
                initialRotationMap[logoClass];

            const max =
                maxRotationMap[logoClass];

            const progress =
                maxScroll > 0
                    ? scrollPosition / maxScroll
                    : 0;

            logo.style.transform =
                `rotate(${base + progress * max}deg)`;
        });
    }

    // scroll listeners
    contentElements.forEach(el => {

        if (el.id === 'stack') return;

        el.addEventListener('scroll', () => {
            updateRotation(el);
        });
    });

    window.updateRotation = updateRotation;
});



// ---------------------------------------------------------------
// gallery slide
// ---------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const gallery =
        document.querySelector(".gallery-container");

    const rightside =
        document.querySelector(".rightside");

    rightside.addEventListener("click", function (event) {

        const galleryWidth = gallery.clientWidth;

        const clickX =
            event.clientX -
            rightside.getBoundingClientRect().left;

        const scrollAmount = 600;

        if (clickX < galleryWidth / 2) {

            gallery.scrollLeft -= scrollAmount;

        } else {

            gallery.scrollLeft += scrollAmount;
        }
    });
});



// ---------------------------------------------------------------
// modal
// ---------------------------------------------------------------

const modal =
    document.getElementById("modal");

const modalImage =
    document.getElementById("modal-image");

const modalCaption =
    document.getElementById("modal-caption");

// gallery items
const galleryItems =
    document.querySelectorAll(
        ".gallery-container .gallery-item"
    );

galleryItems.forEach((item) => {

    item.addEventListener("click", (e) => {

        e.stopPropagation();

        modal.classList.add("open");

        modalImage.src = item.src;

        modalCaption.textContent =
            item.getAttribute("data-caption") || "";
    });
});

// thumbs
const thumbItems =
    document.querySelectorAll(
        ".thumbs-container .picsinthumbs"
    );

thumbItems.forEach((item) => {

    item.addEventListener("click", (e) => {

        e.stopPropagation();

        modal.classList.add("open");

        modalImage.src = item.src;

        modalCaption.textContent =
            item.getAttribute("data-caption") || "";
    });
});



// ---------------------------------------------------------------
// modal slideshow
// ---------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

    const modal =
        document.getElementById("modal");

    const modalImg =
        document.getElementById("modal-image");

    const modalCaption =
        document.getElementById("modal-caption");

    const closeModal =
        document.getElementById("close-btn");

    const nextBtn =
        document.getElementById("next-btn");

    const prevBtn =
        document.getElementById("prev-btn");

    let currentGallery = [];
    let currentIndex = 0;

    function showModal(index) {

        if (
            index < 0 ||
            index >= currentGallery.length
        ) return;

        currentIndex = index;

        const imgElement =
            currentGallery[currentIndex];

        modalImg.src = imgElement.src;

        modalCaption.textContent =
            imgElement.getAttribute("data-caption");

        modal.style.display = "block";

        modal.classList.add("open");
    }

    // gallery1
    const gallery1Items =
        document.querySelectorAll(
            "#gallery1 .gallery-item"
        );

    gallery1Items.forEach((item, index) => {

        item.addEventListener("click", function (e) {

            e.stopPropagation();

            currentGallery =
                Array.from(gallery1Items);

            showModal(index);
        });
    });

    // gallery2
    const gallery2Items =
        document.querySelectorAll(
            "#gallery2 .picsinthumbs"
        );

    gallery2Items.forEach((item, index) => {

        item.addEventListener("click", function (e) {

            e.stopPropagation();

            currentGallery =
                Array.from(gallery2Items);

            showModal(index);
        });
    });

    // gallery3
    const gallery3Items =
        document.querySelectorAll(
            "#gallery3 .picsinthumbs_3"
        );

    gallery3Items.forEach((item, index) => {

        item.addEventListener("click", function (e) {

            e.stopPropagation();

            currentGallery =
                Array.from(gallery3Items);

            showModal(index);
        });
    });

    // gallery4
    const gallery4Items =
        document.querySelectorAll(
            "#gallery4 .picsinthumbs_4"
        );

    gallery4Items.forEach((item, index) => {

        item.addEventListener("click", function (e) {

            e.stopPropagation();

            currentGallery =
                Array.from(gallery4Items);

            showModal(index);
        });
    });

    // gallery5
    const gallery5Items =
        document.querySelectorAll(
            "#gallery5 .picsinthumbs_5"
        );

    gallery5Items.forEach((item, index) => {

        item.addEventListener("click", function (e) {

            e.stopPropagation();

            currentGallery =
                Array.from(gallery5Items);

            showModal(index);
        });
    });

    // modal image
    modalImg.addEventListener("click", function (event) {

        event.stopPropagation();

        const imgRect =
            modalImg.getBoundingClientRect();

        const imgClickX =
            event.clientX - imgRect.left;

        if (imgClickX < imgRect.width / 2) {

            showModal(
                currentIndex > 0
                    ? currentIndex - 1
                    : currentGallery.length - 1
            );

        } else {

            showModal(
                currentIndex < currentGallery.length - 1
                    ? currentIndex + 1
                    : 0
            );
        }
    });

    // next
    nextBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        if (
            currentIndex <
            currentGallery.length - 1
        ) {

            showModal(currentIndex + 1);

        } else {

            showModal(0);
        }
    });

    // prev
    prevBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        if (currentIndex > 0) {

            showModal(currentIndex - 1);

        } else {

            showModal(
                currentGallery.length - 1
            );
        }
    });

    // modal outside click
    modal.addEventListener("click", function (event) {

        const modalRect =
            modal.getBoundingClientRect();

        const clickX = event.clientX;

        if (
            clickX <
            modalRect.left + modalRect.width / 2
        ) {

            showModal(
                currentIndex > 0
                    ? currentIndex - 1
                    : currentGallery.length - 1
            );

        } else {

            showModal(
                currentIndex < currentGallery.length - 1
                    ? currentIndex + 1
                    : 0
            );
        }
    });

    // close
    closeModal.addEventListener("click", function (event) {

        event.stopPropagation();

        closeModalContent();
    });

    function closeModalContent() {

        modalImg.src = "";

        modalCaption.textContent = "";

        modal.style.display = "none";

        modal.classList.remove("open");
    }
});



// ---------------------------------------------------------------
// alert modal
// ---------------------------------------------------------------

window.addEventListener('load', function () {

    var modal =
        document.getElementById("myModal");

    var closeBtn =
        document.getElementsByClassName("close")[0];

    var modalContent =
        document.querySelector(".modal-content");

    modal.style.display = "block";

    closeBtn.onclick = function () {
        modal.style.display = "none";
    };

    window.addEventListener('click', function (event) {

        if (
            event.target == modal ||
            event.target == modalContent
        ) {

            modal.style.display = "none";
        }
    });

    window.addEventListener('touchstart', function (event) {

        if (
            event.target == modal ||
            event.target == modalContent
        ) {

            modal.style.display = "none";
        }
    });
});



// ---------------------------------------------------------------
// 2025 stack
// ---------------------------------------------------------------

const stack =
    document.getElementById('stack');

const media =
    [...stack.querySelectorAll('img, video, a, p')];

let restoring = false;

// base transform
const baseTransform = new Map();

// scroll amount
const scrollY = new Map();

media.forEach(el => {

    const t =
        window.getComputedStyle(el).transform;

    baseTransform.set(
        el,
        t === 'none'
            ? 'translate(0px,0px)'
            : t
    );

    scrollY.set(el, 0);

    if (el.tagName === 'VIDEO') {
        el.play();
    }
});

// wheel scroll
document.addEventListener('wheel', e => {



    const visible =
        media.filter(el =>
            !el.classList.contains('hide')
        );

    if (!visible.length) return;

        // block scroll on mobile unless last item remains
    if (window.innerWidth <= 500 && visible.length > 1) return;

    const top =
        visible[visible.length - 1];

    let mediaHeight;

    if (
        top.tagName === 'IMG' ||
        top.tagName === 'A'
    ) {

        const img =
            top.tagName === 'A'
                ? top.querySelector('img')
                : top;

        mediaHeight =
            img.naturalHeight *
            (img.clientWidth / img.naturalWidth);

    } else if (top.tagName === 'VIDEO') {

        mediaHeight =
            top.videoHeight *
            (top.clientWidth / top.videoWidth);
    }

    const base =
        baseTransform.get(top);

    const match =
        base.match(
            /translate\([^\s,]+,\s*([-\d.]+)px\)/
        );

    const initialY =
        match ? parseFloat(match[1]) : 0;

    let y = scrollY.get(top) || 0;

    const scrollSpeed = 1;

    y -= e.deltaY * scrollSpeed;

    top.style.transform =
        `${base} translateY(${y}px)`;

    scrollY.set(top, y);

    updateRotation(stack);

    e.preventDefault();

}, { passive: false });

let touchStartY = 0;

document.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', e => {

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
// stack click only
// ---------------------------------------------------------------

document.addEventListener('click', (e) => {

    // darkmode button
    if (e.target.closest('#icon-mode')) return;

    // logos
    if (
        e.target.closest(
            '.logoA, .logoB, .logoC'
        )
    ) return;

    // modal
    if (e.target.closest('#modal')) return;

    // stack only
    if (!e.target.closest('#stack')) return;

    const visible =
        media.filter(el =>
            !el.classList.contains('hide')
        );

if (!restoring) {

    if (visible.length === 1) {
        restoring = true;
        // fall through to restore below
    } else {

        const top = visible[visible.length - 1];

        if (top.tagName === 'VIDEO') {
            top.pause();
            top.currentTime = 0;
        }

        top.classList.add('hide');
    }
}

if (restoring) {

    const hidden = media.filter(el => el.classList.contains('hide'));

    if (hidden.length) {

        const el = hidden[0];

        el.classList.remove('hide');
        el.style.transform = '';
        scrollY.set(el, 0);

        if (el.tagName === 'VIDEO') {
            el.play();
        }
    }

    if (!media.some(el => el.classList.contains('hide'))) {
        restoring = false;
    }
}
});


media.forEach(el => {

  const t = window.getComputedStyle(el).transform;

  baseTransform.set(
    el,
    t === 'none'
      ? 'translate(0px,0px)'
      : t
  );

  scrollY.set(el, 0);

  // ---------------------------------
  // PCで p0 を最初から hidden
  // ---------------------------------

  if (
    window.innerWidth > 500 &&
    el.classList.contains('mobile-only')
  ) {
    el.classList.add('hide');
  }

  if (el.tagName === 'VIDEO') {
    el.play();
  }
});
