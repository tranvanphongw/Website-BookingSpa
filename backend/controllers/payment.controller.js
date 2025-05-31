const config = require('../config/momo.config');
const crypto = require('crypto');
const https = require('https');
const { addPayment, getPaymentsByCustomer, getPaymentsByBooking, getAllPayments } = require('../models/payment.model');
const { updateBooking } = require('../models/booking.model');

const {
  partnerCode,
  accessKey,
  secretKey,
  redirectUrl,
  ipnUrl,
  requestType,
} = config;

exports.createPayment = (req, res) => {
  const { amount, orderInfo, orderId, extraData } = req.body;

  const _orderId = orderId || partnerCode + new Date().getTime();
  const requestId = partnerCode + new Date().getTime();

  const partnerName = 'Test';
  const storeId = 'MomoTestStore';
  const orderGroupId = '';
  const autoCapture = true;
  const lang = 'vi';

  const amountStr = amount.toString();
  const extraDataStr = typeof extraData === 'string' ? extraData : (extraData ? JSON.stringify(extraData) : '');

  const rawSignature =
    `accessKey=${accessKey}` +
    `&amount=${amountStr}` +
    `&extraData=${extraDataStr}` +
    `&ipnUrl=${ipnUrl}` +       
    `&orderId=${_orderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}` +   
    `&requestId=${requestId}` +
    `&requestType=${requestType}`;

  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  const requestBody = JSON.stringify({
    partnerCode,
    partnerName,
    storeId,
    requestId,
    amount: amountStr,
    orderId: _orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData: extraDataStr,
    orderGroupId,
    signature,
  });

  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.payUrl) {
          return res.json({ payUrl: result.payUrl });
        } else {
          return res.status(500).json({ error: 'Không tạo được đơn thanh toán', details: result });
        }
      } catch (err) {
        return res.status(500).json({ error: 'Lỗi phân tích phản hồi MoMo' });
      }
    });
  });

  request.on('error', (e) => {
    console.error('Error payment request:', e);
    return res.status(500).json({ error: e.message });
  });

  request.write(requestBody);
  request.end();
};

exports.paymentReturn = (req, res) => {
  console.log('Payment return:', req.query);
  const { resultCode, orderId } = req.query;

  const frontendBookingUrl = 'http://localhost:3000/booking';
  res.redirect(`${frontendBookingUrl}?resultCode=${resultCode}&orderId=${orderId}`);
};

exports.paymentNotify = async (req, res) => {
  try {
    const data = req.body;

    const {
      partnerCode: receivedPartnerCode,
      orderId,
      requestId,
      signature: momoSignature,
      resultCode,
      amount,
      extraData = '',
      ipnUrl: receivedIpnUrl,
      orderInfo,
      redirectUrl: receivedRedirectUrl,
      requestType,
    } = data;

    if (!accessKey || !secretKey) {
      console.error('MOMO keys not set in config');
      return res.status(500).json({ resultCode: 1, message: 'Server config error' });
    }

    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData || ''}` +
      `&ipnUrl=${receivedIpnUrl || ''}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${receivedPartnerCode}` +
      `&redirectUrl=${receivedRedirectUrl || ''}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType || ''}` +
      `&resultCode=${resultCode}`;

    const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    console.log('--- MoMo Webhook Notify ---');
    console.log('Raw Signature:', rawSignature);
    console.log('Received Signature:', momoSignature);
    console.log('Expected Signature:', expectedSignature);

    if (momoSignature !== expectedSignature) {
      console.warn('Signature mismatch detected, but processing webhook anyway');
    }

    if (parseInt(resultCode, 10) === 0) {
      let MALICH = null;
      let MAKH = null;

      try {
        if (extraData) {
          const extra = JSON.parse(extraData);
          MALICH = extra.MALICH;
          MAKH = extra.MAKH;
        }
      } catch {
        console.warn('extraData is not valid JSON:', extraData);
      }

      if (!MALICH) {
        MALICH = parseInt(orderId.replace(/^MOMO/, ''), 10);
      }

      if (typeof MALICH !== 'number' || isNaN(MALICH)) {
        console.error('Invalid MALICH:', MALICH);
        return res.status(400).json({ resultCode: 1, message: 'Invalid MALICH' });
      }

      try {
        const { insertedId, receipt } = await addPayment({
          MALICH,
          MAKH: MAKH || 0,
          SOTIEN: amount,
          NGAYTHANHTOAN: new Date(),
          HINHTHUCTHANHTOAN: 'MoMo',
        });
        console.log(`Payment record added with ID=${insertedId}`, receipt);
      } catch (paymentErr) {
        console.error('Add payment error:', paymentErr);
        return res.status(500).json({ resultCode: 1, message: 'Add payment failed' });
      }

      try {
        await updateBooking({ MALICH, TRANGTHAI: 'Paid' });
        console.log(`Booking status updated to Paid for MALICH=${MALICH}`);
      } catch (updateErr) {
        console.error('Update booking error:', updateErr);
        return res.status(500).json({ resultCode: 1, message: 'Update booking failed' });
      }

      return res.status(204).send();
    } else {
      console.warn(`Payment failed or cancelled: orderId=${orderId}, resultCode=${resultCode}`);
      return res.status(204).send();
    }
  } catch (err) {
    console.error('Webhook notify error:', err);
    return res.status(500).json({ resultCode: 1, message: 'Internal server error' });
  }
};

exports.getPaymentsByCustomer = async (req, res) => {
  try {
    const MAKH = parseInt(req.params.MAKH);
    const payments = await getPaymentsByCustomer(MAKH);
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPaymentsByBooking = async (req, res) => {
  try {
    const MALICH = parseInt(req.params.MALICH);
    const payments = await getPaymentsByBooking(MALICH);
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await getAllPayments();
    res.json(payments);
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

