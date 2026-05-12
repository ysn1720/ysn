document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const iconContainer = document.getElementById("icon-mode"); // アイコンの親要素
    const icon = iconContainer ? iconContainer.querySelector("img") : null; // アイコン画像
    const isTopPage = body.classList.contains("top"); // トップページかどうかを判定

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
            // dark mode
            icon.src = isTopPage ? "./bau/img/mode_y.svg" : "./bau/img/mode_g.svg"; 
        } else {
            // light mode
            icon.src = isTopPage ? "./bau/img/mode_g.svg" : "./bau/img/mode_y.svg"; 
        }
    }

    updateIcon();

    iconContainer.addEventListener("click", () => {
        body.classList.toggle("mode_A"); // switch mode

        const newTheme = body.classList.contains("mode_A") ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        updateIcon();
    });
});




// ----------------------------clock
function updateTime() {
var now = luxon.DateTime.local();
var hours = now.hour;
var minutes = now.minute;
var seconds = now.second;
var date = now.toFormat('LLLL dd yyyy'); // fmt 
var timezone = now.zoneName; 
var clockElement = document.getElementById('clock');
var dateElement = document.getElementById('date');
var timezoneElement = document.getElementById('timezone');

var timeString = formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds) ;

clockElement.textContent = timeString;
dateElement.textContent = date;

var timeZoneAbbreviation = getTimeZoneAbbreviation(timezone);

timezoneElement.textContent = "(" + timeZoneAbbreviation + ")";
}

updateTime();

setInterval(updateTime, 1000);

function formatTime(time) {
return (time < 10) ? '0' + time : time;
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


// ---------------------------------------------------------------count

const startDate = new Date(1720, 12, 1); // 1720年12月1日
const today = new Date();
const timeDifference = today.getTime() - startDate.getTime();
const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365)); 
const days = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24)); 
const resultElement = document.getElementById('result');
resultElement.textContent = years + " years + " + days + " days";



// ---------------------------------------------------------------logo rotate


// ---------------------------------------------------------------logo rotate

document.addEventListener('DOMContentLoaded', function () {

  const contentElements = document.querySelectorAll(
    '.leftside, .gallery-container, .calendar-container, #stack'
  );


  const logoElements = document.querySelectorAll('.logoA, .logoB, .logoC');

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


  // 2025 stackで使う外部変数（存在しないときの保険）
  const stack = document.getElementById('stack');
  const media = window.media || (stack ? [...stack.querySelectorAll('img, video, a')] : []);

  const scrollYMap = window.scrollYMap || new Map();


  // -------------------------
  // 初期ローテーション
  // -------------------------
  logoElements.forEach(logoElement => {

    const logoClass = Array.from(logoElement.classList)
      .find(cls => cls in initialRotationMap);

    if (!logoClass) return;

    logoElement.style.transform =
      `rotate(${initialRotationMap[logoClass]}deg)`;

    logoElement.addEventListener('click', () => {
      logoElement.style.opacity = '0';
      setTimeout(() => logoElement.style.display = 'none', 300);
    });
  });

  // -------------------------
  // 回転更新関数
  // -------------------------
  function updateRotation(el) {

    let scrollPosition = 0;
    let maxScroll = 0;

    // =========================
    // stack（2025）
    // =========================
    if (el && el.id === 'stack') {

      if (!media.length) return;

      const visible = media.filter(m => !m.classList.contains('hide'));
      if (!visible.length) return;

      const top = visible[visible.length - 1];

      scrollPosition = Math.abs((scrollY?.get?.(top)) || 0);
      maxScroll = 3000;
    }

    // =========================
    // vertical scroll
    // =========================
    else if (
      el.classList.contains('leftside') ||
      el.classList.contains('calendar-container')
    ) {
      scrollPosition = el.scrollTop;
      maxScroll = el.scrollHeight - el.clientHeight;
    }

    // =========================
    // horizontal scroll
    // =========================
    else if (el.classList.contains('gallery-container')) {
      scrollPosition = el.scrollLeft;
      maxScroll = el.scrollWidth - el.clientWidth;
    }

    else {
      return;
    }

    // -------------------------
    // apply rotation
    // -------------------------
    logoElements.forEach(logo => {

      const logoClass = Array.from(logo.classList)
        .find(cls => cls in maxRotationMap);

      if (!logoClass) return;

      const base = initialRotationMap[logoClass];
      const max = maxRotationMap[logoClass];

      const progress = maxScroll > 0
        ? scrollPosition / maxScroll
        : 0;

      logo.style.transform =
        `rotate(${base + progress * max}deg)`;
    });
  }

  // -------------------------
  // scroll listeners
  // -------------------------
  contentElements.forEach(el => {

    if (el.id === 'stack') {
      // wheel側で動くので scroll は補助
      return;
    }

    el.addEventListener('scroll', () => {
      updateRotation(el);
    });
  });

  // stackはwheel側から呼ぶためグローバル化
  window.updateRotation = updateRotation;
});




