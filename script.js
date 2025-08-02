document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const categoryLinks = document.querySelectorAll('.category-link'); 
    const contentSections = document.querySelectorAll('.content-section');

    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    const topRatedContainer = document.getElementById('top-rated-container');
    const dynamicContentSection = document.getElementById('dynamic-content-section');

    
    const showSection = (sectionId) => {
        contentSections.forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');
       
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

   
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = event.target.dataset.section; 
            const categoryQuery = event.target.dataset.category; 

            if (sectionId) {
                showSection(sectionId);
            } else if (categoryQuery) {
                fetchAndRenderDynamicContent(categoryQuery, event.target.textContent);
            }
        });
    });

   
    const renderBooks = (books, container) => {
        let booksHtml = '';
        books.forEach(book => {
            const volumeInfo = book.volumeInfo;
            const title = volumeInfo.title || "Untitled";
            const thumbnail = (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) || 'https://via.placeholder.com/150x200.png?text=No+Cover';
            const rating = Math.floor(Math.random() * 5) + 1;

            booksHtml += `
                <div class="books-card">
                    <img src="${thumbnail}" alt="${title} cover">
                    <p class="book-title">${title}</p>
                    <div class="star-rating">
                        ${`<i class="fas fa-star"></i>`.repeat(rating)}
                    </div>
                </div>
            `;
        });
        container.innerHTML = booksHtml;
    };
    
    const fetchAndRenderDynamicContent = async (query, title) => {
        showSection('dynamic-content-section');
        dynamicContentSection.innerHTML = `<h2>${title}</h2><div class="books-grid" id="books-grid-container"><p>Loading books...</p></div>`;
        const gridContainer = document.getElementById('books-grid-container');
        try {
            const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40&langRestrict=en`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.items) {
                renderBooks(data.items, gridContainer);
            } else {
                gridContainer.innerHTML = `<p>No books found for "${title}".</p>`;
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            gridContainer.innerHTML = `<p>Error loading books. Please try again later.</p>`;
        }
    };

   
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value;
        if (query.trim()) {
            fetchAndRenderDynamicContent(query, `Search Results for "${query}"`);
        }
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchBtn.click();
        }
    });

    
    const init = () => {
        const topRatedBooksQuery = 'top+rated+novels';
        const topRatedUrl = `https://www.googleapis.com/books/v1/volumes?q=${topRatedBooksQuery}&maxResults=3&langRestrict=en`;
        fetch(topRatedUrl)
            .then(response => response.json())
            .then(data => {
                if (data.items) {
                    renderBooks(data.items, topRatedContainer);
                } else {
                    topRatedContainer.innerHTML = `<p>No books found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching top rated books:", error);
                topRatedContainer.innerHTML = `<p>Error loading top rated books.</p>`;
            });

        showSection('home-section'); 
    };
    init();

    const buyForm = document.getElementById('buy-form');
    buyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Order placed successfully! We will contact you soon for confirmation.');
        buyForm.reset();
    });

    const sellForm = document.getElementById('sell-form');
    sellForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Book listed for sale! Our team will contact you for verification and pickup.');
        sellForm.reset();
    });
});