let menu = JSON.parse(localStorage.getItem("menu")) || [];
let cart = [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let editIndex=null;

const menuDiv=document.getElementById("menu");
const cartDiv=document.getElementById("cart");
const totalEl=document.getElementById("total");

const nameInput=document.getElementById("name");
const priceInput=document.getElementById("price");
const imageInput=document.getElementById("image");
const categoryInput=document.getElementById("category");


function show(page){
  document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));

  if(page==="menu") document.getElementById("menuSection").classList.add("active");
  if(page==="cart") document.getElementById("cartSection").classList.add("active");
  if(page==="admin") document.getElementById("adminSection").classList.add("active");
  if(page==="orders") document.getElementById("ordersSection").classList.add("active");

  renderMenu(menu);
  renderOrders();
}


function renderMenu(list){
  menuDiv.innerHTML="";
  list.forEach((item,i)=>{
    menuDiv.innerHTML+=`
    <div class="card">
      <img src="${item.image}">
      <h3>${item.name}</h3>
      <p>${item.price} TZS</p>
      <small>${item.category}</small><br>

      <button class="add" onclick="add(${i})">Add</button>
      <button class="edit" onclick="edit(${i})">Edit</button>
      <button class="del" onclick="del(${i})">Delete</button>
    </div>`;
  });
}


function saveFood(){
  let food={
    name:nameInput.value,
    price:Number(priceInput.value),
    image:imageInput.value,
    category:categoryInput.value
  };

  if(!food.name||!food.price||!food.image){
    alert("Fill all fields");
    return;
  }

  if(editIndex===null){
    menu.push(food);
  }else{
    menu[editIndex]=food;
    editIndex=null;
  }

  localStorage.setItem("menu",JSON.stringify(menu));
  renderMenu(menu);
}


function edit(i){
  editIndex=i;
  nameInput.value=menu[i].name;
  priceInput.value=menu[i].price;
  imageInput.value=menu[i].image;
  categoryInput.value=menu[i].category;
  show("admin");
}


function del(i){
  menu.splice(i,1);
  localStorage.setItem("menu",JSON.stringify(menu));
  renderMenu(menu);
}


function add(i){
  cart.push(menu[i]);
  updateCart();
}

function updateCart(){
  cartDiv.innerHTML="";
  let total=0;

  cart.forEach((item,i)=>{
    cartDiv.innerHTML+=`
    <p>${item.name} - ${item.price}
    <button onclick="remove(${i})">X</button></p>`;
    total+=item.price;
  });

  totalEl.innerText=total;
}

function remove(i){
  cart.splice(i,1);
  updateCart();
}


function checkout(){
  if(cart.length===0){alert("Cart empty");return;}

  orders.push({
    id:Date.now(),
    items:cart,
    total:cart.reduce((a,b)=>a+b.price,0),
    status:"Pending"
  });

  localStorage.setItem("orders",JSON.stringify(orders));

  cart=[];
  updateCart();
  renderOrders();
}


function renderOrders(){
  const div=document.getElementById("orders");
  div.innerHTML="";

  orders.forEach(o=>{
    div.innerHTML+=`
    <div class="order">
      <h4>Order #${o.id}</h4>
      <p>Total: ${o.total} TZS</p>
      <p>Status: ${o.status}</p>
    </div>`;
  });
}


renderMenu(menu);
renderOrders();