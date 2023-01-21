import { createMachine, assign } from 'xstate';

export const podcastMachine = createMachine(
  {
    id: 'podcast_machine',
    initial: 'begin',
    context: {
      param: '',
      page: 1,
      subscriptions: [],
    },
    states: {
      begin: {
        invoke: {
          src: 'setSubscriptions',
          onDone: [
            {
              target: 'idle',
              actions: ['initSubscription', 'initPods'],
            },
          ],
        },
      },
      idle: {
        on: {
          SEARCH: {
            target: 'searching',
            actions: ['initSubscription', 'assignParamToContext'],
          },
          CHANGE: {
            target: 'idle',
            actions: 'assignParamToContext',
          },
          BROWSE: {
            target: 'shows',
            actions: 'initSubscription',
          },
          DETAIL: {
            target: 'podcast_detail',
            actions: 'assignDetailToContext',
          },
        },
      },
      search_error: {
        on: {
          RECOVER: {
            target: 'results',
          },
        },
      },
      searching: {
        invoke: {
          src: 'beginSearch',
          onDone: [
            {
              target: 'results',
              actions: 'assignResultsToContext',
            },
          ],
          onError: [
            {
              target: 'search_error',
            },
          ],
        },
      },
      shows: {
        on: {
          DETAIL: {
            target: 'podcast_detail',
            actions: 'assignShowToContext',
          },

          CLOSE: {
            target: 'idle',
          },
        },
      },
      podcast_detail: {
        initial: 'loading',
        states: {
          loaded: {
            on: {
              PLAY: {
                target: 'startplay',
                actions: 'assignTrack',
              },
              CLOSE: [
                {
                  target: '#podcast_machine.results',
                  cond: (context) => context.source === 'results',
                },
                {
                  target: '#podcast_machine.shows',
                },
              ],
              HOME: {
                target: '#podcast_machine.idle',
              },
              PAGE: {
                actions: 'assignPage',
                target: 'loaded',
              },
              SUBSCRIBE: {
                target: 'loaded',
                actions: 'assignSubscription',
              },
            },
          },
          error: {
            on: {
              RECOVER: {
                target: '#podcast_machine.results',
              },
            },
          },
          loading: {
            invoke: {
              src: 'getDetail',
              onDone: [
                {
                  target: 'loaded',
                  actions: 'assignPodcast',
                },
              ],
              onError: [
                {
                  target: 'error',
                  actions: 'assignProblem',
                },
              ],
            },
          },
          startplay: {
            invoke: {
              src: 'spawnPlayer',
              onDone: [
                {
                  target: 'loaded',
                },
              ],
              onError: [
                {
                  target: 'error',
                  actions: 'assignProblem',
                },
              ],
            },
          },
        },
      },
      // playing: {
      //   invoke: {
      //     src: 'spawnPlayer',
      //   },
      //   on: {
      //     CLOSE: {
      //       target: 'podcast_detail.loaded',
      //     },
      //     HOME: {
      //       target: 'idle',
      //     },
      //   },
      // },
      results: {
        on: {
          CLOSE: {
            target: 'idle',
          },
          DETAIL: {
            target: 'podcast_detail',
            actions: 'assignDetailToContext',
          },
          PAGE: {
            actions: 'assignPage',
            target: 'results',
          },
        },
      },
    },
  },
  {
    actions: {
      assignProblem: assign((context, event) => {
        console.log({
          context,
          event,
        });
        return {
          error: {
            message: event.data.message,
            stack: event.data.stack,
          },
          previous: event.type,
        };
      }),
      assignParamToContext: assign((context, event) => {
        return {
          param: event.value || context.param,
          previous: event.type,
        };
      }),

      assignResultsToContext: assign((context, event) => {
        return {
          results: event.data,
          previous: event.type,
          page: 1,
        };
      }),

      assignPage: assign((context, event) => {
        return {
          page: event.page,
          previous: event.type,
        };
      }),

      assignDetailToContext: assign((context, event) => {
        return {
          podcast: event.podcast,
          previous: event.type,
          source: event.source || 'results',
          page: 1,
        };
      }),

      assignShowToContext: assign((context, event) => {
        return {
          podcast: event.podcast,
          previous: event.type,
          source: 'show',
          page: 1,
        };
      }),
      assignTrack: assign((context, event) => {
        // alert (JSON.stringify({event}))
        return {
          track: event.track,
          previous: event.type,
        };
      }),

      initPods: assign((context, event) => {
        return {
          pods: event.data,
        };
      }),

      initSubscription: assign((context, event) => {
        const subs = localStorage.getItem('subs');
        try {
          const json = JSON.parse(subs);
          return {
            subscriptions: json,
          };
        } catch (ex) {
          console.log(ex.message);
        }

        return {
          subscriptions: [],
        };
      }),

      assignSubscription: assign((context, event) => {
        const subs = (context.subscriptions || []).concat(event.podcast);
        localStorage.setItem('subs', JSON.stringify(subs));
        return {
          subscriptions: subs,
        };
      }),

      assignPodcast: assign((context, event) => {
        // alert (JSON.stringify({event}))
        return {
          detail: event.data,
          previous: event.type,
          page: 1,
        };
      }),
    },
  }
);
