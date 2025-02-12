import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { secp256k1 } from '@noble/curves/secp256k1';
import { randomBytes } from 'crypto';
import fs from 'fs';
import path from 'path';
import readlineSync from 'readline-sync';
import { fileURLToPath } from 'url';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'keys.db');

async function openDB(password) {
    const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
    await db.exec(`PRAGMA key = '${password}';`);
    await db.exec(`CREATE TABLE IF NOT EXISTS keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        mnemonic TEXT,
        privateKey TEXT,
        publicKey TEXT
    );`);
    await db.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        hashedPassword TEXT,
        totpSecret TEXT,
        totpEnabled INTEGER DEFAULT 0
    );`);
    return db;
}

async function getDatabasePassword() {
    let attempts = 0;
    while (attempts < 3) {
        const password = readlineSync.question('Enter database password: ', { hideEchoBack: true });
        try {
            const db = await openDB(password);
            await db.get('SELECT 1');
            return { db, password };
        } catch (error) {
            console.log('Invalid password. Try again.');
            attempts++;
        }
    }
    console.log('Too many failed attempts. Exiting.');
    process.exit(1);
}

async function setupTOTP(username, db) {
    const secret = speakeasy.generateSecret({ name: `Secp256k1-${username}` });
    console.log('Scan this QR code in your authenticator app:');
    qrcode.toString(secret.otpauth_url, { type: 'terminal' }, (err, url) => {
        if (err) throw err;
        console.log(url);
    });
    await db.run(`INSERT INTO users (username, totpSecret, totpEnabled) VALUES (?, ?, 1)
        ON CONFLICT(username) DO UPDATE SET totpSecret = ?, totpEnabled = 1`,
        username, secret.base32, secret.base32);
    console.log('TOTP setup complete. Use your authenticator app to generate codes.');
}

async function verifyTOTP(username, db) {
    const user = await db.get(`SELECT totpSecret FROM users WHERE username = ?`, username);
    if (!user || !user.totpSecret) return true;
    const token = readlineSync.question('Enter the TOTP token: ');
    return speakeasy.totp.verify({
        secret: user.totpSecret,
        encoding: 'base32',
        token
    });
}

async function authenticateUser(db) {
    const username = readlineSync.question('Enter your username: ');
    const user = await db.get(`SELECT username FROM users WHERE username = ?`, username);
    if (!user) {
        console.log('User not found. Creating a new user...');
        await setupTOTP(username, db);
        console.log(`User ${username} created. Please restart and log in.`);
        process.exit(1);
    }
    if (!(await verifyTOTP(username, db))) {
        console.log('Invalid TOTP. Access Denied.');
        process.exit(1);
    }
    console.log('Authentication successful!');
    return username;
}

async function generateKeyPair(username, db) {
    const mnemonic = generateMnemonic();
    const seed = mnemonicToSeedSync(mnemonic).slice(0, 32);
    const privKey = seed;
    const pubKey = secp256k1.getPublicKey(privKey, false);
    await db.run(`INSERT INTO keys (username, mnemonic, privateKey, publicKey) VALUES (?, ?, ?, ?)`,
        username, mnemonic, Buffer.from(privKey).toString('hex'), Buffer.from(pubKey).toString('hex'));
    console.log('Key pair stored securely in database.');
}

async function signMessage(username, db, message) {
    const key = await db.get(`SELECT privateKey FROM keys WHERE username = ?`, username);
    if (!key) return console.log('No key found.');
    const signature = secp256k1.sign(Buffer.from(message), Buffer.from(key.privateKey, 'hex'));
    console.log('Signature:', Buffer.from(signature.toDERRawBytes()).toString('hex'));
    const rawSignature = signature.toCompactRawBytes(); // Get raw 64-byte signature
    console.log('Raw Signature:', Array.from(rawSignature)); // Convert to array format

}



async function verifySignature(username, db, message, signature) {
    const key = await db.get(`SELECT publicKey FROM keys WHERE username = ?`, username);
    if (!key) return console.log('No key found.');
    const isValid = secp256k1.verify(Buffer.from(signature, 'hex'), Buffer.from(message), Buffer.from(key.publicKey, 'hex'));
    console.log('Signature valid:', isValid);
}

async function main() {
    const { db, password } = await getDatabasePassword();
    const username = await authenticateUser(db);

    console.log('\n1. Generate new key pair');
    console.log('2. Sign a message');
    console.log('3. Verify a signature');
    console.log('4. Enable TOTP');
    console.log('5. Disable TOTP');
    const choice = readlineSync.question('Choose an option: ');

    if (choice === '1') {
        await generateKeyPair(username, db);
    } else if (choice === '2') {
        const message = readlineSync.question('Enter message to sign: ');
        await signMessage(username, db, message);
    } else if (choice === '3') {
        const message = readlineSync.question('Enter message: ');
        const signature = readlineSync.question('Enter signature: ');
        await verifySignature(username, db, message, signature);
    } else if (choice === '4') {
        await setupTOTP(username, db);
    } else if (choice === '5') {
        await db.run(`UPDATE users SET totpEnabled = 0 WHERE username = ?`, username);
        console.log('TOTP Disabled.');
    } else {
        console.log('Invalid choice.');
    }
}

main();
