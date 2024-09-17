// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  getDocs,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXSJ3iTN8qTC5JFwZ2UWLqa_zdE9FpCag",
  authDomain: "blog-website-5853a.firebaseapp.com",
  projectId: "blog-website-5853a",
  storageBucket: "blog-website-5853a.appspot.com",
  messagingSenderId: "360412752729",
  appId: "1:360412752729:web:51e89c61872f28bc4cfa48",
  measurementId: "G-BLMPHBZYXW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define the addTask function
window.addTask = async function () {
  const newTaskInput = document.getElementById("new-task");
  const taskName = newTaskInput.value.trim();
  if (!taskName) {
    console.warn("Task name cannot be empty.");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      name: taskName,
      timestamp: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);

    // Add task to the UI
    addTaskToUI(docRef.id, taskName);

    // Clear the input field
    newTaskInput.value = "";
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Define the loadTasks function
async function loadTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Clear the existing tasks

  try {
    const q = query(collection(db, "tasks"), orderBy("timestamp"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const taskData = doc.data();
      addTaskToUI(doc.id, taskData.name);
    });
  } catch (e) {
    console.error("Error loading tasks: ", e);
  }
}

// Function to add a task to the UI
function addTaskToUI(taskId, taskName) {
  const taskList = document.getElementById("task-list");
  const li = document.createElement("li");
  li.className =
    "flex items-center justify-between p-2 border-b border-gray-200";
  li.id = taskId; // Assign the Firestore document ID to the list item
  li.innerHTML = `
        <span class="text-gray-700">${taskName}</span>
        <button class="text-red-500 hover:text-red-700" onclick="deleteTask('${taskId}')">Delete</button>
    `;
  taskList.appendChild(li);
}

// Define the deleteTask function
window.deleteTask = async function (taskId) {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    console.log("Document successfully deleted!");

    // Remove the task from the UI
    const taskElement = document.getElementById(taskId);
    if (taskElement) {
      taskElement.remove();
    }
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

// Call loadTasks when the page loads
window.onload = loadTasks;
