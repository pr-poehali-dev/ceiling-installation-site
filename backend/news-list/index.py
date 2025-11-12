import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Returns list of news from database
    Args: event with httpMethod, queryStringParameters; context with request_id
    Returns: HTTP response with news list
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
    
    database_url = os.environ.get('DATABASE_URL')
    
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing database configuration'})
        }
    
    params = event.get('queryStringParameters') or {}
    limit = int(params.get('limit', '20'))
    offset = int(params.get('offset', '0'))
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    cursor.execute(
        """
        SELECT id, title, description, content, source, url, image_url, 
               published_at, created_at, telegram_posted
        FROM news
        ORDER BY published_at DESC NULLS LAST, created_at DESC
        LIMIT %s OFFSET %s
        """,
        (limit, offset)
    )
    
    rows = cursor.fetchall()
    
    news_list = []
    for row in rows:
        news_list.append({
            'id': row[0],
            'title': row[1],
            'description': row[2],
            'content': row[3],
            'source': row[4],
            'url': row[5],
            'image_url': row[6],
            'published_at': row[7].isoformat() if row[7] else None,
            'created_at': row[8].isoformat() if row[8] else None,
            'telegram_posted': row[9]
        })
    
    cursor.execute("SELECT COUNT(*) FROM news")
    total = cursor.fetchone()[0]
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'news': news_list,
            'total': total,
            'limit': limit,
            'offset': offset
        })
    }
