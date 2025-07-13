

// Builder State
const builderState = {
  elements: [],
  selectedElement: null,
  clipboard: null,
  history: [],
  historyIndex: -1,
  hasTheme: false,
  currentTheme: null
};

// Utility Functions
function createCanvasElement(type) {
  const el = document.createElement('div');


  el.dataset.elementId = 'element-' + Date.now();
  el.setAttribute('draggable', 'true');
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('dragged-id', el.dataset.elementId);
  });


  el.classList.add('canvas-element');
  el.dataset.type = type;
  el.style.position = 'relative';
  el.style.margin = '10px';
  el.style.padding = '10px';
  el.style.border = '1px solid #ccc';
  el.style.borderRadius = '4px';
  el.style.background = '#fafafa';
  el.style.minWidth = '100px';
  el.style.minHeight = '30px';
  // el.style.cursor = 'pointer';
  el.classList.add('draggable-widget');


  switch (type) {
    case 'text':
      el.textContent = 'Sample text';
      el.contentEditable = 'true';
      break;
    case 'heading':
      el.textContent = 'Sample Heading';
      el.style.fontWeight = 'bold';
      el.style.fontSize = '1.5em';
      el.contentEditable = 'true';
      break;
    case 'button':
      const btn = document.createElement('button');
      btn.textContent = 'Click Me';
      btn.style.padding = '8px 16px';
      btn.style.border = 'none';
      btn.style.borderRadius = '4px';
      btn.style.background = 'var(--primary)';
      btn.style.color = 'white';
      btn.style.cursor = 'pointer';
      el.appendChild(btn);
      break;
    case 'image':
      const img = document.createElement('img');
      img.src = 'https://via.placeholder.com/150';
      img.alt = 'Upload Image';
      img.style.maxWidth = '100%';
      img.style.borderRadius = '4px';
      img.style.cursor = 'pointer';
      el.appendChild(img);

      // Create a hidden file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';

      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            img.src = reader.result;
          };
          reader.readAsDataURL(file);
        }
      });

      // When image is clicked, trigger the file picker
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });

      el.appendChild(fileInput);
      break;

    case 'section':
      el.style.border = '2px dashed var(--primary)';
      el.style.minHeight = '150px';
      el.textContent = 'Section';
      break;
    case 'container':
      el.style.border = '2px solid #28a745';
      el.style.minHeight = '100px';
      el.textContent = 'Container';
      break;
    case 'grid':
      el.style.display = 'grid';
      el.style.gridTemplateColumns = 'repeat(3, 1fr)';
      el.style.gap = '10px';
      el.style.minHeight = '100px';
      for (let i = 0; i < 3; i++) {
        const gridItem = document.createElement('div');
        gridItem.style.background = '#e9ecef';
        gridItem.style.borderRadius = '4px';
        gridItem.style.height = '80px';
        el.appendChild(gridItem);
      }
      break;
    case 'gallery':
      el.style.display = 'flex';
      el.style.gap = '10px';
      el.style.minHeight = '100px';
      for (let i = 0; i < 4; i++) {
        const galleryImg = document.createElement('img');
        galleryImg.src = 'https://via.placeholder.com/80';
        galleryImg.alt = 'Gallery Image';
        galleryImg.style.borderRadius = '4px';
        el.appendChild(galleryImg);
      }
      break;
    default:
      el.textContent = 'Unknown Element';
  }

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    selectElement(el);
  });

  return el;
}

function selectElement(element) {
  if (builderState.selectedElement) {
    builderState.selectedElement.classList.remove('selected');
  }
  builderState.selectedElement = element;
  element.classList.add('selected');
  // updatePropertiesPanel(element);
  addFloatingMenu(element);
}



// function updatePropertiesPanel(el) {
//   const panel = document.querySelector('.properties-content');
//   panel.innerHTML = '';

//   if (!el) {
//     panel.innerHTML = `
//       <div class="no-selection">
//         <i class="fas fa-mouse-pointer"></i>
//         <p>No element selected</p>
//       </div>`;
//     return;
//   }

//   // TEXT
//   if (el.innerText && el.contentEditable === "true") {
//     const textInput = document.createElement('input');
//     textInput.value = el.innerText;
//     textInput.className = 'form-control';
//     textInput.oninput = () => {
//       el.innerText = textInput.value;
//     };
//     panel.appendChild(labelledGroup('Text', textInput));
//   }

