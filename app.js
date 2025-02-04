// Theme management
function setTheme(isDark) {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    setTheme(currentTheme !== 'dark');
});

// Initialize theme from localStorage
setTheme(localStorage.getItem('theme') === 'dark');

// LaTeX rendering setup
function renderLatex(element) {
    renderMathInElement(element, {
        delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$", right: "$", display: false}
        ],
        throwOnError: false,
        errorColor: '#cc0000',
        strict: false
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderLatex(document.body);
    
    // Set example mathematical content
    const naturalEditor = document.getElementById('natural-editor');
    naturalEditor.innerHTML = 'Try these examples:\n\n' +
        '1. Prove the angle bisector theorem\n' +
        '2. Show that $$\\lim_{n \\to \\infty} \\frac{1}{n} = 0$$\n' +
        '3. Demonstrate that $$\\forall x \\in \\mathbb{R}, x^2 \\geq 0$$';
    
    renderLatex(naturalEditor);
});

// Mock user interaction handlers
let isLoggedIn = false;

document.getElementById('login-btn').addEventListener('click', () => {
    isLoggedIn = !isLoggedIn;
    const btn = document.getElementById('login-btn');
    btn.textContent = isLoggedIn ? 'Logout' : 'Login';
    
    if (isLoggedIn) {
        document.querySelector('.theorem-browser').classList.remove('hidden');
        showTypingIndicator();
    } else {
        document.querySelector('.theorem-browser').classList.add('hidden');
    }
});

function showTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    indicator.classList.remove('hidden');
    setTimeout(() => {
        indicator.classList.add('hidden');
    }, 3000);
}

// Simulated AI response delay
function simulateAIResponse(callback, minDelay = 500, maxDelay = 1500) {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    return new Promise(resolve => setTimeout(() => resolve(callback()), delay));
}

// Loading indicator
function showLoading(element) {
    const loader = document.createElement('div');
    loader.className = 'loading';
    element.appendChild(loader);
    return () => loader.remove();
}

// Mock theorem formalization
document.getElementById('formalize-btn').addEventListener('click', async () => {
    const input = document.getElementById('natural-editor').textContent;
    const formalProof = document.getElementById('formal-proof');
    const removeLoader = showLoading(formalProof);
    
    await simulateAIResponse(() => {
        let content = "";
        if (input.toLowerCase().includes('angle bisector')) {
            content = `
                <div class="formal-step">
                    ${mockResponses.formalization['angle bisector theorem'].formalStatement}
                </div>
                <div class="proof-steps">
                    ${mockResponses.formalization['angle bisector theorem'].steps.join('<br>')}
                </div>
            `;
        } else if (input.toLowerCase().includes('lim')) {
            content = `
                <div class="formal-step">
                    $$\\lim_{n \\to \\infty} \\frac{1}{n} = 0$$
                </div>
                <div class="proof-steps">
                    1. For any ε > 0, we need to find N such that |1/n| < ε for all n > N<br>
                    2. |1/n| < ε ⟹ n > 1/ε<br>
                    3. Choose N = ⌈1/ε⌉<br>
                    4. Then for all n > N, |1/n| < ε<br>
                    5. Therefore, the limit exists and equals 0
                </div>
            `;
        } else {
            content = "Please provide a mathematical statement to formalize.";
        }
        
        formalProof.innerHTML = content;
        renderLatex(formalProof);
        removeLoader();
    });
});

// Theorem browser population
function populateTheorems() {
    const theoremList = document.getElementById('theorem-list');
    theoremList.innerHTML = mockTheorems.theorems.map(theorem => `
        <div class="theorem-card">
            <h4>${theorem.title}</h4>
            <p>${theorem.statement}</p>
            <div class="theorem-meta">
                <span>👍 ${theorem.upvotes}</span>
                <span>💬 ${theorem.comments.length}</span>
            </div>
        </div>
    `).join('');
}

populateTheorems();

