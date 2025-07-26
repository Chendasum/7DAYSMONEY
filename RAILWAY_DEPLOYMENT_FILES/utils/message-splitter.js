/**
 * Splits long messages into chunks that fit within Telegram's 4096 character limit
 * while preserving formatting and ensuring clean breaks in content.
 * 
 * @param {Object} bot - Telegram bot instance
 * @param {number} chatId - Chat ID to send messages to
 * @param {string} message - The long message to split and send
 * @param {Object} options - Telegram sendMessage options (parse_mode, reply_markup, etc.)
 * @param {number} chunkSize - Maximum size for each chunk (default: 3500 to leave buffer)
 * @param {number} delay - Delay between chunks in milliseconds (default: 500)
 * @returns {Promise} - Resolves when all message chunks are sent
 */
async function sendLongMessage(bot, chatId, message, options = {}, chunkSize = 3500, delay = 500) {
  // Validate inputs
  if (!bot || !chatId || !message) {
    console.error("Invalid parameters for sendLongMessage");
    return;
  }

  if (typeof message !== 'string') {
    console.error("Message must be a string");
    return;
  }

  // If message is short enough, send it directly
  if (message.length <= 4096) {
    try {
      await bot.sendMessage(chatId, message, options);
      return;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Split message into chunks
  const chunks = splitMessage(message, chunkSize);
  
  console.log(`Splitting long message into ${chunks.length} chunks for chat ${chatId}`);

  // Send each chunk with delay
  for (let i = 0; i < chunks.length; i++) {
    try {
      // Add chunk indicator for multi-part messages (except single chunks)
      let chunkToSend = chunks[i];
      if (chunks.length > 1) {
        // Add part indicator at the end for clarity
        chunkToSend += `\n\n📄 ផ្នែកទី ${i + 1}/${chunks.length}`;
      }

      await bot.sendMessage(chatId, chunkToSend, options);
      
      // Add delay between chunks (except for the last one)
      if (i < chunks.length - 1 && delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
    } catch (error) {
      console.error(`Error sending chunk ${i + 1}/${chunks.length}:`, error);
      
      // Try to inform user about the error
      try {
        await bot.sendMessage(chatId, `សូមអភ័យទោស! មានបញ្ហាក្នុងការផ្ញើមេសេជផ្នែកទី ${i + 1}។ សូមសាកល្បងម្តងទៀត។`);
      } catch (sendError) {
        console.error("Failed to send error notification:", sendError);
      }
      
      throw error;
    }
  }
}

/**
 * Splits a message into chunks while trying to preserve word boundaries and formatting
 * @param {string} message - Message to split
 * @param {number} chunkSize - Maximum size for each chunk
 * @returns {Array} - Array of message chunks
 */
function splitMessage(message, chunkSize) {
  if (message.length <= chunkSize) {
    return [message];
  }

  const chunks = [];
  let currentChunk = '';
  
  // Split by paragraphs first (double newlines)
  const paragraphs = message.split('\n\n');
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed chunk size
    if (currentChunk.length + paragraph.length + 2 > chunkSize) {
      // If we have content in current chunk, save it
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      
      // If single paragraph is too large, split it further
      if (paragraph.length > chunkSize) {
        const subChunks = splitLargeParagraph(paragraph, chunkSize);
        chunks.push(...subChunks);
      } else {
        currentChunk = paragraph;
      }
    } else {
      // Add paragraph to current chunk
      if (currentChunk) {
        currentChunk += '\n\n' + paragraph;
      } else {
        currentChunk = paragraph;
      }
    }
  }
  
  // Add any remaining content
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Splits a large paragraph into smaller chunks while preserving sentence boundaries
 * @param {string} paragraph - Large paragraph to split
 * @param {number} chunkSize - Maximum size for each chunk
 * @returns {Array} - Array of paragraph chunks
 */
function splitLargeParagraph(paragraph, chunkSize) {
  const chunks = [];
  let currentChunk = '';
  
  // Split by sentences (periods, exclamation marks, question marks followed by space)
  const sentences = paragraph.split(/(?<=[.!?])\s+/);
  
  for (const sentence of sentences) {
    // If adding this sentence would exceed chunk size
    if (currentChunk.length + sentence.length + 1 > chunkSize) {
      // If we have content in current chunk, save it
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      
      // If single sentence is too large, split by character limit
      if (sentence.length > chunkSize) {
        const words = sentence.split(' ');
        let wordChunk = '';
        
        for (const word of words) {
          if (wordChunk.length + word.length + 1 > chunkSize) {
            if (wordChunk.trim()) {
              chunks.push(wordChunk.trim());
              wordChunk = word;
            } else {
              // Even single word is too large, force split
              chunks.push(word.substring(0, chunkSize));
              wordChunk = word.substring(chunkSize);
            }
          } else {
            wordChunk += (wordChunk ? ' ' : '') + word;
          }
        }
        
        if (wordChunk.trim()) {
          currentChunk = wordChunk;
        }
      } else {
        currentChunk = sentence;
      }
    } else {
      // Add sentence to current chunk
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  // Add any remaining content
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

module.exports = {
  sendLongMessage,
  splitMessage
};