// I, BRURMONEMT, DO NOT CLAIM THE MAJORITY OF THIS CODE TO BE MINE. IT BELONGS TO BM-HIEN. THIS IS SIMPLY A TINY MOD THAT CHECKS IF ITS AN IFRAME.]
// SECTIONS LABELED "NEW" HAVE MODIFICATIONS MADE BY ME.

(function() {
    // Stronger check for iframe embedding
    function isInIframe() {
        try {
            return window.self !== window.top || 
                   window.frameElement || 
                   window.top.location.href !== window.location.href;
        } catch (e) {
            // If we can't access these properties, we're likely in a sandboxed iframe
            return true;
        }
    }

    // NEW: proper iframe check
    function isRealIframe() {
        try {
            return window.frameElement.tagName.toLowerCase() === 'iframe';
        } catch(e) {
            return true;
        }
    }

    // Handle iframe embedding with stronger measures
    function handleIframeEmbedding() {
        if (isInIframe() && isRealIframe()) { // NEW: include real iframe check
            // Display message to terminal if it exists
            const terminalOutput = document.getElementById('output');
            if (terminalOutput) {
                terminalOutput.innerHTML += '\n<span style="color: #FF5555;">looking what? will not worked silly</span>\n';
                terminalOutput.innerHTML += '<span style="color: #AAAAAA;">This website must be accessed directly, not through an iframe.</span>\n';
                
                // Scroll to show message
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
            
            // First attempt - try to break out of the iframe
            try {
                window.top.location.href = window.location.href;
            } catch (e) {
                // Expected to fail in sandboxed iframes
            }
            
            // Second attempt - use META refresh as a backup
            const meta = document.createElement('meta');
            meta.httpEquiv = 'refresh';
            meta.content = '0;url=' + window.location.href;
            document.head.appendChild(meta);
            
            // Third attempt - replace entire document content
            document.body.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: black; color: #00ff00; font-family: 'Courier New', monospace; text-align: center; padding: 20px;">
                    <h1 style="font-size: 32px; margin-bottom: 20px;">iframe huh? will not worked silly</h1>
                    <p style="margin-bottom: 15px;">This terminal profile is designed to run in its own window.</p>
                    <p>Please access directly at: <a href="${window.location.href}" style="color: #00ff00; text-decoration: underline;">${window.location.href}</a></p>
                </div>
            `;
            
            // Fourth attempt - completely break functionality by removing all scripts
            const scripts = document.getElementsByTagName('script');
            for (let i = scripts.length - 1; i >= 0; i--) {
                scripts[i].parentNode.removeChild(scripts[i]);
            }
            
            // Fifth attempt - prevent any further script execution
            window.stop();
            document.execCommand('Stop');
            
            return true;
        }
        return false;
    }

    // Apply anti-iframe protection immediately 
    const isEmbedded = handleIframeEmbedding();
    
    // If not caught initially, check again when DOM is ready
    if (!isEmbedded) {
        // Use multiple detection methods and intervals
        document.addEventListener('DOMContentLoaded', handleIframeEmbedding);
        window.addEventListener('load', handleIframeEmbedding);
        
        // Check multiple times after load to catch delayed iframe embedding
        const checkIntervals = [100, 500, 1000, 2000];
        checkIntervals.forEach(delay => {
            setTimeout(handleIframeEmbedding, delay);
        });
        
        // Add specific protection for sandboxed iframes
        if (window.frameElement === null) {
            // Add an observer to detect DOM mutations that might indicate iframe embedding
            const observer = new MutationObserver(function(mutations) {
                if (isInIframe()) {
                    handleIframeEmbedding();
                    observer.disconnect();
                }
            });
            
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Also add key CSS protection that works even if JS is blocked
    const style = document.createElement('style');
    style.textContent = `
        @media all and (display-mode: browser) {
            html { display: block; }
        }
        @media all and (display-mode: window-controls-overlay) {
            html::before {
                content: "iframe huh? will not worked silly";
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: black;
                color: #00ff00;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Courier New', monospace;
                font-size: 24px;
                z-index: 999999;
            }
        }
    `;
    document.head.appendChild(style);
})();
