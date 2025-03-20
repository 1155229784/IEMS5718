
class Item {
    constructor(pid, quantity) {
        this.pid = pid;
        this.quantity = quantity;
    }

    async createItemElement() {
        const ItemTemplate = document.getElementById('item_template');
        const ItemElement = ItemTemplate.content.cloneNode(true);
        

        const cartitem = ItemElement.querySelector('.cart_item');
        // Set Item details
        const response = await fetch(`http://localhost:3000/api/item/${this.pid}`);
        const item = await response.json();

        
        const item_name = ItemElement.querySelector('.item_name');
        const item_price = ItemElement.querySelector('.item_price');
        const item_img = ItemElement.querySelector('.item_img');
        const item_num = ItemElement.querySelector('.item_num');
        const plus_button = ItemElement.querySelector('.cart_item_plus');
        const minus_button = ItemElement.querySelector('.cart_item_minus');
        
        item_name.textContent = item[0].name;
        item_price.textContent = item[0].price;
        item_num.textContent = this.quantity;
        item_img.src = `/${item[0].imagepath}`;
        plus_button.dataset.pid = this.pid;
        minus_button.dataset.pid = this.pid;
        return cartitem;
    }
}

class ShoppingCart {
   constructor() {
        this.items = [];
        // this.items = [
        //     new Item (1,1),
        //     new Item (2,2),
        //     new Item (3,3)
        // ];
        // Wrap init in a promise to ensure it's called
        Promise.resolve(this.init()).catch(error => {
            console.error("Initialization error:", error);
        });
       
        // console.log("constructer done")       
    }

    async init() {
        await this.loadFromLocalStorage();
        await this.renderProducts();
        await this.addInitEventListener();
        
        // console.log("init done")      
        
    }

    async addInitEventListener() {
        // console.log("added initEvent")
        const cartButton = document.getElementById('cartbutton');
        const dropdownContent = document.querySelector('.dropdown-content');
        const add_cart_buttons = document.getElementsByClassName('add_cart_button');
            
        cartButton.addEventListener('click', () => {
            dropdownContent.classList.toggle('show');
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (!cartButton.contains(event.target) && 
                !dropdownContent.contains(event.target)) {
                dropdownContent.classList.remove('show');
            }
        });


        for (let i = 0; i < add_cart_buttons.length; i++) {
            
            add_cart_buttons[i].addEventListener('click', async (event) => {
                
                const productId = parseInt(add_cart_buttons[i].dataset.pid)
                console.log(`Item add ${productId}`)
                const item = this.items.find(p => p.pid === productId);
                if (item) {
                    await this.addItem(item);
                }
                else {
                    const newItem  = new Item(productId, 1)
                    await this.addItem(newItem);
                }
                
                dropdownContent.classList.toggle('show');
                
            });
        }
        
    }
    // Add item to cart
    async addItem(product) {
        
        const existingItem = this.items.find(item => item.pid === product.pid);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(
                product instanceof Item 
                    ? product 
                    : new Item(product.pid, 1)
            );
        }
        await this.saveToLocalStorage();
        await this.renderProducts();
        // console.log("Item added")
    }

    // Remove item from cart
    async removeItem(product) {
        // console.log("Item removed")
        const existingItem = this.items.find(item => item.pid === product.pid);
        
        if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
        } else {
            this.items = this.items.filter(item => item.pid !== product.pid);
        }
        await this.renderProducts();
        // this.items = this.items.filter(item => item.pid !== pid);
        await this.saveToLocalStorage();
        // this.renderCart();
    }

    // Update item quantity
    // updateQuantity(productId, quantity) {
    //     const item = this.items.find(item => item.id === productId);
    //     if (item) {
    //         item.quantity = quantity;
    //         if (item.quantity <= 0) {
    //             this.removeItem(productId);
    //         }
    //         this.saveToLocalStorage();
    //         this.renderCart();
    //     }
    // }

    // Calculate total price
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    async loadFromLocalStorage() {
        
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            // console.log(`load saved cart:`)
            // console.log(parsedCart)
            this.items = parsedCart.map(item => new Item(item.pid, item.quantity));
            // console.log("current items")
            // console.log(this.items)
        }
    }
    // Save cart to localStorage
    async saveToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
        // console.log("saved")
    }

    async renderProducts() {
        const ItemList = document.getElementsByClassName('dropdown-content')[0];
        ItemList.innerHTML = '';
        
        for (const item of this.items) {
            const productElement = await item.createItemElement();
            ItemList.appendChild(productElement);
        }
        await this.attachEventListeners();
    }

    async attachEventListeners() {
        const productList = document.getElementsByClassName('dropdown-content')[0];
        const cart_item_plus = document.getElementsByClassName('cart_item_plus');
        const cart_item_minus = document.getElementsByClassName('cart_item_minus');
        
        

        const dropdownContent = document.querySelector('.dropdown-content');
        // const cartItemsList = document.getElementById('cart-items');
        // const clearCartButton = document.getElementById('clear-cart');


        for (let i = 0; i < cart_item_plus.length; i++) {
            
            cart_item_plus[i].addEventListener('click', async (event) => {
                
                const productId = parseInt(cart_item_plus[i].dataset.pid)
                const item = this.items.find(p => p.pid === productId);
                if (item) {
                    await this.addItem(item);
                }
                
                dropdownContent.classList.toggle('show');
                // console.log("plus clicked")
            });
        }


        for (let i = 0; i < cart_item_minus.length; i++) {
            cart_item_minus[i].addEventListener('click', async (event) => {
                
                const productId = parseInt(cart_item_minus[i].dataset.pid)
                const item = this.items.find(p => p.pid === productId);
                if (item) {
                    await this.removeItem(item);
                }
                
                dropdownContent.classList.toggle('show');
                // console.log("minus clicked")
            });
        }

        


        // productList.addEventListener('click', (e) => {
        //     if (e.target.classList.contains('add-to-cart')) {
        //         const productId = parseInt(e.target.dataset.id);
        //         const product = this.products.find(p => p.id === productId);
        //         if (product) {
        //             this.cart.addItem(product);
        //         }
        //     }
        // });

        // clearCartButton.addEventListener('click', () => {
        //     this.cart.clearCart();
        // });
    }


}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // console.log("DOM Content Loaded");
    const cart = new ShoppingCart();
});

if (document.readyState === 'loading') {
    // console.log("document loaading");
} else {
    // console.log("DOM Content Loaded");
    const cart = new ShoppingCart();
}