// gallery slide
document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".gallery-container");
  const rightside = document.querySelector(".rightside");

  // クリックイベントを追加
  rightside.addEventListener("click", function (event) {
    const galleryWidth = gallery.clientWidth;
    const clickX = event.clientX - rightside.getBoundingClientRect().left;
    const scrollAmount = 600; // スクロール量（大きく動かしたい場合は増やす）

    if (clickX < galleryWidth / 2) {
      // scroll to left
      gallery.scrollLeft -= scrollAmount;
    } else {
      // to right
      gallery.scrollLeft += scrollAmount;
    }
  });
});


// ---------------modal

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");

// add an event
const galleryItems = document.querySelectorAll(".gallery-container .gallery-item");
galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
        modal.classList.add("open");
        modalImage.src = item.src;
        modalCaption.textContent = item.getAttribute("data-caption") || "";
    });
});

// 新しく追加した .thumbs-container 内の画像にイベントを追加
const thumbItems = document.querySelectorAll(".thumbs-container .picsinthumbs");
thumbItems.forEach((item) => {
    item.addEventListener("click", () => {
        modal.classList.add("open");
        modalImage.src = item.src; // クリックした画像をモーダルに表示
        modalCaption.textContent = item.getAttribute("data-caption") || ""; // データ属性からキャプションを取得
    });
});


//modal スライドショー

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");
  const closeModal = document.getElementById("close-btn");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");

  let currentGallery = []; // To hold the images of the selected gallery
  let currentIndex = 0; // Current image index

  // Function to show modal with selected image
  function showModal(index) {
      if (index < 0 || index >= currentGallery.length) return; // Check if the index is within range

      currentIndex = index; // Update the index
      const imgElement = currentGallery[currentIndex];
      
      modalImg.src = imgElement.src;
      modalCaption.textContent = imgElement.getAttribute("data-caption");
      modal.style.display = "block";
      modal.classList.add("open"); // Show modal
  }

  // Event listener for images in gallery1
  const gallery1Items = document.querySelectorAll("#gallery1 .gallery-item");
  gallery1Items.forEach((item, index) => {
      item.addEventListener("click", function () {
          currentGallery = Array.from(gallery1Items); // Store the images of gallery1
          showModal(index);
      });
  });

  // Event listener for images in gallery2
  const gallery2Items = document.querySelectorAll("#gallery2 .picsinthumbs");
  gallery2Items.forEach((item, index) => {
      item.addEventListener("click", function () {
          currentGallery = Array.from(gallery2Items); // Store the images of gallery2
          showModal(index);
      });
  });

  // Event listener for images in gallery3
  const gallery3Items = document.querySelectorAll("#gallery3 .picsinthumbs_3");
  gallery3Items.forEach((item, index) => {
      item.addEventListener("click", function () {
          currentGallery = Array.from(gallery3Items); // Store the images of gallery3
          showModal(index);
      });
  });

  // Event listener for images in gallery4
  const gallery4Items = document.querySelectorAll("#gallery4 .picsinthumbs_4");
  gallery4Items.forEach((item, index) => {
      item.addEventListener("click", function () {
          currentGallery = Array.from(gallery4Items); // Store the images of gallery4
          showModal(index);
      });
  });

  // Event listener for images in gallery5
  const gallery5Items = document.querySelectorAll("#gallery5 .picsinthumbs_5");
  gallery5Items.forEach((item, index) => {
      item.addEventListener("click", function () {
          currentGallery = Array.from(gallery5Items); // Store the images of gallery5
          showModal(index);
      });
  });

  // Prevent the modal from closing when the image itself is clicked
  modalImg.addEventListener("click", function(event) {
      event.stopPropagation(); // Prevent event propagation to avoid closing modal
  });

  // Prevent the modal from closing when clicking on navigation buttons
  nextBtn.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent closing modal when clicking the next button
      if (currentIndex < currentGallery.length - 1) {
          showModal(currentIndex + 1); // Show next image
      } else {
          showModal(0); // If at the last image, go back to the first one
      }
  });

  prevBtn.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent closing modal when clicking the previous button
      if (currentIndex > 0) {
          showModal(currentIndex - 1); // Show previous image
      } else {
          showModal(currentGallery.length - 1); // If at the first image, go to the last one
      }
  });

// **モーダルの外側をクリックで前後の画像に切り替え**
modal.addEventListener("click", function (event) {
  const modalRect = modal.getBoundingClientRect(); // モーダルの位置とサイズ
  const clickX = event.clientX; // クリックしたX座標

  if (clickX < modalRect.left + modalRect.width / 2) {
      // **左半分をクリック → 前の画像**
      showModal(currentIndex > 0 ? currentIndex - 1 : currentGallery.length - 1);
  } else {
      // **右半分をクリック → 次の画像**
      showModal(currentIndex < currentGallery.length - 1 ? currentIndex + 1 : 0);
  }
});

