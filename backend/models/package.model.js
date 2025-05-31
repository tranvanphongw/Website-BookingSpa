const { sql, poolPromise } = require('../config/db');

async function getPackages() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT MAGOI, MALOAI, TEN, GIATIEN
    FROM GOIDICHVU
    ORDER BY TEN
  `);
  return result.recordset;
}

async function getPackageDetails(MAGOI) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MAGOI', sql.Int, MAGOI)
    .query(`
      SELECT gc.MADV, d.TEN, d.GIATIEN
      FROM GOI_CHITIET gc
      JOIN DICHVU d ON gc.MADV = d.MADV
      WHERE gc.MAGOI = @MAGOI
    `);
  return result.recordset;
}

module.exports = {
  getPackages,
  getPackageDetails,
};  