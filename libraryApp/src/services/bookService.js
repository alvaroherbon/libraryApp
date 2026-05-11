import apiClient from "./api"


export const getBooks = async () => {
  try{
    const response = await apiClient.get("books/");
    return response.data;
  } catch(error){
    console.error("Error fetching books:", error);
    throw error;
  }
};


export const createBook = async (bookData) => {
  try{
    const response = await apiClient.post("books/", bookData);
    return response.data;
  } catch(error){
    console.error("Error creating book:", error);
    throw error;
  }
};





