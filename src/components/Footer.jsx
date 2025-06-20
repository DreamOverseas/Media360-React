import React from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import "../css/Footer.css";
import DoTermsAndConditions from "./DoTermsAndConditions";

const Footer = () => {
  const onDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {onDesktop ? (
          <>
            {/* Desktop Layout */}
            <div className="grid grid-cols-4 gap-8 mb-8">
              {/* Logo Column */}
              <div className="col-span-1">
                <div className="w-24 mb-4">
                  <img
                    src="/footer_logo.png"
                    alt="Logo"
                    className="w-full h-auto"
                  />
                </div>
                <a href="/merchant/360-media-promotion-service">
                  <button className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors text-sm font-medium">
                    加入我们
                  </button>
                </a>
              </div>

              {/* Quick Links Column */}
              <div className="col-span-1">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/news" className="text-gray-300 hover:text-white transition-colors">
                      News
                    </a>
                  </li>
                  <li>
                    <a href="/events" className="text-gray-300 hover:text-white transition-colors">
                      Events
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Us Column */}
              <div className="col-span-1">
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <i className="bi bi-pin-map-fill text-lg text-blue-400"></i>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      L2 171 La Trobe Street <br />
                      Melbourne VIC 3000
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="bi bi-telephone-inbound-fill text-lg text-blue-400"></i>
                    <p className="text-sm text-gray-300">
                      <a href="tel:+61413168533" className="hover:text-white transition-colors">
                        +61 (0)413 168 533
                      </a>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="bi bi-mailbox2 text-lg text-blue-400"></i>
                    <p className="text-sm text-gray-300">info@do360.com</p>
                  </div>
                </div>
              </div>

              {/* Follow Us Column */}
              <div className="col-span-1">
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="space-y-4">
                  {/* Social Media Links - 4 icons in a row */}
                  <div className="flex gap-3">
                    <a
                      href="https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors"
                    >
                      <img src="/icons/red_note.png" alt="小红书" className="w-5 h-5" />
                      <span className="text-xs">小红书</span>
                    </a>
                    <a
                      href="https://space.bilibili.com/3546717257468817"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors"
                    >
                      <img src="/icons/bilibili.png" alt="B站" className="w-5 h-5" />
                      <span className="text-xs">B站</span>
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors"
                    >
                      <img src="/icons/instagram.png" alt="Instagram" className="w-5 h-5" />
                      <span className="text-xs">Instagram</span>
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors"
                    >
                      <img src="/icons/facebook.png" alt="Facebook" className="w-5 h-5" />
                      <span className="text-xs">Facebook</span>
                    </a>
                  </div>
                  
                  {/* WeChat QR Code - Next row */}
                  <div className="pt-2">
                    <div className="flex justify-center">
                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">WeChat Official Account</p>
                        <div className="w-20 h-20">
                          <img
                            src="/WechatOfficialAccount.png"
                            alt="WeChat Official Account"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Bottom Section */}
            <div className="border-t border-gray-600 pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-400">
                  © 2024 Do360. All rights reserved.
                </div>
                <div className="flex gap-6 text-sm">
                  <DoTermsAndConditions defaultLang="en" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Mobile Layout */}
            <div className="mb-4">
              {/* Mobile Logo */}
              <div className="flex flex-col items-center mb-4 space-y-2">
                <div className="w-12">
                  <img
                    src="/footer_logo.png"
                    alt="Logo"
                    className="w-full h-auto"
                  />
                </div>
                <a href="/merchant/360-media-promotion-service">
                  <button className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors text-xs font-medium">
                    加入我们
                  </button>
                </a>
              </div>

              {/* Quick Links Section */}
              <div className="mb-4">
                <h3 className="text-base font-semibold mb-2 text-center text-white">Quick Links</h3>
                <div className="flex justify-center gap-4">
                  <a href="/about-us" className="text-gray-300 hover:text-white transition-colors text-xs">
                    About Us
                  </a>
                  <a href="/news" className="text-gray-300 hover:text-white transition-colors text-xs">
                    News
                  </a>
                  <a href="/events" className="text-gray-300 hover:text-white transition-colors text-xs">
                    Events
                  </a>
                </div>
              </div>

              {/* Contact Us Section */}
              <div className="mb-4">
                <h3 className="text-base font-semibold mb-2 text-center text-white">Contact Us</h3>
                <div className="space-y-2">
                  <div className="flex items-start justify-center gap-2">
                    <i className="bi bi-pin-map-fill text-sm text-blue-400"></i>
                    <p className="text-xs text-gray-300 leading-tight text-center">
                      L2 171 La Trobe Street, Melbourne VIC 3000
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <i className="bi bi-telephone-inbound-fill text-sm text-blue-400"></i>
                    <p className="text-xs text-gray-300">
                      <a href="tel:+61413168533" className="hover:text-white transition-colors">
                        +61 (0)413 168 533
                      </a>
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <i className="bi bi-mailbox2 text-sm text-blue-400"></i>
                    <p className="text-xs text-gray-300">info@do360.com</p>
                  </div>
                </div>
              </div>

              {/* Follow Us Section */}
              <div className="pt-3 border-t border-gray-600">
                <h3 className="text-base font-semibold mb-3 text-center text-white">Follow Us</h3>
                <div className="flex justify-center items-center gap-6">
                  <a
                    href="https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors"
                  >
                    <img src="/icons/red_note.png" alt="小红书" className="w-6 h-6" />
                    <span className="text-xs">小红书</span>
                  </a>
                  <a
                    href="https://space.bilibili.com/3546717257468817"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors"
                  >
                    <img src="/icons/bilibili.png" alt="B站" className="w-6 h-6" />
                    <span className="text-xs">B站</span>
                  </a>
                  <a
                    href="#"
                    className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors"
                  >
                    <img src="/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
                    <span className="text-xs">Instagram</span>
                  </a>
                  <a
                    href="/WechatOfficialAccount.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors"
                  >
                    <img src="/WechatOfficialAccount.png" alt="WeChat" className="w-6 h-6" />
                    <span className="text-xs">WeChat</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Section */}
            <div className="border-t border-gray-600 pt-3">
              <div className="text-center space-y-2">
                <div className="text-xs text-gray-400">
                  © 2024 Dream Overseas Group Pty Ltd. All rights reserved.
                </div>
                <div className="flex justify-center text-xs">
                  <DoTermsAndConditions defaultLang="en" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
