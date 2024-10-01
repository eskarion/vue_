<script>
import {apiUrl, key} from "../api"
export default {
  name: 'navBar',
  data() {
    return {
      projects: []
    };
  },
  methods: {
    async fetchProjects() {
      try {        
        const url = apiUrl + "/projectlist";
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "x-api-key": key,
            Accept: '*/*',
            'User-Agent': 'Vue App',
          },
        });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

        const data = await response.json();
        this.projects = Object.values(data); // Konvertiert das Objekt in ein Array
        console.log(this.projects);
      } catch (error) {
        console.error('Es gab ein Problem mit der Fetch-Anfrage:', error);
      }
    }
  },
  created() {
    this.fetchProjects();
  }
};

</script>

<template>
<nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
    <div class=" flex flex-wrap justify-between items-center mx-auto">
        <a href="/" class="flex items-center">
            <img src="../../invoiceKeeper.png" class="mr-3 h-6 sm:h-9" alt=" Logo">
        </a>
        <div class="flex items-center md:order-2">
            <div class="hidden z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown" data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="top" style="position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(1015px, 972.5px, 0px);">
                <ul class="py-1" aria-labelledby="dropdown">
                    <li v-for="project in projects" :key="project.id">
                      <a class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" :href="`/project/${project.id}`">
                        {{ project.name }}
                      </a>
                    </li>
                </ul>
            </div>
            <button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
            <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
        </div>
        <div class="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
            <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                <li>
                <a href="#" id="navStart" class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">Start</a>
                </li>
                <li>
                <a href="/newProject" id="navNewProject" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Neues Projekt</a>
                </li>
                <li>
                    <button type="button" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown">Projekte</button>
                </li>
            </ul>
        </div>
    </div>
</nav>
</template>

<style>
</style>