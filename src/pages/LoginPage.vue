<template>
<b-container class="mt-5">
  <b-row class="justify-content-center">
    <b-col cols="12" md="8" lg="5">
      <b-card class="transparent-card p-4">
            <h1 class="mb-4">Login</h1>


    <b-form @submit.prevent="login">
      <!-- Username -->
      <b-form-group label="Username" label-for="username">
        <b-form-input
          id="username"
          v-model="state.username"
          @blur="v$.username.$touch()"
          :state="getValidationState(v$.username)"
        />
        <b-form-invalid-feedback v-if="v$.username.$dirty && v$.username.$invalid">
          Username is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password -->
      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="state.password"
          @blur="v$.password.$touch()"
          :state="getValidationState(v$.password)"
        />
        <b-form-invalid-feedback v-if="v$.password.$dirty && v$.password.$invalid">
          Password is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="primary" class="w-100">Login</b-button>

      <!-- <b-alert
        variant="danger"
        class="mt-3"
        dismissible
        v-if="state.submitError"
        show
      >
        Login failed: {{ state.submitError }}
      </b-alert> -->

      <b-form-invalid-feedback
        v-if="state.submitError"
        class="d-block mt-3 text-danger"
      >
        {{ state.submitError }}
      </b-form-invalid-feedback>

      <div class="mt-2">
        Don’t have an account?
        <router-link to="/register">Register here</router-link>
      </div>
    </b-form>
      </b-card>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const toast = useToast();
    const { appContext } = getCurrentInstance();
    const store = appContext.config.globalProperties.store;

    const state = reactive({
      username: '',
      password: '',
      submitError: null,
    });

    const rules = {
      username: { required },
      password: { required },
    };

    const v$ = useVuelidate(rules, state);

    const getValidationState = (field) => {
      return field.$dirty ? !field.$invalid : null;
    };

    const login = async () => {
      v$.value.$touch();
      const valid = await v$.value.$validate();
      console.log('validation result:', valid);
      if (!valid) {
        console.log('Validation failed');
        return;
      }

      try {
        console.log('Sending login request:', {
          username: state.username,
          password: state.password,
        });
        await window.axios.post('/login', {
          username: state.username,
          password: state.password,
        });
        store.login(state.username);
        toast.success(`Welcome ${state.username}!`);
        console.log('Login successful, redirecting to main page');
        router.push('/');
      } catch (err) {
        console.error('Login failed:', err);
        state.submitError = err.response?.data?.message || 'Unexpected error.';
      }
    };

    return { state, v$, login, getValidationState };
  },
};
</script>