// **画像の左右クリックでスライド**
modalImg.addEventListener("click", function (event) {
  const imgRect = modalImg.getBoundingClientRect(); // 画像の位置とサイズ
  const imgClickX = event.clientX - imgRect.left; // 画像内でのX座標

  if (imgClickX < imgRect.width / 2) {
      // **画像の左半分をクリック → 前の画像**
      showModal(currentIndex > 0 ? currentIndex - 1 : currentGallery.length - 1);
  } else {
      // **画像の右半分をクリック → 次の画像**
      showModal(currentIndex < currentGallery.length - 1 ? currentIndex + 1 : 0);
  }
});

 // **閉じるボタンの処理**
 closeModal.addEventListener("click", function (event) {
  event.stopPropagation(); // 他のイベントが発火しないようにする
  closeModalContent();
});

// **モーダルを閉じる関数**
function closeModalContent() {
  modalImg.src = ""; // 画像リセット
  modalCaption.textContent = ""; // キャプションリセット
  modal.style.display = "none"; // モーダルを隠す
  modal.classList.remove("open");
}
});



// // alert--------------------------------------------------------------
window.addEventListener('load', function() {
    var modal = document.getElementById("myModal");
    var closeBtn = document.getElementsByClassName("close")[0];
    var modalContent = document.querySelector(".modal-content");
  
    modal.style.display = "block";
  
    closeBtn.onclick = function() {
      modal.style.display = "none";
    }
  
    window.addEventListener('click', function(event) {
      if (event.target == modal || event.target == modalContent) {
        modal.style.display = "none";
      }
    });
  
    window.addEventListener('touchstart', function(event) {
      if (event.target == modal || event.target == modalContent) {
        modal.style.display = "none";
      }
    });
  });
  




  // 2025--------------------------------------------------------------

const stack = document.getElementById('stack');
const media = [...stack.querySelectorAll('img, video, a')];

let restoring = false;

// 初期 transform を保存
const baseTransform = new Map();
const scrollY = new Map(); // ★ ここで各要素ごとのスクロール量を保持

media.forEach(el => {
  const t = window.getComputedStyle(el).transform;
  baseTransform.set(el, t === 'none' ? 'translate(0px,0px)' : t);
  scrollY.set(el, 0); // 初期スクロール量 0
  if (el.tagName === 'VIDEO') el.play();
});

// ホイールで一番上だけスクロール
document.addEventListener('wheel', e => {

  // 500px以下では無効
  if (window.innerWidth <= 500) return;

  const visible = media.filter(el => !el.classList.contains('hide'));
  if (!visible.length) return;

  const top = visible[visible.length - 1];

  // メディアの高さ
  let mediaHeight;
  if (top.tagName === 'IMG' || top.tagName === 'A') {
    const img = top.tagName === 'A' ? top.querySelector('img') : top;
    mediaHeight = img.naturalHeight * (img.clientWidth / img.naturalWidth);
  } else if (top.tagName === 'VIDEO') {
    mediaHeight = top.videoHeight * (top.clientWidth / top.videoWidth);
  }

  // 初期 transform Y
  const base = baseTransform.get(top);
  const match = base.match(/translate\([^\s,]+,\s*([-\d.]+)px\)/);
  const initialY = match ? parseFloat(match[1]) : 0;

  // ★ 現在のスクロール量から始める
  let y = scrollY.get(top) || 0;
  const scrollSpeed = 1; // 速度調整
  y -= e.deltaY * scrollSpeed;

  // 上下無限スクロール
  top.style.transform = `${base} translateY(${y}px)`;

  // スクロール量を保存
  scrollY.set(top, y);
  // 追加
updateRotation(stack);

  e.preventDefault();
}, { passive: false });

// クリックで消す／復活
document.addEventListener('click', () => {
  const visible = media.filter(el => !el.classList.contains('hide'));
  if (!restoring) {
    if (visible.length) {
      const top = visible[visible.length - 1];
      if (top.tagName === 'VIDEO') {
        top.pause();
        top.currentTime = 0;
      }
      top.classList.add('hide');
    }
    if (!media.some(el => !el.classList.contains('hide'))) restoring = true;
  } else {
    const hidden = media.filter(el => el.classList.contains('hide'));
    if (hidden.length) {
      const el = hidden[0];
      el.classList.remove('hide');
      el.style.transform = ''; // 復活時は初期位置
      scrollY.set(el, 0); // スクロール量リセット
      if (el.tagName === 'VIDEO') el.play();
    }
    if (!media.some(el => el.classList.contains('hide'))) restoring = false;
  }
});

  
  
  
