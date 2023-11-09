// book constructor
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static showAlert(message, type) {
    const error = document.querySelector(".error");
    error.classList.remove("hidden");
    if (type === "success") {
      error.classList.add("bg-green-500");
      error.classList.remove("bg-red-500");
      error.textContent = message;
    } else {
      error.classList.add("bg-red-500");
      error.classList.remove("bg-green-500");
      error.textContent = message;
    }
    setTimeout(() => error.classList.add("hidden"), 3000);
  }
  static isbnCheck(isbn) {
    const result = Store.getBooks().find((book) => book.isbn === isbn);
    if (result) {
      return this.showAlert("This ISBN number already exists", "error");
    }
  }
  static addBookToList(book) {
    const bookList = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
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
    `;
    bookList.appendChild(row);
  }
}

class Store {
  static getBooks() {
    let books = localStorage.getItem("books")
      ? JSON.parse(localStorage?.getItem("books"))
      : [];
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => {
      UI.addBookToList(book);
    });
  }
}

// query selectors
const bookAddForm = document.querySelector("#book-add-form");
const bookList = document.querySelector("#book-list");
document.addEventListener("DOMContentLoaded", Store.displayBooks);

// event listeners
bookAddForm.addEventListener("submit", addBook);

// add book function
function addBook(e) {
  // form prevent default
  e.preventDefault();
  const newForm = new FormData(e.target);

  const { title, author, isbn } = Object.fromEntries(newForm.entries());

  // check empty value
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "error");
  } else {
    const book = new Book(title, author, isbn);
    // check isbn number
    UI.isbnCheck(isbn);
    // add book to list
    UI.addBookToList(book);
    // add book to local storage
    Store.addBook(book);

    // success message
    UI.showAlert("Book Added", "success");

    // form reset
    e.target.reset();
  }
}

// delete book
bookList.addEventListener("click", (e) => {
  e.target.parentElement.parentElement.remove();
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});
