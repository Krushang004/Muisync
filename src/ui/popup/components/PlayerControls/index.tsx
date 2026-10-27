import { token } from '@synqapp/ui';
import { styled } from 'styled-components';

import { ArtistName } from '~/ui/shared/components/ArtistName';
import { OpenInYouTubeButton } from '~/ui/shared/components/OpenInYouTubeButton';
import { TrackTitle } from '~/ui/shared/components/TrackTitle';
import { TrackSeeker } from '~ui/shared/components/TrackSeeker';

import { ControlButtons } from '../ControlButtons';

export const PlayerControls = () => {
  return (
    <PlayerControlsContainer>
      <TrackTitle size="md" weight="semibold" />
      <ArtistAndActionRow>
        <ArtistWrapper>
          <ArtistName size="xs" />
        </ArtistWrapper>
        <OpenInYouTubeButton />
      </ArtistAndActionRow>
      <TrackSeekerContainer>
        <TrackSeeker />
      </TrackSeekerContainer>
      <div>
        <ControlButtons />
      </div>
    </PlayerControlsContainer>
  );
};

const PlayerControlsContainer = styled.div`
  width: 100%;
`;

const ArtistAndActionRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${token('spacing.2xs')};
  justify-content: space-between;
  min-height: 20px;
`;

const ArtistWrapper = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const TrackSeekerContainer = styled.div`
  margin-top: ${token('spacing.xs')};
`;
