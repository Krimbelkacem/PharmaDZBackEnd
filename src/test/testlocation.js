const loc = require("../location");
//console.log(loc);
let code = loc.OpenLocationCode.encode(
  36.58856193728613,
  3.7704533658989363,
  15
);

console.log(code);

let decode = loc.OpenLocationCode.decode(code);

console.log(decode);
console.log(decode.latitudeCenter, ",", decode.longitudeCenter);