//   // TEXT COLOR
//   const colorInput = document.createElement('input');
//   colorInput.type = 'color';
//   colorInput.value = rgbToHex(getComputedStyle(el).color);
//   colorInput.oninput = () => {
//     el.style.color = colorInput.value;
//   };
//   panel.appendChild(labelledGroup('Text Color', colorInput));

//   // BACKGROUND COLOR
//   const bgInput = document.createElement('input');
//   bgInput.type = 'color';
//   bgInput.value = rgbToHex(getComputedStyle(el).backgroundColor);
//   bgInput.oninput = () => {
//     el.style.backgroundColor = bgInput.value;
//   };
//   panel.appendChild(labelledGroup('Background Color', bgInput));

//   // FONT SIZE
//   const fontSizeInput = document.createElement('input');
//   fontSizeInput.type = 'number';
//   fontSizeInput.min = 8;
//   fontSizeInput.max = 100;
//   fontSizeInput.value = parseInt(getComputedStyle(el).fontSize);
//   fontSizeInput.className = 'form-control';
//   fontSizeInput.oninput = () => {
//     el.style.fontSize = fontSizeInput.value + 'px';
//   };
//   panel.appendChild(labelledGroup('Font Size (px)', fontSizeInput));
// }

function labelledGroup(labelText, inputEl) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-group';

  const label = document.createElement('label');
  label.innerText = labelText;

  wrapper.appendChild(label);
  wrapper.appendChild(inputEl);
  return wrapper;
}

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  if (!result) return '#000000';
  return '#' + result.slice(0, 3).map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}


// function rgbToHex(rgb) {
//   const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(rgb);
//   if (!result) {
//     return '#ffffff';
//   }
//   return "#" + ((1 << 24) + (parseInt(result[1]) << 16) + (parseInt(result[2]) << 8) + parseInt(result[3])).toString(16).slice(1);
// }

function addToLayers(element) {
  builderState.elements.push(element);
  updateLayersPanel();
}

function updateLayersPanel() {
  const layersContainer = document.getElementById('layers-container');
  layersContainer.innerHTML = '';

  builderState.elements.forEach((el, index) => {
    const layerItem = document.createElement('div');
    layerItem.classList.add('layer-item');
    layerItem.textContent = `${index + 1}: ${el.dataset.type || 'element'}`;
    layerItem.style.padding = '6px 10px';
    layerItem.style.borderBottom = '1px solid #e1e5e9';
    layerItem.style.cursor = 'pointer';

    layerItem.addEventListener('click', () => {
      selectElement(el);
    });

    layersContainer.appendChild(layerItem);
  });
}

function addToHistory() {
  // Remove any redo history
  builderState.history = builderState.history.slice(0, builderState.historyIndex + 1);

  // Save current canvas HTML
  const canvas = document.getElementById('canvas');
  const snapshot = canvas.innerHTML;

  builderState.history.push(snapshot);
  builderState.historyIndex++;
}

function undo() {
  if (builderState.historyIndex > 0) {
    builderState.historyIndex--;
    restoreHistory();
  }
}

function redo() {
  if (builderState.historyIndex < builderState.history.length - 1) {
    builderState.historyIndex++;
    restoreHistory();
  }
}

function restoreHistory() {
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = builderState.history[builderState.historyIndex];

  // Re-attach event listeners to elements
  const elements = canvas.querySelectorAll('.canvas-element');
  builderState.elements = Array.from(elements);
  elements.forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      selectElement(el);
    });
  });

  updateLayersPanel();
  builderState.selectedElement = null;
  // updatePropertiesPanel(null);
}

