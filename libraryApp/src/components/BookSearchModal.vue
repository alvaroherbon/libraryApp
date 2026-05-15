<script setup>
import { ref } from 'vue';
import { searchExternalBooks  } from '../services/openLibraryService';
import { createBook } from '../services/bookService';

const props = defineProps(['isOpen']);
const emit = defineEmits(['close', 'refresh']);

const searchQuery = ref('');
const results = ref([]);
const isSaving = ref(false);


// Si no hay ISBN válido, generamos uno único usando el timestamp actual
const getUniqueISBN = () => {
const shortTimestamp = String(Date.now()).slice(-10);
  return `OL-${shortTimestamp}`;
}

const handleSearch = async () => {
  if (!searchQuery.value) return;
  results.value = await searchExternalBooks(searchQuery.value);
};


const importBook = async (googleBook) => {
  isSaving.value = true;
  const info = googleBook.volumeInfo;
  const uniqueISBN = getUniqueISBN();

  const newBook = {
    title: info.title,
   isbn: info.isbn && info.isbn !== 'S/N' ? info.isbn : uniqueISBN,
   author_ids: [1] // <-- ASEGÚRATE de que el ID 1 exista en tu base de datos
  };

  try {
    await createBook(newBook);
    alert(`¡"${info.title}" añadido con éxito!`);
    emit('refresh');
    emit('close'); // Cerramos el modal tras añadirlo
  } catch (error) {
    // CAPTURAMOS EL ERROR REAL DEL BACKEND
    console.error("Error completo del servidor:", error);
    if (error.response && error.response.data) {
      console.error("Detalles de validación de Django:", error.response.data);
      alert("Error de validación: " + JSON.stringify(error.response.data));
    } else {
      alert("Error al conectar con el servidor backend");
    }
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
      <div class="p-6 border-b flex justify-between items-center bg-indigo-600 text-white">
        <h3 class="text-xl font-bold">Search & Import Books</h3>
        <button @click="$emit('close')" class="hover:text-gray-200">✕</button>
      </div>

      <div class="p-6">
        <div class="flex gap-2">
          <input v-model="searchQuery" @keyup.enter="handleSearch"
                 placeholder="Search by title, author or ISBN..."
                 class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          <button @click="handleSearch" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Search
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6 pt-0">
        <div v-for="item in results" :key="item.id" class="flex items-center justify-between py-4 border-b last:border-0">
          <div>
            <p class="font-bold text-gray-800">{{ item.volumeInfo.title }}</p>
            <p class="text-sm text-gray-500">{{ item.volumeInfo.authors?.join(', ') }}</p>
          </div>
          <button @click="importBook(item)" :disabled="isSaving"
                  class="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm font-bold hover:bg-green-200 disabled:opacity-50">
            + Import
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
