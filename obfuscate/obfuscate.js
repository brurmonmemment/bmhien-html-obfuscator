document.getElementById('obfuscate').addEventListener('click', function() {
    const input = document.getElementById('input').value.trim();
    if (!input) {
        showStatus('Please enter some HTML code', 'error');
        return;
    }

    // Show spinner
    const spinner = document.getElementById('obfuscate-spinner');
    spinner.style.display = 'block';

    checkAndPerformObfuscation();
});

function checkAndPerformObfuscation() {
            // Clear the pending flags
            localStorage.removeItem('pendingObfuscateCode');
            localStorage.removeItem('obfuscationPending');
            
            // Set the input field with the saved code
            document.getElementById('input').value = savedCode;
            
            // Now perform the actual obfuscation
            try {
                // Add the disable-devtool script to the input HTML
                const htmlWithDisableScript = addDisableDevtoolScript(savedCode);
                
                // Generate a random encryption key
                const key = generateRandomKey(16); // 128-bit key
                
                // Encrypt the modified input using AES
                const encrypted = encryptAES(htmlWithDisableScript, key);
                
                // Create the decryption script
                const obfuscated = `</script><script>(function(){const _0x1a3b=${"`"+key+"`"};const _0x93cd="${encrypted}";function _0x37fe(_0x93cd,_0x1a3b){const _0x2c4d=atob('${btoa("CryptoJS.enc.Utf8.parse")}');const _0x59af=atob('${btoa("CryptoJS.AES.decrypt")}');const _0x8e71=eval(_0x2c4d)(_0x1a3b);const _0x47bc=eval(_0x59af)(_0x93cd,_0x8e71,{mode:eval(atob('${btoa("CryptoJS.mode.ECB")}')),padding:eval(atob('${btoa("CryptoJS.pad.Pkcs7")}'))});return _0x47bc.toString(eval(atob('${btoa("CryptoJS.enc.Utf8")}')))}let _0x5dce=String.fromCharCode(104,116,116,112,115,58,47,47)+String.fromCharCode(99,100,110,106,115,46,99,108,111,117,100,102,108,97,114,101,46,99,111,109,47)+String.fromCharCode(97,106,97,120,47,108,105,98,115,47,99,114,121,112,116,111,45,106,115,47,52,46,49,46,49,47,99,114,121,112,116,111,45,106,115,46,109,105,110,46,106,115);const _0x7b2d=document.createElement('script');_0x7b2d.src=_0x5dce;_0x7b2d.onload=function(){const _0x3f9a=_0x37fe(_0x93cd,_0x1a3b);document.write(_0x3f9a);};document.head.appendChild(_0x7b2d);})();<\/script>`;
                document.getElementById('output').value = obfuscated;
                
                // Show success message with additional note about Linkvertise
                showStatus('Code successfully obfuscated with AES encryption and anti-DevTools protection!');
                
                // Hide spinner
                document.getElementById('obfuscate-spinner').style.display = 'none';
            } catch (error) {
                showStatus('Error during obfuscation: ' + error.message, 'error');
                document.getElementById('obfuscate-spinner').style.display = 'none';
            }
}

// Check for Linkvertise return on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load CryptoJS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    document.head.appendChild(script);
    
    // Check if we've returned from Linkvertise
    checkAndPerformObfuscation();
    
    // Add explanatory text about the Linkvertise requirement
    const infoBox = document.createElement('div');
    infoBox.style.marginTop = '20px';
    infoBox.style.padding = '10px';
    infoBox.style.border = '1px dashed var(--primary)';
    infoBox.style.borderRadius = '5px';
    infoBox.style.backgroundColor = 'rgba(0, 20, 0, 0.3)';
    infoBox.innerHTML = '<p style="margin: 0; text-align: center; color: var(--primary);">Please support bm-hien by using their obfuscation tool with linkvertise, you will also get slightly better security unless you are also using this for the same purpose</p>';
    
    // Insert before the controls div
    const controlsDiv = document.querySelector('.controls');
    controlsDiv.parentNode.insertBefore(infoBox, controlsDiv);
});

// Function to add the disable-devtool script to the HTML
function addDisableDevtoolScript(html) {
    // Check if the script is already added
    if (html.includes("disable-devtool-auto")) {
        return html; // Script already exists, return as is
    }
    
    const disableScript = `<script disable-devtool-auto src="https://cdn.jsdelivr.net/npm/disable-devtool"></script><script src="anti-iframe-mod.js"></script>`; // NEW: use local anti iframe script
    
    // Find the head tag to inject the script
    const headEndIndex = html.indexOf('</head>');
    
    // If head tag exists, inject before head closing tag
    if (headEndIndex !== -1) {
        return html.substring(0, headEndIndex) + disableScript + html.substring(headEndIndex);
    } 
    // If no head tag, try to find the html opening tag
    else {
        const htmlStartIndex = html.indexOf('<html>');
        const htmlStartIndex2 = html.indexOf('<html ');
        
        // Find the actual start index of HTML tag
        let actualHtmlIndex = -1;
        if (htmlStartIndex !== -1 && htmlStartIndex2 !== -1) {
            actualHtmlIndex = Math.min(htmlStartIndex, htmlStartIndex2);
        } else if (htmlStartIndex !== -1) {
            actualHtmlIndex = htmlStartIndex;
        } else if (htmlStartIndex2 !== -1) {
            actualHtmlIndex = htmlStartIndex2;
        }
        
        if (actualHtmlIndex !== -1) {
            // Find the end of the html tag
            const htmlTagEnd = html.indexOf('>', actualHtmlIndex);
            if (htmlTagEnd !== -1) {
                // Insert after the html opening tag and create head tags
                return html.substring(0, htmlTagEnd + 1) + 
                       "<head>" + disableScript + "</head>" + 
                       html.substring(htmlTagEnd + 1);
            }
        }
        
        // If all else fails, just add it at the beginning
        return disableScript + html;
    }
}


// Generate a random key for AES encryption
function generateRandomKey(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
}

// Function to encrypt using AES
function encryptAES(text, key) {
    // Add CryptoJS library if it doesn't exist
    if (typeof CryptoJS === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
        script.async = false;
        document.head.appendChild(script);
        
        // Wait for the script to load
        return new Promise((resolve) => {
            script.onload = () => {
                const encrypted = performEncryption(text, key);
                resolve(encrypted);
            };
        });
    } else {
        return performEncryption(text, key);
    }
}

// Helper function to perform the actual encryption
function performEncryption(text, key) {
    const keyWords = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(text, keyWords, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

document.getElementById('copy').addEventListener('click', function() {
    const output = document.getElementById('output');
    if (!output.value) {
        showStatus('Nothing to copy', 'error');
        return;
    }
    
    output.select();
    document.execCommand('copy');
    showStatus('Code copied to clipboard!');
});

document.getElementById('clear').addEventListener('click', function() {
    document.getElementById('input').value = '';
    document.getElementById('output').value = '';
    showStatus('Cleared all content');
});

document.getElementById('preview').addEventListener('click', function() {
    const output = document.getElementById('output').value;
    if (!output) {
        showStatus('Nothing to preview', 'error');
        return;
    }
    
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(output);
    previewWindow.document.close();
    showStatus('Preview opened in new tab');
});

function showStatus(message, type = 'success') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.style.color = type === 'error' ? '#ff0000' : '#00ff00';
    
    // Clear status after 3 seconds
    setTimeout(() => {
        status.textContent = '';
    }, 3000);
}

// Initialize CryptoJS library when page loads
document.addEventListener('DOMContentLoaded', function() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    document.head.appendChild(script);

});






