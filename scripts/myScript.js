// Create a variable to store the items in
var items;

initialize();

// Sets up the app logic, declares required variables, contains all the other functions
function initialize() {

    var addItemTxt = document.querySelector('#addItemTxt')
    var addItemBtn = document.querySelector('#addItemBtn');
    var itemlistUl = document.querySelector('#itemlistUl');

    fetch('http://localhost:3000/rest/items').then(function (response) {
        if (response.ok) {
            response.json().then(function (json) {
                items = json;
                updateDisplay();
            });
        }
    })

    function updateDisplay() {
        // Remove child nodes of ul element
        while (itemlistUl.firstChild)
            itemlistUl.removeChild(itemlistUl.lastChild);

        // Sort items based on status
        items.sort(function (a, b) {
            if (a.status == b.status)
                return 0;
            else if (a.status == 'Available')
                return -1;
            else
                return 1;
        })

        // Add an li element with a p element for each item
        for (var i = 0; i < items.length; i++) {
            var li = document.createElement('li');
            var para = document.createElement('p');
            para.innerText = items[i].name;
            li.appendChild(para);
            var button = document.createElement('button');
            button.innerText = items[i].status;
            button.id = 'item' + items[i]._id;
            button.onclick = toggleStatus;
            para.appendChild(button);
            itemlistUl.appendChild(li);
        }
        let info = document.querySelector('#info');
        info.innerText = JSON.stringify(items);
    }

    let toggleStatus = function () {
        let that = this;
        // Get the item corresponding to the clicked button
        let item = items.find(function (element) {
            return element._id == that.id.slice(4);
        });
        fetch('http://localhost:3000/rest/item/' + this.id.slice(4) + '/update',
            {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(item)
            }
        ).then(function (response) {
            response.json().then(function (json) {
                let index = items.findIndex(function (element) {
                    return element._id == that.id.slice(4);
                });
                console.log('Index: ' + index)
                items.splice(index, 1, json);
                updateDisplay();
            });
        });
    }

    let addItem = function () {
        fetch('http://localhost:3000/rest/item/create',
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    'name': addItemTxt.value
                })
            }
        ).then(function (response) {
            if (response.ok) {
                response.json().then(function (json) {
                    items = json;
                    updateDisplay();
                });
            }
        });
    }

    addItemBtn.onclick = addItem;
}