import React, { useState } from 'react';
import styles from './FaqSection.module.css';

const faqs = [
  "Quy tắc chung",
  "Giờ hoạt động và ngày nghỉ",
  "Đặt hẹn",
  "Giá, phí dịch vụ và phương thức thanh toán",
  "Độ tuổi, tình hình sức khỏe của khách",
  "Phụ nữ mang thai",
  "Yêu cầu khi sử dụng dịch vụ",
  "Bảo vệ tư trang và tài sản của khách",
  "Quyền riêng tư và an toàn thông tin",
  "Đến Sà Spa bằng cách nào?",
  "Chỗ đậu xe"
];

// Object chứa nội dung mô tả chi tiết cho từng câu hỏi
const faqDescriptions = {
  "Quy tắc chung": `
    Chúng tôi yêu quý trẻ em, nếu bạn đưa con đi cùng, nhưng bé không sử dụng dịch vụ xin đảm bảo bé được trông nom cẩn thận và không làm phiền đến hoạt động chung của spa và các khách hàng khác.

    Ở Spa chúng tôi cố gắng đem lại không gian yên tĩnh cho tất cả mọi khách hàng. Vì vậy bạn vẫn có thể sử dụng điện thoại, nhưng vui lòng tắt chuông hoặc chuyển qua chế độ rung.

    Chúng tôi có áo choàng, khăn tắm, đồ lót dùng một lần và các phòng tắm với sữa tắm hữu cơ chỉ dành cho các khách sử dụng dịch vụ.

    Chúng tôi là spa chuyên nghiệp chỉ cung cấp những dịch vụ tiêu chuẩn, xin vui lòng tôn trọng các chuẩn mực đạo đức cũng như nhân viên của chúng tôi.

    Nếu có khác biệt về ngôn ngữ, xin vui lòng kiên nhẫn.
  `,
  "Giờ hoạt động và ngày nghỉ": `
    Từ 09:00 sáng đến 21:30 tối tất cả các ngày trong tuần.

    20:00 là giờ nhận khách cuối cùng cho dịch vụ 90 phút.

    20:30 là giờ nhận khách cuối cùng cho dịch vụ 60 phút.

    Mỗi năm chúng tôi sẽ đóng cửa 01 tuần trong dịp Tết Nguyên Đán. Tất cả các ngày lễ còn lại chúng tôi đều mở cửa bình thường.
  `,
  "Đặt hẹn": `
    Chúng tôi khuyến khích bạn nên book trước để được đảm bảo chỗ mà không phải chờ đợi, và Sả cũng có thể sắp xếp và chuẩn bị mọi thứ tốt nhất cho liệu trình chăm sóc bạn.

    Bạn có thể chọn book trước qua một trong những kênh sau:

    – Website Spa: SpaBooing.vn

    – Nhắn tin Fanpage Sả: facebook.com/Spabooking hoặc instgram: Spabooking

    – Điện thoại bàn: +84 023 3456 7890 (Từ 09:00 sáng đến 09:00 tối)

    – Điện thoại di động: +84987 654 321 (WhatsApp/Line/KakaoTalk/Viber/Zalo)

    – Email: Spa.spabooking@gmail.com

    Chúng tôi rất mong khách đến đúng giờ đã book. Trong trường hợp có thay đổi xin vui lòng thông báo kịp thời cho chúng tôi.

    Liệu trình của bạn có thể bị rút ngắn để không ảnh hưởng đến khách sau.

    15 phút sau giờ hẹn nếu khách không đến cũng không thông báo, booking sẽ tự động được huỷ.
  `,
  "Giá, phí dịch vụ và phương thức thanh toán": `
    Giá trên Menu của Sả chưa bao gồm phí dịch vụ và VAT (nếu bạn cần xuất hoá đơn VAT).

    Chúng tôi chấp nhận thanh toán bằng tiền mặt Việt Nam, chuyển khoản nội địa, thẻ thanh toán nội địa, MOMO, thẻ thanh toán quốc tế Visa, Master, JCB, Amex, UnionPay, APPLE PAY.
  `,
  "Độ tuổi, tình hình sức khỏe của khách": `
    Chúng tôi phục vụ khách có độ tuổi từ 7 tuổi và dưới 81 tuổi.

    Spa không phù hợp với người sử dụng xe lăn, đi lại khó khăn vì chỉ có cầu thang bộ.

    Những người có vấn đề về tim mạch, huyết áp, bệnh ngoài da, bệnh truyền nhiễm không nên sử dụng dịch vụ spa.

    Xin vui lòng thông báo với nhân viên nếu bạn có tiền sử dị ứng với tinh dầu, thảo mộc.

    Chúng tôi phục vụ cả khách nam và nữ.

    Chúng tôi chỉ có kĩ thuật viên Nữ, không có kỹ thuật viên Nam.
  `,
  "Phụ nữ mang thai": `
    Tại Spa Nhân viên chúng tôi được đào tạo các kỹ năng để phục vụ phụ nữ đang mang thai, ngoài ra chúng tôi sử dụng tinh dầu massage, mỹ phẩm chăm sóc da và tóc hữu cơ, an toàn cho phụ nữ mang thai.

    Tuy nhiên chúng tôi khuyến khích bạn tham khảo với bác sĩ giai đoạn nào trong thai kì thì có thể sử dụng các dịch vụ spa, và điều gì nên tránh để đảm bảo an toàn cho mẹ và bé.
  `,
  "Yêu cầu khi sử dụng dịch vụ": `
    Sau khi chọn dịch vụ, Nhân viên sẽ lấy thông tin các yêu cầu chi tiết của khách để đảm bảo trải nghiệm của bạn được tốt nhất.

    Trong quá trình diễn ra dịch vụ, nếu có yêu cầu khác xin đừng ngại hãy thông báo cho Nhân viên của chúng tôi ngay.
  `,
  "Bảo vệ tư trang và tài sản của khách": `
    Tại Spa, chúng tôi có tủ locker với khoá riêng cho từng khách, và chìa khoá sẽ được khách mang theo mình trong quá trình làm dịch vụ. Bạn vui lòng để đồ trang sức tại đây trước khi lên phòng làm dịch vụ.

    Khi ra về xin vui lòng kiểm tra, sau khi bạn ra về chúng tôi không chịu trách nhiệm về việc mất mát nếu có.
  `,
  "Quyền riêng tư và an toàn thông tin": `
    Chúng tôi tôn trọng quyền riêng tư và các thông tin cá nhân của khách như số điện thoại, email, Facebook…

    Chúng tôi cam kết không bao giờ sử dụng hình ảnh của bạn nếu không được sự cho phép và tuyệt đối không chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ 3 nào.
  `,
  "Đến Sà Spa bằng cách nào?": `
    Quý khách có thể đi xe ô tô, xe máy hoặc đi bộ đến hẻm 40 Nguyễn A Phường B, Quận C, sau đó vui lòng đi bộ hoặc xe máy vào khoảng 30m, Spa nằm tại địa chỉ AB.
  `,
  "Chỗ đậu xe": `
    Chúng tôi có chỗ đậu xe ô tô và xe máy, vui lòng liên hệ nhân viên Bảo vệ nếu Quý khách muốn đỗ xe.
  `
};


