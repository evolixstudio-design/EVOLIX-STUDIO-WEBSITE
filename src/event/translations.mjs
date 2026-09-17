export const LANGUAGES = [
  { code: 'en', label: 'English', htmlLang: 'en' },
  { code: 'hi', label: 'हिन्दी', htmlLang: 'hi' },
  { code: 'hinglish', label: 'Hinglish', htmlLang: 'hi-Latn' },
  { code: 'gu', label: 'ગુજરાતી', htmlLang: 'gu' },
  { code: 'gu-latn', label: 'Gujarati (English)', htmlLang: 'gu-Latn' },
];

// Each row is English | Hindi | Hinglish | Gujarati | Gujarati in Latin letters.
// Values are display copy only. Answer indices, industry values and scoring stay canonical.
const rows = `
Brand clarity|ब्रांड की स्पष्टता|Brand ki clarity|બ્રાન્ડની સ્પષ્ટતા|Brand ni spashtata
Online presence|ऑनलाइन पहचान|Online pehchaan|ઓનલાઇન હાજરી|Online hajari
Lead generation|नई पूछताछ|Nayi enquiries|નવી પૂછપરછ|Navi puchhparachh
Sales process|बिक्री की प्रक्रिया|Sales process|વેચાણ પ્રક્રિયા|Vechan prakriya
Customer information|ग्राहकों की जानकारी|Customer ki jaankari|ગ્રાહકોની માહિતી|Grahako ni mahiti
Operations|रोज़मर्रा का काम|Roz ka kaam|રોજિંદું કામકાજ|Rojindu kaamkaj
Scalability|विकास की तैयारी|Growth ki taiyari|વિકાસની તૈયારી|Vikas ni taiyari
First impressions matter.|पहली छाप मायने रखती है।|Pehli impression zaroori hai.|પહેલી છાપ મહત્વની છે.|Paheli chhap mahatvani chhe.
Be worth discovering.|ऑनलाइन अपनी पहचान बनाएं।|Online apni pehchaan banayein.|ઓનલાઇન ઓળખ બનાવો.|Online olakh banavo.
Make opportunity repeatable.|नए अवसर नियमित बनाएं।|Naye mauke regular banayein.|નવી તકો નિયમિત બનાવો.|Navi tako niyamit banavo.
Give every enquiry a next step.|हर पूछताछ को आगे बढ़ाएं।|Har enquiry ko aage badhayein.|દરેક પૂછપરછને આગળ વધારો.|Darek puchhparachh ne aagal vadharo.
Bring the pieces together.|जानकारी एक जगह लाएं।|Jaankari ek jagah laayein.|માહિતી એક જગ્યાએ લાવો.|Mahiti ek jagyae lavo.
Make room for better work.|बेहतर काम के लिए समय बचाएं।|Behtar kaam ke liye waqt bachayein.|વધુ સારા કામ માટે સમય બચાવો.|Vadhu sara kaam mate samay bachavo.
Get ready for what’s next.|अगले कदम के लिए तैयार हों।|Agle step ke liye taiyar ho jaayein.|આગળના પગલા માટે તૈયાર થાઓ.|Aagal na pagla mate taiyar thao.
If a new customer sees your business for 10 seconds, will they understand what you do and why they should choose you?|क्या नया ग्राहक 10 सेकंड में समझ सकता है कि आप क्या करते हैं और आपको क्यों चुने?|Kya naya customer 10 second mein samjhega ki aap kya karte hain aur aapko kyun chune?|શું નવો ગ્રાહક 10 સેકન્ડમાં સમજી શકે કે તમે શું કરો છો અને તમને શા માટે પસંદ કરે?|Shu navo grahak 10 second ma samji shake ke tame shu karo chho ane tamne sha mate pasand kare?
Yes, our positioning is extremely clear|हाँ, हमारी पहचान और खासियत बिल्कुल स्पष्ट है|Haan, hamari positioning bilkul clear hai|હા, અમારી ઓળખ અને ખાસિયત ખૂબ સ્પષ્ટ છે|Haa, amari olakh ane khasiyat khub spasht chhe
Mostly clear, but we could communicate it better|काफ़ी स्पष्ट है, पर बेहतर बता सकते हैं|Kaafi clear hai, par behtar bata sakte hain|ઘણી સ્પષ્ટ છે, પણ વધુ સારી રીતે જણાવી શકીએ|Ghani spasht chhe, pan vadhu sari rite janavi shakie
We mainly explain our products/services|हम मुख्यतः अपने उत्पाद या सेवाएं बताते हैं|Hum mainly products ya services batate hain|અમે મુખ્યત્વે અમારા ઉત્પાદનો કે સેવાઓ જણાવીએ છીએ|Ame mukhyatve amara products ke services janavie chhie
Not really / we have never thought about this|नहीं / हमने इस बारे में सोचा नहीं|Nahi / humne is baare mein socha nahi|ના / અમે આ વિશે વિચાર્યું નથી|Naa / ame aa vishe vicharyu nathi
When someone searches for your business online, what do they find?|कोई आपका व्यवसाय ऑनलाइन खोजे, तो उसे क्या मिलता है?|Koi aapka business online dhoondhe, toh kya milta hai?|કોઈ તમારો વ્યવસાય ઓનલાઇન શોધે, તો તેને શું મળે છે?|Koi tamaro business online shodhe, to tene shu male chhe?
Professional website + active social presence + correct business information|पेशेवर वेबसाइट, सक्रिय सोशल मीडिया और सही जानकारी|Professional website, active social media aur sahi business info|પ્રોફેશનલ વેબસાઇટ, સક્રિય સોશિયલ મીડિયા અને સાચી માહિતી|Professional website, active social media ane sachi mahiti
Website and social media, but some parts are outdated|वेबसाइट और सोशल मीडिया हैं, पर कुछ जानकारी पुरानी है|Website aur social media hain, par kuch info purani hai|વેબસાઇટ અને સોશિયલ મીડિયા છે, પણ થોડી માહિતી જૂની છે|Website ane social media chhe, pan thodi mahiti juni chhe
Mainly Instagram/social media or Google listing|मुख्यतः Instagram, सोशल मीडिया या Google लिस्टिंग|Mainly Instagram, social media ya Google listing|મુખ્યત્વે Instagram, સોશિયલ મીડિયા કે Google લિસ્ટિંગ|Mainly Instagram, social media ke Google listing
Very little / nothing professional|बहुत कम / कुछ भी पेशेवर नहीं|Bahut kam / kuch bhi professional nahi|બહુ ઓછું / કંઈ પ્રોફેશનલ નથી|Bahu ochhu / kai professional nathi
Where do most of your new enquiries currently come from?|अभी आपकी ज़्यादातर नई पूछताछ कहाँ से आती है?|Abhi aapki zyadaatar nayi enquiries kahan se aati hain?|હાલમાં તમારી મોટાભાગની નવી પૂછપરછ ક્યાંથી આવે છે?|Haal ma tamari motabhag ni navi enquiries kyathi aave chhe?
Multiple predictable channels|कई माध्यमों से नियमित पूछताछ|Kai channels se regular enquiries|ઘણા માધ્યમોથી નિયમિત પૂછપરછ|Ghana channels thi regular enquiries
One strong channel consistently|एक मज़बूत माध्यम से नियमित पूछताछ|Ek strong channel se regular enquiries|એક મજબૂત માધ્યમથી નિયમિત પૂછપરછ|Ek majboot channel thi regular enquiries
Mostly referrals / occasional social media enquiries|मुख्यतः परिचितों से / कभी-कभी सोशल मीडिया से|Mostly referrals / kabhi-kabhi social media se|મુખ્યત્વે ઓળખાણથી / ક્યારેક સોશિયલ મીડિયા પરથી|Mostly olkhan thi / kyarek social media par thi
We don't have a predictable source of leads|नई पूछताछ का कोई नियमित स्रोत नहीं है|Nayi enquiries ka koi regular source nahi hai|નવી પૂછપરછનો કોઈ નિયમિત સ્રોત નથી|Navi enquiries no koi regular source nathi
Do you have a defined process from enquiry → follow-up → quotation → payment?|क्या पूछताछ → फ़ॉलो-अप → कोटेशन → भुगतान की तय प्रक्रिया है?|Kya enquiry → follow-up → quotation → payment ka process tay hai?|શું પૂછપરછ → ફોલો-અપ → ક્વોટેશન → ચુકવણીની નક્કી પ્રક્રિયા છે?|Shu enquiry → follow-up → quotation → payment ni nakki process chhe?
Yes, it is clear and consistently followed|हाँ, प्रक्रिया स्पष्ट है और नियमित अपनाई जाती है|Haan, process clear hai aur regular follow hota hai|હા, પ્રક્રિયા સ્પષ્ટ છે અને નિયમિત અનુસરાય છે|Haa, process clear chhe ane regular follow thay chhe
Mostly, but some steps are manual or inconsistent|काफ़ी हद तक, पर कुछ चरण हाथ से या अनियमित हैं|Mostly, par kuch steps manual ya irregular hain|મોટેભાગે, પણ કેટલાક પગલાં મેન્યુઅલ કે અનિયમિત છે|Motebhage, pan ketlak steps manual ke irregular chhe
It depends on the person handling it|यह काम संभालने वाले व्यक्ति पर निर्भर है|Yeh handle karne wale insaan par depend hai|તે કામ સંભાળનાર વ્યક્તિ પર આધાર રાખે છે|Te kaam sambhalnar vyakti par aadhar rakhe chhe
No defined process|कोई तय प्रक्रिया नहीं है|Koi fixed process nahi hai|કોઈ નક્કી પ્રક્રિયા નથી|Koi nakki process nathi
Where is your customer and sales information stored?|ग्राहकों और बिक्री की जानकारी कहाँ रखी जाती है?|Customer aur sales ki jaankari kahan rakhi jaati hai?|ગ્રાહકો અને વેચાણની માહિતી ક્યાં રાખવામાં આવે છે?|Grahako ane sales ni mahiti kya rakhvama aave chhe?
One organised system / CRM / ERP|एक व्यवस्थित सिस्टम, CRM या ERP में|Ek organised system, CRM ya ERP mein|એક વ્યવસ્થિત સિસ્ટમ, CRM કે ERPમાં|Ek organised system, CRM ke ERP ma
Mostly organised spreadsheets or software|मुख्यतः व्यवस्थित स्प्रेडशीट या सॉफ़्टवेयर में|Mostly organised spreadsheets ya software mein|મુખ્યત્વે વ્યવસ્થિત સ્પ્રેડશીટ કે સોફ્ટવેરમાં|Mostly organised spreadsheets ke software ma
WhatsApp + spreadsheets + notebooks across different places|अलग-अलग WhatsApp चैट, स्प्रेडशीट और नोटबुक में|Alag-alag WhatsApp, spreadsheets aur notebooks mein|અલગ-અલગ WhatsApp, સ્પ્રેડશીટ અને નોટબુકમાં|Alag-alag WhatsApp, spreadsheets ane notebooks ma
There is no proper system|कोई व्यवस्थित सिस्टम नहीं है|Koi proper system nahi hai|કોઈ યોગ્ય સિસ્ટમ નથી|Koi yogya system nathi
How much repetitive work does your team still do manually?|आपकी टीम का कितना दोहराया जाने वाला काम अभी भी हाथ से होता है?|Team ka kitna repeat hone wala kaam abhi bhi manual hai?|તમારી ટીમનું કેટલું વારંવાર થતું કામ હજુ મેન્યુઅલ છે?|Tamari team nu ketlu varamvar thatu kaam haju manual chhe?
Very little; most repetitive work is systemised|बहुत कम; ज़्यादातर दोहराए जाने वाले काम व्यवस्थित हैं|Bahut kam; zyadaatar repeat work systemised hai|બહુ ઓછું; મોટાભાગનું વારંવારનું કામ સિસ્ટમથી થાય છે|Bahu ochhu; motabhag nu repeat work system thi thay chhe
Some manual work remains|कुछ काम अभी भी हाथ से होता है|Kuch manual kaam abhi baaki hai|થોડું કામ હજુ મેન્યુઅલ છે|Thodu kaam haju manual chhe
A lot of everyday work is manual|रोज़ का बहुत-सा काम हाथ से होता है|Roz ka kaafi kaam manual hai|રોજિંદું ઘણું કામ મેન્યુઅલ છે|Rojindu ghanu kaam manual chhe
Almost everything depends on people doing it manually|लगभग हर काम लोगों को हाथ से करना पड़ता है|Lagbhag har kaam log manually karte hain|લગભગ બધું કામ લોકોએ મેન્યુઅલી કરવું પડે છે|Lagbhag badhu kaam loko e manually karvu pade chhe
If your business suddenly doubled in customers next month, could your current systems handle the growth smoothly?|अगले महीने ग्राहक अचानक दोगुने हो जाएं, तो क्या मौजूदा सिस्टम आसानी से संभाल पाएंगे?|Agle mahine customers achanak double ho jaayein, toh current systems aasani se sambhal paayenge?|આવતા મહિને ગ્રાહકો અચાનક બમણા થાય, તો શું હાલની સિસ્ટમ સરળતાથી સંભાળી શકશે?|Aavta mahine customers achanak bamna thay, to shu haal ni system saraltathi sambhali shakshe?
Yes, we could handle it comfortably|हाँ, हम आसानी से संभाल सकते हैं|Haan, hum aasani se handle kar sakte hain|હા, અમે સરળતાથી સંભાળી શકીએ|Haa, ame saraltathi sambhali shakie
Mostly, but we would need some adjustments|काफ़ी हद तक, पर कुछ बदलाव करने होंगे|Mostly, par kuch adjustments karne honge|મોટેભાગે, પણ થોડા ફેરફાર કરવા પડશે|Motebhage, pan thoda ferfar karva padshe
We would probably struggle in several areas|कई क्षेत्रों में मुश्किल हो सकती है|Kai areas mein mushkil ho sakti hai|ઘણા ક્ષેત્રોમાં મુશ્કેલી પડી શકે|Ghana areas ma mushkeli padi shake
No, our current process would become difficult to manage|नहीं, मौजूदा प्रक्रिया संभालना मुश्किल होगा|Nahi, current process manage karna mushkil hoga|ના, હાલની પ્રક્રિયા સંભાળવી મુશ્કેલ બનશે|Naa, haal ni process sambhalvi mushkel banshe
Submit & continue|जवाब दें और आगे बढ़ें|Jawab dein aur aage badhein|જવાબ આપો અને આગળ વધો|Jawab aapo ane aagal vadho
Submit & see my score|जवाब दें और स्कोर देखें|Jawab dein aur score dekhein|જવાબ આપો અને સ્કોર જુઓ|Jawab aapo ane score juo
QUESTION|प्रश्न|Sawaal|પ્રશ્ન|Prashna
YOUR RESULTS|आपके परिणाम|Aapke results|તમારાં પરિણામો|Tamara results
YOUR NEXT CHAPTER|आपका अगला कदम|Aapka agla kadam|તમારું આગળનું પગલું|Tamaru aagal nu paglu
THE EVOLUTION JOURNEY|विकास का सफ़र|Growth ka safar|વિકાસની સફર|Vikas ni safar
Explore the map|पूरा रास्ता देखें|Poora raasta dekhein|આખો માર્ગ જુઓ|Aakho marg juo
Back to my stop|मेरे पड़ाव पर लौटें|Mere stop par lautein|મારા પડાવ પર પાછા|Mara padav par pachha
Drag the scene to look around|देखने के लिए दृश्य खिसकाएं|Scene ko drag karke dekhein|જોવા માટે દૃશ્ય ખસેડો|Jova mate scene drag karo
Replay your note|नोट फिर देखें|Note phir dekhein|નોટ ફરી જુઓ|Note fari juo
Replay intro|शुरुआत फिर देखें|Intro phir dekhein|શરૂઆત ફરી જુઓ|Intro fari juo
Skip intro|सीधे आगे बढ़ें|Seedha aage badhein|સીધા આગળ વધો|Sidha aagal vadho
Skip to the audit|सीधे सवालों पर जाएं|Seedha sawaalon par jaayein|સીધા પ્રશ્નો પર જાઓ|Sidha prashno par jao
Preparing your 3D path|आपका 3D सफ़र तैयार हो रहा है|Aapka 3D safar taiyar ho raha hai|તમારી 3D સફર તૈયાર થઈ રહી છે|Tamari 3D safar taiyar thai rahi chhe
A little further.|एक और कदम।|Ek aur kadam.|એક પગલું આગળ.|Ek paglu aagal.
Your next chapter.|आपका अगला कदम।|Aapka agla kadam.|તમારું આગળનું પગલું.|Tamaru aagal nu paglu.
Follow the path. Find your possibility.|आगे बढ़ें, नई संभावनाएं जानें।|Aage badhein, naye mauke jaanein.|આગળ વધો, નવી શક્યતાઓ જાણો.|Aagal vadho, navi shakyatao jano.
Seven answers. A clearer way forward.|सात जवाब। आगे की राह स्पष्ट।|Saat jawab. Aage ka raasta clear.|સાત જવાબ. આગળનો માર્ગ સ્પષ્ટ.|Saat jawab. Aagal no marg spasht.
Every answer opens a new possibility.|हर जवाब एक नई संभावना खोलता है।|Har jawab ek naya mauka kholta hai.|દરેક જવાબ નવી શક્યતા ખોલે છે.|Darek jawab navi shakyata khole chhe.
SEVEN ANSWERS COMPLETE|सातों जवाब पूरे|Saare saat jawab poore|સાતેય જવાબ પૂર્ણ|Saatey jawab poora
Your business snapshot|आपके व्यवसाय की झलक|Aapke business ki jhalak|તમારા વ્યવસાયની ઝલક|Tamara business ni jhalak
YOUR BUSINESS SNAPSHOT|आपके व्यवसाय की झलक|Aapke business ki jhalak|તમારા વ્યવસાયની ઝલક|Tamara business ni jhalak
Choose what feels closest to your business today.|अपने व्यवसाय की आज की स्थिति चुनें।|Business ki aaj ki situation chunein.|તમારા વ્યવસાયની હાલની સ્થિતિ પસંદ કરો.|Tamara business ni haal ni sthiti pasand karo.
captured. Your next stop awaits.|दर्ज हो गया। अगला पड़ाव तैयार है।|Save ho gaya. Agla stop taiyar hai.|નોંધાઈ ગયું. આગળનો પડાવ તૈયાર છે.|Nondhai gayu. Aagal no padav taiyar chhe.
Go to the previous stop|पिछले सवाल पर जाएं|Pichhle sawaal par jaayein|પાછલા પ્રશ્ન પર જાઓ|Pachhla prashna par jao
7 QUESTIONS · ABOUT 2 MINUTES|7 सवाल · लगभग 2 मिनट|7 sawaal · lagbhag 2 minute|7 પ્રશ્નો · લગભગ 2 મિનિટ|7 prashno · lagbhag 2 minute
EVOLVE WHAT’S NEXT.|अगले कदम को बेहतर बनाएं।|Agla kadam behtar banayein.|આગળનું પગલું વધુ સારું બનાવો.|Aagal nu paglu vadhu saru banavo.
Evolve what’s next.|अगले कदम को बेहतर बनाएं।|Agla kadam behtar banayein.|આગળનું પગલું વધુ સારું બનાવો.|Aagal nu paglu vadhu saru banavo.
A FRESH PERSPECTIVE, JUST FOR YOU.|आपके लिए एक नया नज़रिया।|Aapke liye ek naya nazariya.|તમારા માટે એક નવો દૃષ્ટિકોણ.|Tamara mate ek navo drashtikon.
BUSINESS EVOLUTION AUDIT|व्यवसाय विकास आकलन|Business Growth Audit|વ્યવસાય વિકાસ આકલન|Business Vikas Audit
ONE SMALL MOMENT OF CURIOSITY.|जिज्ञासा का एक छोटा-सा पल।|Jigyasa ka ek chhota sa pal.|જિજ્ઞાસાની એક નાની ક્ષણ.|Jignyasa ni ek nani kshan.
A whole new|एक बिल्कुल नया|Ek bilkul naya|એક સાવ નવો|Ek saav navo
perspective.|नज़रिया।|nazariya.|દૃષ્ટિકોણ.|drashtikon.
YOUR NEXT CHAPTER IS ABOUT TO BEGIN|आपका अगला सफ़र शुरू होने वाला है|Aapka agla safar shuru hone wala hai|તમારી આગળની સફર શરૂ થવાની છે|Tamari aagal ni safar sharu thavani chhe
THE FINAL STEP|आख़िरी कदम|Aakhri kadam|છેલ્લું પગલું|Chhellu paglu
ALL SEVEN ANSWERS. ALL YOUR POTENTIAL.|सातों जवाब। आपकी सारी संभावनाएं।|Saat jawab. Aapke saare mauke.|સાતેય જવાબ. તમારી બધી શક્યતાઓ.|Saatey jawab. Tamari badhi shakyatao.
Your EVOLIX Score|आपका EVOLIX स्कोर|Aapka EVOLIX Score|તમારો EVOLIX સ્કોર|Tamaro EVOLIX Score
YOUR EVOLIX SCORE|आपका EVOLIX स्कोर|Aapka EVOLIX Score|તમારો EVOLIX સ્કોર|Tamaro EVOLIX Score
is ready.|तैयार है।|taiyar hai.|તૈયાર છે.|taiyar chhe.
Add your business details to reveal your score and three next steps.|स्कोर और अगले तीन कदम देखने के लिए व्यवसाय की जानकारी दें।|Score aur agle teen steps dekhne ke liye business details dein.|સ્કોર અને આગળનાં ત્રણ પગલાં જોવા વ્યવસાયની માહિતી આપો.|Score ane aagal na tran pagla jova business ni mahiti aapo.
Your name|आपका नाम|Aapka naam|તમારું નામ|Tamaru naam
Your full name|आपका पूरा नाम|Aapka poora naam|તમારું પૂરું નામ|Tamaru pooru naam
Business name|व्यवसाय का नाम|Business ka naam|વ્યવસાયનું નામ|Business nu naam
Your business name|आपके व्यवसाय का नाम|Aapke business ka naam|તમારા વ્યવસાયનું નામ|Tamara business nu naam
WhatsApp number|WhatsApp नंबर|WhatsApp number|WhatsApp નંબર|WhatsApp number
Industry|व्यवसाय का क्षेत्र|Business ka sector|વ્યવસાયનું ક્ષેત્ર|Business nu kshetra
Select your industry|अपना क्षेत्र चुनें|Apna sector chunein|તમારું ક્ષેત્ર પસંદ કરો|Tamaru kshetra pasand karo
Website / Instagram|वेबसाइट / Instagram|Website / Instagram|વેબસાઇટ / Instagram|Website / Instagram
Optional|वैकल्पिक|Optional|વૈકલ્પિક|Vaikalpik
I agree to receive my audit result and relevant business recommendations from EVOLIX.|मैं EVOLIX से अपना आकलन और संबंधित व्यावसायिक सुझाव पाने के लिए सहमत हूँ।|Main EVOLIX se apna audit result aur relevant business suggestions paane ke liye sahmat hoon.|હું EVOLIX પાસેથી મારું આકલન અને સંબંધિત વ્યવસાયિક સૂચનો મેળવવા સંમત છું.|Hu EVOLIX pase thi maru audit result ane sambandhit business suggestions melavva sahmat chhu.
Your details are collected by EVOLIX Studio.|आपकी जानकारी EVOLIX Studio द्वारा ली जाती है।|Aapki details EVOLIX Studio collect karta hai.|તમારી માહિતી EVOLIX Studio દ્વારા લેવામાં આવે છે.|Tamari mahiti EVOLIX Studio le chhe.
How we use them|इसका उपयोग कैसे होता है|Iska use kaise hota hai|તેનો ઉપયોગ કેવી રીતે થાય છે|Teno upyog kevi rite thay chhe
Reveal my EVOLIX Score|मेरा EVOLIX स्कोर देखें|Mera EVOLIX Score dekhein|મારો EVOLIX સ્કોર જુઓ|Maro EVOLIX Score juo
Preparing your roadmap…|आपकी योजना तैयार हो रही है…|Aapka roadmap taiyar ho raha hai…|તમારી યોજના તૈયાર થઈ રહી છે…|Tamaro roadmap taiyar thai rahyo chhe…
Review my last answer|पिछला जवाब देखें|Pichhla jawab dekhein|પાછલો જવાબ જુઓ|Pachhlo jawab juo
Review answers|जवाब देखें|Jawab dekhein|જવાબો જુઓ|Jawabo juo
SEVEN ANSWERS. ONE CLEARER PICTURE.|सात जवाब। एक स्पष्ट तस्वीर।|Saat jawab. Ek clear picture.|સાત જવાબ. એક સ્પષ્ટ ચિત્ર.|Saat jawab. Ek clear picture.
Your next chapter|आपका अगला कदम|Aapka agla kadam|તમારું આગળનું પગલું|Tamaru aagal nu paglu
is taking shape.|आकार ले रहा है।|taiyar ho raha hai.|આકાર લઈ રહ્યું છે.|aakar lai rahyu chhe.
Bringing your score and recommendations together|आपका स्कोर और सुझाव तैयार हो रहे हैं|Aapka score aur suggestions taiyar ho rahe hain|તમારો સ્કોર અને સૂચનો તૈયાર થઈ રહ્યાં છે|Tamaro score ane suggestions taiyar thai rahya chhe
A fresh perspective for|एक नया नज़रिया:|Ek naya nazariya:|એક નવો દૃષ્ટિકોણ:|Ek navo drashtikon:
A starting point for what’s next.|अगले कदम की शुरुआत।|Agle kadam ki shuruaat.|આગળના પગલાની શરૂઆત.|Aagal na pagla ni sharuaat.
Self-assessment · Maximum achievable score: 85|स्व-आकलन · अधिकतम स्कोर: 85|Self-assessment · Maximum score: 85|સ્વ-આકલન · મહત્તમ સ્કોર: 85|Self-assessment · Maximum score: 85
YOUR STRONGEST AREA|आपका सबसे मज़बूत क्षेत्र|Aapka sabse strong area|તમારું સૌથી મજબૂત ક્ષેત્ર|Tamaru sauthi majboot kshetra
A strength to build on.|इस मज़बूती को आगे बढ़ाएं।|Is strength ko aage badhayein.|આ મજબૂતીને આગળ વધારો.|Aa majbooti ne aagal vadharo.
YOUR NEXT OPPORTUNITY|आपका अगला अवसर|Aapka agla mauka|તમારી આગળની તક|Tamari aagal ni tak
YOUR BIGGEST OPPORTUNITY|आपका सबसे बड़ा अवसर|Aapka sabse bada mauka|તમારી સૌથી મોટી તક|Tamari sauthi moti tak
Explore the next advantage.|अगली बढ़त खोजें।|Agla advantage dhoondhein.|આગળની સરસાઈ શોધો.|Aagal ni sarsai shodho.
A useful place to start.|शुरुआत के लिए सही जगह।|Shuruaat ki achhi jagah.|શરૂઆત માટે યોગ્ય જગ્યા.|Sharuaat mate yogya jagya.
ANOTHER NEXT STEP|एक और अगला कदम|Ek aur agla step|આગળનું બીજું પગલું|Aagal nu biju paglu
SECOND OPPORTUNITY|दूसरा अवसर|Doosra mauka|બીજી તક|Biji tak
Keep the momentum going.|आगे बढ़ते रहें।|Aage badhte rahein.|આગળ વધતા રહો.|Aagal vadhta raho.
See your seven-area breakdown|सातों क्षेत्रों का विवरण देखें|Saare saat areas ki details dekhein|સાતેય ક્ષેત્રોની વિગતો જુઓ|Saatey kshetra ni vigato juo
Areas use the same answer-level scale for fair comparison. Overall points follow the weighted audit and are capped at 85.|निष्पक्ष तुलना के लिए सभी क्षेत्रों में जवाबों का समान पैमाना है। कुल स्कोर अलग-अलग प्रश्नों के भार से बनता है और अधिकतम 85 है।|Fair comparison ke liye sabhi areas ka answer scale same hai. Total score weighted audit se banta hai aur maximum 85 hai.|યોગ્ય સરખામણી માટે બધા ક્ષેત્રોમાં જવાબોનું સમાન માપદંડ છે. કુલ સ્કોર પ્રશ્નોના વજન પ્રમાણે બને છે અને મહત્તમ 85 છે.|Yogya sarkhamani mate badha areas no answer scale same chhe. Total score weighted audit thi bane chhe ane maximum 85 chhe.
YOUR PERSONAL EVOLUTION ROADMAP|आपके विकास की व्यक्तिगत योजना|Aapki personal growth plan|તમારા વિકાસની વ્યક્તિગત યોજના|Tamara vikas ni personal yojana
Three moves.|तीन कदम।|Teen kadam.|ત્રણ પગલાં.|Tran pagla.
More possibility.|ज़्यादा संभावनाएं।|Zyada mauke.|વધુ શક્યતાઓ.|Vadhu shakyatao.
Based on your answers, here’s where you could go next—and how we can help you get there.|आपके जवाबों के अनुसार ये आपके अगले कदम हो सकते हैं—और इनमें हम आपकी मदद कर सकते हैं।|Aapke jawabon ke hisaab se yeh agle steps ho sakte hain, aur hum aapki madad kar sakte hain.|તમારા જવાબો મુજબ આ તમારા આગળનાં પગલાં હોઈ શકે છે, જેમાં અમે મદદ કરી શકીએ.|Tamara jawabo mujab aa tamara aagal na pagla hoi shake chhe, jema ame madad kari shakie.
MADE BY EVOLIX|EVOLIX द्वारा बनाया गया|EVOLIX ne banaya|EVOLIX દ્વારા બનાવેલું|EVOLIX e banavelu
See the project on our portfolio|हमारे पोर्टफोलियो में प्रोजेक्ट देखें|Hamare portfolio mein project dekhein|અમારા પોર્ટફોલિયોમાં પ્રોજેક્ટ જુઓ|Amara portfolio ma project juo
Visit live project|लाइव प्रोजेक्ट देखें|Live project dekhein|લાઇવ પ્રોજેક્ટ જુઓ|Live project juo
YOUR BUSINESS ISN’T FINISHED EVOLVING.|आपके व्यवसाय का विकास अभी जारी है।|Aapke business ki growth abhi baaki hai.|તમારા વ્યવસાયનો વિકાસ હજુ ચાલુ છે.|Tamara business no vikas haju chalu chhe.
Let’s write your|आइए लिखें आपका|Chaliye likhein aapka|ચાલો લખીએ તમારું|Chalo lakhie tamaru
next chapter.|अगला अध्याय।|agla chapter.|આગળનું પ્રકરણ.|aagal nu prakaran.
Turn your score into a practical roadmap.|अपने स्कोर से एक उपयोगी कार्ययोजना बनाएं।|Apne score se practical roadmap banayein.|તમારા સ્કોર પરથી ઉપયોગી કાર્યયોજના બનાવો.|Tamara score par thi practical roadmap banavo.
Start a conversation with the people who can help.|मदद कर सकने वाली टीम से बात शुरू करें।|Madad karne wali team se baat shuru karein.|મદદ કરી શકે તેવી ટીમ સાથે વાત શરૂ કરો.|Madad kari shake tevi team sathe vaat sharu karo.
Start your journey with EVOLIX|EVOLIX के साथ सफ़र शुरू करें|EVOLIX ke saath safar shuru karein|EVOLIX સાથે સફર શરૂ કરો|EVOLIX sathe safar sharu karo
Visit our website|हमारी वेबसाइट देखें|Hamari website dekhein|અમારી વેબસાઇટ જુઓ|Amari website juo
Visit EVOLIX Studio|EVOLIX Studio की वेबसाइट देखें|EVOLIX Studio ki website dekhein|EVOLIX Studio ની વેબસાઇટ જુઓ|EVOLIX Studio ni website juo
Your message opens in WhatsApp. You choose when to send.|संदेश WhatsApp में खुलेगा। भेजना आपके हाथ में है।|Message WhatsApp mein khulega. Bhejna aapke haath mein hai.|સંદેશ WhatsAppમાં ખુલશે. ક્યારે મોકલવો તે તમે નક્કી કરો.|Message WhatsApp ma khulshe. Kyare mokalvo te tame nakki karo.
Start a new audit|नया आकलन शुरू करें|Naya audit shuru karein|નવું આકલન શરૂ કરો|Navu audit sharu karo
Start a fresh chapter?|फिर से शुरुआत करें?|Phir se shuru karein?|ફરીથી શરૂઆત કરવી છે?|Fari thi sharuaat karvi chhe?
This clears your answers and result from this browser tab. Your previously submitted audit remains with EVOLIX.|इस टैब से आपके जवाब और परिणाम हटेंगे। पहले भेजा गया आकलन EVOLIX के पास रहेगा।|Is tab se jawab aur result hatenge. Pehle submit kiya audit EVOLIX ke paas rahega.|આ ટેબમાંથી તમારા જવાબો અને પરિણામ દૂર થશે. અગાઉ મોકલેલું આકલન EVOLIX પાસે રહેશે.|Aa tab mathi tamara jawabo ane result door thashe. Agau moklelu audit EVOLIX pase raheshe.
Keep my result|मेरा परिणाम रखें|Mera result rakhein|મારું પરિણામ રાખો|Maru result rakho
Privacy|गोपनीयता|Privacy|ગોપનીયતા|Gopaniyata
Your details, with care.|आपकी जानकारी, सावधानी से।|Aapki details, dhyaan se.|તમારી માહિતી, કાળજીથી.|Tamari mahiti, kalji thi.
Close dialog|बंद करें|Band karein|બંધ કરો|Bandh karo
EVOLIX Studio collects your name, business details, WhatsApp number, answers and consent to prepare your audit result and discuss relevant recommendations with you.|EVOLIX Studio आपका नाम, व्यवसाय की जानकारी, WhatsApp नंबर, जवाब और सहमति लेता है, ताकि आकलन तैयार करके संबंधित सुझावों पर आपसे बात कर सके।|EVOLIX Studio aapka naam, business details, WhatsApp number, jawab aur consent leta hai, taaki audit taiyar karke relevant suggestions par baat kar sake.|EVOLIX Studio તમારું નામ, વ્યવસાયની માહિતી, WhatsApp નંબર, જવાબો અને સંમતિ લે છે, જેથી આકલન તૈયાર કરીને સંબંધિત સૂચનો વિશે વાત કરી શકે.|EVOLIX Studio tamaru naam, business ni mahiti, WhatsApp number, jawabo ane sammati le chhe, jethi audit taiyar kari sambandhit suggestions vishe vaat kari shake.
Your information is saved when you reveal your score. Your in-progress answers and contact details stay in this browser tab so you can continue after a refresh.|स्कोर देखते समय आपकी जानकारी सेव होती है। अधूरे जवाब और संपर्क जानकारी इस टैब में रहते हैं, ताकि रिफ्रेश के बाद जारी रख सकें।|Score dekhte waqt details save hoti hain. Adhoore jawab aur contact info is tab mein rehte hain, taaki refresh ke baad continue kar sakein.|સ્કોર જોતી વખતે તમારી માહિતી સેવ થાય છે. અધૂરા જવાબો અને સંપર્ક માહિતી આ ટેબમાં રહે છે, જેથી રિફ્રેશ પછી આગળ વધી શકો.|Score joti vakhte mahiti save thay chhe. Adhoora jawabo ane contact info aa tab ma rahe chhe, jethi refresh pachhi aagal vadhi shako.
We record basic audit milestones to understand whether this experience is useful. Your contact details are not included in those events.|अनुभव की उपयोगिता समझने के लिए हम आकलन के मुख्य चरण दर्ज करते हैं। इन घटनाओं में आपकी संपर्क जानकारी शामिल नहीं होती।|Experience ki usefulness samajhne ke liye hum audit ke main steps record karte hain. In events mein contact details nahi hoti.|આ અનુભવની ઉપયોગિતા સમજવા અમે આકલનનાં મુખ્ય પગલાં નોંધીએ છીએ. આ ઇવેન્ટમાં તમારી સંપર્ક માહિતી સામેલ નથી.|Aa experience ni upyogita samajva ame audit na main steps nondhie chhie. Aa events ma tamari contact mahiti samel nathi.
For access, correction or deletion, contact|जानकारी देखने, सुधारने या हटाने के लिए संपर्क करें|Details dekhne, sudhaarne ya hatane ke liye contact karein|માહિતી જોવા, સુધારવા કે દૂર કરવા સંપર્ક કરો|Mahiti jova, sudharva ke door karva sampark karo
Your EVOLIX Score is a quick self-assessment based on your answers, not a certified business evaluation. Scores are capped at 85/100.|EVOLIX स्कोर आपके जवाबों पर आधारित त्वरित स्व-आकलन है, प्रमाणित व्यावसायिक मूल्यांकन नहीं। अधिकतम स्कोर 85/100 है।|EVOLIX Score aapke jawabon par based quick self-assessment hai, certified business evaluation nahi. Maximum score 85/100 hai.|EVOLIX સ્કોર તમારા જવાબો આધારિત ઝડપી સ્વ-આકલન છે, પ્રમાણિત વ્યવસાયિક મૂલ્યાંકન નથી. મહત્તમ સ્કોર 85/100 છે.|EVOLIX Score tamara jawabo par aadharit quick self-assessment chhe, certified business evaluation nathi. Maximum score 85/100 chhe.
Retail|खुदरा व्यापार|Retail|છૂટક વેપાર|Chhutak vepar
Trading|व्यापार|Trading|વેપાર|Vepar
Manufacturing|विनिर्माण|Manufacturing|ઉત્પાદન|Utpadan
Construction|निर्माण|Construction|બાંધકામ|Bandhkaam
Real Estate|रियल एस्टेट|Real Estate|રિયલ એસ્ટેટ|Real Estate
Healthcare|स्वास्थ्य सेवा|Healthcare|આરોગ્ય સેવા|Aarogya seva
Education|शिक्षा|Education|શિક્ષણ|Shikshan
Food & Beverage|खाद्य और पेय|Food & Beverage|ખાદ્ય અને પીણાં|Khadya ane peena
Beauty & Wellness|सौंदर्य और स्वास्थ्य|Beauty & Wellness|સૌંદર્ય અને સુખાકારી|Saundarya ane sukhakari
Professional Services|पेशेवर सेवाएं|Professional Services|વ્યાવસાયિક સેવાઓ|Vyavsayik sevao
E-commerce|ई-कॉमर्स|E-commerce|ઈ-કોમર્સ|E-commerce
Automotive|वाहन उद्योग|Automotive|વાહન ઉદ્યોગ|Vahan udyog
Hospitality|आतिथ्य सेवा|Hospitality|આતિથ્ય સેવા|Aatithya seva
Export/Import|निर्यात/आयात|Export/Import|નિકાસ/આયાત|Nikas/Aayat
Other|अन्य|Other|અન્ય|Anya
Enter your name (2–80 characters).|अपना नाम लिखें (2–80 अक्षर)।|Apna naam likhein (2–80 characters).|તમારું નામ લખો (2–80 અક્ષર).|Tamaru naam lakho (2–80 characters).
Enter your business name (2–120 characters).|व्यवसाय का नाम लिखें (2–120 अक्षर)।|Business ka naam likhein (2–120 characters).|વ્યવસાયનું નામ લખો (2–120 અક્ષર).|Business nu naam lakho (2–120 characters).
Enter a valid number with country code, such as +91 98765 43210.|देश कोड सहित सही नंबर लिखें, जैसे +91 98765 43210।|Country code ke saath sahi number likhein, jaise +91 98765 43210.|દેશના કોડ સાથે સાચો નંબર લખો, જેમ કે +91 98765 43210.|Country code sathe sacho number lakho, jem ke +91 98765 43210.
Choose your industry.|अपना व्यवसाय क्षेत्र चुनें।|Apna business sector chunein.|તમારા વ્યવસાયનું ક્ષેત્ર પસંદ કરો.|Tamara business nu kshetra pasand karo.
Enter a website or Instagram handle under 250 characters.|250 अक्षरों से कम में वेबसाइट या Instagram नाम लिखें।|250 characters se kam mein website ya Instagram handle likhein.|250 અક્ષરથી ઓછામાં વેબસાઇટ કે Instagram નામ લખો.|250 characters thi ochha ma website ke Instagram handle lakho.
Please confirm the checkbox to continue.|आगे बढ़ने के लिए सहमति दें।|Aage badhne ke liye checkbox confirm karein.|આગળ વધવા માટે સંમતિ આપો.|Aagal vadhva mate checkbox confirm karo.
Please answer all seven questions.|सातों सवालों के जवाब दें।|Saare saat sawaalon ke jawab dein.|સાતેય પ્રશ્નોના જવાબ આપો.|Saatey prashno na jawab aapo.
The connection is taking longer than expected. Your answers are safe. Please try again.|कनेक्शन में समय लग रहा है। आपके जवाब सुरक्षित हैं। फिर कोशिश करें।|Connection mein waqt lag raha hai. Jawab safe hain. Phir try karein.|કનેક્શનમાં સમય લાગી રહ્યો છે. તમારા જવાબો સુરક્ષિત છે. ફરી પ્રયત્ન કરો.|Connection ma samay lagi rahyo chhe. Jawabo safe chhe. Fari try karo.
Please check your connection and try again. Your answers are still here.|कनेक्शन जाँचकर फिर कोशिश करें। आपके जवाब अभी भी मौजूद हैं।|Connection check karke phir try karein. Aapke jawab abhi bhi yahin hain.|કનેક્શન તપાસીને ફરી પ્રયત્ન કરો. તમારા જવાબો હજુ અહીં છે.|Connection check kari fari try karo. Tamara jawabo haju ahi chhe.
We couldn’t save your result. Please try again.|परिणाम सेव नहीं हुआ। फिर कोशिश करें।|Result save nahi hua. Phir try karein.|પરિણામ સેવ થયું નથી. ફરી પ્રયત્ન કરો.|Result save thayu nathi. Fari try karo.
We couldn’t save your result. Your answers are safe—please try again.|परिणाम सेव नहीं हुआ। जवाब सुरक्षित हैं—फिर कोशिश करें।|Result save nahi hua. Jawab safe hain—phir try karein.|પરિણામ સેવ થયું નથી. જવાબો સુરક્ષિત છે—ફરી પ્રયત્ન કરો.|Result save thayu nathi. Jawabo safe chhe—fari try karo.
Too many requests. Please wait a few minutes and try again.|बहुत ज़्यादा अनुरोध हैं। कुछ मिनट बाद फिर कोशिश करें।|Bahut requests hain. Kuch minute baad phir try karein.|ઘણી વિનંતીઓ છે. થોડી મિનિટ પછી ફરી પ્રયત્ન કરો.|Ghani requests chhe. Thodi minute pachhi fari try karo.
This submission changed. Please update a field and try again.|जानकारी बदल गई है। कोई फ़ील्ड अपडेट करके फिर कोशिश करें।|Details badal gayi hain. Ek field update karke phir try karein.|માહિતી બદલાઈ છે. કોઈ ફીલ્ડ અપડેટ કરીને ફરી પ્રયત્ન કરો.|Mahiti badlai chhe. Ek field update kari fari try karo.
Your answer suggests this area is working well. Review its performance and look for small improvements that support your next stage of growth.|आपके जवाब से यह क्षेत्र अच्छा काम कर रहा है। प्रदर्शन देखें और आगे के विकास के लिए छोटे सुधार खोजें।|Aapke jawab se yeh area achha chal raha hai. Performance dekhein aur next growth ke liye chhote improvements dhoondhein.|તમારા જવાબ મુજબ આ ક્ષેત્ર સારું કામ કરે છે. કામગીરી તપાસો અને આગળના વિકાસ માટે નાના સુધારા શોધો.|Tamara jawab mujab aa area saru kaam kare chhe. Performance tapaso ane aagal na vikas mate nana sudhara shodho.
Foundation needed|बुनियाद मज़बूत करें|Foundation strong karein|પાયો મજબૂત કરો|Payo majboot karo
Developing|विकास जारी है|Growth chal rahi hai|વિકાસ ચાલુ છે|Vikas chalu chhe
Growth ready|विकास के लिए तैयार|Growth ke liye ready|વિકાસ માટે તૈયાર|Vikas mate taiyar
Digitally strong|डिजिटल रूप से मज़बूत|Digitally strong|ડિજિટલ રીતે મજબૂત|Digitally majboot
A stronger foundation starts here.|मज़बूत बुनियाद की शुरुआत यहाँ से।|Strong foundation ki shuruaat yahan se.|મજબૂત પાયાની શરૂઆત અહીંથી.|Majboot paya ni sharuaat ahithi.
Connect the pieces. Unlock the potential.|कड़ियाँ जोड़ें। संभावनाएं खोलें।|Cheezein jodein. Potential kholein.|કડી જોડો. શક્યતાઓ ખોલો.|Kadi jodo. Shakyatao kholo.
A good foundation. A bigger future.|अच्छी बुनियाद। बड़ा भविष्य।|Achhi foundation. Bada future.|સારો પાયો. મોટું ભવિષ્ય.|Saro payo. Motu bhavishya.
Strong foundations. New possibilities.|मज़बूत बुनियाद। नई संभावनाएं।|Strong foundation. Naye mauke.|મજબૂત પાયો. નવી શક્યતાઓ.|Majboot payo. Navi shakyatao.
There are opportunities to strengthen how your business is presented, discovered and managed. Start with the fundamentals.|व्यवसाय की प्रस्तुति, पहचान और प्रबंधन को बेहतर बनाया जा सकता है। बुनियादी चीज़ों से शुरू करें।|Business ki presentation, pehchaan aur management behtar ho sakte hain. Basics se shuru karein.|વ્યવસાયની રજૂઆત, ઓળખ અને સંચાલન સુધારવાની તકો છે. પાયાની બાબતોથી શરૂ કરો.|Business ni rajuat, olakh ane management sudharvani tako chhe. Basics thi sharu karo.
You have pieces working. Connecting the important parts could reduce manual work and create a more consistent customer experience.|कई चीज़ें काम कर रही हैं। ज़रूरी हिस्से जोड़ने से हाथ का काम घटेगा और ग्राहकों का अनुभव बेहतर होगा।|Kuch cheezein achhi chal rahi hain. Important parts jodne se manual work kam aur customer experience consistent hoga.|કેટલીક બાબતો સારી ચાલે છે. મહત્વના ભાગો જોડવાથી મેન્યુઅલ કામ ઘટશે અને ગ્રાહકોનો અનુભવ વધુ સુસંગત બનશે.|Ketlik babato sari chale chhe. Important parts jodvathi manual work ghatshe ane customer experience consistent banshe.
Your business has several strong foundations. Improving a few areas could make growth more predictable and easier to manage.|आपके व्यवसाय की कई बुनियादें मज़बूत हैं। कुछ सुधार विकास को अधिक नियमित और संभालना आसान बना सकते हैं।|Business ki kai foundations strong hain. Kuch improvements se growth regular aur manage karna aasaan ho sakta hai.|તમારા વ્યવસાયના ઘણા પાયા મજબૂત છે. થોડા સુધારાથી વિકાસ વધુ નિયમિત અને સંભાળવામાં સરળ બની શકે.|Tamara business na ghana paya majboot chhe. Thoda sudhara thi growth regular ane manage karvi saral bani shake.
Your answers indicate a solid digital and operational base. Your next opportunity is to connect systems, reduce friction and prepare for scale.|आपके जवाब मज़बूत डिजिटल और कामकाजी बुनियाद दिखाते हैं। अब सिस्टम जोड़ें, रुकावटें घटाएं और बड़े विकास की तैयारी करें।|Aapke jawab strong digital aur operational base dikhate hain. Ab systems jodein, rukavatein ghatayein aur scale ki taiyari karein.|તમારા જવાબો મજબૂત ડિજિટલ અને કાર્યકારી પાયો બતાવે છે. હવે સિસ્ટમ જોડો, અડચણો ઘટાડો અને મોટા વિકાસ માટે તૈયાર થાઓ.|Tamara jawabo majboot digital ane operational base batave chhe. Have systems jodo, adchano ghatado ane scale mate taiyar thao.
Conversion intelligence|बिक्री में बदलाव की समझ|Conversion insights|વેચાણમાં રૂપાંતરની સમજ|Conversion ni samaj
Connected reporting|जुड़ी हुई रिपोर्टिंग|Connected reporting|જોડાયેલું રિપોર્ટિંગ|Jodayelu reporting
Advanced automation|उन्नत ऑटोमेशन|Advanced automation|અદ્યતન ઓટોમેશન|Advanced automation
Brand identity · E-commerce|ब्रांड पहचान · ई-कॉमर्स|Brand identity · E-commerce|બ્રાન્ડ ઓળખ · ઈ-કોમર્સ|Brand olakh · E-commerce
Website · 3D experience|वेबसाइट · 3D अनुभव|Website · 3D experience|વેબસાઇટ · 3D અનુભવ|Website · 3D anubhav
Social media · Paid advertising|सोशल मीडिया · सशुल्क विज्ञापन|Social media · Paid ads|સોશિયલ મીડિયા · પેઇડ જાહેરાત|Social media · Paid ads
Custom software · Sales pipeline|कस्टम सॉफ़्टवेयर · बिक्री प्रक्रिया|Custom software · Sales pipeline|કસ્ટમ સોફ્ટવેર · વેચાણ પ્રક્રિયા|Custom software · Sales pipeline
Custom ERP · Business operations|कस्टम ERP · व्यवसाय संचालन|Custom ERP · Business operations|કસ્ટમ ERP · વ્યવસાય સંચાલન|Custom ERP · Business operations
Custom CRM · Orders & finance|कस्टम CRM · ऑर्डर और वित्त|Custom CRM · Orders aur finance|કસ્ટમ CRM · ઓર્ડર અને નાણાં|Custom CRM · Orders ane finance
Website · E-commerce|वेबसाइट · ई-कॉमर्स|Website · E-commerce|વેબસાઇટ · ઈ-કોમર્સ|Website · E-commerce
Website · Product catalogue|वेबसाइट · उत्पाद सूची|Website · Product catalogue|વેબસાઇટ · ઉત્પાદન સૂચિ|Website · Product catalogue
Make your value clear in seconds|अपनी खासियत तुरंत स्पष्ट करें|Apni value turant clear karein|તમારી ખાસિયત તરત સ્પષ્ટ કરો|Tamari khasiyat tarat spasht karo
Clarify what you do, who you help and why a customer should choose you. Use the same positioning across your website, social profiles and sales material.|स्पष्ट करें कि आप क्या करते हैं, किसकी मदद करते हैं और ग्राहक आपको क्यों चुने। वेबसाइट, सोशल प्रोफ़ाइल और बिक्री सामग्री में यही संदेश रखें।|Clear karein ki aap kya karte hain, kiski madad karte hain aur customer aapko kyun chune. Website, social profiles aur sales material mein same message rakhein.|તમે શું કરો છો, કોને મદદ કરો છો અને ગ્રાહક તમને શા માટે પસંદ કરે તે સ્પષ્ટ કરો. વેબસાઇટ, સોશિયલ પ્રોફાઇલ અને વેચાણ સામગ્રીમાં એકસરખો સંદેશ રાખો.|Tame shu karo chho, kone madad karo chho ane grahak tamne sha mate pasand kare te clear karo. Website, social profiles ane sales material ma same message rakho.
EVOLIX can connect your positioning, visual identity and brand touchpoints.|EVOLIX आपकी पहचान, डिज़ाइन और ब्रांड के सभी माध्यमों में एकरूपता ला सकता है।|EVOLIX aapki positioning, visual identity aur brand touchpoints ko jod sakta hai.|EVOLIX તમારી ઓળખ, ડિઝાઇન અને બ્રાન્ડના બધા માધ્યમોમાં એકરૂપતા લાવી શકે.|EVOLIX tamari olakh, design ane brand na badha madhyamo ma ekroopta lavi shake.
Strengthen what customers find|ऑनलाइन पहचान बेहतर बनाएं|Online pehchaan behtar banayein|ઓનલાઇન ઓળખ વધુ સારી બનાવો|Online olakh vadhu sari banavo
Make sure your website, Google presence and social profiles are current, trustworthy and consistent. Every touchpoint should make the next action obvious.|वेबसाइट, Google और सोशल प्रोफ़ाइल की जानकारी ताज़ा, भरोसेमंद और एक जैसी रखें। हर जगह अगला कदम स्पष्ट हो।|Website, Google aur social profiles ki info updated, trustworthy aur consistent rakhein. Har jagah next action clear ho.|વેબસાઇટ, Google અને સોશિયલ પ્રોફાઇલની માહિતી તાજી, વિશ્વસનીય અને સુસંગત રાખો. દરેક જગ્યાએ આગળનું પગલું સ્પષ્ટ હોય.|Website, Google ane social profiles ni mahiti updated, vishvasniya ane consistent rakho. Darek jagyae next action clear hoy.
EVOLIX can build a website that presents your business clearly and turns interest into enquiries.|EVOLIX ऐसी वेबसाइट बना सकता है जो आपका व्यवसाय स्पष्ट दिखाए और रुचि को पूछताछ में बदले।|EVOLIX aisi website bana sakta hai jo business clear dikhaye aur interest ko enquiries mein badle.|EVOLIX એવી વેબસાઇટ બનાવી શકે જે તમારો વ્યવસાય સ્પષ્ટ બતાવે અને રસને પૂછપરછમાં ફેરવે.|EVOLIX evi website banavi shake je business clear batave ane interest ne enquiries ma ferve.
Build a more predictable enquiry engine|नियमित पूछताछ का रास्ता बनाएं|Regular enquiries ka system banayein|નિયમિત પૂછપરછનો માર્ગ બનાવો|Regular enquiries no system banavo
Reduce dependence on occasional enquiries or referrals alone. Develop a repeatable channel that brings the right prospects into your business.|कभी-कभार की पूछताछ या परिचितों पर निर्भरता घटाएं। सही संभावित ग्राहकों को नियमित लाने वाला माध्यम बनाएं।|Kabhi-kabhi ki enquiries ya referrals par depend hona kam karein. Sahi prospects laane wala regular channel banayein.|ક્યારેક આવતી પૂછપરછ કે ઓળખાણ પરની નિર્ભરતા ઘટાડો. યોગ્ય સંભવિત ગ્રાહકોને નિયમિત લાવતું માધ્યમ બનાવો.|Kyarek aavti enquiries ke referrals par ni nirbharta ghatado. Yogya prospects regular lave evo channel banavo.
EVOLIX can connect your content, campaigns and enquiry journey.|EVOLIX आपके कंटेंट, अभियानों और पूछताछ की प्रक्रिया को जोड़ सकता है।|EVOLIX aapke content, campaigns aur enquiry journey ko jod sakta hai.|EVOLIX તમારા કન્ટેન્ટ, કેમ્પેઇન અને પૂછપરછની પ્રક્રિયાને જોડી શકે.|EVOLIX tamara content, campaigns ane enquiry journey ne jodi shake.
Turn enquiries into a defined sales flow|पूछताछ से बिक्री की तय प्रक्रिया बनाएं|Enquiry se sales ka fixed flow banayein|પૂછપરછથી વેચાણની નક્કી પ્રક્રિયા બનાવો|Enquiry thi sales no fixed flow banavo
Create a clear process from enquiry to follow-up, quotation and payment so opportunities are easier to track and act on.|पूछताछ से फ़ॉलो-अप, कोटेशन और भुगतान तक स्पष्ट प्रक्रिया बनाएं, ताकि अवसरों पर नज़र रखना और काम करना आसान हो।|Enquiry se follow-up, quotation aur payment tak clear process banayein, taaki opportunities track karna aur action lena aasaan ho.|પૂછપરછથી ફોલો-અપ, ક્વોટેશન અને ચુકવણી સુધી સ્પષ્ટ પ્રક્રિયા બનાવો, જેથી તકો પર નજર રાખવી અને કામ કરવું સરળ બને.|Enquiry thi follow-up, quotation ane payment sudhi clear process banavo, jethi opportunities track karvi ane action levu saral bane.
EVOLIX can build a CRM around your sales process, with follow-ups and pipeline visibility.|EVOLIX आपकी बिक्री प्रक्रिया के लिए फ़ॉलो-अप और पूरी बिक्री स्थिति दिखाने वाला CRM बना सकता है।|EVOLIX aapke sales process ke liye follow-ups aur pipeline visibility wala CRM bana sakta hai.|EVOLIX તમારી વેચાણ પ્રક્રિયા માટે ફોલો-અપ અને વેચાણની સ્થિતિ બતાવતું CRM બનાવી શકે.|EVOLIX tamara sales process mate follow-ups ane pipeline visibility valu CRM banavi shake.
Create one reliable source of customer information|ग्राहक जानकारी एक भरोसेमंद जगह रखें|Customer info ek reliable jagah rakhein|ગ્રાહક માહિતી એક વિશ્વસનીય જગ્યાએ રાખો|Customer info ek reliable jagyae rakho
Bring customer, sales and follow-up information into a structured system so your team can move beyond scattered chats, notebooks and files.|ग्राहक, बिक्री और फ़ॉलो-अप की जानकारी एक व्यवस्थित सिस्टम में लाएं, ताकि बिखरी चैट, नोटबुक और फ़ाइलों पर निर्भरता घटे।|Customer, sales aur follow-up info ek organised system mein laayein, taaki scattered chats, notebooks aur files par depend na rehna pade.|ગ્રાહક, વેચાણ અને ફોલો-અપની માહિતી એક વ્યવસ્થિત સિસ્ટમમાં લાવો, જેથી વિખરાયેલી ચેટ, નોટબુક અને ફાઇલો પર નિર્ભરતા ઘટે.|Customer, sales ane follow-up info ek organised system ma lavo, jethi scattered chats, notebooks ane files par depend na rahevu pade.
EVOLIX can bring your customer information together in a custom CRM.|EVOLIX आपकी ग्राहक जानकारी कस्टम CRM में एक जगह ला सकता है।|EVOLIX customer info ko custom CRM mein ek jagah laa sakta hai.|EVOLIX તમારી ગ્રાહક માહિતી કસ્ટમ CRMમાં એક જગ્યાએ લાવી શકે.|EVOLIX tamari customer info custom CRM ma ek jagyae lavi shake.
Remove repetitive work from daily operations|रोज़ के दोहराए जाने वाले काम घटाएं|Roz ka repetitive work kam karein|રોજિંદું વારંવારનું કામ ઘટાડો|Rojindu repetitive work ghatado
Identify the tasks your team repeats most often and systemise the highest-impact ones first. Aim for fewer manual steps and more visibility.|बार-बार होने वाले काम पहचानें और सबसे असरदार काम पहले व्यवस्थित करें। हाथ के चरण घटाएं और काम की स्थिति स्पष्ट रखें।|Repeat hone wale tasks pehchaanein aur high-impact kaam pehle systemise karein. Manual steps kam aur visibility zyada rakhein.|વારંવાર થતાં કામ ઓળખો અને વધુ અસરવાળાં કામ પહેલાં વ્યવસ્થિત કરો. મેન્યુઅલ પગલાં ઘટાડો અને કામની સ્થિતિ સ્પષ્ટ રાખો.|Repeat thata tasks olakho ane high-impact kaam pehla systemise karo. Manual steps ochha ane visibility vadhu rakho.
EVOLIX can connect quotations, delivery orders and daily workflows in custom software.|EVOLIX कोटेशन, डिलीवरी ऑर्डर और रोज़ के काम कस्टम सॉफ़्टवेयर में जोड़ सकता है।|EVOLIX quotations, delivery orders aur daily workflows ko custom software mein jod sakta hai.|EVOLIX ક્વોટેશન, ડિલિવરી ઓર્ડર અને રોજિંદા કામ કસ્ટમ સોફ્ટવેરમાં જોડી શકે.|EVOLIX quotations, delivery orders ane daily workflows ne custom software ma jodi shake.
Prepare your systems before growth creates pressure|विकास का दबाव आने से पहले तैयारी करें|Growth ka pressure aane se pehle taiyari karein|વિકાસનું દબાણ આવે તે પહેલાં તૈયારી કરો|Growth nu pressure aave te pehla taiyari karo
Identify the processes that would struggle if demand doubled. Strengthen those areas before adding customers, staff or locations.|मांग दोगुनी होने पर कौन-सी प्रक्रियाएं मुश्किल में आएंगी, पहचानें। ग्राहक, कर्मचारी या जगह बढ़ाने से पहले इन्हें मज़बूत करें।|Demand double hone par kaunse processes struggle karenge, pehchaanein. Customers, staff ya locations badhane se pehle unhe strong karein.|માગ બમણી થાય તો કઈ પ્રક્રિયાઓમાં મુશ્કેલી પડશે તે ઓળખો. ગ્રાહકો, કર્મચારીઓ કે સ્થળો વધારતા પહેલાં તેને મજબૂત કરો.|Demand bamni thay to kaya processes struggle karshe te olakho. Customers, staff ke locations vadharva pehla tene majboot karo.
EVOLIX can connect orders, delivery and finance in a system built around your business.|EVOLIX आपके व्यवसाय के अनुसार बने सिस्टम में ऑर्डर, डिलीवरी और वित्त जोड़ सकता है।|EVOLIX aapke business ke hisaab se bane system mein orders, delivery aur finance jod sakta hai.|EVOLIX તમારા વ્યવસાય પ્રમાણે બનેલી સિસ્ટમમાં ઓર્ડર, ડિલિવરી અને નાણાં જોડી શકે.|EVOLIX tamara business pramane baneli system ma orders, delivery ane finance jodi shake.
Improve conversion intelligence|बिक्री में बदलाव की समझ बढ़ाएं|Conversion insights behtar karein|વેચાણમાં રૂપાંતરની સમજ વધારો|Conversion ni samaj vadharo
Your answers indicate a strong foundation. Explore where customers hesitate and use better reporting to guide your next improvements.|आपके जवाब मज़बूत बुनियाद दिखाते हैं। ग्राहक कहाँ हिचकते हैं, समझें और बेहतर रिपोर्टिंग से अगले सुधार तय करें।|Aapke jawab strong foundation dikhate hain. Customers kahan hesitate karte hain, samjhein aur better reporting se improvements chunein.|તમારા જવાબો મજબૂત પાયો બતાવે છે. ગ્રાહકો ક્યાં અચકાય છે તે સમજો અને સારી રિપોર્ટિંગથી આગળના સુધારા નક્કી કરો.|Tamara jawabo majboot payo batave chhe. Customers kya achkay chhe te samjo ane better reporting thi improvements nakki karo.
EVOLIX can help connect your customer journey with useful sales insights.|EVOLIX ग्राहक के अनुभव को उपयोगी बिक्री जानकारी से जोड़ने में मदद कर सकता है।|EVOLIX customer journey ko useful sales insights se jodne mein madad kar sakta hai.|EVOLIX ગ્રાહકના અનુભવને ઉપયોગી વેચાણ માહિતી સાથે જોડવામાં મદદ કરી શકે.|EVOLIX customer journey ne useful sales insights sathe jodvama madad kari shake.
Connect systems and reporting|सिस्टम और रिपोर्टिंग जोड़ें|Systems aur reporting jodein|સિસ્ટમ અને રિપોર્ટિંગ જોડો|Systems ane reporting jodo
Look for opportunities to bring your already organised processes into a clearer business-wide view.|पहले से व्यवस्थित प्रक्रियाओं को पूरे व्यवसाय की एक स्पष्ट तस्वीर में जोड़ने के अवसर खोजें।|Already organised processes ko poore business ki ek clear picture mein jodne ke mauke dhoondhein.|પહેલેથી વ્યવસ્થિત પ્રક્રિયાઓને સમગ્ર વ્યવસાયના એક સ્પષ્ટ ચિત્રમાં જોડવાની તકો શોધો.|Already organised processes ne aakha business ni ek clear picture ma jodvani tako shodho.
EVOLIX can connect your operational workflows and reporting.|EVOLIX आपके कामकाज की प्रक्रियाएं और रिपोर्टिंग जोड़ सकता है।|EVOLIX aapke workflows aur reporting jod sakta hai.|EVOLIX તમારા કામકાજની પ્રક્રિયાઓ અને રિપોર્ટિંગ જોડી શકે.|EVOLIX tamara workflows ane reporting jodi shake.
Explore advanced automation and scale|उन्नत ऑटोमेशन और विकास की योजना बनाएं|Advanced automation aur scale explore karein|અદ્યતન ઓટોમેશન અને વિકાસની યોજના બનાવો|Advanced automation ane scale explore karo
Review the exceptions that still require manual attention and plan systems for the next stage of growth.|वे मामले देखें जिनमें अभी भी हाथ से ध्यान देना पड़ता है, और अगले विकास चरण के लिए सिस्टम की योजना बनाएं।|Un exceptions ko dekhein jahan abhi bhi manual attention chahiye, aur next growth stage ke systems plan karein.|હજુ મેન્યુઅલ ધ્યાન માંગતા અપવાદો તપાસો અને વિકાસના આગળના તબક્કા માટે સિસ્ટમની યોજના બનાવો.|Haju manual attention mangta exceptions tapaso ane next growth stage mate systems plan karo.
EVOLIX can develop custom workflows around the way your business grows.|EVOLIX आपके व्यवसाय के विकास के अनुसार कस्टम कार्यप्रवाह बना सकता है।|EVOLIX aapke business ki growth ke hisaab se custom workflows bana sakta hai.|EVOLIX તમારા વ્યવસાયના વિકાસ પ્રમાણે કસ્ટમ કાર્યપ્રવાહ બનાવી શકે.|EVOLIX tamara business ni growth pramane custom workflows banavi shake.
COMPLETE|पूरा|Poora|પૂર્ણ|Pooru
YOUR JOURNEY|आपका सफ़र|Aapka safar|તમારી સફર|Tamari safar
Welcome to your EVOLIX journey|EVOLIX के साथ आपके सफ़र में स्वागत है|EVOLIX ke safar mein swagat hai|EVOLIX સાથે તમારી સફરમાં સ્વાગત છે|EVOLIX ni safar ma swagat chhe
Interactive 3D journey. Drag to change the view. Use the numbered buttons to visit unlocked stops.|इंटरैक्टिव 3D सफ़र। दृश्य बदलने के लिए खींचें। खुले पड़ावों पर जाने के लिए संख्या वाले बटन चुनें।|Interactive 3D safar. View badalne ke liye drag karein. Khule stops par jaane ke liye number buttons chunein.|ઇન્ટરેક્ટિવ 3D સફર. દૃશ્ય બદલવા ખેંચો. ખુલ્લા પડાવો પર જવા નંબરવાળાં બટન પસંદ કરો.|Interactive 3D safar. View badalva drag karo. Khulla stops par java number buttons pasand karo.
Your EVOLIX campaign note|आपका EVOLIX अभियान नोट|Aapka EVOLIX campaign note|તમારી EVOLIX કેમ્પેઇન નોટ|Tamari EVOLIX campaign note
Journey stops|सफ़र के पड़ाव|Safar ke stops|સફરના પડાવો|Safar na stops
KEEP EVOLVING|आगे बढ़ते रहें|Aage badhte rahein|આગળ વધતા રહો|Aagal vadhta raho
UP NEXT|अगला पड़ाव|Agla stop|આગળનો પડાવ|Aagal no stop
Audit progress|ऑडिट की प्रगति|Audit ki progress|ઓડિટની પ્રગતિ|Audit ni progress
YOU ARE HERE|आप यहाँ हैं|Aap yahan hain|તમે અહીં છો|Tame ahi chho
DONE|पूरा|Poora|પૂર્ણ|Pooru
Brand|ब्रांड|Branding|બ્રાન્ડ|Branding
Presence|ऑनलाइन उपस्थिति|Online presence|ઓનલાઇન હાજરી|Online hajri
Leads|पूछताछ|Enquiries|પૂછપરછ|Puchhparachh
Sales|बिक्री|Bikri|વેચાણ|Vechan
Customers|ग्राहक|Grahak|ગ્રાહકો|Grahako
Scale|विकास|Growth|વિકાસ|Vikas
advanced optimisation|उन्नत सुधार|Advanced improvements|અદ્યતન સુધારા|Advanced sudhara
EVOLIX project preview|EVOLIX प्रोजेक्ट की झलक|EVOLIX project ki jhalak|EVOLIX પ્રોજેક્ટની ઝલક|EVOLIX project ni jhalak
`;

