
# 🌐 is-cod.in subdomains

---
<p align="center">
   <img alt="is-cod.in Banner" src="https://raw.githubusercontent.com/is-cod-in/register/main/asset/banner.png">
</p>

## The subdomain is-cod.in has a nice ring to it! Here are some thoughts on its potential use and branding:

Coding Focus: The "cod" could refer to coding, making it great for a platform aimed at developers, programmers, or coding enthusiasts.

Innovative Platform: Perfect for a platform focused on innovative solutions, such as a hub for tech startups or creative development tools.

Memorable Branding: The simplicity and uniqueness of `is-cod.in` give it a catchy and memorable brand presence, ideal for a modern web application.


## 🚀 Overview

This repository allows users to manage DNS records by creating `.txt` files through GitHub pull requests. Once changes are approved, the DNS records are automatically updated on Cloudflare. It also features integration with a Discord bot for reviewing and approving DNS record changes.

---

## 📂 Project Structure

```plaintext
dns-configs/
├── .github/
│   └── workflows/
│       └── process-pull-request.yml   
├── records/
│   └── example.txt                    
├── processDns.js                      
├── package.json                      
└── README.md                          # Project documentation (You are here!)
```

### Key Features:

- **GitHub & Cloudflare Integration**: Update DNS records by submitting `.txt` files in GitHub.
- **Automated Workflow**: The workflow automatically processes merged pull requests and updates Cloudflare DNS.
- **Discord Bot**: Approve or deny DNS changes through Discord.
- **DNS Record Types Supported**: `A`, `AAAA`, `CNAME`, `TXT`, `MX`.

---

## ⚡️ How to Use

### Submitting DNS Records via GitHub:

1. **Fork the Repository**: Fork this repository to your GitHub account.
2. **Create `.txt` File**: Add a `.txt` file in the `records/` directory following the format described in the [Records README](./records/README.md).
3. **Submit Pull Request**: After adding the record, submit a pull request to this repository.

When your pull request is merged, the DNS records will be automatically updated in Cloudflare.

## 💾 Example DNS Record Format

Here’s an example of how to format your DNS records in a `.txt` file:

#### A Record:
```plaintext
A subdomain.example.com 192.0.2.1 3600
```

#### MX Record:
```plaintext
MX example.com 10 mail.example.com 3600
```

#### TXT Record:
```plaintext
TXT example.com "v=spf1 include:_spf.google.com ~all" 3600
```

More examples can be found in the [Records README](./records/README.md).

---

## 🌍 Contributing

We welcome contributions! If you'd like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request.

Make sure to follow the proper DNS record formats as explained above.

---

## 🔒 Security

To ensure security:

- Store API keys and secrets in environment variables or GitHub Secrets.
- Use GitHub Actions securely by limiting permissions to avoid malicious code execution.

For more security details, check the [Security Policy](./SECURITY.md).

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 📞 Support

If you have any issues or questions, feel free to open an issue on GitHub, or contact us on Discord!

---

This README file provides a comprehensive guide for users and contributors, outlining how to set up and use the project with a well-organized structure. Let me know if you need any further customization!
