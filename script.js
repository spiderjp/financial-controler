const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactioName = document.querySelector('#text')
const inputTransactioAmount = document.querySelector('#amount')


//Usando localStorage para armazenar e persistir as transações mesmo se sair do site

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))

//Criação de um array que armazenará as informações
let transactions = localStorage.
getItem('transactions') !== null ? localStorageTransactions : []

//Remover transação clicada no DOM
const removeTransaction = ID =>{

    //Retornará apenas os IDs diferentes da transação selecionada (os que não foram excluídos)
    transactions = transactions.filter(transaction => transaction.id !== ID)

    updatelocalStorage()
    init()
}

//Função para adicionar todas as transações no DOM, com parâmetro transaction

const addTransactionIntoDOM = ({amount, name, id}) =>{

    //Verificando se o valor da transação é menor que zero (negativo) para receber -
    const operator = amount < 0 ? "-" : ""

    //Criação de classe "minus" ou "plus" para valores negativos e positivos
    const CSSClass = amount < 0 ? "minus" : "plus"
    const amountWithoutOperator = Math.abs(amount) //retorna valor negativo sem o sinal de -
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
    
        ${name}
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">X</button>
    ` 
    
//Fará com que o elemento li mais recente seja considerado o último filho do elemento transactionsUl
    transactionsUl.append(li)

}


const getExpenses = transactionsAmounts =>

    //Obtenção das despesas em um novo array com apenas alguns itens do antigo array (os -)
    Math.abs(transactionsAmounts
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
        .toFixed(2)


const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => 
    accumulator+transaction,0).toFixed(2)


//Fará a mudança do balanço total de receitas e despesas
const updateBalanceValues = () =>{

    //Recebendo todos os valores das transações dentro de um array
    const transactionsAmounts = transactions.map(transaction => transaction.amount)
    
    //Realizando a soma e subtração de todos os valores (valor total)
    const total = getTotal(transactionsAmounts)
    
    //Obtenção das receitas em um novo array com apenas alguns itens do antigo array (os +)
    const income = getIncome(transactionsAmounts)

    //Obtenção das despesas em um novo array com apenas alguns itens do antigo array (os -)
    const expense = getExpenses(transactionsAmounts)

    //Exibindo saldo total na tela

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

//Preenchimento de transações no DOM por meio de uma função que será executada em loop
const init = () =>{

    transactionsUl.innerHTML = ""

    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()

}

init()


const updatelocalStorage = () =>{

    //Salvando informações no local Storage com chave e valor
    localStorage.setItem('transactions', JSON.stringify(transactions))

}

//Um ID gerado aleatoriamente
const generateID = () => Math.round(Math.random()*1000)

const addToTransactionsArray = (transactionName, transactionAmount) =>{

    //Mandando para o final da fila a nova transação
    transactions.push({id : generateID(),
        name: transactionName, 
        amount: Number(transactionAmount)})
}


const clearInputs = () =>{

        //Limpando os campos 
        inputTransactioName.value = ""
        inputTransactioAmount.value = ""

}


const handleformSubmit =  event => {
    event.preventDefault() //Pedido para não enviar o formulário, para usar dentro do site

    const transactionName = inputTransactioName.value.trim()
    const transactionAmount = inputTransactioAmount.value.trim()

    //O nome da transação e valor precisam estar preenchidos para ser enviados
    //Caso não sejam preenchidos:
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if(isSomeInputEmpty){

        alert("Atenção: Preencha o nome e o valor da transação!")
        return //return irá parar a execução do código abaixo do if, caso o if seja executado
    }

    addToTransactionsArray(transactionName, transactionAmount)
    init()
    updatelocalStorage()
    clearInputs()
}


//Criando formulário para receber receitas e despesas
form.addEventListener('submit', handleformSubmit)