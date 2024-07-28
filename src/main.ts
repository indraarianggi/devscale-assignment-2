import {
  addNewBook,
  API_URL,
  deleteBook,
  fetchData,
  updateBook,
} from "./libs/fetch";
import { IBook } from "./types/entity";

interface IBookResult {
  data: IBook[];
}

interface GetBookParams {
  highlight: boolean;
}

let selectedBook: IBook | null = null;
let numOfHighlightedBooks: number = 0;

/* Get Elements */
const highlightSection = document.getElementById("highlight-books");
const bookListSection = document.getElementById("book-list");
const btnAddBook = document.getElementById("btn-add") as HTMLButtonElement;

const bookModal = document.getElementById("book-modal") as HTMLDivElement;
const modalTitle = document.getElementById("modal-title") as HTMLHeadingElement;
const btnCloseModal = document.getElementById(
  "btn-close-modal"
) as HTMLButtonElement;

const formBook = document.getElementById("book-form") as HTMLFormElement;
const inputBookId = document.getElementById("book-id") as HTMLInputElement;
const inputTitle = document.getElementById("title") as HTMLInputElement;
const inputAuthor = document.getElementById("author") as HTMLInputElement;
const inputGenre = document.getElementById("genre") as HTMLSelectElement;
const inputReview = document.getElementById("review") as HTMLInputElement;
const inputRating = document.getElementById("rating") as HTMLInputElement;
const inputProgress = document.getElementById("progress") as HTMLInputElement;
const displayedProgress = document.getElementById(
  "progress-value"
) as HTMLParagraphElement;
const inputCompleted = document.getElementById("completed") as HTMLInputElement;
const inputPhoto = document.getElementById("photo") as HTMLInputElement;
const inputHighlight = document.getElementById("highlight") as HTMLInputElement;

const btnEdit = document.getElementById("btn-edit") as HTMLButtonElement;
const btnDelete = document.getElementById("btn-delete") as HTMLButtonElement;
const submitActions = document.getElementById(
  "submit-actions"
) as HTMLSpanElement;
const previewActions = document.getElementById(
  "preview-actions"
) as HTMLSpanElement;

/* Event Listener */
btnAddBook.addEventListener("click", handleOpenModal);
btnCloseModal.addEventListener("click", handleCloseModal);

inputRating.addEventListener("input", () => {
  inputRating.style.setProperty(
    "--value",
    inputRating.valueAsNumber.toString()
  );
});

inputCompleted.addEventListener("change", () => {
  if (inputCompleted.checked) {
    inputProgress.value = "100";
    displayedProgress.innerText = "100%";
  } else {
    inputProgress.value = "0";
    displayedProgress.innerText = "0%";
  }
});

inputProgress.addEventListener("change", () => {
  displayedProgress.innerText = `${inputProgress.value}%`;

  if (inputProgress.value === "100") {
    inputCompleted.checked = true;
  } else {
    inputCompleted.checked = false;
  }
});

btnEdit.addEventListener("click", handleClickEdit);
btnDelete.addEventListener("click", handleClickDelete);

