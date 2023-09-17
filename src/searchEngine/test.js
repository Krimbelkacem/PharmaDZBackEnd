const params = require("../params/searchEngineParams");

const countCumul = (chain, matrix) => {
  /* console.log("chain", chain);
  const filteredMat = matrix.filter((_, index) =>
    chain.some((__, i) => i == index)
  );
  console.log("filteredMat", filteredMat);
  return filteredMat.reduce((acc, elem) =>
    acc ? acc.map((a, i) => a + elem[i]) : elem
  ); */

  return chain.reduce((acc, index) => {
    if (!acc) return matrix[index];
    return acc.map((a, i) => a + matrix[index][i]);
  }, null);
};

const covered = (cumul) => {
  return cumul.filter((e) => e != 0).length == cumul.length;
};

function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
function sortAndRemoveDuplicates(arrOfArrays) {
  // Sort each sub-array
  const sortedArrays = arrOfArrays.map((arr) => [...arr].sort());

  // Use the filter method to remove duplicates
  const uniqueArrayOfArrays = sortedArrays.filter((arr, index, self) => {
    // Find the first occurrence of the current array in the original array
    const firstIndex = self.findIndex((otherArr) =>
      arraysAreEqual(arr, otherArr)
    );

    // Return true only if the current index is the same as the first occurrence
    return index === firstIndex;
  });

  return uniqueArrayOfArrays;
}

const setCover = (matrix) => {
  const maxCumul = matrix.length > 0 ? matrix[0].length : 0;
  let chains = matrix.map((_, index) => [index]);

  const initialCumuls = chains.map((c, index) => ({
    chain: c,
    value: countCumul(c, matrix),
  }));

  let bestCumuls = initialCumuls
    .map((cumul) => ({
      ...cumul,
      value: cumul.value.filter((e) => e > 0).length,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, params.getParams().nb_result);

  chains = bestCumuls.map((best) => best.chain);
  console.log("best", bestCumuls);
  const indexes = matrix.map((_, i) => i);

  for (let _ = 0; _ < params.getParams().nb_pharma_result_max; _++) {
    let addedChains = [];
    console.log("________________________________");
    console.log("iteration ", _);

    console.log("________________________________");
    chains.forEach((chain, i_ch) => {
      console.log("chain", chain, "index", i_ch);
      console.log("________________________________");
      let testCumul = [];

      indexes
        .filter((e) => !chain.some((c) => c == e))
        .forEach((e) =>
          testCumul.push({
            ext: e,
            value: countCumul([...chain, [e]], matrix).filter(
              (elem) => elem != 0
            ).length,
          })
        );

      //console.log(testCumul);
      console.log("________________________________");
      let max = testCumul.reduce(
        (max, e, index) =>
          testCumul[max].value > testCumul[index].value ? max : index,
        0
      );
      console.log(
        "added",
        testCumul.filter((test) => test.value == testCumul[max].value)
      );
      console.log("testcumul", testCumul[max], "\nbest", bestCumuls[i_ch]);
      addedChains.push([
        i_ch,
        testCumul[max].value > bestCumuls[i_ch].value
          ? testCumul.filter((test) => test.value == testCumul[max].value)
          : [],
      ]);
    });
    console.log("addedchains", addedChains[0][1].length);

    chains = addedChains.reduce((acc, elem) => {
      console.log(elem);
      if (elem[1].length == 0) {
        return [...acc, chains[elem[0]]];
      } else {
        return [...acc, ...elem[1].map((ch) => [...chains[elem[0]], ch.ext])];
      }
    }, []);
    chains = sortAndRemoveDuplicates(chains);
    bestCumuls = chains
      .map((c, index) => ({
        chain: c,
        value: countCumul(c, matrix),
      }))
      .map((cumul) => ({
        ...cumul,
        value: cumul.value.filter((e) => e > 0).length,
      }));

    console.log("chains", chains, "\nbest", bestCumuls);
    //let newChains =
  }
  return chains;
};
/* function couvertureParEnsemble(matriceIncidence) {
  const resultat = new Set(); // Use a Set to store unique sets
  const lignes = matriceIncidence.length;
  const colonnes = matriceIncidence[0].length;

  function backtrack(ensembleActuel, colonnesRestantes) {
    if (colonnesRestantes.size === 0) {
      resultat.add(new Set(ensembleActuel)); // Add the unique set to the Set
      return;
    }

    const colonne = [...colonnesRestantes][0];
    for (let ligne = 0; ligne < lignes; ligne++) {
      if (matriceIncidence[ligne][colonne] === 1) {
        ensembleActuel.add(ligne); // Use Set.add to add elements
        const nouvellesColonnesRestantes = new Set(colonnesRestantes);
        nouvellesColonnesRestantes.delete(colonne);
        backtrack(ensembleActuel, nouvellesColonnesRestantes);
        ensembleActuel.delete(ligne); // Use Set.delete to remove elements
      }
    }
  }

  const colonnesRestantes = new Set();
  for (let j = 0; j < colonnes; j++) {
    colonnesRestantes.add(j);
  }

  backtrack(new Set(), colonnesRestantes); // Start with an empty Set
  return Array.from(resultat); // Convert the Set back to an array before returning
}

// Exemple d'utilisation
const matriceIncidence = [
  [1, 0, 1, 0],
  [0, 1, 1, 0],
  [1, 0, 0, 1],
  [0, 0, 1, 1],
];

const solutions = couvertureParEnsemble(matriceIncidence);
console.log("Différentes combinaisons de solutions :", solutions); */

setCover([
  [1, 0, 1, 0, 1, 1],
  [0, 1, 1, 0, 0, 0],
  [1, 0, 0, 1, 0, 1],
  [0, 1, 1, 1, 1, 0],
]);
