import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutSpa.module.css';

export default function AboutSpa() {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <div className={styles.textBlock}>
          <h2>“Đến Spa, tìm về một nhịp nghỉ vừa vặn”</h2>
          <p>
            Spapa tin vào sự vừa vặn sẽ tạo nên một trạng thái cân bằng tốt nhất, mang đến một sự tiếp nạp và đón nhận dễ chịu cho khách hàng. Đồng thời khi ghé thăm đều đặn tại nhà Spa, duy trì một lối sống lành mạnh chủ động, bạn sẽ cảm nhận rõ rệt được sự tốt dần lên từng ngày của cơ thể và cả tâm trí.
          </p>
        </div>
      </section>

    <section className={styles.techTeamSection}>
  <div className={styles.techTeamContainer}>
    <div className={styles.techImageBox}>
      <img
        src="https://easysalon.vn/wp-content/uploads/2019/11/khong-gian-spa.jpg"
        alt="Không gian spa"
        className={styles.techImage}
      />
    </div>
    <div className={styles.techContent}>
      <h3 className={styles.techTitle}>
        Đội ngũ kỹ thuật viên giàu kinh nghiệm
      </h3>
      <p className={styles.techText}>
        Các bạn nhân viên Spa được khách thương mến không chỉ vì sự lành nghề,
        kỹ thuật khéo léo mà còn bởi sự tận tâm và hiểu biết sâu sắc về nhu cầu
        của từng khách hàng. Mỗi liệu trình tại Sà Spa là một trải nghiệm được
        cá nhân hóa.
      </p>
      <div className={styles.techAvatarsRow}>
        <div className={styles.avatarGroup}>
          <img
            className={styles.avatar}
            src="https://randomuser.me/api/portraits/women/12.jpg"
            alt="Therapist 1"
          />
          <img
            className={styles.avatar}
            src="https://randomuser.me/api/portraits/women/32.jpg"
            alt="Therapist 2"
          />
          <img
            className={styles.avatar}
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Therapist 3"
          />
        </div>
        <span className={styles.moreExperts}>+5 chuyên gia khác</span>
      </div>
    </div>
  </div>
</section>

      <section className={styles.bannerSection}>
        <div className={styles.bannerText}>
          <h2>Chăm sóc bản thân chưa bao giờ dễ dàng đến thế!</h2>
          <p>Cuộc sống bận rộn? Hãy tự thưởng cho mình một buổi spa thư giãn tại Sà.</p>
          <Link to="/booking" className={styles.bookingButton}>ĐẶT NGAY</Link>
        </div>
        <div className={styles.bannerImage}>
          <img src="/images/spa-2.jpg" alt="Spa thư giãn" />
        </div>
      </section>

      <section className={styles.testimonials}>
        <div className={styles.testimonialsContainer}>
          <h3 className={styles.testimonialsTitle}>Những chia sẻ từ khách hàng</h3>
          <div className={styles.testimonialsGrid}>
            {/* Testimonial 1 */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
              <p className={styles.testimonialText}>
                "Tôi đã trải nghiệm nhiều spa nhưng Sà thực sự khác biệt. Không gian yên tĩnh, dịch vụ chuyên nghiệp và đặc biệt là kỹ thuật massage tuyệt vời."
              </p>
              <div className={styles.testimonialAuthor}>
                <img
                  src="https://randomuser.me/api/portraits/women/65.jpg"
                  alt="Customer 1"
                />
                <div>
                  <h4 className={styles.testimonialName}>Chị Ngọc Anh</h4>
                  <p className={styles.testimonialRole}>Khách hàng thân thiết</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
              <p className={styles.testimonialText}>
                "Sau mỗi lần đến Sà, tôi cảm thấy như được tái tạo năng lượng. Các liệu trình chăm sóc da ở đây rất hiệu quả, da tôi sáng và khỏe hơn hẳn."
              </p>
              <div className={styles.testimonialAuthor}>
                <img
                  src="https://randomuser.me/api/portraits/women/33.jpg"
                  alt="Customer 2"
                />
                <div>
                  <h4 className={styles.testimonialName}>Chị Minh Thu</h4>
                  <p className={styles.testimonialRole}>Khách hàng 3 năm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