// Initialize Builder
function initializeBuilder() {
  // Undo/Redo buttons
  const undoBtn = document.getElementById('undo-btn');
  const redoBtn = document.getElementById('redo-btn');

  undoBtn.addEventListener('click', () => {
    undo();
  });

  redoBtn.addEventListener('click', () => {
    redo();
  });

  // Canvas click to deselect
  const canvas = document.getElementById('canvas');
  canvas.addEventListener('click', () => {
    if (builderState.selectedElement) {
      builderState.selectedElement.classList.remove('selected');
      builderState.selectedElement = null;
      // updatePropertiesPanel(null);
    }
  });


  // Vertical toolbar functionality
  const verticalToolItems = document.querySelectorAll('.vertical-tool-item');
  verticalToolItems.forEach(item => {
    item.addEventListener('click', () => {
      const elementType = item.dataset.type;
      if (elementType) {
        addElementToCanvas(elementType);
      } else if (item.id === 'ai-creator') {
        // AI Creator functionality
        showAICreator();
      }
    });
  });

  // Initialize history with empty canvas
  addToHistory();

  document.getElementById('reset-project-btn').addEventListener('click', () => {
    const confirmed = confirm("Are you sure you want to reset the project? This will delete all content.");
    if (!confirmed) return;

    const canvas = document.getElementById('canvas');
    canvas.innerHTML = `
    
    <div id="drop-zone" class="drop-zone">
        <div class="drop-zone-content">
          <i class="fas fa-plus-circle"></i>
          <p>Drag elements here to start building</p>
          <p class="theme-hint">Or load a theme to get started</p>
        </div>
      </div>
      `;

    // Reset builder state
    builderState.elements = [];
    builderState.selectedElement = null;
    builderState.clipboard = null;
    builderState.history = [];
    builderState.historyIndex = -1;
    builderState.hasTheme = false;
    builderState.currentTheme = null;

    // updatePropertiesPanel(null);
    updateLayersPanel();

    // Clear localStorage if you want:
    localStorage.removeItem("vendoora");

    // alert("Project has been reset.");
    showCustomAlert("Project has been reset!");
  });


}



function makeThemeElementsEditable() {
  const themeContent = document.querySelector('.theme-content');
  if (!themeContent) return;

  // Add click handlers to make elements selectable
  const editableElements = themeContent.querySelectorAll('h1, h2, h3, p, button, a, div');
  editableElements.forEach((element, index) => {
    element.style.cursor = 'pointer';
    element.style.transition = 'all 0.2s ease';
    element.dataset.elementId = `theme-element-${index}`;

    element.addEventListener('click', (e) => {
      e.stopPropagation();
      selectElement(element);
    });

    element.addEventListener('mouseenter', () => {
      if (!element.classList.contains('selected')) {
        element.style.outline = '2px dashed var(--primary)';
      }
    });

    element.addEventListener('mouseleave', () => {
      if (!element.classList.contains('selected')) {
        element.style.outline = 'none';
      }
    });
  });
}

// ADDING ELEMENTS TO CANVAS, DROP AND DRAP ZONE

function addElementToCanvas(elementType) {
  const canvas = document.getElementById('canvas');
  const element = createCanvasElement(elementType);

  if (builderState.hasTheme) {
    // Add to theme content area
    const themeContent = document.querySelector('.theme-content');
    if (themeContent) {
      themeContent.appendChild(element);
    } else {
      canvas.appendChild(element);
    }
  } else {
    // Hide drop zone and add element
    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.add('hidden');
    canvas.appendChild(element);
  }

  // Add to layers and history
  addToLayers(element);
  addToHistory();

  // Select the new element
  selectElement(element);
}

document.querySelectorAll(".vertical-tool-item").forEach(item => {
  item.draggable = true;
  item.ondragstart = e => { e.dataTransfer.setData("type", item.dataset.type); };
});
const zone = document.getElementById("canvas");


function isDropTarget(type) {
  return ['section', 'container', 'grid', 'gallery'].includes(type);
}



["dragover", "drop"].forEach(ev =>
  document.addEventListener(ev, e => {
    e.preventDefault();

    const type = e.dataTransfer.getData("type");
    const draggedId = e.dataTransfer.getData("dragged-id");

    let target = e.target.closest('.canvas-element');
    if (!target || !isDropTarget(target.dataset.type)) {
      target = document.getElementById('canvas');
    }

    // Highlight on dragover
    document.querySelectorAll('.canvas-element').forEach(el => el.classList.remove('drop-target-hover'));
    if (ev === "dragover" && target && isDropTarget(target.dataset.type)) {
      target.classList.add('drop-target-hover');
    }

    if (ev === "drop") {
      document.querySelectorAll('.canvas-element').forEach(el => el.classList.remove('drop-target-hover'));

      // ✅ Handle internal move (reparenting existing element)
      if (draggedId) {
        const draggedEl = document.querySelector(`[data-element-id="${draggedId}"]`);
        if (draggedEl && draggedEl !== target && !draggedEl.contains(target)) {
          target.appendChild(draggedEl);
          addToHistory();
          updateLayersPanel();
          selectElement(draggedEl);
        }
        return;
      }

      //Handle new element from toolbar
      if (type) {
        const newEl = createCanvasElement(type);
        target.appendChild(newEl);
        addToLayers(newEl);
        addToHistory();
        selectElement(newEl);
      }
    }
  })
);