/* Submit Form Event (Add New & Update) */
formBook?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const bookId = inputBookId.value;
  const title = inputTitle.value;
  const author = inputAuthor.value;
  const genre = inputGenre.value;
  const review = inputReview.value;
  const rating = +inputRating.value;
  const progress = +inputProgress.value;
  const completed = inputCompleted.checked ? 1 : 0;
  const photo = inputPhoto.value;
  const highlight = inputHighlight.checked ? 1 : 0;

  if (highlight && numOfHighlightedBooks === 3) {
    window.alert("The number of highlighted books has reached the maximum!");
    return;
  }

  try {
    if (bookId) {
      // update book
      await updateBook({
        _id: bookId,
        title,
        author,
        genre,
        review,
        rating,
        progress,
        is_completed: completed,
        photo,
        highlight,
      });
    } else {
      // add new book
      await addNewBook({
        title,
        author,
        genre,
        review,
        rating,
        progress,
        is_completed: completed,
        photo,
        highlight,
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    window.location.reload();
  }
});

/* Functions */
function renderBookItem(book: IBook) {
  const bookItem = document.createElement("article");
  bookItem.classList.add("book-items");

  /* Book Cover Image */
  const bookWrapper = document.createElement("div");
  bookWrapper.classList.add("main-book-wrap");

  const bookCover = document.createElement("div");
  bookCover.classList.add("book-cover");

  const bookInside = document.createElement("div");
  bookInside.classList.add("book-inside");

  const bookImageWrapper = document.createElement("div");
  bookImageWrapper.classList.add("book-image");

  const bookImage = document.createElement("img");
  bookImage.setAttribute(
    "src",
    book.photo || "https://fakeimg.pl/400x600?text=Book&font=bebas"
  );
  bookImage.setAttribute("alt", book.title);

  const bookEffect = document.createElement("div");
  bookEffect.classList.add("effect");

  const bookLight = document.createElement("div");
  bookLight.classList.add("light");

  bookImageWrapper.append(bookImage, bookEffect, bookLight);
  bookCover.append(bookInside, bookImageWrapper);
  bookWrapper.append(bookCover);

  /* Book Info */
  const bookInfoWrapper = document.createElement("div");
  bookInfoWrapper.classList.add("book-info");

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = book.author;

  const bookRating = document.createElement("input");
  bookRating.setAttribute("type", "range");
  bookRating.setAttribute("value", book.rating.toString());
  bookRating.style.setProperty("--value", book.rating.toString());
  bookRating.setAttribute("disabled", "true");
  bookRating.setAttribute("class", "rating");

  bookInfoWrapper.append(bookTitle, bookAuthor, bookRating);

  /* Append all section into Book Item */
  bookItem.append(bookWrapper, bookInfoWrapper);

  const clickHandler = function () {
    selectedBook = book;
    return openPreviewModal();
  };

  bookItem.addEventListener("click", clickHandler);

  return bookItem;
}

function openPreviewModal() {
  disableForm(true);
  modalTitle.innerText = "Preview Book";
  previewActions.classList.remove("hidden");
  submitActions.classList.add("hidden");

  inputBookId.value = selectedBook!._id;
  inputTitle.value = selectedBook!.title;
  inputAuthor.value = selectedBook!.author;
  inputGenre.value = selectedBook!.genre;
  inputReview.value = selectedBook!.review;
  inputRating.value = selectedBook!.rating.toString();
  inputRating.style.setProperty("--value", selectedBook!.rating.toString());
  inputProgress.value = selectedBook!.progress.toString();
  displayedProgress.innerText = `${selectedBook!.progress}%`;
  inputCompleted.checked = Boolean(selectedBook!.is_completed);
  inputPhoto.value = selectedBook!.photo;
  inputHighlight.checked = Boolean(selectedBook!.highlight);

  handleOpenModal();
}

function handleOpenModal() {
  bookModal.classList.remove("hidden");
}

function handleCloseModal() {
  selectedBook = null;

  disableForm(false);
  modalTitle.innerText = "Add Book";
  previewActions.classList.add("hidden");
  submitActions.classList.remove("hidden");

  inputBookId.value = "";
  inputTitle.value = "";
  inputAuthor.value = "";
  inputGenre.value = "";
  inputReview.value = "";
  inputRating.value = "0";
  inputRating.style.setProperty("--value", "0");
  inputProgress.value = "0";
  displayedProgress.innerText = `0%`;
  inputCompleted.checked = false;
  inputPhoto.value = "";
  inputHighlight.checked = false;

  bookModal.classList.add("hidden");
}

async function handleClickEdit() {
  disableForm(false);
  modalTitle.innerText = "Edit Book";
  previewActions.classList.add("hidden");
  submitActions.classList.remove("hidden");
  formBook?.classList.remove("disable");
}

async function handleClickDelete() {
  const isDelete = window.confirm(
    `Are you sure you want to delete book ${selectedBook?.title} by ${selectedBook?.author}?`
  );

  try {
    if (isDelete) {
      await deleteBook(selectedBook?._id ?? "");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}

function disableForm(isDisabled: boolean) {
  inputTitle.disabled = isDisabled;
  inputAuthor.disabled = isDisabled;
  inputGenre.disabled = isDisabled;
  inputReview.disabled = isDisabled;
  inputRating.disabled = isDisabled;
  inputProgress.disabled = isDisabled;
  inputCompleted.disabled = isDisabled;
  inputPhoto.disabled = isDisabled;
  inputHighlight.disabled = isDisabled;
}

async function getBooks(filter?: GetBookParams) {
  try {
    const result = await fetchData<IBookResult>(
      `${API_URL}?filterKey=highlight&filterValue=${filter?.highlight ? 1 : 0}`,
      filter?.highlight ? "all--highlighted-books" : "all-books"
    );

    if (!result) {
      console.error("Aplikasi error!");
      return;
    }

    const { data: books } = result;

    const containerSectionElement = filter?.highlight
      ? highlightSection
      : bookListSection;

    books.forEach((book) => {
      const bookItemElement = renderBookItem(book);
      containerSectionElement?.appendChild(bookItemElement);
    });

    if (filter?.highlight) {
      numOfHighlightedBooks = books.length;
    }

    if (filter?.highlight && !books.length) {
      highlightSection?.classList.add("empty");
    }

    if (!filter?.highlight && !books.length) {
      const emptyElement = document.createElement("p");
      emptyElement.classList.add("empty");
      emptyElement.innerText = "No books added yet.";
      bookListSection?.appendChild(emptyElement);
    }
  } catch (error) {
    console.log(error);
  }
}

getBooks();
getBooks({ highlight: true });
