document.addEventListener('DOMContentLoaded', () => {
    const category_list= document.getElementsByClassName('category_select');
    const category_template= document.getElementById('category_template');
    async function fetchCategory() {
        try {
            const response = await fetch(`http://localhost:3000/api/category`);
            const category = await response.json();

            

            for (let i = 0; i < category_list.length; i++) {
              category.forEach((category, index) => {

                // console.log(category);
                const categoryElement = category_template.content.cloneNode(true);
                const category_row = categoryElement.querySelector('.category_row');
                category_row.textContent = category.name;
                category_row.value = category.name;
  
  
                category_list[i].appendChild(categoryElement);
                  
              });


            }

              
            
          } catch (error) {
            console.error('Category fetch error:', error);
      }
      
    
    }
    fetchCategory();



});