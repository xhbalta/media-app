// player.js - Reproductor universal flotante

function createPlayer() {
    if (document.getElementById('floating-player')) return;

    const playerHTML = `
        <div id="floating-player">
            <div class="player-info">
                <img id="player-cover" class="player-cover" src="" alt="cover">
                <div>
                    <div id="player-title" class="font-bold"></div>
                    <div id="player-author" class="text-xs text-gray-400"></div>
                </div>
            </div>
            <div class="player-controls">
                <button id="player-play-pause">
                    <img src="https://marca1.odoo.com/web/image/508-f876320c/play.svg" id="player-play-icon">
                </button>
                <div class="progress-bar" id="player-progress-bar">
                    <div class="progress-fill" id="player-progress-fill"></div>
                </div>
                <button id="player-close">
                    <img src="https://marca1.odoo.com/web/image/511-3d2d2e2c/compartir.svg" style="transform: rotate(45deg);">
                </button>
            </div>
            <audio id="player-audio" style="display:none"></audio>
            <video id="player-video" style="display:none"></video>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', playerHTML);

    let currentMedia = null;
    let isPlaying = false;

    const player = document.getElementById('floating-player');
    const audioEl = document.getElementById('player-audio');
    const videoEl = document.getElementById('player-video');
    const playPauseBtn = document.getElementById('player-play-pause');
    const playIcon = document.getElementById('player-play-icon');
    const progressBar = document.getElementById('player-progress-bar');
    const progressFill = document.getElementById('player-progress-fill');
    const closeBtn = document.getElementById('player-close');
    const coverImg = document.getElementById('player-cover');
    const titleEl = document.getElementById('player-title');
    const authorEl = document.getElementById('player-author');

    function togglePlay() {
        if (currentMedia) {
            if (currentMedia.paused) {
                currentMedia.play();
                playIcon.src = 'https://marca1.odoo.com/web/image/508-f876320c/pause.svg';
            } else {
                currentMedia.pause();
                playIcon.src = 'https://marca1.odoo.com/web/image/508-f876320c/play.svg';
            }
        }
    }

    function updateProgress() {
        if (currentMedia && currentMedia.duration) {
            const percent = (currentMedia.currentTime / currentMedia.duration) * 100;
            progressFill.style.width = percent + '%';
        }
    }

    function seek(e) {
        if (currentMedia && currentMedia.duration) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = clickX / rect.width;
            currentMedia.currentTime = percent * currentMedia.duration;
        }
    }

    function closePlayer() {
        if (currentMedia) {
            currentMedia.pause();
            currentMedia.currentTime = 0;
        }
        player.classList.remove('active');
        player.dataset.mediaUrl = '';
    }

    playPauseBtn.addEventListener('click', togglePlay);
    progressBar.addEventListener('click', seek);
    closeBtn.addEventListener('click', closePlayer);

    audioEl.addEventListener('timeupdate', updateProgress);
    audioEl.addEventListener('ended', () => {
        playIcon.src = 'https://marca1.odoo.com/web/image/508-f876320c/play.svg';
    });
    videoEl.addEventListener('timeupdate', updateProgress);
    videoEl.addEventListener('ended', () => {
        playIcon.src = 'https://marca1.odoo.com/web/image/508-f876320c/play.svg';
    });

    window.playEpisodeExpanded = function(mediaUrl, mediaType, coverUrlContainer, coverUrlInfo, title, detailUrl, author, next, text, allowDownload) {
        const cover = coverUrlContainer || coverUrlInfo || '';
        coverImg.src = cover;
        titleEl.textContent = title;
        authorEl.textContent = author;
        player.dataset.mediaUrl = mediaUrl;
        player.dataset.detailUrl = detailUrl;
        player.dataset.allowDownload = allowDownload;

        if (currentMedia) {
            currentMedia.pause();
            currentMedia.currentTime = 0;
        }

        if (mediaType === 'video') {
            videoEl.style.display = 'block';
            audioEl.style.display = 'none';
            videoEl.src = mediaUrl;
            currentMedia = videoEl;
        } else {
            audioEl.style.display = 'block';
            videoEl.style.display = 'none';
            audioEl.src = mediaUrl;
            currentMedia = audioEl;
        }

        currentMedia.play().catch(e => console.warn('Auto-play bloqueado:', e));
        playIcon.src = 'https://marca1.odoo.com/web/image/508-f876320c/pause.svg';
        player.classList.add('active');
    };
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPlayer);
} else {
    createPlayer();
} 
