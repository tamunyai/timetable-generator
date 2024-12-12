let lecturerCounter = 0;
let programmeCounter = 0;
let moduleCounter = 0;

function addLecturer() {
  const lecturersList = document.getElementById("lecturers-list");

  const lecturerDiv = document.createElement("div");
  lecturerDiv.id = `lecturer-${lecturerCounter}`;
  lecturerDiv.innerHTML = `
        <div class="lecture-row">
            <input type="text" name="lecturer-name" placeholder="Lecturer Name" required>
            <button onclick="removeLecturer(this)" class="remove-button">Remove</button>
        </div>
    `;

  lecturersList.appendChild(lecturerDiv);
  lecturerCounter++;
}

function removeLecturer(button) {
  const parentElement = button.parentElement.parentElement;
  const parentNode = parentElement.parentNode;

  if (parentNode.children.length > 1) {
    parentElement.remove();
  }
}

function addProgramme() {
  const programmesList = document.getElementById("programmes-list");

  const programmeDiv = document.createElement("div");
  programmeDiv.id = `programme-${programmeCounter}`;
  programmeDiv.className = "section";
  programmeDiv.innerHTML = `
        <div>
            <input type="text" name="programme-name" placeholder="Programme Name" id="programme-name-${programmeCounter}" required>
            <button onclick="removeProgramme(${programmeCounter})" class="remove-button">Remove Programme</button>
        </div>
        <div id="modules-container-${programmeCounter}">
            <!-- Modules will be added here -->
        </div>
        <button onclick="addModule(${programmeCounter})" class="add-button">Add Module</button>
    `;

  programmesList.appendChild(programmeDiv);

  // Automatically add first module
  addModule(programmeCounter);
  programmeCounter++;
}

function removeProgramme(programmeId) {
  const programmeElement = document.getElementById(`programme-${programmeId}`);
  const parentNode = programmeElement.parentNode;

  if (parentNode.children.length > 1) {
    programmeElement.remove();
  }
}

function addModule(programmeId) {
  const modulesContainer = document.getElementById(
    `modules-container-${programmeId}`,
  );

  const moduleDiv = document.createElement("div");
  moduleDiv.id = `module-${moduleCounter}`;
  moduleDiv.className = "module-row";
  moduleDiv.innerHTML = `
        <input type="text" name="module-name-${programmeId}" placeholder="Module Name" required>
        <select name="module-units-${programmeId}">
            <option value="2">2 Units</option>
            <option value="3">3 Units</option>
            <option value="4">4 Units</option>
        </select>
        <select name="module-year-${programmeId}">
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
        </select>
        <button onclick="removeModule(this)" class="remove-button">Remove</button>
    `;

  modulesContainer.appendChild(moduleDiv);
  moduleCounter++;
}

function removeModule(button) {
  const parentElement = button.parentElement;
  const parentNode = parentElement.parentNode;

  if (parentNode.children.length > 1) {
    parentElement.remove();
  }
}

addLecturer();
addProgramme();
