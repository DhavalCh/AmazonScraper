# AmazonScraper

AmazonScraper is a backend script that scrapes product data from Amazon.com.au and stores it in a MySQL database. It includes a simple web dashboard with login functionality to view scraped items.(University Project)

It is a smaller version of project I previously worked on, where I used master/slave controller to simultaneously execute multiple asynchronous requests.
 
---

## Features

- Scrapes product title, price, rating, reviews, and URL
- Saves data into MySQL database
- Secure login system with MD5 hashed passwords
- Web interface using EJS templates
- Organized backend using Node.js + Express

---

## Tech Stack

| Component   | Technology                 |
|------------|-----------------------------|
| Frontend   | EJS, HTML, CSS              |
| Backend    | Node.js, Express.js         |
| Scraper    | Python (requests, BeautifulSoup) |
| Database   | MySQL                       |
| Auth       | Sessions, crypto (MD5)      |

---

## Database Setup

1. Make sure MySQL is installed and running.
2. Execute the SQL files:
   - `amazon_scraper_users.sql`
   - `amazon_scraper_items.sql`

This will create the `amazon_scraper` database and the required tables: `users` and `items`.

---

## Default Login Credentials

| Email            | Password   |
|------------------|------------|
| dhaval@gmail.com | 12345678   |

> Note: Password is hashed using MD5 with a secret key.

---

## How to Run

1. Clone the Repository
git clone https://github.com/yourusername/AmazonScraper.git
cd AmazonScraper

2. Install Node.js Dependencies
npm install

3. Start Node.js Server
node app.js

4. Run Python Scraper
Install Python dependencies:
pip install requests beautifulsoup4 mysql-connector-python

Then run:
python script_Scrape.py

This will scrape Amazon and save products to the items table.

## Disclaimer
This project is for educational purposes only. Web scraping Amazon may violate their terms of service.
