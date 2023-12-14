# Book Management System Backend (Node.js)

Welcome to the Book Management System backend! This system provides an efficient way to manage books and their associated information. It allows two types of users, authors and readers, to interact with the system. Authors can post about their books, while readers can read and leave ratings for the books.

## Table of Contents

- [System Overview](#system-overview)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## System Overview

The Book Management System backend is built using Node.js, a popular JavaScript runtime environment. It utilizes Express.js, a web application framework, to handle HTTP requests and provide the necessary endpoints for book management.

The system allows two types of users:

1. **Authors**: These users can post information about their books. They can provide details such as the book title, author name, genre, publication date, and a brief description.

2. **Readers**: These users can browse through the available books, read their descriptions, and leave ratings for the books they have read. They can also view the average rating for each book.

## Installation

To install and run the Book Management System backend, follow these steps:

1. Ensure you have [Node.js](https://nodejs.org) installed on your system.

2. Clone the repository to your local machine:

   ```shell
   git clone <repository-url>
   ```

3. Navigate to the project directory:

   ```shell
   cd book-management-system-backend
   ```

4. Install the dependencies using npm:

   ```shell
   npm install
   ```

5. Configure the environment variables. Create a `.env` file in the root directory of the project and set the following variables:

   ```dotenv
   PORT=<port-number>
   DATABASE_URL=<database-url>
   ```

   Replace `<port-number>` with the desired port number for the server, and `<database-url>` with the URL for your database.

6. Run the server:

   ```shell
   npm start
   ```

   The server will start running on the specified port.

## Usage

Once the server is up and running, you can use a tool like [Postman](https://www.postman.com) or any HTTP client to interact with the Book Management System backend.

Here are some sample use cases:

- **Authors**
  - Create a new book by sending a POST request to `/api/books` with the required book details in the request body.
  - Update an existing book by sending a PUT request to `/api/books/:id` with the book ID in the URL and the updated book details in the request body.
  - Delete a book by sending a DELETE request to `/api/books/:id` with the book ID in the URL.

- **Readers**
  - Get a list of all books by sending a GET request to `/api/books`.
  - Get details of a specific book by sending a GET request to `/api/books/:id` with the book ID in the URL.
  - Leave a rating for a book by sending a POST request to `/api/books/:id/ratings` with the book ID in the URL and the rating value in the request body.

Feel free to explore the available API endpoints documented below for more information on the available routes and request/response formats.

## API Documentation

### `GET /api/books`

Returns a list of all books.

**Response:**

```json
[
  {
    "id": "1",
    "title": "Book 1",
    "author": "Author 1",
    "genre": "Fiction",
    "publicationDate
