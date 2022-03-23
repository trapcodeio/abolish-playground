import { Abolish } from "abolish/index.esm";
import { registerAllValidators } from "abolish/src/ValidatorHelpers";

export function extendAbolish() {
  registerAllValidators(Abolish);
}

export default Abolish;
