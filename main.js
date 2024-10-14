const balanceEl = document.getElementById('balance');
const transactionsUl = document.getElementById('transactions');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const initialBalanceInput = document.getElementById('initial-balance-input');
const setInitialBalanceBtn = document.getElementById('set-initial-balance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let totalBalance = parseFloat(localStorage.getItem('totalBalance')) || 0;


setInitialBalanceBtn.addEventListener('click', () => {
    totalBalance = +initialBalanceInput.value;
    updateLocalStorage();
    updateBalance();
    initialBalanceInput.value = '';
});

function addTransaction(e) {
    e.preventDefault();

    const description = descriptionInput.value;
    const amount = +amountInput.value;

    const transaction = {
        id: generateID(),
        description,
        amount
    };

    transactions.push(transaction);
    totalBalance += amount;
    updateLocalStorage();
    addTransactionDOM(transaction);
    updateBalance();

    descriptionInput.value = '';
    amountInput.value = '';
}


function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.description} <span>${sign}${Math.abs(transaction.amount)} VND</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
        <button class="edit-btn" onclick="editTransaction(${transaction.id})">Sửa</button>
    `;

    transactionsUl.appendChild(item);
}

function updateBalance() {
    balanceEl.innerText = `${totalBalance.toLocaleString()} VND`;
}

function removeTransaction(id) {
    const transactionToRemove = transactions.find(transaction => transaction.id === id);
    totalBalance -= transactionToRemove.amount;

    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

function editTransaction(id) {
    const transactionToEdit = transactions.find(transaction => transaction.id === id);

    descriptionInput.value = transactionToEdit.description;
    amountInput.value = transactionToEdit.amount;

    removeTransaction(id);
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('totalBalance', totalBalance);
}


function init() {
    transactionsUl.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateBalance();
}

init();

form.addEventListener('submit', addTransaction);
