import type {Plugin} from "vue";
import {Abolish} from "abolish";
import {registerAllValidators} from "abolish/src/ValidatorHelpers";

// Export all abolish imports
// export {Abolish, Rule, ParseRules}

export default <Plugin>{
    install() {
        // Register all validators
        registerAllValidators(Abolish)
    }
};
