const { spawn } = require('child_process');
const path = require('path');

const scripts = [
    'verify-auth.js',
    'verify-business.js',
    'verify-documents.js',
    'verify-chat.js'
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
    console.log('🧪 STMARTING FINAL SYSTEM HEALTH CHECK...');

    // Give server a moment if it just restarted
    await new Promise(r => setTimeout(r, 2000));

    try {
        for (const script of scripts) {
            await runScript(script);
        }
        console.log(`\n════════════════════════════════════════════════════════════`);
        console.log(`🎉 ALL SYSTEMS GO! The API is fully operational.`);
        console.log(`════════════════════════════════════════════════════════════`);
    } catch (error) {
        console.error(`\n🛑 SYSTEM CHECK FAILED: ${error.message}`);
        process.exit(1);
    }
}

runAllVerify();
