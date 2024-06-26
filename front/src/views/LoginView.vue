<script setup>
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import axiosInstance from "@/utils/axiosInstance";
import { useMainStore } from "@/stores/main";
import GuestLayout from "@/layouts/GuestLayout.vue";

const form = reactive({
  email: "",
  password: "",
  error: "",
});

const state = reactive({
  errors: [],
});

const router = useRouter();
const route = useRoute();

const isRegistered = route.query.registered === 'true'
const isConfirmed = route.query.confirmed === 'true'
const isResetPassword = route.query.resetPassword === 'true'

const submit = () => {
  axiosInstance
    .post("/auth/login", form)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      useMainStore().setUser(response.data.user);
      router.push("/");
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 401) {
          form.error = "Nom d'utilisateur ou mot de passe incorrect";
          return;
        }
      }
      form.error = "Une erreur s'est produite lors de la connexion";
    });
};

if (route.query.email && route.query.authentificationToken) {
  try {
    axiosInstance.post("/auth/confirm", {
      email: route.query.email,
      authentificationToken: route.query.authentificationToken,
    }).then(() => {
      router.push("/login?confirmed=true");
    });
  } catch (error) {
    state.errors = error.response.data.errors;
  }
}
</script>

<template>
  <GuestLayout>
    <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Connectez-vous à votre compte
          </h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">
            Vous n'êtes pas encore inscrit ?
            {{ " " }}
            <RouterLink to="register" class="font-semibold text-indigo-500 hover:text-indigo-700">Inscrivez-vous ici
            </RouterLink>
          </p>
        </div>
        <div>
          <div v-if="isRegistered && !state.errors.length" class="text-green-600 my-5">
            Vous avez bien été inscrit. Veuillez confirmer votre email puis vous connecter.
          </div>
          <div v-if="isConfirmed && !state.errors.length" class="text-green-600 my-5">
            Votre email a bien été confirmé. Vous pouvez maintenant vous connecter.
          </div>
          <div v-if="isResetPassword" class="text-green-600 my-5">
            Votre mot de passe a bien été réinitialisé. Vous pouvez maintenant vous connecter.
          </div>
          <div class="my-5">
            <small v-if="form.error" class="text-red-600">{{
              form.error
            }}</small>
          </div>

          <div>
            <form method="POST" class="space-y-6" @submit.prevent="submit">
              <div>
                <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                <input v-model="form.email" type="email" id="email" name="email" placeholder="exemple@gmail.com"
                  class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required />
              </div>

              <div>
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mot de passe</label>
                <input v-model="form.password" type="password" id="password" name="password" placeholder="Mot de passe"
                  class="block w-full pl-2 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required />
              </div>

              <div class="flex items-center justify-end">
                <div class="text-sm leading-6">
                  <RouterLink to="forgot-password" class="font-semibold text-indigo-500 hover:text-indigo-700">Mot de
                    passe oublié ?</RouterLink>
                </div>
              </div>

              <div>
                <button type="submit"
                  class="flex w-full justify-center rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Se connecter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </GuestLayout>
</template>