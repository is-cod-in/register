# Security Policy

## Supported Versions

We are actively supporting the following versions of the project for security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark:  |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, we kindly request that you follow the steps below:

### 1. Responsible Disclosure
Please report the issue responsibly by sending us an email before making any public disclosure. This ensures that we have an opportunity to investigate and address the issue promptly.

### 2. Email Us
Send your vulnerability report to **[araan@pro.space]**. In your report, please include:
- A detailed description of the vulnerability.
- The steps to reproduce the issue.
- Any potential impacts on users or the system.

We will acknowledge receipt of your report within 48 hours and aim to address the issue within 30 days. If necessary, we will also provide an update or patch to resolve the issue.

### 3. Scope
This project interacts with DNS management via Cloudflare’s API. As such, vulnerabilities related to the following are particularly relevant:
- Unauthorized access to DNS records.
- Leaking of Cloudflare API credentials.
- Insecure processing of DNS record submissions via GitHub.

We take security seriously and aim to provide prompt responses to all valid reports.

## Security Best Practices

We encourage all contributors and users to follow best security practices:
- Never hardcode sensitive information (like API tokens) in source code.
- Use GitHub secrets for managing sensitive data (e.g., Cloudflare API tokens).
- Keep all dependencies up to date (e.g., Node.js packages) to prevent known vulnerabilities from being exploited.

## Additional Resources
For more information on Cloudflare API security, refer to the [Cloudflare API documentation](https://developers.cloudflare.com/api).
