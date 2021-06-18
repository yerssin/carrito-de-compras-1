const clickButton = document.querySelectorAll(".button");
//para acceder a todos los botones
const tbody = document.querySelector(".tbody");

let carrito = []; //lo que se va a imprimir o renderizar

clickButton.forEach((btn) => {
  //recorrer todos los botones
  btn.addEventListener("click", addToCarritoItem);
  // que cuando capturemos un evento (click), ejecuta algo una funcion addToCarritoItem
});

function addToCarritoItem(e) {
  const button = e.target; // visualizando un boton al cual le hice click sin item
  const item = button.closest(".card"); // obtener el item o card 1, 2 o 3 correspondiente con el boton. con el atributo obten el contenedor mas cercano a .card
  const itemTitle = item.querySelector(".card-title").textContent; // obtener el contenido y no el componente del card-title con el textContent
  const itemPrice = item.querySelector(".precio").textContent;
  const itemImg = item.querySelector(".card-img-top").src;

  const newItem = {
    //crear un objeto
    title: itemTitle,
    precio: itemPrice,
    img: itemImg,
    cantidad: 1, // icialmente cuando se pasa un dato comienza en 1
  };
  /* pasar newCarrito a una funcion */
  addItemCarrito(newItem);
}

function addItemCarrito(newItem) {
  /* crear un evento para mostrar la cantidad agregada en el boton */
  const InputElemento = tbody.getElementsByClassName("input__elemento"); // quiero obtenter el elemento que esta en el tbody
  //se solo se agrege uno y aumente la cantidad
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === newItem.title.trim()) {
      carrito[i].cantidad++; // si se cumple esta condicion, agragar mas
      const inputValue = InputElemento[i]; // CANTIDAD funcionando
      inputValue.value++; // cada vez que pase, que sume
      CarritoTotal(); // esto se va a ejecutar para hacer la sumatoria de lo que esta cambiando arriba y cuando se renderice el producto tambien
      return null; // para que solo renderice una img y no varias del mismo img. no se renderiza renderCarrito() ni carrito.push(newItem)
    }
  }

  carrito.push(newItem); //voy a sumar o agregar newItem en carrito que es lo que se va a mostrar
  renderCarrito(); // creo una funcion y luego la ejecuto
}
//al hacer clic estoy guardando los datos de ese producto en la variable carrito
function renderCarrito() {
  //aca quiero renderizar o imprimir lo que esta en la variable carrito
  tbody.innerHTML = ""; // cada vez que se ejecure esta accion este vacio
  carrito.map((item) => {
    const tr = document.createElement("tr");
    tr.classList.add("ItemCarrito");
    const Content = `
      <th scope="row">1</th>
              <td class="table__productos">
                <img src=${item.img} alt="" />
                <h6 class="title">${item.title}</h6>
              </td>
              <td class="table__price"><p>${item.precio}</p></td>
              <td class="table__cantidad">
                <input type="number" min="1" value=${item.cantidad} class="input__elemento"/>
                <button class="delete btn btn-danger">x</button>
              </td> 
              `;

    tr.innerHTML = Content;
    tbody.append(tr); // al tbody que esta vacio agrego lo que tenga el tr

    /*-------------- crear boton para eliminar un o varios productos------------------------- */
    tr.querySelector(".delete").addEventListener("click", removeItemCarrito); //removeItemCarrito remover
    /*-------------- crear boton para aumentar o restar la cantidad del producto------------------------- */
    tr.querySelector(".input__elemento").addEventListener(
      "change",
      sumaCantidad
    );
  });
  CarritoTotal(); // despues que se renderice el producto, que haga la sumatoria
}

/*---------------- sumar todos lo valores del precio y colocarlo en total------------------------------------------- */
function CarritoTotal() {
  let Total = 0;
  const itemCartTotal = document.querySelector(".itemCartTotal");
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("$", "")); // se quiere pasar un string a numero. repplace
    Total = Total + precio * item.cantidad;
    /* El valor Total va a cambiar cada vez que se ejecute este for */
  });
  itemCartTotal.innerHTML = `Total $${Total}`;
  //addLocalStorage();  voy a ejecutarlo aca porque porque quiero guadar lo que tenga el carrito en el localStorage carrito
}
/*-------------- aumentar o restar la cantidad del producto y del total del precio------------------------- */
function removeItemCarrito(e) {
  const buttonDelete = e.target;
  const tr = buttonDelete.closest(".ItemCarrito"); // eliminar con el valor del total
  const title = tr.querySelector(".title").textContent;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === title.trim()) {
      carrito.splice(i, 1); // aca eliminamos el elemento donde estemos parado y sera uno solo elimidao
    }
  }
  tr.remove(); // eliminar sin tocar el valor del total
  CarritoTotal(); // luego que se ejecute tr. remove entoces realizar de nuevo la sumatoria
}
/*-------------- funcion para sumar o restar la cantidad del producto------------------------- */
function sumaCantidad(e) {
  const sumaInput = e.target; // aca tengo el componente input
  const tr = sumaInput.closest(".ItemCarrito"); // use la clase padre
  const title = tr.querySelector(".title").textContent; //usar el identificador que es title y uso el textContent para acceder a su contenido
  carrito.forEach((item) => {
    if (item.title.trim() === title) {
      sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value; //en caso que el cliente coloque menos 1 que la suma sea igual a 1
      item.cantidad = sumaInput.value; // aca cambio el valor de la matriz item
      CarritoTotal();
    }
  });
}
