import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import "../css/KolDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const KolDetail = () => {
  const { id: paramId } = useParams();
  const { t, i18n } = useTranslation();
  const [person, setPerson] = useState(null);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
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

        let response = await axios.get(
          `${BACKEND_HOST}/api/people?filters[internal_url][$eq]=${paramId}&populate=*`
        );

        if (!response.data?.data.length) {
          console.log(`Internal URL failed, trying ID: ${paramId}`);
          response = await axios.get(
            `${BACKEND_HOST}/api/people?filters[id][$eq]==${paramId}&populate=*`
          );
        }

        if (response.data?.data.length > 0) {
          let personData = response.data.data[0];
          setPerson(personData);
          console.log("Fetched Person Data:", personData);

          // 获取相关品牌
          if (personData.brands?.length > 0) {
            let brandIds = personData.brands.map(brand => brand.id);
            fetchBrandLogos(brandIds);
          }

          // 获取相关产品
          if (personData.products?.length > 0) {
            let productIds = personData.products.map(product => product.id);
            fetchProducts(productIds);
          }
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

  // 获取品牌数据
  const fetchBrandLogos = async brandIds => {
    try {
      const brandResponse = await axios.get(
        `${BACKEND_HOST}/api/brands?filters[id][$in]=${brandIds.join(
          ","
        )}&populate=logo`
      );
      console.log("Fetched Brand Data:", brandResponse.data.data);
      setBrands(brandResponse.data.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // 获取产品数据
  const fetchProducts = async productIds => {
    try {
      console.log("Fetching products with IDs:", productIds);

      const queryParams = productIds.map(id => `filters[id]=${id}`).join("&");
      const productResponse = await axios.get(
        `${BACKEND_HOST}/api/products?${queryParams}&populate=ProductImage`
      );

      console.log("Fetched Product Data:", productResponse.data.data);
      setProducts(productResponse.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  if (loading) return <div className='loading'>{t("loading")}</div>;
  if (error) return <div className='error-message'>{error}</div>;
  if (!person) return <div className='error-message'>No Data Available</div>;

  const language = i18n.language;
  const displayName =
    language === "zh" ? person.Name_zh || "未知" : person.Name_en || "Unknown";
  const displayTitle =
    language === "zh"
      ? person.Title_zh || "无头衔"
      : person.Title_en || "No Title";
  const displayBio =
    language === "zh"
      ? person.Bio_zh || "暂无简介"
      : person.Bio_en || "No biography available";

  // 确保人物图片显示正确
  const personImage = person.Image?.[0]?.url
    ? `${BACKEND_HOST}${person.Image[0].url}`
    : "https://placehold.co/280x280";

  const handleContact = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      <Row className='person-detail-section'>
        {/* 人物信息 */}
        <Col md={7} className='person-info'>
          <h1>{displayName}</h1>
          <h5>{displayTitle}</h5>
          <p dangerouslySetInnerHTML={{ __html: displayBio }}></p>
          <Button variant='dark' onClick={handleContact}>
            {t("contactNow")}
          </Button>
        </Col>

        {/* 人物头像 */}
        <Col md={5} className='text-center person-image-container'>
          <Image src={personImage} alt={displayName} className='person-image' />
        </Col>
      </Row>

      {/* 关联品牌 */}
      <section className='brand-section'>
        <Container>
          <h3 className='section-title'>{t("associatedBrands")}</h3>
          <Row className='justify-content-start'>
            {brands.map(brand => (
              <Col key={brand.id} md={3} className='d-flex'>
                <Link
                  to={`/brand/${brand.internal_url || brand.id}`}
                  className='card-link'
                >
                  <Card className='brand-card'>
                    <Card.Img
                      src={
                        brand.logo?.url
                          ? `${BACKEND_HOST}${brand.logo.url}`
                          : "https://placehold.co/250x150"
                      }
                      alt={brand.name_en}
                    />
                    <Card.Body>
                      <Card.Title>{brand.name_zh || brand.name_en}</Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 关联产品 */}
      <section className='product-section'>
        <Container>
          <h3 className='section-title'>{t("highlightedProduct")}</h3>
          <Row className='justify-content-start'>
            {products.map(product => (
              <Col key={product.id} md={3} className='d-flex'>
                <Link
                  to={`/product/${product.url || product.id}`}
                  className='card-link'
                >
                  <Card className='product-card'>
                    <Card.Img
                      src={
                        product.ProductImage?.url
                          ? `${BACKEND_HOST}${product.ProductImage.url}`
                          : "https://placehold.co/300x200"
                      }
                      alt={product.Name_en || "Product"}
                    />
                    <Card.Body>
                      <Card.Title>
                        {product.Name_zh || product.Name_en}
                      </Card.Title>
                      <Card.Text>${product.Price || "N/A"}</Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default KolDetail;
