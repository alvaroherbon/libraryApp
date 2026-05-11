<script setup>

  import {ref, onMounted} from 'vue';
  import {getBooks} from '../services/bookService.js';


  const books = ref([]);

  const loading = ref(true);


  const fetchBooks = async () => {
  try{
  const data = await getBooks();
  books.value = data;

  } catch(error) {
  alert("Error al conectar con el servidor")
  } finally {
  loading.value = false;
  }

  };

  onMounted(() => {
  fetchBooks();
  });
</script>


<template>
  <div class="library-container">
    <h1>My Digital Library</h1>

    <p v-if="loading">Loading books from server...</p>

    <p v-else-if="books.length === 0">No books found in the database.</p>

    <ul v-else>
      <li v-for="book in books" :key="book.id" class="book-item">
        <strong>{{ book.title }}</strong>
        <span> written by:
          {{ book.authors.map(a => a.name).join(', ') }}
        </span>
      </li>
    </ul>
  </div>
</template>








