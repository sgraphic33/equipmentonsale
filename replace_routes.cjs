const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const startTag = '{/* Hero Section */}';
const endTag = '{/* CTA Section */}';
const startIndex = code.indexOf(startTag);
const endIndex = code.indexOf(endTag);
if (startIndex !== -1 && endIndex !== -1) {
  const replacement = '<Routes>\n        <Route path=\"/\" element={<Home handleContactClick={handleContactClick} />} />\n        <Route path=\"/inventory\" element={<Inventory handleContactClick={handleContactClick} />} />\n      </Routes>\n\n      ';
  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Successfully replaced routes');
} else {
  console.log('Could not find tags');
}
