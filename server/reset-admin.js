const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');

async function resetPassword() {
    try {
        const db = await open({
            filename: 'database.sqlite',
            driver: sqlite3.Database
        });

        const newPassword = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        await db.run('UPDATE admins SET password_hash = ? WHERE username = ?', [hash, 'admin']);
        
        const user = await db.get('SELECT * FROM admins WHERE username = ?', ['admin']);
        console.log('Password reset successful for user:', user.username);
        
        // Verify the hash works
        const isMatch = await bcrypt.compare('admin123', user.password_hash);
        console.log('Verification test with admin123:', isMatch ? 'PASSED' : 'FAILED');
        
        await db.close();
    } catch (err) {
        console.error('Error resetting password:', err);
    }
}

resetPassword();
