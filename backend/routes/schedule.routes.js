require('dotenv').config();
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { poolPromise } = require('../config/db');

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT LS.*, NV.TEN as TENNHANVIEN 
      FROM LICHLAMVIEC LS
      JOIN NHANVIEN NV ON LS.MANV = NV.MANV
      ORDER BY LS.NGAYLAM DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error getting all schedules:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve schedules', 
      error: error.message 
    });
  }
});

// Get schedules by date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    console.log('Received date:', date);
    
    // Format date to YYYY-MM-DD for SQL Server
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    const formattedDate = dateObj.toISOString().split('T')[0];
    console.log('Formatted date:', formattedDate);
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('NGAYLAM', sql.Date, formattedDate)
      .query(`
        SELECT LS.*, NV.TEN as TENNHANVIEN
        FROM LICHLAMVIEC LS
        JOIN NHANVIEN NV ON LS.MANV = NV.MANV
        WHERE CONVERT(DATE, LS.NGAYLAM) = CONVERT(DATE, @NGAYLAM)
        ORDER BY LS.THOIGIANBATDAU
      `);
    
    console.log('Query result count:', result.recordset.length);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error getting schedules by date:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve schedules for date', 
      error: error.message 
    });
  }
});

// Get schedules by employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('MANV', sql.Int, parseInt(employeeId, 10))
      .query(`
        SELECT LS.*, NV.TEN as TENNHANVIEN
        FROM LICHLAMVIEC LS
        JOIN NHANVIEN NV ON LS.MANV = NV.MANV
        WHERE LS.MANV = @MANV
        ORDER BY LS.NGAYLAM DESC
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error getting schedules by employee:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve employee schedules', 
      error: error.message 
    });
  }
});

// Update the POST route with better debugging
router.post('/', async (req, res) => {
  try {
    console.log('Schedule POST request body:', req.body);
    const { MANV, NGAYLAM, THOIGIANBATDAU, THOIGIANKETTHUC, GHICHU, TRANGTHAI = 1 } = req.body;
    
    // Validate required fields
    if (!MANV || !NGAYLAM || !THOIGIANBATDAU || !THOIGIANKETTHUC) {
      console.log('Missing required fields:', { 
        MANV, NGAYLAM, THOIGIANBATDAU, THOIGIANKETTHUC 
      });
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: 'MANV, NGAYLAM, THOIGIANBATDAU, THOIGIANKETTHUC' 
      });
    }
    
    // Format date to YYYY-MM-DD for SQL Server
    const dateObj = new Date(NGAYLAM);
    if (isNaN(dateObj.getTime())) {
      console.log('Invalid date format:', NGAYLAM);
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    const formattedDate = dateObj.toISOString().split('T')[0];
    console.log('Formatted date:', formattedDate);
    
    // Check if the table structure matches our expectations
    const pool = await poolPromise;
    
    console.log('Checking table structure...');
    const tableResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'LICHLAMVIEC'
    `);
    
    console.log('LICHLAMVIEC table structure:', tableResult.recordset);
    
    // Check if all required columns exist
    const columns = tableResult.recordset.map(col => col.COLUMN_NAME);
    const requiredColumns = ['MANV', 'NGAYLAM', 'THOIGIANBATDAU', 'THOIGIANKETTHUC', 'TRANGTHAI'];
    const missingColumns = requiredColumns.filter(col => !columns.includes(col));
    
    if (missingColumns.length > 0) {
      console.error('Missing columns in LICHLAMVIEC table:', missingColumns);
      return res.status(500).json({ 
        message: 'Database schema error: Missing columns', 
        missingColumns 
      });
    }
    
    // Build the SQL query dynamically based on available columns
    let columnNames = ['MANV', 'NGAYLAM', 'THOIGIANBATDAU', 'THOIGIANKETTHUC'];
    let valueParams = ['@MANV', '@NGAYLAM', '@THOIGIANBATDAU', '@THOIGIANKETTHUC'];
    
    if (columns.includes('GHICHU')) {
      columnNames.push('GHICHU');
      valueParams.push('@GHICHU');
    }
    
    if (columns.includes('TRANGTHAI')) {
      columnNames.push('TRANGTHAI');
      valueParams.push('@TRANGTHAI');
    }
    
    const query = `
      INSERT INTO LICHLAMVIEC (${columnNames.join(', ')})
      VALUES (${valueParams.join(', ')})
    `;
    
    console.log('Executing query:', query);
    console.log('With parameters:', { 
      MANV: parseInt(MANV, 10), 
      NGAYLAM: formattedDate,
      THOIGIANBATDAU,
      THOIGIANKETTHUC,
      GHICHU: GHICHU || null,
      TRANGTHAI
    });
    
    const request = pool.request()
      .input('MANV', sql.Int, parseInt(MANV, 10))
      .input('NGAYLAM', sql.Date, formattedDate)
      .input('THOIGIANBATDAU', sql.VarChar(10), THOIGIANBATDAU)
      .input('THOIGIANKETTHUC', sql.VarChar(10), THOIGIANKETTHUC);
    
    if (columns.includes('GHICHU')) {
      request.input('GHICHU', sql.NVarChar(255), GHICHU || null);
    }
    
    if (columns.includes('TRANGTHAI')) {
      request.input('TRANGTHAI', sql.Int, TRANGTHAI);
    }
    
    await request.query(query);
    
    res.status(201).json({ message: 'Schedule added successfully' });
  } catch (error) {
    console.error('Detailed error adding schedule:', error);
    // Extract more detailed SQL error information if available
    const sqlErrorInfo = error.originalError ? 
      {
        number: error.originalError.number,
        state: error.originalError.state,
        class: error.originalError.class,
        message: error.originalError.message,
        serverName: error.originalError.serverName,
      } : {};
    
    res.status(500).json({ 
      message: 'Failed to add schedule', 
      error: error.message,
      sqlError: sqlErrorInfo
    });
  }
});

