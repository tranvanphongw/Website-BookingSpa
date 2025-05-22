const sql = require('mssql');
const { poolPromise } = require('../config/db');

async function getAllServices(search, category) {
  const pool = await poolPromise;

  let query = 'SELECT * FROM DICHVU';
  let params = [];

  if (search) {
    query += ' WHERE TEN LIKE @search';
    params.push({ name: 'search', type: sql.NVarChar, value: `%${search}%` });
  }

  if (category) {
    if (params.length > 0) {
      query += ' AND MALOAI = @category';
    } else {
      query += ' WHERE MALOAI = @category';
    }
    params.push({ name: 'category', type: sql.Int, value: category });
  }

  const request = pool.request();
  params.forEach(param => {
    request.input(param.name, param.type, param.value);
  });

  const result = await request.query(query);
  return result.recordset;
}

async function getAllCategories() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM LOAIDICHVU');
  return result.recordset;
}

async function addService({ TEN, MOTA, GIATIEN, MALOAI, THOIGIANTHUCHIEN, imageUrl }) {
  const pool = await poolPromise;

  const checkLoaiDichVu = await pool.request()
    .input('MALOAI', sql.Int, MALOAI)
    .query('SELECT * FROM LOAIDICHVU WHERE MALOAI = @MALOAI');

  if (checkLoaiDichVu.recordset.length === 0) {
    throw new Error('Loại dịch vụ không hợp lệ');
  }

  await pool.request()
    .input('TEN', sql.NVarChar, TEN)
    .input('MOTA', sql.NVarChar, MOTA)
    .input('GIATIEN', sql.Decimal, GIATIEN)
    .input('MALOAI', sql.Int, MALOAI)
    .input('THOIGIANTHUCHIEN', sql.Int, THOIGIANTHUCHIEN)
    .input('HINHANH', sql.NVarChar, imageUrl)
    .query('INSERT INTO DICHVU (TEN, MOTA, GIATIEN, MALOAI, THOIGIANTHUCHIEN, HINHANH) VALUES (@TEN, @MOTA, @GIATIEN, @MALOAI, @THOIGIANTHUCHIEN, @HINHANH)');
}

async function getServiceById(id) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('ID', sql.Int, id)
    .query('SELECT * FROM DICHVU WHERE MADV = @ID');

  if (result.recordset.length === 0) {
    return null;
  }
  return result.recordset[0];
}

async function updateService(id, { TEN, MOTA, GIATIEN, MALOAI, THOIGIANTHUCHIEN, imageUrl }) {
  const pool = await poolPromise;

  const request = pool.request()
    .input('ID', sql.Int, id)
    .input('TEN', sql.NVarChar, TEN)
    .input('MOTA', sql.NVarChar, MOTA)
    .input('GIATIEN', sql.Decimal, GIATIEN)
    .input('MALOAI', sql.Int, MALOAI)
    .input('THOIGIANTHUCHIEN', sql.Int, THOIGIANTHUCHIEN);

  let query = 'UPDATE DICHVU SET TEN = @TEN, MOTA = @MOTA, GIATIEN = @GIATIEN, MALOAI = @MALOAI, THOIGIANTHUCHIEN = @THOIGIANTHUCHIEN';

  if (imageUrl) {
    request.input('HINHANH', sql.NVarChar, imageUrl);
    query += ', HINHANH = @HINHANH';
  }

  query += ' WHERE MADV = @ID';

  await request.query(query);
}

async function deleteService(id) {
  const pool = await poolPromise;
  await pool.request()
    .input('ID', sql.Int, id)
    .query('DELETE FROM DICHVU WHERE MADV = @ID');
}

module.exports = {
  getAllServices,
  getAllCategories,
  addService,
  getServiceById,
  updateService,
  deleteService
};
