const { spawn } = require('child_process');
const path = require('path');

const scripts = [
    { name: 'verify-auth.js', path: '.' },
    { name: 'verify-business.js', path: '.' },
    { name: 'verify-documents.js', path: '.' },
    { name: 'verify-url-scraping.js', path: '.' },
    { name: 'verify-chat-isolation.js', path: '.' },
    { name: 'verify-phase-1.js', path: './scripts' },
    { name: 'verify-phase-2.js', path: './scripts' },
    { name: 'verify-scraper.js', path: './scripts' }
];

async function runScript(scriptName) {
    return new Promise((resolve, reject) => {
        console.log(`\n════════════════════════════════════════════════════════════`);
        console.log(`🚀 RUNNING: ${scriptName}`);
        console.log(`════════════════════════════════════════════════════════════`);

        const child = spawn('node', [scriptName], {
            cwd: __dirname,
            stdio: 'inherit',
            shell: true
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`\n✅ PASS: ${scriptName}`);
                resolve();
            } else {
                console.error(`\n❌ FAIL: ${scriptName} (Exit Code: ${code})`);
                reject(new Error(`${scriptName} failed`));
            }
        });
    });
}

async function runAllVerify() {
    console.log('🧪 STARTING COMPREHENSIVE SYSTEM HEALTH CHECK...');

    // Give server a moment if it just restarted
    await new Promise(r => setTimeout(r, 1000));

    try {
        for (const script of scripts) {
            const scriptPath = path.join(__dirname, script.path);
            await new Promise((resolve, reject) => {
                console.log(`\n════════════════════════════════════════════════════════════`);
                console.log(`🚀 RUNNING: ${script.name} (in ${script.path})`);
                console.log(`════════════════════════════════════════════════════════════`);

                const child = spawn('node', [script.name], {
                    cwd: scriptPath,
                    stdio: 'inherit',
                    shell: true
                });

                child.on('close', (code) => {
                    if (code === 0) {
                        console.log(`\n✅ PASS: ${script.name}`);
                        resolve();
                    } else {
                        console.error(`\n❌ FAIL: ${script.name} (Exit Code: ${code})`);
                        reject(new Error(`${script.name} failed`));
                    }
                });
            });
        }
        console.log(`\n════════════════════════════════════════════════════════════`);
        console.log(`🎉 ALL SYSTEMS GO! Pamilo AI is fully operational.`);
        console.log(`════════════════════════════════════════════════════════════`);
    } catch (error) {
        console.error(`\n🛑 SYSTEM CHECK FAILED: ${error.message}`);
        process.exit(1);
    }
}

runAllVerify();
