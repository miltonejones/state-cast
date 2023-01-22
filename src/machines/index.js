import { podcastMachine } from './podcastMachine';
import { audioMachine } from './audioMachine';
import { carouselMachine } from './carouselMachine';
import { menuMachine } from './menuMachine';

export { podcastMachine, carouselMachine, menuMachine, audioMachine };

export const docs = {
  application: {
    machine: podcastMachine,
    url: 'https://stately.ai/registry/editor/6a837c17-5d8f-4733-9dbc-196b42d226d6?machineId=e9a18282-e0d7-419e-91d7-d78ef03cdb08',
    description: 'This machine controls the main application events and views.',
    states: {
      begin: 'Loads initial podcast list from iTunes.',
      navigate: 'Allows the user to navigate between application views.',
      search: 'Launches a podcast search with the requested parameters.',
      detail:
        'Lists the episodes and detail information for a selected podcast.',
    },
  },
  'audio player': {
    machine: audioMachine,
    url: 'https://stately.ai/registry/editor/6a837c17-5d8f-4733-9dbc-196b42d226d6?machineId=88e4ef17-50ce-491b-bcdd-f2be1543d831',
    description: 'Controls in-memory audio player.',
    states: {
      begin: 'Instantiates HTML5 audio player in memory.',
      idle: 'Waits for OPEN event.',
      opened: 'Starts the audio after checking for CORS issues with the URL.',
      replay:
        'Fires the OPEN event when a track is already playing,  clearing the current track.',
    },
  },
  carousel: {
    machine: carouselMachine,
    url: 'https://stately.ai/registry/editor/6a837c17-5d8f-4733-9dbc-196b42d226d6?machineId=366be4b4-f7e0-4dc8-b454-8ef3bbc83c4f',
    description: 'Displays a simple carousel component.',
    states: {
      load: 'Loads the carousel image list. ',
      go: 'Moves the carousel to the next image.',
      stop: 'Displays the current image.',
    },
  },
  'settings menu': {
    machine: menuMachine,
    url: 'https://stately.ai/registry/editor/6a837c17-5d8f-4733-9dbc-196b42d226d6?machineId=773dede8-a062-4986-9253-9aa6dc4c0fac',
    description: 'Displays a MUI menu component.',
    states: {
      open: 'Menu is open.',
      closed: 'Menu is closed.',
      closing: 'Fires menuClicked event before closing.',
    },
  },
};
