<script setup>
import { ref, onMounted } from 'vue';
import { getBooks } from '../services/bookService.js';

const books = ref([]);
const loading = ref(true);

const fetchBooks = async () => {
  try {
    const data = await getBooks();
    books.value = data;
  } catch (error) {
    console.error("Error al conectar con el servidor", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBooks();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Encabezado -->
      <div class="flex items-center justify-between mb-10">
        <div>
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">
            My Digital <span class="text-indigo-600">Library</span>
          </h1>
          <p class="mt-2 text-gray-600 text-lg">Manage your personal collection from Aiven DB.</p>
        </div>
        <!-- Botón de refrescar con estilo -->
        <button @click="fetchBooks"
                class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Refresh List
        </button>
      </div>

      <!-- Estado: Cargando -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span class="ml-4 text-gray-600 font-medium">Fetching books...</span>
      </div>

      <!-- Estado: Lista Vacía -->
      <div v-else-if="books.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
        <p class="text-gray-500 text-xl font-medium">No books found in the database.</p>
        <button class="mt-4 text-indigo-600 font-semibold hover:text-indigo-500">Add your first book +</button>
      </div>

      <!-- Grid de Libros -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="book in books" :key="book.id"
             class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">

          <!-- Decoración lateral con color -->
          <div class="absolute inset-y-0 left-0 w-1.5 bg-indigo-600 transition-all group-hover:w-2"></div>

          <div class="p-6">
            <div class="flex justify-between items-start">
              <h2 class="text-xl font-bold text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors">
                {{ book.title }}
              </h2>
            </div>

            <div class="mt-4 flex flex-col gap-2">
              <div class="flex items-center text-sm text-gray-500">
                <span class="font-semibold text-gray-400 mr-2 uppercase text-xs tracking-wider">ISBN</span>
                {{ book.isbn || 'N/A' }}
              </div>

              <div class="mt-4">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Written by</p>
                <div class="flex flex-wrap gap-1">
                  <span v-for="author in book.authors" :key="author.id"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {{ author.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer de la tarjeta -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
             <span class="text-xs text-gray-400 font-medium italic">ID: #{{ book.id }}</span>
             <button class="text-indigo-600 hover:text-indigo-800 text-sm font-bold">Details →</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
