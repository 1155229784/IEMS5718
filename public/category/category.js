document.addEventListener('DOMContentLoaded', () => {
    // Extract category from the URL path
    const pathSegments = window.location.pathname.split('/');
    const categoryName = pathSegments[pathSegments.indexOf('category') + 1];

    const category_title = document.getElementById('category_title');

    const category_name = document.getElementById('category_name');
    const category_link= document.getElementById('category_link');

    const productTemplate = document.getElementById('product_box_template');

    const product_grid = document.getElementsByClassName('product_grid')[0];
    async function fetchCategory() {
        try {
            const response = await fetch(`http://localhost:3000/api/category/categoryName/${categoryName}`);
            const category = await response.json();
            // console.log(category);
            category_name.textContent = category[0].name
            category_link.href = `/category/${category[0].name}`;
            category_title.textContent = category[0].name
            
    
          } catch (error) {
            console.error('Category fetch error:', error);
          }
    
    }


    async function fetchCategoryItem() {
        try {
            const response = await fetch(`http://localhost:3000/api/category/${categoryName}/item`);
            const items = await response.json();
            console.log(items);
            items.forEach((item, index) => {
                // Clone the template
                const categoryElement = productTemplate.content.cloneNode(true);
                
                // Set item details
                const item_box = categoryElement.querySelector('.product_box');
                const item_name = categoryElement.querySelector('.product_name');
                const item_link = categoryElement.querySelector('.product_link');
                const item_price = categoryElement.querySelector('.product_price');
                const item_img = categoryElement.querySelector('.product_img');
                const item_description = categoryElement.querySelector('.product_description');
                const add_cart_button = categoryElement.querySelector('.add_cart_button');

                item_box.dataset.itemId = item.pid;
                item_name.textContent = item.name;
                item_link.href = `/product/${item.pid}`; 
                item_price.textContent = item.price;
                add_cart_button.dataset.pid = item.pid;
                item_img.src = `/thumb_` + item.imagepath;
                item_description.textContent = item.description;


                product_grid.appendChild(item_box);

            });


        } catch (error) {
            console.error('Category item fetch error:', error);
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
    fetchCategory();
    fetchCategoryItem();
    // if (categoryName) {
    //     // Load category-specific content
    //     loadCategoryContent(categoryName);
    // }
});
