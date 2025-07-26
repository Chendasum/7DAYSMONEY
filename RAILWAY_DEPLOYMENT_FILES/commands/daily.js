const User = require("../models/User");
const Progress = require("../models/Progress");
const { sendLongMessage } = require("../utils/message-splitter");

const MESSAGE_CHUNK_SIZE = 3500;

// Day 1 Content
const day1Content = `🎯 ថ្ងៃទី ១ - ការស្វែងរកលុយដែលលេចធ្លាយ (Money Flow Analysis)

🎉 ស្វាគមន៍មកកាន់ការចាប់ផ្តើមថ្មី! ថ្ងៃនេះ អ្នកនឹងស្វែងរកលុយដែលកំពុងលេចធ្លាយនៅក្នុងជីវិតប្រចាំថ្ងៃ។

🔍 **គោលដៅថ្ងៃនេះ:**
✅ ការកំណត់អត្តសញ្ញាណលុយដែលលេចធ្លាយ (money leaks) ដ៏សំខាន់
✅ ការយល់ដឹងពីលំហូរលុយ (money flow) របស់អ្នក
✅ ការរកឃើញកន្លែងដែលអ្នកអាចសន្សំបាន $30-50+ ភ្លាមៗ

💡 **ការយល់ដឹងលំហូរលុយ:**

លុយចូល (Money In):
• ប្រាក់ខែ/ប្រាក់រង្វាន់ពីការងារ
• អាជីវកម្មបន្ថែម
• ការវិនិយោគ/ការប្រាក់
• ប្រាក់ជួយពីគ្រួសារ

លុយចេញ (Money Out):
• ការបង់ជួលផ្ទះ/បន្ទប់
• អាហារ និង ឧបភោគបរិភោគ
• ឧស្ម័ន/ការធ្វើដំណើរ
• កម្សាន្ត/ការរំលេចចិត្ត
• ការសន្សំ (បើមាន)

🎯 **ការវិភាគ Money Leaks ដ៏មានតម្លៃ:**

**១. Subscription ដែលមិនប្រើ:**
• Netflix, Spotify, apps ដែលមិនប្រើ
• Gym membership ដែលមិនទៅ
• Magazine/newspaper subscriptions
• Cloud storage ដែលអស់កន្លែង
💰 **សន្សំបាន:** $10-30/ខែ

**២. ការទិញអាហារនៅខាងក្រៅ:**
• កាហ្វេថ្ងៃនិមួយៗ: $2-5/ថ្ងៃ = $60-150/ខែ
• អាហារថ្ងៃត្រង់នៅការិយាល័យ: $5-10/ថ្ងៃ
• អាហារពេលល្ងាចបន្ទាន់: $10-20/ពេល
💰 **សន្សំបាន:** $100-300/ខែ

**៣. ការចំណាយដោយចិត្តរំភើប (Impulse purchases):**
• សម្លៀកបំពាក់ថ្មីដែលមិនត្រូវការ
• គ្រឿងអេឡិចត្រូនិចថ្មីៗ
• ការទិញអ្វីដែលមើលឃើញក្នុង social media
💰 **សន្សំបាន:** $50-200/ខែ

**៤. ការអស់ប្រាក់ខ្ជះខ្ជាយ:**
• មិនដាក់គម្រោងការទិញ
• មិនប្រៀបធៀបតម្លៃ
• ការទិញ brand name ដែលថ្លៃ
💰 **សន្សំបាន:** $30-100/ខែ

🎯 **ការអនុវត្តថ្ងៃនេះ:**

**ជំហាន ១:** ចុះបញ្ជីចំណាយ ៣ ថ្ងៃចុងក្រោយ
• អ្វីដែលអ្នកទិញ?
• ថ្លៃប៉ុន្មាន?
• តម្រូវការ ឬ ចង់បាន?

**ជំហាន ២:** ពិនិត្យ bank statement/e-wallet ១ សប្តាហ៍
• រកមើល subscription recurring charges
• រកមើលការចំណាយតូចៗញឹកញាប់
• កត់សម្គាល់ការចំណាយដែលមិនចាំ

**ជំហាន ៣:** គណនាការចំណាយដែលអាចកាត់បាន
• ចូរកាត់ ១ subscription ដែលមិនប្រើ = សន្សំ $10-20/ខែ
• ការកំណត់ដែនកំណត់សម្រាប់ការទិញកាហ្វេ = សន្សំ $30+/ខែ
• ការរៀបចំអាហារនៅផ្ទះ ២ ពេលក្នុង១សប្តាហ៍ = សន្សំ $40+/ខែ

**ជំហាន ៤:** ការយល់ដឹងពីតម្លៃពិតប្រាកដ
• ការទិញកាហ្វេ $3/ថ្ងៃ = $1,095/ឆ្នាំ
• ការទិញអាហារពេលល្ងាច $15/ពេល x ២ពេល/សប្តាហ៍ = $1,560/ឆ្នាំ

🏆 **បញ្ចប់ថ្ងៃទី ១:**

បន្ទាប់ពីបញ្ចប់ការវិភាគនេះ អ្នកគួរតែមាន:
✅ ការយល់ដឹងច្បាស់លាស់ពីលុយចូល-ចេញរបស់អ្នក
✅ ការកំណត់អត្តសញ្ញាណ money leaks យ៉ាងហោចណាស់ ២-៣ កន្លែង
✅ ផែនការកាត់បន្ថយចំណាយ $30-50/ខែ

💎 **លទ្ធផលរំពឹងទុក:** បើអ្នកអនុវត្តបាន អ្នកនឹងស្វែងរកលុយបាន $30-50 ដំបូង គ្រាន់តែថ្ងៃទីមួយ!

📞 **ត្រូវការជំនួយ?** ទាក់ទងមក @Chendasum ឬប្រើ /help

🚀 **ថ្ងៃស្អែក:** ការបង្កើត Money Flow System ដ៏មានអានុភាព!

សរសេរ "DAY 1 COMPLETE" នៅពេលបញ្ចប់!`;

