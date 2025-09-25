import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Image, Pagination } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { Link } from "react-router-dom";
import qs from 'qs';
import { useTranslation } from "react-i18next";
import "../css/InfluenceHub.css"

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const Networks = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const language = i18n.language;
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  
  // 每页显示数量
  const itemsPerPage = 6;

  useEffect(() => {
    try {
      const path = location.pathname.split("/")[1];
      console.log("path", path);
      
      axios.get(`${BACKEND_HOST}/api/people`, {
        params: {
          'filters[Role][$contains]': JSON.stringify({ roles: [path] }),
          'filters[PersonPage]': true,
          populate: 'Image',
          sort: "Order:desc"
        },
        paramsSerializer: params => qs.stringify(params, { encode: false }),
      })
      .then(response => {
        const Data = response.data?.data || null;
        console.log(Data);
        if (Data && Data.length > 0) {
          setData(Data);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
    } catch {
      setError(t("errorFetchingProductData"));
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // 处理搜索过滤
  const filteredData = data.filter(person => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const name = person.Name_zh || person.Name_en || '';
    const title = person.Title_zh || person.Title_en || '';
    const bioText = (person.Bio_zh || person.Bio_en || '').replace(/<[^>]*>/g, '');
    
    return name.toLowerCase().includes(searchLower) ||
           title.toLowerCase().includes(searchLower) ||
           bioText.toLowerCase().includes(searchLower);
  });

  // 计算分页数据
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // 重置页码当搜索时
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 处理姓名显示
  const getDisplayName = (person) => {
    return person.Name_zh || person.Name_en || t("unknownName", "未知姓名");
  };

  // 处理职位显示
  const getDisplayTitle = (person) => {
    return person.Title_zh || person.Title_en;
  };

  // 处理图片URL
  const getImageUrl = (person) => {
    if (person.Image && person.Image.length > 0) {
      const image = person.Image[0];
      return `${BACKEND_HOST}${image.formats?.medium?.url || image.formats?.small?.url || image.url}`;
    }
    return null;
  };

  // 获取简介文本
  const getBioText = (person) => {
    const bio = person.Bio_zh || person.Bio_en;
    if (!bio) return t("noBio", "暂无简介");
    
    const plainText = bio.replace(/<[^>]*>/g, '');
    return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
  };

  // 分页组件
  const renderPagination = () => {
    if (isMobile || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 首页
    if (startPage > 1) {
      pages.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pages.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // 中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // 末页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      pages.push(
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          />
          {pages}
          <Pagination.Next 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          />
        </Pagination>
      </div>
    );
  };

  if (error) {
    return (
      <Container className="text-center py-5">
        <h3>{t("error", "错误")}</h3>
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
        {/* Header Section */}
      <div className='text-center mb-20'>
        <div className='inline-block'>
          <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-blue-600 bg-clip-text text-transparent mb-4'>
             网红
          </h1>
          <div className='h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto'></div>
        </div>
        <p className='text-gray-600 text-lg mt-6 max-w-2xl mx-auto'>
          每个人都是自己的超级IP
        </p>
      </div>
      {/* 搜索框 */}
      <Row className="mb-4">
        <Col md={6} className="mx-auto">
          <div className="position-relative">
            <input
              type="text"
              className="form-control ps-5"
              placeholder={t("searchPlaceholder", "搜索姓名、职位或关键词...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
          </div>
        </Col>
      </Row>

      {/* 结果统计 */}
      <Row className="mb-3">
        <Col className="text-center">
          <small className="text-muted">
            {t("searchResults", "共找到")} <span className="fw-bold text-primary">{filteredData.length}</span> {t("people", "位人物")}
            {!isMobile && totalPages > 1 && (
              <span className="ms-2">
                | {t("page", "第")} {currentPage} {t("of", "页，共")} {totalPages} {t("pages", "页")}
              </span>
            )}
          </small>
        </Col>
      </Row>

      {/* 人物卡片 */}
      <Row>
        {currentData.length > 0 ? (
          currentData.map((person) => (
            <Col 
              key={person.id} 
              xs={12} 
              md={4} 
              className="mb-4"
            >
              <Card className="h-100 shadow-sm person-card">
                <div className="position-relative overflow-hidden" style={{ height: '280px' }}>
                  {getImageUrl(person) ? (
                    <div 
                      className="w-100 h-100 bg-light d-flex align-items-center justify-content-center"
                      style={{
                        backgroundImage: `url(${getImageUrl(person)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    >
                      <img
                        src={getImageUrl(person)}
                        alt={getDisplayName(person)}
                        className="w-100 h-100"
                        style={{ 
                          objectFit: 'contain',
                          objectPosition: 'center',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="d-flex align-items-center justify-content-center h-100 bg-gradient" style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);">
                              <i class="bi bi-person-circle display-1 text-muted"></i>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="d-flex align-items-center justify-content-center h-100"
                      style={{ 
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
                      }}
                    >
                      <i className="bi bi-person-circle display-1 text-muted"></i>
                    </div>
                  )}

                  {/* 角色标签 */}
                  {person.Role?.roles && (
                    <div className="position-absolute top-0 end-0 m-2">
                      {person.Role.roles.map((role, index) => (
                        <span
                          key={index}
                          className="badge bg-primary bg-opacity-90 me-1"
                          style={{ 
                            backdropFilter: 'blur(8px)',
                            fontSize: '0.75rem'
                          }}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold text-dark mb-2">
                    {getDisplayName(person)}
                  </Card.Title>

                  {getDisplayTitle(person) && (
                    <Card.Subtitle className="mb-2 text-primary fw-medium">
                      {getDisplayTitle(person)}
                    </Card.Subtitle>
                  )}

                  <Card.Text className="text-muted small flex-grow-1">
                    {getBioText(person)}
                  </Card.Text>

                  {/* 查看详情链接 */}
                  <Link
                    to={`/person/${person.internal_url || person.id}`}
                    className="btn btn-outline-primary btn-sm mt-auto"
                  >
                    {t("viewDetails", "查看详情")}
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <i className="bi bi-person-x display-1 text-muted mb-3"></i>
            <h5 className="text-muted">{t("noResults", "未找到相关人物")}</h5>
            <p className="text-muted">
              {t("tryDifferentSearch", "尝试调整搜索关键词或清空搜索框查看所有人物")}
            </p>
          </Col>
        )}
      </Row>

      {/* 分页组件 - 仅桌面端显示 */}
      {renderPagination()}

      {/* 移动端显示限制提示 */}
      {isMobile && filteredData.length > 6 && (
        <Row className="mt-3">
          <Col className="text-center">
            <small className="text-muted">
              {t("mobileLimit", "移动端仅显示前6位人物，请使用桌面端查看完整列表")}
            </small>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Networks;