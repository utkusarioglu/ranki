export const CARD_CONFIG = `
tags:
  - exact: +r:palette-custom-1
    config:
      design:
        palette: generated-1
      palettes:
        - name: generated-1
          hues: 
            red: 0
            orange: 30
            yellow: 55
            green: 130
            turquoise: 170
            blue: 210
            purple: 270
            magenta: 320
          lightness: [0, 20, 30, 60, 70, 80]
          saturation: [10, 40, 70, 100, 30, 100]
`.trim();

export const TEMPLATE_CONFIG = `
decks:
  - glob: __
    config:
      address:
        segments:
          - start: 1
            end: 3
            mode: hide
          - start: 3
            end: 4
            mode: trim
`.trim();

export const DECK = "Cat::Dog::Bunny::Bird::Tiger::Goat";
