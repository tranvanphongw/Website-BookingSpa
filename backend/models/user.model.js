const { poolPromise, sql } = require('../config/db');

const findUserByEmail = async (email) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('EMAIL', sql.VarChar, email)
    .query('SELECT * FROM KHACHHANG WHERE EMAIL = @EMAIL');
  
  return result.recordset[0] || null;
};

const updateUserPassword = async (maKh, hashedPassword) => {
  const pool = await poolPromise;
  await pool.request()
    .input('MAKH', sql.Int, maKh)
    .input('MATKHAU', sql.VarChar, hashedPassword)
    .query('UPDATE KHACHHANG SET MATKHAU = @MATKHAU WHERE MAKH = @MAKH');
};

module.exports = {
  findUserByEmail,
  updateUserPassword,
};
