
document.addEventListener('DOMContentLoaded', () => {
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
    
});
