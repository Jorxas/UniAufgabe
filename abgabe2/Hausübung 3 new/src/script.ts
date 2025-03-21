// Lorsque le contenu du DOM est complètement chargé, la fonction suivante est exécutée
document.addEventListener('DOMContentLoaded', function() {

    // Récupère l'élément bouton avec l'ID 'submit-button' et le cast en tant que bouton HTML
    const bouton = document.getElementById('submit-button') as HTMLButtonElement;

    // Ajoute un écouteur d'événement au bouton pour quand il est cliqué
    bouton.addEventListener('click',(event)=>{
        // Empêche l'action par défaut du bouton (souvent une soumission de formulaire)
        event.preventDefault();
    })

    // Ajoute un autre écouteur d'événement pour exécuter une fonction au clic du bouton
    bouton.addEventListener('click',()=>{
        // Récupère l'élément input pour le nom du site et le cast en tant qu'élément HTMLInputElement
        const seiteNameElement: HTMLInputElement = document.getElementById('site-name') as HTMLInputElement;

        // Récupère l'élément input pour l'URL de l'API et le cast en tant qu'élément HTMLInputElement
        const apiUrlElement: HTMLInputElement = document.getElementById('api-endpoint') as HTMLInputElement;

        // Récupère la valeur saisie dans l'input pour le nom du site
        const seiteName  = seiteNameElement.value;

        // Récupère la valeur saisie dans l'input pour l'URL de l'API
        const apiUrl = apiUrlElement.value;

        // Met à jour le texte du titre du navbar avec le nom du site
        document.getElementById('navbar_title')!.textContent = seiteName;

        // Sélectionne tous les éléments <a> à l'intérieur de l'élément ayant l'ID 'navbar_links'
        const navigationElement = document.querySelectorAll('#navbar_links a')!;

        // Effectue une requête HTTP (fetch) pour récupérer les données de l'API à partir de l'URL
        fetch(apiUrl)
            .then((response) =>{
                // Convertit la réponse en JSON
                return response.json();
            })
            .then((datas) => createNavigation(datas)) // Appelle la fonction createNavigation avec les données reçues

        // Fonction pour créer la navigation en fonction des données reçues
        function createNavigation(data) {
            // Définit un tableau de liens avec les clés et les ancres associées
            const links = [
                { key: 'products_link', anchor: '#products' },
                { key: 'vendors_link', anchor: '#vendor' },
                { key: 'orders_link', anchor: '#order' },
                { key: 'customer_link', anchor: '#customer' }
            ];

            // Parcourt chaque lien du tableau 'links'
            links.forEach((link, index) => {
                // Récupère l'élément <a> correspondant à l'index actuel dans le tableau 'navigationElement'
                const element  = navigationElement.item(index) as HTMLAnchorElement;

                // Extrait le nom du lien en utilisant la valeur de la clé 'link.key' et en coupant l'URL
                const linkText = data.links[link.key].split("/")[3];

                // Met à jour le texte du lien avec le texte extrait de l'URL
                element.textContent = linkText;

                // Met à jour l'attribut 'href' du lien avec l'ancre associée
                element.href = link.anchor;
            });
        }

        // Récupère la table avec l'ID 'template_table' et la caste en tant qu'élément HTMLTableElement
        const table = document.getElementById('template_table') as HTMLTableElement;

        // Vide le contenu de la table (au cas où il y aurait déjà du contenu)
        table.innerHTML = '';

        // Affiche les produits en récupérant les données depuis l'API
        const Products = apiUrl + "/products";

        // Effectue une requête fetch pour obtenir les produits
        fetch(Products) // La promesse va être retournée
            .then(response => { // Cas de succès de la promesse
                if (!response.ok) { // Vérification du statut
                    throw new Error(`Response status: ${response.status}`); // Si le statut n'est pas ok, on lance une erreur
                }
                return response.json(); // Lit le corps de la requête et retourne une promesse
            })
            .then(responseJson => { // Cas de succès de la prochaine promesse
                return responseJson.products; // Retourne les produits extraits de la réponse JSON
            })
            .then(data => { // Cas de succès de la prochaine promesse
                createTableProducts(data); // Crée le tableau avec les produits
            });

        // Fonction pour créer et afficher le tableau des produits
        function createTableProducts(products: { id: number; name: string; self_link: string }[]) {
            const table = document.createElement('table'); // Crée un nouvel élément <table>
            table.id = "template_table"; // Attribue l'ID 'template_table' à la table
            table.className = "table table-striped"; // Ajoute la classe CSS 'table table-striped' pour le style

            // Crée un élément <caption> pour ajouter un titre à la table
            const caption = document.createElement('caption');
            caption.className = "text-start";
            caption.id = "products";
            caption.textContent = "Übersicht Products"; // Titre de la table
            table.appendChild(caption); // Ajoute le titre à la table

            // Crée l'en-tête <thead> de la table
            const thead = document.createElement('thead');
            thead.className = "border-bottom mb-2";
            const headerRow = document.createElement('tr');

            // Crée les colonnes de l'en-tête (ID, Nom, Actions)
            ["ID", "name", "Actions"].forEach((headerText) => {
                const th = document.createElement('th');
                th.textContent = headerText; // Remplit le texte des en-têtes de colonne
                headerRow.appendChild(th); // Ajoute chaque colonne à la ligne d'en-tête
            });
            thead.appendChild(headerRow); // Ajoute la ligne d'en-tête à l'élément <thead>
            table.appendChild(thead); // Ajoute l'en-tête à la table

            // Crée le corps de la table <tbody>
            const tbody = document.createElement('tbody');
            products.forEach((product) => { // Pour chaque produit, crée une nouvelle ligne
                const row = document.createElement('tr'); // Crée une nouvelle ligne

                // Colonne ID
                const idCell = document.createElement('th');
                idCell.scope = "row"; // Spécifie que cette cellule contient l'ID de la ligne
                const idSpan = document.createElement('span');
                idSpan.textContent = product.id.toString(); // Affiche l'ID du produit
                idCell.appendChild(idSpan); // Ajoute l'ID à la cellule
                row.appendChild(idCell); // Ajoute la cellule à la ligne

                // Colonne Nom
                const nameCell = document.createElement('td');
                const nameSpan = document.createElement('span');
                nameSpan.textContent = product.name; // Affiche le nom du produit
                nameCell.appendChild(nameSpan); // Ajoute le nom à la cellule
                row.appendChild(nameCell); // Ajoute la cellule à la ligne

                // Colonne Actions avec un bouton "Détails"
                const actionCell = document.createElement('td');
                const detailButton = document.createElement('button');
                detailButton.className = "btn btn-warning"; // Ajoute la classe CSS pour le bouton
                detailButton.textContent = "Details"; // Texte du bouton
                detailButton.addEventListener('click', () => {
                    console.log(product); // Affiche le produit dans la console
                    displayProducts(product.id); // Affiche les détails du produit dans une fenêtre modale
                });
                actionCell.appendChild(detailButton); // Ajoute le bouton d'action à la cellule
                row.appendChild(actionCell); // Ajoute la cellule à la ligne

                tbody.appendChild(row); // Ajoute la ligne au corps de la table
            });
            table.appendChild(tbody); // Ajoute le corps de la table à la table

            // Récupère le conteneur de la table et y ajoute la table
            const container = document.getElementById('table-container') || document.body;
            container.appendChild(table); // Ajoute la table au conteneur
        }

        // Fonction pour afficher les détails d'un produit
        function displayProducts(productId: number) {
            const productUrl = apiUrl + "products/" + productId; // Crée l'URL pour récupérer les détails du produit
            const modalTitle = document.getElementById('detailsModal_title') as HTMLHeadingElement; // Récupère l'élément titre du modal
            const modalBody = document.getElementById('detailsModal_body') as HTMLDivElement; // Récupère l'élément corps du modal

            // Effectue une requête pour récupérer les détails du produit
            fetch(productUrl)
                .then(response => {
                    if (!response.ok) { // Vérifie si la réponse est correcte
                        throw new Error(`Response status: ${response.status}`); // Si ce n'est pas le cas, lève une erreur
                    }
                    return response.json(); // Retourne les détails du produit en JSON
                })
                .then((data) => {
                    modalTitle!.textContent = "Product Details"; // Met à jour le titre du modal
                    modalBody!.innerHTML = `
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
                    const modal = new bootstrap.Modal(document.getElementById('detailsModal')!);
                    modal.show(); // Affiche la fenêtre modale avec les détails du produit
                });
        }



        // Annonce des vendors
        const vendors = apiUrl + "/vendors"; // Définir l'URL pour récupérer les informations des vendors
        fetch(vendors) // Lancer une requête fetch pour obtenir les données des vendors
            .then(response => { // Lorsque la réponse est reçue, traiter le succès du Promise
                if (!response.ok) { // Vérifier si la réponse HTTP est correcte
                    throw new Error(`Response status: ${response.status}`); // Si l'état n'est pas correct, lever une erreur
                }
                return response.json(); // Récupérer les données JSON de la réponse
            })
            .then(responseJson => { // Lorsque la conversion JSON réussit
                return responseJson.vendors; // Extraire et retourner la liste des vendors depuis le JSON
            })
            .then(data => { // Lorsque la liste des vendors est récupérée
                createTableVendors(data); // Créer et afficher le tableau avec les données des vendors
            });

// Fonction pour créer un tableau des vendors
        function createTableVendors(vendors: { id: number; name: string; self_link: string }[]) {
            const table = document.createElement('table'); // Créer une table HTML
            table.id = "template_table"; // Ajouter un ID à la table
            table.className = "table table-striped"; // Appliquer une classe CSS à la table pour la styliser

            const caption = document.createElement('caption'); // Créer un élément <caption> pour le titre
            caption.className = "text-start"; // Appliquer une classe CSS pour l'alignement à gauche
            caption.id = "vendor"; // Ajouter un ID pour le titre
            caption.textContent = "Übersicht Vendor"; // Définir le texte du titre
            table.appendChild(caption); // Ajouter le titre à la table

            // Créer l'en-tête du tableau <thead>
            const thead = document.createElement('thead');
            thead.className = "border-bottom mb-2"; // Appliquer des styles CSS
            const headerRow = document.createElement('tr'); // Créer une ligne pour l'en-tête du tableau
            ["ID", "name", "Actions"].forEach((headerText) => { // Créer une cellule d'en-tête pour chaque titre
                const th = document.createElement('th');
                th.textContent = headerText; // Définir le texte de la cellule
                headerRow.appendChild(th); // Ajouter la cellule à la ligne d'en-tête
            });
            thead.appendChild(headerRow); // Ajouter la ligne d'en-tête au <thead>
            table.appendChild(thead); // Ajouter l'en-tête à la table

            // Créer le corps du tableau <tbody>
            const tbody = document.createElement('tbody');
            vendors.forEach((product) => { // Pour chaque vendor, ajouter une ligne dans le tableau
                const row = document.createElement('tr'); // Créer une ligne pour chaque vendor

                // Créer une cellule pour l'ID du vendor
                const idCell = document.createElement('th');
                idCell.scope = "row"; // Définir la cellule comme une cellule de ligne
                const idSpan = document.createElement('span');
                idSpan.textContent = product.id.toString(); // Définir l'ID comme texte
                idCell.appendChild(idSpan); // Ajouter l'ID à la cellule
                row.appendChild(idCell); // Ajouter la cellule à la ligne

                // Créer une cellule pour le nom du vendor
                const nameCell = document.createElement('td');
                const nameSpan = document.createElement('span');
                nameSpan.textContent = product.name; // Définir le nom du vendor comme texte
                nameCell.appendChild(nameSpan); // Ajouter le nom à la cellule
                row.appendChild(nameCell); // Ajouter la cellule à la ligne

                // Créer une cellule pour le bouton d'action
                const buttonCell = document.createElement('td');
                const button = document.createElement('button');
                button.className = "btn btn-success"; // Ajouter une classe pour le style du bouton
                button.textContent = "Details"; // Définir le texte du bouton
                button.addEventListener('click', () => { // Ajouter un événement pour afficher les détails
                    displayVendors(product.id); // Appeler la fonction pour afficher les détails du vendor
                });
                buttonCell.appendChild(button); // Ajouter le bouton à la cellule
                row.appendChild(buttonCell); // Ajouter la cellule à la ligne

                // Ajouter la ligne au corps du tableau
                tbody.appendChild(row);
            });
            table.appendChild(tbody); // Ajouter le corps du tableau à la table

            // Ajouter la table au conteneur (ou au corps de la page si le conteneur est inexistant)
            const container = document.getElementById('table-container') || document.body;
            container.appendChild(table);
        }

// Fonction pour afficher les détails d'un vendor dans une modal
        function displayVendors(vendorId: number) {
            const vendorUrl = apiUrl + "vendors/" + vendorId; // Construire l'URL de l'API pour obtenir les détails du vendor
            const modalTitle = document.getElementById('detailsModal_title') as HTMLHeadingElement;
            const modalBody = document.getElementById('detailsModal_body') as HTMLDivElement;

            fetch(vendorUrl) // Faire une requête pour récupérer les détails du vendor
                .then(response => { // Traiter la réponse
                    if (!response.ok) { // Vérifier si la réponse est valide
                        throw new Error(`Response status: ${response.status}`); // Lever une erreur si la réponse est incorrecte
                    }
                    return response.json(); // Récupérer les données JSON
                })
                .then((data) => {
                    modalTitle!.textContent = "Product Details"; // Mettre à jour le titre du modal
                    modalBody!.innerHTML = ` 
                <div> id: ${data.id}</div> 
                <div> name: ${data.name}</div> 
                <div> product link: ${data.products_link}</div>
            `; // Afficher les détails du vendor dans le modal
                    const modal = new bootstrap.Modal(document.getElementById('detailsModal')!);
                    modal.show(); // Afficher la modal avec les informations du vendor
                });
        }


        // Annonce des commandes
        const orders = apiUrl + "/orders"; // Définir l'URL pour récupérer les informations des commandes
        fetch(orders) // Exécuter la requête fetch pour obtenir les données des commandes
            .then(response => { // Lorsque la réponse est reçue, traiter le succès du Promise
                if (!response.ok) { // Vérifier si la réponse HTTP est correcte
                    throw new Error(`Response status: ${response.status}`); // Si l'état n'est pas correct, lever une erreur
                }
                return response.json(); // Récupérer les données JSON de la réponse
            })
            .then(responseJson => { // Lorsque la conversion JSON réussit
                return responseJson.orders; // Extraire et retourner la liste des commandes depuis le JSON
            })
            .then(data => { // Lorsque la liste des commandes est récupérée
                createTableOrders(data); // Créer et afficher le tableau avec les données des commandes
            });

// Fonction pour créer un tableau des commandes
        function createTableOrders(orders: {
            id: number;
            state: string;
            items: { product_id: number; quantity: number }[]; // Mise à jour des items
            customer: { id: number; firstname: string; lastname: string };
        }[]) {
            const table = document.createElement('table'); // Créer une table HTML
            table.id = "template_table"; // Ajouter un ID à la table
            table.className = "table table-striped"; // Appliquer une classe CSS pour la table

            const caption = document.createElement('caption'); // Créer une légende pour la table
            caption.className = "text-start"; // Appliquer une classe CSS pour aligner le texte à gauche
            caption.id = "order"; // Ajouter un ID à la légende
            caption.textContent = "Übersicht Orders"; // Définir le texte de la légende
            table.appendChild(caption); // Ajouter la légende à la table

            // Créer l'en-tête du tableau <thead>
            const thead = document.createElement('thead');
            thead.className = "border-bottom mb-2"; // Ajouter une classe CSS pour la bordure de l'en-tête
            const headerRow = document.createElement('tr'); // Créer une ligne pour l'en-tête
            ["ID", "state", "items", "Customers", "Actions"].forEach((headerText) => { // Ajouter les titres des colonnes
                const th = document.createElement('th');
                th.textContent = headerText; // Définir le texte du titre de la colonne
                headerRow.appendChild(th); // Ajouter la cellule de titre à la ligne de l'en-tête
            });
            thead.appendChild(headerRow); // Ajouter la ligne d'en-tête à l'élément <thead>
            table.appendChild(thead); // Ajouter l'en-tête à la table

            // Créer le corps du tableau <tbody>
            const tbody = document.createElement('tbody');
            orders.forEach((product) => { // Pour chaque commande, ajouter une ligne au tableau
                const row = document.createElement('tr'); // Créer une ligne pour la commande

                // Créer une cellule pour l'ID de la commande
                const idCell = document.createElement('th');
                idCell.scope = "row"; // Définir la cellule comme cellule de ligne
                const idSpan = document.createElement('span');
                idSpan.textContent = product.id.toString(); // Afficher l'ID de la commande
                idCell.appendChild(idSpan); // Ajouter l'ID à la cellule
                row.appendChild(idCell); // Ajouter la cellule à la ligne

                // Créer une cellule pour l'état de la commande
                const stateCell = document.createElement('td');
                const stateSpan = document.createElement('span');
                stateSpan.textContent = product.state; // Afficher l'état de la commande
                stateCell.appendChild(stateSpan); // Ajouter l'état à la cellule
                row.appendChild(stateCell); // Ajouter la cellule à la ligne

                // Créer une cellule pour les articles de la commande
                const itemCell = document.createElement('td');
                const itemSpan = document.createElement('span');
                itemSpan.textContent = product.items
                    .map(item => `product_id: ${item.product_id}, quantity: ${item.quantity}`) // Formater chaque item
                    .join("; "); // Combiner tous les éléments en une chaîne séparée par "; "
                itemCell.appendChild(itemSpan); // Ajouter les items à la cellule
                row.appendChild(itemCell); // Ajouter la cellule à la ligne

                // Créer une cellule pour le client de la commande
                const customerCell = document.createElement('td');
                const customerSpan = document.createElement('span');
                customerSpan.textContent = `id: ${product.customer.id}, firstname: ${product.customer.firstname}, lastname: ${product.customer.lastname}`;
                customerCell.appendChild(customerSpan); // Ajouter les informations du client à la cellule
                row.appendChild(customerCell); // Ajouter la cellule à la ligne

                // Créer une cellule pour le bouton d'action
                const buttonCell = document.createElement('td');
                const button = document.createElement('button');
                button.className = "btn btn-secondary"; // Appliquer un style au bouton
                button.textContent = "Details"; // Définir le texte du bouton
                button.addEventListener('click', () => { // Ajouter un événement pour afficher les détails
                    displayOrders(product.id); // Appeler la fonction pour afficher les détails de la commande
                });
                buttonCell.appendChild(button); // Ajouter le bouton à la cellule
                row.appendChild(buttonCell); // Ajouter la cellule avec le bouton à la ligne

                // Ajouter la ligne au corps du tableau
                tbody.appendChild(row);
            });
            table.appendChild(tbody); // Ajouter le corps du tableau à la table

            // Ajouter la table au conteneur (ou au corps de la page si le conteneur n'existe pas)
            const container = document.getElementById('table-container') || document.body;
            container.appendChild(table);
        }

// Fonction pour afficher les détails d'une commande dans une modal
        function displayOrders(OrderId: number) {
            const vendorUrl = apiUrl + "orders/" + OrderId; // Construire l'URL pour obtenir les détails de la commande
            const modalTitle = document.getElementById('detailsModal_title') as HTMLHeadingElement;
            const modalBody = document.getElementById('detailsModal_body') as HTMLDivElement;

            fetch(vendorUrl) // Faire une requête pour récupérer les détails de la commande
                .then(response => { // Traiter la réponse
                    if (!response.ok) { // Vérifier si la réponse est valide
                        throw new Error(`Response status: ${response.status}`); // Lever une erreur si la réponse est incorrecte
                    }
                    return response.json(); // Récupérer les données JSON
                })
                .then((data) => {
                    if (!modalTitle || !modalBody) {
                        console.error("Modal elements not found in the DOM."); // Vérifier que les éléments de la modal existent
                        return;
                    }

                    // Mise à jour du titre de la modal
                    modalTitle.textContent = "Order Details";

                    // Affichage des données dans le corps de la modal
                    modalBody.innerHTML = `
                <div>id: ${data.id}</div>
                <div>state: ${data.state}</div>
                <div>Actions:</div>
                <ul>
                    ${Object.entries(data.actions)
                        .map(
                            ([key, action]) => `
                                <li>
                                    ${key}:
                                    <div>&nbsp;&nbsp;&nbsp;link: ${action.link}</div>
                                    <div>&nbsp;&nbsp;&nbsp;method: ${action.method}</div>
                                </li>
                            `
                        )
                        .join('')}
                </ul>
                <div>customer: ${data.customer}</div>
                <div>customer_link: ${data.customer_link}</div>
                <div>items_link: ${data.items_link}" </div>
                <div>total: ${data.total}</div>
            `;
                    const modal = new bootstrap.Modal(document.getElementById('detailsModal')!);
                    modal.show(); // Afficher la modal avec les informations de la commande
                });
        }

// Annonce des clients
        const customers = apiUrl + "/customers"; // Définir l'URL pour récupérer les informations des clients
        fetch(customers) // Exécuter la requête fetch pour obtenir les données des clients
            .then(response => { // Lorsque la réponse est reçue, traiter le succès du Promise
                if (!response.ok) { // Vérifier si la réponse HTTP est correcte
                    throw new Error(`Response status: ${response.status}`); // Si l'état n'est pas correct, lever une erreur
                }
                return response.json(); // Récupérer les données JSON de la réponse
            })
            .then(responseJson => { // Lorsque la conversion JSON réussit
                return responseJson.customers; // Extraire et retourner la liste des clients depuis le JSON
            })
            .then(data => { // Lorsque la liste des clients est récupérée
                createTableCustomers(data); // Créer et afficher le tableau avec les données des clients
            });

// Fonction pour créer un tableau des clients
        function createTableCustomers(customers: { id: number; name: string; self_link: string }[]) {
            const table = document.createElement('table'); // Créer une table HTML
            table.id = "template_table"; // Ajouter un ID à la table
            table.className = "table table-striped"; // Appliquer une classe CSS à la table

            const caption = document.createElement('caption'); // Créer une légende pour la table
            caption.className = "text-start"; // Appliquer une classe CSS pour aligner le texte à gauche
            caption.id = "costumer"; // Ajouter un ID à la légende
            caption.textContent = "Übersicht costumers"; // Définir le texte de la légende
            table.appendChild(caption); // Ajouter la légende à la table

            // Créer l'en-tête du tableau <thead>
            const thead = document.createElement('thead');
            thead.className = "border-bottom mb-2"; // Ajouter une classe CSS pour la bordure de l'en-tête
            const headerRow = document.createElement('tr'); // Créer une ligne pour l'en-tête
            ["ID", "name", "Actions"].forEach((headerText) => { // Ajouter les titres des colonnes
                const th = document.createElement('th');
                th.textContent = headerText; // Définir le texte du titre de la colonne
                headerRow.appendChild(th); // Ajouter la cellule de titre à la ligne d'en-tête
            });
            thead.appendChild(headerRow); // Ajouter la ligne d'en-tête à l'élément <thead>
            table.appendChild(thead); // Ajouter l'en-tête à la table

            // Créer le corps du tableau <tbody>
            const tbody = document.createElement('tbody');
            customers.forEach((customers) => { // Pour chaque client, ajouter une ligne au tableau
                const row = document.createElement
            })

        }
    })
});
