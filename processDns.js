const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Cloudflare API settings
const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ZONE_ID = process.env.CF_ZONE_ID;
const CF_API_URL = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/dns_records`;

// Default TTL if none is provided (3600 seconds)
const DEFAULT_TTL = 3600;

// Read all .txt files in the records directory
const recordsDir = path.join(__dirname, 'records');

fs.readdir(recordsDir, (err, files) => {
  if (err) {
    console.error('Error reading records directory', err);
    process.exit(1);
  }

  files.forEach((file) => {
    if (file.endsWith('.txt')) {
      const filePath = path.join(recordsDir, file);
      const content = fs.readFileSync(filePath, 'utf8').trim().split('\n');
      
      content.forEach((line) => {
        const parts = line.split(' ');
        if (parts.length < 3) {
          console.error(`Invalid DNS record format in file: ${file}, line: ${line}`);
          return;
        }

        const recordType = parts[0]; // A, AAAA, CNAME, TXT, MX, etc.
        const name = parts[1]; // The domain or subdomain name
        const recordContent = parts[2]; // The IP, mail server, CNAME target, or value
        const ttl = parts[parts.length - 1] && !isNaN(parts[parts.length - 1]) ? parseInt(parts[parts.length - 1]) : DEFAULT_TTL; // Default to 3600 if TTL is not provided

        // For MX records, we need to capture the priority
        let data = {};
        if (recordType === 'MX') {
          const priority = parseInt(parts[3]); // MX has priority before TTL
          data = {
            type: 'MX',
            name: name,
            content: recordContent,
            priority: priority,
            ttl: ttl
          };
        } else {
          data = {
            type: recordType,
            name: name,
            content: recordContent,
            ttl: ttl
          };
        }

        // Make a POST request to Cloudflare API
        axios.post(CF_API_URL, data, {
          headers: {
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (response.status === 200) {
            console.log(`Successfully updated ${recordType} record for ${name}`);
          } else {
            console.error(`Failed to update ${recordType} record for ${name}`);
          }
        })
        .catch(error => {
          console.error('Error with Cloudflare API', error.response ? error.response.data : error.message);
        });
      });
    }
  });
});
