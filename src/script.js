const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#valor");
const type = document.querySelector("#type");
const quantidade = document.querySelector("#qtd");
const btnSalvarLanc = document.querySelector("#salvarPorte");
const aporte = document.querySelector(".aporte");
const saida = document.querySelector(".saida");
const averagePrice = document.querySelector(".price");
const total = document.querySelector(".total");
const btc = document.querySelector("bitcoin");
const eth = document.querySelector("ethereum");
const btnAporte = document.querySelector('#btn_form');
const btnClose = document.querySelector('#btnClose');
const formAporte = document.querySelector('dialog');


btnClose.onclick = function () {
  formAporte.close()
};

// const liveprice = {
//   "async": true,
//   "scroosDomain": true,
//   "url": "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum&vs_currencies=usd&precision=2",
//   "method": "GET",
//   "headers": {}
// }

// $.ajax(liveprice).done(function (response) {
//   btc.innerHTML = response.bitcoin.usd;
//   eth.innerHTML = response.ethereum.usd;
// });


let allWallet = {};

btnSalvarLanc.onclick = () => {
  if (descItem.value === "" || amount.value === "" || type.value === "" || quantidade.value === "") {
    return alert("Preencha todos os campos!");
  }

  allWallet.push({
    desc: descItem.value,
    amount: Math.abs(amount.value).toFixed(2),
    type: type.value,
    qtd: quantidade.value,
  });

  setItensBD();
  loadItens();
  formAporte.close();


  descItem.value = "";
  amount.value = 0;
  quantidade.value = 0;

};

btnAporte.onclick = function () {
  formAporte.showModal();
};

//função para deletar
function deleteItem(index) {
  allWallet.splice(index, 1);
  setItensBD();
  loadItens();
}

//função para inserir lançamento
function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td><a href="/src/coins.html">${item.desc}</a></td>
    <td>$ ${item.amount}</td>
    <td>${item.qtd}</td>
    <td class="columnType">${item.type === "Entrada"
      ? '<i class="bx bxs-chevron-up-circle"></i>'
      : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}
//função para ler do local storage
function loadItens() {
  allWallet = getItensBD();
  tbody.innerHTML = "";
  allWallet.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}
//função para retornar valores na tela
function getTotals() {

  // entra valor
  const amountIncomes = allWallet
    .filter((item) => item.type === "Entrada")
    .map((transaction) => Number(transaction.amount));

  //saida Valor  
  const amountExpenses = allWallet
    .filter((item) => item.type === "Saída")
    .map((transaction) => Number(transaction.amount));

  // total aporte
  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  // total - saida  
  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  // calcula o entrada - saida
  const totalCoin = (totalIncomes - totalExpenses).toFixed(2);
  // total de entrada + saida 
  const numerString1 = totalCoin;
  // calcula o totalCoin / pela quantidade de lançamento
  const precoMedio = parseInt(numerString1 / allWallet.length)

  //apresenta na tela
  aporte.innerHTML = totalIncomes;
  saida.innerHTML = totalExpenses;
  // averagePrice.innerHTML = precoMedio;
  total.innerHTML = totalCoin;
  quantidade.innerHTML = quantidade;

}

const getItensBD = () => JSON.parse(localStorage.getItem("db_allWallet")) ?? [];
const setItensBD = () =>
  localStorage.setItem("db_allWallet", JSON.stringify(allWallet));

loadItens();