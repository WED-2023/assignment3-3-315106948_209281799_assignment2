<template>
  <b-container class="mt-5">
    <b-row class="justify-content-center">
      <b-col cols="12" md="8" lg="6">
        <b-card class="transparent-card p-4">
          <h1 class="mb-4">Register</h1>

          <b-form @submit.prevent="register">
            <!-- Validation Errors Summary -->
            <b-alert
              variant="danger"
              v-if="allValidationErrors.length > 0"
              show
              class="mb-4"
            >
              <strong>Please fix the following errors:</strong>
              <ul class="mb-0">
                <li v-for="(err, i) in allValidationErrors" :key="i">{{ err }}</li>
              </ul>
            </b-alert>

            <!-- Username -->
            <b-form-group label="Username" label-for="username">
              <b-form-input
                id="username"
                v-model="state.username"
                @blur="v$.username?.$touch()"
                :state="getValidationState(v$.username)"
              />
              <b-form-invalid-feedback
                v-if="v$.username && v$.username.$dirty && v$.username.$invalid"
              >
                {{ errorMessageForUsername }}
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- First Name -->
            <b-form-group label="First Name" label-for="firstname">
              <b-form-input
                id="firstname"
                v-model="state.firstname"
                @blur="v$.firstname?.$touch()"
                :state="getValidationState(v$.firstname)"
              />
              <b-form-invalid-feedback
                v-if="v$.firstname && v$.firstname.$dirty && v$.firstname.$invalid"
              >
                First Name is required.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Last Name -->
            <b-form-group label="Last Name" label-for="lastname">
              <b-form-input
                id="lastname"
                v-model="state.lastname"
                @blur="v$.lastname?.$touch()"
                :state="getValidationState(v$.lastname)"
              />
              <b-form-invalid-feedback
                v-if="v$.lastname && v$.lastname.$dirty && v$.lastname.$invalid"
              >
                Last Name is required.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Country -->
            <b-form-group label="Country" label-for="country">
              <b-form-select
                id="country"
                v-model="state.country"
                :options="countries"
                @change="v$.country?.$touch()"
                :state="getValidationState(v$.country)"
              />
              <b-form-invalid-feedback
                v-if="v$.country && v$.country.$dirty && v$.country.$invalid"
              >
                Country is required.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Password -->
            <b-form-group label="Password" label-for="password">
              <b-form-input
                id="password"
                type="password"
                v-model="state.password"
                @input="v$.password?.$touch()"
                :state="getValidationState(v$.password)"
              />
              <b-form-invalid-feedback
                v-if="v$.password && v$.password.$dirty && v$.password.$invalid"
              >
                {{ errorMessageForPassword }}
              </b-form-invalid-feedback>
              <b-form-text class="text-muted">
                Password must be 5–10 characters, include 1 number and 1 special character.
              </b-form-text>
            </b-form-group>

            <!-- Confirm Password -->
            <b-form-group label="Confirm Password" label-for="confirmedPassword">
              <b-form-input
                id="confirmedPassword"
                type="password"
                v-model="state.confirmedPassword"
                @blur="v$.confirmedPassword?.$touch()"
                :state="getValidationState(v$.confirmedPassword)"
              />
              <b-form-invalid-feedback
                v-if="v$.confirmedPassword && v$.confirmedPassword.$dirty && v$.confirmedPassword.$invalid"
              >
                {{ errorMessageForConfirmedPassword }}
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Email -->
            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                v-model="state.email"
                @blur="v$.email?.$touch()"
                :state="getValidationState(v$.email)"
              />
              <b-form-invalid-feedback
                v-if="v$.email && v$.email.$dirty && v$.email.$invalid"
              >
                Email is required.
              </b-form-invalid-feedback>
            </b-form-group>

            <b-button type="submit" variant="primary" class="w-100">Register</b-button>

            <b-form-invalid-feedback
              v-if="state.submitError"
              class="d-block mt-3 text-danger"
            >
              {{ state.submitError }}
            </b-form-invalid-feedback>

            <div class="mt-2">
              Already have an account?
              <router-link to="/login">Login here</router-link>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  minLength,
  maxLength,
  alpha,
  sameAs,
  // helpers,
} from '@vuelidate/validators';
import rawCountries from '../assets/countries';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter();
    const toast = useToast();

    const state = reactive({
      username: '',
      firstname: '',
      lastname: '',
      password: '',
      confirmedPassword: '',
      country: '',
      submitError: null,
      email: '',
    });

    const passwordRef = computed(() => state.password);

    // Only accept digits anywhere in the string
    // const hasNumber = helpers.regex('hasNumber', /.*\d.*/);
    // // Only accept one of these special chars anywhere in the string
    // const hasSpecialChar = helpers.regex(
    //   'hasSpecialChar',
    //   /.*[!@#$%^&*(),.?":{}|<>].*/
    // );

    const rules = {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(8),
        alpha,
      },
      firstname: { required },
      lastname: { required },
      country: { required },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
        // hasNumber,
        // hasSpecialChar,
      },
      confirmedPassword: {
        required,
        sameAsPassword: sameAs(passwordRef),
      },
      email: { required },
    };

    const v$ = useVuelidate(rules, state);

    const getValidationState = (field) => {
      if (!field || !field.$dirty) return null;
      return !field.$invalid;
    };

    const errorMessageForUsername = computed(() => {
      const username = v$.value.username;
      if (username.required === false) return 'Username is required.';
      if (username.minLength === false || username.maxLength === false)
        return 'Username must be 3–8 characters, letters only.';
      if (username.alpha === false)
        return 'Username must contain only letters.';
      return '';
    });

    const errorMessageForPassword = computed(() => {
      const pw = v$.value.password;
      if (!pw) return '';
      if (pw.required === false) return 'Password is required.';
      if (pw.minLength === false || pw.maxLength === false)
        return 'Password must be 5–10 characters.';
      if (pw.hasNumber === false)
        return 'Password must include at least one number.';
      if (pw.hasSpecialChar === false)
        return 'Password must include at least one special character.';
      return '';
    });

    const errorMessageForConfirmedPassword = computed(() => {
      const cp = v$.value.confirmedPassword;
      if (cp.required === false) return 'Confirmation is required.';
      if (cp.sameAsPassword === false) return 'Passwords do not match.';
      return '';
    });

    const allValidationErrors = computed(() => {
      const errors = [];
      if (v$.value.username.$dirty && v$.value.username.$invalid)
        errors.push(errorMessageForUsername.value);
      if (v$.value.firstname.$dirty && v$.value.firstname.$invalid)
        errors.push('First Name is required.');
      if (v$.value.lastname.$dirty && v$.value.lastname.$invalid)
        errors.push('Last Name is required.');
      if (v$.value.country.$dirty && v$.value.country.$invalid)
        errors.push('Country is required.');
      if (v$.value.password.$dirty && v$.value.password.$invalid)
        errors.push(errorMessageForPassword.value);
      if (
        v$.value.confirmedPassword.$dirty &&
        v$.value.confirmedPassword.$invalid
      )
        errors.push(errorMessageForConfirmedPassword.value);
      if (v$.value.email.$dirty && v$.value.email.$invalid)
        errors.push('Email is required.');
      return errors;
    });

    const register = async () => {
      v$.value.$touch();
      
      // 🔍 DEBUG LOGGING
      const pw = v$.value.password;
      console.log('🛠️ Password debug — raw value:', state.password);
      console.log('   • required invalid?      ', pw.required.$invalid);
      console.log('   • minLength(5) invalid?  ', pw.minLength.$invalid);
      console.log('   • maxLength(10) invalid? ', pw.maxLength.$invalid);
      console.log('   • hasNumber invalid?     ', pw.hasNumber.$invalid);
      console.log('   • hasSpecialChar invalid?', pw.hasSpecialChar.$invalid);
      console.log(
        '   • overall invalid?       ',
        pw.$invalid,
        '| failed validators:',
        pw.$errors.map(e => e.$validator)
      );

      const valid = await v$.value.$validate();
      if (!valid) {
        console.warn('🚨 register() aborted — validation failed');
        return;
      }
      try {
        await window.axios.post(`/Register`, {
          username: state.username,
          firstname: state.firstname,
          lastname: state.lastname,
          password: state.password,
          country: state.country,
          email: state.email,
        });
        toast.success('Registration successful! You can now login.');
        router.push('/login');
      } catch (err) {
        state.submitError =
          err.response?.data?.message || 'Unexpected error.';
      }
    };

    return {
      state,
      countries: ['Select a country', ...rawCountries],
      register,
      v$,
      getValidationState,
      errorMessageForUsername,
      errorMessageForPassword,
      errorMessageForConfirmedPassword,
      allValidationErrors,
    };
  },
};
</script>

<style scoped>
</style>
