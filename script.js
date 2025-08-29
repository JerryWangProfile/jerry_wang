// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Function to switch tabs
    function switchTab(targetTab) {
        // Remove active class from all tab buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        const activeContent = document.getElementById(targetTab);

        if (activeButton && activeContent) {
            activeButton.classList.add('active');
            activeContent.classList.add('active');

            // Smooth scroll to top of content when switching tabs
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Add click event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
            
            // Update URL hash without scrolling
            history.pushState(null, null, `#${targetTab}`);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.slice(1);
        if (hash && document.getElementById(hash)) {
            switchTab(hash);
        } else {
            switchTab('about'); // Default to about tab
        }
    });

    // Handle initial page load with hash
    const initialHash = window.location.hash.slice(1);
    if (initialHash && document.getElementById(initialHash)) {
        switchTab(initialHash);
    } else {
        // Ensure about tab is active by default
        switchTab('about');
    }

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeButton = document.querySelector('.tab-btn.active');
            const allButtons = Array.from(tabButtons);
            const currentIndex = allButtons.indexOf(activeButton);
            
            let nextIndex;
            if (e.key === 'ArrowLeft') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : allButtons.length - 1;
            } else {
                nextIndex = currentIndex < allButtons.length - 1 ? currentIndex + 1 : 0;
            }
            
            const nextTab = allButtons[nextIndex].getAttribute('data-tab');
            switchTab(nextTab);
            history.pushState(null, null, `#${nextTab}`);
        }
    });

    // Add accessibility attributes
    tabButtons.forEach((button, index) => {
        button.setAttribute('role', 'tab');
        button.setAttribute('tabindex', index === 0 ? '0' : '-1');
        button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    });

    tabContents.forEach(content => {
        content.setAttribute('role', 'tabpanel');
    });

    // Update accessibility attributes when tab changes
    const originalSwitchTab = switchTab;
    switchTab = function(targetTab) {
        originalSwitchTab(targetTab);
        
        // Update ARIA attributes
        tabButtons.forEach(btn => {
            const isActive = btn.getAttribute('data-tab') === targetTab;
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            btn.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    };
});