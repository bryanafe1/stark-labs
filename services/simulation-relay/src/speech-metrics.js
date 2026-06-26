const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'so', 'basically',
  'literally', 'actually', 'right', 'kind of', 'sort of'
];

function extractSpeechMetrics(result) {
  const words = result.words || [];

  // Filler word analysis
  const fillerDetail = {};
  let fillerCount = 0;
  words.forEach((w) => {
    const text = w.text?.toLowerCase().trim();
    if (FILLER_WORDS.includes(text)) {
      fillerDetail[text] = (fillerDetail[text] || 0) + 1;
      fillerCount++;
    }
  });

  // Pause analysis (gaps over 1000ms between words)
  const pauses = [];
  for (let i = 1; i < words.length; i++) {
    const gap = words[i].start - words[i - 1].end;
    if (gap > 1000) pauses.push(gap / 1000);
  }

  // Words per minute
  const audioDurationMs = result.audio_duration;
  let wpm = null;
  if (audioDurationMs && audioDurationMs > 0 && words.length > 0) {
    wpm = Math.round(words.length / (audioDurationMs / 1000 / 60));
    if (wpm < 30 || wpm > 400) wpm = null; // discard implausible values
  }

  return {
    words_per_minute: wpm,
    filler_word_count: fillerCount,
    filler_words_detail: fillerCount > 0 ? fillerDetail : null,
    pause_count: pauses.length,
    longest_pause_seconds: pauses.length > 0 ? Number(Math.max(...pauses).toFixed(2)) : null,
    average_pause_seconds:
      pauses.length > 0 ? Number((pauses.reduce((a, b) => a + b, 0) / pauses.length).toFixed(2)) : null,
    confidence_score: result.confidence || null,
    word_count: words.length
  };
}

module.exports = { extractSpeechMetrics };
