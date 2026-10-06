from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

DATABASE = "tasks.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_database():
    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


@app.route("/")
def home():
    connection = get_db_connection()
    tasks = connection.execute(
        "SELECT * FROM tasks ORDER BY id DESC"
    ).fetchall()
    connection.close()

    return render_template("index.html", tasks=tasks)


@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.get_json()

    name = data.get("name")
    description = data.get("description", "")
    status = data.get("status", "todo")

    if not name:
        return jsonify({"error": "Task name is required"}), 400

    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO tasks (name, description, status)
        VALUES (?, ?, ?)
        """,
        (name, description, status)
    )

    connection.commit()

    task_id = cursor.lastrowid

    connection.close()

    return jsonify({
        "id": task_id,
        "name": name,
        "description": description,
        "status": status
    }), 201


if __name__ == "__main__":
    create_database()
    app.run(debug=True)