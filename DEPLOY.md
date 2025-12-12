# 🚀 הוראות דפלוי ל-Render

## ✅ הקוד הועלה ל-GitHub בהצלחה!

Repository: https://github.com/Jaywhitee9/SalesAI

---

## 📋 שלבי הדפלוי ב-Render

### 1. התחברות ל-Render
1. היכנס ל-[Render Dashboard](https://dashboard.render.com/)
2. התחבר עם חשבון GitHub שלך

### 2. יצירת Web Service חדש
1. לחץ על **"New +"** ← **"Web Service"**
2. חבר את ה-Repository: `Jaywhitee9/SalesAI`
3. לחץ **"Connect"**

### 3. הגדרות השירות

**Name:** `sales-coach-ai` (או כל שם שתרצה)

**Region:** Frankfurt (או Oregon/Singapore לפי העדפה)

**Branch:** `main`

**Build Command:**
```bash
cd client && npm install && npm run build && cd .. && npm install
```

**Start Command:**
```bash
node src/server.js
```

**Plan:** Free (או Starter אם אתה צריך יותר משאבים)

### 4. הגדרת Environment Variables

לחץ על **"Advanced"** והוסף את המשתנים הבאים:

| Key | Value | הערה |
|-----|-------|------|
| `NODE_VERSION` | `18` | |
| `TWILIO_ACCOUNT_SID` | `[הערך שלך]` | מ-.env המקומי |
| `TWILIO_AUTH_TOKEN` | `[הערך שלך]` | מ-.env המקומי |
| `TWILIO_PHONE_NUMBER` | `[הערך שלך]` | מ-.env המקומי |
| `SONIOX_API_KEY` | `[הערך שלך]` | מ-.env המקומי |
| `OPENAI_API_KEY` | `[הערך שלך]` | מ-.env המקומי |
| `OPENAI_BASE_URL` | `[הערך שלך]` | אופציונלי - רק אם משתמש ב-LLM מקומי |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | `[הערך שלך]` | אותו ערך כמו OPENAI_API_KEY |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | `[הערך שלך]` | אותו ערך כמו OPENAI_BASE_URL |
| `PORT` | `3000` | |

**💡 טיפ:** העתק את הערכים מקובץ `.env` המקומי שלך

### 5. Deploy!
1. לחץ **"Create Web Service"**
2. Render יתחיל לבנות ולהעלות את האפליקציה
3. תהליך הבנייה לוקח בערך 3-5 דקות

### 6. עדכון Twilio Webhooks

לאחר שהדפלוי מסתיים, תקבל URL כמו:
```
https://sales-coach-ai.onrender.com
```

עדכן ב-Twilio Console:
1. **TwiML App** → Voice Configuration:
   - Request URL: `https://sales-coach-ai.onrender.com/voice`
   - Method: `POST`

2. **Phone Number** → Voice Configuration:
   - A CALL COMES IN: `https://sales-coach-ai.onrender.com/voice`
   - Method: `POST`

---

## 🔍 בדיקה

לאחר הדפלוי:
1. פתח: `https://sales-coach-ai.onrender.com`
2. בדוק Health Check: `https://sales-coach-ai.onrender.com/api/health`
3. נסה להתחבר ולהתקשר

---

## 🐛 Troubleshooting

### הלוגים לא עובדים?
- בדוק את הלוגים ב-Render Dashboard → Logs
- וודא שכל ה-Environment Variables מוגדרים נכון

### השיחות מתנתקות מיד?
- וודא שעדכנת את ה-Twilio Webhooks עם ה-URL החדש של Render
- בדוק שה-`PUBLIC_URL` מזוהה אוטומטית (הקוד כבר מטפל בזה)

### Transcription לא עובד?
- וודא ש-`SONIOX_API_KEY` מוגדר נכון
- בדוק את הלוגים לשגיאות מ-Soniox

---

## 📝 הערות חשובות

1. **Free Plan של Render:**
   - השירות "נרדם" אחרי 15 דקות של חוסר פעילות
   - הטעינה הראשונה אחרי שינה לוקחת ~30 שניות
   - שקול Starter Plan ($7/חודש) לשירות 24/7

2. **Auto-Deploy:**
   - כל push ל-`main` branch יפעיל דפלוי אוטומטי
   - אפשר לכבות זאת בהגדרות אם רוצה

3. **Custom Domain:**
   - אפשר להוסיף דומיין מותאם אישית בהגדרות Render

---

✅ **הכל מוכן! הקוד ב-GitHub והוראות הדפלוי מוכנות.**
