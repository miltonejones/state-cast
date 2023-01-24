import { createMachine, assign } from 'xstate';
const COOKIE_NAME = 'pod-subs';

export const podcastMachine = createMachine(
  {
    id: 'podcast_machine',
    initial: 'begin',
    context: {
      param: '',
      page: 1,
      view: 'home',
      settings: false,
      subscriptions: [],
    },
    states: {
      begin: {
        initial: 'loading',
        states: {
          error: {
            on: {
              RECOVER: {
                target: '#podcast_machine.navigate',
              },
            },
          },
          loading: {
            invoke: {
              src: 'setSubscriptions',
              onDone: [
                {
                  target: '#podcast_machine.navigate',
                  actions: ['initSubscription', 'initPods'],
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
      navigate: {
        initial: 'list',

        states: {
          list: {
            on: {
              LINK: {
                target: 'list',
                actions: assign({
                  view: (context, event) => event.view,
                  page: 1
                }),
              },

              PAGE: {
                actions: 'assignPage', 
              },
              SETTINGS: {
                target: 'list',
                actions: assign({
                  settings: (context, event) => event.settings,
                }),
              },

              DETAIL: {
                target: '#podcast_machine.detail',
                actions: 'assignDetailToContext',
              },

              // search support
              SEARCH: {
                target: '#podcast_machine.search',
                actions: ['initSubscription', 'assignParamToContext'],
              },
              CHANGE: {
                actions: 'assignParamToContext',
              },
            },
          },
        },
      },
      search: {
        initial: 'begin',
        states: {
          error: {
            on: {
              RECOVER: {
                target: '#podcast_machine.navigate',
              },
            },
          },
          loaded: {
            on: {
              LINK: {
                target: '#podcast_machine.navigate',
                actions: assign({
                  view: (context, event) => event.view,
                  page: 1
                }),
              },
              CLOSE: {
                target: '#podcast_machine.navigate',
                actions: assign({ 
                  page: 1
                }),
              },
              DETAIL: {
                target: '#podcast_machine.detail',
                actions: 'assignDetailToContext',
              },
              SUBSCRIBE: {
                target: 'loaded',
                actions: 'assignSubscription',
              },
              FILTER: {
                actions: assign({
                  filterText: (context, event) => event.value,
                  page: 1
                }),
              },
              PAGE: {
                actions: 'assignPage',
                target: 'loaded',
              },
            },
          },
          begin: {
            invoke: {
              src: 'beginSearch',
              onDone: [
                {
                  target: 'loaded',
                  actions: 'assignResultsToContext',
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
      detail: {
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
                  target: '#podcast_machine.search.loaded',
                  cond: (context) => context.source === 'results',
                },
                {
                  target: '#podcast_machine.navigate',
                  actions: assign({ 
                    page: 1
                  }),
                },
              ],
              SETTINGS: { 
                actions: assign({
                  settings: (context, event) => event.settings,
                }),
              },

              // HOME: {
              //   target: '#podcast_machine.navigate',
              // },
              PAGE: {
                actions: 'assignPage',
                target: 'loaded',
              },
              SUBSCRIBE: {
                target: 'loaded',
                actions: 'assignSubscription',
              },

              LINK: {
                target: '#podcast_machine.navigate',
                actions: assign({
                  view: (context, event) => event.view,
                  page: 1
                }),
              },
              // search support
              SEARCH: {
                target: '#podcast_machine.search',
                actions: ['initSubscription', 'assignParamToContext'],
              },
              CHANGE: {
                actions: 'assignParamToContext',
              },
            },
          },
          error: {
            on: {
              RECOVER: {
                target: '#podcast_machine.navigate',
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
          filterText: '',
          ...event
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

      assignTrack: assign((context, event) => {
        // alert (JSON.stringify({event}))
        return {
          track: event.track,
          previous: event.type,
          trackList: event.trackList
        };
      }),

      initPods: assign((context, event) => {
        return {
          pods: event.data,
        };
      }),

      initSubscription: assign((context, event) => {
        const subs = localStorage.getItem(COOKIE_NAME);
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
        const node = context.subscriptions || [];

        const subs = node.find((f) => f.feedUrl === event.podcast.feedUrl)
          ? node.filter((f) => f.feedUrl !== event.podcast.feedUrl)
          : node.concat(event.podcast);
        localStorage.setItem(COOKIE_NAME, JSON.stringify(subs));
        return {
          subscriptions: subs,
        };
      }),

      assignView: assign((context, event) => {
        return {
          view: event.view,
          page: 1
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
