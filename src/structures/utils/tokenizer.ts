export enum TokenizerMode {
  'Mixed' = 1,
  'Alphanumeric' = 2,
  'Letters' = 3,
  'Numbers' = 4,
}
export enum TokenizerCaseMode {
  'Upper' = 1,
  'Lower' = 2,
  'Mixed' = 3,
}

export default function Tokenizer(
  length: number,
  mode: TokenizerMode,
  caseMode: TokenizerCaseMode
) {
  let res = '';
  let letters = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let special = '!()=&.-<>$#';

  let fullDictionary = '';

  switch (mode) {
    case TokenizerMode.Mixed:
      fullDictionary = letters + numbers + special;
      break;
    case TokenizerMode.Alphanumeric:
      fullDictionary = letters + numbers;
      break;
    case TokenizerMode.Numbers:
      fullDictionary = numbers;
      break;
    case TokenizerMode.Letters:
      fullDictionary = letters;
      break;

    default:
      fullDictionary = letters + numbers + special;
      break;
  }

  for (let i = 0; i <= length; i++) {
    let caseModeSelected =
      caseMode === TokenizerCaseMode.Mixed
        ? Math.floor(Math.random() * 2) + 1
        : caseMode;
    console.log(caseModeSelected);
    res =
      res +
      fullDictionary[Math.floor(Math.random() * fullDictionary.length)][
        caseModeSelected === 1 ? 'toUpperCase' : 'toLowerCase'
      ]();
  }

  return res;
}