function showAICreator() {
  // Placeholder for AI Creator functionality
  // alert('AI Creator feature coming soon! This will help you generate content and layouts using AI.');
  showCustomAlert("AI Creator feature coming soon! This will help you generate content and layouts using AI");
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBuilder);




// History for Undo/Redo
// let history = [], histIndex = -1;
// const canvas = document.getElementById("canvas");
// function recordHistory() {
//   histIndex++;
//   history.splice(histIndex);
//   history.push(canvas.innerHTML);
// }
// function undo() {
//   if (histIndex > 0) { histIndex--; canvas.innerHTML = history[histIndex]; }
// }
// function redo() {
//   if (histIndex < history.length - 1) { histIndex++; canvas.innerHTML = history[histIndex]; }
// }
// document.getElementById("undo-btn").onclick = undo;
// document.getElementById("redo-btn").onclick = redo;

// Zoom
let zoom = 1;
const zoomDisplay = document.querySelector(".zoom-level");
const wrapper = document.querySelector(".canvas-wrapper");
function setZoom(z) { zoom = z; wrapper.style.transform = `scale(${z})`; zoomDisplay.textContent = Math.round(z * 100) + "%"; }
document.getElementById("zoom-in").onclick = () => setZoom(Math.min(2, zoom + 0.1));
document.getElementById("zoom-out").onclick = () => setZoom(Math.max(0.2, zoom - 0.1));

// Fit-to-Screen
document.getElementById("fit-to-screen").onclick = () => {
  const cw = document.querySelector(".canvas-container").clientWidth;
  setZoom(Math.min(1, cw / 1200));
};

// Device Preview
document.querySelectorAll(".device-preview button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".device-preview button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const w = btn.dataset.device === "desktop" ? "1200px" :
      btn.dataset.device === "tablet" ? "768px" : "375px";
    canvas.style.width = w;
    setZoom(1);
    recordHistory();
  };
});


// PREVIEW MODE ENTERING

document.getElementById("preview-mode-btn").onclick = () => {
  const selectors = [".toolbar", ".sidebar", ".canvas-toolbar", ".vertical-toolbar"];
  const isInPreview = document.body.classList.toggle("in-preview");

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = isInPreview ? "none" : "";
    });
  });

  const exitBtn = document.getElementById("exit-preview-btn");
  if (exitBtn) exitBtn.style.display = isInPreview ? "block" : "none";
};

document.getElementById("exit-preview-btn").onclick = () => {
  document.body.classList.remove("in-preview");
  document.querySelectorAll(".toolbar, .sidebar, .canvas-toolbar, .vertical-toolbar").forEach(el => {
    el.style.display = "";
  });
  document.getElementById("exit-preview-btn").style.display = "none";
};



// Save (localStorage)
// document.getElementById("save-btn").onclick = () => {
//   localStorage.setItem("vendoora", canvas.innerHTML);
//   alert("Your current work is saved");
// };

document.getElementById("save-btn").onclick = () => {
  let currentProjectKey = localStorage.getItem("current-project-name");

  // If not yet set, prompt user to enter project name
  if (!currentProjectKey) {
    const userInput = prompt("Enter a name for your project:");
    if (!userInput || !userInput.trim()) {
      // alert("Project name is required to save.");
      showCustomAlert("Project name is required to save.");
      return;
    }

    currentProjectKey = "project-" + userInput.trim().toLowerCase().replace(/\s+/g, "-");
    localStorage.setItem("current-project-name", currentProjectKey);
  }

  const canvas = document.getElementById("canvas");
  localStorage.setItem(currentProjectKey, canvas.innerHTML);
  // alert("Project saved successfully as: " + currentProjectKey);
  showCustomAlert("Project saved successfully as: " + currentProjectKey);
};




// Load saved on page load
// window.onload = () => {
//   const saved = localStorage.getItem("vendoora");
//   if (saved) canvas.innerHTML = saved;
//   recordHistory();
// };

window.addEventListener("beforeunload", (e) => {
  const confirmed = confirm("You have unsaved changes. Are you sure you want to leave?");
  if (!confirmed) {
    e.preventDefault();
    e.returnValue = ""; // Required for some browsers
  }
});