export const DICTIONARY = Object.fromEntries(rows.trim().split('\n').map(row => {
  const cells = row.split('|');
  if (cells.length !== 5 || cells.some(cell => !cell.trim())) throw new Error('Invalid translation row: ' + cells[0]);
  return [cells[0].toLowerCase(), Object.fromEntries(LANGUAGES.map((item, i) => [item.code, cells[i]]))];
}));

export const validLanguage = code => LANGUAGES.some(item => item.code === code);
export function translate(value, language = 'en') {
  if (typeof value !== 'string' || language === 'en' || !validLanguage(language)) return value;
  const key = value.trim(), entry = DICTIONARY[key.toLowerCase()];
  if (entry) return value.slice(0, value.indexOf(key)) + entry[language] + value.slice(value.indexOf(key) + key.length);
  const question = key.match(/^QUESTION (\d+) (?:\/ 07|OF 7)$/);
  if (question) return `${translate('QUESTION', language)} ${question[1]} / 7`;
  const build = key.match(/^Build on your (.+)$/i);
  if (build) return ({hi:'इस मज़बूती को बढ़ाएं: ',hinglish:'Is strength ko badhayein: ',gu:'આ મજબૂતી વધારો: ','gu-latn':'Aa majbooti vadharo: '})[language] + translate(build[1], language);
  const stop = key.match(/^Visit stop (\d+): (.*?)(, answered)?$/);
  if (stop) return `${translate('QUESTION', language)} ${stop[1]}: ${translate(stop[2], language)}${stop[3] ? ' ✓' : ''}`;
  const score = key.match(/^Your EVOLIX Score is (\d+) out of 100\. Audit maximum 85\.$/);
  if (score) return `${translate('Your EVOLIX Score',language)}: ${score[1]}/100. ${translate('Self-assessment · Maximum achievable score: 85',language)}`;
  return value;
}

