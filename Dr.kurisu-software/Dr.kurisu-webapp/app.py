from flask import Flask, request, jsonify, render_template
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

# PostgreSQLのデータベースに接続する関数
def get_db_connection():
    return psycopg2.connect(
        host="****",
        database="****",
        user="****",
        password="****"
    )

# ホーム画面エンドポイント
@app.route('/')
def home():
    return render_template('home.html')

# 時間設定画面エンドポイント
@app.route('/settings')
def settings():
    return render_template('settings.html')

# 履歴確認画面エンドポイント
@app.route('/history')
def history():
    return render_template('history.html')

# 履歴データの取得エンドポイント
@app.route('/get_history')
def get_history():
    date = request.args.get('date')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    if date:
        # 指定された日付のデータを取得
        query = """
        SELECT to_char(date_column, 'YYYY-MM-DD') AS date, 
               to_char(time_column, 'HH24:MI') AS time, 
               period, 
               status 
        FROM ****
        WHERE to_char(date_column, 'YYYY-MM-DD') = %s
        ORDER BY date_column DESC, time_column DESC
        """
        cur.execute(query, (date,))
    else:
        # 全履歴データを取得
        query = """
        SELECT to_char(date_column, 'YYYY-MM-DD') AS date, 
               to_char(time_column, 'HH24:MI') AS time, 
               period, 
               status 
        FROM ****
        ORDER BY date_column DESC, time_column DESC
        """
        cur.execute(query)

    records = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(records)

# 時間設定の取得エンドポイント
@app.route('/get_settings')
def get_settings():
    day = request.args.get('day')
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    query = """
    SELECT period, hour, minute, medicine
    FROM ****
    WHERE day = %s
    """
    cur.execute(query, (day,))
    records = cur.fetchall()

    time_settings = {record['period']: {
        'hour': record['hour'], 'minute': record['minute'], 'medicine': record['medicine']
    } for record in records}

    cur.close()
    conn.close()
    return jsonify({'timeSettings': time_settings})

# 時間設定の保存エンドポイント
@app.route('/save_settings', methods=['POST'])
def save_settings():
    data = request.json
    day = data.get('day')
    time_settings = data.get('timeSettings')

    conn = get_db_connection()
    cur = conn.cursor()

    for period, values in time_settings.items():
        hour = values['hour']
        minute = values['minute']
        medicine = values['medicine']

        query = """
        INSERT INTO **** (day, period, hour, minute, medicine)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (day, period) DO UPDATE
        SET hour = EXCLUDED.hour, minute = EXCLUDED.minute, medicine = EXCLUDED.medicine;
        """
        cur.execute(query, (day, period, hour, minute, medicine))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "success"}), 200

if __name__ == '__main__':
    app.run(host='****', port=****, debug=True)
