import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { MusicServiceTab } from '~types';

const initialState: MusicServiceTab[] = [];

const musicServiceTabsSlice = createSlice({
  name: 'musicServiceTabs',
  initialState: initialState,
  reducers: {
    addMusicServiceTab: (state, action: PayloadAction<MusicServiceTab>) => {
      state.push(action.payload);
    },
    removeMusicServiceTab: (state, action: PayloadAction<number>) => {
      const tabId = action.payload;
      const index = state.findIndex((tab) => tab.tabId === tabId);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    updateMusicServiceTab: (state, action: PayloadAction<MusicServiceTab>) => {
      const tab = action.payload;
      const index = state.findIndex((t) => t.tabId === tab.tabId);
      if (index !== -1) {
        const existingQueue = state[index].playbackState?.queue;
        if (
          existingQueue &&
          existingQueue.length > 1 &&
          (!tab.playbackState?.queue || tab.playbackState.queue.length <= 1)
        ) {
          if (tab.playbackState) {
            tab.playbackState.queue = existingQueue;
          }
        }

        const activeQueueTrack = tab.playbackState?.queue?.find(
          (item) => item.isPlaying
        )?.track;

        if (!tab.currentTrack) {
          if (activeQueueTrack && activeQueueTrack.name) {
            tab.currentTrack = activeQueueTrack;
          } else if (state[index].currentTrack) {
            tab.currentTrack = state[index].currentTrack;
          }
        } else if (
          activeQueueTrack &&
          activeQueueTrack.name &&
          (activeQueueTrack.id && tab.currentTrack.id
            ? activeQueueTrack.id !== tab.currentTrack.id
            : activeQueueTrack.name !== tab.currentTrack.name)
        ) {
          tab.currentTrack = activeQueueTrack;
        }

        state[index] = tab;
      } else {
        state.push(tab);
      }
    },
    updateMusicServiceTabPlayerState: (
      state,
      action: PayloadAction<{
        tabId: number;
        playbackState: MusicServiceTab['playbackState'];
      }>
    ) => {
      const { tabId, playbackState } = action.payload;
      const index = state.findIndex((tab) => tab.tabId === tabId);
      if (index !== -1) {
        if (playbackState) {
          const existingQueue = state[index].playbackState?.queue;
          if (
            existingQueue &&
            existingQueue.length > 1 &&
            (!playbackState.queue || playbackState.queue.length <= 1)
          ) {
            const isPlaying = playbackState.isPlaying;
            const currentTrack = state[index].currentTrack;
            playbackState.queue = existingQueue.map((item) => ({
              ...item,
              isPlaying:
                isPlaying &&
                Boolean(
                  currentTrack &&
                    item.track &&
                    (item.track.id
                      ? item.track.id === currentTrack.id
                      : item.track.name === currentTrack.name)
                )
            }));
          }

          const activeQueueTrack = playbackState.queue?.find(
            (item) => item.isPlaying
          )?.track;
          if (
            activeQueueTrack &&
            activeQueueTrack.name &&
            (!state[index].currentTrack ||
              (activeQueueTrack.id && state[index].currentTrack?.id
                ? activeQueueTrack.id !== state[index].currentTrack?.id
                : activeQueueTrack.name !== state[index].currentTrack?.name))
          ) {
            state[index].currentTrack = {
              ...activeQueueTrack,
              duration:
                state[index].currentTrack?.duration || activeQueueTrack.duration
            };
          }

          state[index].playbackState = playbackState;
        } else if (state[index].playbackState) {
          state[index].playbackState = {
            ...state[index].playbackState!,
            isPlaying: false
          };
        }
      }
    },
    updateMusicServiceTabCurrentTrack: (
      state,
      action: PayloadAction<{
        tabId: number;
        currentTrack: MusicServiceTab['currentTrack'];
      }>
    ) => {
      const { tabId, currentTrack } = action.payload;
      const index = state.findIndex((tab) => tab.tabId === tabId);
      if (index !== -1) {
        if (
          currentTrack !== null ||
          !state[index].currentTrack ||
          (!state[index].playbackState?.isPlaying &&
            (!state[index].playbackState?.queue ||
              state[index].playbackState!.queue.length <= 1))
        ) {
          state[index].currentTrack = currentTrack;
          if (
            currentTrack &&
            state[index].playbackState?.queue &&
            state[index].playbackState!.queue.length > 0
          ) {
            const isPlaying = state[index].playbackState!.isPlaying;
            state[index].playbackState!.queue = state[
              index
            ].playbackState!.queue.map((item) => ({
              ...item,
              isPlaying:
                isPlaying &&
                Boolean(
                  item.track &&
                    (item.track.id && currentTrack.id
                      ? item.track.id === currentTrack.id
                      : item.track.name === currentTrack.name)
                )
            }));
          }
        }
      }
    },
    updateMusicServiceTabPictureInPicture: (
      state,
      action: PayloadAction<{
        tabId: number;
        pictureInPicture: MusicServiceTab['pictureInPicture'];
      }>
    ) => {
      const { tabId, pictureInPicture } = action.payload;
      const index = state.findIndex((tab) => tab.tabId === tabId);
      if (index !== -1) {
        state[index].pictureInPicture = pictureInPicture;
      }
    },
    clearMusicServiceTabs: () => initialState
  }
});

export const {
  addMusicServiceTab,
  removeMusicServiceTab,
  clearMusicServiceTabs,
  updateMusicServiceTab,
  updateMusicServiceTabCurrentTrack,
  updateMusicServiceTabPlayerState,
  updateMusicServiceTabPictureInPicture
} = musicServiceTabsSlice.actions;

export default musicServiceTabsSlice.reducer;