export function whatsappMessage(language, { business, score, next, name, industry }) {
  const area = translate(next, language), sector = translate(industry, language);
  const messages = {
    hi: `नमस्ते EVOLIX, मैंने ${business} का Business Evolution Audit पूरा किया। मेरा EVOLIX स्कोर ${score}/100 है (अधिकतम: 85)। सुधार का अगला क्षेत्र: ${area}। मैं EVOLIX के साथ अपना सफ़र शुरू करके विकास योजना पर बात करना चाहता/चाहती हूँ।\n\nनाम: ${name}\nव्यवसाय का क्षेत्र: ${sector}`,
    hinglish: `Hi EVOLIX, maine ${business} ka Business Evolution Audit poora kiya. Mera EVOLIX Score ${score}/100 hai (maximum: 85). Agla focus: ${area}. Main EVOLIX ke saath apna safar shuru karke growth roadmap par baat karna chahta/chahti hoon.\n\nNaam: ${name}\nIndustry: ${sector}`,
    gu: `નમસ્તે EVOLIX, મેં ${business} નું Business Evolution Audit પૂર્ણ કર્યું. મારો EVOLIX સ્કોર ${score}/100 છે (મહત્તમ: 85). સુધારાનું આગળનું ક્ષેત્ર: ${area}. હું EVOLIX સાથે મારી સફર શરૂ કરીને વિકાસ યોજના વિશે વાત કરવા ઇચ્છું છું.\n\nનામ: ${name}\nવ્યવસાયનું ક્ષેત્ર: ${sector}`,
    'gu-latn': `Namaste EVOLIX, me ${business} nu Business Evolution Audit pooru karyu. Maro EVOLIX Score ${score}/100 chhe (maximum: 85). Aagal nu focus: ${area}. Hu EVOLIX sathe mari safar sharu kari vikas yojana vishe vaat karva ichhu chhu.\n\nNaam: ${name}\nIndustry: ${sector}`,
  };
  return messages[language];
}
