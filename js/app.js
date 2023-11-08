// book constructor
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// query selectors
const error = document.querySelector(".error");
const bookAddForm = document.querySelector("#book-add-form");
const bookList = document.querySelector("#book-list");

// event listeners
bookAddForm.addEventListener("submit", addBook);

// books list
const booksList = localStorage?.getItem("books")
  ? JSON.parse(localStorage.getItem("books"))
  : [];

// before data show
if (booksList.length > 0) {
  booksLoop(booksList);
}

// add book function
function addBook(e) {
  e.preventDefault();

  const newForm = new FormData(e.target);
  const { title, author, isbn } = Object.fromEntries(newForm.entries());

  if (title === "" || author === "" || isbn === "") {
    error.textContent = "Please fill in all fields";
    error.classList.remove("hidden");
    setTimeout(() => error.classList.add("hidden"), 3000);
  } else {
    const book = new Book(title, author, isbn);
    // check isbn number
    const isbnCheck = booksList.find((book) => book.isbn === isbn);
    if (isbnCheck) {
      error.textContent = "This ISBN number already exists";
      error.classList.remove("hidden");
      setTimeout(() => error.classList.add("hidden"), 3000);
      return;
    }

    booksList.push(book);
    // books data show
    booksLoop(booksList);

    // save to local storage
    localStorage.setItem("books", JSON.stringify(booksList));
    e.target.reset();
  }
}

function booksLoop(books) {
  let lists = "";
  books.forEach((book) => {
    lists += `<tr class="my-3">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>
        <button
            class="py-2 px-4 rounded-md border focus:outline-none border-zinc-200 uppercase font-semibold text-xs text-white bg-red-400 hover:bg-red-500 delete"
        >
            Delete
        </button>
        </td>
    </tr>`;
  });
  bookList.innerHTML = lists;
}

// delete book
bookList.addEventListener("click", (e) => {
  e.target.parentElement.parentElement.remove();
  console.log(booksList);
  const newList = booksList.filter((book) => {
    return (
      book.isbn !== e.target.parentElement.previousElementSibling.textContent
    );
  });
  localStorage.setItem("books", JSON.stringify(newList));
});
