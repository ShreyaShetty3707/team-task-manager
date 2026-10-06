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
            status TEXT NOT NULL DEFAULT 'todo'
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


# Add task
@app.route("/api/tasks", methods=["POST"])
def add_task():

    data = request.get_json()

    name = data.get("name", "").strip()
    description = data.get("description", "").strip()
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


# Update task
@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):

    data = request.get_json()

    name = data.get("name", "").strip()
    description = data.get("description", "").strip()
    status = data.get("status", "todo")

    if not name:
        return jsonify({"error": "Task name is required"}), 400

    connection = get_db_connection()

    cursor = connection.execute(
        """
        UPDATE tasks
        SET name = ?, description = ?, status = ?
        WHERE id = ?
        """,
        (name, description, status, task_id)
    )

    connection.commit()

    connection.close()

    if cursor.rowcount == 0:
        return jsonify({"error": "Task not found"}), 404

    return jsonify({
        "message": "Task updated successfully"
    })


# Delete task
@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    connection = get_db_connection()

    cursor = connection.execute(
        "DELETE FROM tasks WHERE id = ?",
        (task_id,)
    )

    connection.commit()

    connection.close()

    if cursor.rowcount == 0:
        return jsonify({"error": "Task not found"}), 404

    return jsonify({
        "message": "Task deleted successfully"
    })


# Update only task status
@app.route("/api/tasks/<int:task_id>/status", methods=["PUT"])
def update_status(task_id):

    data = request.get_json()

    status = data.get("status")

    if status not in ["todo", "progress", "completed"]:
        return jsonify({"error": "Invalid status"}), 400

    connection = get_db_connection()

    cursor = connection.execute(
        """
        UPDATE tasks
        SET status = ?
        WHERE id = ?
        """,
        (status, task_id)
    )

    connection.commit()

    connection.close()

    if cursor.rowcount == 0:
        return jsonify({"error": "Task not found"}), 404

    return jsonify({
        "message": "Status updated successfully"
    })


if __name__ == "__main__":
    create_database()
    app.run(debug=True)