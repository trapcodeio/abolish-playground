import { Abolish } from "abolish";
import { registerAllValidators } from "abolish/src/ValidatorHelpers";

export function extendAbolish() {
  registerAllValidators(Abolish);
}

export default Abolish;
