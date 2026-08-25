import type { DeckSettings } from "_config/config.types.mjs";

export const TAGS: DeckSettings[] = [
  {
    exact: "+r::dqm::ignore",
    cue: {
      icon: {
        id: "ph:blueprint-fill",
        color: "red-2",
      },
    },
    config: {
      dqm: [
        {
          id: "ranki-tag-dqm-ignore",
          config: {
            content: {
              prefix: "% ignore\n",
            },
          },
        },
      ],
    },
  },
  {
    exact: "+r::dev::methods",
    cue: {
      icon: {
        id: "ph:codesandbox-logo-fill",
        color: "red-2",
      },
    },
    config: {
      dev: {
        methods: true,
      },
    },
  },
  {
    exact: "+r::dev::persist",
    cue: {
      message: {
        text: "",
      },
      icon: {
        id: "ph:diamonds-four-fill",
        color: "red-2",
      },
    },
    config: {
      dev: {
        persist: true,
      },
    },
  },
  {
    exact: "+r::dev::throw",
    config: {
      dev: {
        throw: true,
      },
    },
  },
];
