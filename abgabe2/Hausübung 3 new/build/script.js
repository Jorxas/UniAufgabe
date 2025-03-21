"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('submit-button');
    button.addEventListener('click', (event) => {
        event.preventDefault();
    });
    button.addEventListener('click', () => {
        const seiteNameElement = document.getElementById('site-name');
        const apiUrlElement = document.getElementById('api-endpoint');
        const seiteName = seiteNameElement.value;
        const apiUrl = apiUrlElement.value;
        document.getElementById('navbar_title').textContent = seiteName;
        console.log(seiteName);
        console.log(apiUrl);
        const navigationElement = document.querySelectorAll('#navbar_links a');
        fetch(apiUrl)
            .then((response) => {
            return response.json();
        })
            .then((datas) => createNavigation(datas));
        function createNavigation(data) {
            const links = [
                { key: 'products_link', anchor: '#products' },
                { key: 'vendors_link', anchor: '#vendor' },
                { key: 'orders_link', anchor: '#order' },
                { key: 'customer_link', anchor: '#customer' }
            ];

            links.forEach(function(link, index) {
                const element = navigationElement.item(index);
                const linkText = data.links[link.key].split("/")[3];

                // Update text and href for the current navigation item
                element.textContent = linkText;
                element.href = link.anchor;
            });
        }
        //Anzeigen von Producten
        const Products = apiUrl + "/products";
        fetch(Products) // Promise wird zurückgeben
            .then(response => {
            if (!response.ok) { // Prüfung des Status
                throw new Error(`Response status: ${response.status}`);
            }
            return response.json(); // Liest den Body des Request aus und gibt Promise zurück
        })
            .then(responseJson => {
            return responseJson.products; // Gibt Teil des Response als Teil eines Promise zurück
        })
            .then(data => {
            console.log(data); // JSON-Daten hier verarbeiten
            createTableProducts(data);
        })
            .catch(error => {
            console.error(error.message); // Fehlerbehandlung
        });
        //Beispiele Daten löschen
        const table = document.getElementById('template_table');
        table.innerHTML = '';
        function createTableProducts(products) {
            const table = document.createElement('table'); //  <table>
            table.id = "template_table"; // ID von table
            table.className = "table table-striped"; // CSS-Klasse
            const caption = document.createElement('caption');
            caption.className = "text-start";
            caption.id = "products";
            caption.textContent = "Übersicht Products";
            table.appendChild(caption);
            // Créer l'en-tête <thead>
            const thead = document.createElement('thead');
            thead.className = "border-bottom mb-2";
            const headerRow = document.createElement('tr');
            ["ID", "name", "Actions"].forEach((headerText) => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
            // <tbody> Erstellung
            const tbody = document.createElement('tbody');
            products.forEach((product) => {
                const row = document.createElement('tr');
                // Spalte ID
                const idCell = document.createElement('th');
                idCell.scope = "row";
                const idSpan = document.createElement('span');
                idSpan.textContent = product.id.toString();
                idCell.appendChild(idSpan);
                row.appendChild(idCell);
                const nameCell = document.createElement('td');
                const nameSpan = document.createElement('span');
                nameSpan.textContent = product.name;
                nameCell.appendChild(nameSpan);
                row.appendChild(nameCell);
                const actionCell = document.createElement('td');
                const detailButton = document.createElement('button');
                detailButton.className = "btn btn-warning";
                detailButton.textContent = "Details";
                detailButton.addEventListener('click', () => {
                    console.log(product);
                    displayProducts(product.id);
                });
                actionCell.appendChild(detailButton);
                row.appendChild(actionCell);
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            const container = document.getElementById('table-container') || document.body;
            container.appendChild(table);
        }
        //Anzeigen von vendors
        const vendors = apiUrl + "/vendors";
        fetch(vendors) // Promise wird zurückgeben
            .then(response => {
            if (!response.ok) { // Prüfung des Status
                throw new Error(`Response status: ${response.status}`);
            }
            return response.json(); // Liest den Body des Request aus und gibt Promise zurück
        })
            .then(responseJson => {
            return responseJson.vendors; // Gibt Teil des Response als Teil eines Promise zurück
        })
            .then(data => {
            console.log(data); // JSON-Daten hier verarbeiten
            createTableVendors(data);
        })
            .catch(error => {
            console.error(error.message); // Fehlerbehandlung
        });
        function createTableVendors(vendors) {
            const table = document.createElement('table'); // erstellen <table>
            table.id = "template_table"; // ID
            table.className = "table table-striped"; // CSS- Klasse
            const caption = document.createElement('caption');
            caption.className = "text-start";
            caption.id = "vendor";
            caption.textContent = "Übersicht Vendor";
            table.appendChild(caption);
            // <thead> erstellen
            const thead = document.createElement('thead');
            thead.className = "border-bottom mb-2";
            const headerRow = document.createElement('tr');
            ["ID", "name", "Actions"].forEach((headerText) => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
            // Table <tbody> erzeugen
            const tbody = document.createElement('tbody');
            vendors.forEach((product) => {
                const row = document.createElement('tr');
                // Spalte ID
                const idCell = document.createElement('th');
                idCell.scope = "row";
                const idSpan = document.createElement('span');
                idSpan.textContent = product.id.toString();
                idCell.appendChild(idSpan);
                row.appendChild(idCell);
                // Spalte Name
                const nameCell = document.createElement('td');
                const nameSpan = document.createElement('span');
                nameSpan.textContent = product.name;
                nameCell.appendChild(nameSpan);
                row.appendChild(nameCell);
                // Spalte Bouton
                const buttonCell = document.createElement('td');
                const button = document.createElement('button');
                button.className = "btn btn-success";
                button.textContent = "Details";
                button.addEventListener('click', () => {
                    displayVendors(product.id);
                });
                buttonCell.appendChild(button);
                row.appendChild(buttonCell);
                // <tbody> erstellen
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            const container = document.getElementById('table-container') || document.body;
            container.appendChild(table);
        }
        //Anzeigen von Orders
        const orders = apiUrl + "/orders";
        fetch(orders) // Promise wird zurückgeben
            .then(response => {
            if (!response.ok) { // Prüfung des Status
                throw new Error(`Response status: ${response.status}`);
            }
            return response.json(); // Liest den Body des Request aus und gibt Promise zurück
        })
            .then(responseJson => {
            return responseJson.orders; // Gibt Teil des Response als Teil eines Promise zurück
        })
            .then(data => {
            console.log(data); // JSON-Daten hier verarbeiten
            createTableOrders(data);
        })
            .catch(error => {
            console.error(error.message); // Fehlerbehandlung
        });
        function createTableOrders(orders) {
            const table = document.createElement('table'); // erstellen <table>
            table.id = "template_table"; // ID
            table.className = "table table-striped"; // CSS- Klasse
            const caption = document.createElement('caption');
            caption.className = "text-start";
            caption.id = "order";
            caption.textContent = "Übersicht Orders";
            table.appendChild(caption);
            // <thead> erstellen
            const thead = document.createElement('thead');
            thead.className = "border-bottom mb-2";
            const headerRow = document.createElement('tr');
            ["ID", "state", "items", "Customers", "Actions"].forEach((headerText) => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
            // Table <tbody> erzeugen
            const tbody = document.createElement('tbody');
            orders.forEach((product) => {
                const row = document.createElement('tr');
                // Spalte ID
                const idCell = document.createElement('th');
                idCell.scope = "row";
                const idSpan = document.createElement('span');
                idSpan.textContent = product.id.toString();
                idCell.appendChild(idSpan);
                row.appendChild(idCell);
                // Spalte state
                const stateCell = document.createElement('td');
                const stateSpan = document.createElement('span');
                stateSpan.textContent = product.state;
                stateCell.appendChild(stateSpan);
                row.appendChild(stateCell);
                // Spalte Item
                const itemCell = document.createElement('td');
                const itemSpan = document.createElement('span');
                itemSpan.textContent = product.items
                    .map(item => `product_id: ${item.product_id}, quantity: ${item.quantity}`) // Jedes Element formatieren
                    .join("; "); // Alle Strings kombinieren und mit "; " trennen
                itemCell.appendChild(itemSpan);
                row.appendChild(itemCell);
                // Spalte Customer
                const customerCell = document.createElement('td');
                const customerSpan = document.createElement('span');
                customerSpan.textContent = `id: ${product.customer.id},firstname:${product.customer.firstname},lastname: ${product.customer.lastname}`;
                customerCell.appendChild(customerSpan);
                row.appendChild(customerCell);
                // Spalte Action
                const buttonCell = document.createElement('td');
                const button = document.createElement('button');
                button.className = "btn btn-secondary";
                button.textContent = "Details";
                button.addEventListener('click', () => {
                    displayOrders(product.id);
                });
                buttonCell.appendChild(button);
                row.appendChild(buttonCell);
                // <tbody> erstellen
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            const container = document.getElementById('table-container') || document.body;
            container.appendChild(table);
        }
        //Anzeigen von vendors
        const customers = apiUrl + "/customers";
        fetch(customers) // Promise wird zurückgeben
            .then(response => {
            if (!response.ok) { // Prüfung des Status
                throw new Error(`Response status: ${response.status}`);
            }
            return response.json(); // Liest den Body des Request aus und gibt Promise zurück
        })
            .then(responseJson => {
            return responseJson.customers; // Gibt Teil des Response als Teil eines Promise zurück
        })
            .then(data => {
            console.log(data); // JSON-Daten hier verarbeiten
            createTableCustomers(data);
        })
            .catch(error => {
            console.error(error.message); // Fehlerbehandlung
        });
        function createTableCustomers(customers) {
            const table = document.createElement('table'); // erstellen <table>
            table.id = "template_table"; // ID
            table.className = "table table-striped"; // CSS- Klasse
            const caption = document.createElement('caption');
            caption.className = "text-start";
            caption.id = "costumer";
            caption.textContent = "Übersicht costumers";
            table.appendChild(caption);
            // <thead> erstellen
            const thead = document.createElement('thead');
            thead.className = "border-bottom mb-2";
            const headerRow = document.createElement('tr');
            ["ID", "name", "Actions"].forEach((headerText) => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
            // Table <tbody> erzeugen
            const tbody = document.createElement('tbody');
            customers.forEach((customers) => {
                const row = document.createElement('tr');
                // Spalte ID
                const idCell = document.createElement('th');
                idCell.scope = "row";
                const idSpan = document.createElement('span');
                idSpan.textContent = customers.id.toString();
                idCell.appendChild(idSpan);
                row.appendChild(idCell);
                // Spalte Name
                const nameCell = document.createElement('td');
                const nameSpan = document.createElement('span');
                nameSpan.textContent = customers.name;
                nameCell.appendChild(nameSpan);
                row.appendChild(nameCell);
                // Spalte Bouton
                const buttonCell = document.createElement('td');
                const button = document.createElement('button');
                button.className = "btn btn-danger";
                button.textContent = "Details";
                button.addEventListener('click', () => {
                    displayCustomers(customers.id);
                });
                buttonCell.appendChild(button);
                row.appendChild(buttonCell);
                // <tbody> erstellen
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            const container = document.getElementById('table-container') || document.body;
            container.appendChild(table);
        }
        function displayProducts(productId) {
            const productUrl = apiUrl + "products/" + productId;
            const modalTitle = document.getElementById('detailsModal_title');
            const modalBody = document.getElementById('detailsModal_body');
            fetch(productUrl)
                .then(response => {
                if (!response.ok) { // Prüfung des Status
                    throw new Error(`Response status: ${response.status}`);
                }
                return response.json(); // Liest den Body des Request aus und gibt Promise zurück
            })
                .then((data) => {
                modalTitle.textContent = "Product Details";
                modalBody.innerHTML = `
                        <div> id: ${data.id}</div>
                        <div> name: ${data.name}</div>
                        <div>price: ${data.price}</div>
                        <div> vendors</div>
                            ${data.vendors.map((vendors, index) => `
                            <div>&nbsp; &nbsp;${index}</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp; id:${vendors.id}</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp; name:${vendors.name}</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp; self_link:${vendors.self_link}</div>`).join('')}
                            <div> image_link: ${data.image_link}</div>
                            <div>modified_at: ${data.modified_at}</div>`;
                const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
                modal.show();
            })
                .catch(error => {
                console.error(error.message);
            });
        }
        function displayVendors(vendorId) {
            const vendorUrl = apiUrl + "vendors/" + vendorId;
            const modalTitle = document.getElementById('detailsModal_title');
            const modalBody = document.getElementById('detailsModal_body');
            fetch(vendorUrl)
                .then(response => {
                if (!response.ok) { // Prüfung des Status
                    throw new Error(`Response status: ${response.status}`);
                }
                return response.json(); // Liest den Body des Request aus und gibt Promise zurück
            })
                .then((data) => {
                modalTitle.textContent = "Product Details";
                modalBody.innerHTML = `
                        <div> id: ${data.id}</div>
                        <div> name: ${data.name}</div>
                        <div>product link: ${data.products_link}</div>
                        `;
                const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
                modal.show();
            })
                .catch(error => {
                console.error(error.message);
            });
        }
        function displayCustomers(customerId) {
            const vendorUrl = apiUrl + "customers/" + customerId;
            const modalTitle = document.getElementById('detailsModal_title');
            const modalBody = document.getElementById('detailsModal_body');
            fetch(vendorUrl)
                .then(response => {
                if (!response.ok) { // Prüfung des Status
                    throw new Error(`Response status: ${response.status}`);
                }
                return response.json(); // Liest den Body des Request aus und gibt Promise zurück
            })
                .then((data) => {
                modalTitle.textContent = "Product Details";
                modalBody.innerHTML = `
                        <div> firstname: ${data.firstname}</div>
                        <div> name: ${data.lastname}</div>
                        `;
                const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
                modal.show();
            })
                .catch(error => {
                console.error(error.message);
            });
        }
        function displayOrders(OrderId) {
            const vendorUrl = apiUrl + "orders/" + OrderId;
            const modalTitle = document.getElementById('detailsModal_title');
            const modalBody = document.getElementById('detailsModal_body');
            fetch(vendorUrl)
                .then(response => {
                if (!response.ok) { // Prüfung des Status
                    throw new Error(`Response status: ${response.status}`);
                }
                return response.json(); // Liest den Body des Request aus und gibt Promise zurück
            })
                .then((data) => {
                if (!modalTitle || !modalBody) {
                    console.error("Modal elements not found in the DOM.");
                    return;
                }
                // Mise à jour du titre du modal
                modalTitle.textContent = "Order Details";
                // Affichage des données dans le corps du modal
                modalBody.innerHTML = `
        <div>id: ${data.id}</div>
        <div>state: ${data.state}</div>
        <div>Actions:</div>
        <ul>
            ${Object.entries(data.actions)
                    .map(([key, action]) => `
                    <li>
                        ${key}:
                        <div>&nbsp;&nbsp;&nbsp;link: ${action.link}</div>
                        <div>&nbsp;&nbsp;&nbsp;method: ${action.method}</div>
                    </li>
                    `)
                    .join('')}
                        </ul>
                        <div>customer: ${data.customer}</div>
                        <div>customer_link: ${data.customer_link}</div>
                        <div>items_link: ${data.items_link}" </div>
                        <div>total: ${data.total}</div>
                    `;
                const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
                modal.show();
            })
                .catch(error => {
                console.error(error.message);
            });
        }
    });
});
