<script lang="ts" setup>
import { useClipboard } from "@vueuse/core";
import { Schema } from "abolish/esm";
import { computed, onBeforeMount, onMounted, Ref, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { fromJson, isValidJson, toJson } from "../functions";
import Abolish from "../abolish";
import pkg from "../../package.json";
import { AbolishCompiledObject } from "abolish/src/Compiler";

// Get list of registered validators
const validators = Object.keys(Abolish.getGlobalValidators())
  .filter((v) => !["$inline"].includes(v))
  .sort();

// Get $route
const $route = useRoute();

// Set data from query string
// I.e Shareable link
onBeforeMount(() => {
  if ($route.query.hasOwnProperty("data")) {
    let d = $route.query.data as string;
    try {
      data.value = atob(d);
    } catch (e) {}
  }

  if ($route.query.hasOwnProperty("rules")) {
    let r = $route.query.rules as string;
    try {
      rules.value = atob(r);
    } catch (e) {}
  }
});

/**
 * ============================================================================
 * SETUP
 * ============================================================================
 */
const defaultData = toJson({
  email: "john@example.com",
  name: "John Doe",
  phone: "+1 (123) 456-7890",
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345"
  },
  jsonDump: '{"verified": true}',
  verified: "02/05/2020",
  registered: "02/05/2020"
});

const defaultRules = toJson({
  $: "required|typeof:string",
  email: "email",
  name: "minLength:2|maxLength:10",
  address: {
    typeof: "object",
    object: {
      $: "required|typeof:string",
      street: "minLength:2|maxLength:20",
      city: "minLength:2|maxLength:20",
      state: "size:2",
      zip: "number|string:toString"
    },
  },
  jsonDump: "json|jsonDecode",
  verified: "date",
  registered: "date:cast",

  $include: ["phone"]
});

/**
 * ===== Variables =====
 */
let timeout = -1;
const result = ref(toJson([]));
const data = ref(defaultData);
const rules = ref(defaultRules);
const compiledRules = computed<{
  error?: any;
  compiled?: AbolishCompiledObject;
}>(() => {
  try {
    return {error: undefined, compiled: Abolish.compileObject(fromJson(rules.value)) }
  } catch (e) {
    return {error: e, compiled: undefined}
  }
});

/**
 * ===== Computed =====
 */
const dataHasError = computed(() => {
  return !isValidJson(data.value);
});

const rulesHasError = computed(() => {
  return !isValidJson(rules.value);
});

const resultHasError = computed(() => {
  const r = fromJson(result.value);
  if (typeof r === "object" && r.hasOwnProperty("error")) {
    return true;
  } else if (Array.isArray(r) && r[0]) {
    return true;
  }
});

/**
 * ===== Watchers =====
 */
watch(data, () => onDataChange(data));
watch(rules, () => onDataChange(rules));

/**
 * ===== Functions
 */
function onDataChange(ref: Ref<any>) {
  // Clear timeout if exits
  if (timeout !== -1) clearTimeout(timeout);
  // set new timeout
  timeout = setTimeout(() => {
    if (!isValidJson(ref.value)) return;

    // validate
    validate();

    // refactor
    const refactored = toJson(fromJson(ref.value));
    if (refactored !== ref.value) {
      ref.value = refactored;
    }
  }, 1000);
}

/**
 * Function that validates the data
 */
function validate() {
  if (!isValidJson(data.value) || !isValidJson(rules.value)) return;

  try {
    // compile to make sure rules are valid
    const { compiled, error } = compiledRules.value;

    if (error) {
      result.value = toJson({ error: error.message });
      return;
    }

    const [err, validated] = compiled!.validate(fromJson(data.value));

    if (err) {
      result.value = toJson({ error: err });
    } else {
      result.value = toJson(validated);
    }
  } catch (e: any) {
    result.value = toJson({ error: e.message });
  }
}

function parseRules() {
  const shouldParse = confirm("Are you sure you want to parse rules to object?");
  if (!shouldParse) return;

  rules.value = toJson(Schema(fromJson(rules.value)));
}

function clearData() {
  if (!confirm("Are you sure you want to clear data?")) return;
  data.value = toJson({});
}

function clearRules() {
  if (!confirm("Are you sure you want to clear rules?")) return;
  rules.value = toJson({});
}

const shareLink = computed(() => {
  try {
    return (
      window.location.origin +
      window.location.pathname +
      "?data=" +
      btoa(data.value) +
      "&rules=" +
      btoa(rules.value)
    );
  } catch (e) {
    return "";
  }
});

