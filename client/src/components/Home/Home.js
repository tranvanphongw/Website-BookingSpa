import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import styles from "./Home.module.css";


const carouselSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 5000,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true,
  arrows: false,
  pauseOnHover: false,
};

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      {/* Hero Section with Carousel */}
      <section className={styles.heroSection}>
        <Slider {...carouselSettings}>
          <div className={styles.heroSlide}>
            <img
              src="/images/carousel-1.jpg"
              alt="Trải nghiệm Spa Cao Cấp"
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay}>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  Chào Mừng Đến Với Spa Luxury
                </h1>
                <p className={styles.heroSubtitle}>
                  Trải nghiệm đỉnh cao của sự thư giãn và chăm sóc sức khỏe
                </p>
                <Link to="/booking" className={styles.heroBtn}>
                  Đặt Lịch Ngay
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.heroSlide}>
            <img
              src="/images/carousel-2.jpg"
              alt="Liệu pháp Wellness"
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay}>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Phục Hồi Cơ Thể & Tâm Hồn</h1>
                <p className={styles.heroSubtitle}>
                  Các liệu pháp chuyên nghiệp trong môi trường yên bình
                </p>
                <Link to="/services" className={styles.heroBtn}>
                  Dịch Vụ Của Chúng Tôi
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.heroSlide}>
            <img
              src="/images/carousel-3.jpg"
              alt="Cơ sở vật chất cao cấp"
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay}>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Cơ Sở Vật Chất Đẳng Cấp</h1>
                <p className={styles.heroSubtitle}>
                  Trang thiết bị hiện đại và tiện nghi sang trọng
                </p>
                <Link to="/about" className={styles.heroBtn}>
                  Tìm Hiểu Thêm
                </Link>
              </div>
            </div>
          </div>
        </Slider>
      </section>

      {/* Welcome Section */}
      <section className={styles.welcomeSection}>
        <div className={styles.container}>
          <div className={styles.welcomeContent}>
            <div className={styles.welcomeText}>
              <h2 className={styles.sectionTitle}>
                Chào Mừng Đến Spa Của Chúng Tôi
              </h2>
              <p className={styles.welcomeDescription}>
                Thoát khỏi cuộc sống thường ngày và đắm mình trong thế giới yên
                bình và sang trọng. Spa của chúng tôi cung cấp đa dạng các liệu
                pháp được thiết kế để phục hồi sự cân bằng, tăng cường sức khỏe
                và làm trẻ hóa tâm hồn, cơ thể và tinh thần của bạn.
              </p>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <i className="fas fa-leaf"></i>
                  <span>Sản Phẩm Hữu Cơ</span>
                </div>
                <div className={styles.feature}>
                  <i className="fas fa-users"></i>
                  <span>Chuyên Gia Kinh Nghiệm</span>
                </div>
                <div className={styles.feature}>
                  <i className="fas fa-medal"></i>
                  <span>Đạt Giải Thưởng</span>
                </div>
              </div>
            </div>
            <div className={styles.welcomeImage}>
              <img src="/images/relax.jpg" alt="Nội thất Spa" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Dịch Vụ Cao Cấp Của Chúng Tôi
            </h2>
            <p className={styles.sectionSubtitle}>
              Tận hưởng các liệu pháp được tuyển chọn kỹ lưỡng
            </p>
          </div>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceImage}>
                <img src="/images/service-1.jpg" alt="Liệu pháp Massage" />
              </div>
              <div className={styles.serviceContent}>
                <h3>Liệu Pháp Massage</h3>
                <p>
                  Thư giãn và nghỉ ngơi với các liệu pháp massage trị liệu được
                  thiết kế để giải tỏa căng thẳng và thúc đẩy sự thư giãn sâu.
                </p>
                <div className={styles.servicePrice}>Từ 500.000 VNĐ</div>
                <Link to="/service-detail/1" className={styles.serviceBtn}>
                  Tìm Hiểu Thêm
                </Link>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceImage}>
                <img src="/images/service-2.jpg" alt="Chăm sóc da mặt" />
              </div>
              <div className={styles.serviceContent}>
                <h3>Chăm Sóc Da Mặt</h3>
                <p>
                  Làm tươi mới làn da của bạn với các liệu pháp chăm sóc da mặt
                  tiên tiến sử dụng sản phẩm hữu cơ cao cấp và kỹ thuật hiện
                  đại.
                </p>
                <div className={styles.servicePrice}>Từ 250.000 VNĐ</div>
                <Link to="/service-detail/2" className={styles.serviceBtn}>
                  Tìm Hiểu Thêm
                </Link>
              </div>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceImage}>
                <img src="/images/service-3.jpg" alt="Chăm sóc toàn thân" />
              </div>
              <div className={styles.serviceContent}>
                <h3>Chăm Sóc Toàn Thân</h3>
                <p>
                  Chăm sóc sức khỏe toàn diện với các liệu pháp tổng thể kết hợp
                  thành phần tự nhiên và kỹ thuật trị liệu.
                </p>
                <div className={styles.servicePrice}>Từ 600.000 VNĐ</div>
                <Link to="/service-detail/3" className={styles.serviceBtn}>
                  Tìm Hiểu Thêm
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.viewAllServices}>
            <Link to="/services" className={styles.viewAllBtn}>
              Xem Tất Cả Dịch Vụ
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className={styles.facilitiesSection}>
        <div className={styles.container}>
          <div className={styles.facilitiesContent}>
            <div className={styles.facilitiesImage}>
              <img src="/images/spa-2.jpg" alt="Cơ sở vật chất Spa" />
            </div>
            <div className={styles.facilitiesText}>
              <h2 className={styles.sectionTitle}>
                Cơ Sở Vật Chất Đẳng Cấp Thế Giới
              </h2>
              <p>
                Spa của chúng tôi có cơ sở vật chất hiện đại được thiết kế để
                mang lại trải nghiệm thư giãn tối ưu. Từ phòng trị liệu yên tĩnh
                đến khu vực thư giãn sang trọng, mọi chi tiết đều được cân nhắc
                kỹ lưỡng.
              </p>
              <ul className={styles.facilitiesList}>
                <li>Phòng trị liệu riêng tư</li>
                <li>Khu vực thư giãn</li>
                <li>Phòng xông hơi và sauna</li>
                <li>Vườn thiền</li>
                <li>Phòng thay đồ cao cấp</li>
              </ul>
              <Link to="/about" className={styles.facilitiesBtn}>
                Tìm Hiểu Về Spa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Gặp Gỡ Đội Ngũ Chuyên Gia</h2>
            <p className={styles.sectionSubtitle}>
              Những chuyên gia được đào tạo bài bản, tận tâm với hành trình sức
              khỏe của bạn
            </p>
          </div>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <img
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80"
                  alt="Chuyên viên Massage"
                />
              </div>
              <div className={styles.memberInfo}>
                <h3>Nguyễn Thị Hương</h3>
                <p className={styles.memberRole}>Chuyên Viên Massage Cao Cấp</p>
                <p className={styles.memberBio}>
                  Hơn 10 năm kinh nghiệm trong massage trị liệu và các liệu pháp
                  chăm sóc sức khỏe
                </p>
              </div>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                  alt="Chuyên gia chăm sóc da"
                />
              </div>
              <div className={styles.memberInfo}>
                <h3>Trần Minh Anh</h3>
                <p className={styles.memberRole}>Chuyên Gia Chăm Sóc Da</p>
                <p className={styles.memberBio}>
                  Chuyên gia trong các liệu pháp chăm sóc da mặt tiên tiến và
                  làm trẻ hóa da
                </p>
              </div>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=776&q=80"
                  alt="Tư vấn viên sức khỏe"
                />
              </div>
              <div className={styles.memberInfo}>
                <h3>Lê Thị Mai</h3>
                <p className={styles.memberRole}>Tư Vấn Viên Sức Khỏe</p>
                <p className={styles.memberBio}>
                  Chuyên về chăm sóc sức khỏe toàn diện và lập kế hoạch trị liệu
                  cá nhân hóa
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Khách Hàng Nói Gì Về Chúng Tôi
            </h2>
          </div>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <p>
                  "Một trải nghiệm tuyệt vời. Nhân viên rất chuyên nghiệp và các
                  liệu pháp thật xuất sắc. Tôi cảm thấy hoàn toàn được làm mới
                  và tươi tỉnh."
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="/images/testimonial-1.jpg" alt="Khách hàng" />
                <div>
                  <h4>Ngọc Anh</h4>
                  <span>Khách Hàng Thường Xuyên</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>F
                <p>
                  "Cơ sở vật chất tuyệt vời và không khí cực kỳ thư giãn. Đây đã
                  trở thành nơi tôi đến để chăm sóc bản thân và sức khỏe."
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="/images/testimonial-2.jpg" alt="Khách hàng" />
                <div>
                  <h4>Minh Thu</h4>
                  <span>Thành Viên VIP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Sẵn Sàng Bắt Đầu Hành Trình Sức Khỏe?</h2>
            <p>
              Đặt lịch hẹn ngay hôm nay và khám phá đỉnh cao của sự thư giãn và
              phục hồi
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/booking" className={styles.primaryBtn}>
                Đặt Lịch Hẹn
              </Link>
              <Link to="/services" className={styles.secondaryBtn}>
                Xem Dịch Vụ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
