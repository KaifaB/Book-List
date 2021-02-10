// Book Constructor
function Book(title, author, ISBN) {
    this.title = title;
    this.author = author;
    this.isbn = ISBN;
}


//UI Constructor
function UI() {}

//Add book to list
UI.prototype.addBookToList = function(book){
    const list = document.getElementById('book-list');
    //create tr element to append table
    const row = document.createElement('tr');
    //Inser collumn
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
}

//Show Alert
UI.prototype.showAlert = (message, className) => {
    const div = document.createElement('div');
    //add classes
    div.className = `alert ${className}`;
    //Add text
    div.appendChild(document.createTextNode(message));
    //get parent
    const container = document.querySelector('.container');

    const form = document.querySelector('#book-form');
    //insert alert
    container.insertBefore(div, form);

    //Timeout after 3 seconds
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}

//Clear Fields
UI.prototype.clearFields = () => {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
}

UI.prototype.deleteBook = (target) => {
    if(target.className === 'delete') {
        target.parentElement.parentElement.remove();
    }
}

//Local stoeage class
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') == null) {
            books = [];
        }else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books
    }
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI;

        //Add book to UI
        ui.addBookToList(book);
        })
    }
    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        console.log(isbn);
        const books = Store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Dom load event 
document.addEventListener('DOMContentLoaded', Store.displayBooks)
// Add Book Event Listener
document.getElementById('book-form').addEventListener('submit',
 function(e){
     //Get form values
    const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

    const book = new Book(title, author, isbn);

    ///instantiate a new book object
    const ui = new UI();

    //Validate
    if(title === '' || author === '' || isbn === ''){
        ui.showAlert('Please fill in all fields...', 'error')
    }else {
        //add book to list
        ui.addBookToList(book);

        //add book to ls
        Store.addBook(book);

        //show success
        ui.showAlert('Book added!!', 'success');

        //Clear fields
        ui.clearFields();
    }
    e.preventDefault();
});

//Delete Event Listener
document.getElementById('book-list').addEventListener('click', (e) => {
    
    const ui = new UI();

    ui.deleteBook(e.target);

    //Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    ui.showAlert('Book removed!!', 'success');
    e.preventDefault();
})