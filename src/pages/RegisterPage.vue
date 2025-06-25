<template>
  <div class="container mt-4" style="max-width: 500px;">
    <h2 class="mb-4">Register</h2>
    <b-form @submit.prevent="register">
      <!-- Usermame -->
      <b-form-group label="Usermame" label-for="username">
        <b-form-input
          id="username"
          v-model="state.username"
          @blur="v$.username.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.username.$error">
          <div v-if="!v$.username.required">Usermame is required.</div>
          <div v-else-if="!v$.username.minLength || !v$.username.maxLength">
            Usermame must be 3–8 characters.
          </div>
          <div v-else-if="!v$.username.alpha">Usermame must contain only letters.</div>
        </b-form-invalid-feedback>
      </b-form-group>

      <!--First Name-->
      <b-form-group label="Firstmame" label-for="firstname">
        <b-form-input
          id="firstname"
          v-model="state.firstname"
          @blur="v$.firstname.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.firstname.$error">
          <div v-if="!v$.firstname.required">Firstmame is required.</div>
        </b-form-invalid-feedback>
      </b-form-group>

      <!--Last Name-->
      <b-form-group label="Lastmame" label-for="lastname">
        <b-form-input
          id="lastname"
          v-model="state.lastname"
          @blur="v$.lastname.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.lastname.$error">
          <div v-if="!v$.lastname.required">Lastname is required.</div>
        </b-form-invalid-feedback>
      </b-form-group>


      <!-- Country -->
      <b-form-group label="Country" label-for="country">
        <b-form-select
          id="country"
          v-model="state.country"
          :options="countries"
          @change="v$.country.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.country.$error">
          Country is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password -->
      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="state.password"
          @blur="v$.password.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.password.$error">
          <div v-if="!v$.password.required">Password is required.</div>
          <div v-else-if="!v$.password.minLength || !v$.password.maxLength">
            Password must be 5–10 characters.
          </div>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Confirm Password -->
      <b-form-group label="Confirm Password" label-for="confirmedPassword">
        <b-form-input
          id="confirmedPassword"
          type="password"
          v-model="state.confirmedPassword"
          @blur="v$.confirmedPassword.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.confirmedPassword.$error">
          <div v-if="!v$.confirmedPassword.required">Confirmation is required.</div>
          <div v-else-if="!v$.confirmedPassword.sameAsPassword">
            Passwords do not match.
          </div>
        </b-form-invalid-feedback>
      </b-form-group>


      <!--Email-->
      <b-form-group label="Email" label-for="email">
        <b-form-input
          id="email"
          v-model="state.email"
          @blur="v$.email.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.email.$error">
          <div v-if="!v$.email.required">Email is required.</div>
        </b-form-invalid-feedback>
      </b-form-group>

      

      <b-button type="submit" variant="success" class="w-100">Register</b-button>

      <b-alert
        variant="danger"
        class="mt-3"
        dismissible
        v-if="state.submitError"
        show
      >
        Registration failed: {{ state.submitError }}
      </b-alert>

      <div class="mt-2">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </div>
    </b-form>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, alpha, sameAs } from '@vuelidate/validators';
import rawCountries from '../assets/countries';
import { computed, reactive } from 'vue';



export default {
  name: 'RegisterPage',
  setup() {
    // const internalInstance = getCurrentInstance();
    // const store = internalInstance.appContext.config.globalProperties.store;

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

    const rules = {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(8),
        alpha,
      },
      firstname: {
        required,
      },
      lastname: {
        required,
      },
      country: { required },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
      },
      confirmedPassword: {
        required,
      sameAsPassword: sameAs(passwordRef),
      },
      email: {
        required,
      },
    };

    const v$ = useVuelidate(rules, state);

    const register = async () => {
      console.log("register called");
      console.log('password:', state.password);
      console.log('confirmedPassword:', state.confirmedPassword);
      console.log('same?', state.password === state.confirmedPassword);
      const valid = await v$.value.$validate();
      console.log("validation result:", valid);
      // console.log("v$:", v$.value);
      if (!valid) {
        console.log("Validation failed. Fields with errors:");
        // for (const [key, field] of Object.entries(v$.value)) {
        //   //print to console the field name and its value 

        //   if (field?.$error) {
        //     const value = field.$model !== undefined ? field.$model : '(no model)';
        //     console.warn(`❌ ${key} failed validation. Value: ${value}`);
        //   }
        // }
      return;
      }

      try {
        console.log("Sending registration request with data:", {
          username: state.username,
          firstname: state.firstname,
          lastname: state.lastname,
          password: state.password,
          country: state.country,
          email: state.email,
        });
        await window.axios.post(`/Register`,{
          username: state.username,
          firstname: state.firstname,
          lastname: state.lastname,
          password: state.password,
          country: state.country,
          email: state.email,
        });
        window.toast('Registration successful', 'You can now login', 'success');
        window.router.push('/login');
      } catch (err) {
        console.error('Registration failed:', err);
        state.submitError = err.response?.data?.message || 'Unexpected error.';
      }
    };

    return {
      state,
      countries: ['Select a country', ...rawCountries],
      register,
      v$,
    };
  },
};
</script>
