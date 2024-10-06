### Adding DNS Records

To add or modify DNS records, follow these steps:

1. **Fork this repository**: Fork this repository to your GitHub account.
2. **Create a new `.txt` file**: Inside the `records/` directory, create a new `.txt` file. The filename should represent the subdomain or record you're adding/modifying.
    - For example, if you want to add a record for `subdomain.is-cod.in`, you can name the file `subdomain.txt`.
3. **Write DNS records**: Inside the `.txt` file, each line should define a DNS record in the following format:
  
    ```plaintext
    <record type> <name> <content> [priority] [ttl]
    ```

    - **record type**: The DNS record type (`A`, `AAAA`, `CNAME`, `TXT`, `MX`).
    - **name**: The subdomain (e.g., `subdomain.is-cod.in`).
    - **content**: The value for the DNS record (e.g., IP for `A`/`AAAA`, domain for `CNAME`, text for `TXT`, mail server for `MX`).
    - **priority**: Only required for `MX` records (e.g., `10`).
    - **ttl**: (Optional) Time to live in seconds (default is `3600` if not provided).

4. **Submit a pull request**: After adding the records, commit the changes and submit a pull request to this repository.

### Example DNS Records

Here are examples of various DNS record types that you can define in the `.txt` file:

These are examples of different types of DNS records used to configure various aspects of a domain's DNS settings. Here’s a breakdown of each type:

### 1. **A Record (IPv4 Address)**
   ```plaintext
   A example.com 192.0.2.1 3600
   ```
   - **A**: Specifies the type of DNS record, in this case, an **A** record, which maps a domain name to an IPv4 address.
   - **subdomain-name**: The subdomain being mapped.
   - **192.0.2.1**: The IPv4 address that the domain should resolve to.
   - **3600**: The TTL (Time to Live) in seconds. This means DNS resolvers should cache this record for 3600 seconds (1 hour) before refreshing it.

### 2. **AAAA Record (IPv6 Address)**
   ```plaintext
   AAAA example.com 2001:0db8:85a3::8a2e:0370:7334 3600
   ```
   - **AAAA**: This is the IPv6 version of an A record, mapping the domain to an IPv6 address.
   - **subdomain-name**: The subdomain being mapped.
   - **2001:0db8:85a3::8a2e:0370:7334**: The IPv6 address that the domain resolves to.
   - **3600**: TTL in seconds (3600 seconds = 1 hour).

### 3. **CNAME Record (Alias to Another Domain)**
   ```plaintext
   CNAME www.example.com example.com 3600
   ```
   - **CNAME**: A Canonical Name (CNAME) record that makes one domain (an alias) resolve to another domain (the canonical or actual name).
   - **subdomain-name**: The subdomain that you're pointing to another domain.
   - **example.com**: The target domain to which the alias resolves.
   - **3600**: TTL in seconds. Resolvers will cache this for 3600 seconds (1 hour).

### 4. **TXT Record (Text Information)**
   ```plaintext
   TXT example.com "v=spf1 include:_spf.google.com ~all" 3600
   ```
   - **TXT**: A TXT record allows you to associate arbitrary text with a domain, often used for things like email validation, domain verification, or SPF (Sender Policy Framework) settings.
   - **example.com**: The domain associated with the TXT record.
   - **3600**: TTL in seconds.

### 5. **MX Record (Mail Exchange for Email)**
   ```plaintext
   MX example.com 10 mail.example.com 3600
   ```
   - **MX**: Mail Exchange (MX) record, which specifies the mail servers responsible for receiving email on behalf of a domain.
   - **subdomain-name**: The subdomain for which the MX record is defined.
   - **10**: The priority of this mail server. Lower numbers have higher priority, meaning mail is sent to the server with the lowest priority number first.
   - **mail.example.com**: The hostname of the mail server that will receive emails for `example.com`.
   - **3600**: TTL in seconds.

### Summary of Each Component:
- **Record Type**: Indicates the type of DNS record (A, AAAA, CNAME, TXT, MX).
- **Name**: The domain or subdomain associated with the record.
- **Content**: The value or destination (IP address, domain, text, etc.) to which the domain should resolve.
- **Priority (MX records)**: Determines the order of preference for mail servers.
- **TTL**: Time to Live, the duration for which DNS resolvers cache the record before refreshing.

### Workflow: How the Process Works

1. **Create/Modify Records**: Users create or modify records in the `records/` directory and submit a pull request.
2. **PR Merged**: Once the pull request is merged, GitHub Actions automatically triggers the `processDns.js` script.
3. **Update Cloudflare**: The script reads the records from the `.txt` files, and the Cloudflare API updates the DNS records accordingly.

This `README.md` file explains how users can contribute DNS records by creating `.txt` files and how the records are processed automatically when the pull request is merged.
