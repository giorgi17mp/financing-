// SHA-256 fallback for browsers without WebCrypto (e.g. local preview).
import {sha256} from '@noble/hashes/sha2.js';
import {bytesToHex} from '@noble/hashes/utils.js';
globalThis.financeHash = text => bytesToHex(sha256(new TextEncoder().encode(text)));
