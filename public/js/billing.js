const socket = io()

let search = $('#search')[0]
let listParent = $('#dataList')[0]

let lists = {}
let billLists = []

socket.on('datalist', (data) => {
    console.log(data.data)
    lists = data.data
    lists.forEach(item => {
        let htmlString = `<tr>
        <td>${item['Product Code']}</td>
        <td>${item['Product Name']}</td>
        <td>${item['Product Price']}</td>
        <td>${item['Product GST']}%</td>
        <td id="${item['Product Code']}"><a class="btn waves-effect waves-light green accent-4">Add</td>
        </tr>`
        document.querySelector('#dataList').insertAdjacentHTML('afterbegin', htmlString)
    })
})

function searchList(event) {
    if(event.keyCode == 8) return
    clearFields()
    let newList = lists.filter(item => (item['Product Code'].includes(search.value)) || item['Product Name'].includes(search.value))
    newList.forEach(item => {
        let htmlString = `<tr>
        <td>${item['Product Code']}</td>
        <td>${item['Product Name']}</td>
        <td>${item['Product Price']}</td>
        <td>${item['Product GST']}%</td>
        <td id="${item['Product Code']}"><a class="btn waves-effect waves-light green accent-4">Add</td>
        </tr>`
        document.querySelector('#dataList').insertAdjacentHTML('afterbegin', htmlString)
    })
}


function clearFields() {
    listParent.innerHTML = ""
}

listParent.addEventListener('click', (event) => {
    let element = event.target.parentNode
    let elementFound
    if(element.localName == 'td') {
        elementFound = lists.filter(item => item['Product Code'] == element.id)[0]
        let parList = billLists.filter(item => item['Product Code'] == elementFound['Product Code'])
        if(parList.length == 0) {
            billLists.push(elementFound)
            updateBillUI(element.id, elementFound)
            updateTotals()
        }
    }
})

let values
function updateBillUI(id, item) {
    values = {
        price: item['Product Price'],
        gst: item['Product GST']
        
    }
    let htmlString = `<tr>
    <td>${item['Product Code']}</td>
    <td>${item['Product Name']}</td>
    <td>${item['Product Price']}</td>
    <td>${item['Product GST']}%</td>
    <td>
        <input type="text" value="1">
    </td>
    <td>${values.price + (values.price * values.gst / 100)}</td>
    </tr>`
    document.querySelector('#billList').insertAdjacentHTML('afterbegin', htmlString)    
}

document.querySelector('#billList').addEventListener('keyup', event => {
    if(event.keyCode == 8) return
    if(event.target.parentNode.localName == 'td') {
        updatePrice(event.target.parentNode.parentNode)
        updateTotals()
    }
})

let val
function updatePrice(field) {
    val = getVal(field)
    var percent = val.price * val.gst / 100
    var tot = (parseInt(val.price) + percent) * val.quantity
    field.lastElementChild.innerHTML = tot
}


function getVal(field) {
    return {
        price: field.children[2].textContent,
        gst: field.children[3].textContent.split('%')[0],
        quantity: field.children[4].children[0].value
    }
}

let sum, count
function updateTotals() {
    // .forEach(item => {
    //     console.log(item.lastElementChild.textContent)
    // })
    let array = Array.from(document.querySelector('#billList').children)
    sum = 0
    count = 0
    array.forEach(item => {
        // console.log(item.lastElementChild.textContent)
        sum += parseInt(item.lastElementChild.textContent)
        
        count += parseInt(item.children[4].children[0].value)
    })
    document.querySelector('#total span').textContent = sum
    document.querySelector('#quantities span').textContent = count
}