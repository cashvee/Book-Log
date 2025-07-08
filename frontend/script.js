const form = document.getElementById("book-form");
const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search");

const API_URL = "https://book-log-oxwy.onrender.com/books";

async function fetchBooks(searchTerm = "") {
  const res = await fetch(API_URL);
  const books = await res.json();

  const filteredBooks = books.filter(book => {
    const combined = `${book.title} ${book.author} ${book.status}`.toLowerCase();
    return combined.includes(searchTerm.toLowerCase());
  });

  bookList.innerHTML = "";
  filteredBooks.forEach(book => {
    const div = document.createElement("div");
    div.className = "book";
    div.innerHTML = `
      <h2>${book.title} by ${book.author}</h2>
      <p><strong>Status:</strong> ${book.status}</p>
      <p><strong>Review:</strong> ${book.review}</p>
      <button onclick="deleteBook('${book._id}')">Delete</button>
      <button onclick="toggleStatus('${book._id}', '${book.status}')">Toggle Status</button>
    `;
    bookList.appendChild(div);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const book = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    status: document.getElementById("status").value,
    review: document.getElementById("review").value,
  };
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  form.reset();
  fetchBooks(searchInput.value); // preserve search filter
});

async function deleteBook(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchBooks(searchInput.value); // preserve search filter
}

async function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === "Reading" ? "Finished" : "Reading";
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  fetchBooks(searchInput.value); // preserve search filter
}

searchInput.addEventListener("input", (e) => {
  fetchBooks(e.target.value);
});

fetchBooks();
