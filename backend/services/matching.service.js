const db = require('../db');
const { sendEmail } = require('./email.service');

// Run this when a new lost or found item is submitted
const runMatchingEngine = async (newItemType, newItemId) => {
  try {
    let newRecord;
    let candidates = [];
    
    if (newItemType === 'lost') {
      const result = await db.query('SELECT * FROM lost_items WHERE id = $1', [newItemId]);
      newRecord = result.rows[0];
      const candidatesResult = await db.query("SELECT * FROM found_items WHERE status = 'AVAILABLE'");
      candidates = candidatesResult.rows;
    } else {
      const result = await db.query('SELECT * FROM found_items WHERE id = $1', [newItemId]);
      newRecord = result.rows[0];
      const candidatesResult = await db.query("SELECT * FROM lost_items WHERE status = 'OPEN'");
      candidates = candidatesResult.rows;
    }

    if (!newRecord) return;

    for (const candidate of candidates) {
      let score = 0;

      // Category match (3 points)
      if (candidate.category === newRecord.category) {
        score += 3;
      }

      // Keyword match in title/description (1 pt per word, max 3)
      const newText = `${newRecord.title} ${newRecord.description}`.toLowerCase();
      const candidateText = `${candidate.title} ${candidate.description}`.toLowerCase();
      const newWords = newText.split(/\W+/).filter(w => w.length > 3);
      
      let keywordMatches = 0;
      for (const word of newWords) {
        if (candidateText.includes(word)) {
          keywordMatches++;
          if (keywordMatches >= 3) break;
        }
      }
      score += keywordMatches;

      // Location match (substring) (2 points)
      const newLoc = (newItemType === 'lost' ? newRecord.location_lost : newRecord.location_found).toLowerCase();
      const candLoc = (newItemType === 'lost' ? candidate.location_found : candidate.location_lost).toLowerCase();
      
      if (newLoc.includes(candLoc) || candLoc.includes(newLoc)) {
        score += 2;
      }

      // If score >= 5, create match
      if (score >= 5) {
        const lostId = newItemType === 'lost' ? newRecord.id : candidate.id;
        const foundId = newItemType === 'found' ? newRecord.id : candidate.id;
        
        await db.query(
          'INSERT INTO matches (lost_item_id, found_item_id, match_score) VALUES ($1, $2, $3)',
          [lostId, foundId, score]
        );

        // Notify the lost item owner
        const lostItemResult = await db.query('SELECT user_id, title FROM lost_items WHERE id = $1', [lostId]);
        const ownerId = lostItemResult.rows[0].user_id;
        const ownerResult = await db.query('SELECT email FROM users WHERE id = $1', [ownerId]);
        const ownerEmail = ownerResult.rows[0].email;

        // Also add to notifications table
        await db.query(
          'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
          [ownerId, `A possible match was found for your lost item: ${lostItemResult.rows[0].title}`]
        );

        await sendEmail(
          ownerEmail, 
          'Match Found for your Lost Item!', 
          `<p>A possible match was found for your lost item: ${lostItemResult.rows[0].title}</p>`
        );
      }
    }
  } catch (err) {
    console.error('Error in matching engine:', err);
  }
};

module.exports = {
  runMatchingEngine
};
