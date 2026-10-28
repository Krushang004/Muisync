import { token } from '@synqapp/ui';
import YoutubeLogo from 'data-base64:~assets/images/youtube-logo.svg';
import styled from 'styled-components';

import {
  type OpenInYouTubeBody,
  type OpenInYouTubeResponse,
  isValidYouTubeVideoId
} from '~background/messages/OPEN_IN_YOUTUBE';
import { sendToBackground } from '~core/messaging';
import { MUSIC_SERVICE } from '~types';
import { useMusicServiceTab } from '~ui/shared/contexts/MusicServiceTab';

export const OpenInYouTubeButton = () => {
  const { musicServiceTab } = useMusicServiceTab();

  if (
    !musicServiceTab ||
    musicServiceTab.musicService !== MUSIC_SERVICE.YOUTUBEMUSIC
  ) {
    return null;
  }

  const videoId = musicServiceTab.currentTrack?.id;
  if (!isValidYouTubeVideoId(videoId)) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    sendToBackground<OpenInYouTubeBody, OpenInYouTubeResponse>({
      name: 'OPEN_IN_YOUTUBE',
      body: { videoId }
    });
  };

  return (
    <ButtonStyled
      type="button"
      onClick={handleClick}
      aria-label="Open in YouTube"
      title="Open in YouTube"
    >
      <LogoIcon src={YoutubeLogo} alt="" aria-hidden="true" />
      <ButtonText>Open in YouTube</ButtonText>
    </ButtonStyled>
  );
};

const ButtonStyled = styled.button`
  align-items: center;
  background: rgba(255, 0, 0, 0.12);
  border: 1px solid rgba(255, 0, 0, 0.28);
  border-radius: 4px;
  box-sizing: border-box;
  color: ${token('colors.onBackground')};
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-family: ${token('typography.fontFamilies.body')};
  font-size: 10px;
  font-weight: ${token('typography.fontWeights.medium')};
  gap: 4px;
  height: 20px;
  line-height: 1;
  margin: 0;
  outline: none;
  padding: 2px 6px;
  text-decoration: none;
  transition: all 0.15s ease-in-out;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 0, 0, 0.22);
    border-color: rgba(255, 0, 0, 0.5);
  }

  &:focus-visible {
    outline: 2px solid ${token('colors.borderHigh')};
    outline-offset: 1px;
  }
`;

const LogoIcon = styled.img`
  display: block;
  flex-shrink: 0;
  height: 12px;
  width: 12px;
`;

const ButtonText = styled.span`
  line-height: 1;
`;

export default OpenInYouTubeButton;
