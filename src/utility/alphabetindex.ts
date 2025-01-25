export function getAlphabetIndex(index: number) {
  let letterString: string = "";

  //length starts at 0 when the array is still empty, which will result in 'A'
  const characterCount = [index];
  let countIndex = 0;
  //we essentially make an array of every alphabet character here
  //if the number is above Z we will need to add a new index
  //by dividing by the alphabet we ensure that it works even with like, 30000 files
  //since when you have that many files, the first letter represents like up to 26^4 files
  //so every time we divide by 26 we make it go from 26^4 to 26^3 to 26^2 to 26^1 to 26^0 etc etc
  //or from 26*26*26*26 to 26*26*26 to 26*26 to 26 in longer notation
  while (countIndex < characterCount.length) {
    if (characterCount[countIndex] > 25) {
      const alphabetDivision = Math.floor(characterCount[countIndex] / 26);
      characterCount[countIndex + 1] = alphabetDivision - 1;
      characterCount[countIndex] %= 26;
    }
    countIndex += 1;
  }

  for (let i = 0; i < characterCount.length; i += 1) {
    letterString = String.fromCharCode(65 + characterCount[i]) + letterString;
  }

  return letterString;
}
