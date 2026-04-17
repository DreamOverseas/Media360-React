// Utils Imports
import React from "react";
import { I18nextProvider } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import i18n from "./i18n.js"; // Ensure you have i18n setup correctly
import CuteChatbot from "@dreamoverseas/cute-chatbot";

// Style Imports
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Pages/Components Imports
import Footer from "./Components/Footer.jsx";
import Navigation from "./Components/Navigation.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Gallery from "./Pages/Gallery.jsx";
import Home from "./Pages/Home.jsx";
import Dog from "./Pages/Dog.jsx";
import IndividualVisitors from "./Pages/IndividualVisitors.jsx";
import GroupVisitors from "./Pages/GroupVisitors.jsx";
import RoomDetail from "./Pages/RoomDetail.jsx";
import RoomList from "./Pages/RoomList.jsx";
import MediaImageDisplay from "./Components/MediaImageDisplay.jsx";
import HtmlContent from "./Components/HtmlContent.jsx";
import RegisterForm from "./Components/RegisterForm.jsx";
import CheckIn from "./Pages/CheckIn.jsx";
import News from "./Components/News.jsx";
import MemberCenter from "./Pages/MembershipCenter.jsx";

function App() {

  const vite_openai_api_url = import.meta.env.VITE_OPENAI_API_URL;
  const vite_openai_asst_id = import.meta.env.VITE_OPENAI_ASST_ID;
  const vite_openai_api_key = import.meta.env.VITE_OPENAI_API_KEY;
  const vite_google_api = import.meta.env.VITE_GOOGLE_API;
  const CHAT_API = import.meta.env.VITE_CHAT_URL;

  return (
    <I18nextProvider i18n={i18n}>

      <div className='App'>
        <Navigation />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/about-us' element={<About />} />
          <Route path='/contact-us' element={<Contact />} />
          <Route path='/policy' element={<HtmlContent translationKey="guest_policy" />} />
          <Route path='/FAQ' element={<HtmlContent translationKey="stay_and_guide_content" />} />
          <Route path='/individual-visitors' element={<IndividualVisitors />} />
          <Route path='/group-visitors' element={<GroupVisitors />} />
          <Route path='/360-space' element={            
              <MediaImageDisplay 
                chineseUrl="investment"
              />
          } />
          <Route path='/invest-in-eco-stays' element={<HtmlContent translationKey="invest_in_eco_stays" />} />
          <Route path='/partnership' element={            
            <MediaImageDisplay
              chineseUrl="partnership-chinese"
              englishUrl="partnership-english"
            />} />
          <Route path='/product-service' element={
            <MediaImageDisplay
              chineseUrl="partnership-chinese"
              englishUrl="partnership-english"
            />} />
          <Route path='/influencer' element={            
            <MediaImageDisplay
              chineseUrl="influencer-chinese"
            />} />
          <Route path='/strategic' element={<HtmlContent translationKey="strategic_partner" />} />
          <Route path='/360-culture-events' element={<HtmlContent translationKey="events_activities" />} />
          <Route path='/events-activities' element={<HtmlContent translationKey="events_activities" />} />
          <Route path='/360-iip' element={  <HtmlContent translationKey="innovation_lab" />} />
          <Route path='/smarthouse' element={            
            <MediaImageDisplay 
              chineseUrl="investment"
            />} />
          <Route path='/AI-stay' element={            
            <MediaImageDisplay
              chineseUrl="ai-stay-chinese"
              englishUrl="ai-stay-english"
            />} />
          <Route path='/tiny-house' element={            
            <MediaImageDisplay 
              chineseUrl="tiny-house-chinese"
            />} />
          <Route path='/cooperation' element={
            <MediaImageDisplay 
              englishUrl="cooperation-english"
              chineseUrl="cooperation-chinese"
            />} />
          <Route path='/roomlist' element={<RoomList />} />
          <Route path='/book-membership' element={<HtmlContent translationKey="book.membership" imageUrl="/360_smart_card.jpg" imageAlt="smart_card" />} />
          <Route path='/eco-and-culture-tours' element={        
            <MediaImageDisplay 
              englishUrl="eco-and-culture-tours-english"
              chineseUrl="eco-and-culture-tours-chinese"
            />} />
          <Route path='/how-it-works' element={<HtmlContent translationKey="how_it_works_page" />} />
          <Route path='/land-owner-partnership' element={<HtmlContent translationKey="land_owner_join" />} />
          <Route path='/asset-growth-roadmap' element={<HtmlContent translationKey="asset_growth_roadmap" />} />
          <Route path='/innovation-lab' element={<HtmlContent translationKey="innovation_lab" />} />
          <Route path="/room/:documentId" element={<RoomDetail />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/check-in' element={<CheckIn />} />
          <Route path='/check-out' element={<HtmlContent translationKey="checkOut" />} />
          <Route path='/news' element={<News userType="forGuest"/>} />
          <Route path='/annual-news' element={<News userType="forAnnual"/>} />
          <Route path='/permanent-news' element={<News userType="forPermanent"/>} />
          <Route path='/membership' element={<MemberCenter />} />
          <Route path='/admin' element={<Dog />} />

          {/* About dropdown - new pages */}
          <Route path='/eco-living-assets' element={<HtmlContent translationKey="eco_living_assets" />} />
          <Route path='/founder-ip' element={<HtmlContent translationKey="founder_ip" />} />

          {/* Join Us dropdown - new Creator page */}
          <Route path='/creator' element={<HtmlContent translationKey="creator_page" />} />

          {/* How It Works dropdown */}
          <Route path='/land-owner-join' element={<HtmlContent translationKey="land_owner_join" />} />
          <Route path='/pre-assessment' element={<HtmlContent translationKey="pre_assessment" />} />
          <Route path='/compliance-application' element={<HtmlContent translationKey="compliance_application" />} />
          <Route path='/renovation-upgrade' element={<HtmlContent translationKey="renovation_upgrade" />} />
          <Route path='/management-service' element={<HtmlContent translationKey="management_service" />} />
          <Route path='/revenue-share' element={<HtmlContent translationKey="revenue_share" />} />

          {/* 360 Smart Card dropdown */}
          <Route path='/smart-card/membership-tiers-benefits' element={<HtmlContent translationKey="membership_tiers_benefits_page" />} />
          <Route path='/smart-card/points-spending-system' element={<HtmlContent translationKey="points_spending_system" />} />
          <Route path='/smart-card/ecosystem-benefits' element={<HtmlContent translationKey="ecosystem_benefits_page" />} />
          <Route path='/smart-card/asset-investment-benefits' element={<HtmlContent translationKey="asset_investment_benefits_page" />} />
          <Route path='/smart-card/membership-system' element={<HtmlContent translationKey="membership_system_page" />} />
          <Route path='/smart-card/points-circulation' element={<HtmlContent translationKey="points_circulation" />} />
          <Route path='/smart-card/investment-stay-benefits' element={<HtmlContent translationKey="investment_stay_benefits" />} />
          <Route path='/smart-card/referral-rewards' element={<HtmlContent translationKey="referral_rewards" />} />
        </Routes>
        <Footer />
      </div>
      {CHAT_API ?
            <CuteChatbot
              nickname='Roseneath Holiday Park'
              backend_url={CHAT_API}
              google_api_key={`${vite_google_api}`}
            />
            :
            <CuteChatbot
              nickname='Roseneath Holiday Park'
              openai_api_url={`${vite_openai_api_url}`}
              openai_asst_id={`${vite_openai_asst_id}`}
              openai_api_key={`${vite_openai_api_key}`}
              google_api_key={`${vite_google_api}`}
            />
          }
    </I18nextProvider>
  );
}

export default App;
