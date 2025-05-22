const sql = require('mssql');
const bcrypt = require('bcrypt');

async function checkEmailExists(EMAIL) {
  const pool = await sql.connect(process.env.DB_CONNECTION);

  const resultCustomer = await pool.request()
    .input('EMAIL', sql.VarChar, EMAIL)
    .query('SELECT * FROM KHACHHANG WHERE EMAIL = @EMAIL');

  const resultAdmin = await pool.request()
    .input('EMAIL', sql.VarChar, EMAIL)
    .query('SELECT * FROM QUANTRIVIEN WHERE EMAIL = @EMAIL');

  return resultCustomer.recordset.length > 0 || resultAdmin.recordset.length > 0;
}

async function registerUser({ TEN, DCHI, DTHOAI, EMAIL, MATKHAU, ROLE }) {
  const pool = await sql.connect(process.env.DB_CONNECTION);

  const hashedPassword = await bcrypt.hash(MATKHAU, 10);

  if (ROLE === 'admin') {
    return await pool.request()
      .input('TEN', sql.NVarChar, TEN)
      .input('DCHI', sql.NVarChar, DCHI)
      .input('DTHOAI', sql.VarChar, DTHOAI)
      .input('EMAIL', sql.VarChar, EMAIL)
      .input('MATKHAU', sql.VarChar, hashedPassword)
      .query('INSERT INTO QUANTRIVIEN (TEN, DCHI, DTHOAI, EMAIL, MATKHAU) VALUES (@TEN, @DCHI, @DTHOAI, @EMAIL, @MATKHAU)');
  } else {
    return await pool.request()
      .input('TEN', sql.NVarChar, TEN)
      .input('DCHI', sql.NVarChar, DCHI)
      .input('DTHOAI', sql.VarChar, DTHOAI)
      .input('EMAIL', sql.VarChar, EMAIL)
      .input('MATKHAU', sql.VarChar, hashedPassword)
      .query('INSERT INTO KHACHHANG (TEN, DCHI, DTHOAI, EMAIL, MATKHAU) VALUES (@TEN, @DCHI, @DTHOAI, @EMAIL, @MATKHAU)');
  }
}

async function findUserByEmail(EMAIL) {
  const pool = await sql.connect(process.env.DB_CONNECTION);

  const resultCustomer = await pool.request()
    .input('EMAIL', sql.VarChar, EMAIL)
    .query('SELECT * FROM KHACHHANG WHERE EMAIL = @EMAIL');

  if (resultCustomer.recordset.length > 0) {
    return { user: resultCustomer.recordset[0], type: 'customer' };
  }

  const resultAdmin = await pool.request()
    .input('EMAIL', sql.VarChar, EMAIL)
    .query('SELECT * FROM QUANTRIVIEN WHERE EMAIL = @EMAIL');

  if (resultAdmin.recordset.length > 0) {
    return { user: resultAdmin.recordset[0], type: 'admin' };
  }

  return null;
}

module.exports = {
  checkEmailExists,
  registerUser,
  findUserByEmail
};
