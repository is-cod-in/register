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
        let recordContent;
        let ttl;
        let data = {};

        if (recordType === 'MX') {
          // Ensure MX record is properly formatted
          if (parts.length < 5) {
            console.error(`Invalid MX record format in file: ${file}, line: ${line}`);
            return;
          }

          const priority = parseInt(parts[2]); // MX record's priority
          recordContent = parts[3]; // MX record content (mail server)

          // Validate if content is a valid hostname and not an IP address
          const isValidHostname = /^[a-zA-Z0-9.-]+$/.test(recordContent);
          if (!isValidHostname) {
            console.error(`Invalid MX record content: ${recordContent} should be a hostname, not an IP address.`);
            return;
          }

          ttl = !isNaN(parts[4]) ? parseInt(parts[4]) : DEFAULT_TTL; // TTL or default
          
          data = {
            type: 'MX',
            name: name,
            content: recordContent,
            priority: priority,
            ttl: ttl
          };
        } else if (recordType === 'TXT') {
          // Handle TXT record with quotes and possible spaces
          recordContent = parts.slice(2, parts.length - 1).join(' ').replace(/['"]+/g, ''); // Remove quotes
          ttl = !isNaN(parts[parts.length - 1]) ? parseInt(parts[parts.length - 1]) : DEFAULT_TTL;

          data = {
            type: 'TXT',
            name: name,
            content: recordContent,
            ttl: ttl
          };
        } else if (recordType === 'CNAME') {
  // Handle CNAME record
  recordContent = parts[2]; // Content for CNAME
  ttl = !isNaN(parts[3]) ? parseInt(parts[3]) : DEFAULT_TTL;

  data = {
    type: 'CNAME',
    name: name, // This should be 'araan.is-cod.in'
    content: recordContent, // This should be 'target-domain.com'
    ttl: ttl
  };
        }
        
        else {
          // Handle other record types (A, AAAA, CNAME)
          recordContent = parts[2]; // Content for A, AAAA, CNAME
          ttl = !isNaN(parts[3]) ? parseInt(parts[3]) : DEFAULT_TTL;

          data = {
            type: recordType,
            name: name,
            content: recordContent,
            ttl: ttl
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
