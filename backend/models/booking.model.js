const { sql, poolPromise } = require('../config/db');

async function getCustomers() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT MAKH, TEN
    FROM KHACHHANG
    ORDER BY TEN
  `);
  return result.recordset;
}

async function getCustomerById(MAKH) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MAKH', sql.Int, MAKH)
    .query(`
      SELECT MAKH, TEN
      FROM KHACHHANG
      WHERE MAKH = @MAKH
    `);
  return result.recordset[0];
}

async function getServiceTypes() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT MALOAI, TENLOAI
    FROM LOAIDICHVU
    ORDER BY TENLOAI
  `);
  return result.recordset;
}

async function getServices(type) {
  const pool = await poolPromise;
  const request = pool.request();
  let sqlText = 'SELECT MADV, TEN, THOIGIANTHUCHIEN FROM DICHVU';
  if (type) {
    sqlText += ' WHERE MALOAI = @type';
    request.input('type', sql.Int, type);
  }
  sqlText += ' ORDER BY TEN';
  const result = await request.query(sqlText);
  return result.recordset;
}

async function getEmployees() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT MANV, TEN
    FROM NHANVIEN
    ORDER BY TEN
  `);
  return result.recordset;
}

async function getBookings() {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT
      l.MALICH,
      k.TEN       AS TENKH,
      n.TEN       AS TENNV,
      t.TENLOAI   AS LOAIDV,
      d.TEN       AS TENDV,
      d.GIATIEN,
      l.THOIGIANBATDAU,
      l.THOIGIANKETTHUC,
      l.TRANGTHAI
    FROM LICHDAT l
    JOIN KHACHHANG  k ON l.MAKH   = k.MAKH
    JOIN NHANVIEN   n ON l.MANV   = n.MANV
    JOIN DICHVU     d ON l.MADV   = d.MADV
    JOIN LOAIDICHVU t ON d.MALOAI = t.MALOAI
    ORDER BY l.THOIGIANBATDAU DESC
  `);
  return result.recordset;
}

async function getBookingById(MALICH) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MALICH', sql.Int, MALICH)
    .query(`
      SELECT
        l.MALICH,
        l.MAKH,
        k.TEN         AS TENKH,
        l.MADV,
        d.TEN         AS TENDV,
        d.GIATIEN,
        l.MANV,
        n.TEN         AS TENNV,
        l.THOIGIANBATDAU,
        l.THOIGIANKETTHUC,
        l.TRANGTHAI
      FROM LICHDAT l
      JOIN KHACHHANG  k ON l.MAKH   = k.MAKH
      JOIN NHANVIEN   n ON l.MANV   = n.MANV
      JOIN DICHVU     d ON l.MADV   = d.MADV
      WHERE l.MALICH = @MALICH
    `);
  return result.recordset[0];
}

async function createBooking({ MAKH, MANV, MADV, THOIGIANBATDAU, TRANGTHAI }) {
  const pool = await poolPromise;
  const services = Array.isArray(MADV) ? MADV : [MADV];

  for (const id of services) {
    await pool.request()
      .input('MAKH', sql.Int, MAKH)
      .input('MANV', sql.Int, MANV)
      .input('MADV', sql.Int, id)
      .input('THOIGIANBATDAU', sql.DateTimeOffset, new Date(THOIGIANBATDAU))
      .input('TRANGTHAI', sql.NVarChar, TRANGTHAI)
      .query(`
        DECLARE @end DATETIME = (
          SELECT DATEADD(MINUTE, THOIGIANTHUCHIEN, @THOIGIANBATDAU)
          FROM DICHVU WHERE MADV = @MADV
        );
        INSERT INTO LICHDAT
          (MAKH, MANV, MADV, THOIGIANBATDAU, THOIGIANKETTHUC, TRANGTHAI)
        VALUES
          (@MAKH, @MANV, @MADV, @THOIGIANBATDAU, @end, @TRANGTHAI);
      `);
  }
}

async function updateBooking({ MALICH, TRANGTHAI }) {
  const pool = await poolPromise;
  await pool.request()
    .input('MALICH', sql.Int, MALICH)
    .input('TRANGTHAI', sql.NVarChar, TRANGTHAI)
    .query(`
      UPDATE LICHDAT
      SET TRANGTHAI = @TRANGTHAI
      WHERE MALICH = @MALICH
    `);
}

async function cancelBooking(MALICH) {
  const pool = await poolPromise;
  await pool.request()
    .input('MALICH', sql.Int, MALICH)
    .query(`DELETE FROM THANHTOAN WHERE MALICH = @MALICH`);

  await pool.request()
    .input('MALICH', sql.Int, MALICH)
    .query(`DELETE FROM LICHDAT WHERE MALICH = @MALICH`);
}

module.exports = {
  getCustomers,
  getCustomerById,
  getServiceTypes,
  getServices,
  getEmployees,
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
};
