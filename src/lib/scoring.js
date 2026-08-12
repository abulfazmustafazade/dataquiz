import { genId, normalize, totalSeconds } from './utils';

// =====================================================================
// QUESTION FACTORY
// =====================================================================
export const createQuestion = (type) => {
  const base = { id: genId(), type, text: '', timeUnit: 'seconds', timeValue: 20 };
  switch (type) {
    case 'multiple_choice': return { ...base, options: ['', '', '', ''], correct: 0 };
    case 'true_false':      return { ...base, options: ['Hə', 'Yox'], correct: 0 };
    case 'multiple_select': return { ...base, options: ['', '', '', ''], correctIndices: [0] };
    case 'type_answer':     return { ...base, acceptableAnswers: [''] };
    case 'sorting':         return { ...base, items: ['', '', '', ''] };
    default: return { ...base, options: ['', '', '', ''], correct: 0 };
  }
};

// =====================================================================
// VALIDATION
// =====================================================================
export const validateQuestion = (q) => {
  if (!q.text?.trim()) return 'Sual mətni boş ola bilməz';
  if (!q.timeValue || q.timeValue <= 0) return 'Vaxt 0-dan böyük olmalıdır';
  switch (q.type) {
    case 'multiple_choice':
      if (!q.options || q.options.length < 2) return 'Ən azı 2 variant olmalıdır';
      if (q.options.some(o => !o.trim())) return 'Bütün variantları doldurun';
      if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) return 'Düzgün cavab seçin';
      break;
    case 'true_false':
      if (q.correct !== 0 && q.correct !== 1) return 'Düzgün cavab seçin';
      break;
    case 'multiple_select':
      if (!q.options || q.options.length < 2) return 'Ən azı 2 variant olmalıdır';
      if (q.options.some(o => !o.trim())) return 'Bütün variantları doldurun';
      if (!q.correctIndices?.length) return 'Ən azı bir düzgün cavab seçin';
      break;
    case 'type_answer': {
      const valid = (q.acceptableAnswers || []).filter(a => a && a.trim());
      if (valid.length === 0) return 'Ən azı bir düzgün cavab daxil edin';
      break;
    }
    case 'sorting':
      if (!q.items || q.items.length < 2) return 'Ən azı 2 element olmalıdır';
      if (q.items.some(i => !i.trim())) return 'Bütün elementləri doldurun';
      break;
    default: return 'Naməlum sual tipi';
  }
  return null;
};

// =====================================================================
// SCORING — single source of truth, used by BOTH host and player
// =====================================================================
// Returns { correct: bool, points: number, correctness: 0..1, details: {} }
export const scoreAnswer = (question, answer, answeredAt, questionStartedAt) => {
  // No answer at all
  if (!answer || answer.value === undefined || answer.value === null) {
    return { correct: false, points: 0, correctness: 0, details: { noAnswer: true } };
  }

  const total = totalSeconds(question);
  const elapsed = Math.max(0, (answeredAt - questionStartedAt) / 1000);
  // Speed factor: 1.0 if answered immediately, 0.5 if used full time
  const speedFactor = Math.max(0, Math.min(1, 1 - elapsed / total / 2));

  let correctness = 0;
  let details = {};

  switch (question.type) {
    case 'multiple_choice':
    case 'true_false': {
      correctness = Number(answer.value) === Number(question.correct) ? 1 : 0;
      break;
    }
    case 'multiple_select': {
      const correct = [...(question.correctIndices || [])].map(Number).sort((a, b) => a - b);
      const given = Array.isArray(answer.value)
        ? [...answer.value].map(Number).sort((a, b) => a - b)
        : [];
      const exactMatch = correct.length === given.length && correct.every((v, i) => v === given[i]);
      correctness = exactMatch ? 1 : 0;
      details = { correctSelected: given.filter(g => correct.includes(g)).length, wrongSelected: given.filter(g => !correct.includes(g)).length };
      break;
    }
    case 'type_answer': {
      const givenN = normalize(answer.value);
      const accept = (question.acceptableAnswers || []).filter(a => a && a.trim());
      correctness = accept.some(a => normalize(a) === givenN) ? 1 : 0;
      break;
    }
    case 'sorting': {
      const correctItems = question.items || [];
      const given = Array.isArray(answer.value) ? answer.value : [];
      let matches = 0;
      for (let i = 0; i < correctItems.length; i++) {
        if (given[i] !== undefined && given[i] === correctItems[i]) matches++;
      }
      correctness = correctItems.length ? matches / correctItems.length : 0;
      details = { matches, total: correctItems.length };
      break;
    }
    default:
      correctness = 0;
  }

  if (correctness === 0) {
    return { correct: false, points: 0, correctness: 0, details };
  }

  // Points: base 500 (50%) + up to 500 from speed (50% × speedFactor)
  // Multiplied by correctness (for partial credit on sorting)
  const points = Math.round(1000 * correctness * (0.5 + speedFactor * 0.5));

  return {
    correct: correctness >= 1, // strict: only fully correct counts as "correct"
    points,
    correctness,
    details,
  };
};