window.onload = () => {
  const currentProjectKey = localStorage.getItem("current-project-name");
  if (currentProjectKey) {
    const saved = localStorage.getItem(currentProjectKey);
    if (saved) {
      const canvas = document.getElementById("canvas");
      canvas.innerHTML = saved;
      // Re-initialize canvas elements after loading from storage
      const savedElements = canvas.querySelectorAll('.canvas-element');
      builderState.elements = Array.from(savedElements);

      savedElements.forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          selectElement(el);
        });
        el.setAttribute('draggable', 'true');
        el.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('dragged-id', el.dataset.elementId);
        });
      });

      updateLayersPanel();

      recordHistory();
    }
  }




  // // Re-initialize canvas elements after loading from storage
  // const savedElements = canvas.querySelectorAll('.canvas-element');
  // builderState.elements = Array.from(savedElements);

  // savedElements.forEach(el => {
  //   el.addEventListener('click', (e) => {
  //     e.stopPropagation();
  //     selectElement(el);
  //   });
  //   el.setAttribute('draggable', 'true');
  //   el.addEventListener('dragstart', (e) => {
  //     e.dataTransfer.setData('dragged-id', el.dataset.elementId);
  //   });
  // });

  // updateLayersPanel();

};


// Export
document.getElementById("export-btn").onclick = () => {
  const blob = new Blob([canvas.outerHTML], { type: 'text/html' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "vendoora.html";
  a.click();
};

// Share
document.getElementById("share-btn").onclick = () => {
  const link = "https://app.vendoora.com/share?" + btoa(canvas.innerHTML).slice(0, 8);
  navigator.clipboard.writeText(link);
  // alert("Copied share link:\n" + link);
  showCustomAlert("Copied share link:\n" + link);
};



function showCustomAlert(message, callback = null) {
  const overlay = document.getElementById("custom-alert-overlay");
  const msgEl = document.getElementById("custom-alert-message");
  const okBtn = document.getElementById("custom-alert-ok");

  msgEl.textContent = message;
  overlay.classList.remove("hidden");

  okBtn.onclick = () => {
    overlay.classList.add("hidden");
    if (callback) callback();
  };
}




function showCustomConfirm(message, onConfirm) {
  const modal = document.getElementById("custom-modal");
  const msg = document.getElementById("custom-modal-message");
  const confirmBtn = document.getElementById("custom-modal-confirm");
  const cancelBtn = document.getElementById("custom-modal-cancel");

  msg.textContent = message;
  modal.classList.remove("hidden");

  const cleanup = () => {
    modal.classList.add("hidden");
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;
  };

  confirmBtn.onclick = () => {
    cleanup();
    onConfirm(true);
  };

  cancelBtn.onclick = () => {
    cleanup();
    onConfirm(false);
  };
}





const contextMenu = document.getElementById("contextMenu");

document.addEventListener("contextmenu", (e) => {
  const widget = e.target.closest(".canvas-element");
  if (widget) {
    e.preventDefault();
    showContextMenu(e.pageX, e.pageY, widget);
  }
});

document.addEventListener("click", () => {
  contextMenu.classList.add("hidden");
});

function showContextMenu(x, y, element) {
  contextMenu.style.top = `${y}px`;
  contextMenu.style.left = `${x}px`;
  contextMenu.classList.remove("hidden");

  contextMenu.onclick = (e) => {
    const action = e.target.dataset.action;
    if (action === "edit") {
      // alert("Edit " + element.dataset.type);
      showCustomAlert("Edit " + element.dataset.type);
    } else if (action === "duplicate") {
      const clone = element.cloneNode(true);
      element.parentNode.insertBefore(clone, element.nextSibling);
      addElementListeners(clone);
      selectElement(clone);
    } else if (action === "delete") {
      element.remove();
    }
    contextMenu.classList.add("hidden");
  };
}


window._activeFloatingTarget = null;


function addFloatingMenu(targetEl) {
  removeFloatingMenu(); // clear old

  const menu = document.createElement('div');
  menu.classList.add('floating-menu-btn');

  menu.innerHTML = `
  <button title="Edit Text"><i class="fas fa-edit"></i></button>
  <button title="Text Colour"><i class="fas fa-paint-brush"></i></button>
  <button title="Background Colour"><i class="fas fa-fill-drip"></i></button>
  <button title="Font Size"><i class="fas fa-text-height"></i></button>
  <button title="Font Family"><i class="fas fa-font"></i></button>
  <button title="Border Colour"><i class="fas fa-border-style"></i></button>
  <button title="Border Radius"><i class="fas fa-square"></i></button>
  <button title="Delete"><i class="fas fa-trash-alt"></i></button>
`;

  menu.children[0].onclick = () => editText();
  menu.children[1].onclick = () => changeTextColor();
  menu.children[2].onclick = () => changeBgColor();
  menu.children[3].onclick = () => changeBorderColor();
  menu.children[4].onclick = () => changeFontSize();
  menu.children[5].onclick = () => changeFontFamily();
  menu.children[6].onclick = () => changeBorderRadius();
  menu.children[7].onclick = () => deleteElement();


  // Save the current element globally so buttons know what they're editing
  window._activeFloatingTarget = targetEl;

  document.body.appendChild(menu);

  // Position it above the element
  const rect = targetEl.getBoundingClientRect();
  menu.style.position = 'absolute';
  menu.style.top = `${rect.top + window.scrollY - 40}px`;
  menu.style.left = `${rect.left + window.scrollX}px`;
}


function removeFloatingMenu() {
  const existing = document.querySelector('.floating-menu-btn');
  if (existing) existing.remove();

  const btn = document.querySelector('.floating-menu-btn');
  if (btn) btn.remove();

  const panel = document.querySelector('.floating-menu-panel');
  if (panel) panel.remove();
}



function getTarget() {
  return window._activeFloatingTarget;
}

function editText() {
  const el = getTarget();
  const newText = prompt("Enter new text:", el.innerText);
  if (newText !== null) el.innerText = newText;
}

function changeTextColor() {
  const el = getTarget();
  const color = prompt("Enter text color (e.g., red or #ff0000):");
  if (color) el.style.color = color;
}

function changeBgColor() {
  const el = getTarget();
  const color = prompt("Enter background color:");
  if (color) el.style.backgroundColor = color;
}

function changeBorderColor() {
  const el = getTarget();
  const color = prompt("Enter border color:");
  if (color) el.style.borderColor = color;
}

function changeFontSize() {
  const el = getTarget();
  const size = prompt("Enter font size (e.g., 18px):");
  if (size) el.style.fontSize = size;
}

function changeFontFamily() {
  const el = getTarget();
  const family = prompt("Enter font family (e.g., Arial):");
  if (family) el.style.fontFamily = family;
}

function changeBorderRadius() {
  const el = getTarget();
  const radius = prompt("Enter border radius (e.g., 8px):");
  if (radius) el.style.borderRadius = radius;
}

// showCustomConfirm("Are you sure you want to delete this element?", (confirmed) => {
//   if (confirmed) {
//     el.remove();
//     removeFloatingMenu();
//     window._activeFloatingTarget = null;
//   }
// });


function deleteElement() {
  const el = getTarget();
  showCustomConfirm("Are you sure you want to delete this element?", (confirmed) => {
    if (confirmed) {
      el.remove();
      removeFloatingMenu();
      window._activeFloatingTarget = null;
    }
  });
}





// Helper: find current max z-index
function getMaxZIndex() {
  const elements = document.querySelectorAll(".canvas-element");
  return Math.max(
    0,
    ...Array.from(elements).map(el => parseInt(getComputedStyle(el).zIndex) || 0)
  );
}



function deleteElementById(id) {
  const el = document.querySelector(`[data-element-id="${id}"]`);
  if (el) el.remove();
  removeFloatingMenu();
}

function editText(id) {
  const el = document.querySelector(`[data-element-id="${id}"]`);
  if (el) el.contentEditable = true;
}

function changeBg(id) {
  const el = document.querySelector(`[data-element-id="${id}"]`);
  const color = prompt("Enter background color (e.g. red, #f00, #fafafa)");
  if (color) el.style.backgroundColor = color;
}

function changeColor(id) {
  const el = document.querySelector(`[data-element-id="${id}"]`);
  const color = prompt("Enter text color (e.g. blue, #00f)");
  if (color) el.style.color = color;
}

function changeFont(id) {
  const el = document.querySelector(`[data-element-id="${id}"]`);
  const font = prompt("Enter font family (e.g. Arial, 'Courier New')");
  if (font) el.style.fontFamily = font;
}

