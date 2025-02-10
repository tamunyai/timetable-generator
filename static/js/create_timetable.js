/**
 * Counter for the number of lecturers added.
 * @type {number}
 */
let lecturerCounter = 0;

/**
 * Counter for the number of programmes added.
 * @type {number}
 */
let programmeCounter = 0;

/**
 * Counter for the number of modules added.
 * @type {number}
 */
let moduleCounter = 0;

/**
 * Adds a new lecturer input field to the "lecturers-list" container.
 */
function addLecturer() {
  const lecturersList = document.getElementById("lecturers-list");

  const lecturerDiv = document.createElement("div");
  lecturerDiv.id = `lecturer-${lecturerCounter}`;
  lecturerDiv.innerHTML = `
        <div class="lecturer__item">
            <input type="text" name="lecturer-name" placeholder="Lecturer Name" class="lecturer__name" required>
            <button onclick="removeLecturer(this)" class="lecturer__button-remove">Remove</button>
        </div>
    `;

  lecturersList.appendChild(lecturerDiv);
  lecturerCounter++;
}

/**
 * Removes a lecturer input field.
 * @param {HTMLButtonElement} button - The button element clicked to trigger the removal.
 */
function removeLecturer(button) {
  const parentElement = button.parentElement.parentElement;
  const parentNode = parentElement.parentNode;

  if (parentNode.children.length > 1) {
    parentElement.remove();
  }
}

/**
 * Adds a new programme section to the "programmes-list" container.
 */
function addProgramme() {
  const programmesList = document.getElementById("programmes-list");

  const programmeDiv = document.createElement("div");
  programmeDiv.id = `programme-${programmeCounter}`;
  programmeDiv.className = "section";
  programmeDiv.innerHTML = `
        <div class="programme__item">
            <input type="text" name="programme-name" placeholder="Programme Name" id="programme-name-${programmeCounter}" class="programme__name" required>
            <button onclick="removeProgramme(${programmeCounter})" class="programme__button-remove">Remove Programme</button>
        </div>
        <div class="modules__container" id="modules-container-${programmeCounter}">
            <!-- Modules will be added here -->
        </div>
        <button onclick="addModule(${programmeCounter})" class="module__button-add">Add Module</button>
    `;

  programmesList.appendChild(programmeDiv);

  // Automatically add first module
  addModule(programmeCounter);
  programmeCounter++;
}

/**
 * Removes a programme section.
 * @param {number} programmeId - The ID of the programme to remove.
 */
function removeProgramme(programmeId) {
  const programmeElement = document.getElementById(`programme-${programmeId}`);
  const parentNode = programmeElement.parentNode;

  if (parentNode.children.length > 1) {
    programmeElement.remove();
  }
}

/**
 * Adds a new module input field to a specific programme.
 * @param {number} programmeId - The ID of the programme to which the module will be added.
 */
function addModule(programmeId) {
  const modulesContainer = document.getElementById(
    `modules-container-${programmeId}`,
  );

  const moduleDiv = document.createElement("div");
  moduleDiv.id = `module-${moduleCounter}`;
  moduleDiv.className = "module__item";
  moduleDiv.innerHTML = `
        <input type="text" name="module-name-${programmeId}" placeholder="Module Name" class="module__name" required>
        <select name="module-units-${programmeId}" class="module__units">
            <option value="2">2 Units</option>
            <option value="3">3 Units</option>
            <option value="4">4 Units</option>
        </select>
        <select name="module-year-${programmeId}" class="module__year">
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
        </select>
        <button onclick="removeModule(this)" class="module__button-remove">Remove</button>
    `;

  modulesContainer.appendChild(moduleDiv);
  moduleCounter++;
}

/**
 * Removes a module input field.
 * @param {HTMLButtonElement} button - The button element clicked to trigger the removal.
 */
function removeModule(button) {
  const parentElement = button.parentElement;
  const parentNode = parentElement.parentNode;

  if (parentNode.children.length > 1) {
    parentElement.remove();
  }
}

// Initialize with one lecturer and one programme
addLecturer();
addProgramme();
