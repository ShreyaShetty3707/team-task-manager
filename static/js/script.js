function openTaskForm() {
    document.getElementById("taskModal").style.display = "flex";
}

function closeTaskForm() {
    document.getElementById("taskModal").style.display = "none";
}

function addTask() {
    const name = document.getElementById("taskName").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const status = document.getElementById("taskStatus").value;

    if (name === "") {
        alert("Please enter a task name.");
        return;
    }

    let statusText = "To Do";

    if (status === "progress") {
        statusText = "In Progress";
    } else if (status === "completed") {
        statusText = "Completed";
    }

    const taskList = document.getElementById("taskList");

    const task = document.createElement("div");
    task.className = "task-card";

    task.innerHTML = `
        <div>
            <h3>${name}</h3>
            <p>${description || "No description provided."}</p>
        </div>
        <span class="status ${status}">${statusText}</span>
    `;

    taskList.appendChild(task);

    document.getElementById("taskName").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskStatus").value = "todo";

    closeTaskForm();

    updateTaskCount();
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

function updateTaskCount() {
    const tasks = document.querySelectorAll(".task-card");

    let todo = 0;
    let progress = 0;
    let completed = 0;

    tasks.forEach(function(task) {
        const status = task.querySelector(".status");

        if (status.classList.contains("todo")) {
            todo++;
        }

        if (status.classList.contains("progress")) {
            progress++;
        }

        if (status.classList.contains("completed")) {
            completed++;
        }
    });

    document.getElementById("totalTasks").innerText = tasks.length;
    document.getElementById("todoTasks").innerText = todo;
    document.getElementById("progressTasks").innerText = progress;
    document.getElementById("completedTasks").innerText = completed;
}

window.onclick = function(event) {
    const modal = document.getElementById("taskModal");

    if (event.target === modal) {
        closeTaskForm();
    }
};

updateTaskCount();