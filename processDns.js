const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Cloudflare API settings
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ZONE_ID = process.env.CF_ZONE_ID;

if (!CF_API_TOKEN || !CF_ZONE_ID) {
  console.error('Error: CF_API_TOKEN and CF_ZONE_ID must be set in the environment variables.');
  process.exit(1);
}

const CF_API_URL = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records`;

// Default TTL if none is provided (3600 seconds)
const DEFAULT_TTL = 3600;

// Read all .txt files in the records directory
const recordsDir = path.join(__dirname, 'records');

fs.readdir(recordsDir, (err, files) => {
  if (err) {
    console.error('Error reading records directory:', err);
    process.exit(1);
  }

  files.forEach((file) => {
    if (file.endsWith('.txt')) {
      const filePath = path.join(recordsDir, file);
      const content = fs.readFileSync(filePath, 'utf8').trim().split('\n');

      content.forEach((line) => {
        const parts = line.trim().split(' ');

        if (parts.length < 3) {
          console.error(`Invalid DNS record format in file: ${file}, line: ${line}`);
          return;
        }

        const recordType = parts[0]; // A, AAAA, CNAME, TXT, MX, etc.
        const name = parts[1]; // The domain or subdomain name
        let recordContent;
        let ttl;
        let data = {};

        // Determine TTL and record content
        ttl = !isNaN(parts[parts.length - 1]) ? parseInt(parts[parts.length - 1]) : DEFAULT_TTL;
        if (recordType === 'MX') {
          if (parts.length < 5) {
            console.error(`Invalid MX record format in file: ${file}, line: ${line}`);
            return;
          }
          const priority = parseInt(parts[2]);
          recordContent = parts[3];
          data = {
            type: 'MX',
            name,
            content: recordContent,
            priority,
            ttl
          };
        } else if (recordType === 'TXT') {
          recordContent = parts.slice(2, parts.length - 1).join(' ').replace(/['"]+/g, '');
          data = {
            type: 'TXT',
            name,
            content: recordContent,
            ttl
          };
        } else {
          recordContent = parts[2];
          data = {
            type: recordType,
            name,
            content: recordContent,
            ttl
          };
        }

        // Debug: Log the payload before sending it to Cloudflare
        console.log('Sending the following data to Cloudflare:', data);

        // Make a POST request to Cloudflare API
        axios.post(CF_API_URL, data, {
          headers: {
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (response.data.success) {
            console.log(`Successfully updated ${recordType} record for ${name}`);
          } else {
            console.error(`Failed to update ${recordType} record for ${name}:`, response.data.errors);
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            console.error('Error with Cloudflare API:', error.response.data);
          } else {
            console.error('Network or other error:', error.message);
          }
        });
      });
    }
  });
});
