function openTaskForm() {
    document.getElementById("taskModal").style.display = "flex";
}

function closeTaskForm() {
    document.getElementById("taskModal").style.display = "none";
}

async function addTask() {
    const name = document.getElementById("taskName").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const status = document.getElementById("taskStatus").value;

    if (name === "") {
        alert("Please enter a task name.");
        return;
    }

    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                description: description,
                status: status
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Unable to add task.");
            return;
        }

        alert("Task added successfully!");

        document.getElementById("taskName").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskStatus").value = "todo";

        closeTaskForm();

        window.location.reload();

    } catch (error) {
        console.error(error);
        alert("Could not connect to the backend.");
    }
}

function searchTasks() {
    const searchValue =
        document.getElementById("searchTask").value.toLowerCase();

    const tasks = document.querySelectorAll(".task-card");

    tasks.forEach(function(task) {
        const taskText = task.innerText.toLowerCase();

        if (taskText.includes(searchValue)) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    });
}

window.onclick = function(event) {
    const modal = document.getElementById("taskModal");

    if (event.target === modal) {
        closeTaskForm();
    }
};