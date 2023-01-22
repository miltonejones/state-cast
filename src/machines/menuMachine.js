import { createMachine, assign } from 'xstate';


export const menuMachine = createMachine({
  id: 'settings_menu',
  initial: 'closed',
  states: {
    closed: {
      on: {
        open: {
          target: 'opened',
          actions: assign({
            anchorEl: (context, event) => event.anchorEl,
          }),
        },
      },
    },
    closing: {
      invoke: {
        src: 'menuClicked',
        onDone: [
          {
            target: 'closed',
          },
        ],
      },
    },
    opened: {
      on: {
        close: {
          target: 'closing',
          actions: assign({
            anchorEl: null,
            value: (context, event) => event.value,
          }),
        },
      },
    },
  },
});