// Update schedule
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { MANV, NGAYLAM, THOIGIANBATDAU, THOIGIANKETTHUC, GHICHU, TRANGTHAI = 1 } = req.body;
    
    // Validate required fields
    if (!MANV || !NGAYLAM || !THOIGIANBATDAU || !THOIGIANKETTHUC) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: 'MANV, NGAYLAM, THOIGIANBATDAU, THOIGIANKETTHUC' 
      });
    }
    
    // Format date to YYYY-MM-DD for SQL Server
    const dateObj = new Date(NGAYLAM);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    const formattedDate = dateObj.toISOString().split('T')[0];
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID', sql.Int, parseInt(id, 10))
      .input('MANV', sql.Int, parseInt(MANV, 10))
      .input('NGAYLAM', sql.Date, formattedDate)
      .input('THOIGIANBATDAU', sql.VarChar(10), THOIGIANBATDAU)
      .input('THOIGIANKETTHUC', sql.VarChar(10), THOIGIANKETTHUC)
      .input('GHICHU', sql.NVarChar(255), GHICHU || null)
      .input('TRANGTHAI', sql.Int, TRANGTHAI)
      .query(`
        UPDATE LICHLAMVIEC 
        SET MANV = @MANV, 
            NGAYLAM = @NGAYLAM, 
            THOIGIANBATDAU = @THOIGIANBATDAU, 
            THOIGIANKETTHUC = @THOIGIANKETTHUC, 
            GHICHU = @GHICHU,
            TRANGTHAI = @TRANGTHAI
        WHERE MALICH = @ID
      `);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ 
      message: 'Failed to update schedule', 
      error: error.message 
    });
  }
});

// Delete schedule
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ID', sql.Int, parseInt(id, 10))
      .query('DELETE FROM LICHLAMVIEC WHERE MALICH = @ID');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ 
      message: 'Failed to delete schedule', 
      error: error.message 
    });
  }
});

