import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import "../Css/RoomList.css";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const { t, i18n } = useTranslation();
  const chateauBookingUrl = "https://book-directonline.com/properties/waterfrontpropertywallisprivateislandforster-";
  const chateauDescriptionEn = "Welcome to a palatial mansion on a secluded island off the beautiful New South Wales north coast.";
  const chateauDescriptionZh = "欢迎来到新南威尔士州北海岸外一座与世隔绝的岛屿上的宏伟府邸。";

  const CMS_endpoint = import.meta.env.VITE_CMS_ENDPOINT;
  const CMS_token = import.meta.env.VITE_CMS_TOKEN;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${CMS_endpoint}/api/room-types?populate=Cover`, {
          headers: {
            Authorization: `Bearer ${CMS_token}`,
          },
        });

        // Sort rooms by "order" property in ascending order
        const sortedRooms = response.data.data.sort((a, b) => a.order - b.order);

        setRooms(sortedRooms);
      } catch (error) {
        console.error("Error loading:", error);
      }
    };

    fetchRooms();
  }, [CMS_endpoint, CMS_token]);

  return (
    <div className='room-list'>

      <h1>{t("roomlist_title")}</h1>
      <section className='room-section'>
        <h2 className='room-section-title'>Roseneath Holiday Park</h2>
        <div className='room-grid'>
          {rooms.map(room => (
            <Link 
              key={room.id} 
              to={`/room/${room.documentId}`} 
              className='room-card'
            >
              <img 
                src={`${CMS_endpoint}${room.Cover?.url}`} 
                alt={room.Name_en} 
                className='room-image' 
              />
              <h2 className='room-name'>
                {i18n.language === "zh" ? room.Name_zh : room.Name_en}
              </h2>
              <p className='room-subtitle'>{t("Room_max_guest") + room.Max_guest}</p>
              <p className='room-subtitle'>
                {i18n.language === "zh" ? room.Title_zh : room.Title_en}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className='room-section'>
        <h2 className='room-section-title'>Chateau Le Marais</h2>
        <div className='room-grid'>
          <a
            href={chateauBookingUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='room-card'
          >
            <img
              src='/chateau.jpeg'
              alt='Chateau Le Marais'
              className='room-image'
            />
            <h2 className='room-name'>Wing of the Chateau</h2>
            <p className='room-subtitle'>{t("Room_max_guest") + 10}</p>
            <p className='room-subtitle'>{chateauDescriptionEn}</p>
            <p className='room-subtitle'>{chateauDescriptionZh}</p>
          </a>
        </div>
      </section>
    </div>
  );
};

export default RoomList;
