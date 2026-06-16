import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import {
  CLUB_MEMBERSHIP_TERMS_BILINGUAL,
  CLUB_MEMBERSHIP_TERMS_TITLE,
} from '../Constants/clubMembershipTerms';

const ClubMembershipTermsAgreement = ({
  checked,
  onChange,
  error,
  checkboxId,
}) => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <Form.Group className="mb-4">
      <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
        <strong>{CLUB_MEMBERSHIP_TERMS_TITLE}</strong>
        <Button
          type="button"
          variant="outline-secondary"
          size="sm"
          onClick={() => setShowTerms(prev => !prev)}
        >
          {showTerms ? 'Hide Terms / 收起条款' : 'View Terms / 查看条款'}
        </Button>
      </div>

      {showTerms && (
        <div
          className="border rounded p-3 mb-3 bg-light"
          style={{ maxHeight: '320px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.88rem' }}
        >
          {CLUB_MEMBERSHIP_TERMS_BILINGUAL}
        </div>
      )}

      <Form.Check
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        label="I have read and agree to the 360 CLUB MEMBERSHIP TERMS & CONDITIONS / 我已阅读并同意《360俱乐部会员条款与条件》"
      />

      {error && (
        <Alert variant="danger" className="mt-2 mb-0 py-2 px-3 small">
          {error}
        </Alert>
      )}
    </Form.Group>
  );
};

export default ClubMembershipTermsAgreement;
