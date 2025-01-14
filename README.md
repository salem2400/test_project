# بطاقات تعلم اللغة

تطبيق تفاعلي لتعلم اللغات باستخدام البطاقات التعليمية (Flashcards).

## المميزات الرئيسية
- نظام تسجيل دخول وإدارة حسابات المستخدمين
- إنشاء وإدارة مجموعات البطاقات التعليمية
- تتبع تقدم التعلم
- مشاركة البطاقات على وسائل التواصل الاجتماعي
- واجهة مستخدم متجاوبة مع جميع الأجهزة
- حركات وتأثيرات بصرية جذابة

## التقنيات المستخدمة
- React.js
- Firebase (المصادقة وقاعدة البيانات)
- Framer Motion (للحركات والتأثيرات)
- React Router
- CSS Modules

## متطلبات التشغيل
- Node.js (الإصدار 14 أو أحدث)
- npm أو yarn

## تعليمات التثبيت
1. استنساخ المشروع:
```bash
git clone [رابط المشروع]
```

2. تثبيت التبعيات:
```bash
npm install
```

3. تشغيل المشروع محلياً:
```bash
npm start
```

## هيكل المشروع
```
src/
  ├── components/     # مكونات React القابلة لإعادة الاستخدام
  ├── pages/         # صفحات التطبيق
  ├── assets/        # الصور والموارد
  ├── styles/        # ملفات CSS
  ├── firebase/      # إعدادات Firebase
  ├── hooks/         # React Hooks المخصصة
  └── context/       # React Context
``` 