const bcrypt = require('bcrypt');

async function generateHash() {
    const password = 'concuncon'; // Thay bằng mật khẩu bạn muốn mã hóa
    const saltRounds = 10; // Số vòng băm, 10 là giá trị phổ biến
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated Hash:', hash);
}

generateHash();
