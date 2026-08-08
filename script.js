const windows = document.getElementById("windows");
const taskButtons = document.getElementById("task-buttons");
const startMenu = document.getElementById("start-menu");

let nextId = 0;
let zIndex = 10;

const apps = {

  computer: {
    icon: "💻",
    title: "Computer",

    html: `
      <div class="toolbar">
        Computer › Local Disk (C:)
      </div>

      <div class="content">

        <div class="card">
          <strong>Folders</strong>
        </div>

        <ul class="file-list">
          <li>📁 Documents</li>
          <li>📁 Downloads</li>
          <li>📁 Pictures</li>
          <li>📁 Music</li>
        </ul>

        <div class="card">
          💾 <strong>Local Disk (C:)</strong>
          <br>
          42.7 GB free
        </div>

      </div>
    `
  },

  notepad: {
    icon: "📄",
    title: "Notepad",

    html: `
      <div class="toolbar">
        File　 Edit　 Format　 View　 Help
      </div>

      <textarea class="notepad" spellcheck="false">Welcome to SkyeOS!

This is your little corner of the internet.

Edit this text and experiment :3</textarea>
    `
  },

  about: {
    icon: "🌐",
    title: "About Me",

    html: `
      <div class="content">

        <h1>Hi, I'm Skye! :3</h1>

        <p>
          Welcome to my weird little website.
        </p>

        <div class="card">
          <strong>About this site</strong>

          <p>
            This is an original Windows 7-inspired
            desktop made with HTML, CSS and JavaScript.
          </p>
        </div>

        <div class="card">
          <strong>Website</strong>

          <p>
            hatsunemikusleftgaytestical.com
          </p>
        </div>

      </div>
    `
  },

  projects: {
    icon: "📁",
    title: "Projects",

    html: `
      <div class="toolbar">
        Projects
      </div>

      <div class="content">

        <ul class="file-list">
          <li>🎮 Gorilla Tag Mods</li>
          <li>💻 Linux / Hyprland</li>
          <li>🧩 Unity Experiments</li>
          <li>🌐 This Website</li>
        </ul>

      </div>
    `
  },

  control: {
    icon: "⚙️",
    title: "Control Panel",

    html: `
      <div class="content">

        <h2>Control Panel</h2>

        <div class="card">
          🎨 Appearance
        </div>

        <div class="card">
          🔊 Sound
        </div>

        <div class="card">
          🌐 Network
        </div>

        <div class="card">
          🖥️ System
        </div>

      </div>
    `
  }

};


function bringToFront(win) {

  win.style.zIndex = ++zIndex;

  document
    .querySelectorAll(".task-button")
    .forEach(button => {
      button.classList.remove("active");
    });

  const task = document.querySelector(
    `[data-window-id="${win.dataset.id}"]`
  );

  if (task) {
    task.classList.add("active");
  }
}


function openApp(appName) {

  const existing = document.querySelector(
    `[data-app="${appName}"]`
  );

  if (existing) {

    existing.classList.remove("minimized");

    bringToFront(existing);

    return;
  }

  const app = apps[appName];

  if (!app) return;

  const id = ++nextId;

  const win = document.createElement("section");

  win.className = "window";

  win.dataset.app = appName;
  win.dataset.id = id;

  win.style.left =
    Math.max(
      10,
      (window.innerWidth - 600) / 2 + id * 10
    ) + "px";

  win.style.top =
    Math.max(
      50,
      (window.innerHeight - 400) / 2 + id * 8
    ) + "px";


  win.innerHTML = `

    <div class="titlebar">

      <span>
        ${app.icon}
      </span>

      <span class="window-title">
        ${app.title}
      </span>

      <div class="window-controls">

        <button class="minimize">
          —
        </button>

        <button class="maximize">
          □
        </button>

        <button class="close">
          ×
        </button>

      </div>

    </div>

    <div class="window-content">
      ${app.html}
    </div>
  `;


  windows.appendChild(win);


  const task = document.createElement("button");

  task.className = "task-button";

  task.dataset.windowId = id;

  task.textContent =
    `${app.icon} ${app.title}`;


  task.onclick = () => {

    if (
      win.classList.contains("minimized")
    ) {
      win.classList.remove("minimized");
    }

    bringToFront(win);
  };


  taskButtons.appendChild(task);


  win
    .querySelector(".minimize")
    .onclick = () => {

      win.classList.add("minimized");

      task.classList.remove("active");
    };


  win
    .querySelector(".maximize")
    .onclick = () => {

      win.classList.toggle("maximized");
    };


  win
    .querySelector(".close")
    .onclick = () => {

      win.remove();
      task.remove();
    };


  makeDraggable(
    win,
    win.querySelector(".titlebar")
  );


  bringToFront(win);
}


