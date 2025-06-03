import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ServiceDetail.module.css';

const serviceData = {
  1: {
    title: 'Massage Thư Giãn',
    image: '/images/service-1.jpg',
    price: 'Từ 500.000 VNĐ',
    desc: 'Thư giãn và nghỉ ngơi với các liệu pháp massage trị liệu được thiết kế để giải tỏa căng thẳng và thúc đẩy sự thư giãn sâu.',
    detail: 'Massage thư giãn là sự kết hợp giữa kỹ thuật xoa bóp truyền thống và hiện đại, giúp giảm đau nhức, tăng cường lưu thông máu, giải tỏa stress và mang lại cảm giác thư thái tuyệt đối.'
  },
  2: {
    title: 'Chăm Sóc Da Mặt',
    image: '/images/service-2.jpg',
    price: 'Từ 250.000 VNĐ',
    desc: 'Làm tươi mới làn da của bạn với các liệu pháp chăm sóc da mặt tiên tiến sử dụng sản phẩm hữu cơ cao cấp và kỹ thuật hiện đại.',
    detail: 'Chăm sóc da mặt tại Spa sử dụng các sản phẩm thiên nhiên, kết hợp công nghệ hiện đại giúp làm sạch sâu, cấp ẩm, trẻ hóa làn da và ngăn ngừa lão hóa hiệu quả.'
  },
  3: {
    title: 'Chăm Sóc Toàn Thân',
    image: '/images/service-3.jpg',
    price: 'Từ 600.000 VNĐ',
    desc: 'Chăm sóc sức khỏe toàn diện với các liệu pháp tổng thể kết hợp thành phần tự nhiên và kỹ thuật trị liệu.',
    detail: 'Trị liệu toàn thân là sự kết hợp giữa massage, xông hơi và các liệu pháp thảo dược, giúp giải độc, tăng sức đề kháng và mang lại cảm giác khỏe mạnh, sảng khoái.'
  },

  4: {
    title: 'Cắt Tóc Nữ',
    image: '/images/hair_cut_men.jpg',
    price: '250.000 VND',
    desc: 'Cắt tóc nữ theo kiểu mới nhất, phù hợp xu hướng thời trang.',
    detail: 'Dịch vụ cắt tóc nữ tạo kiểu hiện đại, tư vấn tạo kiểu phù hợp khuôn mặt và cá tính.'
  },
  5: {
    title: 'Nhuộm Tóc',
    image: '/images/hair_dye.jpg',
    price: '2.500.000 VND',
    desc: 'Nhuộm tóc theo yêu cầu, bảng màu đa dạng.',
    detail: 'Sử dụng sản phẩm nhuộm cao cấp, lên màu chuẩn, giữ tóc mềm mượt và bền màu.'
  },
  6: {
    title: 'Làm Móng Tay',
    image: '/images/nail_art.jpg',
    price: '150.000 VND',
    desc: 'Làm móng tay đẹp, sáng bóng, nhiều mẫu nghệ thuật.',
    detail: 'Chăm sóc móng tay, sơn gel, vẽ nghệ thuật, đảm bảo vệ sinh và an toàn.'
  },
  7: {
    title: 'Làm Móng Chân',
    image: '/images/pedicure.jpg',
    price: '180.000 VND',
    desc: 'Dịch vụ làm móng chân chuyên nghiệp, thư giãn.',
    detail: 'Làm sạch, cắt tỉa, sơn móng chân, massage nhẹ nhàng giúp thư giãn.'
  },
  8: {
    title: 'Massage Toàn Thân',
    image: '/images/full_body_massage.jpg',
    price: '3.000.000 VND',
    desc: 'Massage toàn thân giúp giảm mỏi, thư giãn sâu.',
    detail: 'Kết hợp nhiều kỹ thuật massage, giúp lưu thông máu, giảm đau nhức và căng thẳng.'
  },
  9: {
    title: 'Chăm Sóc Da Mặt',
    image: '/images/skin_care.jpg',
    price: '2.500.000 VND',
    desc: 'Chăm sóc da mặt với sản phẩm thiên nhiên.',
    detail: 'Làm sạch sâu, dưỡng ẩm, trẻ hóa làn da bằng liệu trình chuyên biệt.'
  },
  10: {
    title: 'Chăm Sóc Móng Chân',
    image: '/images/foot_care.jpg',
    price: '500.000 VND',
    desc: 'Chăm sóc móng chân, giúp móng khỏe mạnh và đẹp.',
    detail: 'Cắt tỉa, làm sạch, dưỡng móng chân, kết hợp massage thư giãn.'
  },
  11: {
    title: 'Massage Relax',
    image: '/images/relax.jpg',
    price: '300.000 VND',
    desc: 'Dịch vụ massage thư giãn, giảm stress.',
    detail: 'Massage nhẹ nhàng, không gian yên tĩnh, giúp tinh thần sảng khoái.'
  },
  12: {
    title: 'Massage Bụng',
    image: '/images/bung.jpg',
    price: '300.000 VND',
    desc: 'Giúp giảm mỡ bụng, săn chắc vùng bụng.',
    detail: 'Massage chuyên sâu vùng bụng, hỗ trợ giảm mỡ, cải thiện vóc dáng.'
  }
};

export default function ServiceDetail() {
  const { id } = useParams();
  const service = serviceData[id];

  if (!service) return <div className={styles.notFound}>Dịch vụ không tồn tại.</div>;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.card}>
        <img src={service.image} alt={service.title} className={styles.image} />
        <div className={styles.info}>
          <h1 className={styles.title}>{service.title}</h1>
          <div className={styles.price}>{service.price}</div>
          <p className={styles.desc}>{service.desc}</p>
          <div className={styles.detail}>{service.detail}</div>
          <Link to="/booking" className={styles.bookBtn}>Đặt lịch ngay</Link>
        </div>
      </div>
      <Link to="/" className={styles.backLink}>← Quay về trang chủ</Link>
    </div>
  );
}