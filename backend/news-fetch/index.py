import json
import os
import psycopg2
from datetime import datetime
from typing import Dict, Any
import urllib.request
import urllib.parse

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Fetches news from NewsAPI and stores them in database
    Args: event with httpMethod, queryStringParameters; context with request_id
    Returns: HTTP response with fetched news count
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    news_api_key = os.environ.get('NEWS_API_KEY')
    database_url = os.environ.get('DATABASE_URL')
    
    if not news_api_key or not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing configuration'})
        }
    
    params = event.get('queryStringParameters') or {}
    category = params.get('category', 'general')
    country = params.get('country', 'ru')
    
    api_url = f'https://newsapi.org/v2/top-headlines?country={country}&category={category}&apiKey={news_api_key}&pageSize=20'
    
    req = urllib.request.Request(api_url)
    req.add_header('User-Agent', 'Mozilla/5.0')
    
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
    
    if data.get('status') != 'ok':
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Failed to fetch news'})
        }
    
    articles = data.get('articles', [])
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    inserted_count = 0
    
    for article in articles:
        title = article.get('title', '')[:500]
        description = article.get('description', '')
        content = article.get('content', '')
        source = article.get('source', {}).get('name', '')[:200]
        url = article.get('url', '')[:1000]
        image_url = article.get('urlToImage', '')[:1000]
        published_at = article.get('publishedAt', '')
        
        if not title or not url:
            continue
        
        if published_at:
            published_at = published_at.replace('Z', '+00:00')
        
        cursor.execute(
            """
            INSERT INTO news (title, description, content, source, url, image_url, published_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (url) DO NOTHING
            RETURNING id
            """,
            (title, description, content, source, url, image_url, published_at)
        )
        
        if cursor.fetchone():
            inserted_count += 1
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'total': len(articles),
            'inserted': inserted_count,
            'category': category
        })
    }
