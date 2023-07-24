import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppChatIcon = ({ phoneNumber }) => {
  const openWhatsAppChat = () => {
    const message = encodeURIComponent("From TileStore Website");
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

    window.open(url, "_blank");
  };

  return (
    <div>
      <FaWhatsapp
        onClick={openWhatsAppChat}
        size={30}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default WhatsAppChatIcon;