function makeDraggable(win, titlebar) {

  let dragging = false;

  let offsetX = 0;
  let offsetY = 0;


  titlebar.addEventListener(
    "pointerdown",
    event => {

      if (
        event.target.closest(".window-controls") ||
        win.classList.contains("maximized")
      ) {
        return;
      }

      dragging = true;

      bringToFront(win);

      const rect =
        win.getBoundingClientRect();

      offsetX =
        event.clientX - rect.left;

      offsetY =
        event.clientY - rect.top;

      titlebar.setPointerCapture(
        event.pointerId
      );
    }
  );


  titlebar.addEventListener(
    "pointermove",
    event => {

      if (!dragging) return;

      const maxX =
        window.innerWidth -
        win.offsetWidth;

      const maxY =
        window.innerHeight -
        42 -
        win.offsetHeight;


      win.style.left =
        Math.max(
          0,
          Math.min(
            maxX,
            event.clientX - offsetX
          )
        ) + "px";


      win.style.top =
        Math.max(
          0,
          Math.min(
            maxY,
            event.clientY - offsetY
          )
        ) + "px";
    }
  );


  titlebar.addEventListener(
    "pointerup",
    () => {
      dragging = false;
    }
  );


  titlebar.addEventListener(
    "dblclick",
    event => {

      if (
        event.target.closest(".window-controls")
      ) {
        return;
      }

      win.classList.toggle("maximized");
    }
  );
}


/* Desktop / Start menu */

document.addEventListener(
  "click",
  event => {

    const opener =
      event.target.closest("[data-open]");

    if (!opener) return;

    openApp(
      opener.dataset.open
    );

    startMenu.classList.add("hidden");
  }
);


document
  .getElementById("start-button")
  .onclick = event => {

    event.stopPropagation();

    startMenu.classList.toggle(
      "hidden"
    );

    if (
      !startMenu.classList.contains(
        "hidden"
      )
    ) {
      document
        .getElementById("start-search")
        .focus();
    }
  };


document.addEventListener(
  "click",
  event => {

    if (
      !startMenu.contains(event.target) &&
      !event.target.closest(
        "#start-button"
      )
    ) {
      startMenu.classList.add(
        "hidden"
      );
    }
  }
);


/* Run */

document
  .getElementById("run-button")
  .onclick = () => {

    startMenu.classList.add(
      "hidden"
    );

    const command =
      prompt("Enter a command:");

    if (command) {
      alert(
        `Run: ${command}`
      );
    }
  };


/* Shutdown */

document
  .getElementById("shutdown-button")
  .onclick = () => {

    startMenu.classList.add(
      "hidden"
    );

    alert(
      "SkyeOS refuses to shut down 😭"
    );
  };


/* Start search */

document
  .getElementById("start-search")
  .addEventListener(
    "input",
    event => {

      const query =
        event.target.value
          .toLowerCase();

      document
        .querySelectorAll(
          ".start-apps button"
        )
        .forEach(button => {

          button.hidden =
            !button.textContent
              .toLowerCase()
              .includes(query);
        });
    }
  );


/* Clock */

function updateClock() {

  document
    .getElementById("clock")
    .textContent =
      new Intl.DateTimeFormat(
        [],
        {
          hour: "numeric",
          minute: "2-digit"
        }
      ).format(new Date());
}

updateClock();

setInterval(
  updateClock,
  1000
);


/* Welcome window */

setTimeout(
  () => openApp("about"),
  300
);