// Day 2 Content
const day2Content = `🎯 ថ្ងៃទី ២ - ការកំណត់អត្តសញ្ញាណការលេចធ្លាយលុយកម្រិតខ្ពស់

🎉 ល្អមេ! បន្ទាប់ពីថ្ងៃម្សិលមិញ អ្នកបានរកឃើញ money leaks មួយចំនួនហើយ។ ថ្ងៃនេះ យើងនឹងស្វែងរកជម្រៅថែមទៀត។

🔍 **គោលដៅថ្ងៃនេះ:**
✅ ការកំណត់អត្តសញ្ញាណ "ការលេចធ្លាយលុយសម្ងាត់" ដែលលាក់កំបាំង
✅ ការយល់ដឹងពី spending patterns របស់អ្នក
✅ ការបង្កើតប្រព័ន្ធ tracking ដែលនឹងសន្សំបាន $100+/ខែ

💡 **Advanced Money Leaks Discovery:**

**១. ការចំណាយតាមចំណុចចិត្តខ្សាក់ខ្សោយ (Emotional Spending):**
• ទិញអ្វីៗពេលតានតឹង/ធុញថប់
• Shopping therapy នៅពេលសុម្ភិតចិត្ត
• ការចំណាយបន្ថែមពេលខ្លួនអារម្មណ៍ល្អ
• ការទិញ comfort food ពេលមានបញ្ហា
💰 **ការលេចធ្លាយ:** $50-150/ខែ

**២. Social Pressure Spending:**
• ការចេញលេងតាមគ្នាដែលមិនធ្លាប់គ្រោងទុក
• ការឈ្នាប់កូនដូចគេ (keeping up appearances)
• ការផ្តល់អំណោយដែលលើសលុបធម្មតា
• ការចូលរួមកម្មវិធីដែលមិនពិតជាចង់ទៅ
💰 **ការលេចធ្លាយ:** $80-200/ខែ

**៣. Convenience Spending:**
• ការទិញ same-day delivery បន្ថែម
• ការប្រើ ride-sharing ជំនួសការធ្វើដំណើរសាធារណៈ
• ការទិញអាហារនៅកន្លែងនៅជិត (ថ្លៃជាង)
• ការទិញ branded products ដោយមិនប្រៀបធៀប
💰 **ការលេចធ្លាយ:** $60-120/ខែ

**៤. The "Small Amount" Trap:**
• កាហ្វេតូចៗប្រចាំថ្ងៃ
• snacks, cigarettes, កន្លាងលក់ដូរតូចៗ
• mobile top-up បន្ថែម
• app purchases តូចៗ
💰 **ការលេចធ្លាយ:** $40-100/ខែ

🎯 **Advanced Tracking System:**

**ជំហាន ១:** ការបង្កើត Spending Categories
• Necessities (ត្រូវការពិតប្រាកដ)
• Important (សំខាន់ប៉ុន្តែអាចរង់ចាំបាន)
• Nice-to-have (ល្អបើមាន)
• Impulse (ចំណាយភ្លាមៗ)

**ជំហាន ២:** ការវិភាគ Emotional Triggers
• នៅពេលណាអ្នកចំណាយច្រើន?
• អារម្មណ៍យ៉ាងណានៅពេលចំណាយ?
• កន្លែងណាដែលអ្នកចំណាយច្រើនបំផុត?
• នរណាដែលជះឥទ្ធិពលទៅលើការចំណាយរបស់អ្នក?

**ជំហាន ៣:** ការបង្កើត Defense System
• កំណត់ដែនកំណត់ចំណាយប្រចាំសប្តាហ៍
• ការធ្វើ 24-hour rule មុនពេលទិញអ្វីៗ > $20
• ការលុបកម្មវិធីទិញអ្វីៗចេញពីទូរស័ព្ទ
• ការកំណត់គណនីសន្សំដាច់ដោយឡែក

**ជំហាន ៤:** ការបង្កើត Alternative Solutions
• ការរៀបចំអាហារនៅផ្ទះជំនួសការទិញ
• ការប្រើ public transport ជំនួស grab/taxi
• ការបង្កើតបញ្ជីរបស់ដែលត្រូវការមុនពេលទៅទីផ្សារ
• ការស្វែងរកកម្សាន្តឥតគិតថ្លៃ

🏆 **Spending Pattern Analysis:**

**ការវិភាគលំនាំចំណាយ ៧ ថ្ងៃ:**
• ថ្ងៃណាអ្នកចំណាយច្រើនបំផុត?
• ម៉ោងណាអ្នកតែងតែទិញអ្វីៗ?
• ការចំណាយកើនឡើងនៅចុងសប្តាហ៍ឬទេ?
• តើអ្នកចំណាយតាម pattern ណាមួយ?

**ការវិភាគតាម Location:**
• ការចំណាយនៅផ្ទះ vs ការចំណាយខាងក្រៅ
• ការចំណាយនៅ shopping mall
• ការចំណាយ online vs offline
• ការចំណាយនៅកន្លែងជាក់លាក់

🎯 **ការអនុវត្តថ្ងៃនេះ:**

**ការតាមដាន ២ សប្តាហ៍:**
១. ចុះបញ្ជីគ្រប់ការចំណាយ (សូម្បីតែ $0.50)
២. កត់សម្គាល់អារម្មណ៍នៅពេលចំណាយ
៣. កំណត់ category សម្រាប់ការចំណាយនីមួយៗ
៤. ពិនិត្យមើលលំនាំចំណាយប្រចាំថ្ងៃ

**ការកំណត់គោលដៅ:**
• កាត់បន្ថយ impulse spending ៥០%
• រកមេធាវីជំនួសការចំណាយថ្លៃៗ
• កំណត់ spending limit ប្រចាំសប្តាហ៍
• បង្កើតសាច់ប្រាក់អាសន្នសម្រាប់ចំណាយបន្ទាន់

💎 **លទ្ធផលរំពឹងទុក:** ការកាត់បន្ថយការចំណាយប្រចាំខែ $100-300

📞 **ត្រូវការជំនួយ?** ទាក់ទងមក @Chendasum ឬប្រើ /help

🚀 **ថ្ងៃស្អែក:** ការបង្កើត Emergency Fund របស់អ្នក!

សរសេរ "DAY 2 COMPLETE" នៅពេលបញ្ចប់!`;

