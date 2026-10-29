export const SELECTORS = {
  nowPlayingBar: '[data-testid="now-playing-bar"]',
  playPauseButton: 'button[data-testid="control-button-playpause"]',
  nextButton: 'button[data-testid="control-button-skip-forward"]',
  previousButton: 'button[data-testid="control-button-skip-back"]',
  repeatButton: 'button[data-testid="control-button-repeat"]',
  muteButton: 'button[data-testid="volume-bar-toggle-mute-button"]',
  volumeBar: 'div[data-testid="volume-bar"]',
  progressBar: 'div[data-testid="playback-progressbar"]',
  playbackPosition: 'div[data-testid="playback-position"]',
  trackTitle:
    '[data-testid="now-playing-bar"] [data-testid="track-info-name"], [data-testid="now-playing-bar"] [data-testid="context-item-info-title"], [data-testid="now-playing-bar"] [data-testid="context-item-link"], [data-testid="now-playing-bar"] a[href*="/track/"], [data-testid="now-playing-bar"] a[href*="/episode/"], [data-testid="track-info-name"], [data-testid="context-item-info-title"], [data-testid="context-item-link"], [data-testid="now-playing-widget"] [data-testid="context-item-link"], [data-testid="now-playing-widget"] a[href*="/track/"], [data-testid="now-playing-widget"] a[href*="/episode/"]',
  trackArtist:
    '[data-testid="now-playing-bar"] [data-testid="track-info-artists"] a, [data-testid="now-playing-bar"] [data-testid="track-info-artists"], [data-testid="now-playing-bar"] a[data-testid="context-item-info-artist"], [data-testid="now-playing-bar"] [data-testid="context-item-info-subtitles"] a, [data-testid="now-playing-bar"] a[href*="/artist/"], [data-testid="track-info-artists"] a, [data-testid="track-info-artists"], a[data-testid="context-item-info-artist"], [data-testid="context-item-info-subtitles"] a, [data-testid="now-playing-widget"] a[href*="/artist/"]',
  trackShow: 'a[data-testid="context-item-info-show"]',
  coverArt:
    '[data-testid="now-playing-bar"] img[data-testid="cover-art-image"], [data-testid="now-playing-bar"] img, img[data-testid="cover-art-image"], [data-testid="now-playing-widget"] img',
  // The like/save button has no data-testid and its aria-label changes between
  // states ("Add to Liked Songs" when unsaved, "Add to playlist" when saved),
  // so we match the only checkbox-style button inside the now-playing widget/bar and
  // read its saved state from aria-checked.
  likeButton:
    '[data-testid="now-playing-bar"] button[aria-checked], div[data-testid="now-playing-widget"] button[aria-checked], button[data-testid="add-button"]',
  // The queue panel only exists in the DOM while the user has it open.
  queueButton: 'button[data-testid="control-button-queue"]',
  queuePanel: 'aside[aria-label="Queue"]',
  queueRow: '[role="row"]',
  queueRowImage: 'img[data-testid="entity-image"]',
  queueRowPlayButton:
    'button[data-testid="play-button"], button[data-testid="row-play-button"], button[aria-label^="Play"], button[aria-label*="Play"], button[data-encore-id="buttonPrimary"]',
  queueRowTitle: '[data-encore-id="listRowTitle"]',
  queueRowSubtitle: '[data-encore-id="listRowSubtitle"]',
  // Track/album/artist detail-page header. These elements live in the page
  // header (not the now-playing bar), so they describe the page being viewed
  // regardless of what's playing. Used to build redirect link details.
  entityTitle: '[data-testid="entityTitle"]',
  artistEntityTitle: '[data-testid="adaptiveEntityTitle"]',
  creatorLink: 'a[data-testid="creator-link"]',
  headerAlbumLink: 'a[href^="/album/"]'
};
