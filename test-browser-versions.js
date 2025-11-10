const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testBrowserVersions() {
    console.log('Testing different browser versions...');
    
    const playwrightDir = path.join(process.env.USERPROFILE || process.env.HOME, 'AppData', 'Local', 'ms-playwright');
    
    // List all chromium directories
    try {
        const dirs = fs.readdirSync(playwrightDir)
            .filter(dir => dir.startsWith('chromium'))
            .sort();
        
        console.log('Found chromium installations:', dirs);
        
        for (const dir of dirs) {
            console.log(`\nTesting ${dir}...`);
            const executablePath = path.join(playwrightDir, dir, 'chrome-win', 'chrome.exe');
            
            if (fs.existsSync(executablePath)) {
                console.log(`Executable exists: ${executablePath}`);
                
                try {
                    const browser = await chromium.launch({
                        executablePath: executablePath,
                        headless: true
                    });
                    
                    const version = await browser.version();
                    console.log(`✅ Success! Browser version: ${version}`);
                    await browser.close();
                    
                    // If successful, return this path
                    return executablePath;
                } catch (error) {
                    console.log(`❌ Failed: ${error.message}`);
                }
            } else {
                console.log(`❌ Executable not found: ${executablePath}`);
            }
        }
    } catch (error) {
        console.error('Error reading playwright directory:', error);
    }
    
    // Try default browser
    console.log('\nTrying default browser...');
    try {
        const browser = await chromium.launch({ headless: true });
        const version = await browser.version();
        console.log(`✅ Default browser works! Version: ${version}`);
        await browser.close();
        return 'default';
    } catch (error) {
        console.log(`❌ Default browser failed: ${error.message}`);
    }
    
    return null;
}

testBrowserVersions().then(result => {
    if (result) {
        console.log(`\n🎉 Working browser found: ${result}`);
    } else {
        console.log('\n💥 No working browser found');
    }
}).catch(console.error);