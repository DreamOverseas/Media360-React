import React, { useState } from 'react';
import {
  Container, Tabs, Tab, Form, Button,
  Row, Col, Alert, Badge,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import PageTitle from '../Components/PageTitle.jsx';

const API_BASE = 'https://api.do360.com';
const APP_API = `${API_BASE}/api/applications`;
const UPLOAD_API = `${API_BASE}/api/upload`;

// ─────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────

const MultiCheck = ({ options, selected, onChange }) => (
  <div className="d-flex flex-wrap gap-2 mt-1">
    {options.map(opt => (
      <Form.Check
        key={opt.value}
        type="checkbox"
        id={`chk-${opt.value}`}
        label={opt.label}
        checked={selected.includes(opt.value)}
        onChange={() => onChange(opt.value)}
        className="me-3"
      />
    ))}
  </div>
);

const toggle = (arr, val) =>
  arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

const SectionTitle = ({ children }) => (
  <h6
    className="mt-4 mb-3 pb-1"
    style={{ borderBottom: '2px solid #dee2e6', color: '#495057', fontWeight: 600 }}
  >
    {children}
  </h6>
);

const SuccessPanel = ({ message, onReset, t }) => (
  <Alert variant="success" className="my-4 text-center py-4">
    <div style={{ fontSize: '2rem' }}>✓</div>
    <p className="mb-3">{message}</p>
    <Button variant="outline-success" size="sm" onClick={onReset}>
      {t('join_submit_another')}
    </Button>
  </Alert>
);

// ─────────────────────────────────────────────────────
// 1. Influencer / KOL Form
// ─────────────────────────────────────────────────────
const InfluencerForm = () => {
  const { t } = useTranslation();

  const PLATFORM_OPTIONS = [
    { value: 'douyin', label: '抖音 / Douyin' },
    { value: 'xiaohongshu', label: '小红书 / Xiaohongshu' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
  ];

  const [fields, setFields] = useState({
    fullName: '', city: '', phoneNumber: '', email: '',
    wechat: '', collaborationCases: '', notes: '',
  });
  const [platforms, setPlatforms] = useState([
    { platform: 'douyin', url: '', followers: '' },
  ]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleField = e =>
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePlatform = (idx, key, val) =>
    setPlatforms(prev => prev.map((p, i) => i === idx ? { ...p, [key]: val } : p));

  const addPlatform = () =>
    setPlatforms(prev => [...prev, { platform: 'douyin', url: '', followers: '' }]);

  const removePlatform = idx =>
    setPlatforms(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const notesText = [
        fields.wechat ? `WeChat/Contact: ${fields.wechat}` : '',
        fields.notes,
      ].filter(Boolean).join('\n\n');

      await axios.post(APP_API, {
        data: {
          applicationType: 'influencer',
          fullName: fields.fullName,
          city: fields.city,
          phoneNumber: fields.phoneNumber,
          email: fields.email,
          collaborationCases: fields.collaborationCases || null,
          notes: notesText || null,
          socialPlatforms: platforms.map(p => ({
            platform: p.platform,
            url: p.url,
            followers: Number(p.followers) || 0,
          })),
          contentCategories: categories,
        },
      });
      setSuccess(true);
    } catch {
      setError(t('join_submit_error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success)
    return (
      <SuccessPanel
        message={t('join_submit_success')}
        onReset={() => setSuccess(false)}
        t={t}
      />
    );

  const categoryOptions = [
    { value: 'food', label: t('join_category_food') },
    { value: 'travel', label: t('join_category_travel') },
    { value: 'real_estate', label: t('join_category_real_estate') },
    { value: 'fashion', label: t('join_category_fashion') },
    { value: 'lifestyle', label: t('join_category_lifestyle') },
    { value: 'other', label: t('join_category_other') },
  ];

  return (
    <Form onSubmit={handleSubmit} className="py-3">
      <SectionTitle>{t('join_section_basic_info')}</SectionTitle>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_full_name')} *</Form.Label>
            <Form.Control name="fullName" value={fields.fullName} onChange={handleField} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_city')} *</Form.Label>
            <Form.Control name="city" value={fields.city} onChange={handleField} required />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_phone')} *</Form.Label>
            <Form.Control name="phoneNumber" value={fields.phoneNumber} onChange={handleField} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_email')} *</Form.Label>
            <Form.Control type="email" name="email" value={fields.email} onChange={handleField} required />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_wechat')}</Form.Label>
        <Form.Control name="wechat" value={fields.wechat} onChange={handleField} />
      </Form.Group>

      <SectionTitle>{t('join_section_social_accounts')}</SectionTitle>
      {platforms.map((p, i) => (
        <Row key={i} className="mb-2 align-items-end g-2">
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small">{t('join_field_platform_type')}</Form.Label>
              <Form.Select
                value={p.platform}
                onChange={e => handlePlatform(i, 'platform', e.target.value)}
              >
                {PLATFORM_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group>
              <Form.Label className="small">{t('join_field_account_url')}</Form.Label>
              <Form.Control
                value={p.url}
                placeholder="https://..."
                onChange={e => handlePlatform(i, 'url', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small">{t('join_field_followers')}</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={p.followers}
                onChange={e => handlePlatform(i, 'followers', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={1} className="text-center">
            {platforms.length > 1 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removePlatform(i)}
                style={{ marginTop: '1.6rem' }}
              >
                ✕
              </Button>
            )}
          </Col>
        </Row>
      ))}
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={addPlatform}
        className="mb-3 mt-1"
      >
        + {t('join_platform_add')}
      </Button>

      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_content_categories')}</Form.Label>
        <MultiCheck
          options={categoryOptions}
          selected={categories}
          onChange={v => setCategories(prev => toggle(prev, v))}
        />
      </Form.Group>

      <SectionTitle>{t('join_section_cooperation')}</SectionTitle>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_collab_cases')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="collaborationCases"
          value={fields.collaborationCases}
          onChange={handleField}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>{t('join_field_notes')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="notes"
          value={fields.notes}
          onChange={handleField}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}
      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? t('join_submitting') : t('join_submit_influencer')}
      </Button>
    </Form>
  );
};

// ─────────────────────────────────────────────────────
// 2. Land Owner Form
// ─────────────────────────────────────────────────────
const LandOwnerForm = () => {
  const { t } = useTranslation();

  const [fields, setFields] = useState({
    fullName: '', companyName: '', phoneNumber: '', email: '',
    city: '', state: '',
    landAddress: '', landSize: '',
    developmentAvailable: false, existingPermit: false,
    expectedCooperationMethod: '', notes: '',
  });
  const [landType, setLandType] = useState([]);
  const [cooperationIntent, setCooperationIntent] = useState([]);
  const [landPhotos, setLandPhotos] = useState([]);
  const [landDocs, setLandDocs] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleField = e => {
    const { name, value, type, checked } = e.target;
    setFields(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const uploadFiles = async files => {
    if (!files.length) return [];
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    const res = await axios.post(UPLOAD_API, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.map(f => f.id);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const photoIds = await uploadFiles(landPhotos);
      const docIds = await uploadFiles(landDocs);

      await axios.post(APP_API, {
        data: {
          applicationType: 'land_owner',
          fullName: fields.fullName,
          companyName: fields.companyName || null,
          phoneNumber: fields.phoneNumber,
          email: fields.email,
          city: fields.city,
          state: fields.state,
          landAddress: fields.landAddress,
          landSize: fields.landSize ? Number(fields.landSize) : null,
          landType,
          developmentAvailable: fields.developmentAvailable,
          existingPermit: fields.existingPermit,
          cooperationIntent,
          expectedCooperationMethod: fields.expectedCooperationMethod || null,
          notes: fields.notes || null,
          landPhotos: photoIds,
          landDocuments: docIds,
        },
      });
      setSuccess(true);
    } catch {
      setError(t('join_submit_error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success)
    return (
      <SuccessPanel
        message={t('join_submit_success')}
        onReset={() => setSuccess(false)}
        t={t}
      />
    );

  const landTypeOptions = [
    { value: 'agricultural', label: t('join_land_agricultural') },
    { value: 'commercial', label: t('join_land_commercial') },
    { value: 'residential', label: t('join_land_residential') },
    { value: 'industrial', label: t('join_land_industrial') },
  ];

  const intentOptions = [
    { value: 'lease', label: t('join_intent_lease') },
    { value: 'joint_development', label: t('join_intent_joint_dev') },
    { value: 'sale', label: t('join_intent_sale') },
  ];

  return (
    <Form onSubmit={handleSubmit} className="py-3">
      <SectionTitle>{t('join_section_basic_info')}</SectionTitle>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_full_name')} *</Form.Label>
            <Form.Control name="fullName" value={fields.fullName} onChange={handleField} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_company')}</Form.Label>
            <Form.Control name="companyName" value={fields.companyName} onChange={handleField} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_phone')} *</Form.Label>
            <Form.Control name="phoneNumber" value={fields.phoneNumber} onChange={handleField} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_email')} *</Form.Label>
            <Form.Control type="email" name="email" value={fields.email} onChange={handleField} required />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_country_city')} *</Form.Label>
            <Form.Control name="city" value={fields.city} onChange={handleField} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_state')}</Form.Label>
            <Form.Control name="state" value={fields.state} onChange={handleField} />
          </Form.Group>
        </Col>
      </Row>

      <SectionTitle>{t('join_section_land_info')}</SectionTitle>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_land_address')} *</Form.Label>
        <Form.Control name="landAddress" value={fields.landAddress} onChange={handleField} required />
      </Form.Group>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_land_size')}</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              name="landSize"
              value={fields.landSize}
              onChange={handleField}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_land_type')}</Form.Label>
        <MultiCheck
          options={landTypeOptions}
          selected={landType}
          onChange={v => setLandType(prev => toggle(prev, v))}
        />
      </Form.Group>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Check
            type="switch"
            id="developmentAvailable"
            name="developmentAvailable"
            label={t('join_field_developable')}
            checked={fields.developmentAvailable}
            onChange={handleField}
          />
        </Col>
        <Col md={6}>
          <Form.Check
            type="switch"
            id="existingPermit"
            name="existingPermit"
            label={t('join_field_existing_permit')}
            checked={fields.existingPermit}
            onChange={handleField}
          />
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_cooperation_intent')}</Form.Label>
        <MultiCheck
          options={intentOptions}
          selected={cooperationIntent}
          onChange={v => setCooperationIntent(prev => toggle(prev, v))}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_expected_method')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="expectedCooperationMethod"
          value={fields.expectedCooperationMethod}
          onChange={handleField}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_notes')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="notes"
          value={fields.notes}
          onChange={handleField}
        />
      </Form.Group>

      <SectionTitle>{t('join_section_upload')}</SectionTitle>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_land_photos')} *</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          multiple
          required
          onChange={e => setLandPhotos(Array.from(e.target.files))}
        />
        {landPhotos.length > 0 && (
          <div className="mt-1">
            {landPhotos.map((f, i) => (
              <Badge bg="secondary" key={i} className="me-1">{f.name}</Badge>
            ))}
          </div>
        )}
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>{t('join_field_land_docs')}</Form.Label>
        <Form.Control
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          multiple
          onChange={e => setLandDocs(Array.from(e.target.files))}
        />
        {landDocs.length > 0 && (
          <div className="mt-1">
            {landDocs.map((f, i) => (
              <Badge bg="secondary" key={i} className="me-1">{f.name}</Badge>
            ))}
          </div>
        )}
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}
      <Button type="submit" variant="success" disabled={submitting}>
        {submitting ? t('join_submitting') : t('join_submit_land_owner')}
      </Button>
    </Form>
  );
};

// ─────────────────────────────────────────────────────
// 3. Partner Form
// ─────────────────────────────────────────────────────
const PartnerForm = () => {
  const { t } = useTranslation();

  const [fields, setFields] = useState({
    companyName: '', fullName: '', positionTitle: '',
    phoneNumber: '', email: '', websiteUrl: '',
    cooperationDirection: '', availableResources: '',
    partnerCases: '', notes: '',
  });
  const [partnershipTypes, setPartnershipTypes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleField = e =>
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await axios.post(APP_API, {
        data: {
          applicationType: 'partner',
          companyName: fields.companyName,
          fullName: fields.fullName,
          positionTitle: fields.positionTitle || null,
          phoneNumber: fields.phoneNumber,
          email: fields.email,
          websiteUrl: fields.websiteUrl || null,
          partnershipTypes,
          cooperationDirection: fields.cooperationDirection || null,
          availableResources: fields.availableResources || null,
          partnerCases: fields.partnerCases || null,
          notes: fields.notes || null,
        },
      });
      setSuccess(true);
    } catch {
      setError(t('join_submit_error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success)
    return (
      <SuccessPanel
        message={t('join_submit_success')}
        onReset={() => setSuccess(false)}
        t={t}
      />
    );

  const typeOptions = [
    { value: 'brand', label: t('join_partner_brand') },
    { value: 'media', label: t('join_partner_media') },
    { value: 'event', label: t('join_partner_event') },
    { value: 'supply_chain', label: t('join_partner_supply_chain') },
    { value: 'government_association', label: t('join_partner_gov_assoc') },
    { value: 'joint_investment', label: t('join_partner_joint_invest') },
  ];

  return (
    <Form onSubmit={handleSubmit} className="py-3">
      <SectionTitle>{t('join_section_company_info')}</SectionTitle>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('contactForm_company')} *</Form.Label>
            <Form.Control name="companyName" value={fields.companyName} onChange={handleField} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_contact_name')} *</Form.Label>
            <Form.Control name="fullName" value={fields.fullName} onChange={handleField} required />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_position')}</Form.Label>
            <Form.Control name="positionTitle" value={fields.positionTitle} onChange={handleField} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_phone')} *</Form.Label>
            <Form.Control name="phoneNumber" value={fields.phoneNumber} onChange={handleField} required />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_email')} *</Form.Label>
            <Form.Control type="email" name="email" value={fields.email} onChange={handleField} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_website')}</Form.Label>
            <Form.Control name="websiteUrl" value={fields.websiteUrl} onChange={handleField} placeholder="https://..." />
          </Form.Group>
        </Col>
      </Row>

      <SectionTitle>{t('join_section_cooperation')}</SectionTitle>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_partnership_types')}</Form.Label>
        <MultiCheck
          options={typeOptions}
          selected={partnershipTypes}
          onChange={v => setPartnershipTypes(prev => toggle(prev, v))}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_coop_direction')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="cooperationDirection"
          value={fields.cooperationDirection}
          onChange={handleField}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_available_resources')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="availableResources"
          value={fields.availableResources}
          onChange={handleField}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_partner_cases')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="partnerCases"
          value={fields.partnerCases}
          onChange={handleField}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>{t('join_field_notes')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="notes"
          value={fields.notes}
          onChange={handleField}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}
      <Button type="submit" variant="warning" className="text-white" disabled={submitting}>
        {submitting ? t('join_submitting') : t('join_submit_partner')}
      </Button>
    </Form>
  );
};

// ─────────────────────────────────────────────────────
// 4. Investor Form
// ─────────────────────────────────────────────────────
const InvestorForm = () => {
  const { t } = useTranslation();

  const [fields, setFields] = useState({
    fullName: '', companyName: '', phoneNumber: '',
    email: '', address: '',
    investmentCurrency: 'AUD', investmentAmount: '',
    investmentPreference: '', notes: '',
  });
  const [investmentSectors, setInvestmentSectors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleField = e =>
    setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await axios.post(APP_API, {
        data: {
          applicationType: 'investor',
          fullName: fields.fullName,
          companyName: fields.companyName || null,
          phoneNumber: fields.phoneNumber,
          email: fields.email,
          address: fields.address || null,
          investmentCurrency: fields.investmentCurrency,
          investmentAmount: fields.investmentAmount ? Number(fields.investmentAmount) : null,
          investmentSectors,
          investmentPreference: fields.investmentPreference || null,
          notes: fields.notes || null,
        },
      });
      setSuccess(true);
    } catch {
      setError(t('join_submit_error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success)
    return (
      <SuccessPanel
        message={t('join_submit_success')}
        onReset={() => setSuccess(false)}
        t={t}
      />
    );

  const sectorOptions = [
    { value: 'media', label: t('join_sector_media') },
    { value: 'real_estate', label: t('join_sector_real_estate') },
    { value: 'agriculture', label: t('join_sector_agriculture') },
    { value: 'ai', label: t('join_sector_ai') },
    { value: 'tourism', label: t('join_sector_tourism') },
    { value: 'other', label: t('join_sector_other') },
  ];

  return (
    <Form onSubmit={handleSubmit} className="py-3">
      <SectionTitle>{t('join_section_basic_info')}</SectionTitle>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_investor_name')} *</Form.Label>
            <Form.Control name="fullName" value={fields.fullName} onChange={handleField} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_company')}</Form.Label>
            <Form.Control name="companyName" value={fields.companyName} onChange={handleField} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_phone')} *</Form.Label>
            <Form.Control name="phoneNumber" value={fields.phoneNumber} onChange={handleField} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_email')} *</Form.Label>
            <Form.Control type="email" name="email" value={fields.email} onChange={handleField} required />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_address')}</Form.Label>
        <Form.Control name="address" value={fields.address} onChange={handleField} />
      </Form.Group>

      <SectionTitle>{t('join_section_investment_info')}</SectionTitle>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_currency')} *</Form.Label>
            <Form.Select name="investmentCurrency" value={fields.investmentCurrency} onChange={handleField}>
              <option value="AUD">{t('join_currency_aud')}</option>
              <option value="RMB">{t('join_currency_rmb')}</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>{t('join_field_investment_amount')}</Form.Label>
            <Form.Control
              type="number"
              step="any"
              name="investmentAmount"
              value={fields.investmentAmount}
              onChange={handleField}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_investment_sectors')}</Form.Label>
        <MultiCheck
          options={sectorOptions}
          selected={investmentSectors}
          onChange={v => setInvestmentSectors(prev => toggle(prev, v))}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t('join_field_investment_preference')}</Form.Label>
        <div>
          {[
            { value: 'short_term', label: t('join_pref_short_term') },
            { value: 'long_term', label: t('join_pref_long_term') },
            { value: 'strategic', label: t('join_pref_strategic') },
          ].map(opt => (
            <Form.Check
              key={opt.value}
              type="radio"
              id={`pref-${opt.value}`}
              name="investmentPreference"
              value={opt.value}
              label={opt.label}
              checked={fields.investmentPreference === opt.value}
              onChange={handleField}
            />
          ))}
        </div>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>{t('join_field_notes')}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="notes"
          value={fields.notes}
          onChange={handleField}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}
      <Button type="submit" variant="dark" disabled={submitting}>
        {submitting ? t('join_submitting') : t('join_submit_investor')}
      </Button>
    </Form>
  );
};

// ─────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────
const JoinApplication = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [activeKey, setActiveKey] = useState(
    searchParams.get('type') || 'influencer'
  );

  return (
    <>
      <PageTitle pageTitle={t('join_page_title')} />
      <Container className="my-5" style={{ maxWidth: '900px' }}>
        <Tabs
          activeKey={activeKey}
          onSelect={k => setActiveKey(k)}
          className="mb-2"
          justify
        >
          <Tab eventKey="influencer" title={t('join_type_influencer')}>
            <InfluencerForm key={`influencer-${activeKey}`} />
          </Tab>
          <Tab eventKey="land_owner" title={t('join_type_land_owner')}>
            <LandOwnerForm key={`land_owner-${activeKey}`} />
          </Tab>
          <Tab eventKey="partner" title={t('join_type_partner')}>
            <PartnerForm key={`partner-${activeKey}`} />
          </Tab>
          <Tab eventKey="investor" title={t('join_type_investor')}>
            <InvestorForm key={`investor-${activeKey}`} />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default JoinApplication;
