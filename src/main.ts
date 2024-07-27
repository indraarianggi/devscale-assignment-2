// import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

import { fetchData } from "./libs/fetch";
import { IBook } from "./types/entity";

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

interface IBookResult {
  data: IBook[];
}

const API_URL = "https://v1.appbackend.io/v1/rows/KJS7gyCtV5eG";

async function getBooks(filter: Record<string, any> = {}) {
  let params = "";
  for (const key in filter) {
    params = `filterKey=${key}&filterValue=${filter[key]}`;
  }

  const result = await fetchData<IBookResult>(
    `${API_URL}?${params}`,
    "all-books"
  );

  if (!result) {
    console.error("Aplikasi error!");
    return;
  }

  const { data: books } = result;

  console.log({ books });
}

getBooks();
getBooks({ highlight: 1 });

const formBook = document.getElementById("form") as HTMLFormElement;
const inputTitle = document.getElementById("title") as HTMLInputElement;
const inputAuthor = document.getElementById("author") as HTMLInputElement;
const inputGenre = document.getElementById("genre") as HTMLSelectElement;
const inputReview = document.getElementById("review") as HTMLInputElement;
const inputRating = document.getElementById("rating") as HTMLInputElement;
const inputProgress = document.getElementById("progress") as HTMLInputElement;
const displayedProgress = document.getElementById(
  "progressValue"
) as HTMLParagraphElement;
const inputCompleted = document.getElementById("completed") as HTMLInputElement;
const inputPhoto = document.getElementById("photo") as HTMLInputElement;

inputCompleted.addEventListener("change", () => {
  if (inputCompleted.checked) {
    inputProgress.value = "100";
    displayedProgress.innerText = "100";
  } else {
    inputProgress.value = "0";
    displayedProgress.innerText = "0";
  }
});

inputProgress.addEventListener("change", () => {
  if (inputProgress.value === "100") {
    inputCompleted.checked = true;
  } else {
    inputCompleted.checked = false;
  }
});

/* Add New Book */
formBook.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = inputTitle.value;
  const author = inputAuthor.value;
  const genre = inputGenre.value;
  const review = inputReview.value;
  const rating = +inputRating.value;
  const progress = +inputProgress.value;
  const completed = inputCompleted.checked ? 1 : 0;
  const photo = inputPhoto.value;

  console.log({
    title,
    author,
    genre,
    review,
    rating,
    progress,
    completed,
    photo,
  });

  try {
    await fetchData(API_URL, "add-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          title,
          author,
          genre,
          review,
          rating,
          progress,
          is_completed: completed,
          photo,
          highlight: 0,
        },
      ]),
    });
  } catch (error) {
    console.error(error);
  } finally {
    window.location.reload();
  }
});
