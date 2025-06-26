function validateTitle(title, required = false) {
  if (required && !title) return 'Title is required';

  if (typeof title !== 'string') return 'Title must be a string';

  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0 || trimmedTitle.length > 255) {
    return 'Title must be between 1 and 255 characters long';
  }

  return null;
}

function validateTaskIds(beforeTaskId, afterTaskId) {
  if (
    (beforeTaskId !== undefined && isNaN(Number(beforeTaskId))) ||
    (afterTaskId !== undefined && isNaN(Number(afterTaskId)))
  ) {
    return 'beforeTaskId and afterTaskId must be valid numbers';
  }

  return null;
}

module.exports = {
  validateTitle,
  validateTaskIds,
};
