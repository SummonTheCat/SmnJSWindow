

function triggerTabNav(btn) {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        tabBtns.forEach((tabBtn) => {
            tabBtn.classList.remove('active');
            tabBtn.classList.add('inactive');
        });

        // Add active class to clicked button
        btn.classList.remove('inactive');
        btn.classList.add('active');

        // Hide all tab contents
        tabContents.forEach((tabContent) => {
            tabContent.style.display = 'none';
        });

        // Show the corresponding tab content
        let tabContent = document.getElementById(btn.dataset.tab);
        tabContent.style.display = 'block';
    });
}

function applyTabSettings() {
    // Get active element
    let activeElement = document.querySelector('.tab-btn.active');

    // Hide all tab contents
    tabContents.forEach((tabContent) => {
        tabContent.style.display = 'none';
    });

    // Show the corresponding tab content
    let tabContent = document.getElementById(activeElement.dataset.tab);
    tabContent.style.display = 'block';
}

function initTabNavigation() {
    // Tab Navigation
    window.tabBtns = document.querySelectorAll('.tab-btn');
    window.tabContents = document.querySelectorAll('.options-tab');

    tabBtns.forEach((btn) => {
        triggerTabNav(btn);
    });
}