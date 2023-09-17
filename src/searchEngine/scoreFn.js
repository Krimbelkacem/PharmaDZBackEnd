const params = require("../params/searchEngineParams");

const { filterKeysByPrefix } = require("./helper");

const countCumul = (chain, matrix) => {
  return chain.reduce((acc, index) => {
    if (!acc) return matrix[index];
    return acc.map((a, i) => a + matrix[index][i]);
  }, null);
};
const {
  createIndexFromIDs,
  createDCIIndexFromIds,
  createPharmaDistenceIndex,
  createPharmaDistenceMatrix,
} = require("./queryGenerators");
const covered = (cumul) => {
  return cumul.filter((e) => e != 0).length == cumul.length;
};

const expirationIndex = (quantities) => {
  return quantities.map((quantity) =>
    filterKeysByPrefix("exp_", Object.keys(quantity)).map((key) =>
      Number.parseInt(quantity[key])
    )
  );
};

const medIdsFromQuantity = (quantities) => {
  return filterKeysByPrefix("Q_", Object.keys(quantities[0])).map((key) =>
    Number.parseInt(key.slice(2))
  );
};

const quantityIndex = (quantities) => {
  return quantities.map((quantity) =>
    filterKeysByPrefix("Q_", Object.keys(quantity)).map((key) =>
      Number.parseInt(quantity[key])
    )
  );
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
  //console.log("best", bestCumuls);
  const indexes = matrix.map((_, i) => i);

  for (let _ = 0; _ < params.getParams().nb_pharma_result_max; _++) {
    let addedChains = [];
    //console.log("________________________________");
    //console.log("iteration ", _);

    //console.log("________________________________");
    chains.forEach((chain, i_ch) => {
      //console.log("chain", chain, "index", i_ch);
      //console.log("________________________________");
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

      ////console.log(testCumul);
      //console.log("________________________________");
      let max = testCumul.reduce(
        (max, e, index) =>
          testCumul[max].value > testCumul[index].value ? max : index,
        0
      );
      /*//console.log(
        "added",
        testCumul.filter((test) => test.value == testCumul[max].value)
      );*/
      //console.log("testcumul", testCumul[max], "\nbest", bestCumuls[i_ch]);
      addedChains.push([
        i_ch,
        testCumul[max].value > bestCumuls[i_ch].value
          ? testCumul.filter((test) => test.value == testCumul[max].value)
          : [],
      ]);
    });
    //console.log("addedchains", addedChains[0][1].length);

    chains = addedChains.reduce((acc, elem) => {
      ////console.log(elem);
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

    //console.log("chains", chains, "\nbest", bestCumuls);
    //let newChains =
  }
  return chains;
};

const constructMinExpirationGlobal = (matExpiration) => {
  //console.log("E construct min", matExpiration);
  return matExpiration.reduce((acc, elem) => {
    // //console.log("acc", acc);
    return acc.map((ac, i) => {
      if (elem[i] && ac) return ac < elem[i] ? ac : elem[i];
      if (elem[i]) return elem[i];
      return ac;
    });
  }, matExpiration[0]);
};

const constructMaxQuantityGlobal = (matQuantity) => {
  return matQuantity.reduce(
    (acc, elem) =>
      (acc = acc.map((ac, index) => (ac > elem[index] ? ac : elem[index]))),
    [...matQuantity[0]]
  );
};

const constructPharmciesChains = (matQuantity) => {
  return setCover(matQuantity);
};

const scoreDistence = (chains, pharmacies, mat) => {
  //console.log("pharmacies", pharmacies);
  //console.log("chains", chains);
  let dists = chains.map((chain) => {
    /*//console.log(
      "test selection",
      pharmacies
        .map((ph, index) => ({ ph, index }))
        .filter((_, index) => chain.some((i) => i == index))
    );*/
    let selected = pharmacies
      .map((ph, index) => ({ ph, index }))
      .filter((_, index) => chain.some((i) => i == index));
    //console.log("selected 1", selected);
    selected = selected.sort((p1, p2) => p1.ph.distance - p2.ph.distance);
    //console.log("selected", selected);
    return {
      order: [...selected /* .map((_) => _.ph) */],
      distance: selected.reduce((acc, ph) => acc + ph.ph.distance, 0),
    };
  });
  let minDist = Math.min(...dists.map((d) => d.distance).filter((d) => d != 0));
  return dists.map((_) => ({
    ..._,
    score: _.distance ? minDist / _.distance : 1,
  }));
};

const scoreExpiration = (chains, exp, minE) => {
  return chains.map((chain) => {
    let minChain = constructMinExpirationGlobal(
      exp.filter((_, i) => chain.includes(i))
    );
    //console.log(minChain);
    return (
      minChain.reduce(
        (score, elem, i) =>
          isNaN(elem) || isNaN(minE[i]) ? score : score + elem / minE[i],
        0
      ) / minE.length
    );
  });
};

const finalScore = (chains, exp, dist, quant, pharmacies, mat) => {
  let scoreCoeff = params.getParams().coefficients;
  const maxQ = constructMaxQuantityGlobal(quant);
  const minE = constructMinExpirationGlobal(exp);
  //console.log("minE", minE);
  //console.log("maxQ", maxQ);
  const scoreQ = scoreQuantity(chains, quant, maxQ);
  const scoreE = scoreExpiration(chains, exp, minE);
  const scoreD = scoreDistence(chains, pharmacies, []);

  let results = scoreD.map((sd, i) => ({
    pharmacies: sd.order.map((o) => o.ph),
    distance: sd.distance,
    score: (
      scoreCoeff.distance * sd.score +
      scoreCoeff.quantity * scoreQ[i] +
      scoreCoeff.expiration * scoreE[i]
    ).toFixed(2),
  }));

  return { results: results.sort((r1, r2) => r2.score - r1.score) };
};

const scoreQuantity = (chains, quant, maxQ) => {
  //console.log("\ns_Q\n", chains);
  return chains.map((chain) => {
    let maxChain = constructMaxQuantityGlobal(
      quant.filter((_, i) => chain.includes(i))
    );
    //console.log("maxchain", maxChain, maxQ.length);

    return (
      maxChain.reduce(
        (score, elem, i) =>
          elem == 0 || maxQ[i] == 0 ? score : score + elem / maxQ[i],
        0
      ) / maxQ.length
    );
  });
};

const minChainDist = (pharDisMat, distPhar, chains) => {};
module.exports = {
  constructMaxQuantityGlobal,
  constructMinExpirationGlobal,
  constructPharmciesChains,
  setCover,
  finalScore,
};

const test = async () => {
  let pharmacies = await createPharmaDistenceIndex({
    longitude: 4.0,
    latitude: 36.0,
  });
  let quantity = await createIndexFromIDs([178, 1, 29], pharmacies);
  pharmacies = pharmacies.filter((pharma) =>
    quantity.some((_) => _.pharmacie_id == pharma.pharmacie_id)
  );
  let mat = await createPharmaDistenceMatrix(pharmacies);
  /*//console.log(
    finalScore(
      setCover(quantityIndex(quantity)),
      expirationIndex(quantity),
      [],
      quantityIndex(quantity),
      pharmacies
    )
  );*/
};

test();