// Graph visualization
function initializeGraph() {
    const width = document.getElementById('graph-visualization').clientWidth;
    const height = document.getElementById('graph-visualization').clientHeight;

    const svg = d3.select('#graph-visualization')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2));

    const nodes = mockTheorems.theorems.map(t => ({ id: t.id, title: t.title }));
    const links = mockTheorems.connections;

    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke', '#999')
        .attr('stroke-width', 2);

    const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', 10)
        .attr('fill', '#4a90e2')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    node.append('title')
        .text(d => d.title);

    simulation
        .nodes(nodes)
        .on('tick', ticked);

    simulation.force('link')
        .links(links);

    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    }

    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
}

// Show graph visualization on theorem hover
document.getElementById('theorem-list').addEventListener('mouseover', (e) => {
    const theoremCard = e.target.closest('.theorem-card');
    if (theoremCard) {
        document.getElementById('graph-visualization').classList.remove('hidden');
        if (!document.querySelector('#graph-visualization svg')) {
            initializeGraph();
        }
    }
});

// Auto-complete functionality with animation
document.getElementById('auto-complete-btn').addEventListener('click', async () => {
    const formalProof = document.getElementById('formal-proof');
    const input = document.getElementById('natural-editor').textContent.toLowerCase();
    const removeLoader = showLoading(formalProof);
    
    await simulateAIResponse(() => {
        let content = '';
        if (input.includes('limit')) {
            content = mockResponses.nextSteps['prove limit exists']
                .map(step => `<div class="proof-step">${step}</div>`)
                .join('');
        } else if (input.includes('angle bisector')) {
            content = mockResponses.formalization['angle bisector theorem'].steps
                .map(step => `<div class="proof-step">${step}</div>`)
                .join('');
        }
        
        formalProof.innerHTML = content || 'Please provide a mathematical statement to auto-complete.';
        removeLoader();
    });
});

// Enhanced step suggestion with progress tracking
document.getElementById('suggest-step-btn').addEventListener('click', async () => {
    const formalProof = document.getElementById('formal-proof');
    const input = document.getElementById('natural-editor').textContent.toLowerCase();
    const removeLoader = showLoading(formalProof);
    
    await simulateAIResponse(() => {
        const steps = input.includes('limit') 
            ? mockResponses.nextSteps['prove limit exists']
            : mockResponses.formalization['angle bisector theorem'].steps;
        
        const currentSteps = formalProof.querySelectorAll('.proof-step');
        const currentStepIndex = currentSteps.length;
        
        if (currentStepIndex >= steps.length) {
            formalProof.innerHTML += `
                <div class="proof-step" style="border-left-color: var(--success-color)">
                    Proof complete! ✓
                </div>`;
        } else {
            const nextStep = steps[currentStepIndex];
            const newStep = document.createElement('div');
            newStep.className = 'proof-step';
            newStep.textContent = nextStep;
            newStep.style.animation = 'slideIn 0.3s ease';
            formalProof.appendChild(newStep);
        }
        
        removeLoader();
    });
});

// Enhanced graph visualization
function initializeGraph() {
    const width = document.getElementById('graph-visualization').clientWidth;
    const height = document.getElementById('graph-visualization').clientHeight;

    const svg = d3.select('#graph-visualization')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Add zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.5, 2])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    const g = svg.append('g');

    const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2));

    const nodes = mockTheorems.theorems.map(t => ({ 
        id: t.id, 
        title: t.title,
        radius: 30 + t.upvotes / 2 // Size based on upvotes
    }));
    
    const links = mockTheorems.connections;

    const link = g.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke', '#999')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');

    // Add arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 30)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#999');

    const node = g.append('g')
        .selectAll('g')
        .data(nodes)
        .enter().append('g')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    node.append('circle')
        .attr('r', d => d.radius)
        .attr('fill', '#4a90e2')
        .attr('opacity', 0.8);

    node.append('text')
        .text(d => d.title)
        .attr('text-anchor', 'middle')
        .attr('dy', '.3em')
        .style('fill', 'white')
        .style('font-size', '12px')
        .style('pointer-events', 'none');

    simulation
        .nodes(nodes)
        .on('tick', ticked);

    simulation.force('link')
        .links(links);

    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('transform', d => `translate(${d.x},${d.y})`);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}
