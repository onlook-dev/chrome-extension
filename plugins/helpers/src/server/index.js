import { execSync } from 'child_process';

export function getCurrentCommit() {
    try {
        if (typeof window === 'undefined') {
            const stdout = execSync('git rev-parse HEAD');
            return stdout.toString().trim();
        } else {
            throw 'child_process is not available in the browser.';
        }
    } catch (err) {
        console.error(err);
        // Not a git repository or some other error occurred
        return null;
    }
}