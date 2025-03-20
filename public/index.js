
// pool.getConnection(function(err, connection) {
//     if (err) 
//         {
//           connection.release();
//           throw err;
//         }
//         else
//         {
//             connection.query( 'SELECT * FROM categories', function(err, rows) {
//                 console.log(rows);
//                 connection.release();
//             });
//         }
// });


document.addEventListener('DOMContentLoaded', () => {
    const categoryTemplate = document.getElementById('categoryTemplate');
    const category_bar = document.getElementsByClassName('category_bar')[0];
    // console.log(category_bar);
    
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
    async function fetchCategories() {
      try {
        const response = await fetch('http://localhost:3000/api/category');
        const categories = await response.json();
        console.log(categories);
        categories.forEach((category, index) => {
          // Clone the template
          const categoryElement = categoryTemplate.content.cloneNode(true);
                      
          // Set category details
          const categoryItem = categoryElement.querySelector('.category_box');
          const categoryName = categoryElement.querySelector('.category_name');
          const category_link = categoryElement.querySelector('.category_link');

          categoryItem.dataset.categoryId = category.catid;
          categoryName.textContent = category.name;
          category_link.href = `/category/${category.name}`; 

          // console.log(categoryItem);
          // Append to category bar
          category_bar.appendChild(categoryItem);
        });

      } catch (error) {
        console.error('Categories fetch error:', error);
      }

    }
    fetchLoginStatus();
    fetchCategories();
    
});

    // pool.getConnection(function(err, connection) {
//         if (err) 
//             {
//               connection.release();
//               throw err;
//             }
//             else
//             {
//                 connection.query( 'SELECT * FROM categories', function(err, rows) {
//                     // rows.forEach((category, index)) => {
//                     //     const categoryElement = categoryTemplate.content.cloneNode(true);

//                     // });
//                     rows.forEach((category, index) => {
//                         console.log(category);
//                         // Clone the template
//                         const categoryElement = categoryTemplate.content.cloneNode(true);

//                         const categoryItem = categoryElement.querySelector('.category_box');
//                         const categoryName = categoryElement.querySelector('.category_name');
//                         categoryItem.dataset.categoryId = category.catid;
//                         categoryName.textContent = category.name;
//                         // Append to category bar
//                         category_bar.appendChild(categoryItem);
//                     });
                    
//                 });
//                 connection.release();
//             }
//     });

// });