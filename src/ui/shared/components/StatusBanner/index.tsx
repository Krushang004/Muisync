import {
  faCircleExclamation,
  faCircleInfo,
  faClose,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { token } from '@synqapp/ui';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { sendToBackground } from '~core/messaging';
import type { StatusBannerData, StatusSeverity } from '~types';

export const DISMISSED_STATUS_ID_KEY = 'muisync_dismissed_status_id';

const getSeverityIcon = (severity: StatusSeverity) => {
  switch (severity) {
    case 'warning':
      return faTriangleExclamation;
    case 'error':
      return faCircleExclamation;
    case 'info':
    default:
      return faCircleInfo;
  }
};

export const StatusBanner = () => {
  const [banner, setBanner] = useState<StatusBannerData | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBannerStatus = async () => {
      try {
        const status = await sendToBackground<
          undefined,
          StatusBannerData | null
        >({
          name: 'GET_STATUS_BANNER'
        });

        if (!isMounted) return;

        if (!status || !status.message) {
          setBanner(null);
          return;
        }

        const stored = await chrome.storage.local.get(DISMISSED_STATUS_ID_KEY);
        const dismissedId = stored?.[DISMISSED_STATUS_ID_KEY];

        if (dismissedId === status.id) {
          setBanner(null);
          return;
        }

        setBanner(status);
      } catch {
        if (isMounted) setBanner(null);
      }
    };

    loadBannerStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDismiss = async () => {
    if (!banner) return;
    const currentId = banner.id;
    setBanner(null);

    try {
      await chrome.storage.local.set({
        [DISMISSED_STATUS_ID_KEY]: currentId
      });
    } catch {
      // Ignore storage errors on dismissal
    }
  };

  if (!banner || !banner.message) {
    return null;
  }

  const icon = getSeverityIcon(banner.severity);

  return (
    <BannerContainer
      $severity={banner.severity}
      role="status"
      aria-live="polite"
    >
      <IconWrapper $severity={banner.severity}>
        <FontAwesomeIcon icon={icon} />
      </IconWrapper>
      <MessageText>{banner.message}</MessageText>
      <DismissButton
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss status banner"
      >
        <FontAwesomeIcon icon={faClose} />
      </DismissButton>
    </BannerContainer>
  );
};

const BannerContainer = styled.div<{ $severity: StatusSeverity }>`
  align-items: flex-start;
  box-sizing: border-box;
  display: flex;
  gap: 8px;
  justify-content: space-between;
  margin: 4px 8px 6px;
  padding: 8px 10px;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;

  ${({ $severity }) => {
    switch ($severity) {
      case 'warning':
        return css`
          background: rgba(245, 158, 11, 0.14);
          border: 1px solid rgba(245, 158, 11, 0.35);
        `;
      case 'error':
        return css`
          background: rgba(239, 68, 68, 0.16);
          border: 1px solid rgba(239, 68, 68, 0.4);
        `;
      case 'info':
      default:
        return css`
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.35);
        `;
    }
  }}
`;

const IconWrapper = styled.div<{ $severity: StatusSeverity }>`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  font-size: 13px;
  margin-top: 2px;

  ${({ $severity }) => {
    switch ($severity) {
      case 'warning':
        return css`
          color: #fbbf24;
        `;
      case 'error':
        return css`
          color: #f87171;
        `;
      case 'info':
      default:
        return css`
          color: #60a5fa;
        `;
    }
  }}
`;

const MessageText = styled.span`
  color: ${token('colors.onBackground')};
  flex: 1;
  font-family: ${token('typography.fontFamilies.body')};
  font-size: 11px;
  line-height: 1.4;
  margin: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

const DismissButton = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  box-shadow: none;
  color: ${token('colors.onBackgroundLow')};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  font-size: 12px;
  height: 16px;
  justify-content: center;
  line-height: 1;
  margin: 0;
  margin-top: 1px;
  outline: none;
  padding: 0;
  transition: color 0.15s ease-in-out;
  width: 16px;

  &:hover {
    color: ${token('colors.onBackground')};
  }
`;

export default StatusBanner;