const enableSharing = computed(() => {
  if (data.value === defaultData && rules.value === defaultRules) return false;

  return shareLink.value.length > 0;
});

const {
  copy: copyShareLink,
  copied: hasCopiedShareLink,
  isSupported: canCopyShareLink
} = useClipboard({ source: shareLink });

onMounted(validate);
</script>

<template>
  <div class="mx-auto my-10 px-5">
    <div class="flex justify-center flex-col md:flex-row">
      <img
        src="/abolish-white.svg"
        class="flex-initial mx-auto md:mx-0 w-[130px] h-[50px]"
       alt="Abolish Logo"/>
      <h1 class="flex-initial text-3xl text-center tracking-wider inline mt-0 md:mt-2">
        PlayGround
      </h1>
    </div>

    <div class="text-sm text-center">
      <a href="https://abolish.trapcode.io" target="_blank" class="text-green-400"
        >Abolish Documentation</a
      >
      <br>
      <small>VERSION: <strong>({{pkg.dependencies.abolish}})</strong></small>
    </div>

    <div class="my-10 text-center">
      <h6 class="text-xs text-yellow-400">
        Registered Validators: ({{ validators.length }})
      </h6>

      <div class="flex flex-wrap gap-y-1 gap-x-2 mt-2 justify-center">
        <template v-for="v in validators">
          <button
            class="text-xs bg-gray-700 text-green-300 hover:text-yellow-400 px-2 py-0.5 rounded"
          >
            {{ v }}
          </button>
        </template>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-5 lg:space-x-10">
      <div class="col-span-1">
        <label for="data" class="text-yellow-400"
          >Data: <span v-if="dataHasError" class="text-red-500">Has error!</span>

          <button
            @click.prevent="clearData"
            class="float-right text-sm text-green-400 hover:text-green-500"
          >
            clear
          </button>
        </label>
        <textarea
          class="text-green-900"
          :class="{ 'bg-red-100': dataHasError }"
          @change="validate"
          v-model="data"
          id="data"
        ></textarea>
      </div>
      <div class="col-span-1">
        <div  class="text-yellow-400">
          Rules: <span v-if="rulesHasError" class="text-red-500">Has error!</span>
          <div class="float-right">
            <button
              @click.prevent="clearRules"
              class="text-sm text-green-400 hover:text-green-500"
            >
              clear
            </button>
            <span class="text-gray-500 mx-1">-</span>
            <button
              @click.prevent="parseRules"
              class="text-sm text-green-400 hover:text-green-500"
            >
              Parse Rules
            </button>
          </div>
        </div>
        <textarea
          class="text-blue-900"
          :class="{ 'bg-red-100': rulesHasError }"
          @change="validate"
          v-model="rules"
          id="rules"
        ></textarea>
      </div>
      <div class="col-span-1 md:col-span-2 lg:col-span-1">
        <label for="result" class="text-yellow-500">
          Result:
          <span
            class="text-sm"
            :class="[resultHasError ? 'text-red-400' : 'text-green-400']"
          >
            {{ resultHasError ? "Failed Validation!" : "Passed Validation!" }}
          </span>
        </label>
        <textarea
          v-model="result"
          id="result"
          class="text-black"
          :class="{
            'bg-red-200': resultHasError,
            'bg-green-200': !resultHasError
          }"
          disabled
        ></textarea>
      </div>
    </div>

    <div v-if="enableSharing" class="my-5 relative">
      <h5 class="text-sm font-medium mb-2">
        Share your data and rules with your friends!

        <button
          v-if="canCopyShareLink"
          @click.prevent="copyShareLink()"
          class="text-green-400 ml-1 mr-2"
        >
          Copy Share link
        </button>

        <span v-if="hasCopiedShareLink" class="text-yellow-400"
          >#Copied to clipboard!</span
        >
      </h5>

      <input type="text" :value="shareLink" readonly class="" />
    </div>

    <debug :data="{  }"/>
  </div>
</template>

<style scoped>
input {
  @apply text-sm px-3 py-3 bg-gray-900 border border-gray-700 border-opacity-70 rounded w-full text-gray-500;
  @apply focus:outline-none;
  @apply hover:border-green-500 hover:border-opacity-50;
}

textarea {
  @apply focus:outline-none focus:ring-2 ring-green-700;
  @apply w-full rounded shadow-lg border-2 border-gray-900 p-4 font-mono text-xs leading-6;
  @apply h-[400px] md:h-[450px] lg:h-[600px];
}
</style>
