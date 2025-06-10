# -*- coding: utf-8 -*-
import requests
import json
from bs4 import BeautifulSoup
from time import sleep
import re
from mysql.connector import connect, Error




try:
    cnx = connect(
        host="localhost",
        user="root",
        password="123",
        database="amazon_scraper"
    )
    cursor = cnx.cursor()
except Error as e:
    print(e)

HEADERS = ({'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
            'Accept-Language': 'en-US, en;q=0.5'})

urls = ['https://www.amazon.com.au/s?bbn=8415198051&rh=n%3A4851626051',
       'https://www.amazon.com.au/s?bbn=8415198051&rh=n%3A4851799051',
       'https://www.amazon.com.au/s?bbn=8415198051&rh=n%3A4852150051',
       'https://www.amazon.com.au/s?bbn=8415198051&rh=n%3A4852264051',
       'https://www.amazon.com.au/s?bbn=8415198051&rh=n%3A4851683051',
       'https://www.amazon.com.au/s?bbn=8415198051&rh=n%3A4852445051',
       'https://www.amazon.com.au/s?bbn=8415198051&rh=n%3A4851856051',
       'https://www.amazon.com.au/s?bbn=8415198051&rh=n%3A4852617051',
       'https://www.amazon.com.au/s?bbn=8415198051&rh=n%3A4852675051']
#"https://www.amazon.com.au/s?bbn=8415198051&rh=n%3A4851626051"

'''html = requests.get(url,headers=HEADERS)
soup = BeautifulSoup(html.text)
title = soup.find('span', {'class':"a-size-base-plus"}).text.strip()
print(title)
'''

def scrape_product_details(url):
    #sleep(20)
    resp = requests.get(url, headers=HEADERS)
    content = BeautifulSoup(resp.content, 'lxml')
    
    item_details = []
    for item in content.select('div.s-result-item[data-component-type=s-search-result]'):      
        
        title = item.select('.a-size-base-plus')[0].get_text().strip()
        
        price = item.select('div.a-section span.a-color-base')[1].get_text().strip()
        if "$" and "." in price:
            price = re.findall("\d+\.\d+",price)
        else:
            price = ['']

        rating = item.select('div.a-row .a-declarative span.a-icon-alt')
        if len(rating) > 0:
            rating = rating[0].get_text().strip()
        else:
            rating = ''

        reviews = item.select('span.a-size-base.s-underline-text')
        if len(reviews) > 0:
            reviews = reviews[0].get_text().strip()
        else:
                reviews = 0
        
        href = item.select('h2.a-size-mini a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal')[0].get("href")
        
        try: 
            data = [title,price[0],rating,reviews,"https://www.amazon.in"+href]
            '''data = {
                "item": title,
                "price": price[0],
                "rating": rating,
                "reviews": reviews,
                "url":"https://www.amazon.in"+href
            }'''
            #print("--------------------------------")
            #print(data)
        except IndexError:
            continue       
        item_details.append(data)
    return item_details

def scraper():
#    item_details = [];
    for  url in urls:
        insert_into_db((scrape_product_details(url)))
#        item_details.append(scrape_product_details(url))

def insert_into_db(category):
    print(category)
#    cat = json.loads(json.dumps(category))
    insert_items_query = "INSERT INTO items (Item_Title, Item_Price, Item_Rating, Item_Review, Item_URL) VALUES ( %s, %s, %s, %s, %s ) "

    for item in category:
        data = [item[0], item[1], item[2], item[3], item[4]]
#        data = [item[0].split("kkkkkkkkkkkk"), item[1].split("kkkkkkkkkkkk"), item[2].split("kkkkkkkkkkkk"), item[3].split("kkkkkkkkkkkk"), item[4].split("kkkkkkkkkkkk")]
#        data = [item["item"], item["price"], item["rating"], item["reviews"], item["url"]]
#        print(type(item["item"]))
#        cursor.executemany(insert_items_query, (data[0],data[1],data[2],data[3],data[4]))
    cnx.commit()

scraper()