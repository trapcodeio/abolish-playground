import { Abolish } from "abolish/esm";
import { registerAllValidators } from "abolish/src/ValidatorHelpers";

export function extendAbolish() {
  registerAllValidators(Abolish);
}

export default Abolish;
