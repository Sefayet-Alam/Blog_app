import React, { useState } from "react";
import emailjs from "emailjs-com"; // Import EmailJS
import "./Contact.css";

const Contact = () => {
  // State to store form input
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState(""); // To show success/error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Use EmailJS to send the form data to your email
    emailjs
      .send(
        "service_rymuz29", // Replace with your EmailJS service ID
        "template_8im5h9g", // Replace with your EmailJS template ID
        formData, // The data to be sent (name, email, message)
        "XgUZVDCcRbma3m1R1" // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          setStatus("Message sent successfully!"); // Success message
          setFormData({ name: "", email: "", message: "" }); // Clear form fields
        },
        (error) => {
          setStatus("Failed to send message, please try again."); // Error message
        }
      );
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Me</h1>
      <div className="contact-content">
        {/* Left Side - Message Form */}
        <div className="contact-form-container">
          <h2>Send me a message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
            ></textarea>
            <button type="submit">Send</button>
          </form>
          {status && <p>{status}</p>} {/* Show success/error message */}
        </div>

        {/* Right Side - Profile and Contact Cards */}
        <div className="contact-info">
          <div className="profile-section">
            <img
              src="https://media.licdn.com/dms/image/v2/D5603AQEmWRSvG-m3eg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1702235164264?e=1740009600&v=beta&t=PUHcJ8JLdzX5orkzxzxEKfmbHYlcJ76ujxuTWLFuoXw"
              alt="Profile"
              className="profile-pic"
            />
            <h3 className="profile-name">Sefayet Alam</h3>
          </div>
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <div className="contact-text">Email: sefayetalam14@gmail.com</div>
            </div>
            <div className="contact-card">
              <div className="contact-icon">🔗</div>
              <div className="contact-text">
                LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/sefayet-alam-8333b4242/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sefayet Alam
                </a>
              </div>
            </div>
            <div className="contact-card">
              <div className="contact-icon">🐙</div>
              <div className="contact-text">
                GitHub:{" "}
                <a
                  href="https://github.com/Sefayet-Alam"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sefayet Alam
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
