<script lang="ts" setup>
import { vReactive, vRef, vRefAsArray, vRefExtended } from "./abolish-vue";
import { computed } from "vue";

/**
 * Default Data
 */
const formData = {
  name: "John Doe",
  email: "John_Doe@example.com",
  password: "123456"
};

/**
 * Validated Ref
 */
const [email, emailError, validatedEmail] = vRefAsArray(
  formData.email,
  "string:toLowerCase|email",
  { name: "Email Address" }
);

const [age, ageError, validatedAge] = vRefAsArray<string, number>(
  "18",
  "number|min:18|max:50",
  {
    name: "Age"
  }
);

const ageExtended = vRefExtended("20", "number|min:18|max:50", {
  name: "Age"
});

const ageExtendedError = computed(() => ageExtended.error);
const ageExtendedValidated = computed(() => ageExtended.validated);

const {
  original: form,
  error: formError,
  validated: validatedForm
} = vReactive(
  formData,
  {
    email: "required|email"
  },
  { async: true }
);

// const form = reactive(formData);
</script>

<template>
  <div class="mx-auto my-10 px-5">
    <div class="flex justify-center flex-col">
      <img src="/abolish-white.svg" class="flex-initial mx-auto w-[130px] h-[50px]" />
      <h1 class="flex-initial text-3xl text-center tracking-wider inline mt-0">
        Vue Plugin Test
      </h1>
    </div>

    <form action="">
      <h3 class="text-2xl text-green-500 mb-2">Object Form</h3>

      <div class="grid grid-cols-3 gap-3 my-5">
        <template v-for="(v, k) in form" :key="k">
          <div class="col-span-1">
            <label class="text-sm text-gray-400 block capitalize">{{ k }}:</label>
            <input type="text" v-model="form[k]" />
          </div>
        </template>
      </div>

      <h3 class="text-2xl text-green-500 my-3">Email Ref</h3>
      <input type="text" v-model="email" />
      <p class="text-xs text-red-500" v-if="emailError">{{ emailError.message }}</p>

      <h3 class="text-2xl text-green-500 my-3">Age Ref</h3>
      <input type="text" v-model="age" />
      <p class="text-xs text-red-500" v-if="ageError">
        {{ ageError.message }}
      </p>

      <h3 class="text-2xl text-green-500 my-3">Age Extended</h3>
      <input type="text" v-model="ageExtended" />
      <p class="text-xs text-red-500" v-if="ageExtendedError">
        {{ ageExtendedError.message }}
      </p>
    </form>
  </div>

  <Debug
    :data="{
      'Email Validation': {
        original: email,
        validated: validatedEmail,
        error: emailError || false
      },
      'Age Validation': {
        original: age,
        validated: validatedAge,
        error: ageError || false
      },
      'Age Extended': {
        original: ageExtended,
        validated: ageExtendedValidated,
        error: ageExtendedError || false
      },
      'Form Validation': { original: form, validated: validatedForm, error: formError }
    }"
  />
</template>

<style scoped>
input {
  @apply text-sm px-3 py-3 bg-gray-900 border border-gray-700 border-opacity-70 rounded w-full;
  @apply focus:outline-none;
  @apply hover:border-green-500 hover:border-opacity-50;
}
</style>
