import React from 'react'
import './Contact.css'
import Footer from '../../components/Footer/Footer'

const Contact = () => {
  return (
    <div className='contact-page'>
      <section className='contact-hero'>
        <div className='contact-hero-content'>
          <span className='contact-eyebrow'>Liên hệ FoodFast</span>
          <h1>Chúng tôi luôn sẵn sàng hỗ trợ bạn</h1>
          <p>
            Có thắc mắc về đơn hàng, góp ý về chất lượng hay muốn hợp tác cùng FoodFast? Hãy gửi
            tin nhắn cho chúng tôi, đội ngũ chăm sóc khách hàng sẽ phản hồi trong vòng 24 giờ.
          </p>
        </div>
      </section>

      <section className='contact-grid'>
        <div className='contact-card'>
          <h2>Thông tin liên hệ</h2>
          <ul>
            <li>
              <span className='label'>Hotline:</span>
              <a href=''>111111111</a>
            </li>
            <li>
              <span className='label'>Email:</span>
              <a href=''>dangthanhvu19124@gmail.com</a>
            </li>
            <li>
              <span className='label'>Địa chỉ:</span>
              273 An Dương Vương, Phường Chợ Quán, Hồ Chí Minh
            </li>
            <li>
              <span className='label'>Giờ làm việc:</span>
              08:00 - 22:00 (Thứ 2 - Chủ nhật)
            </li>
          </ul>
        </div>

        <div className='contact-card'>
          <h2>Gửi tin nhắn cho chúng tôi</h2>
          <form className='contact-form'>
            <label>
              Họ và tên
              <input type='text' name='name' placeholder='Nguyễn Văn A' required />
            </label>
            <label>
              Email
              <input type='email' name='email' placeholder='ban@example.com' required />
            </label>
            <label>
              Nội dung
              <textarea name='message' rows='4' placeholder='Mô tả yêu cầu của bạn...' required />
            </label>
            <button type='submit'>Gửi yêu cầu</button>
          </form>
        </div>
      </section>

      <section className='contact-map'>
        <iframe
          title='FoodFast location'
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4596657716604!2d106.7004233760292!3d10.776889459259585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4099d6b67d%3A0xa3b0b78f0a6181d!2zMzYgTmd1eeG7hW4gxJBp4buHbiBWxINuIENo4bunIE1pbmgsIFBoxrDhu51uZyAxLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIMSQ4buLbmcsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1708575150833!5m2!1sen!2s'
          loading='lazy'
          allowFullScreen
          referrerPolicy='no-referrer-when-downgrade'
        ></iframe>
      </section>

      <Footer />
    </div>
  )
}

export default Contact
