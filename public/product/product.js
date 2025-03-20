
document.addEventListener('DOMContentLoaded', () => {

    // Extract product name from the URL path
    const pathSegments = window.location.pathname.split('/');
    const productId = pathSegments[pathSegments.indexOf('product') + 1];


    const product_title = document.getElementById('product_item');

    const category_name = document.getElementById('category_name');
    const category_link= document.getElementById('category_link');

    const product_link = document.getElementById('product_link');
    const product_name= document.getElementById('product_name');


    // const product_box = document.getElementsById('product_box');
    const productTemplate = document.getElementById('product_template');

    const product_box = document.getElementById('product_box');
    

    async function fetchItem() {
        try {
            const response = await fetch(`http://localhost:3000/api/item/${productId}`);
            const item = await response.json();

            const catresponse = await fetch(`http://localhost:3000/api/category/catid/${item[0].catid}`);
            const category = await catresponse.json();
            // console.log(category);

            product_name.textContent = item[0].name;
            product_link.href = `/product/${item[0].pid}`; 

            category_name.textContent = category[0].name;
            category_link.href = `/category/${category[0].name}`;
            


            // Clone the template
            const productElement = productTemplate.content.cloneNode(true);



            const left_col = productElement.querySelector('.leftcol');
            const right_col = productElement.querySelector('.rightcol');

            // Set item details
            const item_name = productElement.querySelector('.product_name');
            // const item_link = productElement.querySelector('.product_link');
            const item_price = productElement.querySelector('.product_price');
            const item_img = productElement.querySelector('.product_img');
            const item_description = productElement.querySelector('.product_description');
            const add_cart_button = productElement.querySelector('.add_cart_button');

            item_name.textContent = item[0].name;
            item_price.textContent = item[0].price;
            
            item_img.src = `/${item[0].imagepath}`;
            item_description.textContent = item[0].description;
            add_cart_button.dataset.pid = item[0].pid;

            product_box.appendChild(left_col);
            product_box.appendChild(right_col);

        } catch (error) {
            console.error('Item fetch error:', error);
          }
    
    }

    const login_status_display = document.getElementById('login_status_display');
    async function fetchLoginStatus() {
      try {
        const response = await fetch('http://localhost:3000/login_stat');
        const status = await response.json();

        login_status_display.textContent = `current login as: ${status}`;
      } catch (err) {
        console.error('Login status error error:', error);
      }
    }

    fetchLoginStatus();
    fetchItem();

});



