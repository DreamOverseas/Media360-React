import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import "../css/KolDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const KolDetail = () => {
  const { id: paramId } = useParams(); // 可能是 `internal_url` 或 `id`
  const { t, i18n } = useTranslation();
  const [person, setPerson] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paramId) {
      setError("No person ID provided");
      setLoading(false);
      return;
    }

    const fetchPersonData = async () => {
      try {
        console.log(`Fetching Person Data for: ${paramId}`);
        
        // 先查 `internal_url`
        let response = await axios.get(`${BACKEND_HOST}/api/people?filters[internal_url][$eq]=${paramId}&populate=*`);
        if (!response.data?.data.length) {
          console.log(`Internal URL failed, trying ID: ${paramId}`);
          // 如果 `internal_url` 查询不到，则用 `id`
          response = await axios.get(`${BACKEND_HOST}/api/people?filters[id][$eq]=${paramId}&populate=*`);
        }

        console.log("API Response:", response.data);

        if (response.data?.data.length > 0) {
          setPerson(response.data.data[0]);
        } else {
          setError("Person not found");
        }
      } catch (err) {
        console.error("Error fetching person data:", err);
        setError("Error fetching person details");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [paramId]);

  if (loading) return <div className="loading">{t("loading")}</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!person) return <div className="error-message">No Data Available</div>;

  // ✅ 解析数据，防止 `null` 值导致 UI 显示错误
  const language = i18n.language;

  const Name = language === "zh" ? person.Name_zh || "未知" : person.Name_en || "Unknown";
  const Role = person.Role || "无角色";
  const Title = language === "zh" ? person.Title_zh || "无头衔" : person.Title_en || "No Title";
  const Bio = language === "zh" ? person.Bio_zh || "暂无简介" : person.Bio_en || "No biography available";


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
      <Container className='brand-section'>
        <h3>{t("associatedBrands")}</h3>
        {brands.length > 0 ? (
          <Row>
            {brands.map(brand => {
              const brandUrl = `/brand/${brand.internal_url || brand.id}`;
              return (
                <Col key={brand.id} md={4}>
                  <Link to={brandUrl} className='brand-card-link'>
                    <Card className='brand-card'>
                      {brand.logo?.url ? (
                        <Card.Img src={`${BACKEND_HOST}${brand.logo.url}`} alt={brand.name_en} />
                      ) : (
                        <Image src="https://placehold.co/250x150" alt="Placeholder" fluid />
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
              );
            })}
          </Row>
        ) : (
          <p className='text-center text-muted'>暂无关联品牌</p>
        )}
      </Container>

      {/* 关联产品 */}
      <Container className='product-section'>
        <h3>{t("highlightedProduct")}</h3>
        {products.length > 0 ? (
          <Row>
            {products.map(product => {
              const productUrl = `/product/${product.internal_url || product.id}`;
              return (
                <Col key={product.id} md={4}>
                  <Link to={productUrl} className='product-card-link'>
                    <Card className='product-card'>
                      {product.ProductImage?.url ? (
                        <Card.Img variant='top' src={`${BACKEND_HOST}${product.ProductImage.url}`} />
                      ) : (
                        <Image src="https://placehold.co/300x200" alt="Placeholder" fluid />
                      )}
                      <Card.Body>
                        <Card.Title>{product.Name_zh || product.Name_en}</Card.Title>
                        <Card.Text>${product.Price || "N/A"}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className='text-center text-muted'>暂无相关产品</p>
        )}
      </Container>

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