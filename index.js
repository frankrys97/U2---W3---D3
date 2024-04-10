const fetchLibrary = () => {
  fetch("https://striveschool-api.herokuapp.com/books")
    .then((response) => {
      console.log(response);

      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((bookData) => {
      const row = document.getElementById("bookList");
      row.classList.add(
        "row",
        "row-cols-sm-2",
        "row-cols-md-3",
        "row-cols-lg-4",
        "g-4"
      );

      bookData.forEach((book) => {
        const col = document.createElement("div");
        col.classList.add("col");
        const card = document.createElement("div");
        card.classList.add("card", "h-100");
        card.innerHTML = `
      <img src="${book.img}" class="card-img-top img-fluid" alt="book img">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${book.title} <span> €${book.price}</span></h5>
        <p class="card-text">Category: ${book.category}</p>
        <div class="mt-auto">
        <button class="btn btn-danger">Scarta</button >
        <button class="btn btn-success">Compra ora</button >
        </div>

      </div>
      `;
        col.appendChild(card);
        row.appendChild(col);

        const btnDelete = card.querySelector(".btn-danger");

        btnDelete.addEventListener("click", (event) => {
          const cardToRemove = event.target.closest(".col");
          if (cardToRemove) {
            cardToRemove.remove();
          }
        });

        const btnBuy = card.querySelector(".btn-success");

        btnBuy.addEventListener("click", () => {
          addToCart(book);
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// Inizializzo un array vuoto
let cart = [];

// Creo una funzione saveCart che mi permette di creare un elemento di tipo lista
// alla mia pagina a partire da quelli presenti nell'array cart
const saveCart = () => {
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = "";

  cart.forEach((book) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "bg-body-secondary", "my-2");
    li.innerHTML = `${book.title} - <span class="badge bg-secondary rounded-pill">€ ${book.price}</span>
          <button class="btn btn-danger btnToRemoveCart ms-2 p-1">Rimuovi</button>`;
    cartList.appendChild(li);

    // Prendo il nodo del bottone rimuovi vicino agli elementi nel carrello
    const removeCartButton = li.querySelector(".btnToRemoveCart");

    // Creo un evento click sul bottone che mi permette di rimuoverlo dall'array tramite la
    // funzione removeFromCart e ricarico il carrello con la funzione saveCart
    removeCartButton.addEventListener("click", () => {
      removeFromCart(book);
      saveCart();
      upBadge();
    });
  });

  // Il risultato dell'array lo setto nella memoria locale
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Funzione che mi permette di aggiungere il libro al mio array, verrà poi implementato nelle
// card al click del bottone compra ora
const addToCart = (book) => {
  cart.push(book);
  upBadge();

  // Chiamo la funzione saveCart per ricaricare il carrello
  saveCart();
};

// Funzione che mi permette di rimuovere un libro dall'array attraverso il metodo filter
// ovvero restituendomi un array con i libri rimasti diversi da quelli rimossi
const removeFromCart = (bookToRemove) => {
  cart = cart.filter((book) => book !== bookToRemove);
  //   Chiamo la funzione saveCart per ricaricare il carrello
  saveCart();
  upBadge();
};

// Funzione che mi permette di prendere il dato settato nella memoria locale
// e lo riporta nell'array cart in modo da poterlo leggere
const cartLoad = () => {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);

    // Chiamo la funzione saveCart per ricaricare il carrello
    saveCart();
  }
};

window.addEventListener("DOMContentLoaded", () => {
  // Chiamo la funzione fetchLibrary per caricare la libreria
  fetchLibrary();
  // Chiamo la funzione cartLoad per caricare il carrello a partire dai dati
  // presenti nell'array
  cartLoad();
  upBadge();
});

const upBadge = () => {
  const badge = document.querySelector("#iconCart .badge");
  const cartNum = cart.length;

  if (cartNum > 0) {
    badge.textContent = cartNum;
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }
};
