import json
import os
import psycopg2
from typing import Dict, Any
import urllib.request
import urllib.parse

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Posts news to Telegram channel
    Args: event with httpMethod, body with news_id; context with request_id
    Returns: HTTP response with posting status
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    channel_id = os.environ.get('TELEGRAM_CHANNEL_ID')
    database_url = os.environ.get('DATABASE_URL')
    
    if not bot_token or not channel_id or not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing configuration'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    news_id = body_data.get('news_id')
    
    if not news_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'news_id is required'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT title, description, url, image_url FROM news WHERE id = %s",
        (news_id,)
    )
    
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'News not found'})
        }
    
    title, description, url, image_url = row
    
    message_text = f"📰 <b>{title}</b>\n\n{description or ''}\n\n🔗 <a href=\"{url}\">Читать полностью</a>"
    
    telegram_api_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    
    data = {
        'chat_id': channel_id,
        'text': message_text,
        'parse_mode': 'HTML',
        'disable_web_page_preview': False
    }
    
    encoded_data = urllib.parse.urlencode(data).encode('utf-8')
    req = urllib.request.Request(telegram_api_url, data=encoded_data, method='POST')
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode())
    
    if result.get('ok'):
        cursor.execute(
            "UPDATE news SET telegram_posted = TRUE WHERE id = %s",
            (news_id,)
        )
        conn.commit()
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': result.get('ok', False),
            'message_id': result.get('result', {}).get('message_id') if result.get('ok') else None
        })
    }
