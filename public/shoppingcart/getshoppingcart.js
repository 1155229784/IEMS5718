


fetch("/public/shoppingcart/shoppingcart.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector(".cartpanel").innerHTML = data;

    // Dynamically add the CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/shoppingcart/shoppingcart.css';
    document.head.appendChild(link);

    // Dynamically add the JavaScript
    const script = document.createElement('script');
    script.src = '/shoppingcart/shoppingcart.js';
    document.head.appendChild(script);
  })
  .catch(error => {
    console.error("Error loading shopping cart:", error);  
    // document.head.appendChild(script);
  });
