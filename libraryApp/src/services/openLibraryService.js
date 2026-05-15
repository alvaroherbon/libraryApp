import axios from 'axios';

export const searchExternalBooks = async (query) => {
  try {
    // Buscamos por título o autor
    const response = await axios.get(`https://openlibrary.org/search.json?q=${query}&limit=10`);

    console.log(response)

    // Open Library devuelve los datos en .docs
return response.data.docs.map(book => ({
  id: book.key,
  volumeInfo: {
    title: book.title,
    authors: book.author_name || ['Unknown Author'],
    // Intentamos buscar un ISBN de 13 dígitos, si no el primero, si no S/N
    isbn: book.isbn ? (book.isbn.find(i => i.length === 13) || book.isbn[0]) : 'S/N',
    publishedDate: book.first_publish_year || 'N/A'
  }
}));
      } catch (error) {
    console.error("Error en Open Library", error);
    return [];
  }
};
