import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const API_BASE = 'https://api.do360.com/api/one-club-memberships';

const SmartCardVerification = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');

  const CMSApiKey = import.meta.env.VITE_CMS_TOKEN;

  const [formData, setFormData] = useState({
    membershipNumber: '',
    legalName: '',
    displayName: '',
    phone: '',
    email: '',
  });

  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const { membershipNumber, legalName, displayName, phone, email } = formData;

    // Basic client-side validation
    if (!membershipNumber.trim() || !legalName.trim() || !displayName.trim() || !phone.trim() || !email.trim()) {
      setStatus('error');
      setErrorMsg(isZh ? '请填写所有必填项。' : 'Please fill in all required fields.');
      return;
    }

    try {
      // Step 1: Look up member by MembershipNumber
      const lookupUrl = `${API_BASE}?filters[MembershipNumber][$eq]=${encodeURIComponent(membershipNumber.trim())}`;
      const lookupRes = await fetch(lookupUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CMSApiKey}`,
        },
      });

      if (!lookupRes.ok) {
        throw new Error('lookup_failed');
      }

      const lookupData = await lookupRes.json();

      if (!lookupData.data || lookupData.data.length === 0) {
        setStatus('error');
        setErrorMsg(
          isZh
            ? '会员号不符，请检查您的会员号后重试。'
            : 'Membership number not found. Please check and try again.'
        );
        return;
      }

      const member = lookupData.data[0];
      const documentId = member.documentId;

      // Step 2: Update the member record
      const updateUrl = `${API_BASE}/${documentId}`;
      const updateRes = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CMSApiKey}`,
        },
        body: JSON.stringify({
          data: {
            LegalName: legalName.trim(),
            Name: displayName.trim(),
            Phone: phone.trim(),
            Email: email.trim(),
          },
        }),
      });

      if (!updateRes.ok) {
        throw new Error('update_failed');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        isZh
          ? '提交失败，请稍后重试或联系客服。'
          : 'Submission failed. Please try again later or contact support.'
      );
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-2 fw-bold" style={{ color: '#1a1a1a' }}>
        {isZh ? '360智能卡实名认证' : '360 Smart Card Verification'}
      </h2>
      <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
        {isZh
          ? '请填写以下信息完成实名认证。完成后，我们将优先为您匹配后续权益与使用安排。'
          : 'Please complete the form below to verify your identity. Once submitted, we will prioritise your membership benefits and usage arrangements.'}
      </p>

      {status === 'success' ? (
        <Alert variant="success">
          <Alert.Heading>{isZh ? '提交成功！' : 'Submitted Successfully!'}</Alert.Heading>
          <p className="mb-0">
            {isZh
              ? '您的实名认证信息已提交，我们将尽快为您安排后续权益。感谢您的信任！'
              : 'Your verification information has been submitted. We will arrange your membership benefits shortly. Thank you!'}
          </p>
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit} noValidate>
          {status === 'error' && (
            <Alert variant="danger" onClose={() => setStatus(null)} dismissible>
              {errorMsg}
            </Alert>
          )}

          {/* Membership Number */}
          <Form.Group className="mb-3" controlId="membershipNumber">
            <Form.Label className="fw-semibold">
              {isZh ? '会员号' : 'Membership Number'}
              <span className="text-danger ms-1">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="membershipNumber"
              value={formData.membershipNumber}
              onChange={handleChange}
              placeholder={isZh ? '请输入您的会员号（如：00007）' : 'e.g. 00007'}
              required
              disabled={status === 'loading'}
            />
          </Form.Group>

          {/* Legal Name */}
          <Form.Group className="mb-3" controlId="legalName">
            <Form.Label className="fw-semibold">
              {isZh ? '法定姓名' : 'Legal Name'}
              <span className="text-danger ms-1">*</span>
            </Form.Label>
            <Form.Text className="text-muted d-block mb-1" style={{ fontSize: '0.82rem' }}>
              {isZh ? '请填写与证件一致的法定姓名' : 'Must match your official ID document'}
            </Form.Text>
            <Form.Control
              type="text"
              name="legalName"
              value={formData.legalName}
              onChange={handleChange}
              placeholder={isZh ? '与护照/驾照一致的姓名' : 'As shown on your passport / driver\'s licence'}
              required
              disabled={status === 'loading'}
            />
          </Form.Group>

          {/* Display Name on Card */}
          <Form.Group className="mb-3" controlId="displayName">
            <Form.Label className="fw-semibold">
              {isZh ? '360智能卡上使用的姓名' : 'Name on 360 Smart Card'}
              <span className="text-danger ms-1">*</span>
            </Form.Label>
            <Form.Text className="text-muted d-block mb-1" style={{ fontSize: '0.82rem' }}>
              {isZh ? '将显示在您的360智能卡上' : 'This name will appear on your 360 Smart Card'}
            </Form.Text>
            <Form.Control
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder={isZh ? '您希望卡上显示的姓名' : 'Preferred name for your card'}
              required
              disabled={status === 'loading'}
            />
          </Form.Group>

          <Row>
            {/* Phone */}
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label className="fw-semibold">
                  {isZh ? '电话' : 'Phone'}
                  <span className="text-danger ms-1">*</span>
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={isZh ? '您的联系电话' : 'Your contact number'}
                  required
                  disabled={status === 'loading'}
                />
              </Form.Group>
            </Col>

            {/* Email */}
            <Col xs={12} md={6}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="fw-semibold">
                  {isZh ? '邮箱' : 'Email'}
                  <span className="text-danger ms-1">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={isZh ? '您的电子邮箱' : 'Your email address'}
                  required
                  disabled={status === 'loading'}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-2">
            <Button
              type="submit"
              variant="dark"
              size="lg"
              className="w-100"
              disabled={status === 'loading'}
              style={{ letterSpacing: '0.03em' }}
            >
              {status === 'loading' ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {isZh ? '提交中...' : 'Submitting...'}
                </>
              ) : (
                isZh ? '提交认证' : 'Submit Verification'
              )}
            </Button>
          </div>

          <p className="text-muted mt-3" style={{ fontSize: '0.8rem' }}>
            {isZh
              ? '* 完成信息后，我们将优先为您匹配后续权益与使用安排。您的信息将被安全保存，仅用于会员服务。'
              : '* After submission, we will prioritise matching your membership benefits and usage arrangements. Your information is stored securely and used solely for membership services.'}
          </p>
        </Form>
      )}
    </Container>
  );
};

export default SmartCardVerification;
