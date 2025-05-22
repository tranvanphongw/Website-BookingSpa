import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import styles from './Home.module.css';

const carouselSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 4000,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true,
  arrows: false,
  pauseOnHover: false,
};

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      {/* Carousel */}
      <section className={styles.carousel}>
        <Slider {...carouselSettings}>
          <div>
            <img src="/images/carousel-1.jpg" alt="Spa Relaxation" className={styles.carouselImage} />
          </div>
          <div>
            <img src="/images/carousel-2.jpg" alt="Luxury Spa Experience" className={styles.carouselImage} />
          </div>
          <div>
            <img src="/images/carousel-3.jpg" alt="Pampering Services" className={styles.carouselImage} />
          </div>
        </Slider>
      </section>

      {/* Giới thiệu */}
      <section className={styles.intro}>
          <div className={styles.introContent}>
            <h2>Chào mừng đến với SPA</h2>
            <p>
              Trải nghiệm thư giãn, chăm sóc sắc đẹp đẳng cấp ngay tại trung tâm thành phố.
              Chúng tôi mang đến không gian yên bình cùng các dịch vụ chăm sóc sức khỏe và sắc đẹp tiêu chuẩn quốc tế.
            </p>
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <i className="fas fa-spa"></i>
                <span>100% Tự nhiên</span>
              </div>
              <div className={styles.featureItem}>
                <i className="fas fa-award"></i>
                <span>Chuyên gia hàng đầu</span>
              </div>
              <div className={styles.featureItem}>
                <i className="fas fa-heart"></i>
                <span>Chăm sóc tận tâm</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dịch vụ */}
      <section className={styles.services}>
      <h2>Dịch vụ nổi bật</h2>
      <div className={styles.serviceList}>
        {[1, 2, 3].map((num) => (
          <div className={styles.serviceItem} key={num}>
            <div className={styles.serviceImage}>
              <img
                src={`/images/service-${num}.jpg`}
                alt={`Dịch vụ ${num}`}
                className={styles.serviceImage}
              />
            </div>
            <div className={styles.serviceInfo}>
              <h3 className={styles.serviceTitle}>
                {num === 1 ? 'Massage Thư Giãn' : num === 2 ? 'Chăm Sóc Da Mặt' : 'Trị Liệu Toàn Thân'}
              </h3>
              <p className={styles.serviceDescription}>
                {num === 1
                  ? 'Liệu pháp massage giúp thư giãn cơ bắp, giảm căng thẳng và cải thiện tuần hoàn máu.'
                  : num === 2
                  ? 'Quy trình chăm sóc da chuyên sâu giúp da sáng mịn, giảm nếp nhăn và cải thiện sắc tố.'
                  : 'Liệu pháp toàn diện kết hợp tinh dầu thiên nhiên giúp thanh lọc cơ thể và tinh thần.'}
              </p>
              <div className={styles.servicePrice}>
                <span className={styles.price}>
                  {num === 1 ? '500.000 VND' : num === 2 ? '250.000 VND' : '600.000 VND'}
                </span>
                <Link to={`/service-detail/${num}`} className={styles.viewDetailLink}>
                  Chi tiết <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
  <div className={styles.viewAll}>
    <Link to="/services" className={styles.viewAllButton}>
      Xem tất cả dịch vụ <i className="fas fa-arrow-right ml-2"></i>
    </Link>
  </div>
</section>


      {/* Đội ngũ chuyên gia */}
      <section className={styles.teamSection}>
        <div className={styles.teamIntro}>
          <h2>Đội Ngũ Chuyên Gia</h2>
          <p>Được đào tạo bài bản với nhiều năm kinh nghiệm trong ngành chăm sóc sức khỏe và sắc đẹp</p>
        </div>
        <div className={styles.teamList}>
          {/* Team Member 1 */}
          <div className={styles.teamMember}>
            <div className={styles.teamImage}>
              <img
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                alt="Chuyên gia massage"
              />
            </div>
            <h3>Nguyễn Thị Hương</h3>
            <p className={styles.specialty}>Chuyên gia Massage</p>
            <p className={styles.experience}>10 năm kinh nghiệm với chứng chỉ quốc tế về liệu pháp massage trị liệu</p>
          </div>

          {/* Team Member 2 */}
          <div className={styles.teamMember}>
            <div className={styles.teamImage}>
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                alt="Chuyên gia da liễu"
              />
            </div>
            <h3>Trần Minh Anh</h3>
            <p className={styles.specialty}>Chuyên gia Da Liễu</p>
            <p className={styles.experience}>Chuyên gia về các vấn đề da và phương pháp điều trị không xâm lấn</p>
          </div>

          {/* Team Member 3 */}
          <div className={styles.teamMember}>
            <div className={styles.teamImage}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
                alt="Chuyên gia thẩm mỹ"
              />
            </div>
            <h3>Lê Thị Mai</h3>
            <p className={styles.specialty}>Chuyên gia Thẩm Mỹ</p>
            <p className={styles.experience}>Chuyên gia về các phương pháp làm đẹp không phẫu thuật tiên tiến</p>
          </div>

          {/* Team Member 4 */}
          <div className={styles.teamMember}>
            <div className={styles.teamImage}>
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80"
                alt="Chuyên gia yoga"
              />
            </div>
            <h3>Phạm Thu Hà</h3>
            <p className={styles.specialty}>Chuyên gia Yoga & Thiền</p>
            <p className={styles.experience}>Hướng dẫn viên yoga chuyên nghiệp với phương pháp trị liệu tâm lý</p>
          </div>
        </div>
      </section>

      {/* Đánh giá */}
      <section className={styles.testimonials}>
        <h2>Khách hàng nói gì?</h2>
        <div className={styles.testimonialList}>
          {[1, 2, 3].map((num) => (
            <div className={styles.testimonial} key={num}>
              <div className={styles.testimonialImage}>
                <img src={`/images/testimonial-${num}.jpg`} alt={`Testimonial ${num}`} />
              </div>
              <div className={styles.testimonialContent}>
                <h3>Chị {num === 1 ? "Ngọc Anh" : num === 2 ? "Minh Thu" : "Thanh Hương"}</h3>
                <div className={styles.testimonialStars}>
                  {[...Array(5)].map((_, index) => (
                    <i key={index} className={`fas fa-star${index === 4 ? '-half-alt' : ''}`}></i>
                  ))}
                </div>
                <p>"Dịch vụ tuyệt vời, nhân viên thân thiện!"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA cuối */}
      <section className={styles.bookNow}>
        <h2>Sẵn sàng làm mới bản thân?</h2>
        <Link to="/booking" className={styles.bookNowButton}>Đặt lịch ngay</Link>
      </section>
    </div>
  );
};

export default Home;
