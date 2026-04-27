import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import DoTermsAndConditions from './DoTermsAndConditions';
import "../Css/Components.css";

// Environment variable assignments to be used in API calls.
const CMS_endpoint = import.meta.env.VITE_CMS_ENDPOINT;
const CMS_token = import.meta.env.VITE_CMS_TOKEN;
const email_service_endpoint = import.meta.env.VITE_EMAIL_API_ENDPOINT;

const LoginModal = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // State to manage the active tab. Default is 'register'
  const [activeTab, setActiveTab] = useState(() => {
    const urlTab = searchParams.get('tab');
    if (urlTab === 'login' || urlTab === 'register') {
      return urlTab;
    }
    return 'register'; // default
  });

  /* Registration form state variables */
  const [regUserName, setRegUserName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regVerificationCode, setRegVerificationCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  // This state holds the generated verification code after "Send Code" is clicked.
  const [generatedCode, setGeneratedCode] = useState(null);
  // Holds error or status messages for registration actions.
  const [regError, setRegError] = useState('');

  /* Login form state variables */
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  // Holds error messages for login actions.
  const [loginError, setLoginError] = useState('');

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (show) {
      const urlTab = searchParams.get('tab');
      if (urlTab === 'login' || urlTab === 'register') {
        setActiveTab(urlTab);
      }
    }
  }, [show, searchParams]);

  const handleCloseModal = () => {
    // Clear the tab parameter from URL when closing
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('tab');
    setSearchParams(newSearchParams);
    handleClose();
  };

  /**
   * Helper function to validate email using a basic regex.
   */
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  /**
 * Helper function to clear all form data in Modal
 */
  const clearModalData = () => {
    setRegEmail('');
    setLoginPassword('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegVerificationCode('');
    setRegError('');
  };

  /**
   * Handle clicking the "Send Code" button in the Registration tab.
   * Validates that required fields (User Name, Email, Password) are filled and that
   * the email address appears valid. If valid, generates a random 6-digit code,
   * stores it in state, and sends a POST request to the email service endpoint.
   */
  const handleSendCode = async () => {
    if (cooldown > 0) return;
    // Reset any existing error message.
    setRegError('');

    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Check that required fields are populated.
    if (!regUserName || !regEmail || !regPassword) {
      setRegError('Please fill out Name, Email, and Password fields before sending the code.');
      setCooldown(3);
      return;
    }
    // Validate email format.
    if (!validateEmail(regEmail)) {
      setRegError('Invalid email address.');
      setCooldown(3);
      return;
    }
    // Generate a 6-digit code.
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    try {
      // Send code to the email service endpoint with the required details.
      const res = await fetch(`${email_service_endpoint}/do-mail-code-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          verify_code: code,
          from: 'Roseneath Holiday Park',
          email: regEmail
        })
      });
      if (!res.ok) {
        setRegError('Failed to send verification code. Please try again.');
        setCooldown(0);
      } else {
        setRegError('Verification code sent successfully.');
      }
    } catch (error) {
      setRegError('Error sending verification code. Please try again.');
      setCooldown(0);
    }
  };

  /**
   * Handle registration form submission.
   * Validates that all fields are filled, the passwords match,
   * and that the entered verification code matches the one generated.
   */
  const handleRegister = async () => {
    // Reset any error message.
    setRegError('');

    // Validate that all fields are non-empty.
    if (!regUserName || !regEmail || !regPassword || !regConfirmPassword || !regVerificationCode) {
      setRegError('Please fill out all registration fields.');
      return;
    }
    // Check that password is at least 8 characters.
    if (regPassword.length < 8) {
      setRegError('Password must be over 8 charactors.');
      setCooldown(3);
      return;
    }
    // Validate that both password fields match.
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      setCooldown(3);
      return;
    }
    // Must agree with our user aggreement
    if (!agreed) {
      setRegError('Please tick agree with our T&C.');
      return;
    }
    // Validate that the entered verification code matches the generated one.
    if (regVerificationCode !== generatedCode) {
      setRegError('Invalid verification code.');
      return;
    }

    try {
      // Create a new entry in the 'RHPMembership' collection type on Strapi.
      const req_body = JSON.stringify({
        data: {
          UserName: regUserName,
          Email: regEmail,
          Password: regPassword,
          IsMember: false
        }
      });
      const res = await fetch(`${CMS_endpoint}/api/rhp-memberships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CMS_token}`
        },
        body: req_body
      });
      if (res.ok) {
        const data = await res.json();
        // Set cookies for the authentication token and basic user details.
        Cookies.set('AuthToken', 'roseneath-holiday-park-website', { expires: 7 });
        const userCookie = {
          name: regUserName,
          email: regEmail,
          is_member: false,
          tenant_type: 'Guest'     // Default after registration
        };
        Cookies.set('user', JSON.stringify(userCookie));
        handleClose();
        clearModalData();
        navigate('/membership');
      } else {
        setRegError('Registration failed. Please try again. Your Email may have linked to an account.');
      }
    } catch (error) {
      console.error(error);
      setRegError('Error during registration. Please contact us and we are here for help!');
    }
  };

  /**
   * Handle login form submission.
   * Sends entered email and password to the CMS_endpoint.
   * If a 400 response is returned, informs the user via an alert.
   * On success (200), retrieves the user data from Strapi using the email,
   * sets cookies accordingly, and navigates the user to the membership page.
   * Displays an inline error if credentials are incorrect.
   */
  const handleLogin = async () => {
    // Reset any existing login error message.
    setLoginError('');

    // Validate that both login fields are non-empty.
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill out both email and password.');
      return;
    }

    try {
      // Send a POST request with the login credentials.
      const res = await fetch(`${CMS_endpoint}/api/rhp-memberships/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CMS_token}`
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      // If the response status is 400, alert the user.
      if (res.status === 400) {
        window.alert('Something is wrong, please contact us.');
        return;
      }
      // On success, fetch the full user details using the provided email.
      if (res.ok) {
        const userRes = await fetch(
          `${CMS_endpoint}/api/rhp-memberships?filters[Email][$eq]=${loginEmail}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${CMS_token}`
            }
          }
        );
        if (userRes.ok) {
          const userData = await userRes.json();
          const userAttributes = userData.data[0];
          // Create a base user cookie.
          let userCookie = {
            name: userAttributes.UserName,
            email: userAttributes.Email,
            is_member: userAttributes.IsMember,
            contact: userAttributes.Contact || 'Not Specified',
            tenant_type: userAttributes.TenantType
          };
          // If the user is a member, add additional fields to the cookie.
          if (userAttributes.IsMember) {
            userCookie = {
              ...userCookie,
              number: userAttributes.MembershipNumber || 'N/A',
              fname: userAttributes.FirstName || 'Not Specified',
              lname: userAttributes.LastName || 'Not Specified',
              exp: userAttributes.ExpiryDate || 'N/A',
              point: userAttributes.Point || 'N/A',
              discount_p: userAttributes.DiscountPoint || 'N/A'
            };
          }
          Cookies.set('user', JSON.stringify(userCookie));
          Cookies.set('AuthToken', 'roseneath-holiday-park-website', { expires: 7 });
          console.log(`Logged ${userAttributes.TenantType} user ${userAttributes.FirstName} in.`);
          handleClose();
          clearModalData();
          navigate('/membership');
        } else {
          setLoginError('Failed to retrieve user data.');
        }
      } else {
        setLoginError('Either email or password is wrong.');
      }
    } catch (error) {
      console.error(error);
      setLoginError('Error during login.');
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-sm text-gray-800 placeholder-gray-400';
  const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

  return (
    <Modal show={show} onHide={handleCloseModal} centered dialogClassName="login-modal-dialog">
      <div className="rounded-2xl overflow-hidden shadow-2xl">
        {/* Gradient header banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 pt-6 pb-10 relative">
          <button
            onClick={handleCloseModal}
            className="absolute top-3 right-4 text-white/70 hover:text-white text-xl font-light leading-none"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-lg">🏕️</span>
            </div>
            <div>
              <p className="text-white/80 text-xs uppercase tracking-widest">360 Media</p>
              <h2 className="text-white font-bold text-lg leading-tight">
                {activeTab === 'register' ? t('register_button') : t('login_button')}
              </h2>
            </div>
          </div>
        </div>

        {/* Tab switcher — floated up over the gradient */}
        <div className="px-6 -mt-2 pt-6">
          <div className="flex bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <button
              onClick={() => { setActiveTab('register'); setSearchParams({ tab: 'register' }); }}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-inner'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <div className="leading-tight">
                <div>{t('register_button')}</div>
                <div className={`text-xs font-normal mt-0.5 ${activeTab === 'register' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {i18n.language === 'zh' ? '新用户请点击这里注册' : 'New Users Register Here'}
                </div>
              </div>
            </button>
            <button
              onClick={() => { setActiveTab('login'); setSearchParams({ tab: 'login' }); }}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-inner'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <div className="leading-tight">
                <div>{t('login_button')}</div>
                <div className={`text-xs font-normal mt-0.5 ${activeTab === 'login' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {i18n.language === 'zh' ? '会员点击此处登录' : 'Members Login Here'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Form body */}
        <div className="px-6 py-5 bg-white">
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('login_username')}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={regUserName}
                  onChange={(e) => setRegUserName(e.target.value)}
                  placeholder={t('login_username')}
                />
              </div>
              <div>
                <label className={labelClass}>{t('email')}</label>
                <input
                  type="email"
                  className={inputClass}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className={labelClass}>{t('login_pwd')}</label>
                <input
                  type="password"
                  className={inputClass}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-400 mt-1">{t('login_pwd_info')}</p>
              </div>
              <div>
                <label className={labelClass}>{t('login_comf_pwd')}</label>
                <input
                  type="password"
                  className={inputClass}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className={labelClass}>{t('login_vrf_code')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={`${inputClass} flex-1`}
                    value={regVerificationCode}
                    onChange={(e) => setRegVerificationCode(e.target.value)}
                    placeholder="000000"
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={cooldown > 0}
                    className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
                  >
                    {cooldown > 0 ? `${t('login_sent')} (${cooldown})` : t('login_send_code')}
                  </button>
                </div>
              </div>

              {regError && (
                <div className={`text-xs px-3 py-2 rounded-lg ${regError.includes('success') || regError.includes('成功') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {regError}
                </div>
              )}

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreementCheck"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-blue-600 cursor-pointer"
                />
                <label htmlFor="agreementCheck" className="text-xs text-gray-500 cursor-pointer">
                  {t('readTnC')} <DoTermsAndConditions defaultLang={i18n.language ? i18n.language : 'en'} />
                </label>
              </div>

              <button
                onClick={handleRegister}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                {t('contactForm_submit')}
              </button>
            </div>
          )}

          {activeTab === 'login' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('email')}</label>
                <input
                  type="email"
                  className={inputClass}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className={labelClass}>{t('login_pwd')}</label>
                <input
                  type="password"
                  className={inputClass}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div className="text-xs px-3 py-2 rounded-lg bg-red-50 text-red-500">
                  {loginError}
                </div>
              )}

              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                {t('login_button')}
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
