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
    el.style.cursor = 'move';

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
            btn.style.background = '#007bff';
            btn.style.color = 'white';
            btn.style.cursor = 'pointer';
            el.appendChild(btn);
            break;
        case 'image':
            const img = document.createElement('img');
            img.src = 'https://via.placeholder.com/150';
            img.alt = 'Placeholder Image';
            img.style.maxWidth = '100%';
            img.style.borderRadius = '4px';
            el.appendChild(img);
            break;
        case 'section':
            el.style.border = '2px dashed #007bff';
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
    updatePropertiesPanel(element);
}

function updatePropertiesPanel(element) {
    const propertiesContent = document.getElementById('properties-content');
    propertiesContent.innerHTML = '';

    if (!element) {
        propertiesContent.innerHTML = `
            <div class="no-selection">
                <i class="fas fa-mouse-pointer"></i>
                <p>Select an element to edit its properties</p>
            </div>
        `;
        return;
    }

    const type = element.dataset.type || 'custom';

    const title = document.createElement('h4');
    title.textContent = `Properties: ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    title.style.marginBottom = '10px';
    propertiesContent.appendChild(title);

    // Example properties: content editable for text/heading, background color for container/section, etc.
    if (type === 'text' || type === 'heading') {
        const label = document.createElement('label');
        label.textContent = 'Text Content';
        label.style.display = 'block';
        label.style.marginBottom = '4px';

        const textarea = document.createElement('textarea');
        textarea.value = element.textContent;
        textarea.style.width = '100%';
        textarea.style.height = '80px';
        textarea.addEventListener('input', () => {
            element.textContent = textarea.value;
        });

        propertiesContent.appendChild(label);
        propertiesContent.appendChild(textarea);
    } else if (type === 'button') {
        const btn = element.querySelector('button');
        if (btn) {
            const label = document.createElement('label');
            label.textContent = 'Button Text';
            label.style.display = 'block';
            label.style.marginBottom = '4px';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = btn.textContent;
            input.style.width = '100%';
            input.addEventListener('input', () => {
                btn.textContent = input.value;
            });

            propertiesContent.appendChild(label);
            propertiesContent.appendChild(input);
        }
    } else if (type === 'image') {
        const img = element.querySelector('img');
        if (img) {
            const label = document.createElement('label');
            label.textContent = 'Image URL';
            label.style.display = 'block';
            label.style.marginBottom = '4px';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = img.src;
            input.style.width = '100%';
            input.addEventListener('input', () => {
                img.src = input.value;
            });

            propertiesContent.appendChild(label);
            propertiesContent.appendChild(input);
        }
    } else if (type === 'section' || type === 'container' || type === 'grid' || type === 'gallery') {
        const label = document.createElement('label');
        label.textContent = 'Background Color';
        label.style.display = 'block';
        label.style.marginBottom = '4px';

        const input = document.createElement('input');
        input.type = 'color';
        const bgColor = window.getComputedStyle(element).backgroundColor;
        input.value = rgbToHex(bgColor);
        input.style.width = '100%';
        input.addEventListener('input', () => {
            element.style.backgroundColor = input.value;
        });

        propertiesContent.appendChild(label);
        propertiesContent.appendChild(input);
    } else {
        propertiesContent.innerHTML += '<p>No editable properties for this element.</p>';
    }
}

function rgbToHex(rgb) {
    const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/i.exec(rgb);
    if (!result) {
        return '#ffffff';
    }
    return "#" + ((1 << 24) + (parseInt(result[1]) << 16) + (parseInt(result[2]) << 8) + parseInt(result[3])).toString(16).slice(1);
}

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
    updatePropertiesPanel(null);
}

// Theme Templates
const themeTemplates = {
    business: `
        <div class="theme-content">
            <header style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 2.5em;">Your Business Name</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional Services & Solutions</p>
            </header>
            <nav style="background: #34495e; padding: 15px; text-align: center;">
                <a href="#" style="color: white; text-decoration: none; margin: 0 20px;">Home</a>
                <a href="#" style="color: white; text-decoration: none; margin: 0 20px;">Services</a>
                <a href="#" style="color: white; text-decoration: none; margin: 0 20px;">About</a>
                <a href="#" style="color: white; text-decoration: none; margin: 0 20px;">Contact</a>
            </nav>
            <main style="display: flex; min-height: 500px;">
                <section style="flex: 2; padding: 40px;">
                    <h2 style="color: #2c3e50; margin-bottom: 20px;">Welcome to Our Company</h2>
                    <p style="line-height: 1.6; color: #555; margin-bottom: 20px;">
                        We provide exceptional business solutions tailored to your needs. Our team of experts 
                        is dedicated to helping your business grow and succeed in today's competitive market.
                    </p>
                    <button style="background: #3498db; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer;">
                        Get Started
                    </button>
                </section>
                <aside style="flex: 1; background: #ecf0f1; padding: 40px;">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">Our Services</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 10px; padding: 10px; background: white; border-left: 4px solid #3498db;">Consulting</li>
                        <li style="margin-bottom: 10px; padding: 10px; background: white; border-left: 4px solid #3498db;">Development</li>
                        <li style="margin-bottom: 10px; padding: 10px; background: white; border-left: 4px solid #3498db;">Support</li>
                    </ul>
                </aside>
            </main>
        </div>
    `,
    portfolio: `
        <div class="theme-content">
            <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 40px; text-align: center;">
                <h1 style="margin: 0; font-size: 3em; margin-bottom: 20px;">John Doe</h1>
                <p style="font-size: 1.2em; opacity: 0.9; margin-bottom: 30px;">Creative Designer & Developer</p>
                <button style="background: rgba(255,255,255,0.2); color: white; padding: 15px 30px; border: 2px solid white; border-radius: 30px; cursor: pointer;">
                    View My Work
                </button>
            </section>
            <section style="padding: 60px 40px;">
                <h2 style="text-align: center; margin-bottom: 40px; color: #333;">My Portfolio</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="height: 200px; background: #e9ecef; border-radius: 5px; margin-bottom: 15px;"></div>
                        <h3 style="margin-bottom: 10px;">Project One</h3>
                        <p style="color: #666;">Web Design & Development</p>
                    </div>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="height: 200px; background: #e9ecef; border-radius: 5px; margin-bottom: 15px;"></div>
                        <h3 style="margin-bottom: 10px;">Project Two</h3>
                        <p style="color: #666;">Mobile App Design</p>
                    </div>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="height: 200px; background: #e9ecef; border-radius: 5px; margin-bottom: 15px;"></div>
                        <h3 style="margin-bottom: 10px;">Project Three</h3>
                        <p style="color: #666;">Brand Identity</p>
                    </div>
                </div>
            </section>
        </div>
    `,
    landing: `
        <div class="theme-content">
            <nav style="background: #34495e; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center;">
                <div style="color: white; font-size: 1.5em; font-weight: bold;">Brand</div>
                <div>
                    <a href="#" style="color: white; text-decoration: none; margin: 0 15px;">Features</a>
                    <a href="#" style="color: white; text-decoration: none; margin: 0 15px;">Pricing</a>
                    <a href="#" style="color: white; text-decoration: none; margin: 0 15px;">Contact</a>
                </div>
            </nav>
            <section style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 100px 40px; text-align: center;">
                <h1 style="margin: 0; font-size: 3.5em; margin-bottom: 20px;">Amazing Product</h1>
                <p style="font-size: 1.3em; margin-bottom: 40px; opacity: 0.9;">Transform your business with our innovative solution</p>
                <button style="background: white; color: #f5576c; padding: 18px 40px; border: none; border-radius: 30px; font-size: 1.1em; cursor: pointer; margin-right: 20px;">
                    Get Started
                </button>
                <button style="background: rgba(255,255,255,0.2); color: white; padding: 18px 40px; border: 2px solid white; border-radius: 30px; font-size: 1.1em; cursor: pointer;">
                    Learn More
                </button>
            </section>
            <section style="padding: 80px 40px; background: #f8f9fa;">
                <h2 style="text-align: center; margin-bottom: 50px; color: #333;">Key Features</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px;">
                    <div style="text-align: center;">
                        <div style="width: 80px; height: 80px; background: #3498db; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2em;">⚡</div>
                        <h3 style="margin-bottom: 15px;">Fast Performance</h3>
                        <p style="color: #666;">Lightning fast load times and optimal performance</p>
                    </div>
                    <div style="text-align: center;">
                        <div style="width: 80px; height: 80px; background: #e74c3c; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2em;">🔒</div>
                        <h3 style="margin-bottom: 15px;">Secure</h3>
                        <p style="color: #666;">Enterprise-grade security for your peace of mind</p>
                    </div>
                    <div style="text-align: center;">
                        <div style="width: 80px; height: 80px; background: #2ecc71; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2em;">📱</div>
                        <h3 style="margin-bottom: 15px;">Mobile Ready</h3>
                        <p style="color: #666;">Fully responsive and mobile optimized</p>
                    </div>
                </div>
            </section>
        </div>
    `,
    blog: `
        <div class="theme-content">
            <header style="background: #e74c3c; color: white; padding: 30px 40px; text-align: center;">
                <h1 style="margin: 0; font-size: 2.5em;">My Blog</h1>
                <p style="margin: 15px 0 0 0; opacity: 0.9;">Thoughts, stories and ideas</p>
            </header>
            <main style="max-width: 800px; margin: 0 auto; padding: 40px;">
                <article style="margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid #eee;">
                    <h2 style="color: #333; margin-bottom: 10px;">
                        <a href="#" style="text-decoration: none; color: inherit;">Getting Started with Web Development</a>
                    </h2>
                    <div style="color: #666; margin-bottom: 15px; font-size: 0.9em;">
                        March 15, 2024 • 5 min read
                    </div>
                    <p style="line-height: 1.6; color: #555;">
                        Web development has evolved significantly over the years. In this post, we'll explore 
                        the fundamentals and best practices for modern web development...
                    </p>
                    <a href="#" style="color: #e74c3c; text-decoration: none; font-weight: 500;">Read more →</a>
                </article>
                <article style="margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid #eee;">
                    <h2 style="color: #333; margin-bottom: 10px;">
                        <a href="#" style="text-decoration: none; color: inherit;">Design Trends for 2024</a>
                    </h2>
                    <div style="color: #666; margin-bottom: 15px; font-size: 0.9em;">
                        March 12, 2024 • 3 min read
                    </div>
                    <p style="line-height: 1.6; color: #555;">
                        Design trends are constantly evolving. Here are the top design trends we're seeing 
                        in 2024 and how you can incorporate them into your projects...
                    </p>
                    <a href="#" style="color: #e74c3c; text-decoration: none; font-weight: 500;">Read more →</a>
                </article>
                <article style="margin-bottom: 40px;">
                    <h2 style="color: #333; margin-bottom: 10px;">
                        <a href="#" style="text-decoration: none; color: inherit;">The Future of AI in Design</a>
                    </h2>
                    <div style="color: #666; margin-bottom: 15px; font-size: 0.9em;">
                        March 10, 2024 • 7 min read
                    </div>
                    <p style="line-height: 1.6; color: #555;">
                        Artificial Intelligence is transforming the design industry. Let's explore how AI 
                        tools are changing the way we approach design and creativity...
                    </p>
                    <a href="#" style="color: #e74c3c; text-decoration: none; font-weight: 500;">Read more →</a>
                </article>
            </main>
        </div>
    `
};

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
            updatePropertiesPanel(null);
        }
    });

    // Theme loading functionality
    const loadThemeBtn = document.getElementById('load-theme-btn');
    const themeModal = document.getElementById('theme-modal');
    const closeThemeModal = document.getElementById('close-theme-modal');
    const themeCards = document.querySelectorAll('.theme-card');
    const dropZone = document.getElementById('drop-zone');
    const themeContainer = document.getElementById('theme-container');

    loadThemeBtn.addEventListener('click', () => {
        themeModal.classList.add('active');
    });

    closeThemeModal.addEventListener('click', () => {
        themeModal.classList.remove('active');
    });

    themeModal.addEventListener('click', (e) => {
        if (e.target === themeModal) {
            themeModal.classList.remove('active');
        }
    });

    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            const themeName = card.dataset.theme;
            loadTheme(themeName);
            themeModal.classList.remove('active');
        });
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
}

function loadTheme(themeName) {
    const dropZone = document.getElementById('drop-zone');
    const themeContainer = document.getElementById('theme-container');
    
    if (themeTemplates[themeName]) {
        // Hide drop zone
        dropZone.classList.add('hidden');
        
        // Load theme content
        themeContainer.innerHTML = themeTemplates[themeName];
        themeContainer.classList.add('theme-loaded');
        
        // Make theme elements editable
        makeThemeElementsEditable();
        
        // Update builder state
        builderState.hasTheme = true;
        builderState.currentTheme = themeName;
        
        // Add to history
        addToHistory();
        
        console.log(`Theme "${themeName}" loaded successfully`);
    }
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
                element.style.outline = '2px dashed #007bff';
            }
        });

        element.addEventListener('mouseleave', () => {
            if (!element.classList.contains('selected')) {
                element.style.outline = 'none';
            }
        });
    });
}

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

function showAICreator() {
    // Placeholder for AI Creator functionality
    alert('AI Creator feature coming soon! This will help you generate content and layouts using AI.');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBuilder);