/**
 * Handles daily lesson commands (/day1, /day2, etc.)
 * @param {Object} msg - Telegram message object
 * @param {Object} bot - Telegram bot instance
 * @param {number} day - Day number (1-7)
 */
async function handle(msg, bot, day) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    // Check user payment status using correct field names
    const user = await User.findOne({ telegram_id: userId });
    const isPaid = user?.is_paid === true || user?.is_paid === 't';

    if (!isPaid) {
      await bot.sendMessage(chatId, `🔒 សម្រាប់សិស្សដែលបានចូលរួមប៉ុណ្ណោះ

ដើម្បីចូលប្រើមេរៀនថ្ងៃទី${day} អ្នកត្រូវចូលរួមកម្មវិធីសិន។

💰 តម្លៃ: $24 USD (បញ្ចុះ ៥០%!)
🎯 ប្រើ /pricing ដើម្បីចូលរួម`);
      return;
    }

    // Get the content for the specific day
    let content;
    switch (day) {
      case 1:
        content = day1Content;
        break;
      case 2:
        content = day2Content;
        break;
      default:
        content = `🎯 ថ្ងៃទី ${day} - កំពុងរៀបចំ

🔄 មេរៀនថ្ងៃទី${day} កំពុងរៀបចំ។ សូមសាកម្តងទៀតនៅពេលក្រោយ។

📞 ត្រូវការជំនួយ? ទាក់ទងមក @Chendasum`;
    }

    // Send the lesson content using long message handler
    await sendLongMessage(bot, chatId, content, {}, MESSAGE_CHUNK_SIZE);

    // Update user progress
    try {
      await Progress.findOneAndUpdate(
        { user_id: userId },
        { 
          [`day${day}_completed`]: true,
          current_day: Math.max(day, 1),
          last_access: new Date()
        },
        { upsert: true }
      );
    } catch (progressError) {
      console.error("Error updating progress:", progressError);
    }

    console.log(`✅ Day ${day} lesson delivered to user ${userId}`);

  } catch (error) {
    console.error(`❌ Error in day ${day} command:`, error);
    
    try {
      await bot.sendMessage(chatId, "សូមអភ័យទោស! មានបញ្ហាបច្ចេកទេស។ សូមព្យាយាមម្តងទៀត។");
    } catch (sendError) {
      console.error("Failed to send error message:", sendError);
    }
  }
}

module.exports = { handle };