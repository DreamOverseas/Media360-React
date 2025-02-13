import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import "../css/KolDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const KolDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const url = `${BACKEND_HOST}/api/people?filters[id][$eq]=${id}&populate=*`;
    console.log("Fetching:", url);

    axios
      .get(url)
      .then(response => {
        console.log("API Response:", response.data);
        if (response.data && response.data.data.length > 0) {
          setPerson(response.data.data[0]); // ✅ 确保 `setPerson` 成功执行
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!person) return <div>{t("loading")}</div>;

  // ✅ 解析数据，防止 `null` 值导致 UI 显示错误
  const language = i18n.language;
  
  const Name =
    language === "zh"
      ? person.Name_zh || "无头衔"
      : person.Name_en || "No Title";
  const Role = person.Role || "无角色";
  
  const Title =
    language === "zh"
      ? person.Title_zh || "无头衔"
      : person.Title_en || "No Title";
  const Bio =
    language === "zh"
      ? person.Bio_zh || "暂无简介"
      : person.Bio_en || "No biography available";

  // ✅ 解析品牌信息
  const brands = person.brands || [];
  // ✅ 解析产品信息
  const products = person.products || [];

  const handleContact = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      {/* 人物详情 */}
      <section className='person-detail-background'>
        <Container>
          <Row className='person-detail-section'>
            {/* 左侧人物信息 */}
            <Col md={6}>
              <h1>{Name}</h1>
              <h5>{Title}</h5>
              <p>
                <strong>{t("role")}:</strong> {Role}
              </p>
              <p>{Bio}</p>
              <Button variant='dark' onClick={handleContact}>
                {t("contactNow")}
              </Button>
            </Col>

            {/* 右侧人物头像 */}
            <Col md={6} className='text-center'>
              {person.Image && person.Image.length > 0 ? (
                <Image
                  src={`${BACKEND_HOST}${person.Image[0].url}`}
                  alt={Name}
                  fluid
                  rounded
                />
              ) : (
                <Image
                  src='https://placehold.co/600x600'
                  alt='Placeholder'
                  fluid
                />
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* 关联品牌 */}
      {person.brands?.length > 0 && (
        <Container className='brand-section'>
          <h3>{t("associatedBrands")}</h3>
          <Row>
            {person.brands.map(brand => (
              <Col key={brand.id} md={4}>
                <Link to={`/brand/${brand.id}`} className='brand-card-link'>
                  <Card className='brand-card'>
                    {brand.logo?.url && (
                      <Card.Img
                        src={`${BACKEND_HOST}${brand.logo.url}`}
                        alt={brand.name_en}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{brand.name_zh || brand.name_en}</Card.Title>
                      <Card.Text>
                        {brand.description_zh || brand.description_en}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* 关联产品 */}
      {products.length > 0 && (
        <Container className='product-section'>
          <h3>{t("highlightedProduct")}</h3>
          <Row>
            {products.map(product => (
              <Col key={product.id} md={4}>
                <Link
                  to={`/product/${product.id}`}
                  className='product-card-link'
                >
                  <Card className='product-card'>
                    {product.ProductImage && product.ProductImage.url && (
                      <Card.Img
                        variant='top'
                        src={`${BACKEND_HOST}${product.ProductImage.url}`}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>
                        {product.Name_zh || product.Name_en}
                      </Card.Title>
                      <Card.Text>${product.Price}</Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* 联系 Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{Name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("scanQRCode")}</p>
          <Image src='/QR_placeholder.png' alt='QR Code' fluid />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCloseModal}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KolDetail;
