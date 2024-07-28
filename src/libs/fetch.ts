import { IBook } from "../types/entity";

export const API_URL = "https://v1.appbackend.io/v1/rows/KJS7gyCtV5eG";

export async function fetchData<T>(
  url: RequestInfo | URL,
  tag: string,
  config?: RequestInit
) {
  try {
    const res = await fetch(url, config);

    if (res.status !== 200) {
      throw new Error(`Error fetching data with tag ${tag}`);
    }

    const data = (await res.json()) as T;
    return data;
  } catch (error) {
    throw error;
  }
}

type AddBookPayload = Omit<IBook, "_id">;

export async function addNewBook(book: AddBookPayload) {
  try {
    await fetchData(API_URL, "add-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([book]),
    });
  } catch (error) {
    throw error;
  }
}

export async function updateBook(book: IBook) {
  try {
    await fetchData(API_URL, "update-book", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteBook(bookId: string) {
  try {
    await fetchData(API_URL, "delete-book", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([bookId]),
    });
  } catch (error) {
    throw error;
  }
}
