import { Alert, Badge, Card, Col, Row, Button } from "react-bootstrap";

const SellerCampaignsSection = ({ sellerData, sellerLoading, sellerError }) => {
  // Function to handle media download
  const handleMediaDownload = async (mediaItem) => {
    try {
      const response = await fetch(mediaItem.url);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = mediaItem.name || `media_${mediaItem.id}${mediaItem.ext || ''}`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请稍后重试');
    }
  };

  // Function to get file type icon/label based on mime type
  const getFileTypeInfo = (mediaItem) => {
    const mime = mediaItem.mime || '';
    const ext = mediaItem.ext || '';
    
    if (mime.startsWith('image/')) {
      return { type: '图片', variant: 'success' };
    } else if (mime.startsWith('video/')) {
      return { type: '视频', variant: 'primary' };
    } else if (mime.startsWith('audio/')) {
      return { type: '音频', variant: 'info' };
    } else if (mime.includes('pdf')) {
      return { type: 'PDF', variant: 'danger' };
    } else {
      return { type: ext.replace('.', '').toUpperCase() || '文件', variant: 'secondary' };
    }
  };

  // Function to format file size
  const formatFileSize = (sizeInKB) => {
    if (!sizeInKB) return '';
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(1)} MB`;
    }
  };

  if (sellerLoading) return <div>正在加载商家优惠...</div>;
  if (sellerError) return <Alert variant='warning'>{sellerError}</Alert>;

  if (!sellerData?.length) {
    return <Alert variant='info'>暂无商家</Alert>;
  }

  return (
    <>
      {sellerData.map((shop, idx) => {
        const cd = shop.company_details || {};
        const cps = Array.isArray(shop.campaign_preferences) ? shop.campaign_preferences : [];
        const media = Array.isArray(shop.media) ? shop.media : [];
        
        return (
          <Card className='mb-4' key={idx}>
            <Card.Header>
              <strong>{cd.company_name || "未命名商家"}</strong>
              {cd.industry && (
                <Badge bg='secondary' className='ms-2'>
                  {cd.industry}
                </Badge>
              )}
            </Card.Header>
            <Card.Body>
              <Row className='mb-2'>
                <Col md={6}>
                  <div>
                    <strong>地址：</strong>
                    {cd.address || "—"}
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <strong>ABN：</strong>
                    {cd.abn || "—"}
                  </div>
                </Col>
              </Row>
              <div className='mb-3'>
                <strong>官网：</strong>
                {cd.website ? (
                  <a href={cd.website} target='_blank' rel='noreferrer'>
                    {cd.website}
                  </a>
                ) : (
                  "—"
                )}
              </div>

              <h5 className='mt-3'>活动优惠</h5>
              <Row>
                {cps.length ? (
                  cps.map((cp, i) => (
                    <Col md={6} key={i} className='mb-3'>
                      <Card className='h-100'>
                        <Card.Body>
                          <div className='d-flex justify-content-between align-items-center mb-2'>
                            <strong>{cp.title || "未命名优惠"}</strong>
                            {cp.type && <Badge bg='info'>{cp.type}</Badge>}
                          </div>
                          <div className='mb-2'>
                            {cp.description || "—"}
                          </div>
                          <div>
                            <strong>商家要求：</strong>
                            {cp.requirement || "无"}
                          </div>
                          <div className='small text-muted'>
                            有效期至：{cp.valid_until || "—"}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <Alert variant='light'>暂无优惠活动</Alert>
                  </Col>
                )}
              </Row>


              {/* Media Section */}
              {media.length > 0 && (
                <>
                  <h5 className='mt-3'>宣传材料</h5>
                  <Row className='mb-3'>
                    {media.map((mediaItem, mediaIdx) => {
                      const fileInfo = getFileTypeInfo(mediaItem);
                      return (
                        <Col md={6} lg={4} key={mediaIdx} className='mb-2'>
                          <Card className='h-100'>
                            <Card.Body className='d-flex flex-column'>
                              <div className='d-flex justify-content-between align-items-start mb-2'>
                                <Badge bg={fileInfo.variant} className='mb-1'>
                                  {fileInfo.type}
                                </Badge>
                                {mediaItem.size && (
                                  <small className='text-muted'>
                                    {formatFileSize(mediaItem.size)}
                                  </small>
                                )}
                              </div>
                              
                              <div className='mb-2 flex-grow-1'>
                                <div className='fw-bold small mb-1'>
                                  {mediaItem.name || `文件 ${mediaItem.id}`}
                                </div>
                                {mediaItem.caption && (
                                  <div className='small text-muted'>
                                    {mediaItem.caption}
                                  </div>
                                )}
                              </div>
                              
                              <div className='mt-auto'>
                                <Button 
                                  size='sm' 
                                  variant='outline-primary'
                                  onClick={() => handleMediaDownload(mediaItem)}
                                  className='w-100'
                                >
                                  下载
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
};

export default SellerCampaignsSection;