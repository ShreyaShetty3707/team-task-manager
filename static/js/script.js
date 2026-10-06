let editingTaskId = null;


/* Open Add Task Modal */

function openAddModal() {

    editingTaskId = null;

    document.getElementById("modalTitle").innerText =
        "Add New Task";

    document.getElementById("saveButton").innerText =
        "Add Task";

    document.getElementById("editTaskId").value = "";

    document.getElementById("taskName").value = "";

    document.getElementById("taskDescription").value = "";

    document.getElementById("taskStatus").value = "todo";

    document.getElementById("taskModal").style.display = "flex";
}


/* Open Edit Modal */

function openEditModal(id, name, description, status) {

    editingTaskId = id;

    document.getElementById("modalTitle").innerText =
        "Edit Task";

    document.getElementById("saveButton").innerText =
        "Update Task";

    document.getElementById("editTaskId").value = id;

    document.getElementById("taskName").value = name;

    document.getElementById("taskDescription").value =
        description;

    document.getElementById("taskStatus").value =
        status;

    document.getElementById("taskModal").style.display =
        "flex";
}


/* Close Modal */

function closeModal() {

    document.getElementById("taskModal").style.display =
        "none";
}


/* Add or Update Task */

async function saveTask() {

    const name =
        document.getElementById("taskName").value.trim();

    const description =
        document.getElementById("taskDescription").value.trim();

    const status =
        document.getElementById("taskStatus").value;


    if (!name) {

        alert("Please enter a task name.");

        return;
    }


    try {

        let url = "/api/tasks";

        let method = "POST";


        if (editingTaskId !== null) {

            url = `/api/tasks/${editingTaskId}`;

            method = "PUT";
        }


        const response = await fetch(url, {

            method: method,

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

            alert(data.error || "Something went wrong.");

            return;
        }


        closeModal();

        window.location.reload();


    } catch (error) {

        console.error(error);

        alert("Could not connect to the backend.");

    }
}


/* Delete Task */

async function deleteTask(taskId) {

    const confirmation = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmation) {

        return;
    }


    try {

        const response = await fetch(
            `/api/tasks/${taskId}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.error || "Unable to delete task.");

            return;
        }


        window.location.reload();


    } catch (error) {

        console.error(error);

        alert("Could not connect to the backend.");

    }
}


/* Change Status */

async function changeStatus(taskId, status) {

    try {

        const response = await fetch(
            `/api/tasks/${taskId}/status`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })

            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.error || "Unable to update status.");

            return;
        }


        window.location.reload();


    } catch (error) {

        console.error(error);

        alert("Could not connect to the backend.");

    }
}


/* Search */

function searchTasks() {

    const searchValue =
        document.getElementById("searchTask")
        .value
        .toLowerCase();


    const tasks =
        document.querySelectorAll(".task-card");


    tasks.forEach(function(task) {

        const taskText =
            task.innerText.toLowerCase();


        if (taskText.includes(searchValue)) {

            task.style.display = "flex";

        } else {

            task.style.display = "none";

        }

    });
}


/* Close modal when clicking outside */

window.onclick = function(event) {

    const modal =
        document.getElementById("taskModal");


    if (event.target === modal) {

        closeModal();

    }

};