import type { PlasmoMessaging } from '@plasmohq/messaging';

import { YOUTUBE_WATCH_URL } from '~constants/urls';

export interface OpenInYouTubeBody {
  videoId: string;
}

export interface OpenInYouTubeResponse {
  success: boolean;
  tabId?: number;
}

/**
 * Validates a YouTube video ID. Standard YouTube video IDs are 11 characters
 * containing alphanumeric characters, underscores, and hyphens. We accept safe
 * alphanumeric strings with hyphens and underscores up to 64 characters to
 * prevent URL manipulation or injection.
 */
export const isValidYouTubeVideoId = (videoId: unknown): videoId is string => {
  if (typeof videoId !== 'string') {
    return false;
  }

  const trimmed = videoId.trim();
  if (!trimmed) {
    return false;
  }

  return /^[a-zA-Z0-9_-]{1,64}$/.test(trimmed);
};

/**
 * Constructs the YouTube watch URL for a validated video ID using the fixed HTTPS origin.
 */
export const constructYouTubeWatchUrl = (videoId: string): string => {
  const safeId = encodeURIComponent(videoId.trim());
  return `${YOUTUBE_WATCH_URL}?v=${safeId}`;
};

/**
 * Background message handler that opens the currently playing YouTube Music video
 * on regular YouTube in a new tab. Lives in the background service worker context
 * to keep tab creation out of content scripts.
 */
export const handler: PlasmoMessaging.MessageHandler<
  OpenInYouTubeBody,
  OpenInYouTubeResponse
> = async (req, res) => {
  const videoId = req.body?.videoId;

  if (!isValidYouTubeVideoId(videoId)) {
    res.send({ success: false });
    return;
  }

  const url = constructYouTubeWatchUrl(videoId);

  try {
    const tab = await chrome.tabs.create({ url });
    res.send({ success: true, tabId: tab.id });
  } catch {
    res.send({ success: false });
  }
};

export default handler;
