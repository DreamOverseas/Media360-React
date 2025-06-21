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
      <div className="max-w-7xl mx-auto py-6">
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
                <h3 className="text-base font-semibold text-white mb-3">Quick Links</h3>
                <div className="flex align-items-start flex-col gap-2 space-y-2">
                  <a href="/about-us" className="text-gray-300 text-white text-center text-decoration-none">
                    About Us
                  </a>
                  <a href="/networks" className="text-gray-300 text-white text-center text-decoration-none">
                    Our Networks
                  </a>
                  <a href="/news" className="text-gray-300 text-white text-center text-decoration-none">
                    News
                  </a>
                  <a href="/events" className="text-gray-300 text-white text-center text-decoration-none">
                    Events
                  </a>
                </div>
              </div>

              {/* Contact Us Column */}
              <div className="col-span-1">
                <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
                <div className="mt-3 space-y-6">
                  <div className="flex items-center gap-3">
                    <i className="bi bi-pin-map-fill text-lg text-blue-400 flex-shrink-0"></i>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=L2+171+La+Trobe+Street,+Melbourne+VIC+3000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-300 leading-relaxed text-white"
                    >
                      L2 171 La Trobe Street <br />
                      Melbourne VIC 3000
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="bi bi-telephone-inbound-fill text-lg text-blue-400 flex-shrink-0"></i>
                    <a href="tel:+61413168533" className="text-sm text-gray-300 text-white">
                      +61 (0)413 168 533
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="bi bi-mailbox2 text-lg text-blue-400 flex-shrink-0"></i>
                    <a href="mailto:info@do360.com" className="text-sm text-gray-300 text-white">
                      info@do360.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Follow Us Column */}
              <div className="col-span-1">
                <h3 className="text-base font-semibold text-center text-white mb-3">Follow Us</h3>
                <div className="flex justify-center items-center gap-2 mb-3">
                  <a
                    href="https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-gray-300"
                  >
                    <img src="/icons/red_note.png" alt="小红书" className="w-6 h-6" />
                  </a>
                  <a
                    href="https://space.bilibili.com/3546717257468817"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-gray-300"
                  >
                    <img src="/icons/bilibili.png" alt="B站" className="w-6 h-6" />
                  </a>
                  {/* <a
                    href="#"
                    className="flex flex-col items-center gap-1 text-gray-300"
                  >
                    <img src="/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="flex flex-col items-center gap-1 text-gray-300"
                  >
                    <img src="/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="flex flex-col items-center gap-1 text-gray-300"
                  >
                    <img src="/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
                  </a> */}
                </div>
                <div className="flex justify-center">
                  <a
                    href="/WechatOfficialAccount.png"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/WechatOfficialAccount.png" alt="WeChat" className="w-24 h-12 object-contain" />
                  </a>
                </div>
              </div>
            </div>

            {/* Desktop Bottom Section */}
            <div className="border-t border-gray-600 pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-400">
                  © 2024 Dream Overseas Group Pty Ltd. All rights reserved.
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
            <div>
              {/* Two Column Layout: Quick Links and Follow Us */}
              <div className="grid grid-cols-2 gap-4 mb-2">
                {/* Quick Links Section */}
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">Quick Links</h3>
                  <div className="flex align-items-start flex-col gap-2">
                    <a href="/about-us" className="text-gray-300 text-xs text-white text-center text-decoration-none">
                      About Us
                    </a>
                    <a href="/networks" className="text-gray-300 text-xs text-white text-center text-decoration-none">
                      Our Networks
                    </a>
                    <a href="/news" className="text-gray-300 text-xs text-white text-center text-decoration-none">
                      News
                    </a>
                    <a href="/events" className="text-gray-300 text-xs text-white text-center text-decoration-none">
                      Events
                    </a>
                  </div>
                </div>

                {/* Follow Us Section */}
                <div>
                  <h3 className="text-base font-semibold text-center text-white mb-2">Follow Us</h3>
                  <div className="flex justify-center items-center gap-2 mb-3">
                    <a
                      href="https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 text-gray-300"
                    >
                      <img src="/icons/red_note.png" alt="小红书" className="w-6 h-6" />
                    </a>
                    <a
                      href="https://space.bilibili.com/3546717257468817"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 text-gray-300"
                    >
                      <img src="/icons/bilibili.png" alt="B站" className="w-6 h-6" />
                    </a>
                    {/* <a
                      href="#"
                      className="flex flex-col items-center gap-1 text-gray-300"
                    >
                      <img src="/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center gap-1 text-gray-300"
                    >
                      <img src="/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
                    </a>
                    <a
                      href="#"
                      className="flex flex-col items-center gap-1 text-gray-300"
                    >
                      <img src="/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
                    </a> */}
                  </div>
                  <div className="flex justify-center">
                    <a
                      href="/WechatOfficialAccount.png"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src="/WechatOfficialAccount.png" alt="WeChat" className="w-24 h-12 object-contain" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Us Section */}
              <div className="pt-3 border-t border-gray-600 mb-2">
                <h3 className="text-base font-semibold mb-2 text-center text-white">Contact Us</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-3">
                    <a 
                      href="https://www.google.com/maps/place/171+La+Trobe+St,+Melbourne+VIC+3000/@-37.8089628,144.9640887,1693m/data=!3m1!1e3!4m6!3m5!1s0x6ad642ceaaa1eafd:0x3639407fc162ca2a!8m2!3d-37.8089628!4d144.966669!16s%2Fg%2F11bzzrlw_s?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-300 leading-tight text-center text-white"
                    >
                      L2 171 La Trobe Street, Melbourne VIC 3000
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <a href="tel:+61413168533" className="text-xs text-gray-300 text-white">
                      +61 (0)413 168 533
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <a href="mailto:info@do360.com" className="text-xs text-gray-300 text-white">
                      info@do360.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Join Us Button */}
              <div className="flex items-center justify-center mt-3 mb-3">
                <a href="/merchant/360-media-promotion-service">
                  <button className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors text-xs font-medium">
                    加入我们
                  </button>
                </a>
              </div>
            </div>

            {/* Mobile Bottom Section */}
            <div className="border-t border-gray-600 pt-3">
              <div className="text-center">
                <div className="text-xs text-gray-400">
                  <p className="mb-0">© 2024 Dream Overseas Group Pty Ltd.</p> 
                  <p className="mb-0">All rights reserved.</p>
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
