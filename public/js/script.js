const socket = io()

document.querySelector('#addList').addEventListener('click', addToDB)
const listInput = {
    code: $('#product_code')[0],
    name: $('#product_name')[0],
    price: $('#product_price')[0],
    gst: $('#product_gst')[0]
}
const listParent = $('#dataList')[0]

function addToDB() {
    if (listInput.code.value == '' || listInput.name.value == '' || listInput.gst.value == '' || listInput.price.value == '') {
        Materialize.toast('Must fill all columns', 3000)
    } else {
        socket.emit('addList', {
            code: listInput.code.value, 
            name: listInput.name.value, 
            price: listInput.price.value, 
            gst: listInput.gst.value
        })
        clearList()
        Materialize.toast('Added Successfully', 3000)
    }
}

function clearList() {
    listInput.code.value = ""
    listInput.name.value = ""
    listInput.price.value = ""
    listInput.gst.value = ""
}

// Showing list
let lists = {};

socket.on('datalist', data => {
    lists = data.data
    console.log(lists)
    updateList(lists)
})

function updateList(lists) {
    clearFields()
    lists.forEach(item => {
        let htmlString = `<tr>
        <td>${item['Product Code']}</td>
        <td>${item['Product Name']}</td>
        <td>${item['Product Price']}</td>
        <td>${item['Product GST']}%</td>
        </tr>`
        listParent.insertAdjacentHTML('afterbegin', htmlString)
    })
    // document.querySelector('#dataList').insertAdjacentHTML('afterstart', )
    
}

function clearFields() {
    listParent.innerHTML = ""
}



