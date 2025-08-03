import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const certsDir = path.join(__dirname, "..", "certs");

// Create certs directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
}

function createDummyCertificates() {
    console.log(
        "⚠️  OpenSSL not found. Creating dummy certificates for development..."
    );

    // Create dummy certificates for development
    const dummyKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB
gLlaFkh8aS2ySSnM6LQ5O7LYZXWOUz74K8b+1yNpDNeOpSfk541Dkjm1bl4j4yaSh
5fp0ZAcRf6vs6QsPk3qcy4SAQlH6wsOftqByL93CRPv4qYkGHhHjmd8lqUpXwKL+
VjJtP9s3Bl3+2LxLzqnX7WUYiOi4OCdLwMeLqLBWcA3xnOa3bceBlfqSJKb9I5gpP
y5gz5I1EcyOvltlOTgvSaqLRK2XaDb2Pq0ZagYhrjE2QsnlbURC8Gl6fuQeGWleJ
NF6T1VLzQ4gQ/9b4L8dkvEI7YucJ8RhjAkkp3ac2JQnUJA8EA+8sSu1jzK6j9ZG4
XaB7MPOSfA6AgMBAAECggEBAKTmjaS6tkK8BlPXClTQ2vpz/N6uxDeS35mXpqas
xskGlkU/wsRcFbu2h66LdfZbuvj86TH5H1UyD3ssTpdnSVN0/lgS7Ou5HvswHuv
9BxWHJc6iD2scN3z18G7S9jXjnZ7P+OZoK3LB0DFfUzXg5aJfl2Xalsv+6b2Tp
eNf1Zw5N1Xyl0Pz1e7j0B6elZOi4qBqQnC2A1X/h3q6L9KNLb6v5M8G8zG6j
8Lj5xyDf5N3c8y7TFJ2Ld1OQJ5d
-----END PRIVATE KEY-----`;

    const dummyCert = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK7LbQw3KkMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMTkwNzI5MTI0NzU5WhcNMTkwODI4MTI0NzU5WjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAu1SU1LfVLPHCgYC5WhZIfGktskkpzOi0OTuy2GV1jlM++CvG/tcjaQzX
jqUn5OeNQ5I5tW5eI+MmkofX6dGQHEX+r7OkLD5N6nMuAgEJR+sLDn7agci/dwkT
7+KmJBh4R45nfJalKV8Ci/lYybT/bNwZd/ti8S86p1+1lGIjouDgnS8DHi6iwVnA
N8Zzmt23HgZX6kiSm/SOYLT8uYM+SNRHMjr5bZTk4L0mqi0Stl2g29j6tGWoGIa4
xNkLJ5W1EQvBpen7kHhlZXiTRek9VS80OIEP/W+C/HZLxCO2LnCfEYYwJJKd2nNi
UJ1CQPBAfvLErtY8yuo/WRuF2gezDzknwOgIDAQABo1AwTjAdBgNVHQ4EFgQU
-----END CERTIFICATE-----`;

    fs.writeFileSync(path.join(certsDir, "key.pem"), dummyKey);
    fs.writeFileSync(path.join(certsDir, "cert.pem"), dummyCert);

    console.log("✅ Dummy SSL certificates created for development!");
    console.log("📁 Certificates location:", certsDir);
    console.log("⚠️  Note: These are dummy certificates for development only!");
}

function createOpenSSLCertificates() {
    // Generate private key
    console.log("Generating private key...");
    execSync("openssl genrsa -out certs/key.pem 2048", {
        cwd: path.join(__dirname, ".."),
    });

    // Generate certificate signing request
    console.log("Generating certificate signing request...");
    execSync(
        'openssl req -new -key certs/key.pem -out certs/csr.pem -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"',
        { cwd: path.join(__dirname, "..") }
    );

    // Generate self-signed certificate
    console.log("Generating self-signed certificate...");
    execSync(
        "openssl x509 -req -in certs/csr.pem -signkey certs/key.pem -out certs/cert.pem -days 365",
        { cwd: path.join(__dirname, "..") }
    );

    // Clean up CSR file
    fs.unlinkSync(path.join(certsDir, "csr.pem"));

    console.log("✅ SSL certificates generated successfully!");
    console.log("📁 Certificates location:", certsDir);
}

try {
    // Check if OpenSSL is available
    let useOpenSSL = true;
    try {
        execSync("openssl version", { stdio: "ignore" });
    } catch {
        useOpenSSL = false;
    }

    if (useOpenSSL) {
        createOpenSSLCertificates();
    } else {
        createDummyCertificates();
    }
} catch (error) {
    console.error("❌ Error generating certificates:", error);
    process.exit(1);
}