export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.intro}>
        <h2 className={styles.heading}>Q&amp;A</h2>
        <p className={styles.subtext}>
          Nếu đây là lần đầu tiên bạn biết đến Sà, chắc chắn bạn sẽ có rất nhiều câu hỏi về dịch vụ,
          thời gian hoạt động và các chính sách của chúng tôi. Hy vọng phần Q&amp;A dưới đây sẽ giúp bạn
          giải đáp những thắc mắc thường gặp nhất khi sử dụng dịch vụ tại Sà Spa.
        </p>
      </div>

      <div className={styles.image}>
        <img src="/images/faq-hero.jpg" alt="Giao tiếp khách hàng tại lễ tân" />
      </div>

      <div className={styles.faqBox}>
        <h3 className={styles.faqTitle}>Câu hỏi thường gặp</h3>
        <ul className={styles.accordion}>
          {faqs.map((item, index) => (
            <li key={index} onClick={() => toggle(index)} className={styles.accordionItem}>
              <div className={styles.accordionHeader}>
                <span>{item}</span>
                <span>{activeIndex === index ? "−" : "+"}</span>
              </div>
              {activeIndex === index && (
                <div className={styles.accordionContent}>
                  <p>{faqDescriptions[item] || "Nội dung đang cập nhật."}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
