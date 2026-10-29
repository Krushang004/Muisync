import type { PlasmoMessaging } from '@plasmohq/messaging';

import { STATUS_BANNER_URL } from '~constants/urls';
import type { StatusBannerData, StatusDocument, StatusSeverity } from '~types';

export const STATUS_CACHE_KEY = 'muisync_status_cache';
export const STATUS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const STATUS_FETCH_TIMEOUT_MS = 5000; // 5 seconds bounded timeout

interface CachedStatus {
  data: StatusBannerData | null;
  timestamp: number;
}

const ALLOWED_SEVERITIES: StatusSeverity[] = ['info', 'warning', 'error'];

export const parseAndValidateStatus = (
  raw: unknown
): StatusBannerData | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const doc = raw as Partial<StatusDocument>;
  if (typeof doc.message !== 'string') {
    return null;
  }

  // Strip any HTML tags and trim whitespace to ensure plain-text only
  const cleanMessage = doc.message.replace(/<[^>]*>/g, '').trim();
  if (!cleanMessage) {
    return null;
  }

  // Bound message length to at most 500 characters
  const boundedMessage = cleanMessage.slice(0, 500);

  // Validate severity against allowed values (defaults to 'info' if unrecognized)
  const severity: StatusSeverity =
    typeof doc.severity === 'string' &&
    ALLOWED_SEVERITIES.includes(doc.severity as StatusSeverity)
      ? (doc.severity as StatusSeverity)
      : 'info';

  return {
    message: boundedMessage,
    severity,
    id: `${severity}:${boundedMessage}`
  };
};

export const handler: PlasmoMessaging.MessageHandler<
  undefined,
  StatusBannerData | null
> = async (req, res) => {
  try {
    // Check cached status
    const cacheResult = await chrome.storage.local.get(STATUS_CACHE_KEY);
    const cached: CachedStatus | undefined = cacheResult?.[STATUS_CACHE_KEY];

    if (
      cached &&
      typeof cached.timestamp === 'number' &&
      Date.now() - cached.timestamp < STATUS_CACHE_TTL_MS
    ) {
      res.send(cached.data);
      return;
    }

    // If device is offline, fail gracefully without waiting for a timeout
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      res.send(null);
      return;
    }

    // Fetch live status with bounded timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      STATUS_FETCH_TIMEOUT_MS
    );

    let response: Response;
    try {
      response = await fetch(STATUS_BANNER_URL, {
        signal: controller.signal,
        cache: 'no-cache'
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      // Non-200 responses fail gracefully without caching failure permanently
      res.send(null);
      return;
    }

    const json = await response.json();
    const validated = parseAndValidateStatus(json);

    // Cache successful fetch response
    await chrome.storage.local.set({
      [STATUS_CACHE_KEY]: {
        data: validated,
        timestamp: Date.now()
      }
    });

    res.send(validated);
  } catch {
    // Network failures, abort timeouts, or invalid JSON fail gracefully
    // Do NOT cache a failed request as a permanent empty status
    res.send(null);
  }
};

export default handler;
