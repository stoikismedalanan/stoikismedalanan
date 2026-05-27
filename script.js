// =================================================================
// 1. PENGATURAN SCROLL (TOMBOL MUMBUL)
// =================================================================
window.addEventListener('scroll', function () {
    const btn = document.getElementById("btnMumbul");
    if (btn) {
        let posisiScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (posisiScroll > 300) {
            btn.style.display = "flex";
        } else {
            btn.style.display = "none";
        }
    }
});

function mumbul() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =================================================================
// 2. PENGATURAN MODAL & ZOOM
// =================================================================
let scale = 1;
const modal = document.getElementById("modalGambar");
const imgFull = document.getElementById("imgFull");

function bukaModal(src) {
    if (modal && imgFull) {
        modal.style.display = "flex";
        imgFull.src = src;
        scale = 1;
        imgFull.style.transform = "scale(1)";
        document.body.style.overflow = "hidden";
    }
}

function tutupModal() {
    document.getElementById("viewport-meta").setAttribute("content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
    const m1 = document.getElementById("modalGambar");
    const m2 = document.getElementById("karyaModal");
    if (m1) m1.style.display = "none";
    if (m2) m2.style.display = "none";
    document.body.style.overflow = "auto";
}

if (modal) {
    modal.addEventListener('wheel', function (event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            scale += 0.1;
        } else {
            if (scale > 0.5) scale -= 0.1;
        }
        if (imgFull) {
            imgFull.style.transform = `scale(${scale})`;
        }
    });
}

// =================================================================
// 3. LOGIKA SARING (FILTER KATEGORI)
// =================================================================
function saring(kategori, elemenTombol) {
    const kabehTombol = document.querySelectorAll('.filter-buttons button');
    kabehTombol.forEach(btn => btn.classList.remove('aktif'));

    if (elemenTombol) {
        elemenTombol.classList.add('aktif');
    }

    const kabehCard = document.querySelectorAll('.karya-card');
    kabehCard.forEach(card => {
        if (kategori === 'semua') {
            card.style.display = "flex";
        } else {
            if (card.classList.contains(kategori)) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const tombolDefault = document.querySelector('.filter-buttons button');
    if(tombolDefault) saring('semua', tombolDefault);
});

// =================================================================
// 4. FUNGSI MODAL ZOOM & SLIDER (DOT KUNING + SWIPE HP)
// =================================================================
let daftarGambarModal = [];
let indexGambarSaiki = 0;
let panggonanDrijiAwal = 0;
let panggonanDrijiAkhir = 0;

function currentSlide(dotElement, index) {
    const frame = dotElement.closest('.karya-frame');
    const slides = frame.querySelectorAll('.slide');
    const dots = frame.querySelectorAll('.dot');

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[index].classList.add('active');
    dotElement.classList.add('active');
}

function bukaModalSlider(index, elemenGambar) {
    document.getElementById("viewport-meta").setAttribute("content", 
        "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes");
    const modalUtama = document.getElementById('modalGambar');
    const imgTargetModal = document.getElementById('imgFull');
    const wadahDots = document.getElementById('modalDotsContainer');

    if (modalUtama && imgTargetModal) {
        modalUtama.style.display = "flex"; 
        document.body.style.overflow = "hidden"; 

        const wadahSlides = elemenGambar.closest('.slides-container');
        if (wadahSlides) {
            const kabehGambarKartu = Array.from(wadahSlides.querySelectorAll('img'));
            daftarGambarModal = kabehGambarKartu.map(img => img.src);
        } else {
            daftarGambarModal = [elemenGambar.src];
        }

        indexGambarSaiki = index;
        imgTargetModal.src = daftarGambarModal[indexGambarSaiki];
        scale = 1;
        imgTargetModal.style.transform = `scale(${scale})`;

        if (wadahDots) {
            wadahDots.innerHTML = ''; 
            if (daftarGambarModal.length > 1) {
                daftarGambarModal.forEach((_, i) => {
                    const dot = document.createElement('span');
                    dot.className = 'dot-modal';
                    if (i === indexGambarSaiki) dot.classList.add('active');
                    dot.onclick = () => pindahGambarModalDot(i);
                    wadahDots.appendChild(dot);
                });
            }
        }
        aktifnoSlideDrijiHP(imgTargetModal);
    }
}

function pindahGambarModalDot(indexAnyar) {
    const imgTargetModal = document.getElementById('imgFull');
    if (!imgTargetModal || daftarGambarModal.length <= 1) return;

    if (indexAnyar >= daftarGambarModal.length) indexGambarSaiki = 0;
    else if (indexAnyar < 0) indexGambarSaiki = daftarGambarModal.length - 1;
    else indexGambarSaiki = indexAnyar;

    imgTargetModal.src = daftarGambarModal[indexGambarSaiki];
    scale = 1;
    imgTargetModal.style.transform = `scale(${scale})`;

    const kabehDotModal = document.querySelectorAll('#modalDotsContainer .dot-modal');
    kabehDotModal.forEach(dot => dot.classList.remove('active'));
    if (kabehDotModal[indexGambarSaiki]) {
        kabehDotModal[indexGambarSaiki].classList.add('active');
    }
}

function aktifnoSlideDrijiHP(elemenGambar) {
    elemenGambar.ontouchstart = function (e) { panggonanDrijiAwal = e.touches[0].clientX; };
    elemenGambar.ontouchmove = function (e) { panggonanDrijiAkhir = e.touches[0].clientX; };
    elemenGambar.ontouchend = function () {
        let kacekGeser = panggonanDrijiAwal - panggonanDrijiAkhir;
        if (Math.abs(kacekGeser) > 50) {
            if (kacekGeser > 0) pindahGambarModalDot(indexGambarSaiki + 1);
            else pindahGambarModalDot(indexGambarSaiki - 1);
        }
        panggonanDrijiAwal = 0; panggonanDrijiAkhir = 0;
    };
}

function puterVidio() {
    var video = document.getElementById("vidIntro");
    if (video) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
}

// =================================================================
// 5. JS SLIDER KARTU AUTOMATIS
// =================================================================
document.addEventListener("DOMContentLoaded", function () {
    const kabehFrame = document.querySelectorAll('.karya-frame');
    kabehFrame.forEach(function (frame) {
        const gambarKapisan = frame.querySelector('img');
        if (gambarKapisan) gambarKapisan.classList.add('active');
    });

    const kabehWadahSlide = document.querySelectorAll('.slides-container');
    kabehWadahSlide.forEach(function (wadah) {
        const kabehGambar = wadah.querySelectorAll('.slide');
        const frame = wadah.closest('.karya-frame');
        const kabehDot = frame ? frame.querySelectorAll('.dot') : [];

        if (kabehGambar.length <= 1) return;

        let indexSaiki = 0;
        if (kabehDot[0]) kabehDot[0].classList.add('active');

        function muterSlide() {
            kabehGambar.forEach(img => img.classList.remove('active'));
            kabehDot.forEach(dot => dot.classList.remove('active'));

            indexSaiki = (indexSaiki + 1) % kabehGambar.length;

            kabehGambar[indexSaiki].classList.add('active');
            if (kabehDot[indexSaiki]) kabehDot[indexSaiki].classList.add('active');
        }
        setInterval(muterSlide, 3000);
    });
});