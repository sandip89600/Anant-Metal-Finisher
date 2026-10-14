const sanitize = require('sanitize-html');

const sanitizeHtmlContent = (dirty) => {
  if (!dirty) return '';
  return sanitize(dirty, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      '*': ['class', 'id']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      'a': sanitize.simpleTransform('a', { rel: 'noopener noreferrer' })
    }
  });
};

module.exports = sanitizeHtmlContent;