async function fixLichLamViecTable() {
  try {
    console.log('Connecting to database...');
    const pool = await poolPromise;
    
    console.log('Checking if LICHLAMVIEC table exists...');
    const tableCheck = await pool.request().query(`
      SELECT COUNT(*) as tableExists 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'LICHLAMVIEC'
    `);
    
    const tableExists = tableCheck.recordset[0].tableExists > 0;
    console.log('LICHLAMVIEC table exists:', tableExists);
    
    if (!tableExists) {
      console.log('Creating LICHLAMVIEC table...');
      await pool.request().query(`
        CREATE TABLE LICHLAMVIEC (
          MALICH INT IDENTITY(1,1) PRIMARY KEY,
          MANV INT NOT NULL,
          NGAYLAM DATE NOT NULL,
          THOIGIANBATDAU VARCHAR(10) NOT NULL,
          THOIGIANKETTHUC VARCHAR(10) NOT NULL,
          GHICHU NVARCHAR(255) NULL,
          TRANGTHAI INT NOT NULL DEFAULT 1,
          FOREIGN KEY (MANV) REFERENCES NHANVIEN(MANV)
        )
      `);
      console.log('LICHLAMVIEC table created successfully');
    } else {
      // Table exists, check columns
      console.log('Checking LICHLAMVIEC table columns...');
      const columnsResult = await pool.request().query(`
        SELECT COLUMN_NAME, DATA_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'LICHLAMVIEC'
      `);
      
      console.log('Current table columns:');
      const columns = columnsResult.recordset;
      const columnNames = columns.map(c => c.COLUMN_NAME);
      
      console.table(columns);
      
      // Check required columns and add if missing
      const requiredColumns = [
        { name: 'MALICH', type: 'INT IDENTITY(1,1) PRIMARY KEY', check: 'MALICH' },
        { name: 'MANV', type: 'INT NOT NULL', check: 'MANV' },
        { name: 'NGAYLAM', type: 'DATE NOT NULL', check: 'NGAYLAM' },
        { name: 'THOIGIANBATDAU', type: 'VARCHAR(10) NOT NULL', check: 'THOIGIANBATDAU' },
        { name: 'THOIGIANKETTHUC', type: 'VARCHAR(10) NOT NULL', check: 'THOIGIANKETTHUC' },
        { name: 'GHICHU', type: 'NVARCHAR(255) NULL', check: 'GHICHU' },
        { name: 'TRANGTHAI', type: 'INT NOT NULL DEFAULT 1', check: 'TRANGTHAI' }
      ];
      
      for (const column of requiredColumns) {
        if (!columnNames.includes(column.check)) {
          console.log(`Adding missing column: ${column.name}`);
          await pool.request().query(`
            ALTER TABLE LICHLAMVIEC 
            ADD ${column.name} ${column.type}
          `);
          console.log(`Column ${column.name} added successfully`);
        }
      }
      
      // Verify primary key
      const pkResult = await pool.request().query(`
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + '.' + QUOTENAME(CONSTRAINT_NAME)), 'IsPrimaryKey') = 1
        AND TABLE_NAME = 'LICHLAMVIEC'
      `);
      
      if (pkResult.recordset.length === 0) {
        console.log('Adding primary key on MALICH column');
        await pool.request().query(`
          ALTER TABLE LICHLAMVIEC
          ADD PRIMARY KEY (MALICH)
        `);
      }
      
      // Verify foreign key
      const fkResult = await pool.request().query(`
        SELECT *
        FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
        WHERE CONSTRAINT_NAME LIKE '%LICHLAMVIEC%'
      `);
      
      if (fkResult.recordset.length === 0) {
        console.log('Adding foreign key on MANV column');
        try {
          await pool.request().query(`
            ALTER TABLE LICHLAMVIEC
            ADD CONSTRAINT FK_LICHLAMVIEC_MANV FOREIGN KEY (MANV) REFERENCES NHANVIEN(MANV)
          `);
        } catch (fkError) {
          console.log('Could not add foreign key, might already exist or NHANVIEN table issue:', fkError.message);
        }
      }
    }
    
    // Final check to verify the table is correctly configured
    const finalColumnsResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'LICHLAMVIEC'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Final LICHLAMVIEC table structure:');
    console.table(finalColumnsResult.recordset);
    
    console.log('Table verification and fixes completed successfully');
  } catch (error) {
    console.error('Error fixing LICHLAMVIEC table:', error);
  } finally {
    try {
      await sql.close();
    } catch (err) {
      console.error('Error closing SQL connection:', err);
    }
    console.log('Script completed');
  }
}

fixLichLamViecTable().catch(console.error);

module.exports = router;