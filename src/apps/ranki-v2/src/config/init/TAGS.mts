import type { DeckSettings } from "_config/config.types.mjs";

export const TAGS: DeckSettings[] = [
  {
    config: {
      dqm: [
        {
          config: {
            content: {
              prefix: "% ignore\n",
            },
          },
          id: "ranki-tag-dqm-ignore",
        },
      ],
    },
    cue: {
      icon: {
        color: "red-2",
        id: "ph:blueprint-fill",
      },
    },
    exact: "+r::dqm::ignore",
  },
  {
    config: {
      dev: {
        methods: true,
      },
    },
    cue: {
      icon: {
        color: "red-2",
        id: "ph:codesandbox-logo-fill",
      },
    },
    exact: "+r::dev::methods",
  },
  {
    config: {
      dev: {
        persist: true,
      },
    },
    cue: {
      icon: {
        color: "red-2",
        id: "ph:diamonds-four-fill",
      },
      message: {
        text: "",
      },
    },
    exact: "+r::dev::persist",
  },
  {
    config: {
      dev: {
        throw: true,
      },
    },
    exact: "+r::dev::throw",
  },
];
