import React from 'react';
import { motion } from 'framer-motion';
import '../styles/ShareButton.css';

function ShareButton({ card, deckTitle }) {
  const handleShare = async () => {
    const shareData = {
      title: `بطاقة تعليمية من ${deckTitle}`,
      text: `السؤال: ${card.front}\nالإجابة: ${card.back}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // نسخ النص إلى الحافظة إذا لم تكن المشاركة متاحة
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${shareData.text}\n\nرابط المجموعة: ${shareData.url}`
        );
        alert('تم نسخ البطاقة إلى الحافظة!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <motion.button
      className="share-button"
      onClick={handleShare}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      مشاركة
    </motion.button>
  );
}

export default ShareButton; 