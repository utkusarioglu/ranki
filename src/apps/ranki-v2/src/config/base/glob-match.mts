import {
  ANKI_DECK_SEPARATOR,
  GLOB_MULTI,
  GLOB_SINGLE,
} from "_config/config.constants.mjs";

// ANKI
/**
 * Glob matching with the following types: * ** exact
 * This doesn't allow partial glob matches. Maybe that can be implemented later
 * but certainly not for an alpha app.
 */
export function isGlobMatch(
  currStr: string,
  matchStr: string,
  separator: string = ANKI_DECK_SEPARATOR,
  single: string = GLOB_SINGLE,
  multi: string = GLOB_MULTI,
) {
  const curr = currStr.split(separator);
  let mp = 0;
  let match: string[] = [];
  matchStr.split(separator).forEach((s) => {
    const prevIdx = match.length - 1;
    switch (s) {
      case multi:
        if (match.at(-1) === single) {
          match[prevIdx] = s;
        } else {
          match.push(s);
        }
        break;
      case single:
        if (match.at(-1) !== multi) {
          match.push(s);
        }
        break;
      default:
        match.push(s);
    }
  });

  let cp = 0;
  let lastCp = cp;
  let lastMulti = -1;
  while (cp < curr.length) {
    const isExact = match[mp] === curr[cp];
    const isSingle = match[mp] === single && curr[cp].trim().length > 0;
    if (isExact || isSingle) {
      cp++;
      mp++;
    } else if (match[mp] === multi) {
      // is multi
      lastMulti = mp;
      lastCp = cp;
      mp++;
    } else if (lastMulti !== -1) {
      // has preceding multi
      mp = lastMulti + 1;
      lastCp++;
      cp = lastCp;
    } else {
      return false;
    }
  }

  while (match[mp] === multi) mp++;
  return mp === match.length;
}
