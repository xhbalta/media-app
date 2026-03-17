// player.js - Reproductor Universal Móvil (Versión Profesional)
(function() {
  // Evitar múltiples instancias
  if (document.getElementById('playerUniversal')) return;

  // ==================== ESTILOS ====================
  const style = document.createElement('style');
  style.textContent = `
    /* Variables y reset */
    #playerUniversal * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    #playerUniversal {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      -webkit-tap-highlight-color: transparent;
    }
    /* Contenedor principal */
    .player-universal {
      display: none; /* se muestra al cargar un medio */
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
    }
    /* ===== MODO MINIMIZADO ===== */
    .player-minimized {
      background: rgba(0,0,0,0.95);
      backdrop-filter: blur(10px);
      color: white;
      border-radius: 16px 16px 0 0;
      box-shadow: 0 -8px 25px rgba(0,0,0,0.5);
      overflow: hidden;
      position: relative;
    }
    .minimized-progress {
      width: 100%;
      height: 4px;
      background: rgba(255,255,255,0.2);
      cursor: pointer;
    }
    .minimized-progress-bar {
      height: 100%;
      background: #ec5b13;
      width: 0%;
      transition: width 0.1s linear;
    }
    .minimized-content {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      gap: 12px;
    }
    .minimized-cover {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
      background: #333;
      flex-shrink: 0;
    }
    .minimized-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .minimized-info {
      flex: 1;
      min-width: 0;
    }
    .minimized-title {
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .minimized-author {
      font-size: 12px;
      opacity: 0.7;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .minimized-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .minimized-controls button {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
    }
    .minimized-controls button svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
      stroke: currentColor;
    }
    .minimized-controls button.active svg {
      color: #ec5b13;
      fill: #ec5b13;
    }
    .minimized-controls .play-pause-mini {
      background: #ec5b13;
      border-radius: 50%;
      width: 36px;
      height: 36px;
    }
    .minimized-controls .play-pause-mini svg {
      width: 20px;
      height: 20px;
      fill: white;
    }

    /* ===== MODO EXPANDIDO ===== */
    .player-expanded {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: linear-gradient(180deg, #4b2b1a 0%, #000000 100%);
      color: white;
      display: flex;
      flex-direction: column;
      z-index: 10000;
      overflow-y: auto;
      padding: 20px 16px 30px;
      box-sizing: border-box;
    }
    /* capa adicional de gradiente */
    .expanded-bg-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%);
      pointer-events: none;
      z-index: -1;
    }
    .expanded-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .media-mode-toggle {
      display: flex;
      background: rgba(34,34,34,0.8);
      border-radius: 30px;
      padding: 4px;
    }
    .media-mode-toggle button {
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.6);
      font-weight: 600;
      font-size: 14px;
      padding: 6px 16px;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .media-mode-toggle button.active {
      background: #333;
      color: white;
    }
    .minimize-btn {
      background: rgba(0,0,0,0.5);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
    }
    .minimize-btn svg {
      width: 24px;
      height: 24px;
      stroke: white;
    }

    .expanded-cover {
      max-width: 300px;
      margin: 0 auto 24px;
      width: 100%;
      aspect-ratio: 1/1;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .expanded-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .expanded-info {
      text-align: center;
      margin-bottom: 24px;
    }
    .expanded-info h1 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 4px;
      padding: 0 20px;
    }
    .expanded-info p {
      font-size: 16px;
      opacity: 0.8;
    }
    .add-to-playlist {
      margin-top: 8px;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
    }
    .add-to-playlist svg {
      width: 28px;
      height: 28px;
      stroke: white;
    }

    .expanded-progress {
      margin-bottom: 20px;
    }
    .progress-bar {
      width: 100%;
      height: 5px;
      background: rgba(255,255,255,0.2);
      border-radius: 3px;
      cursor: pointer;
      position: relative;
    }
    .progress-fill {
      height: 100%;
      background: #ec5b13;
      width: 0%;
      border-radius: 3px;
      position: relative;
    }
    .progress-handle {
      width: 14px;
      height: 14px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      right: -7px;
      transform: translateY(-50%);
      opacity: 0;
      transition: opacity 0.2s;
    }
    .progress-bar:hover .progress-handle {
      opacity: 1;
    }
    .time-info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-top: 6px;
      opacity: 0.8;
    }

    .expanded-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
    }
    .expanded-controls button {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .expanded-controls button svg {
      width: 30px;
      height: 30px;
      stroke: currentColor;
      fill: currentColor;
    }
    .expanded-controls .play-pause-expanded {
      background: #ec5b13;
      border-radius: 50%;
      width: 60px;
      height: 60px;
    }
    .expanded-controls .play-pause-expanded svg {
      width: 30px;
      height: 30px;
      fill: white;
    }
    .speed-timer {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      justify-content: center;
    }
    .speed-timer button {
      background: rgba(34,34,34,0.8);
      border: none;
      color: white;
      border-radius: 30px;
      padding: 8px 20px;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    .speed-timer button svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 8px;
      margin-bottom: 24px;
      scrollbar-width: none;
    }
    .action-buttons::-webkit-scrollbar {
      display: none;
    }
    .action-btn {
      flex: 0 0 auto;
      background: rgba(34,34,34,0.8);
      border: none;
      color: white;
      border-radius: 30px;
      padding: 10px 18px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    .action-btn svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      fill: currentColor;
    }
    .action-btn.active svg {
      color: #ec5b13;
      fill: #ec5b13;
    }

    .highlight-bar {
      background: rgba(34,34,34,0.8);
      border-radius: 16px;
      padding: 14px 18px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
    .highlight-bar span {
      font-size: 16px;
      font-weight: 500;
    }

    .tabs {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
    }
    .tabs a {
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      padding: 8px 0;
      cursor: pointer;
    }
    .tabs a.active {
      color: white;
      border-bottom: 2px solid #ec5b13;
    }

    .tab-panel {
      display: none;
    }
    .tab-panel.active {
      display: block;
    }
    .next-items, .recomendados-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 300px;
      overflow-y: auto;
    }
    .next-item, .recomendado-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      background: rgba(34,34,34,0.6);
      border-radius: 8px;
      cursor: pointer;
    }
    .next-item img, .recomendado-item img {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      object-fit: cover;
    }
    .next-item span, .recomendado-item span {
      font-size: 14px;
      flex: 1;
    }
    .next-item button, .recomendado-item button {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
    }

    .detalles-content {
      background: rgba(34,34,34,0.6);
      border-radius: 12px;
      padding: 16px;
      max-height: 300px;
      overflow-y: auto;
    }
    .detalles-content h4 {
      margin-bottom: 8px;
    }
    .detalles-content p {
      font-size: 14px;
      opacity: 0.9;
      line-height: 1.5;
    }

    .biblioteca-section {
      background: rgba(34,34,34,0.6);
      border-radius: 12px;
      padding: 16px;
    }
    .biblioteca-section h4 {
      margin-bottom: 12px;
    }
    .likes-view {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      margin-bottom: 16px;
    }
    .likes-view .likes-item {
      flex: 0 0 80px;
      text-align: center;
    }
    .likes-view .likes-item img {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
      margin-bottom: 4px;
    }
    .likes-view .likes-item span {
      font-size: 12px;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .playlist-items {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 200px;
      overflow-y: auto;
    }
    .playlist-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      background: rgba(0,0,0,0.3);
      border-radius: 8px;
    }
    .playlist-item img {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      object-fit: cover;
    }
    .playlist-item span {
      flex: 1;
      font-size: 14px;
    }
    .playlist-item .item-controls {
      display: flex;
      gap: 8px;
    }
    .playlist-item button {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
    }

    /* Panel de temporizador y velocidad */
    .panel-overlay {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(0,0,0,0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px 20px 0 0;
      padding: 24px;
      z-index: 10010;
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }
    .panel-overlay.active {
      transform: translateY(0);
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .panel-header h3 {
      font-size: 18px;
    }
    .close-panel {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
    }
    .timer-options {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }
    .timer-options button {
      background: #333;
      border: none;
      color: white;
      border-radius: 30px;
      padding: 12px 24px;
      font-size: 16px;
      cursor: pointer;
      flex: 1 0 auto;
      max-width: 150px;
    }
    .timer-options button.selected {
      background: #ec5b13;
    }
    #timerCountdown {
      text-align: center;
    }
    #timerCountdown span {
      font-size: 48px;
      font-weight: bold;
    }
    #deactivateTimer {
      background: white;
      color: black;
      border: none;
      border-radius: 30px;
      padding: 12px 24px;
      margin-top: 20px;
      cursor: pointer;
    }
    .speed-slider {
      width: 100%;
      margin: 20px 0;
    }
    .speed-labels {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      opacity: 0.7;
    }
    /* utilidades */
    .hidden {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  // ==================== HTML ====================
  const playerHTML = `
    <div id="playerUniversal" class="player-universal">
      <!-- MODO MINIMIZADO -->
      <div id="playerMinimized" class="player-minimized hidden">
        <div class="minimized-progress" id="minimizedProgressContainer">
          <div class="minimized-progress-bar" id="minimizedProgressBar"></div>
        </div>
        <div class="minimized-content">
          <div class="minimized-cover">
            <img id="minimizedCover" src="" alt="cover">
          </div>
          <div class="minimized-info">
            <div class="minimized-title" id="minimizedTitle"></div>
            <div class="minimized-author" id="minimizedAuthor"></div>
          </div>
          <div class="minimized-controls">
            <button id="minimizedFavorite" class="favorite-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke-width="2"/>
              </svg>
            </button>
            <button class="play-pause-mini" id="minimizedPlayPause">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <button id="minimizedNext">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z"/>
              </svg>
            </button>
            <button id="minimizedExpand">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 15l7 7 7-7M5 9l7-7 7 7" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- MODO EXPANDIDO -->
      <div id="playerExpanded" class="player-expanded hidden">
        <div class="expanded-bg-overlay"></div>
        <div class="expanded-header">
          <div class="media-mode-toggle" id="mediaModeToggle">
            <button class="active" data-mode="audio">Audio</button>
            <button data-mode="video">Video</button>
          </div>
          <button class="minimize-btn" id="expandedMinimize">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 9l-7 7-7-7" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <div class="expanded-cover">
          <img id="expandedCover" src="" alt="cover">
        </div>

        <div class="expanded-info">
          <h1 id="expandedTitle">Cargando...</h1>
          <p id="expandedAuthor"></p>
          <button class="add-to-playlist" id="expandedAddPlaylist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <div class="expanded-progress">
          <div class="progress-bar" id="expandedProgressContainer">
            <div class="progress-fill" id="expandedProgressFill">
              <div class="progress-handle"></div>
            </div>
          </div>
          <div class="time-info">
            <span id="expandedCurrentTime">00:00</span>
            <span id="expandedDuration">00:00</span>
          </div>
        </div>

        <div class="expanded-controls">
          <button id="expandedRewind">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="1.5"/>
            </svg>
          </button>
          <button id="expandedPrevious">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6L18 6v12z"/>
            </svg>
          </button>
          <button class="play-pause-expanded" id="expandedPlayPause">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <button id="expandedNext">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z"/>
            </svg>
          </button>
          <button id="expandedForward">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 4v5h-.582m0 0a8.001 8.001 0 00-15.356 2m15.356-2H15M4 20v-5h.581m0 0a8.003 8.003 0 0015.357-2m-15.357 2H9" stroke-width="1.5"/>
            </svg>
          </button>
        </div>

        <div class="speed-timer">
          <button id="speedButton">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>
            </svg>
            <span id="speedValue">1x</span>
          </button>
          <button id="timerButton">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>
            </svg>
            <span id="timerLabel">Temporizador</span>
          </button>
        </div>

        <div class="action-buttons">
          <button class="action-btn" id="actionLike">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke-width="2"/>
            </svg>
            <span>Me gusta</span>
          </button>
          <button class="action-btn" id="actionDownload">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-width="2"/>
            </svg>
            <span>Descargar</span>
          </button>
          <button class="action-btn" id="actionShare">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" stroke-width="2"/>
            </svg>
            <span>Compartir</span>
          </button>
          <button class="action-btn" id="actionRepeat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2"/>
            </svg>
            <span>Repetir</span>
          </button>
          <button class="action-btn" id="actionQueue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h8m-8 6h16" stroke-width="2"/>
            </svg>
            <span>Cola</span>
          </button>
          <button class="action-btn" id="actionDetails">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>
            </svg>
            <span>Detalles</span>
          </button>
          <button class="action-btn" id="actionLibrary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-width="2"/>
            </svg>
            <span>Biblioteca</span>
          </button>
        </div>

        <div class="highlight-bar" id="programaDelDia">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
            <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" stroke-width="2"/>
          </svg>
          <span>Programa del Día</span>
        </div>

        <div class="tabs">
          <a href="#" class="active" data-tab="next">A continuación</a>
          <a href="#" data-tab="details">Detalles</a>
          <a href="#" data-tab="library">Biblioteca</a>
        </div>

        <!-- Paneles de pestañas -->
        <div id="tabNext" class="tab-panel active">
          <div class="next-items" id="nextList"></div>
          <div class="recomendados-items" id="recomendadosList"></div>
        </div>
        <div id="tabDetails" class="tab-panel">
          <div class="detalles-content" id="detailsContent">
            <h4>Descripción</h4>
            <p id="episodeDescription"></p>
          </div>
        </div>
        <div id="tabLibrary" class="tab-panel">
          <div class="biblioteca-section">
            <h4>Tus me gusta</h4>
            <div class="likes-view" id="likesView"></div>
            <h4 style="margin-top: 16px;">Tu lista</h4>
            <div class="playlist-items" id="playlistView"></div>
          </div>
        </div>
      </div>

      <!-- Panel flotante para temporizador/velocidad -->
      <div id="panelOverlay" class="panel-overlay">
        <div class="panel-header">
          <h3 id="panelTitle">Temporizador</h3>
          <button class="close-panel" id="closePanel">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="white">
              <path d="M6 18L18 6M6 6l12 12" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div id="timerPanel" class="panel-content">
          <div class="timer-options" id="timerOptions">
            <button data-minutes="5">5 min</button>
            <button data-minutes="10">10 min</button>
            <button data-minutes="15">15 min</button>
            <button data-minutes="30">30 min</button>
            <button data-minutes="45">45 min</button>
            <button data-minutes="60">1 hora</button>
            <button data-minutes="end">Fin del episodio</button>
          </div>
          <div id="timerCountdown" style="display: none;">
            <span id="countdownDisplay">00:00</span>
            <button id="deactivateTimer">Desactivar</button>
          </div>
        </div>
        <div id="speedPanel" class="panel-content" style="display: none;">
          <input type="range" id="speedSlider" min="0.25" max="2" step="0.25" value="1" class="speed-slider">
          <div class="speed-labels">
            <span>0.25x</span><span>0.5x</span><span>0.75x</span><span>1x</span><span>1.25x</span><span>1.5x</span><span>1.75x</span><span>2x</span>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', playerHTML);

  // ==================== CONSTANTES Y VARIABLES ====================
  const playerUniversal = document.getElementById('playerUniversal');
  const playerMinimized = document.getElementById('playerMinimized');
  const playerExpanded = document.getElementById('playerExpanded');
  const panelOverlay = document.getElementById('panelOverlay');

  // Elementos minimizados
  const minimizedCover = document.getElementById('minimizedCover');
  const minimizedTitle = document.getElementById('minimizedTitle');
  const minimizedAuthor = document.getElementById('minimizedAuthor');
  const minimizedPlayPause = document.getElementById('minimizedPlayPause');
  const minimizedFavorite = document.getElementById('minimizedFavorite');
  const minimizedNext = document.getElementById('minimizedNext');
  const minimizedExpand = document.getElementById('minimizedExpand');
  const minimizedProgressContainer = document.getElementById('minimizedProgressContainer');
  const minimizedProgressBar = document.getElementById('minimizedProgressBar');

  // Elementos expandidos
  const expandedCover = document.getElementById('expandedCover');
  const expandedTitle = document.getElementById('expandedTitle');
  const expandedAuthor = document.getElementById('expandedAuthor');
  const expandedPlayPause = document.getElementById('expandedPlayPause');
  const expandedRewind = document.getElementById('expandedRewind');
  const expandedPrevious = document.getElementById('expandedPrevious');
  const expandedNext = document.getElementById('expandedNext');
  const expandedForward = document.getElementById('expandedForward');
  const expandedProgressContainer = document.getElementById('expandedProgressContainer');
  const expandedProgressFill = document.getElementById('expandedProgressFill');
  const expandedCurrentTime = document.getElementById('expandedCurrentTime');
  const expandedDuration = document.getElementById('expandedDuration');
  const expandedAddPlaylist = document.getElementById('expandedAddPlaylist');
  const speedValue = document.getElementById('speedValue');
  const speedSlider = document.getElementById('speedSlider');
  const timerButton = document.getElementById('timerButton');
  const timerOptions = document.getElementById('timerOptions');
  const timerCountdown = document.getElementById('timerCountdown');
  const countdownDisplay = document.getElementById('countdownDisplay');
  const deactivateTimer = document.getElementById('deactivateTimer');
  const actionLike = document.getElementById('actionLike');
  const actionDownload = document.getElementById('actionDownload');
  const actionShare = document.getElementById('actionShare');
  const actionRepeat = document.getElementById('actionRepeat');
  const actionQueue = document.getElementById('actionQueue');
  const actionDetails = document.getElementById('actionDetails');
  const actionLibrary = document.getElementById('actionLibrary');
  const programaDelDia = document.getElementById('programaDelDia');
  const mediaModeButtons = document.querySelectorAll('.media-mode-toggle button');
  const minimizeBtn = document.getElementById('expandedMinimize');
  const closePanel = document.getElementById('closePanel');
  const tabs = document.querySelectorAll('.tabs a');
  const nextListEl = document.getElementById('nextList');
  const recomendadosListEl = document.getElementById('recomendadosList');
  const detailsContent = document.getElementById('detailsContent');
  const likesView = document.getElementById('likesView');
  const playlistView = document.getElementById('playlistView');

  // Estado del reproductor
  let currentMedia = null;
  let isPlaying = false;
  let isMuted = false;
  let currentVolume = 1;
  let playbackRate = 1;
  let repeatMode = 0; // 0: no repeat, 1: repeat one, 2: repeat all
  let timerEndTime = null;
  let timerInterval = null;
  let isFavorite = false;
  let playlist = JSON.parse(localStorage.getItem('playlist')) || [];
  let likes = JSON.parse(localStorage.getItem('likes')) || [];
  let history = JSON.parse(localStorage.getItem('history')) || [];
  let nextList = [];
  let recomendados = [];

  // Elemento de audio/vídeo
  const audioElement = new Audio();
  audioElement.volume = currentVolume;
  audioElement.preload = 'metadata';

  // ==================== FUNCIONES AUXILIARES ====================
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function updateProgress() {
    if (!audioElement.duration) return;
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    minimizedProgressBar.style.width = percent + '%';
    expandedProgressFill.style.width = percent + '%';
    expandedCurrentTime.textContent = formatTime(audioElement.currentTime);
    expandedDuration.textContent = formatTime(audioElement.duration);
  }

  function setPlaying(playing) {
    isPlaying = playing;
    if (playing) {
      audioElement.play();
      minimizedPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      expandedPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    } else {
      audioElement.pause();
      minimizedPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      expandedPlayPause.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    }
  }

  function loadMedia(media) {
    currentMedia = media;
    audioElement.src = media.mediaUrl;
    audioElement.load();
    // Actualizar portadas y textos
    minimizedCover.src = media.coverUrl || '';
    expandedCover.src = media.coverUrl || '';
    minimizedTitle.textContent = media.title || '';
    expandedTitle.textContent = media.title || '';
    minimizedAuthor.textContent = media.author || '';
    expandedAuthor.textContent = media.author || '';
    detailsContent.querySelector('p').textContent = media.description || 'Sin descripción';
    // Verificar si está en favoritos
    isFavorite = likes.some(item => item.mediaUrl === media.mediaUrl);
    updateFavoriteButton();
    // Mostrar el reproductor
    playerUniversal.style.display = 'block';
    playerMinimized.classList.remove('hidden');
    playerExpanded.classList.add('hidden');
    setPlaying(true);
  }

  function updateFavoriteButton() {
    const color = isFavorite ? '#ec5b13' : 'white';
    minimizedFavorite.style.color = color;
    actionLike.style.color = color;
    actionLike.querySelector('span').textContent = isFavorite ? 'Te gusta' : 'Me gusta';
  }

  function toggleFavorite() {
    if (!currentMedia) return;
    if (isFavorite) {
      likes = likes.filter(item => item.mediaUrl !== currentMedia.mediaUrl);
    } else {
      likes.unshift(currentMedia);
    }
    localStorage.setItem('likes', JSON.stringify(likes));
    isFavorite = !isFavorite;
    updateFavoriteButton();
    renderLikes();
  }

  function renderLikes() {
    likesView.innerHTML = '';
    if (likes.length === 0) {
      likesView.innerHTML = '<div class="no-items">No hay episodios con me gusta</div>';
      return;
    }
    likes.forEach(item => {
      const div = document.createElement('div');
      div.className = 'likes-item';
      div.innerHTML = `
        <img src="${item.coverUrl || ''}" alt="cover">
        <span>${item.title || ''}</span>
      `;
      div.addEventListener('click', () => loadMedia(item));
      likesView.appendChild(div);
    });
  }

  function renderPlaylist() {
    playlistView.innerHTML = '';
    if (playlist.length === 0) {
      playlistView.innerHTML = '<div class="no-items">Tu lista está vacía</div>';
      return;
    }
    playlist.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'playlist-item';
      div.innerHTML = `
        <img src="${item.coverUrl || ''}" alt="cover">
        <span>${item.title || ''}</span>
        <div class="item-controls">
          <button class="playlist-play" data-index="${index}">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <button class="playlist-remove" data-index="${index}">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" stroke-width="2"/>
            </svg>
          </button>
        </div>
      `;
      div.querySelector('.playlist-play').addEventListener('click', (e) => {
        e.stopPropagation();
        loadMedia(item);
      });
      div.querySelector('.playlist-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        playlist.splice(index, 1);
        localStorage.setItem('playlist', JSON.stringify(playlist));
        renderPlaylist();
      });
      playlistView.appendChild(div);
    });
  }

  function saveState() {
    // Guardar estado relevante en localStorage si se desea
  }

  // ==================== EVENTOS ====================
  audioElement.addEventListener('timeupdate', updateProgress);
  audioElement.addEventListener('loadedmetadata', updateProgress);
  audioElement.addEventListener('ended', () => {
    if (repeatMode === 1) {
      audioElement.currentTime = 0;
      setPlaying(true);
    } else if (repeatMode === 2) {
      audioElement.currentTime = 0;
      setPlaying(true);
    } else {
      // Siguiente canción si existe
      if (nextList.length > 0) {
        loadMedia(nextList[0]);
      } else {
        setPlaying(false);
      }
    }
  });

  // Controles minimizados
  minimizedPlayPause.addEventListener('click', () => setPlaying(!isPlaying));
  minimizedNext.addEventListener('click', () => {
    if (nextList.length > 0) loadMedia(nextList[0]);
  });
  minimizedFavorite.addEventListener('click', toggleFavorite);
  minimizedExpand.addEventListener('click', () => {
    playerMinimized.classList.add('hidden');
    playerExpanded.classList.remove('hidden');
  });

  // Controles expandidos
  expandedPlayPause.addEventListener('click', () => setPlaying(!isPlaying));
  expandedRewind.addEventListener('click', () => {
    audioElement.currentTime = Math.max(0, audioElement.currentTime - 15);
  });
  expandedForward.addEventListener('click', () => {
    audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 15);
  });
  expandedPrevious.addEventListener('click', () => {
    if (history.length > 1) {
      const prev = history[history.length - 2];
      loadMedia(prev);
    } else {
      audioElement.currentTime = 0;
    }
  });
  expandedNext.addEventListener('click', () => {
    if (nextList.length > 0) {
      loadMedia(nextList[0]);
    }
  });
  minimizeBtn.addEventListener('click', () => {
    playerExpanded.classList.add('hidden');
    playerMinimized.classList.remove('hidden');
  });

  expandedAddPlaylist.addEventListener('click', () => {
    if (!currentMedia) return;
    if (!playlist.some(item => item.mediaUrl === currentMedia.mediaUrl)) {
      playlist.unshift(currentMedia);
      localStorage.setItem('playlist', JSON.stringify(playlist));
      renderPlaylist();
    }
  });

  // Progreso
  function seekFromEvent(e, container, fill) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    let percent = (x / width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    if (audioElement.duration) {
      audioElement.currentTime = (percent / 100) * audioElement.duration;
    }
  }
  minimizedProgressContainer.addEventListener('click', (e) => seekFromEvent(e, minimizedProgressContainer, minimizedProgressBar));
  expandedProgressContainer.addEventListener('click', (e) => seekFromEvent(e, expandedProgressContainer, expandedProgressFill));

  // Velocidad
  speedButton.addEventListener('click', () => {
    panelTitle.textContent = 'Velocidad';
    document.getElementById('timerPanel').style.display = 'none';
    document.getElementById('speedPanel').style.display = 'block';
    panelOverlay.classList.add('active');
  });
  speedSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    audioElement.playbackRate = val;
    speedValue.textContent = val.toFixed(2) + 'x';
  });

  // Temporizador
  timerButton.addEventListener('click', () => {
    panelTitle.textContent = 'Temporizador';
    document.getElementById('speedPanel').style.display = 'none';
    document.getElementById('timerPanel').style.display = 'block';
    panelOverlay.classList.add('active');
  });
  timerOptions.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const minutes = btn.dataset.minutes;
    if (minutes === 'end') {
      // Programar para el final del episodio
      timerEndTime = audioElement.duration - audioElement.currentTime;
    } else {
      timerEndTime = parseInt(minutes) * 60;
    }
    timerOptions.style.display = 'none';
    timerCountdown.style.display = 'block';
    panelOverlay.classList.remove('active');
    // Iniciar cuenta atrás
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (timerEndTime <= 0) {
        setPlaying(false);
        clearInterval(timerInterval);
        timerCountdown.style.display = 'none';
        timerOptions.style.display = 'flex';
      } else {
        timerEndTime--;
        countdownDisplay.textContent = formatTime(timerEndTime);
      }
    }, 1000);
  });
  deactivateTimer.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerCountdown.style.display = 'none';
    timerOptions.style.display = 'flex';
  });
  closePanel.addEventListener('click', () => {
    panelOverlay.classList.remove('active');
  });

  // Acciones
  actionLike.addEventListener('click', toggleFavorite);
  actionDownload.addEventListener('click', () => {
    if (currentMedia?.mediaUrl) {
      window.open(currentMedia.mediaUrl, '_blank');
    }
  });
  actionShare.addEventListener('click', () => {
    if (navigator.share && currentMedia) {
      navigator.share({
        title: currentMedia.title,
        text: currentMedia.description,
        url: currentMedia.mediaUrl,
      });
    } else {
      alert('Compartir no soportado');
    }
  });
  actionRepeat.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    const texts = ['Repetir', 'Repetir 1', 'Repetir todo'];
    actionRepeat.querySelector('span').textContent = texts[repeatMode];
  });
  actionQueue.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="next"]').classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tabNext').classList.add('active');
  });
  actionDetails.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="details"]').classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tabDetails').classList.add('active');
  });
  actionLibrary.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector('[data-tab="library"]').classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tabLibrary').classList.add('active');
    renderLikes();
    renderPlaylist();
  });

  // Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      if (target === 'next') document.getElementById('tabNext').classList.add('active');
      if (target === 'details') document.getElementById('tabDetails').classList.add('active');
      if (target === 'library') {
        document.getElementById('tabLibrary').classList.add('active');
        renderLikes();
        renderPlaylist();
      }
    });
  });

  // Programa del día
  programaDelDia.addEventListener('click', () => {
    // Aquí podrías cargar un episodio destacado
  });

  // Modo audio/vídeo (simplificado, sólo cambia iconos)
  mediaModeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      mediaModeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Aquí se podría cambiar a video si el medio lo soporta
    });
  });

  // ==================== API PÚBLICA ====================
  window.playEpisode = (mediaUrl, mediaType = 'audio', coverUrl = '', title = '', author = '', description = '', next = [], recomendados = []) => {
    const media = { mediaUrl, mediaType, coverUrl, title, author, description };
    nextList = next || [];
    recomendados = recomendados || [];
    loadMedia(media);
    // Guardar en historial
    history.push(media);
    if (history.length > 50) history.shift();
    localStorage.setItem('history', JSON.stringify(history));
    // Renderizar listas
    renderNextList();
    renderRecomendados();
  };

  window.playEpisodeExpanded = (...args) => {
    window.playEpisode(...args);
    playerMinimized.classList.add('hidden');
    playerExpanded.classList.remove('hidden');
  };

  window.togglePlayer = () => {
    if (playerExpanded.classList.contains('hidden')) {
      playerMinimized.classList.add('hidden');
      playerExpanded.classList.remove('hidden');
    } else {
      playerExpanded.classList.add('hidden');
      playerMinimized.classList.remove('hidden');
    }
  };

  function renderNextList() {
    nextListEl.innerHTML = '';
    if (nextList.length === 0) {
      nextListEl.innerHTML = '<div class="no-items">No hay siguientes episodios</div>';
      return;
    }
    nextList.forEach(item => {
      const div = document.createElement('div');
      div.className = 'next-item';
      div.innerHTML = `
        <img src="${item.coverUrl || ''}" alt="cover">
        <span>${item.title || ''}</span>
        <button class="play-next">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      `;
      div.querySelector('.play-next').addEventListener('click', () => loadMedia(item));
      nextListEl.appendChild(div);
    });
  }

  function renderRecomendados() {
    recomendadosListEl.innerHTML = '';
    if (recomendados.length === 0) {
      recomendadosListEl.innerHTML = '';
      return;
    }
    recomendados.forEach(item => {
      const div = document.createElement('div');
      div.className = 'recomendado-item';
      div.innerHTML = `
        <img src="${item.coverUrl || ''}" alt="cover">
        <span>${item.title || ''}</span>
        <button class="play-rec">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      `;
      div.querySelector('.play-rec').addEventListener('click', () => loadMedia(item));
      recomendadosListEl.appendChild(div);
    });
  }

  // Inicializar listas
  renderPlaylist();
  renderLikes();

  // Exponer también funciones para añadir a playlist, etc.
  window.addToPlaylist = (media) => {
    if (!playlist.some(item => item.mediaUrl === media.mediaUrl)) {
      playlist.unshift(media);
      localStorage.setItem('playlist', JSON.stringify(playlist));
      renderPlaylist();
    }
  };
})();
