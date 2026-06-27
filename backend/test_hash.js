const bcrypt = require('bcryptjs');

async function test() {
  const hash = '$2b$10$KQU0EwtHeNXtJ3AtWGwgX.l4u7ROQp./TKpQxiuroCInYq3x5jq82';
  console.log("admin:", await bcrypt.compare('admin', hash));
  console.log("admin123:", await bcrypt.compare('admin123', hash));
  console.log("password:", await bcrypt.compare('password', hash));
}

test();
