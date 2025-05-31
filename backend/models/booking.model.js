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

async function getBookings(MAKH) {
  const pool = await poolPromise;
  const request = pool.request();
  let sqlText = `
    SELECT
      l.MALICH,
      l.MAKH,
      k.TEN       AS TENKH,
      n.TEN       AS TENNV,
      t.TENLOAI   AS LOAIDV,
      d.TEN       AS TENDV,
      d.GIATIEN,
      l.MAGOI,
      g.TEN       AS TENGOI,
      g.GIATIEN   AS GIAGOI,
      l.THOIGIANBATDAU,
      l.THOIGIANKETTHUC,
      l.TRANGTHAI
    FROM LICHDAT l
    JOIN KHACHHANG  k ON l.MAKH   = k.MAKH
    JOIN NHANVIEN   n ON l.MANV   = n.MANV
    LEFT JOIN DICHVU     d ON l.MADV   = d.MADV
    LEFT JOIN LOAIDICHVU t ON d.MALOAI = t.MALOAI
    LEFT JOIN GOIDICHVU  g ON l.MAGOI  = g.MAGOI
  `;

  if (MAKH) {
    sqlText += ` WHERE l.MAKH = @MAKH `;
    request.input('MAKH', sql.Int, MAKH);
  }

  sqlText += ` ORDER BY l.THOIGIANBATDAU DESC`;

  const result = await request.query(sqlText);
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
        d.GIATIEN     AS GIATIEN,
        l.MANV,
        n.TEN         AS TENNV,
        l.MAGOI,
        g.TEN         AS TENGOI,
        g.GIATIEN     AS GIAGOI,
        l.THOIGIANBATDAU,
        l.THOIGIANKETTHUC,
        l.TRANGTHAI
      FROM LICHDAT l
      JOIN KHACHHANG  k ON l.MAKH   = k.MAKH
      JOIN NHANVIEN   n ON l.MANV   = n.MANV
      LEFT JOIN DICHVU     d ON l.MADV   = d.MADV
      LEFT JOIN GOIDICHVU  g ON l.MAGOI  = g.MAGOI
      WHERE l.MALICH = @MALICH
    `);
  return result.recordset[0];
}

async function createBooking({ MAKH, MANV, MADV, MAGOI, THOIGIANBATDAU, THOIGIANKETTHUC, TRANGTHAI }) {
  const pool = await poolPromise;

  if (MAGOI) {
    await pool.request()
      .input('MAKH', sql.Int, MAKH)
      .input('MANV', sql.Int, MANV)
      .input('MAGOI', sql.Int, MAGOI)
      .input('THOIGIANBATDAU', sql.DateTimeOffset, new Date(THOIGIANBATDAU))
      .input('TRANGTHAI', sql.NVarChar, TRANGTHAI)
      .query(`
        INSERT INTO LICHDAT (MAKH, MANV, MAGOI, THOIGIANBATDAU, TRANGTHAI)
        VALUES (@MAKH, @MANV, @MAGOI, @THOIGIANBATDAU, @TRANGTHAI)
      `);
  } else {
    const services = Array.isArray(MADV) ? MADV : [MADV];
    for (const id of services) {
      await pool.request()
        .input('MAKH', sql.Int, MAKH)
        .input('MANV', sql.Int, MANV)
        .input('MADV', sql.Int, id)
        .input('THOIGIANBATDAU', sql.DateTimeOffset, new Date(THOIGIANBATDAU))
        .input('THOIGIANKETTHUC', sql.DateTimeOffset, THOIGIANKETTHUC ? new Date(THOIGIANKETTHUC) : null)
        .input('TRANGTHAI', sql.NVarChar, TRANGTHAI)
        .query(`
          INSERT INTO LICHDAT
            (MAKH, MANV, MADV, THOIGIANBATDAU, THOIGIANKETTHUC, TRANGTHAI)
          VALUES
            (@MAKH, @MANV, @MADV, @THOIGIANBATDAU, @THOIGIANKETTHUC, @TRANGTHAI);
        `);
    }
  }
}

async function updateBooking({ MALICH, TRANGTHAI }) {
  const pool = await poolPromise;
  console.log(`Updating booking status to Paid for MALICH=${MALICH}`);
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

async function isEmployeeBusy({ MANV, THOIGIANBATDAU, THOIGIANKETTHUC }) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MANV', sql.Int, MANV)
    .input('THOIGIANBATDAU', sql.DateTimeOffset, new Date(THOIGIANBATDAU))
    .input('THOIGIANKETTHUC', sql.DateTimeOffset, new Date(THOIGIANKETTHUC))
    .query(`
      SELECT 1 FROM LICHDAT
      WHERE MANV = @MANV
        AND @THOIGIANBATDAU < SWITCHOFFSET(CAST(THOIGIANKETTHUC AS datetimeoffset), '+00:00')
        AND @THOIGIANKETTHUC > SWITCHOFFSET(CAST(THOIGIANBATDAU AS datetimeoffset), '+00:00')
    `);
  return result.recordset.length > 0;
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
  isEmployeeBusy,
};
